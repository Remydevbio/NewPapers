// Adapter tests against recorded real API responses (scripts/record-fixtures.mjs).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadFixture, replayFetch, scriptedFetch } from './helpers.mjs';
import europepmc, { buildQuery as epmcQuery } from '../../src/lib/sources/europepmc.js';
import pubmed, { parseAbstracts } from '../../src/lib/sources/pubmed.js';
import openalex, { rebuildAbstract, cleanVenue, buildFilter } from '../../src/lib/sources/openalex.js';
import arxiv, { buildQuery as arxivQuery } from '../../src/lib/sources/arxiv.js';
import { SourceError, apiReason } from '../../src/lib/http.js';
import { SOURCES } from '../../src/lib/sources/index.js';

const ISO = /^\d{4}-\d{2}-\d{2}$/;

function checkRecords(records, source) {
  assert.ok(records.length > 0, `${source} returned records`);
  for (const r of records) {
    assert.equal(r.source, source);
    assert.ok(r.title && typeof r.title === 'string');
    assert.ok(Array.isArray(r.authors));
    assert.match(r.date, ISO);
    assert.ok(['preprint', 'article'].includes(r.kind));
    assert.ok(r.venue);
    assert.ok(/^https?:\/\//.test(r.url), r.url);
    assert.equal(typeof r.abstract, 'string');
    assert.ok(!/<[a-z]/i.test(r.title + r.abstract), 'no markup in text');
  }
}

test('every adapter implements the interface', () => {
  for (const s of SOURCES) {
    assert.equal(typeof s.id, 'string');
    assert.equal(typeof s.label, 'string');
    assert.equal(typeof s.search, 'function');
    assert.equal(typeof s.defaultEnabled, 'boolean');
  }
  assert.equal(SOURCES.find((s) => s.id === 'arxiv').defaultEnabled, false);
});

test('Europe PMC: query syntax, mapping of preprints', async () => {
  const fx = loadFixture('europepmc');
  assert.equal(epmcQuery('GPR182 OR "x y"', '2026-01-01', '2026-02-01'), '(GPR182 OR "x y") AND SRC:PPR AND FIRST_PDATE:[2026-01-01 TO 2026-02-01]');
  assert.equal(epmcQuery('a', '2026-01-01', '2026-02-01', 'all'), '(a) AND (SRC:PPR OR SRC:MED) AND FIRST_PDATE:[2026-01-01 TO 2026-02-01]');
  const f = replayFetch(fx);
  const recs = await europepmc.search(fx.plan.query, fx.plan.from, fx.plan.to, { fetchImpl: f, maxResults: fx.plan.max });
  checkRecords(recs, 'europepmc');
  const u = new URL(f.urls[0]);
  assert.match(u.searchParams.get('query'), /SRC:PPR AND FIRST_PDATE:\[2026-06-01 TO 2026-10-23\]/);
  assert.equal(u.searchParams.get('format'), 'json');
  assert.ok(recs.every((r) => r.kind === 'preprint'));
  assert.ok(recs.some((r) => r.venue === 'bioRxiv'));
  assert.ok(recs.every((r) => r.doi));
});

test('Europe PMC: "Preprint of" links become related PMIDs', async () => {
  const body = { hitCount: 1, resultList: { result: [{
    id: 'PPR1', source: 'PPR', title: 'T', doi: '10.1101/x', firstPublicationDate: '2025-02-07',
    bookOrReportDetails: { publisher: 'bioRxiv' }, authorList: { author: [{ fullName: 'Doe J', lastName: 'Doe' }] },
    commentCorrectionList: { commentCorrection: [{ source: 'MED', id: '41874575', type: 'Preprint of' }] },
  }] } };
  const recs = await europepmc.search('x', '2025-01-01', '2025-03-01', { fetchImpl: scriptedFetch(() => ({ body })) });
  assert.deepEqual(recs[0].relatedPmids, ['41874575']);
});

test('PubMed: esearch/esummary/efetch with edat window', async () => {
  const fx = loadFixture('pubmed');
  const f = replayFetch(fx);
  const recs = await pubmed.search(fx.plan.query, fx.plan.from, fx.plan.to, { fetchImpl: f, maxResults: fx.plan.max });
  checkRecords(recs, 'pubmed');
  const es = new URL(f.urls[0]);
  assert.equal(es.pathname, '/entrez/eutils/esearch.fcgi');
  assert.equal(es.searchParams.get('datetype'), 'edat');
  assert.equal(es.searchParams.get('mindate'), '2026/06/01');
  assert.equal(es.searchParams.get('maxdate'), '2026/10/23');
  assert.match(f.urls[1], /esummary\.fcgi/);
  assert.match(f.urls[2], /efetch\.fcgi/);
  assert.ok(recs.every((r) => /^\d+$/.test(r.pmid)));
  assert.ok(recs.some((r) => r.abstract.length > 50), 'abstracts merged from efetch');
  assert.ok(!recs.some((r) => /^Corrigendum/.test(r.title)), 'errata skipped');
});

test('PubMed: API key changes the rate limit and is sent', async () => {
  const f = scriptedFetch(() => ({ body: { esearchresult: { idlist: [] } } }));
  await pubmed.search('x', '2026-01-01', '2026-01-02', { fetchImpl: f, settings: { ncbiApiKey: 'abc123' } });
  assert.equal(new URL(f.urls[0]).searchParams.get('api_key'), 'abc123');
  assert.equal(pubmed.limiter.intervalMs, 110);
  await pubmed.search('x', '2026-01-01', '2026-01-02', { fetchImpl: f, settings: {} });
  assert.equal(pubmed.limiter.intervalMs, 350);
});

test('PubMed: structured abstracts keep their labels', () => {
  const xml = '<PubmedArticle><PMID Version="1">1</PMID><AbstractText Label="BACKGROUND">Bg &amp; more.</AbstractText><AbstractText Label="RESULTS">Res <i>x</i>.</AbstractText></PubmedArticle>';
  assert.deepEqual(parseAbstracts(xml), { 1: 'BACKGROUND: Bg & more.\nRESULTS: Res x.' });
});

test('PubMed: rate limit spacing is respected (3 requests/s)', async () => {
  const f = scriptedFetch(() => ({ body: { esearchresult: { idlist: [] } } }));
  const t0 = Date.now();
  await Promise.all([1, 2, 3, 4].map(() => pubmed.search('x', '2026-01-01', '2026-01-02', { fetchImpl: f })));
  assert.ok(Date.now() - t0 >= 3 * 340, 'four requests take at least ~1 s');
});

test('OpenAlex: filter syntax, abstract reconstruction, mailto', async () => {
  const fx = loadFixture('openalex');
  const f = replayFetch(fx);
  const recs = await openalex.search(fx.plan.query, fx.plan.from, fx.plan.to, { fetchImpl: f, maxResults: fx.plan.max, settings: { email: 'me@example.org' } });
  checkRecords(recs, 'openalex');
  const u = new URL(f.urls[0]);
  assert.match(u.searchParams.get('filter'), /^title_and_abstract\.search:.*,from_publication_date:2026-08-01,to_publication_date:2026-10-23,type:/);
  assert.equal(u.searchParams.get('mailto'), 'me@example.org');
  assert.ok(recs.some((r) => r.abstract.length > 50));
  assert.equal(rebuildAbstract({ world: [1], hello: [0] }), 'hello world');
  assert.equal(cleanVenue('bioRxiv (Cold Spring Harbor Laboratory)'), 'bioRxiv');
  assert.ok(!buildFilter('a, b', '2026-01-01', '2026-01-02').includes('a, b'), 'commas removed from search value');
});

test('arXiv: fully parenthesized query, q-bio categories, Atom parsing', async () => {
  const fx = loadFixture('arxiv');
  const q = arxivQuery('"protein folding" NOT membrane', '2026-09-01', '2026-10-23');
  assert.match(q, /^\(\(all:"protein folding" ANDNOT all:membrane\) AND \(cat:q-bio\.BM OR .*\)\) AND submittedDate:\[202609010000 TO 202610232359\]$/);
  const recs = await arxiv.search(fx.plan.query, fx.plan.from, fx.plan.to, { fetchImpl: replayFetch(fx), maxResults: fx.plan.max });
  checkRecords(recs, 'arxiv');
  assert.ok(recs.every((r) => r.arxivId && r.doi.startsWith('10.48550/arXiv.') && r.venue === 'arXiv'));
});

test('HTTP errors: retries on 503 then succeeds; 400 fails with SourceError', async () => {
  const f = scriptedFetch((url, n) => (n === 1 ? { status: 503, body: 'busy' } : { body: { resultList: { result: [] } } }));
  europepmc.limiter.intervalMs = 0;
  const recs = await europepmc.search('x', '2026-01-01', '2026-01-02', { fetchImpl: f });
  assert.deepEqual(recs, []);
  assert.equal(f.urls.length, 2);
  const bad = scriptedFetch(() => ({ status: 400, body: 'bad' }));
  await assert.rejects(europepmc.search('x', '2026-01-01', '2026-01-02', { fetchImpl: bad }), (e) => e instanceof SourceError && e.status === 400);
  europepmc.limiter.intervalMs = 200;
});

test('OpenAlex: a rejected API key falls back to keyless requests and warns', async () => {
  const f = scriptedFetch((url) => (new URL(url).searchParams.has('api_key')
    ? { status: 401, body: { error: 'Invalid or missing API key', message: 'API key not found. Get a free key at https://openalex.org/settings/api-key.' } }
    : { body: { meta: { next_cursor: null }, results: [] } }));
  const warnings = [];
  openalex.limiter.intervalMs = 0;
  const recs = await openalex.search('x', '2026-01-01', '2026-01-02', { fetchImpl: f, settings: { openalexApiKey: ' bad ' }, warn: (m) => warnings.push(m) });
  assert.deepEqual(recs, []);
  assert.equal(f.urls.length, 2, 'no retries on 401, one keyless request');
  assert.equal(new URL(f.urls[0]).searchParams.get('api_key'), 'bad');
  assert.ok(!new URL(f.urls[1]).searchParams.has('api_key'));
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /rejected the API key \(API key not found\)/);
  const noKey = scriptedFetch(() => ({ status: 401, body: '{}' }));
  await assert.rejects(openalex.search('x', '2026-01-01', '2026-01-02', { fetchImpl: noKey }), (e) => e instanceof SourceError && e.status === 401);
  openalex.limiter.intervalMs = 150;
});

test('HTTP errors carry the API reason from the body', async () => {
  assert.equal(apiReason('{"errCode":503,"errMsg":"Search service is temporarily unavailable. Please retry later."}'), 'Search service is temporarily unavailable');
  assert.equal(apiReason('{"error":"API key invalid","api-key":"x"}'), 'API key invalid');
  assert.equal(apiReason('<html><head><title>403 Forbidden</title></head><body>…</body></html>'), '403 Forbidden');
  const f = scriptedFetch(() => ({ status: 403, body: '<html><title>403 Forbidden</title></html>' }));
  europepmc.limiter.intervalMs = 0;
  await assert.rejects(europepmc.search('x', '2026-01-01', '2026-01-02', { fetchImpl: f }), (e) => e.status === 403 && e.message === 'HTTP 403: 403 Forbidden');
  europepmc.limiter.intervalMs = 200;
});

test('Network failure surfaces as SourceError after retries', async () => {
  const f = scriptedFetch(() => new TypeError('fetch failed'));
  openalex.limiter.intervalMs = 0;
  await assert.rejects(
    openalex.search('x', '2026-01-01', '2026-01-02', { fetchImpl: f }),
    (e) => e instanceof SourceError && /Network error/.test(e.message),
  );
  assert.equal(f.urls.length, 3);
  openalex.limiter.intervalMs = 150;
});
