// Check engine: runs the enabled sources for each topic over the right date
// window, merges results into the stored entries and records failures.
// Independent of the browser APIs so it can be unit tested with a fake
// storage area and fetch.
import { SOURCES } from './sources/index.js';
import { computeWindow } from './dates.js';
import { mergeRecords, capEntries, pruneDismissed } from './dedupe.js';
import { loadAll, saveParts, createMutex } from './store.js';
import { topicSourceEnabled } from './settings.js';
import { validateQuery } from './query.js';

/** Number of past runs kept in meta.history for the check history view. */
export const HISTORY_RUNS = 10;

export function unreadCounts(state) {
  const counts = {};
  let total = 0;
  for (const t of state.topics) {
    counts[t.id] = (state.entries[t.id] || []).length;
    total += counts[t.id];
  }
  return { counts, total };
}

export function createEngine({ area, sources = SOURCES, fetchImpl, now = () => Date.now(), mutex = createMutex() } = {}) {
  let running = null;
  let queued = null;

  async function checkTopic(topic, state, errors, warnings, report) {
    const t = now();
    const prev = state.lastChecked[topic.id];
    const sameQuery = prev && prev.query === topic.query;
    try {
      validateQuery(topic.query);
    } catch (e) {
      errors.push({ topicId: topic.id, topic: topic.name, source: 'query', message: e.message });
      report.push({ topicId: topic.id, topic: topic.name, query: topic.query, queryError: e.message, sources: [] });
      return null;
    }
    const enabled = sources.filter((s) => topicSourceEnabled(topic, state.settings, s.id));
    const results = await Promise.all(enabled.map(async (src) => {
      const last = sameQuery ? prev.sources?.[src.id] : null;
      const win = computeWindow(last, t);
      const started = now();
      const srcWarnings = [];
      const line = (extra) => ({ source: src.id, label: src.label, from: win.from, to: win.to, ms: now() - started, warnings: srcWarnings, ...extra });
      try {
        const warn = (message) => {
          srcWarnings.push(message);
          warnings.push({ topicId: topic.id, topic: topic.name, source: src.id, label: src.label, message });
        };
        const records = await src.search(topic.query, win.from, win.to, { settings: state.settings, fetchImpl, warn });
        return { source: src.id, ok: true, records, window: win, line: line({ ok: true, found: records.length }) };
      } catch (e) {
        const message = e.message || String(e);
        errors.push({ topicId: topic.id, topic: topic.name, source: src.id, label: src.label, message, offline: !!e.offline });
        return { source: src.id, ok: false, records: [], window: win, line: line({ ok: false, found: 0, error: message }) };
      }
    }));
    const entry = { topicId: topic.id, topic: topic.name, query: topic.query, added: 0, sources: results.map((r) => r.line) };
    report.push(entry);
    return { topicId: topic.id, query: topic.query, results, at: t, report: entry };
  }

  /** Apply one topic's results to fresh storage state (inside the mutex). */
  async function applyResult(res) {
    return mutex(async () => {
      const state = await loadAll(area);
      const topic = state.topics.find((x) => x.id === res.topicId);
      if (!topic || topic.query !== res.query) return 0; // deleted or edited meanwhile
      const records = res.results.flatMap((r) => r.records);
      const dismissed = { ...(state.dismissed[topic.id] || {}) };
      const merged = mergeRecords(state.entries[topic.id] || [], records, dismissed, res.at);
      for (const k of merged.newDismissedKeys) dismissed[k] = res.at;

      const prev = state.lastChecked[topic.id];
      const lc = prev && prev.query === topic.query ? { ...prev, sources: { ...prev.sources } } : { query: topic.query, sources: {} };
      const iso = new Date(res.at).toISOString();
      let anyOk = false;
      for (const r of res.results) if (r.ok) { lc.sources[r.source] = iso; anyOk = true; }
      if (anyOk) lc.at = iso;

      state.entries[topic.id] = capEntries(merged.entries, state.settings.maxEntriesPerTopic);
      state.dismissed[topic.id] = dismissed;
      state.lastChecked[topic.id] = lc;
      await saveParts(area, { entries: state.entries, dismissed: state.dismissed, lastChecked: state.lastChecked });
      return merged.added;
    });
  }

  async function setMeta(patch) {
    return mutex(async () => {
      const { meta } = await loadAll(area);
      await saveParts(area, { meta: { ...meta, ...patch } });
    });
  }

  /** Remove state of deleted topics and dismissed keys older than a year. */
  async function prune() {
    return mutex(async () => {
      const state = await loadAll(area);
      const ids = new Set(state.topics.map((t) => t.id));
      const keep = (obj) => Object.fromEntries(Object.entries(obj).filter(([k]) => ids.has(k)));
      const dismissed = keep(state.dismissed);
      for (const k of Object.keys(dismissed)) dismissed[k] = pruneDismissed(dismissed[k], now());
      await saveParts(area, { entries: keep(state.entries), lastChecked: keep(state.lastChecked), dismissed });
    });
  }

  async function doCheck({ topicIds, trigger = 'manual' } = {}) {
    const startedAt = now();
    await setMeta({ running: true, runStartedAt: startedAt });
    const errors = [];
    const warnings = [];
    const report = [];
    let added = 0;
    try {
      await prune();
      const state = await loadAll(area);
      const topics = state.topics.filter((t) => !topicIds || topicIds.includes(t.id));
      for (const topic of topics) {
        const res = await checkTopic(topic, state, errors, warnings, report);
        if (res) {
          res.report.added = await applyResult(res);
          added += res.report.added;
        }
      }
    } finally {
      const offline = errors.length > 0 && errors.every((e) => e.offline);
      const lastRun = { at: startedAt, finishedAt: now(), ok: errors.length === 0, offline, errors, warnings, added, partial: !!topicIds, trigger, report };
      await mutex(async () => {
        const { meta } = await loadAll(area);
        const history = [lastRun, ...(meta.history || [])].slice(0, HISTORY_RUNS);
        await saveParts(area, { meta: { ...meta, running: false, lastRun, history, ...(topicIds ? {} : { lastFullRun: lastRun }) } });
      });
    }
    const state = await loadAll(area);
    return { added, errors, warnings, ...unreadCounts(state) };
  }

  return {
    /**
     * Check all topics (or the given ones). A call made while a run is in
     * progress is queued; queued calls are coalesced into one follow-up run.
     */
    check(opts = {}) {
      if (!running) {
        running = doCheck(opts).finally(() => { running = null; });
        return running;
      }
      const ids = opts.topicIds || null;
      if (!queued) {
        queued = { topicIds: ids, trigger: opts.trigger };
        queued.promise = running.catch(() => {}).then(() => {
          const q = queued;
          queued = null;
          return this.check({ topicIds: q.topicIds, trigger: q.trigger });
        });
      } else if (queued.topicIds) {
        queued.topicIds = ids ? [...new Set([...queued.topicIds, ...ids])] : null;
      }
      return queued.promise;
    },
    isRunning: () => !!running,

    dismiss(topicId, entryId) {
      return mutex(async () => {
        const state = await loadAll(area);
        const list = state.entries[topicId] || [];
        const entry = list.find((e) => e.id === entryId);
        if (!entry) return false;
        const d = { ...(state.dismissed[topicId] || {}) };
        for (const k of entry.keys) d[k] = now();
        state.entries[topicId] = list.filter((e) => e !== entry);
        state.dismissed[topicId] = d;
        await saveParts(area, { entries: state.entries, dismissed: state.dismissed });
        return true;
      });
    },

    dismissAll(topicId) {
      return mutex(async () => {
        const state = await loadAll(area);
        const d = { ...(state.dismissed[topicId] || {}) };
        for (const e of state.entries[topicId] || []) for (const k of e.keys) d[k] = now();
        state.entries[topicId] = [];
        state.dismissed[topicId] = d;
        await saveParts(area, { entries: state.entries, dismissed: state.dismissed });
      });
    },

    markSeen(topicId) {
      return mutex(async () => {
        const state = await loadAll(area);
        const list = state.entries[topicId] || [];
        if (!list.some((e) => !e.seen)) return;
        state.entries[topicId] = list.map((e) => ({ ...e, seen: true }));
        await saveParts(area, { entries: state.entries });
      });
    },

    prune,
  };
}
