// Europe PMC REST API — primary source for preprints (bioRxiv, medRxiv,
// Research Square, …) with full boolean keyword search.
// Docs: https://europepmc.org/RestfulWebService (search syntax: https://europepmc.org/Help#SSR)
//   query: Lucene syntax, AND/OR/NOT, "phrases", SRC:PPR, FIRST_PDATE:[from TO to]
//   paging: cursorMark (start '*'), pageSize up to 1000
import { createLimiter, getJson, buildUrl } from '../http.js';
import { parseQuery, renderQuery, STANDARD } from '../query.js';
import { normalizeDate } from '../dates.js';
import { text } from '../xml.js';

const BASE = 'https://www.ebi.ac.uk/europepmc/webservices/rest/search';
const limiter = createLimiter(200);

export function buildQuery(query, fromDate, toDate, scope = 'preprints') {
  const q = renderQuery(parseQuery(query), STANDARD);
  const src = scope === 'all' ? '(SRC:PPR OR SRC:MED)' : 'SRC:PPR';
  return `(${q}) AND ${src} AND FIRST_PDATE:[${fromDate} TO ${toDate}]`;
}

export function mapResult(r) {
  const isPreprint = r.source === 'PPR';
  const authors = (r.authorList?.author || [])
    .map((a) => a.fullName || [a.lastName, a.initials].filter(Boolean).join(' ') || a.collectiveName)
    .filter(Boolean);
  const firstAuthor = r.authorList?.author?.[0];
  const journal = r.journalInfo?.journal;
  const relatedPmids = (r.commentCorrectionList?.commentCorrection || [])
    .filter((c) => c.source === 'MED' && /preprint of/i.test(c.type || ''))
    .map((c) => c.id);
  return {
    source: 'europepmc',
    title: text(r.title).replace(/\.$/, ''),
    authors,
    firstAuthorLast: firstAuthor?.lastName || (authors[0] || '').split(' ')[0] || '',
    date: normalizeDate(r.firstPublicationDate),
    doi: r.doi || null,
    pmid: r.source === 'MED' ? r.pmid || r.id : null,
    relatedPmids,
    kind: isPreprint ? 'preprint' : 'article',
    venue: isPreprint
      ? r.bookOrReportDetails?.publisher || 'Preprint'
      : journal?.isoabbreviation || journal?.medlineAbbreviation || journal?.title || 'Journal article',
    abstract: text(r.abstractText),
    url: r.doi ? `https://doi.org/${r.doi}` : `https://europepmc.org/article/${r.source}/${r.id}`,
  };
}

export default {
  id: 'europepmc',
  label: 'Europe PMC',
  description: 'Preprints (bioRxiv, medRxiv, …); optionally PubMed records too',
  defaultEnabled: true,
  limiter,
  async search(query, fromDate, toDate, ctx = {}) {
    const max = ctx.maxResults ?? 200;
    const out = [];
    let cursor = '*';
    while (out.length < max) {
      const url = buildUrl(BASE, {
        query: buildQuery(query, fromDate, toDate, ctx.settings?.europepmcScope),
        resultType: 'core',
        format: 'json',
        pageSize: Math.min(100, max),
        sort: 'FIRST_PDATE_D desc',
        cursorMark: cursor,
        email: ctx.settings?.email || undefined,
      });
      const data = await getJson(url, { fetchImpl: ctx.fetchImpl, limiter });
      const results = data?.resultList?.result || [];
      out.push(...results.map(mapResult));
      if (!results.length || !data.nextCursorMark || data.nextCursorMark === cursor) break;
      cursor = data.nextCursorMark;
    }
    return out.slice(0, max);
  },
};
