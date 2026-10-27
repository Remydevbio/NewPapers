// OpenAlex works API — broad DOI-based coverage of journals missing from PubMed.
// Docs: https://help.openalex.org/ (works: /api/works, filters, search syntax)
//   filter=title_and_abstract.search:<boolean query>,from_publication_date:…,to_publication_date:…
//   Boolean AND/OR/NOT and "phrases" are supported; commas separate filters so
//   they are removed from the query. Cursor paging with cursor=*.
//   Without api_key, requests share a small free daily budget per IP; mailto is
//   still sent (polite identification) and api_key is optional in the settings.
//   from_created_date needs a paid plan, so publication dates (+ overlap) are used.
//   An unknown or not-yet-activated api_key gets HTTP 401 ("API key not found");
//   the search is then redone without the key and ctx.warn reports it.
import { createLimiter, getJson, buildUrl } from '../http.js';
import { parseQuery, renderQuery, STANDARD } from '../query.js';
import { normalizeDate } from '../dates.js';
import { text } from '../xml.js';

const BASE = 'https://api.openalex.org/works';
const limiter = createLimiter(150);
const TYPES = 'article|preprint|review|letter';
const SELECT = 'id,doi,display_name,publication_date,type,authorships,primary_location,locations,abstract_inverted_index,ids';

export function buildFilter(query, fromDate, toDate) {
  const q = renderQuery(parseQuery(query), STANDARD).replace(/[,|]/g, ' ');
  return `title_and_abstract.search:${q},from_publication_date:${fromDate},to_publication_date:${toDate},type:${TYPES}`;
}

export function rebuildAbstract(inv) {
  if (!inv || typeof inv !== 'object') return '';
  const words = [];
  for (const [w, positions] of Object.entries(inv)) for (const p of positions) words[p] = w;
  return words.filter((w) => w !== undefined).join(' ');
}

export function cleanVenue(name) {
  return String(name || '').replace(/\s*\([^)]*\)\s*$/, '').trim();
}

export function mapWork(w) {
  const src = w.primary_location?.source;
  const isPreprint = w.type === 'preprint' || src?.type === 'repository';
  const authors = (w.authorships || []).map((a) => a.author?.display_name || a.raw_author_name).filter(Boolean);
  const pmid = (w.ids?.pmid || '').match(/(\d+)\/?$/)?.[1] || null;
  const doi = w.doi || null;
  const relatedDois = (w.locations || [])
    .map((l) => l.landing_page_url || '')
    .filter((u) => /doi\.org\/10\./i.test(u) && (!doi || u.toLowerCase() !== doi.toLowerCase()));
  return {
    source: 'openalex',
    title: text(w.display_name || w.title).replace(/\.$/, ''),
    authors,
    firstAuthorLast: (authors[0] || '').split(' ').pop() || '',
    date: normalizeDate(w.publication_date),
    doi,
    relatedDois,
    pmid,
    kind: isPreprint ? 'preprint' : 'article',
    venue: cleanVenue(src?.display_name) || (isPreprint ? 'Preprint' : 'Journal article'),
    abstract: text(rebuildAbstract(w.abstract_inverted_index)),
    url: doi || w.primary_location?.landing_page_url || w.id,
  };
}

export default {
  id: 'openalex',
  label: 'OpenAlex',
  description: 'Broad DOI-based journal coverage',
  defaultEnabled: true,
  limiter,
  async search(query, fromDate, toDate, ctx = {}) {
    const key = ctx.settings?.openalexApiKey?.trim() || undefined;
    try {
      return await searchPages(query, fromDate, toDate, ctx, key);
    } catch (e) {
      if (!key || e?.status !== 401) throw e;
      ctx.warn?.(`OpenAlex rejected the API key (${apiMessage(e) || 'HTTP 401'}). Results were fetched without it; fix or clear the key in Options.`);
      return searchPages(query, fromDate, toDate, ctx, undefined);
    }
  },
};

/** Short message from an OpenAlex JSON error body, e.g. "API key not found". */
export function apiMessage(err) {
  try {
    const b = JSON.parse(err?.body || '');
    return String(b.message || b.error || '').split('. ')[0].replace(/\.$/, '');
  } catch {
    return '';
  }
}

async function searchPages(query, fromDate, toDate, ctx, apiKey) {
  const max = ctx.maxResults ?? 200;
  const out = [];
  let cursor = '*';
  while (cursor && out.length < max) {
    const url = buildUrl(BASE, {
      filter: buildFilter(query, fromDate, toDate),
      'per-page': Math.min(100, max),
      cursor,
      select: SELECT,
      sort: 'publication_date:desc',
      mailto: ctx.settings?.email || undefined,
      api_key: apiKey,
    });
    const data = await getJson(url, { fetchImpl: ctx.fetchImpl, limiter });
    if (data?.error) throw new Error(`OpenAlex: ${data.message || data.error}`);
    const results = data?.results || [];
    out.push(...results.map(mapWork));
    cursor = results.length ? data?.meta?.next_cursor : null;
  }
  return out.slice(0, max);
}
