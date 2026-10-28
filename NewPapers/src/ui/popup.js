// Results UI, used both as the toolbar popup and as the startup window (?view=window).
import { browser, h, icon, initTheme, formatDate, formatWhen, send } from './common.js';
import { loadAll } from '../lib/store.js';
import { sortEntries } from '../lib/dedupe.js';
import { SOURCES } from '../lib/sources/index.js';
import { topicSourceEnabled } from '../lib/settings.js';
import { inToRead } from '../lib/engine.js';

const isWindow = new URLSearchParams(location.search).get('view') === 'window';
if (isWindow) document.body.classList.add('in-window');

const $ = (id) => document.getElementById(id);
let state = null;
let active = null;
const expanded = new Set();
const newIds = {}; // topicId -> Set of entry ids shown as new during this view
let confirmAll = null;
// Pseudo-topic id of the "To read" tab.
const TOREAD = '__toread';
// Selection mode: the list (topic id or TOREAD) whose cards show checkboxes, and the picked entry ids.
let selecting = null;
const picked = new Set();

const LS = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
};

function venueColor(v) {
  const n = (v.venue || '').toLowerCase();
  if (n.includes('biorxiv')) return 'var(--src-biorxiv)';
  if (n.includes('medrxiv')) return 'var(--src-medrxiv)';
  if (n.includes('arxiv')) return 'var(--src-arxiv)';
  if (v.kind === 'preprint') return 'var(--src-openalex)';
  return 'var(--src-journal)';
}

const badge = (label, color) => h('span', { class: 'badge', '--c': color, title: label }, h('span', {}, label));

function hash(s) {
  let x = 5381;
  for (let i = 0; i < s.length; i++) x = ((x << 5) + x + s.charCodeAt(i)) | 0;
  return (x >>> 0).toString(36);
}

function shortAuthors(authors) {
  if (!authors.length) return 'Unknown authors';
  return authors.length > 4 ? `${authors.slice(0, 3).join(', ')}, et al.` : authors.join(', ');
}

// Entries whose paper was opened from this list (per browser profile, last 500).
const opened = new Set(JSON.parse(LS.get('np-opened') || '[]'));
function markOpened(entryId) {
  if (!entryId || opened.has(entryId)) return;
  opened.add(entryId);
  LS.set('np-opened', JSON.stringify([...opened].slice(-500)));
  document.querySelectorAll(`.entry[data-id="${CSS.escape(entryId)}"]`).forEach((c) => c.classList.add('opened'));
}

let statusTimer;
function status(msg) {
  const el = $('status');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => el.classList.remove('show'), 1800);
}

function link(label, url, extra = {}) {
  const { entryId, noicon, ...attrs } = extra;
  return h('a', {
    href: url, target: '_blank', rel: 'noopener noreferrer', ...attrs,
    onclick: (e) => {
      markOpened(entryId);
      if (e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        e.preventDefault();
        send('openUrl', { url }).catch(() => {});
        if (state?.settings.openLinksInBackground) status('Opened in a background tab');
      }
    },
    onauxclick: (e) => { if (e.button === 1) markOpened(entryId); },
  }, label, noicon ? null : icon('ext'));
}

function entryLinks(e) {
  const out = [];
  const multi = e.versions.length > 1;
  for (const v of e.versions) {
    if (!v.url) continue;
    const label = multi ? (v.kind === 'preprint' ? 'Preprint' : 'Journal') : v.doi ? 'DOI' : 'Open';
    out.push(link(label, v.url, { 'aria-label': `${label}: ${v.venue}`, entryId: e.id }));
  }
  if (e.pmid) out.push(link('PubMed', `https://pubmed.ncbi.nlm.nih.gov/${e.pmid}/`, { entryId: e.id }));
  return out;
}

function savedItems(e) {
  return state.toRead.filter((t) => t.id === e.id || t.keys?.some((k) => e.keys?.includes(k)));
}

function renderEntry(e, topicId) {
  const isNew = newIds[topicId]?.has(e.id);
  const inList = topicId === TOREAD;
  const saved = inList || inToRead(state.toRead, e);
  const picking = selecting === topicId;
  const absId = `abs-${hash(e.id)}`;
  const open = expanded.has(e.id);
  const main = e.versions.find((v) => v.kind === 'article' && v.url) || e.versions.find((v) => v.url);
  const titleNode = main ? link(e.title, main.url, { noicon: true, entryId: e.id }) : document.createTextNode(e.title);
  const badges = e.versions.map((v) => badge(v.venue, venueColor(v)));
  if (e.sources.includes('pubmed') && !e.versions.some((v) => v.venue === 'PubMed')) badges.push(badge('PubMed', 'var(--src-pubmed)'));

  const wasOpened = opened.has(e.id);
  const short = e.title.slice(0, 60);
  const card = h('article', {
    class: `entry${isNew ? ' new' : ''}${wasOpened ? ' opened' : ''}${saved && !inList ? ' saved' : ''}${picking && picked.has(e.id) ? ' picked' : ''}`,
    'data-id': e.id, 'aria-label': `${isNew ? 'New: ' : ''}${wasOpened ? 'Opened: ' : ''}${saved && !inList ? 'To read: ' : ''}${e.title}`,
  },
    h('div', { class: 'e-top' },
      picking ? h('input', {
        class: 'e-pick', type: 'checkbox', 'aria-label': `Select “${short}”`, 'data-focus': `pick:${e.id}`,
        ...(picked.has(e.id) ? { checked: '' } : {}),
        onchange: (ev) => { if (ev.target.checked) picked.add(e.id); else picked.delete(e.id); card.classList.toggle('picked', ev.target.checked); renderTopicBar(); },
      }) : null,
      h('h3', { class: 'e-title' }, titleNode),
      inList || picking ? null : h('button', {
        class: 'btn btn-ghost btn-icon e-save', type: 'button', 'aria-pressed': String(saved), 'data-focus': `save:${e.id}`,
        'aria-label': saved ? `Remove “${short}” from To read` : `Add “${short}” to To read`, title: saved ? 'Remove from To read' : 'Add to To read',
        onclick: () => toggleToRead(topicId, e),
      }, icon('bookmark')),
      picking ? null : h('button', {
        class: 'btn btn-ghost btn-icon e-dismiss', type: 'button', 'data-focus': `dismiss:${e.id}`,
        'aria-label': inList ? `Remove “${short}” from To read` : `Dismiss “${short}”`, title: inList ? 'Remove from To read' : 'Dismiss',
        onclick: () => (inList ? removeFromList(e, card) : dismiss(topicId, e.id, card)),
      }, icon('x'))),
    h('p', { class: 'e-authors', title: e.authors.join(', ') }, shortAuthors(e.authors)),
    h('div', { class: 'e-meta' }, h('span', {}, formatDate(e.date)), badges,
      h('span', { class: 'toread-tag', title: 'In your To read list' }, icon('bookmark'), 'To read'),
      h('span', { class: 'opened-tag', title: 'You opened this paper' }, '✓ Opened'),
      inList && e.topicName ? h('span', { class: 'e-from' }, `from ${e.topicName}`) : null,
      h('span', { class: 'e-links' }, entryLinks(e))),
  );
  if (e.abstract) {
    const panel = h('div', { class: `abs${open ? ' open' : ''}`, id: absId }, h('div', {}, h('p', {}, e.abstract)));
    const toggle = h('button', {
      class: 'abs-toggle', type: 'button', 'aria-expanded': String(open), 'aria-controls': absId, 'data-focus': `abs:${e.id}`,
      onclick: () => {
        const now = !expanded.has(e.id);
        if (now) expanded.add(e.id); else expanded.delete(e.id);
        toggle.setAttribute('aria-expanded', String(now));
        panel.classList.toggle('open', now);
      },
    }, 'Abstract', icon('chev'));
    card.append(toggle, panel);
  }
  return card;
}

async function dismiss(topicId, entryId, card) {
  // Move focus to the next card's dismiss button (or the tab) for keyboard users.
  const next = card.nextElementSibling || card.previousElementSibling;
  const focusKey = next?.dataset.id ? `dismiss:${next.dataset.id}` : `tab:${topicId}`;
  card.classList.add('leaving');
  await new Promise((r) => setTimeout(r, 160));
  pendingFocus = focusKey;
  await send('dismiss', { topicId, entryId });
}

async function toggleToRead(topicId, e) {
  const items = savedItems(e);
  pendingFocus = `save:${e.id}`;
  if (items.length) {
    await send('removeToRead', { ids: items.map((t) => t.id) });
    status('Removed from To read');
  } else {
    await send('addToRead', { topicId, entryIds: [e.id] });
    status('Added to To read');
  }
}

async function removeFromList(e, card) {
  const next = card.nextElementSibling || card.previousElementSibling;
  card.classList.add('leaving');
  await new Promise((r) => setTimeout(r, 160));
  pendingFocus = next?.dataset.id ? `dismiss:${next.dataset.id}` : `tab:${TOREAD}`;
  await send('removeToRead', { ids: [e.id] });
}

function setSelecting(listId) {
  selecting = listId;
  picked.clear();
  confirmAll = null;
  pendingFocus = listId ? 'sel-all' : `select:${active}`;
  lastSig = null;
  render();
}

/** Apply a bulk action to the picked entries, then leave selection mode. */
async function bulk(action) {
  const ids = [...picked];
  if (!ids.length) return;
  const listId = selecting;
  let msg = '';
  if (action === 'dismiss') {
    const n = await send('dismissMany', { topicId: listId, entryIds: ids });
    msg = `Dismissed ${n} paper${n === 1 ? '' : 's'}`;
  } else if (action === 'save') {
    const n = await send('addToRead', { topicId: listId, entryIds: ids });
    msg = n ? `Added ${n} to To read` : 'Already in To read';
  } else if (action === 'unsave') {
    const n = await send('removeToRead', { ids });
    msg = `Removed ${n} from To read`;
  }
  selecting = null;
  picked.clear();
  pendingFocus = `select:${listId}`;
  lastSig = null;
  render();
  status(msg);
}

let pendingFocus = null;

function shortReason(m = '') {
  if (/timeout/i.test(m)) return 'timed out';
  if (/network|fetch/i.test(m)) return 'network error';
  if (/429/.test(m)) return 'rate limited';
  if (/HTTP 40[13]/.test(m)) return 'access refused, see History';
  const code = m.match(/HTTP (\d{3})/);
  if (code) return Number(code[1]) >= 500 ? `server error ${code[1]}` : `error ${code[1]}`;
  return m.slice(0, 60);
}

function renderBanner() {
  const slot = $('banner-slot');
  slot.replaceChildren();
  const run = state.meta.lastRun;
  const warnings = [...new Set((run?.warnings || []).map((w) => w.message))];
  if (!run || (!run.errors?.length && !warnings.length) || LS.get('np-banner-hidden') === String(run.at)) return;
  const bySource = new Map();
  const queryErrors = [];
  for (const e of run.errors) {
    if (e.source === 'query') { queryErrors.push(`the query of “${e.topic}” is invalid (${e.message})`); continue; }
    const name = e.label || e.source;
    if (!bySource.has(name)) bySource.set(name, shortReason(e.message));
  }
  const parts = [];
  if (bySource.size) parts.push(`Couldn't update from ${[...bySource].map(([n, r]) => `${n} (${r})`).join(', ')}. Showing saved results; it will be retried on the next start.`);
  if (queryErrors.length) parts.push(`Note: ${queryErrors.join('; ')}.`);
  parts.push(...warnings);
  const msg = run.offline
    ? 'You appear to be offline. Showing saved results; sources will be retried on the next start.'
    : parts.join(' ');
  slot.append(h('div', { class: 'banner', role: 'status' }, icon('warn'), h('p', {}, msg),
    h('button', { class: 'link', type: 'button', onclick: () => { LS.set('np-banner-hidden', String(run.at)); renderBanner(); } }, 'Hide')));
}

// ---------- check history ----------
const fmtStamp = (ms) => new Date(ms).toLocaleString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
const fmtDuration = (ms) => (ms < 1000 ? `${Math.max(0, Math.round(ms))} ms` : `${(ms / 1000).toFixed(ms < 10000 ? 1 : 0)} s`);
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
const TRIGGERS = { startup: 'Browser start', manual: 'Refresh now' };

function historyRuns() {
  const m = state.meta;
  const runs = m.history?.length ? m.history : m.lastRun ? [m.lastRun] : [];
  return runs;
}

function runSummary(run) {
  const lines = (run.report || []).flatMap((t) => t.sources);
  const failed = lines.filter((l) => !l.ok).length + (run.report || []).filter((t) => t.queryError).length;
  const warned = lines.filter((l) => l.ok && l.warnings?.length).length;
  const parts = [plural(run.added || 0, 'new paper')];
  if (run.report) parts.push(failed ? plural(failed, 'problem') : warned ? plural(warned, 'warning') : 'all sources OK');
  else if (!run.ok) parts.push(plural(run.errors?.length || 0, 'problem'));
  return { text: parts.join(' · '), level: failed || (!run.report && !run.ok) ? 'err' : warned ? 'warn' : 'ok' };
}

function renderSourceLine(l) {
  const level = !l.ok ? 'err' : l.warnings?.length ? 'warn' : 'ok';
  const msgs = [l.error, ...(l.warnings || [])].filter(Boolean);
  return h('li', { class: `hi-src ${level}` },
    h('span', { class: 'hi-mark' }, icon(level === 'ok' ? 'check' : level === 'warn' ? 'warn' : 'x'), h('span', { class: 'sr-only' }, level === 'ok' ? 'OK' : level === 'warn' ? 'Warning' : 'Failed')),
    h('span', { class: 'hi-name' }, l.label || l.source),
    h('span', { class: 'hi-res' }, l.ok ? `${plural(l.found, 'result')}` : 'failed'),
    h('span', { class: 'hi-win' }, `${formatDate(l.from)} – ${formatDate(l.to)} · ${fmtDuration(l.ms)}`),
    ...msgs.map((m) => h('span', { class: 'hi-msg' }, m)));
}

function renderRun(run, open) {
  const sum = runSummary(run);
  const body = run.report
    ? (run.report.length ? run.report.map((t) => h('div', { class: 'hi-topic' },
      h('div', { class: 'hi-topic-head' }, h('strong', {}, t.topic), t.queryError ? '' : h('span', {}, `+${t.added} new`)),
      t.queryError
        ? h('p', { class: 'hi-msg err' }, `Query not run: ${t.queryError}`)
        : h('ul', { class: 'hi-srcs' }, ...t.sources.map(renderSourceLine))))
      : [h('p', { class: 'hi-note' }, 'No topics were checked.')])
    : [h('p', { class: 'hi-note' }, 'Recorded before per-source details were kept.'),
      ...(run.errors || []).map((e) => h('p', { class: 'hi-msg err' }, `${e.label || e.source}${e.topic ? ` (${e.topic})` : ''}: ${e.message}`))];
  return h('details', { class: `hi-run ${sum.level}`, 'data-at': String(run.at), open },
    h('summary', {},
      h('span', { class: 'hi-when' }, fmtStamp(run.at)),
      h('span', { class: 'hi-sum' }, [TRIGGERS[run.trigger], run.partial ? 'some topics' : '', run.finishedAt ? fmtDuration(run.finishedAt - run.at) : '', sum.text].filter(Boolean).join(' · '))),
    ...body);
}

function renderHistory() {
  const panel = $('history');
  if (panel.hidden) return;
  const runs = historyRuns();
  const running = !!state.meta.running;
  // Keep the runs the user expanded or collapsed; the newest run starts open.
  const shown = new Map([...$('history-body').querySelectorAll('details[data-at]')].map((d) => [d.dataset.at, d.open]));
  $('history-body').replaceChildren(
    ...(running ? [h('p', { class: 'hi-note' }, 'A check is running now; it will appear here when it finishes.')] : []),
    ...(runs.length ? runs.map((r, i) => renderRun(r, shown.get(String(r.at)) ?? i === 0)) : [h('p', { class: 'hi-note' }, 'No checks yet. Use Refresh now.')]),
  );
}

function toggleHistory(show = $('history').hidden) {
  $('history').hidden = !show;
  $('history-btn').setAttribute('aria-expanded', String(show));
  if (show) {
    renderHistory();
    $('history-close').focus();
  } else {
    $('history-btn').focus();
  }
}

function renderHeader() {
  const running = !!state.meta.running && Date.now() - (state.meta.runStartedAt || 0) < 5 * 60 * 1000;
  const last = state.meta.lastRun?.finishedAt || state.meta.lastRun?.at;
  $('checked').textContent = running ? 'Checking for new papers…' : `Checked ${formatWhen(last)}`;
  const r = $('refresh');
  r.replaceChildren(icon('refresh', running ? 'icon spin' : 'icon'), running ? 'Checking…' : 'Refresh now');
  r.disabled = running;
}

function renderTabs() {
  const tabs = $('tabs');
  tabs.replaceChildren(...state.topics.map((t) => {
    const n = (state.entries[t.id] || []).length;
    return h('button', {
      class: 'tab', role: 'tab', type: 'button', id: `tab-${t.id}`, 'aria-selected': String(t.id === active),
      'aria-controls': 'list', tabindex: t.id === active ? '0' : '-1', 'data-focus': `tab:${t.id}`,
      onclick: () => selectTopic(t.id),
    }, t.name, h('span', { class: 'count', 'aria-label': `${n} unread` }, String(n)));
  }), h('button', {
    class: 'tab toread', role: 'tab', type: 'button', id: `tab-${TOREAD}`, 'aria-selected': String(active === TOREAD),
    'aria-controls': 'list', tabindex: active === TOREAD ? '0' : '-1', 'data-focus': `tab:${TOREAD}`,
    onclick: () => selectTopic(TOREAD),
  }, icon('bookmark'), 'To read', h('span', { class: 'count', 'aria-label': `${state.toRead.length} saved` }, String(state.toRead.length))));
  $('list').setAttribute('aria-labelledby', `tab-${active}`);
}

function currentEntries() {
  return active === TOREAD ? state.toRead : sortEntries(state.entries[active] || []);
}

function renderTopicBar() {
  const bar = $('topic-bar');
  const topic = state.topics.find((t) => t.id === active);
  const entries = currentEntries();
  if (!topic && active !== TOREAD) { bar.replaceChildren(); return; }
  if (selecting === active) {
    const ids = new Set(entries.map((e) => e.id));
    for (const id of [...picked]) if (!ids.has(id)) picked.delete(id);
    const n = picked.size;
    const all = h('input', { type: 'checkbox', 'data-focus': 'sel-all', 'aria-label': 'Select all', ...(n && n === entries.length ? { checked: '' } : {}) });
    all.indeterminate = n > 0 && n < entries.length;
    all.addEventListener('change', () => {
      picked.clear();
      if (all.checked) for (const e of entries) picked.add(e.id);
      pendingFocus = 'sel-all';
      lastSig = null;
      render();
    });
    const act = (label, action, ico, extra = '') => h('button', { class: `btn btn-sm ${extra}`, type: 'button', 'data-focus': `bulk:${action}`, disabled: n === 0, onclick: () => bulk(action) }, icon(ico), label);
    bar.replaceChildren(
      h('label', { class: 'sel-all' }, all, 'All'),
      h('span', { class: 'sel-count', 'aria-live': 'polite' }, `${n} selected`),
      ...(active === TOREAD
        ? [act('Remove', 'unsave', 'x')]
        : [act('To read', 'save', 'bookmark'), act('Dismiss', 'dismiss', 'x')]),
      h('button', { class: 'btn btn-sm btn-ghost', type: 'button', 'data-focus': 'sel-done', onclick: () => setSelecting(null) }, 'Done'),
    );
    return;
  }
  bar.replaceChildren(active === TOREAD
    ? h('span', { class: 'q plain' }, 'Kept even after you dismiss them from a topic.')
    : h('span', { class: 'q', title: topic.query }, topic.query));
  if (entries.length) {
    bar.append(h('button', { class: 'btn btn-sm btn-ghost', type: 'button', 'data-focus': `select:${active}`, title: 'Select several papers', onclick: () => setSelecting(active) }, icon('select'), 'Select'));
  }
  if (entries.length && topic) {
    const btn = h('button', { class: 'btn btn-sm btn-ghost', type: 'button', 'data-focus': `all:${topic.id}` }, icon('x'),
      confirmAll === topic.id ? `Confirm: dismiss ${entries.length}` : 'Dismiss all');
    btn.addEventListener('click', async () => {
      if (confirmAll !== topic.id) {
        confirmAll = topic.id;
        pendingFocus = `all:${topic.id}`;
        render();
        setTimeout(() => { if (confirmAll === topic.id) { confirmAll = null; render(); } }, 4000);
        return;
      }
      confirmAll = null;
      pendingFocus = `tab:${topic.id}`;
      await send('dismissAll', { topicId: topic.id });
    });
    bar.append(btn);
  }
}

function renderList() {
  const list = $('list');
  const topic = state.topics.find((t) => t.id === active);
  renderTopicBar();
  if (active === TOREAD) {
    list.replaceChildren(...(state.toRead.length
      ? state.toRead.map((e) => renderEntry(e, TOREAD))
      : [h('div', { class: 'empty' }, h('strong', {}, 'Nothing to read yet'),
        'Use the bookmark button on a paper to keep it here, even after you dismiss it from its topic.')]));
    return;
  }
  if (!topic) {
    list.replaceChildren(h('div', { class: 'empty' }, h('strong', {}, 'No topics yet'),
      'Add a topic with a search query to start following new papers.',
      h('div', {}, h('button', { class: 'btn btn-primary', type: 'button', onclick: () => browser.runtime.openOptionsPage() }, icon('plus'), 'Add a topic'))));
    return;
  }
  const entries = sortEntries(state.entries[topic.id] || []);
  const lc = state.lastChecked[topic.id]?.at;
  list.replaceChildren(...(entries.length
    ? entries.map((e) => renderEntry(e, topic.id))
    : [h('div', { class: 'empty' }, h('strong', {}, 'You’re all caught up'),
      lc ? `No new papers for “${topic.name}” since the last check.` : `“${topic.name}” has not been checked yet. Use Refresh now.`)]));
}

function renderFooter() {
  const total = state.topics.reduce((n, t) => n + (state.entries[t.id] || []).length, 0);
  $('foot-count').textContent = `${total} unread across ${state.topics.length} topic${state.topics.length === 1 ? '' : 's'}`;
  const topic = state.topics.find((t) => t.id === active);
  if (active === TOREAD) { $('foot-sources').textContent = `${state.toRead.length} to read`; return; }
  $('foot-sources').textContent = topic
    ? SOURCES.filter((s) => topicSourceEnabled(topic, state.settings, s.id)).map((s) => s.label.replace(/ \(.*\)/, '')).join(' · ')
    : '';
}

function render() {
  const focusKey = pendingFocus || document.activeElement?.dataset?.focus;
  pendingFocus = null;
  renderHeader();
  renderHistory();
  renderBanner();
  renderTabs();
  renderList();
  renderFooter();
  if (focusKey) document.querySelector(`[data-focus="${CSS.escape(focusKey)}"]`)?.focus();
}

function markNew(topicId) {
  if (topicId === TOREAD || newIds[topicId]) return;
  const unseen = (state.entries[topicId] || []).filter((e) => !e.seen);
  newIds[topicId] = new Set(unseen.map((e) => e.id));
  if (unseen.length) send('markSeen', { topicId }).catch(() => {});
}

function selectTopic(id) {
  active = id;
  confirmAll = null;
  selecting = null;
  picked.clear();
  LS.set('np-active-topic', id);
  markNew(id);
  pendingFocus = `tab:${id}`;
  lastSig = null;
  render();
}

let lastSig = null;
// Re-render only when something visible changed (not e.g. the "seen" flags).
function signature(s) {
  return JSON.stringify([
    s.topics, s.settings.sources, s.meta.running, s.meta.lastRun?.at, s.meta.lastRun?.finishedAt, s.toRead.map((t) => t.id),
    Object.fromEntries(Object.entries(s.entries).map(([k, l]) => [k, l.map((e) => [e.id, e.versions.length, e.abstract.length])])),
    Object.fromEntries(Object.entries(s.lastChecked).map(([k, v]) => [k, v.at])),
  ]);
}

async function reload() {
  state = await loadAll(browser.storage.local);
  if (active !== TOREAD && !state.topics.some((t) => t.id === active)) {
    const saved = LS.get('np-active-topic');
    active = saved === TOREAD || state.topics.some((t) => t.id === saved) ? saved : state.topics[0]?.id ?? null;
  }
  if (active) markNew(active);
  // Newly added entries during this view (e.g. after Refresh) are new too.
  for (const t of state.topics) {
    if (!newIds[t.id]) continue;
    for (const e of state.entries[t.id] || []) if (!e.seen) newIds[t.id].add(e.id);
  }
  const sig = signature(state) + active;
  if (sig === lastSig) return;
  lastSig = sig;
  render();
}

// Keyboard: arrows/Home/End move between topic tabs.
$('tabs').addEventListener('keydown', (ev) => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(ev.key)) return;
  const ids = [...state.topics.map((t) => t.id), TOREAD];
  let i = ids.indexOf(active);
  i = ev.key === 'Home' ? 0 : ev.key === 'End' ? ids.length - 1 : (i + (ev.key === 'ArrowRight' ? 1 : -1) + ids.length) % ids.length;
  ev.preventDefault();
  selectTopic(ids[i]);
});

$('logo').append(icon('doc', ''));
$('settings').append(icon('gear'));
$('settings').addEventListener('click', () => browser.runtime.openOptionsPage());
$('refresh').addEventListener('click', () => { send('refresh').catch(() => {}); });
$('history-btn').append(icon('clock'), 'History');
$('history-btn').addEventListener('click', () => toggleHistory());
$('history-close').append(icon('x'));
$('history-close').addEventListener('click', () => toggleHistory(false));
document.addEventListener('keydown', (ev) => {
  if (ev.key === 'Escape' && !$('history').hidden) { ev.preventDefault(); toggleHistory(false); return; }
  if (ev.key === 'Escape' && selecting) { ev.preventDefault(); setSelecting(null); }
});

let reloadTimer = null;
browser.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;
  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(reload, 60);
});
// Keep the "last checked" text fresh in a long-open window.
setInterval(() => state && renderHeader(), 60 * 1000);

initTheme().then(reload);
