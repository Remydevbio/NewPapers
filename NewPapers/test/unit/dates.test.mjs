import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeWindow, subtractMonths, normalizeDate, addDays } from '../../src/lib/dates.js';

const NOW = Date.parse('2026-10-23T09:00:00Z');

test('first run searches the last 2 months', () => {
  assert.deepEqual(computeWindow(null, NOW), { from: '2026-08-23', to: '2026-10-23', firstRun: true });
});

test('month arithmetic clamps to the end of shorter months', () => {
  assert.equal(subtractMonths('2026-04-30', 2), '2026-02-28');
  assert.equal(subtractMonths('2026-01-15', 2), '2025-11-15');
});

test('incremental window starts at the last check minus a 3-day overlap', () => {
  assert.deepEqual(computeWindow('2026-10-20T08:00:00.000Z', NOW), { from: '2026-10-17', to: '2026-10-23', firstRun: false });
  // Same day check: still overlaps.
  assert.equal(computeWindow('2026-10-23T07:00:00.000Z', NOW).from, '2026-10-20');
});

test('incremental window is capped at about a year', () => {
  const w = computeWindow('2024-01-01T00:00:00.000Z', NOW);
  assert.equal(w.from, addDays('2026-10-23', -366));
});

test('API date formats normalize to YYYY-MM-DD', () => {
  assert.equal(normalizeDate('2026/10/03 00:00'), '2026-10-03');
  assert.equal(normalizeDate('2026 Oct 28'), '2026-10-28');
  assert.equal(normalizeDate('2026 Oct'), '2026-10-01');
  assert.equal(normalizeDate('2026-09-21'), '2026-09-21');
  assert.equal(normalizeDate('2026-09-22T03:32:07Z'), '2026-09-22');
  assert.equal(normalizeDate(''), null);
});
