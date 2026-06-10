"use client";

import Link from "next/link";
import { EXAMPLES, type Example } from "@/lib/examples";
import { bookGlossCount, nf, type GlossData } from "@/lib/data";
import { Fragment } from "react";

export default function Welcome({ data, onExample }: { data: GlossData; onExample: (e: Example) => void }) {
  return (
    <>
    <div className="card">
      <h2>Search the Glossa Ordinaria</h2>
      <p>
        This tool provides a free-text search of Bernard of Parma's <i>Glossa Ordinaria</i> to the{" "}
        <i>Decretals of Gregory IX</i> (1234), based on the 1582 <i>Editio Romana</i>. All legal allegations have
        been standardized by Prof. Reno so that every citation of a given law can be retrieved with a single search.
      </p>
      <p className="dim">
        Type any word or phrase above — or click an example. Use the <b>Browse</b> panel to read the gloss in order,
        book by book. Limit a search with the book / title / chapter menus.
      </p>
      <div className="ex-grid">
        {EXAMPLES.map((e) => (
          <button key={e.q} className="ex" title="Run this search" onClick={() => onExample(e)}>
            <code>{e.q}</code>
            <span className="eq">→</span>
            <span className="what">{e.what}</span>
          </button>
        ))}
      </div>
      <p className="dim" style={{ marginTop: 14 }}>
        New to the citation system? The <Link href="/allegations">Legal Allegations</Link> page explains how every
        source is cited (with try-it-now examples); the <Link href="/abbreviations">Abbreviations</Link> explorer
        lets you look up any title abbreviation or capitulum — including how often each is alleged in the gloss;
        transcription conventions and the downloadable Word/PDF/spreadsheet files are on{" "}
        <Link href="/text">The Text</Link>.
      </p>
      <p className="stats-line">
        Currently online:{" "}
        {data.books.map((b, i) => (
          <Fragment key={b.id}>
            {i > 0 && " · "}
            <b>{b.label}</b> ({nf(bookGlossCount(b))} glosses)
          </Fragment>
        ))}{" "}
        — {nf(data.stats.units)} gloss units in all, under {nf(data.stats.chapters)} capitula ({data.source},{" "}
        {data.generated}).
      </p>
    </div>

    <div className="card">
      <h2>Welcome to the Digital Decretals</h2>
      <p className="dim" style={{ fontSize: 13 }}>
        [NB 9/23: this site presents the revised text of the entire gloss, Books 1–5, together with the updated
        corresponding spreadsheet — both downloadable on <Link href="/text">The Text</Link> page.]
      </p>
      <p>
        This is a Digital Humanities project to render into electronic form Bernard of Parma's commentary on the{" "}
        <i>Liber extra</i>, the first official and exclusive collection of canon law for the Catholic Church, edited
        by the Dominican St. Raymond of Penyafort (1175–1275) and promulgated in 1234 by Pope Gregory IX (1227–41).
        Although it was one of a number of commentaries on the <i>Liber extra</i> produced in the 13th century,
        Bernard's work would quickly become canonized as the <i>Glossa Ordinaria</i> to the collection, and became
        the foundation for canon law instruction on the <i>Liber extra</i> in the medieval University. It is, thus,
        the commentary found copied into the margins of the overwhelming majority of surviving <i>Liber extra</i>{" "}
        manuscripts. The version of the text presented here is based upon the 1582 printed edition dubbed the{" "}
        <i>Editio Romana</i>, put together by the commission known as the Correctores Romani and published by order
        of Pope Gregory XIII (1572–85) as part of the authorized text of the <i>Corpus iuris canonici</i> for the
        post-Tridentine Church.
      </p>
      <p>
        This digital version, which presents Books 1 through 5 of the <i>Glossa Ordinaria</i> in their entirety,
        does two things. First, and most obviously, it provides a fully searchable text of the gloss. The text is
        structured by a virtual architecture that recreates the hierarchical division of the gloss into 5 books, 185
        titles, 1971 capitula, and thousands of gloss words (lemmata), following the sequence of the{" "}
        <i>Liber extra</i> — explore it through the <b>Browse</b> panel here, or through the Navigation Pane /
        Bookmarks tree of the downloadable Word and PDF files. This allows a user to quickly jump forwards and back
        to any place in the text down to the lemma level.
      </p>
      <p>
        Second, and most significantly, the tens of thousands of legal allegations in the gloss have been
        standardized such that they can be searched and quantified. For the first time, users will be able to
        identify where and how often any particular text is cited from the <i>Liber extra</i>, Gratian's{" "}
        <i>Decretum</i>, or the 4 volumes of the <i>Corpus iuris civilis</i>: Codex, Digest, Institutes,
        Novellae/Authenticum (allegation counts for every capitulum from the <i>Liber extra</i> are included in the{" "}
        <Link href="/abbreviations">Abbreviations explorer</Link> and the ancillary spreadsheet). As anyone who has
        used a medieval legal commentary knows, the legal allegations are an absolutely essential part of assessing
        how individual laws were actually received and interpreted within the precedent-based system that medieval
        Canon Law evolved into coming out of the 12th century, and offer a vivid illustration of the central role of
        jurisprudence in shaping the legal institutions of the medieval Church.
      </p>
      <p>
        The text also remains available for download as Microsoft Word and/or PDF files (see{" "}
        <Link href="/text">The Text</Link> page for the download links), in which searches are done through the
        native program — usually Ctrl+F in Word (which opens a search bar in the Navigation Pane) and Shift+Ctrl+F
        in Acrobat (the advanced search feature). On this site, the search bar above does the same work directly in
        your browser.
      </p>
      <p>
        The system of legal allegations devised for the project is fairly intuitive, but it does require a brief
        tutorial to utilize, so please take a moment to read the <Link href="/allegations">Legal Allegations</Link>{" "}
        page.
      </p>
      <p className="dim">
        Edward A. Reno III · Associate Professor of Medieval History · Adelphi University, Department of History
      </p>
    </div>
    </>
  );
}
