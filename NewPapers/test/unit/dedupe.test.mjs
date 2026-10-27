import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeDoi, normalizeTitle, recordKeys, mergeRecords, capEntries, pruneDismissed } from '../../src/lib/dedupe.js';
import { rec } from './helpers.mjs';

test('DOI normalization', () => {
  assert.equal(normalizeDoi('https://doi.org/10.1158/0008-5472.CAN-25-5347'), '10.1158/0008-5472.can-25-5347');
  assert.equal(normalizeDoi('doi: 10.1101/2026.01.01.1.'), '10.1101/2026.01.01.1');
  assert.equal(normalizeDoi('http://dx.doi.org/10.1000%2Fabc'), '10.1000/abc');
  assert.equal(normalizeDoi('not a doi'), null);
  assert.equal(normalizeDoi(''), null);
});

test('title normalization ignores case, accents, punctuation and markup', () => {
  assert.equal(normalizeTitle('<i>GPR182</i> scavenges CXCL12 — in Mäuse!'), 'gpr182 scavenges cxcl12 in mause');
});

test('keys: DOI first, title+first author as fallback', () => {
  assert.deepEqual(recordKeys(rec({ doi: null, pmid: null })), ['title:a sufficiently long test title about chemokine receptors|smith']);
  assert.equal(recordKeys(rec())[0], 'doi:10.1101/2026.10.01.000001');
});

test('same DOI from different sources and case variants merges into one entry', () => {
  const a = rec({ source: 'europepmc', doi: '10.1000/ABC' });
  const b = rec({ source: 'openalex', doi: 'https://doi.org/10.1000/abc', title: 'Other wording entirely different here' });
  const { entries, added } = mergeRecords([], [a, b], {}, 1);
  assert.equal(added, 1);
  assert.equal(entries.length, 1);
  assert.deepEqual(entries[0].sources.sort(), ['europepmc', 'openalex']);
  assert.equal(entries[0].versions.length, 1);
});

test('without DOI: normalized title + first author dedupes', () => {
  const a = rec({ doi: null, title: 'Single-cell atlas of lymphatic endothelium.' });
  const b = rec({ doi: null, title: 'Single cell atlas of Lymphatic Endothelium', source: 'arxiv' });
  const c = rec({ doi: null, title: 'Single cell atlas of Lymphatic Endothelium', firstAuthorLast: 'Other' });
  const { entries } = mergeRecords([], [a, b, c], {}, 1);
  assert.equal(entries.length, 2, 'different first author stays separate');
});

test('preprint and published version become one entry with both links', () => {
  const pre = rec({ doi: '10.1101/2025.02.03.634329', relatedPmids: ['41874575'] });
  const pub = rec({ source: 'pubmed', kind: 'article', venue: 'J Clin Invest', doi: '10.1172/jci200857', pmid: '41874575', title: 'A sufficiently long test title about chemokine receptors (published)' });
  const { entries } = mergeRecords([], [pre, pub], {}, 1);
  assert.equal(entries.length, 1);
  const e = entries[0];
  assert.deepEqual(e.versions.map((v) => v.kind), ['preprint', 'article']);
  assert.deepEqual(e.versions.map((v) => v.url), ['https://doi.org/10.1101/2025.02.03.634329', 'https://doi.org/10.1172/jci200857']);
  assert.equal(e.title, pub.title, 'published title preferred');
  assert.equal(e.pmid, '41874575');
});

test('preprint/published matched by title + first author when no explicit link', () => {
  const pre = rec();
  const pub = rec({ source: 'openalex', kind: 'article', venue: 'Immunity', doi: '10.1016/j.immuni.2026.1' });
  const { entries } = mergeRecords([], [pre, pub], {}, 1);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].versions.length, 2);
});

test('a later record bridging two existing entries merges them', () => {
  const pre = rec({ doi: '10.1101/a', title: 'Preprint title that differs from the journal one' });
  const pub = rec({ doi: '10.1000/b', kind: 'article', title: 'Journal title that differs from the preprint one', firstAuthorLast: 'Smith' });
  const first = mergeRecords([], [pre, pub], {}, 1);
  assert.equal(first.entries.length, 2);
  const bridge = rec({ source: 'openalex', doi: '10.1000/b', relatedDois: ['10.1101/a'], kind: 'article' });
  const second = mergeRecords(first.entries, [bridge], {}, 2);
  assert.equal(second.entries.length, 1);
  assert.equal(second.added, 0);
});

test('dismissed keys suppress records and absorb their other identifiers', () => {
  const pre = rec();
  const first = mergeRecords([], [pre], {}, 1);
  const dismissed = Object.fromEntries(first.entries[0].keys.map((k) => [k, 1]));
  // Published version found later via title match → still hidden, its DOI is remembered.
  const pub = rec({ kind: 'article', doi: '10.1016/j.later.1', source: 'pubmed', pmid: '99' });
  const r = mergeRecords([], [pub], dismissed, 2);
  assert.equal(r.entries.length, 0);
  assert.ok(r.newDismissedKeys.includes('doi:10.1016/j.later.1'));
  assert.ok(r.newDismissedKeys.includes('pmid:99'));
});

test('capEntries keeps the newest and pruneDismissed drops keys older than a year', () => {
  const list = [1, 2, 3, 4].map((i) => ({ id: String(i), date: `2026-0${i}-01`, firstSeen: i }));
  assert.deepEqual(capEntries(list, 2).map((e) => e.id), ['4', '3']);
  const now = Date.UTC(2026, 9, 23);
  const old = now - 400 * 864e5;
  assert.deepEqual(pruneDismissed({ a: old, b: now - 864e5 }, now), { b: now - 864e5 });
});
