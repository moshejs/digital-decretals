import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — The Digital Decretals",
  description: "Introduction, scope and history of the Digital Decretals project, by Edward A. Reno III.",
};

export default function AboutPage() {
  return (
    <main className="page">
      <h1>About the Digital Decretals</h1>
      <p className="lede">Introduction, scope and parameters of the project — Edward A. Reno III</p>

      <h2>Welcome to the Digital Decretals</h2>
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
        structured using a virtual architecture that recreates the hierarchical division of the gloss into 5 books,
        185 titles, 1971 capitula, and thousands of gloss words (lemmata), following the sequence of the{" "}
        <i>Liber extra</i>. On this site, that architecture is the <b>Browse</b> panel beside the search page, which
        lets you jump forwards and back to any place in the text down to the lemma level (in the downloadable Word
        and PDF files, the same architecture appears as the Navigation Pane and the Bookmarks tree respectively).
      </p>
      <p>
        Second, and most significantly, the tens of thousands of legal allegations in the gloss have been
        standardized such that they can be searched and quantified. For the first time, users will be able to
        identify where and how often any particular text is cited from the <i>Liber extra</i>, Gratian's{" "}
        <i>Decretum</i>, or the 4 volumes of the <i>Corpus iuris civilis</i>: Codex, Digest, Institutes,
        Novellae/Authenticum (allegation counts for every capitulum from the <i>Liber extra</i> are included in the{" "}
        <Link href="/abbreviations">Abbreviations explorer</Link>). As anyone who has used a medieval legal commentary
        knows, the legal allegations are an absolutely essential part of assessing how individual laws were actually
        received and interpreted within the precedent-based system that medieval Canon Law evolved into coming out
        of the 12th century, and offer a vivid illustration of the central role of jurisprudence in shaping the
        legal institutions of the medieval Church.
      </p>
      <p>
        The system of legal allegations devised for the project is fairly intuitive, but it does require a brief
        tutorial to utilize — please take a moment to read the <Link href="/allegations">Legal Allegations</Link>{" "}
        page.
      </p>

      <h2>Mission statement</h2>
      <p>
        While proprietary databases and online search portals for digital texts certainly have their place, I know
        from personal experience that end users usually come up with more creative ways of exploiting the material
        than could ever be imagined by the original project designers. This creativity requires, however, that they
        have the full text at their disposal on their own devices. That is why I have decided to make the files
        available for direct download and public use (see <Link href="/text">The Text</Link>).
      </p>

      <h2>Origo operis</h2>
      <p>
        The project launched in August 2017 when Book 4 went online. The decision to start with Book 4 arose from
        several considerations. First, it provided a compact set of texts on which to test the method of
        standardizing legal allegations developed for the project. Second, the marriage material offers — in my
        opinion — the broadest potential appeal to scholars whose focus is not exclusively on medieval Canon Law.
        Furthermore, it has been my experience that many graduate students entering upon the study of medieval
        Canon Law are drawn first to Book 4, since it provides one of the clearest demonstrations of the Church's
        role in structuring family and social life in the medieval period. With this in mind it is hoped that the
        Digital Decretals, in addition to assisting researchers in legal history, will serve as a useful pedagogical
        tool for introducing the fascinating study of our discipline to a new generation of scholars.
      </p>
      <p>
        Over the next 6 years Books 1, 5, 3 and finally 2 were added, bringing the project to completion in
        September 2023. The text presented on this site is the complete, revised text of the entire gloss, Books
        1–5 (rev. 9/23).
      </p>

      <h2>Opera ventura</h2>
      <p>
        A longer essay discussing in greater detail the editorial protocols of the Digital Decretals — with
        particular focus on the implications for the manuscript transmission and early printing of the gloss — is
        in preparation; drafts are made available on{" "}
        <a href="https://adelphi.academia.edu/EdwardReno" target="_blank" rel="noopener noreferrer">
          Prof. Reno's Academia page
        </a>
        .
      </p>

      <h2>Project updates</h2>
      <ul>
        <li>
          <b>9/23:</b> A revised text of the entire gloss, Books 1–5, and an updated corresponding spreadsheet were
          released; they are the text and data presented throughout this site (downloads on{" "}
          <Link href="/text">The Text</Link>).
        </li>
        <li>
          <b>3/23:</b> The abbreviations spreadsheet gained a tab listing all the extravagantes cited in the gloss —
          now also browsable in the <Link href="/abbreviations">Abbreviations explorer</Link>.
        </li>
        <li>
          <b>8/17:</b> Project launch, with Book 4 first online.
        </li>
      </ul>

      <h2>The author</h2>
      <p>
        <b>Edward A. Reno III</b>, Associate Professor of Medieval History, Department of History, Adelphi
        University. See <Link href="/contact">Contact</Link> for feedback, suggestions for improvement, and ideas
        for expansion and collaboration.
      </p>
    </main>
  );
}
