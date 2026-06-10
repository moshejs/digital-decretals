import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Introduction, scope and history of the Digital Decretals project, by Edward A. Reno III.",
};

export default function AboutPage() {
  return (
    <main className="page">
      <h1>About the Digital Decretals</h1>
      <p className="lede">Introduction, scope and parameters of the project — Edward A. Reno III</p>

      <h2>The project</h2>
      <p>
        The Digital Decretals renders into electronic form Bernard of Parma's <i>Glossa Ordinaria</i> to the{" "}
        <i>Liber extra</i> (the Decretals of Gregory IX, 1234), based on the 1582 <i>Editio Romana</i> — Books 1–5
        in their entirety, with the tens of thousands of legal allegations standardized so they can be searched and
        quantified. The full introduction appears on the <Link href="/">search page</Link> (this site's home); the
        citation system is explained on <Link href="/allegations">Legal Allegations</Link>; transcription
        conventions and downloads are on <Link href="/text">The Text</Link>.
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
          <b>6/26:</b> The Digital Decretals relaunched as this <b>web application</b>: in-browser search of the
          complete gloss (exact-punctuation allegation matching, with ignore-punctuation / case / whole-word modes
          and book → title → chapter filters); a browse-and-read view of all 1,970 glossed capitula with
          register-backed inscriptions and one-click retrieval of each capitulum's allegations; the abbreviations
          spreadsheet reborn as a live <Link href="/abbreviations">explorer</Link>; shareable deep links to any
          search or passage; and the project documentation migrated in full. The Word/PDF/Excel files — now joined
          by per-book Word files and a single-file offline edition — remain downloadable on{" "}
          <Link href="/text">The Text</Link>.
        </li>
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
