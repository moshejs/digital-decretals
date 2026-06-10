"use client";

import { useState } from "react";
import type { Book, ChapterNode, FlatUnit, GlossData, Title } from "@/lib/data";
import { nf } from "@/lib/data";
import type { Range } from "@/lib/search";
import { Cite, Highlighted } from "@/components/Highlighted";

export interface Hit {
  u: FlatUnit;
  tr: Range[]; // matches in the gloss text
  lr: Range[]; // matches in the lemma
  n: number;
}
export interface SearchResults {
  hits: Hit[];
  occ: number;
  chapCount: number;
  perBook: Map<Book, number>;
  locs: ChapterNode[]; // chapters whose incipit matches
  titleLocs: Title[]; // titles whose rubric matches
  ms: number;
  qn: string;
}

const PAGE = 150;

interface Props {
  data: GlossData;
  results: SearchResults;
  rawQ: string;
  scope: { book: Book | null; title: Title | null; chap: Chapter | null };
  onBookChip: (b: Book) => void;
  onOpenNode: (node: ChapterNode, focusUnit?: number) => void;
  onOpenTitle: (t: Title) => void;
}
type Chapter = NonNullable<FlatUnit["chap"]>;

export default function Results({ data, results: r, rawQ, scope, onBookChip, onOpenNode, onOpenTitle }: Props) {
  const [visible, setVisible] = useState(PAGE);

  const scopeBits: string[] = [];
  if (scope.book) scopeBits.push(scope.book.label);
  if (scope.title) scopeBits.push(`${scope.title.num} ${scope.title.rubric}`);
  if (scope.chap) scopeBits.push(`cap. ${scope.chap.num}`);

  const extraLocs = Math.max(0, r.locs.length - 24) + Math.max(0, r.titleLocs.length - 12);

  return (
    <>
      <div className="rsum">
        <span>
          <b>{nf(r.occ)}</b> occurrence{r.occ === 1 ? "" : "s"} in <b>{nf(r.hits.length)}</b> gloss
          {r.hits.length === 1 ? "" : "es"}
          {r.chapCount > 0 && (
            <>
              {" "}
              across <b>{nf(r.chapCount)}</b> capitula
            </>
          )}
          {scopeBits.length > 0 && <> — limited to {scopeBits.join(" › ")}</>}
        </span>
        <span className="dim ms">
          ({nf(data.stats.units)} glosses searched in {r.ms < 1 ? "<1" : Math.round(r.ms)} ms)
        </span>
      </div>

      <div className="chips">
        {data.books.map((b) => (
          <button
            key={b.id}
            className={`chip${scope.book === b ? " on" : ""}`}
            title={scope.book === b ? "Remove book filter" : `Limit to ${b.label}`}
            onClick={() => onBookChip(b)}
          >
            <b>{b.label}</b> {nf(r.perBook.get(b) ?? 0)}
          </button>
        ))}
      </div>

      {(r.locs.length > 0 || r.titleLocs.length > 0) && (
        <div className="locrow">
          <b className="dim">Matching places in the text:</b>{" "}
          {r.titleLocs.slice(0, 12).map((t) => (
            <span className="loc" key={`t${t.num}`}>
              tit.{" "}
              <button onClick={() => onOpenTitle(t)}>
                <b>{t.num}</b> {t.rubric}
              </button>
            </span>
          ))}
          {r.locs.slice(0, 24).map((c) => (
            <span className="loc" key={`c${c.chap!.num}`}>
              <button onClick={() => onOpenNode(c)}>
                <b>X {c.chap!.num}</b> <i>{c.chap!.incipit}</i>
              </button>
            </span>
          ))}
          {extraLocs > 0 && <span className="dim">+{extraLocs} more</span>}
        </div>
      )}

      {r.hits.length === 0 && (
        <div className="noresults">
          No glosses match <code>{rawQ}</code>
          {scopeBits.length > 0 && " in this scope"}.
          <br />
          <span className="dim" style={{ fontSize: 13 }}>
            Check the punctuation of the allegation (or enable “Ignore punctuation”), or try a shorter piece of the
            citation.
          </span>
        </div>
      )}

      <div>
        {r.hits.slice(0, visible).map((h) => (
          <article className="hit" key={h.u.id}>
            <header>
              <button className="cite" onClick={() => onOpenNode(h.u.node, h.u.id)}>
                <Cite u={h.u} lemmaRanges={h.lr} />
              </button>
              <span className="crumb">
                {h.u.chap ? (
                  <>
                    {h.u.book.label} · {h.u.title!.num} {h.u.title!.rubric} · cap. <i>{h.u.chap.incipit}</i>
                  </>
                ) : (
                  "Preface"
                )}
                {h.n > 1 && <> · {h.n} occurrences</>}
              </span>
            </header>
            <div className="txt">
              <Highlighted text={h.u.text} ranges={h.tr} />
            </div>
          </article>
        ))}
      </div>

      {visible < r.hits.length && (
        <button className="more-btn" onClick={() => setVisible(visible + PAGE)}>
          Show {Math.min(PAGE, r.hits.length - visible)} more ({nf(r.hits.length - visible)} remaining)
        </button>
      )}
    </>
  );
}
