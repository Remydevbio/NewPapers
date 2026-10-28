// Options page: topics, sources, startup behaviour, theme, import/export.
import { browser, h, icon, initTheme, formatWhen, send } from './common.js';
import { SOURCES } from '../lib/sources/index.js';
import { THEMES, withDefaults, makeTopic, topicSourceEnabled } from '../lib/settings.js';
import { validateQuery } from '../lib/query.js';
import { inToRead } from '../lib/engine.js';

const area = browser.storage.local;
const $ = (id) => document.getElementById(id);
const HOSTS = ['https://www.ebi.ac.uk/*', 'https://eutils.ncbi.nlm.nih.gov/*', 'https://api.openalex.org/*', 'https://export.arxiv.org/*'];

let topics = [];
let settings = withDefaults();
let entries = {};
let lastChecked = {};
let meta = {};
let editing = null; // topic id, or 'new'
let confirmDelete = null;

// ---------- helpers ----------
let toastTimer;
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

async function saveTopics(next, refreshIds = []) {
  topics = next;
  await area.set({ topics });
  renderTopics();
  if (refreshIds.length) send('refresh', { topicIds: refreshIds }).catch(() => {});
}

async function saveSettings(patch, msg = 'Saved') {
  settings = withDefaults({ ...settings, ...patch });
  await area.set({ settings });
  toast(msg);
}

// ---------- topics ----------
function sourceChips(topic) {
  return h('div', { class: 'mini-src', 'aria-label': 'Sources' }, SOURCES.map((s) => {
    const on = topicSourceEnabled(topic, settings, s.id);
    return h('span', { class: on ? '' : 'off', title: `${s.label}: ${on ? 'on' : 'off'}` }, s.label.replace(/ \(.*\)/, ''));
  }));
}

function topicRow(topic, i) {
  const n = (entries[topic.id] || []).length;
  const lc = lastChecked[topic.id];
  const checked = lc && lc.query === topic.query && lc.at ? `checked ${formatWhen(Date.parse(lc.at))}` : 'not checked yet';
  const row = h('div', { class: 'trow', draggable: 'true', 'data-id': topic.id },
    h('div', { class: 'grip' },
      h('span', { class: 'handle', title: 'Drag to reorder', 'aria-hidden': 'true' }, icon('grip')),
      h('span', { class: 'arrows' },
        h('button', { type: 'button', 'aria-label': `Move ${topic.name} up`, disabled: i === 0, onclick: () => move(i, -1), 'data-focus': `up:${topic.id}` }, icon('up')),
        h('button', { type: 'button', 'aria-label': `Move ${topic.name} down`, disabled: i === topics.length - 1, onclick: () => move(i, 1), 'data-focus': `down:${topic.id}` }, icon('down')))),
    h('div', { class: 'tinfo' },
      h('strong', {}, topic.name),
      h('code', { title: topic.query }, topic.query),
      h('span', { class: 'meta' }, `${n} unread · ${checked}`),
      sourceChips(topic)),
    confirmDelete === topic.id
      ? h('span', { class: 'confirm' }, `Delete “${topic.name}”?`,
        h('button', { class: 'btn btn-sm btn-danger', type: 'button', onclick: () => remove(topic.id), 'data-focus': `del-yes:${topic.id}` }, 'Delete'),
        h('button', { class: 'btn btn-sm', type: 'button', onclick: () => { confirmDelete = null; renderTopics(`del:${topic.id}`); } }, 'Cancel'))
      : [
        h('button', { class: 'btn btn-ghost btn-icon', type: 'button', 'aria-label': `Edit ${topic.name}`, 'aria-expanded': String(editing === topic.id), title: 'Edit', onclick: () => { editing = editing === topic.id ? null : topic.id; renderTopics(editing ? 'edit-name' : `edit:${topic.id}`); }, 'data-focus': `edit:${topic.id}` }, icon('edit')),
        h('button', { class: 'btn btn-ghost btn-icon btn-danger', type: 'button', 'aria-label': `Delete ${topic.name}`, title: 'Delete', onclick: () => { confirmDelete = topic.id; renderTopics(`del-yes:${topic.id}`); }, 'data-focus': `del:${topic.id}` }, icon('trash')),
      ]);
  addDrag(row);
  return row;
}

function editForm(topic) {
  const isNew = !topic;
  const draft = topic ? { ...topic, sources: { ...(topic.sources || {}) } } : { name: '', query: '', sources: {} };
  const err = h('span', { class: 'err', id: 'q-err', role: 'alert' });
  const name = h('input', { class: 'input', id: 'f-name', value: draft.name, 'data-focus': 'edit-name', autocomplete: 'off', placeholder: 'e.g. GPR182' });
  const query = h('input', { class: 'input mono', id: 'f-query', value: draft.query, autocomplete: 'off', spellcheck: 'false', 'aria-describedby': 'q-hint q-err', placeholder: 'GPR182 OR "atypical chemokine receptor"' });
  const check = () => {
    try { if (query.value.trim()) validateQuery(query.value); err.textContent = ''; query.removeAttribute('aria-invalid'); return true; } catch (e) { err.textContent = e.message; query.setAttribute('aria-invalid', 'true'); return false; }
  };
  query.addEventListener('input', check);
  const selects = SOURCES.map((s) => {
    const def = settings.sources[s.id] ? 'on' : 'off';
    const sel = h('select', { 'aria-label': `${s.label} for this topic`, 'data-src': s.id },
      h('option', { value: 'default' }, `Default (${def})`), h('option', { value: 'on' }, 'On'), h('option', { value: 'off' }, 'Off'));
    sel.value = draft.sources[s.id] || 'default';
    return h('span', { class: 'src' }, s.label, sel);
  });
  const save = async () => {
    const nm = name.value.trim();
    const q = query.value.trim();
    if (!nm) { name.setAttribute('aria-invalid', 'true'); name.focus(); return; }
    if (!q || !check()) { if (!q) err.textContent = 'Enter a search query.'; query.focus(); return; }
    const sources = {};
    form.querySelectorAll('select[data-src]').forEach((s) => { if (s.value !== 'default') sources[s.dataset.src] = s.value; });
    if (isNew) {
      const t = makeTopic(nm, q, sources);
      editing = null;
      await saveTopics([...topics, t], [t.id]);
      toast(`Added “${nm}”. Searching the last 2 months…`);
    } else {
      const queryChanged = topic.query !== q;
      const sourcesChanged = JSON.stringify(topic.sources || {}) !== JSON.stringify(sources);
      editing = null;
      await saveTopics(topics.map((t) => (t.id === topic.id ? { ...t, name: nm, query: q, sources } : t)), queryChanged || sourcesChanged ? [topic.id] : []);
      toast(queryChanged ? 'Saved. The new query searches the last 2 months.' : 'Saved');
    }
  };
  const form = h('form', { class: 'edit', onsubmit: (e) => { e.preventDefault(); save(); } },
    h('div', { class: 'field' }, h('label', { for: 'f-name' }, 'Name'), name),
    h('div', { class: 'field' }, h('label', { for: 'f-query' }, 'Search query'), query,
      h('span', { class: 'hint', id: 'q-hint' }, 'Use "quoted phrases", AND, OR, NOT (uppercase) and parentheses. Words next to each other are combined with AND.'), err),
    h('div', { class: 'field' }, h('span', { class: 'lbl' }, 'Sources for this topic'), h('div', { class: 'tri' }, selects)),
    h('div', { class: 'edit-actions' },
      h('button', { class: 'btn btn-sm', type: 'button', onclick: () => { editing = null; renderTopics(isNew ? null : `edit:${topic.id}`); } }, 'Cancel'),
      h('button', { class: 'btn btn-sm btn-primary', type: 'submit' }, isNew ? 'Add topic' : 'Save')));
  form.addEventListener('keydown', (e) => { if (e.key === 'Escape') { editing = null; renderTopics(isNew ? null : `edit:${topic.id}`); } });
  return form;
}

function renderTopics(focusKey) {
  const list = $('topic-list');
  const children = [];
  if (editing === 'new') children.push(editForm(null));
  topics.forEach((t, i) => {
    children.push(topicRow(t, i));
    if (editing === t.id) children.push(editForm(t));
  });
  if (!topics.length && editing !== 'new') {
    children.push(h('div', { class: 'empty-topics' }, 'No topics yet. Add one to start following new papers.'));
  }
  list.replaceChildren(...children);
  if (focusKey) list.querySelector(`[data-focus="${CSS.escape(focusKey)}"]`)?.focus();
}

async function move(i, d) {
  const j = i + d;
  if (j < 0 || j >= topics.length) return;
  const next = [...topics];
  [next[i], next[j]] = [next[j], next[i]];
  const id = topics[i].id;
  await saveTopics(next);
  renderTopics(`${d < 0 ? 'up' : 'down'}:${id}`);
  const btn = document.querySelector(`[data-focus="${d < 0 ? 'up' : 'down'}:${id}"]`);
  if (btn?.disabled) document.querySelector(`[data-focus="${d < 0 ? 'down' : 'up'}:${id}"]`)?.focus();
}

async function remove(id) {
  const t = topics.find((x) => x.id === id);
  confirmDelete = null;
  if (editing === id) editing = null;
  await saveTopics(topics.filter((x) => x.id !== id));
  send('prune').catch(() => {});
  toast(`Deleted “${t?.name}”`);
  $('add-topic').focus();
}

let dragId = null;
function addDrag(row) {
  row.addEventListener('dragstart', (e) => { dragId = row.dataset.id; row.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', dragId); });
  row.addEventListener('dragend', () => { dragId = null; document.querySelectorAll('.trow').forEach((r) => r.classList.remove('dragging', 'drop-before', 'drop-after')); });
  row.addEventListener('dragover', (e) => {
    if (!dragId || dragId === row.dataset.id) return;
    e.preventDefault();
    const after = e.offsetY > row.offsetHeight / 2;
    row.classList.toggle('drop-after', after);
    row.classList.toggle('drop-before', !after);
  });
  row.addEventListener('dragleave', () => row.classList.remove('drop-before', 'drop-after'));
  row.addEventListener('drop', async (e) => {
    e.preventDefault();
    const after = row.classList.contains('drop-after');
    row.classList.remove('drop-before', 'drop-after');
    if (!dragId || dragId === row.dataset.id) return;
    const moving = topics.find((t) => t.id === dragId);
    const rest = topics.filter((t) => t.id !== dragId);
    let idx = rest.findIndex((t) => t.id === row.dataset.id);
    if (after) idx++;
    rest.splice(idx, 0, moving);
    await saveTopics(rest);
  });
}

// ---------- sources ----------
function renderSources() {
  $('source-list').replaceChildren(...SOURCES.map((s) => {
    const sw = h('button', { class: 'switch', type: 'button', role: 'switch', 'aria-checked': String(!!settings.sources[s.id]), 'aria-label': s.label });
    sw.addEventListener('click', async () => {
      const on = sw.getAttribute('aria-checked') !== 'true';
      sw.setAttribute('aria-checked', String(on));
      await saveSettings({ sources: { ...settings.sources, [s.id]: on } }, `${s.label} ${on ? 'enabled' : 'disabled'}`);
      renderTopics();
    });
    return h('div', { class: 'srow' }, h('div', { class: 'tinfo' }, h('strong', {}, s.label), h('span', { class: 'meta' }, s.description)), sw);
  }));
  $('epmc-scope').value = settings.europepmcScope;
  $('email').value = settings.email;
  $('ncbi-key').value = settings.ncbiApiKey;
  $('openalex-key').value = settings.openalexApiKey;
}

function bindSourceFields() {
  $('epmc-scope').addEventListener('change', (e) => saveSettings({ europepmcScope: e.target.value }));
  const text = (id, key, validate) => $(id).addEventListener('change', (e) => {
    const v = e.target.value.trim();
    if (validate && v && !validate(v)) { e.target.setAttribute('aria-invalid', 'true'); toast('Please check this value'); return; }
    e.target.removeAttribute('aria-invalid');
    saveSettings({ [key]: v });
  });
  text('email', 'email', (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
  text('ncbi-key', 'ncbiApiKey', (v) => /^[A-Za-z0-9]+$/.test(v));
  text('openalex-key', 'openalexApiKey', (v) => /^[A-Za-z0-9_-]+$/.test(v));
}

// ---------- startup ----------
function renderStartup() {
  document.querySelectorAll('input[name="startup"]').forEach((r) => { r.checked = r.value === settings.openOnStartup; });
  document.querySelectorAll('input[name="links"]').forEach((r) => { r.checked = (r.value === 'background') === settings.openLinksInBackground; });
}

// ---------- appearance ----------
function renderThemes() {
  const items = [{ id: 'auto', name: 'Auto (system)' }, ...THEMES];
  const picker = $('theme-picker');
  picker.replaceChildren(...items.map((t) => {
    const checked = settings.theme === t.id;
    const sw = t.id === 'auto'
      ? h('i', { class: 'auto', 'aria-hidden': 'true' }, h('b', {}))
      : h('i', { 'aria-hidden': 'true' }, t.swatch.map((c) => h('b', { style: { background: c } })));
    return h('button', {
      class: 'tp', type: 'button', role: 'radio', 'aria-checked': String(checked), tabindex: checked ? '0' : '-1', 'data-theme-id': t.id,
      onclick: () => selectTheme(t.id),
    }, sw, t.name);
  }));
  for (const [id, mode, key] of [['auto-light', 'light', 'autoLight'], ['auto-dark', 'dark', 'autoDark']]) {
    const sel = $(id);
    sel.replaceChildren(...THEMES.filter((t) => t.mode === mode).map((t) => h('option', { value: t.id }, t.name)));
    sel.value = settings[key];
  }
}

async function selectTheme(id) {
  await saveSettings({ theme: id }, 'Theme updated');
  renderThemes();
  $('theme-picker').querySelector(`[data-theme-id="${id}"]`)?.focus();
}

$('theme-picker').addEventListener('keydown', (e) => {
  const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
  if (!keys.includes(e.key)) return;
  e.preventDefault();
  const ids = ['auto', ...THEMES.map((t) => t.id)];
  const i = ids.indexOf(settings.theme);
  const d = e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 1;
  selectTheme(ids[(i + d + ids.length) % ids.length]);
});
$('auto-light').addEventListener('change', (e) => saveSettings({ autoLight: e.target.value }));
$('auto-dark').addEventListener('change', (e) => saveSettings({ autoDark: e.target.value }));
document.querySelectorAll('input[name="startup"]').forEach((r) => r.addEventListener('change', () => saveSettings({ openOnStartup: r.value })));
document.querySelectorAll('input[name="links"]').forEach((r) => r.addEventListener('change', () => saveSettings({ openLinksInBackground: r.value === 'background' })));

// ---------- data ----------
function buildExport(topicsIn, settingsIn, includeKeys, toRead = []) {
  const s = { ...settingsIn };
  if (!includeKeys) { delete s.ncbiApiKey; delete s.openalexApiKey; }
  return { format: 'new-papers-export', version: 1, exportedAt: new Date().toISOString(), topics: topicsIn, settings: s, toRead };
}

/** Keep only well-formed saved papers from an import file. */
function validToRead(list) {
  if (!Array.isArray(list)) return [];
  return list.filter((t) => t && typeof t.id === 'string' && typeof t.title === 'string' && Array.isArray(t.keys) && Array.isArray(t.versions))
    .map((t) => ({ ...t, authors: Array.isArray(t.authors) ? t.authors : [], abstract: typeof t.abstract === 'string' ? t.abstract : '', sources: Array.isArray(t.sources) ? t.sources : [] }));
}

async function doExport() {
  const { toRead = [] } = await area.get('toRead');
  const data = buildExport(topics, settings, $('export-keys').checked, toRead);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = h('a', { href: url, download: `new-papers-${new Date().toISOString().slice(0, 10)}.json` });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast(`Exported ${topics.length} topics${toRead.length ? ` and ${toRead.length} to read` : ''}`);
}

async function doImport(file) {
  let data;
  try { data = JSON.parse(await file.text()); } catch { toast('That file is not valid JSON'); return; }
  if (data?.format !== 'new-papers-export' || !Array.isArray(data.topics)) { toast('Not a New Papers export file'); return; }
  const incoming = [];
  let invalid = 0;
  for (const t of data.topics) {
    if (typeof t?.name !== 'string' || typeof t?.query !== 'string' || !t.name.trim()) { invalid++; continue; }
    try { validateQuery(t.query); } catch { invalid++; continue; }
    const sources = {};
    for (const s of SOURCES) if (['on', 'off'].includes(t.sources?.[s.id])) sources[s.id] = t.sources[s.id];
    incoming.push({ id: typeof t.id === 'string' && /^[\w-]{1,64}$/.test(t.id) ? t.id : makeTopic('x', 'x').id, name: t.name.trim(), query: t.query.trim(), sources, createdAt: Number(t.createdAt) || Date.now() });
  }
  const byId = new Map(topics.map((t) => [t.id, t]));
  const changed = [];
  for (const t of incoming) {
    const prev = byId.get(t.id);
    if (!prev || prev.query !== t.query) changed.push(t.id);
    byId.set(t.id, t);
  }
  const s = data.settings && typeof data.settings === 'object' ? data.settings : {};
  const allowed = Object.keys(withDefaults());
  const patch = Object.fromEntries(Object.entries(s).filter(([k]) => allowed.includes(k)));
  settings = withDefaults({ ...settings, ...patch, sources: { ...settings.sources, ...(patch.sources || {}) } });
  await area.set({ settings });
  const { toRead = [] } = await area.get('toRead');
  const newSaved = validToRead(data.toRead).filter((t) => !inToRead(toRead, t));
  if (newSaved.length) await area.set({ toRead: [...toRead, ...newSaved] });
  await saveTopics([...byId.values()], changed);
  renderAll();
  toast(`Imported ${incoming.length} topics${newSaved.length ? ` and ${newSaved.length} to read` : ''}${invalid ? ` (${invalid} skipped as invalid)` : ''}`);
}

$('export').addEventListener('click', doExport);
$('import').addEventListener('click', () => $('import-file').click());
$('import-file').addEventListener('change', (e) => { const f = e.target.files?.[0]; if (f) doImport(f); e.target.value = ''; });
$('refresh-all').addEventListener('click', () => { send('refresh').catch(() => {}); toast('Checking all topics…'); });
$('open-window').addEventListener('click', () => send('openWindow'));

async function renderUsage() {
  const d = await area.get(['dismissed']);
  const nEntries = Object.values(entries).reduce((n, l) => n + l.length, 0);
  const nDismissed = Object.values(d.dismissed || {}).reduce((n, o) => n + Object.keys(o).length, 0);
  let bytes = null;
  try { bytes = await area.getBytesInUse?.(null); } catch { /* not supported */ }
  $('usage').textContent = `${nEntries} entries · ${nDismissed} dismissed IDs${bytes != null ? ` · ${Math.round(bytes / 1024)} KB used` : ''}`;
  const run = meta.lastRun;
  $('last-run').textContent = meta.running ? 'Checking now…' : run ? `Last check ${formatWhen(run.finishedAt || run.at)}${run.ok ? '' : ` · ${run.errors.length} problem${run.errors.length === 1 ? '' : 's'}`}` : '';
}

// ---------- permissions (Firefox lets users revoke host access) ----------
async function renderPermissions() {
  const slot = $('perm-banner');
  slot.replaceChildren();
  let ok = true;
  try { ok = await browser.permissions.contains({ origins: HOSTS }); } catch { ok = true; }
  if (ok) return;
  slot.append(h('div', { class: 'banner', role: 'alert' }, icon('warn'),
    h('p', {}, 'New Papers needs access to the literature APIs (Europe PMC, NCBI, OpenAlex, arXiv) to search for papers.'),
    h('button', { class: 'btn btn-sm btn-primary', type: 'button', onclick: async () => { if (await browser.permissions.request({ origins: HOSTS })) { renderPermissions(); send('refresh').catch(() => {}); } } }, 'Grant access')));
}

// ---------- nav highlighting ----------
const navLinks = [...document.querySelectorAll('[data-nav]')];
const obs = new IntersectionObserver((items) => {
  for (const it of items) {
    if (it.isIntersecting) navLinks.forEach((a) => a.setAttribute('aria-current', String(a.dataset.nav === it.target.id)));
  }
}, { rootMargin: '-10% 0px -70% 0px' });
document.querySelectorAll('.op-sec').forEach((s) => obs.observe(s));

// ---------- init ----------
function renderAll() {
  renderTopics();
  renderSources();
  renderStartup();
  renderThemes();
  renderUsage();
}

async function load() {
  const d = await area.get(['topics', 'settings', 'entries', 'lastChecked', 'meta']);
  topics = Array.isArray(d.topics) ? d.topics : [];
  settings = withDefaults(d.settings);
  entries = d.entries || {};
  lastChecked = d.lastChecked || {};
  meta = d.meta || {};
}

document.querySelectorAll('[data-icon]').forEach((el) => el.replaceWith(icon(el.dataset.icon)));
$('logo').append(icon('doc', ''));
$('add-topic').addEventListener('click', () => { editing = 'new'; confirmDelete = null; renderTopics('edit-name'); });
bindSourceFields();

browser.storage.onChanged.addListener(async (changes, name) => {
  if (name !== 'local') return;
  if (changes.entries || changes.lastChecked || changes.meta) {
    await load();
    if (!editing) renderTopics();
    renderUsage();
  }
});

initTheme().then(load).then(() => { renderAll(); renderPermissions(); if (location.hash === '#add') $('add-topic').click(); });
