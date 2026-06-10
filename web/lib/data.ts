/**
 * Data model. Matches the JSON produced by build/parse_gloss.py from the
 * master Word file (H1 book / H2 title / H3 chapter / H4 lemma).
 */

/** [start, end, target ref] — a standardized Liber extra allegation inside the text. */
export type LinkRange = [number, number, string];

export interface RawUnit {
  lemma: string | null; // null = gloss before the first lemma ("in princ.")
  text: string;
  k?: LinkRange[]; // citation-hypertext links (precomputed by build/make_links.py)
}
export interface Chapter {
  raw: string; // "X 4.17.13 Per venerabilem" (as in the Word file)
  num: string; // "4.17.13" (modern citation form)
  incipit: string;
  units: RawUnit[];
}
export interface Title {
  raw: string;
  num: string; // "4.17"
  rubric: string; // "Qui filii sint legitimi"
  chapters: Chapter[];
}
export interface Book {
  id: string; // "RP" | "1" | "4" ...
  heading: string; // "BOOK IV"
  label: string; // "Book IV" | "Rex pacificus"
  titles: Title[];
  units: RawUnit[]; // direct units (Rex pacificus only)
}
export interface GlossData {
  project: string;
  source: string;
  generated: string;
  books: Book[];
  stats: { chapters: number; units: number };
}

/** A reading-view location: either the preface or one chapter. */
export interface ChapterNode {
  kind: "rp" | "ch";
  idx: number; // position in the linear sequence (for prev/next)
  book: Book;
  title: Title | null;
  chap: Chapter | null;
  units: FlatUnit[];
}

/** One gloss unit, flattened for searching. */
export interface FlatUnit {
  id: number;
  book: Book;
  title: Title | null;
  chap: Chapter | null;
  lemma: string | null;
  text: string;
  links: LinkRange[];
  node: ChapterNode;
}

export interface Flat {
  units: FlatUnit[];
  nodes: ChapterNode[];
}

export function flatten(data: GlossData): Flat {
  const units: FlatUnit[] = [];
  const nodes: ChapterNode[] = [];
  for (const book of data.books) {
    if (book.units.length) {
      const node: ChapterNode = { kind: "rp", idx: nodes.length, book, title: null, chap: null, units: [] };
      nodes.push(node);
      for (const u of book.units) {
        const f: FlatUnit = { id: units.length, book, title: null, chap: null, lemma: u.lemma, text: u.text, links: u.k ?? [], node };
        units.push(f);
        node.units.push(f);
      }
    }
    for (const title of book.titles)
      for (const chap of title.chapters) {
        const node: ChapterNode = { kind: "ch", idx: nodes.length, book, title, chap, units: [] };
        nodes.push(node);
        for (const u of chap.units) {
          const f: FlatUnit = { id: units.length, book, title, chap, lemma: u.lemma, text: u.text, links: u.k ?? [], node };
          units.push(f);
          node.units.push(f);
        }
      }
  }
  return { units, nodes };
}

export const nf = (n: number) => n.toLocaleString("en-US");

export const bookGlossCount = (b: Book) =>
  b.units.length + b.titles.reduce((s, t) => s + t.chapters.reduce((s2, c) => s2 + c.units.length, 0), 0);

export const nodeLabel = (c: ChapterNode) =>
  c.kind === "rp" ? "Rex pacificus" : `X ${c.chap!.num} ${c.chap!.incipit}`;
