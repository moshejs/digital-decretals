import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BY_REF, CHAPTERS, REGISTER, uniqueRefs, type ChapterEntry } from "@/lib/chapters";
import { allegationQuery } from "@/lib/abbrev";
import { RichText } from "@/components/RichText";

export const dynamicParams = false;

export function generateStaticParams() {
  return uniqueRefs.map((ref) => ({ ref }));
}

const IN_PRINC_TIP = "Gloss at the head of the chapter (in principio), before the first lemma";

function entryLabel(e: ChapterEntry) {
  return e.chap ? `X ${e.chap.num} ${e.chap.incipit}` : "Rex pacificus";
}

export async function generateMetadata({ params }: { params: Promise<{ ref: string }> }): Promise<Metadata> {
  const { ref } = await params;
  const entries = BY_REF.get(decodeURIComponent(ref));
  if (!entries) return {};
  const e = entries[0];
  const name = e.chap ? `X ${e.chap.num} ${e.chap.incipit}` : "Rex pacificus (preface)";
  const first = e.chap
    ? `Glossa Ordinaria on X ${e.chap.num} ${e.chap.incipit} (tit. ${e.title!.rubric}, ${e.book.label}): ${e.chap.units.length} glosses.`
    : "Bernard of Parma's gloss on Rex pacificus, the bull of promulgation of the Decretals of Gregory IX.";
  return { title: name, description: `${first} Bernard of Parma's Glossa Ordinaria, searchable Digital Decretals edition by Edward A. Reno III.` };
}

export default async function ChapterPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const entries = BY_REF.get(decodeURIComponent(ref));
  if (!entries) notFound();

  return (
    <main className="page" style={{ maxWidth: 920 }}>
      {entries.map((e, dup) => {
        const reg = e.chap ? REGISTER.get(e.chap.num) : undefined;
        const regOk =
          reg && e.chap && e.chap.incipit.toLowerCase().startsWith(reg.inc.toLowerCase().slice(0, 6)) ? reg : null;
        const prev = e.idx > 0 ? CHAPTERS[e.idx - 1] : null;
        const next = e.idx < CHAPTERS.length - 1 ? CHAPTERS[e.idx + 1] : null;
        const units = e.chap ? e.chap.units : e.book.units;
        return (
          <article key={dup} style={dup > 0 ? { marginTop: 40 } : undefined}>
            {dup === 0 && (
              <div className="read-top">
                {prev && (
                  <Link className="navbtn" href={`/x/${prev.ref}/`}>
                    ‹ {entryLabel(prev).slice(0, 34)}
                  </Link>
                )}
                <span className="spacer" />
                {next && (
                  <Link className="navbtn" href={`/x/${next.ref}/`}>
                    {entryLabel(next).slice(0, 34)} ›
                  </Link>
                )}
              </div>
            )}
            {entries.length > 1 && (
              <p className="note">
                Note: the source file numbers two successive chapters X {e.chap!.num}; both are given here as
                transcribed. Per the register, X {e.chap!.num} = <i>{REGISTER.get(e.chap!.num)?.inc}</i>.
              </p>
            )}
            <div className="read">
              <div className="crumbs">
                {e.chap ? (
                  <>
                    {e.book.label} › tit. {e.title!.num} <i>{e.title!.rubric}</i>
                  </>
                ) : (
                  "Preface to the Decretals"
                )}
              </div>
              <h2>
                {e.chap ? (
                  <>
                    <span className="x">X {e.chap.num}</span> {e.chap.incipit}
                  </>
                ) : (
                  <span className="x">Rex pacificus</span>
                )}
              </h2>
              <div className="rubric">
                {e.chap
                  ? `tit. ${e.title!.rubric} · ${units.length} ${units.length === 1 ? "gloss" : "glosses"}`
                  : "Bull of promulgation of Gregory IX (5 September 1234)"}
              </div>
              {regOk && (
                <div className="reginfo">
                  {regOk.insc && <span className="insc">{regOk.insc}</span>}
                  <span>
                    Incipit <i>{regOk.fullInc}</i> · alleged in the gloss as{" "}
                    <i>
                      {regOk.abbrev}, {regOk.ddinc}
                    </i>{" "}
                    — {regOk.n}× per the register
                    {regOk.n > 0 && (
                      <>
                        {" · "}
                        <Link href={`/?q=${encodeURIComponent(allegationQuery(regOk))}`}>find the allegations →</Link>
                      </>
                    )}
                  </span>
                </div>
              )}
              {units.map((u, i) => (
                <div className="gunit" key={i}>
                  <div className="lem" lang="la">
                    {u.lemma === null ? (
                      <span className="inp" title={IN_PRINC_TIP}>
                        In princ.
                      </span>
                    ) : (
                      u.lemma
                    )}
                  </div>
                  <div className="txt" lang="la">
                    <RichText text={u.text} marks={[]} links={u.k ?? []} />
                  </div>
                </div>
              ))}
            </div>
            {dup === entries.length - 1 && (
              <p className="dim" style={{ marginTop: 14, fontSize: 13 }}>
                <Link href={e.chap ? `/?loc=${e.chap.num}` : "/?loc=RP"}>Open in the search app</Link> — full-text
                search, highlighting, and the complete browse tree. Underlined phrases are standardized allegations;
                each links to the capitulum it cites.
              </p>
            )}
          </article>
        );
      })}
    </main>
  );
}
