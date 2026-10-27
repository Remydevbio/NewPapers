import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'fixtures');

export function loadFixture(id) {
  return JSON.parse(readFileSync(path.join(dir, `${id}.json`), 'utf8'));
}

/** fetch replacement that replays recorded calls in order and logs requested URLs. */
export function replayFetch(fixture) {
  let i = 0;
  const urls = [];
  const fn = async (url) => {
    urls.push(String(url));
    const call = fixture.calls[i++];
    if (!call) throw new Error(`No recorded response for ${url}`);
    return new Response(call.body, { status: call.status });
  };
  fn.urls = urls;
  return fn;
}

/** fetch replacement driven by a function (url) → {status, body} | Error. */
export function scriptedFetch(handler) {
  const urls = [];
  const fn = async (url) => {
    urls.push(String(url));
    const r = await handler(String(url), urls.length);
    if (r instanceof Error) throw r;
    return new Response(typeof r.body === 'string' ? r.body : JSON.stringify(r.body), { status: r.status ?? 200 });
  };
  fn.urls = urls;
  return fn;
}

export function rec(over = {}) {
  return {
    source: 'europepmc',
    title: 'A sufficiently long test title about chemokine receptors',
    authors: ['Smith J', 'Doe A'],
    firstAuthorLast: 'Smith',
    date: '2026-10-01',
    doi: '10.1101/2026.10.01.000001',
    kind: 'preprint',
    venue: 'bioRxiv',
    abstract: 'Abstract text.',
    url: 'https://doi.org/10.1101/2026.10.01.000001',
    ...over,
  };
}
