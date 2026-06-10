"use client";

import { useEffect, useRef } from "react";
import type { Book, Chapter, GlossData, Title } from "@/lib/data";

export interface Mode {
  cs: boolean;
  ip: boolean;
  ww: boolean;
  or: boolean; // orthographic tolerance: ae/oe ≡ e, v ≡ u
}
export interface Scope {
  book: Book | null;
  title: Title | null;
  chap: Chapter | null;
}

interface Props {
  data: GlossData;
  rawQ: string;
  mode: Mode;
  scope: Scope;
  onQuery: (q: string, immediate?: boolean) => void;
  onMode: (m: Mode) => void;
  onScope: (s: Scope) => void;
  onOpenTree: () => void;
}

export default function Toolbar({ data, rawQ, mode, scope, onQuery, onMode, onScope, onOpenTree }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  // "/" focuses the search box
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      const el = document.activeElement;
      if (ev.key === "/" && el !== inputRef.current && !/INPUT|SELECT|TEXTAREA/.test(el?.tagName ?? "")) {
        ev.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const books = data.books;
  const titles = scope.book?.titles ?? [];
  const chapters = scope.title?.chapters ?? [];

  return (
    <div className="toolbar">
      <div className="tool-inner">
        <button className="toggle-tree" aria-label="Browse the text" onClick={onOpenTree}>
          ☰ Browse
        </button>
        <div className="searchwrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            id="q"
            ref={inputRef}
            type="search"
            autoComplete="off"
            spellCheck={false}
            placeholder="Search the gloss… e.g.  qui fil. sint legit., per venerabilem"
            aria-label="Search the gloss"
            value={rawQ}
            onChange={(e) => onQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onQuery((e.target as HTMLInputElement).value, true);
              if (e.key === "Escape") inputRef.current?.blur();
            }}
          />
          {rawQ && (
            <button className="clearq" aria-label="Clear search" onClick={() => { onQuery("", true); inputRef.current?.focus(); }}>
              ✕
            </button>
          )}
          <span className="kbd-hint">/</span>
        </div>
        <div className="filters" role="group" aria-label="Limit search scope">
          <select
            aria-label="Limit to book"
            value={scope.book ? String(books.indexOf(scope.book)) : ""}
            onChange={(e) =>
              onScope({ book: e.target.value === "" ? null : books[+e.target.value], title: null, chap: null })
            }
          >
            <option value="">All books</option>
            {books.map((b, i) => (
              <option key={b.id} value={i}>
                {b.label}
              </option>
            ))}
          </select>
          <select
            aria-label="Limit to title"
            disabled={!scope.book || !titles.length}
            value={scope.title ? String(titles.indexOf(scope.title)) : ""}
            onChange={(e) =>
              onScope({
                book: scope.book,
                title: e.target.value === "" ? null : titles[+e.target.value],
                chap: null,
              })
            }
          >
            <option value="">{scope.book && !titles.length ? "— no titles —" : "All titles"}</option>
            {titles.map((t, i) => (
              <option key={t.num} value={i}>
                {t.num} — {t.rubric}
              </option>
            ))}
          </select>
          <select
            aria-label="Limit to chapter"
            disabled={!scope.title}
            value={scope.chap ? String(chapters.indexOf(scope.chap)) : ""}
            onChange={(e) =>
              onScope({
                book: scope.book,
                title: scope.title,
                chap: e.target.value === "" ? null : chapters[+e.target.value],
              })
            }
          >
            <option value="">All chapters</option>
            {chapters.map((c, i) => (
              <option key={c.num} value={i}>
                {c.num} {c.incipit}
              </option>
            ))}
          </select>
        </div>
        <div className="opts">
          <label title="Match upper/lower case exactly">
            <input type="checkbox" checked={mode.cs} onChange={(e) => onMode({ ...mode, cs: e.target.checked })} />
            Match case
          </label>
          <label title="Ignore . , ; : ( ) and other punctuation when matching">
            <input type="checkbox" checked={mode.ip} onChange={(e) => onMode({ ...mode, ip: e.target.checked })} />
            Ignore punctuation
          </label>
          <label title="Match whole words only (useful for jurist sigla such as Host. or for ‘versus’)">
            <input type="checkbox" checked={mode.ww} onChange={(e) => onMode({ ...mode, ww: e.target.checked })} />
            Whole words
          </label>
          <label title="Treat ae/oe as e and v as u, so medieval spellings match the classical orthography of the text (penitentia → poenitentia, uultus → vultus)">
            <input type="checkbox" checked={mode.or} onChange={(e) => onMode({ ...mode, or: e.target.checked })} />
            ae/oe ≡ e, v ≡ u
          </label>
        </div>
      </div>
    </div>
  );
}
