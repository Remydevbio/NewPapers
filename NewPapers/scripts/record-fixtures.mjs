// Records real API responses into test/fixtures/<source>.json for the adapter tests.
//   node scripts/record-fixtures.mjs [sourceId…]
import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { SOURCE_BY_ID } from '../src/lib/sources/index.js';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(root, 'test/fixtures');
await mkdir(outDir, { recursive: true });

const PLAN = {
  europepmc: { query: 'GPR182 OR "atypical chemokine receptor"', from: '2026-06-01', to: '2026-10-23', max: 20 },
  pubmed: { query: 'GPR182 OR "atypical chemokine receptor"', from: '2026-06-01', to: '2026-10-23', max: 10 },
  openalex: { query: 'GPR182 OR "atypical chemokine receptor"', from: '2026-08-01', to: '2026-10-23', max: 10 },
  arxiv: { query: '"protein folding" NOT membrane', from: '2026-09-01', to: '2026-10-23', max: 5 },
};

const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(PLAN);
for (const id of ids) {
  const p = PLAN[id];
  const calls = [];
  const recordingFetch = async (url, init) => {
    const res = await fetch(url, init);
    const body = await res.text();
    // Strip credentials from recorded URLs (none are set here, but be safe).
    calls.push({ url: String(url).replace(/(api_key|email|mailto)=[^&]*/g, '$1=REDACTED'), status: res.status, body });
    return new Response(body, { status: res.status, headers: res.headers });
  };
  const records = await SOURCE_BY_ID[id].search(p.query, p.from, p.to, { fetchImpl: recordingFetch, maxResults: p.max, settings: {} });
  await writeFile(path.join(outDir, `${id}.json`), `${JSON.stringify({ plan: p, calls }, null, 1)}\n`);
  console.log(`${id}: ${calls.length} calls, ${records.length} records`);
}
