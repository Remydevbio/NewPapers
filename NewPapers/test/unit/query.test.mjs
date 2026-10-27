import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseQuery, renderQuery, STANDARD, ARXIV, QueryError, positiveTerms } from '../../src/lib/query.js';

const std = (q) => renderQuery(parseQuery(q), STANDARD);
const ax = (q) => renderQuery(parseQuery(q), ARXIV);

test('plain terms and phrases', () => {
  assert.equal(std('GPR182'), 'GPR182');
  assert.equal(std('"atypical chemokine receptor"'), '"atypical chemokine receptor"');
  assert.equal(std('lymphatic endothelium'), 'lymphatic AND endothelium');
});

test('boolean operators and grouping', () => {
  assert.equal(std('GPR182 OR ACKR5 OR "G protein-coupled receptor 182"'), 'GPR182 OR ACKR5 OR "G protein-coupled receptor 182"');
  assert.equal(std('"lymphatic endothelial" AND (scRNA-seq OR "single cell")'), '"lymphatic endothelial" AND (scRNA-seq OR "single cell")');
  assert.equal(std('(a OR b) NOT review'), '(a OR b) NOT review');
  assert.equal(std('a AND NOT b'), 'a NOT b');
  assert.equal(std('a b NOT c'), '(a AND b) NOT c');
});

test('arXiv dialect is fully parenthesized with ANDNOT', () => {
  assert.equal(ax('"protein folding" NOT membrane'), 'all:"protein folding" ANDNOT all:membrane');
  assert.equal(ax('(a OR b) c NOT d'), '((all:a OR all:b) AND all:c) ANDNOT all:d');
});

test('invalid queries raise readable errors', () => {
  for (const q of ['', '(a OR b', 'a OR b)', '"unclosed', 'NOT a', 'a OR NOT b', 'a AND', '()']) {
    assert.throws(() => parseQuery(q), QueryError, q);
  }
});

test('unbalanced parenthesis has a specific message', () => {
  assert.throws(() => parseQuery('(GPR182 OR'), /Missing closing parenthesis/);
});

test('lowercase operators are treated as words', () => {
  assert.equal(std('cats and dogs'), 'cats AND and AND dogs');
});

test('positive terms', () => {
  assert.deepEqual(positiveTerms(parseQuery('(a OR "b c") NOT d')), ['a', 'b c']);
});
