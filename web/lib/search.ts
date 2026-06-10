/**
 * Search core — pure functions, no DOM.
 *
 * The Digital Decretals' standardized legal allegations depend on exact
 * punctuation ("qui fil. sint legit., per venerabilem"), so the default
 * search matches substrings exactly (case-insensitively). Optional modes:
 *   cs — case sensitive
 *   ip — ignore punctuation (and collapse whitespace)
 *   or — orthographic tolerance: ae/oe ≡ e, v ≡ u
 *        (the text uses classical spelling; this lets medieval forms match)
 *
 * normalize() returns the normalized string plus maps from each normalized
 * character to its original [start, end) range, so matches can be
 * highlighted in the original even when a digraph collapsed to one char.
 */

export interface Norm {
  n: string;
  map: number[]; // normalized index -> original start index
  end: number[]; // normalized index -> original end index (exclusive)
}

export type Range = [number, number];

export const PUNCT = /[.,;:!?()\[\]{}'"‘’“”§&/\\\-]/;

export function normalize(s: string, cs: boolean, ip: boolean, or = false): Norm {
  let n = "";
  const map: number[] = [];
  const end: number[] = [];
  let prevSpace = true;
  let i = 0;
  while (i < s.length) {
    let ch = s[i];
    let span = 1;
    if (ch === "\n" || ch === "\t") ch = " ";
    if (!cs) ch = ch.toLowerCase();
    if (or) {
      // collapse ae / oe digraphs to e (case of the second letter is irrelevant)
      const next = i + 1 < s.length ? s[i + 1].toLowerCase() : "";
      const lower = ch.toLowerCase();
      if ((lower === "a" || lower === "o") && next === "e") {
        ch = cs && s[i] === s[i].toUpperCase() ? "E" : "e";
        span = 2;
      } else if (lower === "v") {
        ch = cs && ch === "V" ? "U" : "u";
      }
    }
    if (ip && PUNCT.test(ch)) {
      i += span;
      continue;
    }
    if (ch === " ") {
      if (prevSpace) {
        i += span;
        continue;
      }
      prevSpace = true;
    } else prevSpace = false;
    n += ch;
    map.push(i);
    end.push(i + span);
    i += span;
  }
  while (n.endsWith(" ")) {
    n = n.slice(0, -1);
    map.pop();
    end.pop();
  }
  return { n, map, end };
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
    if (!ww || (okL && okR)) out.push([norm.map[i], norm.end[i + q.length - 1]]);
    i += 1;
  }
  return out;
}
