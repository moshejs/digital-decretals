"use client";

import { useState } from "react";
import type { Book, ChapterNode, Flat, GlossData, Title } from "@/lib/data";

interface Props {
  data: GlossData;
  flat: Flat;
  activeNode: ChapterNode | null;
  open: boolean; // mobile drawer
  onOpenNode: (node: ChapterNode) => void;
}

export default function Tree({ data, flat, activeNode, open, onOpenNode }: Props) {
  return (
    <aside className={`tree${open ? " open" : ""}`} aria-label="Browse by book, title and chapter">
      <div className="tree-head">Browse the text</div>
      <div>
        {data.books.map((book) =>
          book.id === "RP" ? (
            <div className="tnode tbook" key={book.id}>
              <button
                className="tchap tleaf-rp"
                onClick={() => {
                  const node = flat.nodes.find((n) => n.kind === "rp");
                  if (node) onOpenNode(node);
                }}
              >
                <span className="num">¶</span>Rex pacificus <span className="dim">(preface)</span>
              </button>
            </div>
          ) : (
            <BookNode key={book.id} book={book} flat={flat} activeNode={activeNode} onOpenNode={onOpenNode} />
          )
        )}
      </div>
    </aside>
  );
}

function BookNode({
  book,
  flat,
  activeNode,
  onOpenNode,
}: {
  book: Book;
  flat: Flat;
  activeNode: ChapterNode | null;
  onOpenNode: (n: ChapterNode) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`tnode tbook${open ? " open" : ""}`}>
      <button onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="car">▶</span>
        <span>{book.label}</span> <span className="tcount">{book.titles.length} tit.</span>
      </button>
      {open && (
        <div className="tkids">
          {book.titles.map((t) => (
            <TitleNode key={t.num} title={t} flat={flat} activeNode={activeNode} onOpenNode={onOpenNode} />
          ))}
        </div>
      )}
    </div>
  );
}

function TitleNode({
  title,
  flat,
  activeNode,
  onOpenNode,
}: {
  title: Title;
  flat: Flat;
  activeNode: ChapterNode | null;
  onOpenNode: (n: ChapterNode) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`tnode ttitle${open ? " open" : ""}`}>
      <button onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="car">▶</span>
        <span className="num">{title.num}</span>
        <span>{title.rubric}</span>
      </button>
      {open && (
        <div className="tkids">
          {title.chapters.map((chap) => {
            const node = flat.nodes.find((n) => n.chap === chap)!;
            return (
              <button
                key={chap.num}
                className={`tchap${activeNode === node ? " active" : ""}`}
                onClick={() => onOpenNode(node)}
              >
                <span className="num">{chap.num.split(".").pop()}</span>
                {chap.incipit}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
