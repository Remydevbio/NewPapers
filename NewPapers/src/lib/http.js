// Fetch helpers: per-source rate limiting, timeouts and limited retries.

export class SourceError extends Error {
  constructor(message, { status = 0, offline = false, body = '' } = {}) {
    super(message);
    this.name = 'SourceError';
    this.status = status;
    this.offline = offline;
    this.body = body;
  }
}

/** Serializes calls so that consecutive starts are at least `intervalMs` apart. */
export function createLimiter(intervalMs) {
  let last = 0;
  let chain = Promise.resolve();
  const limiter = (fn) => {
    const run = chain.then(async () => {
      const wait = last + limiter.intervalMs - Date.now();
      if (wait > 0) await sleep(wait);
      last = Date.now();
      return fn();
    });
    chain = run.catch(() => {});
    return run;
  };
  limiter.intervalMs = intervalMs;
  return limiter;
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * GET a URL through a limiter, with a timeout and retries on 429/5xx/network errors.
 * @returns {Promise<string>} response text
 */
export async function getText(url, {
  fetchImpl = globalThis.fetch,
  limiter = (fn) => fn(),
  retries = 2,
  timeoutMs = 25000,
  backoffMs = 2000,
  headers = {},
} = {}) {
  let attempt = 0;
  for (;;) {
    let res;
    try {
      res = await limiter(async () => {
        const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
        const timer = ctrl ? setTimeout(() => ctrl.abort(), timeoutMs) : null;
        try {
          const r = await fetchImpl(url, { headers, signal: ctrl?.signal });
          const text = await r.text();
          return { status: r.status, ok: r.ok, text, retryAfter: r.headers?.get?.('retry-after') };
        } finally {
          if (timer) clearTimeout(timer);
        }
      });
    } catch (err) {
      const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
      if (attempt < retries && !offline) {
        attempt++;
        await sleep(backoffMs * attempt);
        continue;
      }
      throw new SourceError(offline ? 'Offline' : `Network error (${err?.name === 'AbortError' ? 'timeout' : err?.message || err})`, { offline });
    }
    if (res.ok) return res.text;
    if ((res.status === 429 || res.status >= 500) && attempt < retries) {
      attempt++;
      const ra = Number(res.retryAfter);
      await sleep(Number.isFinite(ra) && ra > 0 ? Math.min(ra * 1000, 30000) : backoffMs * 2 ** attempt);
      continue;
    }
    const body = String(res.text || '').slice(0, 1000);
    const reason = apiReason(body);
    throw new SourceError(`HTTP ${res.status}${res.status === 429 ? ' (rate limited)' : ''}${reason ? `: ${reason}` : ''}`, { status: res.status, body });
  }
}

/** First sentence of an API error body: JSON message/errMsg/error, or plain text (HTML title only). */
export function apiReason(body = '') {
  let msg = '';
  try {
    const b = JSON.parse(body);
    msg = b?.message || b?.errMsg || b?.error || '';
  } catch {
    msg = /<html/i.test(body) ? (body.match(/<title>([^<]*)<\/title>/i)?.[1] || '') : body;
  }
  return String(msg).replace(/\s+/g, ' ').trim().split(/\. /)[0].replace(/\.$/, '').slice(0, 120);
}

export async function getJson(url, opts) {
  const text = await getText(url, opts);
  try {
    return JSON.parse(text);
  } catch {
    throw new SourceError('Invalid JSON response');
  }
}

export function buildUrl(base, params) {
  const u = new URL(base);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') u.searchParams.set(k, String(v));
  }
  return u.toString();
}
