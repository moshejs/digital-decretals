import type { Range } from "@/lib/search";
import type { FlatUnit } from "@/lib/data";
import { Fragment } from "react";

/** Text with <mark> wrapped around each match range. */
export function Highlighted({ text, ranges }: { text: string; ranges: Range[] }) {
  if (!ranges.length) return <>{text}</>;
  const parts: React.ReactNode[] = [];
  let pos = 0;
  ranges.forEach(([a, b], i) => {
    if (a < pos) return;
    if (a > pos) parts.push(<Fragment key={`t${i}`}>{text.slice(pos, a)}</Fragment>);
    parts.push(<mark key={`m${i}`}>{text.slice(a, b)}</mark>);
    pos = b;
  });
  if (pos < text.length) parts.push(<Fragment key="tail">{text.slice(pos)}</Fragment>);
  return <>{parts}</>;
}

const IN_PRINC_TIP = "Gloss at the head of the chapter (in principio), before the first lemma";

/** Citation line, e.g. "X 4.17.13 s.v. Habeat potestatem" or "Rex pacificus, s.v. Salutem". */
export function Cite({ u, lemmaRanges }: { u: FlatUnit; lemmaRanges: Range[] }) {
  const lem =
    u.lemma === null ? (
      <span className="sv" title={IN_PRINC_TIP}>
        in princ.
      </span>
    ) : (
      <>
        <span className="sv">s.v.</span>{" "}
        <em>
          <Highlighted text={u.lemma} ranges={lemmaRanges} />
        </em>
      </>
    );
  if (!u.chap) return <>Rex pacificus, {lem}</>;
  return (
    <>
      X {u.chap.num}
      {u.lemma === null ? ", " : " "}
      {lem}
    </>
  );
}
