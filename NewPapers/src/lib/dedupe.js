// Normalization, identity keys and merging of entries across sources and runs.
//
// A source returns *records* (one version of a paper from one source). Records
// are merged into *entries* (what the user sees). An entry keeps every identity
// key of its records (DOIs, PMID, arXiv id, title+first author) so that:
//   - the same paper from several sources/runs collapses into one entry, and
//   - a preprint and its published version end up as one entry with both links.
// Dismissal stores all keys of an entry, so it stays hidden whichever version
// or source returns it later.

export function normalizeDoi(input) {
  if (!input) return null;
  let s = String(input).trim().toLowerCase();
  s = s.replace(/^https?:\/\/(dx\.)?doi\.org\//, '').replace(/^doi:\s*/, '');
  try { s = decodeURIComponent(s); } catch { /* keep as is */ }
  s = s.replace(/[.\s]+$/, '');
  return /^10\.\d{4,9}\/\S+$/.test(s) ? s : null;
}

export function normalizeTitle(input) {
  return String(input ?? '')
    .replace(/<[^>]+>/g, ' ')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function normalizeName(input) {
  return String(input ?? '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z]+/g, '');
}

/** Identity keys of a record. Title keys are only used for reasonably long titles. */
export function recordKeys(rec) {
  const keys = [];
  const doi = normalizeDoi(rec.doi);
  if (doi) keys.push(`doi:${doi}`);
  for (const d of rec.relatedDois || []) {
    const n = normalizeDoi(d);
    if (n) keys.push(`doi:${n}`);
  }
  if (rec.pmid) keys.push(`pmid:${String(rec.pmid).trim()}`);
  for (const p of rec.relatedPmids || []) keys.push(`pmid:${String(p).trim()}`);
  if (rec.arxivId) keys.push(`arxiv:${String(rec.arxivId).toLowerCase().replace(/v\d+$/, '')}`);
  const t = normalizeTitle(rec.title);
  if (t.length >= 20) keys.push(`title:${t}|${normalizeName(rec.firstAuthorLast)}`);
  return [...new Set(keys)];
}

function versionOf(rec) {
  const doi = normalizeDoi(rec.doi);
  return {
    kind: rec.kind === 'preprint' ? 'preprint' : 'article',
    venue: rec.venue || (rec.kind === 'preprint' ? 'Preprint' : 'Journal article'),
    doi,
    url: doi ? `https://doi.org/${doi}` : rec.url || null,
    date: rec.date || null,
    sources: [rec.source],
  };
}

function versionId(v) {
  return v.doi ? `doi:${v.doi}` : `url:${v.url}|${v.venue}`;
}

export function entryFromRecord(rec, now) {
  const keys = recordKeys(rec);
  return {
    id: keys[0] || `rand:${Math.random().toString(36).slice(2)}`,
    keys,
    title: rec.title || '(untitled)',
    authors: rec.authors || [],
    firstAuthorLast: rec.firstAuthorLast || '',
    date: rec.date || null,
    abstract: rec.abstract || '',
    pmid: rec.pmid || null,
    versions: [versionOf(rec)],
    sources: [rec.source],
    firstSeen: now,
    seen: false,
  };
}

function mergeEntry(target, other) {
  // Prefer the published title once a journal version joins a preprint-only entry.
  const takeTitle = !target.versions.some((v) => v.kind === 'article') && other.versions.some((v) => v.kind === 'article');
  if (takeTitle && other.title) target.title = other.title;
  target.keys = [...new Set([...target.keys, ...other.keys])];
  target.sources = [...new Set([...target.sources, ...other.sources])];
  if (!target.abstract || (other.abstract && other.abstract.length > target.abstract.length * 1.5)) {
    target.abstract = other.abstract || target.abstract;
  }
  if (other.authors.length > target.authors.length) target.authors = other.authors;
  if (!target.pmid && other.pmid) target.pmid = other.pmid;
  if (other.date && (!target.date || other.date > target.date)) target.date = other.date;
  for (const v of other.versions) {
    const existing = target.versions.find((x) => versionId(x) === versionId(v));
    if (existing) {
      existing.sources = [...new Set([...existing.sources, ...v.sources])];
      if (!existing.date && v.date) existing.date = v.date;
      if (existing.venue === 'Preprint' || existing.venue === 'Journal article') existing.venue = v.venue;
    } else {
      target.versions.push(v);
    }
  }
  // Preprints first, then journal versions.
  target.versions.sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'preprint' ? -1 : 1));
  target.firstSeen = Math.min(target.firstSeen, other.firstSeen);
  target.seen = target.seen && other.seen;
  return target;
}

/**
 * Merge freshly fetched records into a topic's entries.
 * @param {object[]} entries   current (not dismissed) entries
 * @param {object[]} records   normalized records from the sources
 * @param {Record<string, number>} dismissed  dismissed key -> timestamp
 * @returns {{entries: object[], added: number, newDismissedKeys: string[]}}
 */
export function mergeRecords(entries, records, dismissed = {}, now = Date.now()) {
  const list = entries.map((e) => ({ ...e, keys: [...e.keys], versions: e.versions.map((v) => ({ ...v })) }));
  const index = new Map();
  const reindex = (e) => e.keys.forEach((k) => index.set(k, e));
  list.forEach(reindex);
  const newDismissedKeys = [];
  const dismissedSet = new Set(Object.keys(dismissed));
  let added = 0;

  for (const rec of records) {
    const incoming = entryFromRecord(rec, now);
    if (incoming.keys.some((k) => dismissedSet.has(k))) {
      // Remember the extra identifiers (e.g. the journal DOI of a dismissed preprint).
      for (const k of incoming.keys) {
        if (!dismissedSet.has(k)) { dismissedSet.add(k); newDismissedKeys.push(k); }
      }
      continue;
    }
    const matches = [...new Set(incoming.keys.map((k) => index.get(k)).filter(Boolean))];
    if (!matches.length) {
      list.push(incoming);
      reindex(incoming);
      added++;
      continue;
    }
    const [target, ...rest] = matches;
    mergeEntry(target, incoming);
    for (const other of rest) {
      mergeEntry(target, other);
      list.splice(list.indexOf(other), 1);
    }
    reindex(target);
  }
  return { entries: list, added, newDismissedKeys };
}

/** Keep the newest `max` entries (by date, then first seen). */
export function capEntries(entries, max = 300) {
  if (entries.length <= max) return entries;
  return [...entries]
    .sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.firstSeen - a.firstSeen)
    .slice(0, max);
}

export const DISMISSED_TTL_MS = 365 * 24 * 60 * 60 * 1000;

export function pruneDismissed(dismissed, now = Date.now(), ttl = DISMISSED_TTL_MS) {
  const out = {};
  for (const [k, t] of Object.entries(dismissed || {})) if (now - t < ttl) out[k] = t;
  return out;
}

export function sortEntries(entries) {
  return [...entries].sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.firstSeen - a.firstSeen);
}
