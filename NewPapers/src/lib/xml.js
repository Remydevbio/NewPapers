// Minimal XML helpers. MV3 service workers have no DOMParser, and the feeds we
// read (PubMed efetch, arXiv Atom) are simple and regular, so a few targeted
// regular expressions are enough. Output is plain text only.

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

export function decodeEntities(s) {
  return String(s ?? '').replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') {
      const code = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

export function stripTags(s) {
  return String(s ?? '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]*>/g, '');
}

/** Plain text from an XML/HTML fragment: tags removed, entities decoded, whitespace collapsed. */
export function text(s) {
  return decodeEntities(stripTags(s)).replace(/\s+/g, ' ').trim();
}

const esc = (tag) => tag.replace(/[:.]/g, (c) => `\\${c}`);

/** All elements named `tag` (non-nested), as {attrs, inner}. */
export function elements(xml, tag) {
  const re = new RegExp(`<${esc(tag)}(\\s[^>]*)?(?:/>|>([\\s\\S]*?)</${esc(tag)}>)`, 'g');
  const out = [];
  let m;
  while ((m = re.exec(xml))) out.push({ attrs: parseAttrs(m[1] || ''), inner: m[2] ?? '' });
  return out;
}

export function first(xml, tag) {
  return elements(xml, tag)[0] || null;
}

function parseAttrs(s) {
  const attrs = {};
  const re = /([\w:.-]+)\s*=\s*("([^"]*)"|'([^']*)')/g;
  let m;
  while ((m = re.exec(s))) attrs[m[1]] = decodeEntities(m[3] ?? m[4] ?? '');
  return attrs;
}
