"use client";

import { useEffect } from "react";
import type { ChapterNode, Flat } from "@/lib/data";
import { nodeLabel } from "@/lib/data";
import type { Norm, Range } from "@/lib/search";
import { findMatches } from "@/lib/search";
import { allegationQuery, type Capitulum } from "@/lib/abbrev";
import { Highlighted } from "@/components/Highlighted";

const IN_PRINC_TIP = "Gloss at the head of the chapter (in principio), before the first lemma";

interface Props {
  node: ChapterNode;
  flat: Flat;
  focusUnit: number | null;
  hasResults: boolean;
  /** normalized-text cache for the current mode; used to highlight the active query */
  unitNorms: { t: Norm; l: Norm | null }[] | null;
  qn: string | null;
  ww: boolean;
  /** capitula-register entry for this chapter (from the abbreviations spreadsheet) */
  register: Capitulum | null;
  onSearch: (q: string) => void;
  onBack: () => void;
  onNavigate: (node: ChapterNode) => void;
}

export default function ReadingView({ node, flat, focusUnit, hasResults, unitNorms, qn, ww, register, onSearch, onBack, onNavigate }: Props) {
  useEffect(() => {
    if (focusUnit !== null) {
      document.getElementById(`u${focusUnit}`)?.scrollIntoView({ block: "start" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [node, focusUnit]);

  const prev = node.idx > 0 ? flat.nodes[node.idx - 1] : null;
  const next = node.idx < flat.nodes.length - 1 ? flat.nodes[node.idx + 1] : null;

  const ranges = (id: number, which: "t" | "l"): Range[] => {
    if (!qn || !unitNorms) return [];
    const norm = which === "t" ? unitNorms[id].t : unitNorms[id].l;
    return norm ? findMatches(norm, qn, ww) : [];
  };

  // Only trust the register entry if its incipit agrees with the chapter heading
  // (guards against the one misnumbered duplicate heading in the source file).
  const reg =
    register &&
    node.kind === "ch" &&
    node.chap!.incipit.toLowerCase().startsWith(register.inc.toLowerCase().slice(0, 6))
      ? register
      : null;

  return (
    <>
      <div className="read-top">
        {hasResults && (
          <button className="navbtn" onClick={onBack}>
            ← Results
          </button>
        )}
        <span className="spacer" />
        {prev && (
          <button className="navbtn" title={nodeLabel(prev)} onClick={() => onNavigate(prev)}>
            ‹ {nodeLabel(prev).slice(0, 34)}
          </button>
        )}
        {next && (
          <button className="navbtn" title={nodeLabel(next)} onClick={() => onNavigate(next)}>
            {nodeLabel(next).slice(0, 34)} ›
          </button>
        )}
      </div>
      <div className="read">
        <div className="crumbs">
          {node.kind === "rp" ? (
            "Preface to the Decretals"
          ) : (
            <>
              {node.book.label} › tit. {node.title!.num} <i>{node.title!.rubric}</i>
            </>
          )}
        </div>
        <h2>
          {node.kind === "rp" ? (
            <span className="x">Rex pacificus</span>
          ) : (
            <>
              <span className="x">X {node.chap!.num}</span> {node.chap!.incipit}
            </>
          )}
        </h2>
        <div className="rubric">
          {node.kind === "rp"
            ? "Bull of promulgation of Gregory IX (5 September 1234)"
            : `tit. ${node.title!.rubric} · ${node.units.length} ${node.units.length === 1 ? "gloss" : "glosses"}`}
        </div>
        {reg && (
          <div className="reginfo">
            {reg.insc && <span className="insc">{reg.insc}</span>}
            <span>
              Incipit <i>{reg.fullInc}</i> · alleged in the gloss as{" "}
              <i>
                {reg.abbrev}, {reg.ddinc}
              </i>{" "}
              — {reg.n}× per the register
            </span>
            {reg.n > 0 && (
              <button onClick={() => onSearch(allegationQuery(reg))}>
                Find the allegations of this capitulum →
              </button>
            )}
          </div>
        )}
        {node.units.map((u) => (
          <div className={`gunit${focusUnit === u.id ? " focus" : ""}`} id={`u${u.id}`} key={u.id}>
            <div className="lem">
              {u.lemma === null ? (
                <span className="inp" title={IN_PRINC_TIP}>
                  In princ.
                </span>
              ) : (
                <Highlighted text={u.lemma} ranges={ranges(u.id, "l")} />
              )}
            </div>
            <div className="txt">
              <Highlighted text={u.text} ranges={ranges(u.id, "t")} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
