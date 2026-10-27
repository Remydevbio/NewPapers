// Boolean query parser and per-source renderers.
//
// Supported syntax: words, "quoted phrases", AND, OR, NOT (uppercase) and
// parentheses. Adjacent terms without an operator are joined with AND.
// NOT binds to the following term or group and must sit inside an AND
// (e.g. `a NOT b`, `a AND NOT b`); a query made only of negations is rejected.

export class QueryError extends Error {
  constructor(message) {
    super(message);
    this.name = 'QueryError';
  }
}

const OPS = new Set(['AND', 'OR', 'NOT']);

export function tokenize(input) {
  const tokens = [];
  const s = String(input ?? '');
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === '(' || c === ')') { tokens.push({ t: c }); i++; continue; }
    if (c === '"' || c === '“' || c === '”') {
      let j = i + 1;
      while (j < s.length && s[j] !== '"' && s[j] !== '“' && s[j] !== '”') j++;
      if (j >= s.length) throw new QueryError('Unclosed quotation mark.');
      const phrase = s.slice(i + 1, j).trim().replace(/\s+/g, ' ');
      if (phrase) tokens.push({ t: 'phrase', v: phrase });
      i = j + 1;
      continue;
    }
    let j = i;
    while (j < s.length && !/\s/.test(s[j]) && !'()"“”'.includes(s[j])) j++;
    const word = s.slice(i, j);
    tokens.push(OPS.has(word) ? { t: word } : { t: 'term', v: word });
    i = j;
  }
  return tokens;
}

export function parseQuery(input) {
  const tokens = tokenize(input);
  if (!tokens.length) throw new QueryError('The query is empty.');
  let pos = 0;
  let depth = 0;
  const peek = () => tokens[pos];
  const next = () => tokens[pos++];

  function parseOr() {
    const children = [parseAnd()];
    while (peek()?.t === 'OR') {
      next();
      children.push(parseAnd());
    }
    for (const c of children) {
      if (c.type === 'not') throw new QueryError('NOT must be combined with AND, e.g. "a NOT b".');
    }
    return children.length === 1 ? children[0] : { type: 'or', children };
  }

  function parseAnd() {
    const children = [parseUnary()];
    for (;;) {
      const tk = peek();
      if (!tk || tk.t === ')' || tk.t === 'OR') break;
      if (tk.t === 'AND') {
        next();
        if (!peek() || peek().t === ')' || peek().t === 'OR' || peek().t === 'AND') {
          throw new QueryError('AND must be followed by a term.');
        }
      }
      children.push(parseUnary());
    }
    if (children.length === 1) return children[0];
    if (children.every((c) => c.type === 'not')) {
      throw new QueryError('The query needs at least one term that is not negated.');
    }
    return { type: 'and', children };
  }

  function parseUnary() {
    const tk = next();
    if (!tk) throw new QueryError(depth ? 'Missing closing parenthesis.' : 'The query ends unexpectedly.');
    if (tk.t === 'NOT') return { type: 'not', child: parseUnary() };
    if (tk.t === '(') {
      if (peek()?.t === ')') throw new QueryError('Empty parentheses.');
      depth++;
      const inner = parseOr();
      if (next()?.t !== ')') throw new QueryError('Missing closing parenthesis.');
      depth--;
      return inner;
    }
    if (tk.t === 'term') return { type: 'term', value: tk.v };
    if (tk.t === 'phrase') return { type: 'term', value: tk.v, phrase: true };
    if (tk.t === ')') throw new QueryError('Unexpected closing parenthesis.');
    throw new QueryError(`Unexpected operator ${tk.t}.`);
  }

  const ast = parseOr();
  if (pos < tokens.length) {
    throw new QueryError(tokens[pos].t === ')' ? 'Unexpected closing parenthesis.' : 'Could not read the whole query.');
  }
  if (ast.type === 'not') throw new QueryError('The query needs at least one term that is not negated.');
  return ast;
}

/** Throws QueryError with a readable message when invalid; returns the AST otherwise. */
export function validateQuery(input) {
  return parseQuery(input);
}

// Dialects ------------------------------------------------------------------

const cleanTerm = (v) => v.replace(/"/g, '');

/** Lucene-like syntax shared by Europe PMC, PubMed and OpenAlex. */
export const STANDARD = {
  term: (v) => cleanTerm(v),
  phrase: (v) => `"${cleanTerm(v)}"`,
  andNot: 'NOT',
};

export const ARXIV = {
  term: (v) => `all:${cleanTerm(v)}`,
  phrase: (v) => `all:"${cleanTerm(v)}"`,
  andNot: 'ANDNOT',
};

/**
 * Render an AST. Every compound node is wrapped in parentheses, which keeps
 * the meaning intact for arXiv (whose operators are otherwise right-associative).
 */
export function renderQuery(ast, dialect = STANDARD) {
  const r = (node, top) => {
    switch (node.type) {
      case 'term':
        return node.phrase ? dialect.phrase(node.value) : dialect.term(node.value);
      case 'or': {
        const s = node.children.map((c) => r(c, false)).join(' OR ');
        return top ? s : `(${s})`;
      }
      case 'and': {
        const pos = node.children.filter((c) => c.type !== 'not');
        const neg = node.children.filter((c) => c.type === 'not').map((c) => c.child);
        let s = pos.map((c) => r(c, false)).join(' AND ');
        if (pos.length > 1 && neg.length) s = `(${s})`;
        for (const n of neg) s += ` ${dialect.andNot} ${r(n, false)}`;
        return top ? s : `(${s})`;
      }
      case 'not':
        // Only reachable for nested NOT NOT; collapse it.
        return node.child.type === 'not' ? r(node.child.child, top) : `NOT ${r(node.child, false)}`;
      default:
        throw new QueryError('Unknown query node.');
    }
  };
  return r(ast, true);
}

/** Positive terms of the query (used for relevance fallbacks and tests). */
export function positiveTerms(ast) {
  const out = [];
  const walk = (n, neg) => {
    if (n.type === 'term') { if (!neg) out.push(n.value); return; }
    if (n.type === 'not') return walk(n.child, !neg);
    n.children.forEach((c) => walk(c, neg));
  };
  walk(ast, false);
  return out;
}
