// arXiv API (q-bio categories). Off by default.
// Docs: https://info.arxiv.org/help/api/user-manual.html
//   search_query: field prefixes (all:, cat:), AND / OR / ANDNOT, "phrases",
//                 submittedDate:[YYYYMMDDHHMM TO YYYYMMDDHHMM]
//   Operators associate to the right unless grouped, so the query is fully
//   parenthesized. Terms of use ask for at most one request every 3 seconds.
import { createLimiter, getText, buildUrl } from '../http.js';
import { parseQuery, renderQuery, ARXIV } from '../query.js';
import { normalizeDate } from '../dates.js';
import { elements, first, text } from '../xml.js';

const BASE = 'https://export.arxiv.org/api/query';
const limiter = createLimiter(3500);
export const QBIO = ['BM', 'CB', 'GN', 'MN', 'NC', 'OT', 'PE', 'QM', 'SC', 'TO'].map((c) => `cat:q-bio.${c}`);

export function buildQuery(query, fromDate, toDate) {
  const q = renderQuery(parseQuery(query), ARXIV);
  const d = (s) => s.replace(/-/g, '');
  return `((${q}) AND (${QBIO.join(' OR ')})) AND submittedDate:[${d(fromDate)}0000 TO ${d(toDate)}2359]`;
}

export function parseFeed(xml) {
  return elements(xml, 'entry').map(({ inner }) => {
    const absUrl = text(first(inner, 'id')?.inner);
    const arxivId = absUrl.replace(/^https?:\/\/arxiv\.org\/abs\//, '').replace(/v\d+$/, '');
    const authors = elements(inner, 'author').map((a) => text(first(a.inner, 'name')?.inner)).filter(Boolean);
    const journalDoi = text(first(inner, 'arxiv:doi')?.inner);
    return {
      source: 'arxiv',
      title: text(first(inner, 'title')?.inner),
      authors,
      firstAuthorLast: (authors[0] || '').split(' ').pop() || '',
      date: normalizeDate(text(first(inner, 'published')?.inner)),
      doi: `10.48550/arXiv.${arxivId}`,
      relatedDois: journalDoi ? [journalDoi] : [],
      arxivId,
      kind: 'preprint',
      venue: 'arXiv',
      abstract: text(first(inner, 'summary')?.inner),
      url: `https://arxiv.org/abs/${arxivId}`,
    };
  });
}

export default {
  id: 'arxiv',
  label: 'arXiv (q-bio)',
  description: 'Physics- and computation-adjacent work',
  defaultEnabled: false,
  limiter,
  async search(query, fromDate, toDate, ctx = {}) {
    const max = Math.min(ctx.maxResults ?? 200, 200);
    const url = buildUrl(BASE, {
      search_query: buildQuery(query, fromDate, toDate),
      start: 0,
      max_results: max,
      sortBy: 'submittedDate',
      sortOrder: 'descending',
    });
    const xml = await getText(url, { fetchImpl: ctx.fetchImpl, limiter, retries: 2, backoffMs: 5000 });
    return parseFeed(xml);
  },
};
