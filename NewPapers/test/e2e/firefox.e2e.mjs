// End-to-end test in the installed Firefox against the LIVE APIs, driven over WebDriver BiDi.
//   node test/e2e/firefox.e2e.mjs      (build + package first: npm run package)
// The packaged XPI is placed in a throwaway profile (unsigned add-ons are allowed by
// Firefox ESR/Developer/Nightly with xpinstall.signatures.required=false), so it
// survives a browser restart and runtime.onStartup can be tested.
// Env: FIREFOX_PATH, HEADED=1, KEEP_PROFILE=1
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, copyFile, rm, readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';
import { FIREFOX_PATH } from '../../scripts/paths.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const xpi = path.join(root, 'dist/packages', `new-papers-firefox-${pkg.version}.xpi`);
const ADDON_ID = 'new-papers@remydevbio';
const UUID = '6f3c2a1e-4b7d-4e8f-9a0b-1c2d3e4f5a6b';
const base = `moz-extension://${UUID}`;
const shots = path.join(root, 'test-results/firefox');
await mkdir(shots, { recursive: true });

const profile = await mkdtemp(path.join(os.tmpdir(), 'np-firefox-'));
await mkdir(path.join(profile, 'extensions'), { recursive: true });
await copyFile(xpi, path.join(profile, 'extensions', `${ADDON_ID}.xpi`));
const prefs = {
  'xpinstall.signatures.required': false,
  'extensions.autoDisableScopes': 0,
  'extensions.enabledScopes': 15,
  'extensions.webextensions.uuids': JSON.stringify({ [ADDON_ID]: UUID }),
  'browser.shell.checkDefaultBrowser': false,
  'browser.startup.homepage_override.mstone': 'ignore',
  'browser.aboutwelcome.enabled': false,
  'datareporting.policy.dataSubmissionEnabled': false,
  'toolkit.telemetry.reportingpolicy.firstRun': false,
  'browser.tabs.warnOnClose': false,
  'browser.sessionstore.resume_from_crash': false,
  'remote.prefs.recommended': true,
};
await writeFile(path.join(profile, 'user.js'), Object.entries(prefs).map(([k, v]) => `user_pref(${JSON.stringify(k)}, ${JSON.stringify(v)});`).join('\n'));

const results = [];
async function step(name, fn) {
  const t = Date.now();
  try {
    await fn();
    results.push({ name, ok: true });
    console.log(`  ✔ ${name} (${Date.now() - t} ms)`);
  } catch (e) {
    results.push({ name, ok: false, error: e.message });
    console.log(`  ✖ ${name}\n      ${String(e.message).split('\n').join('\n      ')}`);
  }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function waitFor(fn, { timeout = 90000, interval = 500, what = 'condition' } = {}) {
  const end = Date.now() + timeout;
  for (;;) {
    let v;
    try { v = await fn(); } catch (e) { v = null; if (Date.now() > end) throw e; }
    if (v) return v;
    if (Date.now() > end) throw new Error(`Timed out waiting for ${what}`);
    await sleep(interval);
  }
}

// ---------- minimal BiDi client ----------
let proc;
let ws;
let msgId = 0;
const pending = new Map();
const PORT = 9300 + Math.floor(Math.random() * 500);

async function startFirefox() {
  const args = ['--profile', profile, '--no-remote', `--remote-debugging-port=${PORT}`, '--remote-allow-system-access'];
  if (!process.env.HEADED) args.push('--headless');
  proc = spawn(FIREFOX_PATH, args, { stdio: ['ignore', 'ignore', 'pipe'] });
  proc.stderr.on('data', () => {});
  ws = await waitFor(() => new Promise((resolve) => {
    const s = new WebSocket(`ws://127.0.0.1:${PORT}/session`);
    s.onopen = () => resolve(s);
    s.onerror = () => resolve(null);
  }), { timeout: 30000, what: 'BiDi endpoint' });
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      const { resolve, reject } = pending.get(m.id);
      pending.delete(m.id);
      if (m.type === 'error') reject(new Error(`${m.error}: ${m.message}`));
      else resolve(m.result);
    }
  };
  await cmd('session.new', { capabilities: { alwaysMatch: { acceptInsecureCerts: true } } });
}

function cmd(method, params = {}) {
  const id = ++msgId;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    setTimeout(() => { if (pending.delete(id)) reject(new Error(`timeout: ${method}`)); }, 60000);
  });
}

async function stopFirefox() {
  try { await cmd('browser.close'); } catch { /* ignore */ }
  await new Promise((r) => { if (proc.exitCode != null) r(); else proc.once('exit', r); setTimeout(r, 10000); });
  ws?.close();
}

async function contexts() {
  const { contexts: list } = await cmd('browsingContext.getTree', {});
  return list;
}
const findCtx = async (part) => (await contexts()).find((c) => c.url.includes(part));

/** Evaluate an async function body in a browsing context, returning JSON-serializable data. */
async function run(ctx, body, ...args) {
  const r = await cmd('script.callFunction', {
    functionDeclaration: `async (...a) => JSON.stringify(await (async (${'...args'}) => { ${body} })(...a))`,
    arguments: args.map((v) => ({ type: 'string', value: JSON.stringify(v) })),
    target: { context: ctx },
    awaitPromise: true,
  });
  if (r.type === 'exception') throw new Error(`page error: ${r.exceptionDetails?.text}`);
  const v = r.result?.value;
  return v === undefined ? undefined : JSON.parse(v);
}
// args arrive JSON-encoded
const J = 'args = args.map((x) => JSON.parse(x));';

async function screenshot(ctx, name) {
  const { data } = await cmd('browsingContext.captureScreenshot', { context: ctx });
  await writeFile(path.join(shots, `${name}.png`), Buffer.from(data, 'base64'));
}

async function openTab(url) {
  const { context } = await cmd('browsingContext.create', { type: 'tab' });
  await cmd('browsingContext.navigate', { context, url, wait: 'complete' });
  return context;
}

const storage = (ctx) => run(ctx, 'return browser.storage.local.get(null);');

// ---------- the test ----------
console.log(`E2E (firefox ${FIREFOX_PATH}) with ${path.relative(root, xpi)}`);
await startFirefox();
let optCtx;
let popCtx;
let dismissedId;

await step('install: extension loads and opens the options page (no topics yet)', async () => {
  const c = await waitFor(() => findCtx(`${base}/options.html`), { timeout: 20000, what: 'options page' });
  optCtx = c.context;
  await waitFor(() => run(optCtx, 'return !!document.querySelector("#add-topic");'), { what: 'options UI' });
});

await step('options: add topics through the UI (live first-run search)', async () => {
  for (const [name, query] of [['GPR182', 'GPR182 OR ACKR5'], ['ACKRs', '"atypical chemokine receptor"']]) {
    await run(optCtx, `${J}
      document.querySelector('#add-topic').click();
      await new Promise((r) => setTimeout(r, 50));
      const set = (sel, v) => { const el = document.querySelector(sel); el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); };
      set('#f-name', args[0]); set('#f-query', args[1]);
      document.querySelector('form.edit button[type=submit]').click();
      await new Promise((r) => setTimeout(r, 200));`, name, query);
  }
  const st = await storage(optCtx);
  assert.equal(st.topics.length, 2);
});

await step('live APIs: both topics get results', async () => {
  const st = await waitFor(async () => {
    const s = await storage(optCtx);
    const ids = (s.topics || []).map((t) => t.id);
    return ids.length === 2 && ids.every((id) => s.lastChecked?.[id]?.at) && !s.meta?.running ? s : null;
  }, { timeout: 180000, what: 'first-run checks' });
  for (const t of st.topics) {
    const list = st.entries[t.id] || [];
    console.log(`      ${t.name}: ${list.length} entries; sources ${[...new Set(list.flatMap((e) => e.sources))].join(', ')}; errors ${JSON.stringify(st.meta.lastRun?.errors?.map((e) => `${e.source}: ${e.message}`) || [])}`);
    assert.ok(list.length > 0, `${t.name} has results`);
  }
});

await step('toolbar badge shows the unread total', async () => {
  const st = await storage(optCtx);
  const total = Object.values(st.entries).reduce((n, l) => n + l.length, 0);
  await waitFor(async () => (await run(optCtx, 'return browser.action.getBadgeText({});')) === String(total), { timeout: 5000, what: `badge ${total}` });
});

await step('popup UI renders tabs, entries, badges and links', async () => {
  popCtx = await openTab(`${base}/popup.html`);
  await cmd('browsingContext.setViewport', { context: popCtx, viewport: { width: 400, height: 600 } });
  const info = await waitFor(() => run(popCtx, `
    const e = document.querySelector('.entry');
    if (!e) return null;
    return { tabs: [...document.querySelectorAll('.tab')].map((t) => t.textContent), badge: !!e.querySelector('.badge'), link: e.querySelector('.e-links a')?.href };`), { what: 'entries' });
  assert.equal(info.tabs.length, 3, 'two topics + To read');
  assert.match(info.tabs[2], /To read/);
  assert.ok(info.badge);
  assert.match(info.link, /^https:\/\//);
  await run(popCtx, 'document.querySelector(".abs-toggle")?.click(); await new Promise((r) => setTimeout(r, 300));');
  await screenshot(popCtx, 'popup');
});

await step('links open in background tabs; the list keeps focus and marks the entry', async () => {
  const before = await run(popCtx, 'return (await browser.tabs.query({})).length;');
  await run(popCtx, 'document.querySelector(".entry .e-links a").click(); await new Promise((r) => setTimeout(r, 1500));');
  const r = await run(popCtx, `
    const tabs = await browser.tabs.query({});
    const active = (await browser.tabs.query({ active: true, currentWindow: true }))[0];
    return { count: tabs.length, active: active?.url, opened: !!document.querySelector('.entry.opened') };`);
  assert.equal(r.count, before + 1, 'one new tab');
  assert.match(r.active, /popup\.html/, 'list tab stays active');
  assert.ok(r.opened, 'entry marked as opened');
  await run(popCtx, 'const t = (await browser.tabs.query({ active: false })).filter((x) => /^https?:/.test(x.url)); await browser.tabs.remove(t.map((x) => x.id));');
});

await step('dismiss an entry; it is stored as dismissed', async () => {
  const st0 = await storage(popCtx);
  const tid = st0.topics[0].id;
  dismissedId = await run(popCtx, 'const e = document.querySelector(".entry"); e.querySelector(".e-dismiss").click(); return e.dataset.id;');
  await waitFor(async () => (await storage(popCtx)).dismissed?.[tid]?.[dismissedId], { timeout: 5000, what: 'dismiss stored' });
  const st = await storage(popCtx);
  assert.equal(st.entries[tid].length, st0.entries[tid].length - 1);
});

await step('dark theme applies', async () => {
  await run(popCtx, 'const { settings } = await browser.storage.local.get("settings"); await browser.storage.local.set({ settings: { ...(settings || {}), theme: "ocean-dark" } });');
  await waitFor(() => run(popCtx, 'return document.documentElement.dataset.theme === "ocean-dark";'), { timeout: 5000, what: 'theme' });
  await sleep(200);
  await screenshot(popCtx, 'popup-ocean-dark');
  await run(popCtx, 'const { settings } = await browser.storage.local.get("settings"); await browser.storage.local.set({ settings: { ...settings, theme: "auto" } });');
});

await step('options page renders (screenshot)', async () => {
  await cmd('browsingContext.navigate', { context: optCtx, url: `${base}/options.html`, wait: 'complete' });
  await waitFor(() => run(optCtx, 'return document.querySelectorAll(".trow").length === 2;'), { timeout: 5000, what: 'topic rows' });
  await screenshot(optCtx, 'options');
});

let before;
await step('restart: onStartup opens the results window and checks again', async () => {
  before = await storage(optCtx);
  await stopFirefox();
  await startFirefox();
  const win = await waitFor(() => findCtx('popup.html?view=window'), { timeout: 30000, what: 'results window' });
  const st = await waitFor(async () => {
    const s = await storage(win.context);
    return s.meta?.lastFullRun && !s.meta.running && s.topics.every((t) => s.lastChecked[t.id]?.at > before.lastChecked[t.id]?.at) ? s : null;
  }, { timeout: 180000, what: 'startup check' });
  await screenshot(win.context, 'startup-window');
  const tid = st.topics[0].id;
  assert.ok(!st.entries[tid].some((e) => e.id === dismissedId), 'dismissed entry stays hidden');
  console.log(`      window url: ${win.url}`);
});

await stopFirefox();
if (!process.env.KEEP_PROFILE) await rm(profile, { recursive: true, force: true });
void readdir;

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} steps passed (firefox). Screenshots: ${path.relative(root, shots)}`);
process.exit(failed.length ? 1 : 0);
