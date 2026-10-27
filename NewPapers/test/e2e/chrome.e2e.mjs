// End-to-end test in Chrome for Testing (or Edge with BROWSER=msedge) against the LIVE APIs.
//   node test/e2e/chrome.e2e.mjs            (build first: npm run build)
// Env: CHROME_PATH, HEADED=1, BROWSER=msedge (Playwright channel), EXT=chrome|edge, KEEP_PROFILE=1
import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { mkdtemp, rm, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';
import { CHROME_PATH } from '../../scripts/paths.mjs';

process.env.PW_EXPERIMENTAL_SERVICE_WORKER_NETWORK_EVENTS = '1';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
// EXT=edge loads dist/edge (e.g. into Chrome for Testing when Edge itself is not installed).
const target = process.env.EXT || (process.env.BROWSER === 'msedge' ? 'edge' : 'chrome');
const extDir = path.join(root, 'dist', target);
const shots = path.join(root, 'test-results', target);
await mkdir(shots, { recursive: true });
const profile = await mkdtemp(path.join(os.tmpdir(), `np-${target}-`));

const results = [];
async function step(name, fn) {
  const t = Date.now();
  try {
    await fn();
    results.push({ name, ok: true });
    console.log(`  ✔ ${name} (${Date.now() - t} ms)`);
  } catch (e) {
    results.push({ name, ok: false, error: e.message });
    console.log(`  ✖ ${name}\n      ${e.message.split('\n').join('\n      ')}`);
  }
}

function launch() {
  return chromium.launchPersistentContext(profile, {
    ...(process.env.BROWSER === 'msedge' ? { channel: 'msedge' } : { executablePath: CHROME_PATH }),
    headless: !process.env.HEADED,
    viewport: { width: 1100, height: 800 },
    args: [`--disable-extensions-except=${extDir}`, `--load-extension=${extDir}`, '--no-first-run', '--no-default-browser-check'],
  });
}

async function serviceWorker(ctx) {
  return ctx.serviceWorkers()[0] || ctx.waitForEvent('serviceworker', { timeout: 15000 });
}

const storage = (sw) => sw.evaluate(() => chrome.storage.local.get(null));
async function waitFor(fn, { timeout = 90000, interval = 500, what = 'condition' } = {}) {
  const end = Date.now() + timeout;
  for (;;) {
    const v = await fn();
    if (v) return v;
    if (Date.now() > end) throw new Error(`Timed out waiting for ${what}`);
    await new Promise((r) => setTimeout(r, interval));
  }
}
const findPage = (ctx, part) => ctx.pages().find((p) => p.url().includes(part));

console.log(`E2E (${target}) with extension ${extDir}`);
let ctx = await launch();
let sw = await serviceWorker(ctx);
const extId = new URL(sw.url()).host;
const base = `chrome-extension://${extId}`;
let dismissedId = null;

await step('install: options page opens because there are no topics yet', async () => {
  const p = await waitFor(() => findPage(ctx, '/options.html'), { timeout: 15000, what: 'options page' });
  await p.waitForSelector('#add-topic');
});

await step('options: add two topics through the UI (live first-run search)', async () => {
  const p = findPage(ctx, '/options.html');
  for (const [name, query] of [['GPR182', 'GPR182 OR ACKR5'], ['ACKRs', '"atypical chemokine receptor"']]) {
    await p.click('#add-topic');
    await p.fill('#f-name', name);
    await p.fill('#f-query', query);
    await p.click('form.edit button[type=submit]');
    await p.waitForSelector(`.trow:has-text("${name}")`);
  }
  const st = await storage(sw);
  assert.equal(st.topics.length, 2);
});

await step('options: invalid query shows an error and is not saved', async () => {
  const p = findPage(ctx, '/options.html');
  await p.click('#add-topic');
  await p.fill('#f-name', 'Broken');
  await p.fill('#f-query', '(GPR182 OR');
  await p.click('form.edit button[type=submit]');
  const err = await p.textContent('#q-err');
  assert.match(err, /parenthesis/i);
  await p.click('form.edit button:has-text("Cancel")');
  assert.equal((await storage(sw)).topics.length, 2);
});

await step('live APIs: both topics get results (Europe PMC / PubMed / OpenAlex)', async () => {
  const st = await waitFor(async () => {
    const s = await storage(sw);
    const ids = (s.topics || []).map((t) => t.id);
    return ids.length === 2 && ids.every((id) => s.lastChecked?.[id]?.at) && !s.meta?.running ? s : null;
  }, { timeout: 180000, what: 'first-run checks' });
  for (const t of st.topics) {
    const list = st.entries[t.id] || [];
    console.log(`      ${t.name}: ${list.length} entries; sources ${[...new Set(list.flatMap((e) => e.sources))].join(', ')}; run errors: ${JSON.stringify(st.meta.lastRun?.errors?.map((e) => `${e.source}: ${e.message}`) || [])}`);
    assert.ok(list.length > 0, `${t.name} has results`);
  }
  const all = Object.values(st.entries).flat();
  assert.ok(all.some((e) => e.versions.some((v) => /biorxiv|medrxiv|research square/i.test(v.venue))), 'at least one preprint');
  assert.ok(all.some((e) => e.versions.some((v) => v.kind === 'article')), 'at least one journal article');
  const keys = all.flatMap((e) => e.keys.filter((k) => k.startsWith('doi:')));
  // Within a topic no DOI appears twice.
  for (const t of st.topics) {
    const k = (st.entries[t.id] || []).flatMap((e) => e.keys.filter((x) => x.startsWith('doi:')));
    assert.equal(new Set(k).size, k.length, `no duplicate DOIs in ${t.name}`);
  }
  assert.ok(keys.length > 0);
});

await step('toolbar badge shows the total unread count', async () => {
  const st = await storage(sw);
  const total = Object.values(st.entries).reduce((n, l) => n + l.length, 0);
  const text = await waitFor(async () => {
    const t = await sw.evaluate(() => chrome.action.getBadgeText({}));
    return t === String(total) ? t : null;
  }, { timeout: 5000, what: `badge "${total}"` });
  assert.equal(text, String(total));
});

let popup;
await step('popup UI: tabs with counts, entries with badges, links and abstracts', async () => {
  popup = await ctx.newPage();
  await popup.setViewportSize({ width: 400, height: 600 });
  await popup.goto(`${base}/popup.html`);
  await popup.waitForSelector('.entry');
  const tabs = await popup.$$eval('.tab', (els) => els.map((e) => e.textContent));
  assert.equal(tabs.length, 2);
  const st = await storage(sw);
  const first = st.topics[0];
  assert.match(tabs[0], new RegExp(`${first.name}\\s*${st.entries[first.id].length}`));
  const e = await popup.$('.entry');
  assert.ok(await e.$('.badge'), 'source badge');
  assert.ok(await e.$('.e-links a[href^="https://"]'), 'DOI/paper link');
  const toggle = await popup.$('.abs-toggle');
  if (toggle) {
    await toggle.click();
    assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
    await popup.waitForTimeout(300);
  }
  await popup.screenshot({ path: path.join(shots, 'popup-claude-light.png') });
});

await step('links open in background tabs; the list stays open and marks the entry as opened', async () => {
  const links = await popup.$$eval('.entry .e-links a', (as) => as.slice(0, 2).map((a) => a.href));
  const opened = [];
  for (let i = 0; i < 2; i++) {
    const [p] = await Promise.all([ctx.waitForEvent('page', { timeout: 10000 }), popup.locator('.entry .e-links a').nth(i).click()]);
    opened.push(p);
  }
  assert.ok(!popup.isClosed(), 'list still open');
  const active = await sw.evaluate(async () => (await chrome.tabs.query({ active: true, lastFocusedWindow: true }))[0]?.url || '');
  assert.match(active, /popup\.html/, 'the list keeps focus; papers open in background tabs');
  const inactive = await sw.evaluate(async () => (await chrome.tabs.query({ active: false })).length);
  assert.ok(inactive >= 2, `the ${opened.length} new tabs are in the background (inactive tabs: ${inactive})`);
  await popup.waitForSelector('.entry.opened .opened-tag');
  assert.ok(await popup.isVisible('.entry.opened .opened-tag'));
  await popup.waitForSelector('.status.show');
  await popup.screenshot({ path: path.join(shots, 'popup-opened.png') });
  // The marker survives reopening the list.
  await popup.reload();
  await popup.waitForSelector('.entry.opened');
  for (const p of opened) await p.close().catch(() => {});
  console.log(`      opened ${links.join(', ')}`);
});

await step('dismiss one entry: removed from the list and remembered', async () => {
  const st0 = await storage(sw);
  const tid = st0.topics[0].id;
  const n0 = st0.entries[tid].length;
  dismissedId = await popup.$eval('.entry', (e) => e.dataset.id);
  await popup.click('.entry .e-dismiss');
  await waitFor(async () => (await storage(sw)).entries[tid].length === n0 - 1, { timeout: 5000, what: 'dismiss' });
  const st = await storage(sw);
  assert.ok(st.dismissed[tid][dismissedId], 'dismissed key stored');
  await popup.waitForFunction((id) => !document.querySelector(`.entry[data-id="${CSS.escape(id)}"]`), dismissedId);
  const count = await popup.$eval('.tab[aria-selected=true] .count', (c) => c.textContent);
  assert.equal(count, String(n0 - 1));
});

await step('keyboard: tabs reachable, arrow keys switch topics, focus ring visible', async () => {
  await popup.focus('.tab[aria-selected=true]');
  await popup.keyboard.press('ArrowRight');
  const sel = await popup.$eval('.tab[aria-selected=true]', (t) => ({ text: t.textContent, focused: document.activeElement === t }));
  assert.ok(sel.focused, 'focus follows the selected tab');
  await popup.keyboard.press('Tab');
  await popup.keyboard.press('Tab');
  const outline = await popup.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
  assert.notEqual(outline, 'none', 'visible focus ring');
  await popup.keyboard.press('ArrowLeft');
});

await step('themes: all 8 themes apply (screenshots saved)', async () => {
  const st = await storage(sw);
  for (const theme of ['claude-light', 'slate-light', 'forest-light', 'hc-light', 'claude-dark', 'ocean-dark', 'dusk-dark', 'hc-dark']) {
    await sw.evaluate((t) => chrome.storage.local.get('settings').then(({ settings }) => chrome.storage.local.set({ settings: { ...settings, theme: t } })), theme);
    await popup.waitForFunction((t) => document.documentElement.dataset.theme === t, theme);
    await popup.waitForTimeout(150);
    await popup.screenshot({ path: path.join(shots, `popup-${theme}.png`) });
  }
  await sw.evaluate((s) => chrome.storage.local.set({ settings: { ...(s || {}), theme: 'auto' } }), st.settings);
});

await step('failure: blocked source shows a non-blocking error and keeps the list', async () => {
  await ctx.route(/api\.openalex\.org/, (r) => r.abort('internetdisconnected'));
  const before = await storage(sw);
  const n = Object.values(before.entries).flat().length;
  await popup.click('#refresh');
  await waitFor(async () => {
    const s = await storage(sw);
    return !s.meta.running && s.meta.lastRun?.at > (before.meta.lastRun?.at || 0) ? s : null;
  }, { timeout: 180000, what: 'refresh run' });
  const st = await storage(sw);
  assert.ok(st.meta.lastRun.errors.some((e) => e.source === 'openalex'), 'openalex error recorded');
  assert.ok(Object.values(st.entries).flat().length >= n, 'list kept');
  await popup.waitForSelector('.banner');
  const text = await popup.textContent('.banner');
  assert.match(text, /OpenAlex/);
  await popup.screenshot({ path: path.join(shots, 'popup-error-banner.png') });
  await ctx.unroute(/api\.openalex\.org/);
});

await step('history: button shows each run with per-source results, dates and the failure', async () => {
  await popup.click('#history-btn');
  await popup.waitForSelector('#history:not([hidden]) details.hi-run[open]');
  const runs = await popup.$$eval('details.hi-run', (d) => d.length);
  assert.ok(runs >= 2, `several runs listed (${runs})`);
  const first = await popup.textContent('details.hi-run[open]');
  assert.match(first, /Refresh now/);
  assert.match(first, /OpenAlex\s*failed/);
  assert.match(first, /Europe PMC|PubMed/);
  assert.ok(await popup.$('details.hi-run[open] .hi-src.err'), 'failed source marked');
  await popup.screenshot({ path: path.join(shots, 'popup-history.png') });
  await popup.keyboard.press('Escape');
  await popup.waitForSelector('#history', { state: 'hidden' });
  assert.equal(await popup.evaluate(() => document.activeElement?.id), 'history-btn');
});

let lastCheckedBefore;
await step('options page screenshot', async () => {
  const p = findPage(ctx, '/options.html');
  await p.reload();
  await p.waitForSelector('.trow');
  await p.screenshot({ path: path.join(shots, 'options.png'), fullPage: true });
  lastCheckedBefore = (await storage(sw)).lastChecked;
});

await ctx.close();

await step('restart: onStartup checks again and opens the results window', async () => {
  ctx = await launch();
  sw = await serviceWorker(ctx);
  const win = await waitFor(() => findPage(ctx, 'popup.html?view=window'), { timeout: 20000, what: 'results window' });
  await win.waitForSelector('.entry, .empty');
  await win.screenshot({ path: path.join(shots, 'startup-window.png') });
  const st = await waitFor(async () => {
    const s = await storage(sw);
    return s.meta?.lastFullRun && !s.meta.running && s.topics.every((t) => s.lastChecked[t.id]?.at > lastCheckedBefore[t.id]?.at) ? s : null;
  }, { timeout: 180000, what: 'startup check' });
  assert.ok(st.meta.lastFullRun.at);
});

await step('restart: dismissed entry stays hidden after a new search', async () => {
  const st = await storage(sw);
  const tid = st.topics[0].id;
  assert.ok(!st.entries[tid].some((e) => e.id === dismissedId), 'not back in the list');
  assert.ok(st.dismissed[tid][dismissedId]);
});

async function closeAllWindows() {
  await sw.evaluate(async () => {
    for (const w of await chrome.windows.getAll()) await chrome.windows.remove(w.id).catch(() => {});
  });
  await waitFor(async () => (await sw.evaluate(() => chrome.windows.getAll())).length === 0, { timeout: 5000, what: 'all windows closed' });
}

await step('background mode (Edge keeps running after the last window closes): reopening counts as a start', async () => {
  await closeAllWindows();
  await new Promise((r) => setTimeout(r, 300));
  const before = (await storage(sw)).meta.lastFullRun.at;
  await sw.evaluate(() => chrome.windows.create({ type: 'normal', url: 'about:blank' }));
  const win = await waitFor(() => findPage(ctx, 'popup.html?view=window'), { timeout: 20000, what: 'results window after reopen' });
  await win.waitForSelector('.entry, .empty');
  await waitFor(async () => (await storage(sw)).meta.lastFullRun?.at > before, { timeout: 180000, what: 'new check after reopen' });
  const type = await sw.evaluate(async () => (await chrome.windows.getAll()).map((w) => w.type).sort().join(','));
  assert.equal(type, 'normal,popup');
});

await step('startup boost (browser started without any window): window opens with the first browser window', async () => {
  await closeAllWindows();
  await sw.evaluate(() => chrome.storage.session.set({ flags: { pendingWindow: true, allClosed: false } }));
  await sw.evaluate(() => chrome.windows.create({ type: 'normal', url: 'about:blank' }));
  const win = await waitFor(() => findPage(ctx, 'popup.html?view=window'), { timeout: 20000, what: 'results window' });
  await win.waitForSelector('.entry, .empty');
  const flags = await sw.evaluate(() => chrome.storage.session.get('flags'));
  assert.equal(flags.flags.pendingWindow, false);
});

await step('dismiss all clears a topic for good', async () => {
  const win = findPage(ctx, 'popup.html?view=window');
  const st0 = await storage(sw);
  const tid = st0.topics[1].id;
  await win.click(`#tab-${tid}`);
  await win.click('#topic-bar button');
  await win.click('#topic-bar button'); // confirm
  await waitFor(async () => (await storage(sw)).entries[tid].length === 0, { timeout: 5000, what: 'dismiss all' });
  await win.waitForSelector('.empty');
});

await ctx.close();
if (!process.env.KEEP_PROFILE) await rm(profile, { recursive: true, force: true });

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} steps passed (${target}). Screenshots: ${path.relative(root, shots)}`);
process.exit(failed.length ? 1 : 0);
