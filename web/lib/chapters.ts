/**
 * Server-side index over the gloss + register for the static chapter pages
 * (/x/[ref]) and the sitemap. Imported only from server components — the
 * JSON never reaches the client bundle.
 */
import glossJson from "@/public/gloss-data.json";
import abbrevJson from "@/public/abbrev-data.json";
import type { GlossData, Book, Title, Chapter } from "@/lib/data";
import type { AbbrevData, Capitulum } from "@/lib/abbrev";

export const gloss = glossJson as unknown as GlossData;
export const abbrev = abbrevJson as unknown as AbbrevData;

export interface ChapterEntry {
  ref: string; // chapter num, or "rex-pacificus"
  book: Book;
  title: Title | null;
  chap: Chapter | null; // null = preface
  idx: number;
}

/** Linear, document-order list of reading locations (preface first). */
export const CHAPTERS: ChapterEntry[] = (() => {
  const out: ChapterEntry[] = [];
  for (const book of gloss.books) {
    if (book.units.length) out.push({ ref: "rex-pacificus", book, title: null, chap: null, idx: out.length });
    for (const title of book.titles)
      for (const chap of title.chapters) out.push({ ref: chap.num, book, title, chap, idx: out.length });
  }
  return out;
})();

/** ref -> all entries with that ref (the misnumbered duplicate X 3.37.4 yields two). */
export const BY_REF: Map<string, ChapterEntry[]> = (() => {
  const m = new Map<string, ChapterEntry[]>();
  for (const e of CHAPTERS) {
    const list = m.get(e.ref) ?? [];
    list.push(e);
    m.set(e.ref, list);
  }
  return m;
})();

export const REGISTER: Map<string, Capitulum> = new Map(abbrev.capitula.map((c) => [c.ref, c]));

export const uniqueRefs = [...BY_REF.keys()];
