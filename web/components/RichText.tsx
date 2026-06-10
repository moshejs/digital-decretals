import { Fragment } from "react";
import type { Range } from "@/lib/search";
import type { LinkRange } from "@/lib/data";
import { BASE } from "@/lib/abbrev";
import { Highlighted } from "@/components/Highlighted";

/**
 * Gloss text with citation hypertext (allegations link to their capitulum)
 * and search-match highlighting. Works as a server component (plain <a>) or,
 * when `onRef` is provided by a client component, navigates in-app instead.
 */
export function RichText({
  text,
  marks,
  links,
  onRef,
}: {
  text: string;
  marks: Range[];
  links: LinkRange[];
  onRef?: (ref: string) => void;
}) {
  if (!links.length) return <Highlighted text={text} ranges={marks} />;

  const sub = (a: number, b: number): Range[] =>
    marks.filter(([s, e]) => e > a && s < b).map(([s, e]) => [Math.max(s, a) - a, Math.min(e, b) - a]);

  const out: React.ReactNode[] = [];
  let pos = 0;
  links.forEach(([s, e, ref], i) => {
    if (s < pos) return;
    if (s > pos)
      out.push(
        <Fragment key={`t${i}`}>
          <Highlighted text={text.slice(pos, s)} ranges={sub(pos, s)} />
        </Fragment>
      );
    out.push(
      <a
        key={`l${i}`}
        className="alleg"
        href={`${BASE}/x/${ref}/`}
        title={`Go to X ${ref}`}
        onClick={
          onRef
            ? (ev) => {
                ev.preventDefault();
                onRef(ref);
              }
            : undefined
        }
      >
        <Highlighted text={text.slice(s, e)} ranges={sub(s, e)} />
      </a>
    );
    pos = e;
  });
  if (pos < text.length)
    out.push(
      <Fragment key="tail">
        <Highlighted text={text.slice(pos)} ranges={sub(pos, text.length)} />
      </Fragment>
    );
  return <>{out}</>;
}
