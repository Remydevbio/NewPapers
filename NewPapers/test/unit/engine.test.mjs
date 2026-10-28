// Engine tests with fake sources and an in-memory storage area.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createEngine, HISTORY_RUNS, inToRead } from '../../src/lib/engine.js';
import { memoryArea, loadAll } from '../../src/lib/store.js';
import { rec } from './helpers.mjs';

const DAY = 864e5;
const T0 = Date.parse('2026-10-23T08:00:00Z');

function fakeSource(id, impl) {
  const calls = [];
  return {
    id, label: id.toUpperCase(), defaultEnabled: true, calls,
    async search(query, from, to) {
      calls.push({ query, from, to });
      return impl ? impl(calls.length, { query, from, to }) : [];
    },
  };
}

function setup({ topics, sources, settings = {} }) {
  const area = memoryArea({ topics, settings: { sources: Object.fromEntries(sources.map((s) => [s.id, true])), ...settings } });
  let clock = T0;
  const make = () => createEngine({ area, sources, now: () => clock });
  return { area, make, tick: (ms) => { clock += ms; } };
}

const topic = (id, query = 'GPR182', extra = {}) => ({ id, name: id, query, sources: {}, createdAt: 0, ...extra });

test('first run per topic uses a 2-month window; later runs are incremental with overlap', async () => {
  const s = fakeSource('a');
  const env = setup({ topics: [topic('t1')], sources: [s] });
  await env.make().check();
  assert.deepEqual(s.calls[0], { query: 'GPR182', from: '2026-08-23', to: '2026-10-23' });
  env.tick(2 * DAY);
  await env.make().check();
  assert.deepEqual(s.calls[1], { query: 'GPR182', from: '2026-10-20', to: '2026-10-25' });
});

test('a newly added topic gets its own first-run window', async () => {
  const s = fakeSource('a');
  const env = setup({ topics: [topic('t1')], sources: [s] });
  await env.make().check();
  env.tick(5 * DAY);
  await env.area.set({ topics: [topic('t1'), topic('t2', 'ACKR3')] });
  await env.make().check();
  const t2call = s.calls.find((c) => c.query === 'ACKR3');
  assert.equal(t2call.from, '2026-08-28');
  assert.equal(s.calls[1].from, '2026-10-20', 't1 stays incremental');
});

test('editing a query resets that topic to the first-run window', async () => {
  const s = fakeSource('a');
  const env = setup({ topics: [topic('t1')], sources: [s] });
  await env.make().check();
  env.tick(DAY);
  await env.area.set({ topics: [topic('t1', 'GPR182 OR ACKR5')] });
  await env.make().check();
  assert.equal(s.calls[1].from, '2026-08-24');
});

test('results merge across sources and runs; dismissal survives restarts', async () => {
  const A = rec({ doi: '10.1000/a', title: 'Paper A about the scavenger receptor GPR182' });
  const B = rec({ doi: '10.1000/b', title: 'Paper B about atypical chemokine receptors' });
  const C = rec({ doi: '10.1000/c', title: 'Paper C published later about chemokines' });
  const s1 = fakeSource('a', (n) => (n === 1 ? [A, B] : [A, B, C]));
  const s2 = fakeSource('b', () => [{ ...A, source: 'b', doi: 'https://doi.org/10.1000/A' }]);
  const env = setup({ topics: [topic('t1')], sources: [s1, s2] });

  let res = await env.make().check();
  assert.equal(res.added, 2);
  let st = await loadAll(env.area);
  assert.equal(st.entries.t1.length, 2);
  const a = st.entries.t1.find((e) => e.keys.includes('doi:10.1000/a'));
  assert.deepEqual(a.sources.sort(), ['b', 'europepmc'], 'one entry, found by both sources');

  // Dismiss A, then "restart" (new engine instance on the same storage).
  await env.make().dismiss('t1', a.id);
  env.tick(DAY);
  res = await env.make().check();
  st = await loadAll(env.area);
  assert.deepEqual(st.entries.t1.map((e) => e.keys[0]).sort(), ['doi:10.1000/b', 'doi:10.1000/c']);
  assert.equal(res.added, 1, 'only C is new; B is kept, A stays dismissed');
  assert.ok(st.dismissed.t1['doi:10.1000/a']);
});

test('dismiss all hides every current entry for good', async () => {
  const A = rec({ doi: '10.1000/a' });
  const s = fakeSource('a', () => [A]);
  const env = setup({ topics: [topic('t1')], sources: [s] });
  await env.make().check();
  await env.make().dismissAll('t1');
  env.tick(DAY);
  await env.make().check();
  assert.equal((await loadAll(env.area)).entries.t1.length, 0);
});

test('each run records a per-topic, per-source report and the last runs are kept', async () => {
  const ok = fakeSource('ok', () => [rec({ doi: '10.1000/a' }), rec({ doi: '10.1000/b', title: 'Another paper with a different title' })]);
  const bad = fakeSource('bad', () => { throw Object.assign(new Error('HTTP 503: Search service is temporarily unavailable'), { status: 503 }); });
  const env = setup({ topics: [topic('t1'), { ...topic('t2'), query: '((' }], sources: [ok, bad] });
  await env.make().check({ trigger: 'startup' });
  const run = (await loadAll(env.area)).meta.lastRun;
  assert.equal(run.trigger, 'startup');
  assert.equal(run.report.length, 2);
  const [t1, t2] = run.report;
  assert.equal(t1.added, 2);
  assert.deepEqual(t1.sources.map((l) => [l.source, l.ok, l.found]), [['ok', true, 2], ['bad', false, 0]]);
  assert.match(t1.sources[1].error, /temporarily unavailable/);
  assert.ok(t1.sources.every((l) => l.from && l.to && l.ms >= 0));
  assert.ok(t2.queryError);
  for (let i = 0; i < HISTORY_RUNS + 2; i++) { env.tick(1000); await env.make().check(); }
  const meta = (await loadAll(env.area)).meta;
  assert.equal(meta.history.length, HISTORY_RUNS);
  assert.equal(meta.history[0].at, meta.lastRun.at, 'newest first');
  assert.equal(meta.history[0].trigger, 'manual');
});

test('source warnings are recorded without failing the run', async () => {
  const warned = { id: 'w', label: 'W', defaultEnabled: true, async search(q, from, to, ctx) { ctx.warn('key rejected'); return [rec({ doi: '10.1000/w' })]; } };
  const env = setup({ topics: [topic('t1')], sources: [warned] });
  const res = await env.make().check();
  assert.equal(res.errors.length, 0);
  assert.deepEqual(res.warnings.map((w) => [w.source, w.label, w.message]), [['w', 'W', 'key rejected']]);
  const st = await loadAll(env.area);
  assert.equal(st.meta.lastRun.ok, true);
  assert.equal(st.meta.lastRun.warnings.length, 1);
  assert.equal(st.entries.t1.length, 1);
});

test('a failing source keeps the list, records the error and is retried from its old window', async () => {
  const ok = fakeSource('ok', () => [rec({ doi: '10.1000/ok' })]);
  let fail = false;
  const flaky = fakeSource('flaky', () => { if (fail) throw Object.assign(new Error('HTTP 503'), { status: 503 }); return [rec({ doi: '10.1000/f', title: 'Flaky source paper with a long title' })]; });
  const env = setup({ topics: [topic('t1')], sources: [ok, flaky] });
  await env.make().check();
  fail = true;
  env.tick(DAY);
  const res = await env.make().check();
  assert.equal(res.errors.length, 1);
  assert.equal(res.errors[0].source, 'flaky');
  const st = await loadAll(env.area);
  assert.equal(st.entries.t1.length, 2, 'existing entries kept');
  assert.equal(st.meta.lastRun.ok, false);
  assert.equal(st.meta.running, false);
  // Next start: the flaky source resumes from its last *successful* check.
  fail = false;
  env.tick(DAY);
  await env.make().check();
  assert.equal(flaky.calls[2].from, '2026-10-20');
  assert.equal(ok.calls[2].from, '2026-10-21');
});

test('offline: all sources fail → run marked offline, nothing lost', async () => {
  const s = fakeSource('a', (n) => { if (n > 1) throw Object.assign(new Error('Offline'), { offline: true }); return [rec()]; });
  const env = setup({ topics: [topic('t1')], sources: [s] });
  await env.make().check();
  env.tick(DAY);
  await env.make().check();
  const st = await loadAll(env.area);
  assert.equal(st.meta.lastRun.offline, true);
  assert.equal(st.entries.t1.length, 1);
});

test('per-topic source toggles override the global settings', async () => {
  const a = fakeSource('a');
  const b = fakeSource('b');
  const env = setup({
    topics: [topic('t1', 'x', { sources: { a: 'off' } }), topic('t2', 'y', { sources: { b: 'on' } })],
    sources: [a, b],
    settings: { sources: { a: true, b: false } },
  });
  await env.make().check();
  assert.deepEqual(a.calls.map((c) => c.query), ['y']);
  assert.deepEqual(b.calls.map((c) => c.query), ['y'], 't1 inherits b=off, t2 forces it on');
});

test('invalid query is reported and other topics still run', async () => {
  const s = fakeSource('a');
  const env = setup({ topics: [topic('bad', '(unclosed'), topic('good')], sources: [s] });
  const res = await env.make().check();
  assert.equal(res.errors[0].source, 'query');
  assert.equal(s.calls.length, 1);
});

test('deleted topics are pruned; checks requested during a run are queued, not dropped', async () => {
  const s = fakeSource('a', () => [rec()]);
  const env = setup({ topics: [topic('t1'), topic('t2', 'other'), topic('t3', 'third')], sources: [s] });
  const eng = env.make();
  await Promise.all([eng.check({ topicIds: ['t1'] }), eng.check({ topicIds: ['t2'] }), eng.check({ topicIds: ['t3'] })]);
  assert.deepEqual(s.calls.map((c) => c.query), ['GPR182', 'other', 'third'], 'queued requests coalesced into one follow-up run');
  await env.area.set({ topics: [topic('t2', 'other')] });
  await eng.prune();
  const st = await loadAll(env.area);
  assert.deepEqual(Object.keys(st.entries), ['t2']);
  assert.deepEqual(Object.keys(st.lastChecked), ['t2']);
});

test('markSeen clears the "new" flag only', async () => {
  const s = fakeSource('a', () => [rec()]);
  const env = setup({ topics: [topic('t1')], sources: [s] });
  await env.make().check();
  assert.equal((await loadAll(env.area)).entries.t1[0].seen, false);
  await env.make().markSeen('t1');
  const st = await loadAll(env.area);
  assert.equal(st.entries.t1[0].seen, true);
  assert.equal(st.entries.t1.length, 1);
});

test('to read: saved copies survive dismissal and are not duplicated', async () => {
  const s = fakeSource('a', () => [rec({ doi: '10.1000/a', title: 'First paper about receptors' }), rec({ doi: '10.1000/b', title: 'Second paper about chemokines' })]);
  const env = setup({ topics: [topic('t1')], sources: [s] });
  const eng = env.make();
  await eng.check();
  const [a, b] = (await loadAll(env.area)).entries.t1;
  assert.equal(await eng.addToRead('t1', [a.id]), 1);
  assert.equal(await eng.addToRead('t1', [a.id]), 0, 'already saved');
  await eng.dismiss('t1', a.id);
  let st = await loadAll(env.area);
  assert.equal(st.entries.t1.length, 1);
  assert.equal(st.toRead.length, 1, 'kept after dismissal');
  assert.equal(st.toRead[0].title, a.title);
  assert.equal(st.toRead[0].topicName, 't1');
  assert.ok(st.toRead[0].savedAt > 0);
  assert.ok(inToRead(st.toRead, { id: 'other', keys: a.keys }), 'matched by identity key');
  assert.ok(!inToRead(st.toRead, b));
  // A topic deleted later does not remove its saved papers.
  await env.area.set({ topics: [] });
  await eng.prune();
  st = await loadAll(env.area);
  assert.equal(st.toRead.length, 1);
  assert.equal(await eng.removeToRead([a.id]), 1);
  assert.equal((await loadAll(env.area)).toRead.length, 0);
});

test('dismissMany removes only the chosen entries and remembers them', async () => {
  const s = fakeSource('a', () => ['a', 'b', 'c'].map((x) => rec({ doi: `10.1000/${x}`, title: `Paper ${x} with a distinct and long title` })));
  const env = setup({ topics: [topic('t1')], sources: [s] });
  const eng = env.make();
  await eng.check();
  const list = (await loadAll(env.area)).entries.t1;
  assert.equal(await eng.dismissMany('t1', [list[0].id, list[2].id, 'missing']), 2);
  let st = await loadAll(env.area);
  assert.deepEqual(st.entries.t1.map((e) => e.id), [list[1].id]);
  env.tick(DAY);
  await eng.check();
  st = await loadAll(env.area);
  assert.deepEqual(st.entries.t1.map((e) => e.id), [list[1].id], 'dismissed papers do not come back');
  assert.equal(await eng.dismissMany('t1', []), 0);
});
