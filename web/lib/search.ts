/**
 * Search core — pure functions, no DOM.
 *
 * The Digital Decretals' standardized legal allegations depend on exact
 * punctuation ("qui fil. sint legit., per venerabilem"), so the default
 * search matches substrings exactly (case-insensitively). Optional modes:
 *   cs — case sensitive
 *   ip — ignore punctuation (and collapse whitespace)
 *   ww — whole words only
 *
 * normalize() returns the normalized string plus a map from normalized
 * index -> original index, so matches can be highlighted in the original.
 */

export interface Norm {
  n: string;
  map: number[];
}

export type Range = [number, number];

export const PUNCT = /[.,;:!?()\[\]{}'"‘’“”§&/\\\-]/;

export function normalize(s: string, cs: boolean, ip: boolean): Norm {
  let n = "";
  const map: number[] = [];
  let prevSpace = true;
  for (let i = 0; i < s.length; i++) {
    let ch = s[i];
    if (ch === "\n" || ch === "\t") ch = " ";
    if (!cs) ch = ch.toLowerCase();
    if (ip && PUNCT.test(ch)) continue;
    if (ch === " ") {
      if (prevSpace) continue;
      prevSpace = true;
    } else prevSpace = false;
    n += ch;
    map.push(i);
  }
  while (n.endsWith(" ")) {
    n = n.slice(0, -1);
    map.pop();
  }
  return { n, map };
}

const isWordChar = (c: string) => /[A-Za-z0-9]/.test(c);

/** All occurrences of normalized query `q` in `norm`, as original-text ranges. */
export function findMatches(norm: Norm, q: string, ww: boolean): Range[] {
  const out: Range[] = [];
  if (!q) return out;
  let i = 0;
  while ((i = norm.n.indexOf(q, i)) !== -1) {
    const okL = i === 0 || !isWordChar(norm.n[i - 1]) || !isWordChar(q[0]);
    const okR =
      i + q.length >= norm.n.length ||
      !isWordChar(norm.n[i + q.length]) ||
      !isWordChar(q[q.length - 1]);
    if (!ww || (okL && okR)) out.push([norm.map[i], norm.map[i + q.length - 1] + 1]);
    i += 1;
  }
  return out;
}
