// storage.local layout:
//   topics:      [{ id, name, query, sources: {sourceId: 'default'|'on'|'off'}, createdAt }]
//   lastChecked: { [topicId]: { query, at, sources: { [sourceId]: ISO datetime } } }
//   entries:     { [topicId]: entry[] }        current, not dismissed
//   dismissed:   { [topicId]: { [key]: ms } }  set of dismissed identity keys
//   toRead:      entry[] + { topicId, topicName, savedAt }  saved copies, kept after dismissal
//   settings:    { theme, autoLight, autoDark, sources, email, ncbiApiKey, … }
//   meta:        { lastRun: { at, ok, errors[], warnings[], trigger, report[] }, history[] (last runs), running, windowId }
// `area` is browser.storage.local (or an in-memory fake in tests).
import { withDefaults } from './settings.js';

export const KEYS = ['topics', 'lastChecked', 'entries', 'dismissed', 'toRead', 'settings', 'meta'];

export async function loadAll(area) {
  const d = await area.get(KEYS);
  return {
    topics: Array.isArray(d.topics) ? d.topics : [],
    lastChecked: d.lastChecked || {},
    entries: d.entries || {},
    dismissed: d.dismissed || {},
    toRead: Array.isArray(d.toRead) ? d.toRead : [],
    settings: withDefaults(d.settings),
    meta: d.meta || {},
  };
}

export function saveParts(area, parts) {
  return area.set(parts);
}

/** In-memory storage area with the same get/set/remove API (tests). */
export function memoryArea(initial = {}) {
  const data = structuredClone(initial);
  return {
    data,
    async get(keys) {
      const ks = keys == null ? Object.keys(data) : Array.isArray(keys) ? keys : [keys];
      const out = {};
      for (const k of ks) if (k in data) out[k] = structuredClone(data[k]);
      return out;
    },
    async set(obj) {
      for (const [k, v] of Object.entries(obj)) data[k] = structuredClone(v);
    },
    async remove(keys) {
      for (const k of [].concat(keys)) delete data[k];
    },
  };
}

/** Simple async mutex so read-modify-write cycles don't interleave. */
export function createMutex() {
  let chain = Promise.resolve();
  return (fn) => {
    const run = chain.then(fn);
    chain = run.catch(() => {});
    return run;
  };
}
