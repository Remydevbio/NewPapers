// Source registry. Each adapter implements:
//   { id, label, description, defaultEnabled,
//     search(query, fromDate, toDate, ctx) → Promise<record[]> }
// where a record is a normalized single version of a paper:
//   { source, title, authors[], firstAuthorLast, date 'YYYY-MM-DD', doi, pmid?,
//     arxivId?, relatedDois?, relatedPmids?, kind 'preprint'|'article', venue,
//     abstract, url }
// To add a source, write an adapter and list it here.
import europepmc from './europepmc.js';
import pubmed from './pubmed.js';
import openalex from './openalex.js';
import arxiv from './arxiv.js';

export const SOURCES = [europepmc, pubmed, openalex, arxiv];
export const SOURCE_BY_ID = Object.fromEntries(SOURCES.map((s) => [s.id, s]));
