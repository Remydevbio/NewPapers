// Background (Chrome/Edge service worker, Firefox event page).
// - On browser start (and once after install): check all topics, open the
//   results window, update the toolbar badge.
// - Owns every write to entries/dismissed/lastChecked; the UI sends messages.
import browser from 'webextension-polyfill';
import { createEngine, unreadCounts } from '../lib/engine.js';
import { loadAll } from '../lib/store.js';
import { THEMES, resolveTheme } from '../lib/settings.js';

const area = browser.storage.local;
const engine = createEngine({ area });
const STALE_RUN_MS = 5 * 60 * 1000;

const prefersDark = () => {
  try { return !!globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches; } catch { return false; }
};

async function updateBadge() {
  const state = await loadAll(area);
  const { total } = unreadCounts(state);
  const theme = THEMES.find((t) => t.id === resolveTheme(state.settings, prefersDark())) || THEMES[0];
  await browser.action.setBadgeText({ text: total ? (total > 999 ? '999+' : String(total)) : '' });
  await browser.action.setBadgeBackgroundColor({ color: theme.badge });
  if (browser.action.setBadgeTextColor) {
    await browser.action.setBadgeTextColor({ color: theme.badgeText || '#FFFFFF' }).catch(() => {});
  }
  await browser.action.setTitle({ title: total ? `New Papers: ${total} unread` : 'New Papers' });
}

/** Open (or focus) the small results window. */
async function openResultsWindow() {
  await setFlags({ pendingWindow: false });
  const { meta = {} } = await area.get('meta');
  if (meta.windowId != null) {
    try {
      await browser.windows.get(meta.windowId);
      await browser.windows.update(meta.windowId, { focused: true });
      return meta.windowId;
    } catch { /* closed */ }
  }
  const win = await browser.windows.create({
    url: browser.runtime.getURL('popup.html?view=window'),
    type: 'popup',
    width: 440,
    height: 720,
    focused: true,
  });
  const { meta: m2 = {} } = await area.get('meta');
  await area.set({ meta: { ...m2, windowId: win.id } });
  return win.id;
}

/**
 * Open a link in a normal browser window (also when called from the popup-type
 * results window). By default the tab opens in the background without moving
 * focus: browsers close the toolbar popup as soon as it loses focus, and a
 * focused browser window would cover the results window.
 */
async function openUrl(url) {
  if (!/^https?:\/\//i.test(url)) return;
  const { settings } = await loadAll(area);
  const background = settings.openLinksInBackground;
  const wins = await browser.windows.getAll({ windowTypes: ['normal'] });
  const target = wins.find((w) => w.focused) || wins[wins.length - 1];
  if (!target) {
    await browser.windows.create({ url, type: 'normal', focused: !background });
    return;
  }
  await browser.tabs.create({ windowId: target.id, url, active: !background });
  if (!background) await browser.windows.update(target.id, { focused: true });
}

async function clearStaleRun() {
  const { meta = {} } = await area.get('meta');
  if (meta.running && (!meta.runStartedAt || Date.now() - meta.runStartedAt > STALE_RUN_MS) && !engine.isRunning()) {
    await area.set({ meta: { ...meta, running: false } });
  }
}

// Session flags live in storage.session: they survive the service worker being
// stopped but are cleared when the browser process really exits.
const session = browser.storage.session;
const getFlags = async () => (session ? (await session.get('flags')).flags || {} : {});
const setFlags = async (patch) => { if (session) await session.set({ flags: { ...(await getFlags()), ...patch } }); };
const normalWindows = () => browser.windows.getAll({ windowTypes: ['normal'] }).catch(() => []);
const WINDOW_DELAY_MS = 1500;

/**
 * Show the results window once a normal browser window exists. At a real start
 * the browser may still be restoring tabs, so wait a moment and focus it so it
 * does not end up behind the main window. With Edge "Startup boost" the browser
 * starts without any window: the window is then opened when the user first
 * opens Edge.
 */
async function showWindowWhenReady() {
  if (!(await normalWindows()).length) {
    await setFlags({ pendingWindow: true });
    return;
  }
  await new Promise((r) => setTimeout(r, WINDOW_DELAY_MS));
  await openResultsWindow().catch((e) => console.warn('window', e));
}

async function onBrowserStart(reason) {
  await clearStaleRun();
  await setFlags({ started: true, allClosed: false });
  const state = await loadAll(area);
  if (!state.topics.length) {
    if (reason === 'install') await browser.runtime.openOptionsPage();
    await updateBadge();
    return;
  }
  const mode = state.settings.openOnStartup;
  const opening = mode === 'always' ? showWindowWhenReady() : Promise.resolve();
  const res = await engine.check({ trigger: 'startup' });
  await opening;
  if (mode === 'new' && res.added > 0) await showWindowWhenReady();
  await updateBadge();
}

browser.runtime.onStartup.addListener(() => { onBrowserStart('startup'); });
browser.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') onBrowserStart('install');
  else updateBadge();
});

// Edge (and Chrome with "continue running in background") can keep the browser
// process alive after the last window is closed; reopening it then does not fire
// runtime.onStartup. Treat "first normal window after all were closed" as a start.
browser.windows.onCreated.addListener(async (win) => {
  if (win.type && win.type !== 'normal') return;
  const flags = await getFlags();
  if (flags.pendingWindow) {
    await setFlags({ pendingWindow: false });
    await new Promise((r) => setTimeout(r, WINDOW_DELAY_MS));
    await openResultsWindow().catch((e) => console.warn('window', e));
  } else if (flags.allClosed) {
    await onBrowserStart('resume');
  }
});

browser.windows.onRemoved.addListener(async (id) => {
  const { meta = {} } = await area.get('meta');
  if (meta.windowId === id) await area.set({ meta: { ...meta, windowId: null } });
  if (!(await normalWindows()).length) await setFlags({ allClosed: true });
});

let badgeTimer = null;
browser.storage.onChanged.addListener((changes, name) => {
  if (name !== 'local' || !(changes.entries || changes.settings || changes.topics)) return;
  clearTimeout(badgeTimer);
  badgeTimer = setTimeout(() => updateBadge().catch(() => {}), 150);
});

browser.runtime.onMessage.addListener((msg, sender) => {
  // Only accept messages from our own pages.
  if (sender.id !== browser.runtime.id) return undefined;
  switch (msg?.type) {
    case 'refresh': return engine.check({ topicIds: msg.topicIds, trigger: 'manual' });
    case 'dismiss': return engine.dismiss(msg.topicId, msg.entryId);
    case 'dismissAll': return engine.dismissAll(msg.topicId);
    case 'dismissMany': return engine.dismissMany(msg.topicId, msg.entryIds);
    case 'addToRead': return engine.addToRead(msg.topicId, msg.entryIds);
    case 'removeToRead': return engine.removeToRead(msg.ids);
    case 'markSeen': return engine.markSeen(msg.topicId);
    case 'openWindow': return openResultsWindow();
    case 'openUrl': return openUrl(msg.url);
    case 'prune': return engine.prune();
    case 'simulateStartup': return onBrowserStart('startup'); // used by tests and the options page
    default: return undefined;
  }
});

clearStaleRun().catch(() => {});
