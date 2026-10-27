// PubMed via NCBI E-utilities: esearch (ids) → esummary (metadata) → efetch (abstracts).
// Docs: https://www.ncbi.nlm.nih.gov/books/NBK25499/
//   esearch: term (AND/OR/NOT uppercase, "phrases", parentheses),
//            datetype=edat, mindate/maxdate as YYYY/MM/DD, retmax
//   limits:  3 requests/s without an API key, 10 requests/s with api_key
import { createLimiter, getJson, getText, buildUrl } from '../http.js';
import { parseQuery, renderQuery, STANDARD } from '../query.js';
import { normalizeDate } from '../dates.js';
import { elements, first, text } from '../xml.js';

const BASE = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
// 3 req/s → one request every 334 ms; a little margin on top.
const limiter = createLimiter(350);

const slash = (d) => d.replace(/-/g, '/');

function common(ctx) {
  const key = ctx.settings?.ncbiApiKey?.trim();
  limiter.intervalMs = key ? 110 : 350;
  return { tool: 'new-papers-extension', email: ctx.settings?.email || undefined, api_key: key || undefined };
}

export function mapSummary(s) {
  const ids = Object.fromEntries((s.articleids || []).map((a) => [a.idtype, a.value]));
  const entrez = (s.history || []).find((h) => h.pubstatus === 'entrez')?.date;
  const authors = (s.authors || []).filter((a) => a.authtype === 'Author' || !a.authtype).map((a) => a.name);
  const isPreprint = (s.pubtype || []).some((p) => /preprint/i.test(p));
  return {
    source: 'pubmed',
    title: text(s.title).replace(/\.$/, ''),
    authors,
    firstAuthorLast: (authors[0] || '').split(' ').slice(0, -1).join(' ') || (authors[0] || ''),
    date: normalizeDate(entrez) || normalizeDate(s.sortpubdate) || normalizeDate(s.pubdate),
    doi: ids.doi || null,
    pmid: String(s.uid),
    kind: isPreprint ? 'preprint' : 'article',
    venue: s.source || s.fulljournalname || 'PubMed',
    abstract: '',
    url: `https://pubmed.ncbi.nlm.nih.gov/${s.uid}/`,
  };
}

/** Map PMID → abstract from an efetch XML document. */
export function parseAbstracts(xml) {
  const out = {};
  for (const art of elements(xml, 'PubmedArticle')) {
    const pmid = text(first(art.inner, 'PMID')?.inner);
    const parts = elements(art.inner, 'AbstractText').map((a) => {
      const body = text(a.inner);
      return a.attrs.Label ? `${a.attrs.Label}: ${body}` : body;
    });
    if (pmid && parts.length) out[pmid] = parts.join('\n');
  }
  return out;
}

export default {
  id: 'pubmed',
  label: 'PubMed',
  description: 'NCBI E-utilities, by Entrez date',
  defaultEnabled: true,
  limiter,
  async search(query, fromDate, toDate, ctx = {}) {
    const max = ctx.maxResults ?? 200;
    const base = common(ctx);
    const opts = { fetchImpl: ctx.fetchImpl, limiter };
    const es = await getJson(buildUrl(`${BASE}/esearch.fcgi`, {
      ...base,
      db: 'pubmed',
      term: renderQuery(parseQuery(query), STANDARD),
      datetype: 'edat',
      mindate: slash(fromDate),
      maxdate: slash(toDate),
      retmode: 'json',
      retmax: max,
      sort: 'pub_date',
    }), opts);
    if (es?.esearchresult?.ERROR) throw new Error(`PubMed: ${es.esearchresult.ERROR}`);
    const ids = es?.esearchresult?.idlist || [];
    if (!ids.length) return [];

    const sum = await getJson(buildUrl(`${BASE}/esummary.fcgi`, { ...base, db: 'pubmed', id: ids.join(','), retmode: 'json' }), opts);
    const result = sum?.result || {};
    const records = (result.uids || ids).map((u) => result[u])
      .filter((s) => s && !s.error && !(s.pubtype || []).includes('Published Erratum'))
      .map(mapSummary);

    // Abstracts are a bonus: keep the records if efetch fails.
    try {
      const xml = await getText(buildUrl(`${BASE}/efetch.fcgi`, { ...base, db: 'pubmed', id: ids.join(','), retmode: 'xml' }), { ...opts, retries: 1 });
      const abs = parseAbstracts(xml);
      for (const r of records) r.abstract = abs[r.pmid] || '';
    } catch { /* ignore */ }
    return records;
  },
};
