// Date helpers. All calendar dates are 'YYYY-MM-DD' strings in UTC.

export const FIRST_RUN_MONTHS = 2;
export const OVERLAP_DAYS = 3;
export const MAX_WINDOW_DAYS = 366;

const DAY = 24 * 60 * 60 * 1000;

export function toISODate(d) {
  return new Date(d).toISOString().slice(0, 10);
}

export function addDays(isoDate, days) {
  return toISODate(Date.parse(`${isoDate}T00:00:00Z`) + days * DAY);
}

export function subtractMonths(isoDate, months) {
  const d = new Date(`${isoDate}T00:00:00Z`);
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() - months);
  const lastDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  d.setUTCDate(Math.min(day, lastDay));
  return toISODate(d);
}

/**
 * Date window for one topic/source.
 * - Never checked (or query changed): the last FIRST_RUN_MONTHS months.
 * - Otherwise: from the last successful check minus OVERLAP_DAYS, to today,
 *   never reaching further back than MAX_WINDOW_DAYS.
 */
export function computeWindow(lastCheckedISO, now = Date.now()) {
  const to = toISODate(now);
  if (!lastCheckedISO) {
    return { from: subtractMonths(to, FIRST_RUN_MONTHS), to, firstRun: true };
  }
  let from = addDays(toISODate(lastCheckedISO), -OVERLAP_DAYS);
  const floor = addDays(to, -MAX_WINDOW_DAYS);
  if (from < floor) from = floor;
  if (from > to) from = to;
  return { from, to, firstRun: false };
}

/** Normalize partial dates coming from APIs ('2026', '2026 Oct', '2026/10/03 00:00') to YYYY-MM-DD. */
export function normalizeDate(input) {
  if (!input) return null;
  const s = String(input).trim();
  let m = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (m) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  m = s.match(/^(\d{4})\s+([A-Za-z]{3})[a-z]*\s*(\d{1,2})?/);
  if (m) {
    const mi = months.indexOf(m[2].toLowerCase());
    if (mi >= 0) return `${m[1]}-${String(mi + 1).padStart(2, '0')}-${(m[3] || '1').padStart(2, '0')}`;
  }
  m = s.match(/^(\d{4})$/);
  if (m) return `${m[1]}-01-01`;
  const t = Date.parse(s);
  return Number.isNaN(t) ? null : toISODate(t);
}
