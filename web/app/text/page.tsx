import type { Metadata } from "next";
import Link from "next/link";
import { asset } from "@/lib/abbrev";

export const metadata: Metadata = {
  title: "The Text",
  description:
    "Transcription conventions of the Digital Decretals (text base, orthography, abbreviations, punctuation, numeration) and downloads: Word, PDF, and the abbreviations spreadsheet.",
};

const DL = [
  {
    file: "Decretals Gloss, Books 1-5 Complete, rev. 9.23.docx",
    label: "Glossa Ordinaria, Books 1–5 Complete — Word",
    note: "Rev. 9/23 · the gloss architecture is viewable through Word's Navigation Pane · 2.4 MB",
    ico: "📄",
  },
  {
    file: "Decretals Gloss, Books 1-5 Complete, rev. 9.23.pdf",
    label: "Glossa Ordinaria, Books 1–5 Complete — PDF",
    note: "Rev. 9/23 · the gloss architecture is viewable through the Bookmarks tree · 8.4 MB",
    ico: "📕",
  },
  {
    file: "Decretals Gloss Title Abbreviations, rev. 9.23.xlsx",
    label: "Title Abbreviations spreadsheet — Excel",
    note: "Rev. 9/23 · 9 sheets: capitula register, extravagantes, and all title abbreviations · 0.4 MB",
    ico: "📗",
  },
];

const BOOKS_DL = [
  ["Book 1", "incl. the Rex pacificus preface · 43 titles, 2,524 lemmata"],
  ["Book 2", "30 titles, 2,011 lemmata"],
  ["Book 3", "50 titles, 2,358 lemmata"],
  ["Book 4", "21 titles, 842 lemmata"],
  ["Book 5", "41 titles, 2,137 lemmata"],
];

export default function TextPage() {
  return (
    <main className="page">
      <h1>The Text</h1>
      <p className="lede">
        The conventions governing the transcription of the text, and the downloadable files. For the conventions
        employed for rendering and searching the legal allegations — along with citations of other jurists, and
        mnemonic verses — see <Link href="/allegations">Legal Allegations</Link>.
      </p>

      <h2>Text base</h2>
      <p>
        Taking as its base the text of the <i>Editio Romana</i> [=ER], the Digital Decretals aims to present the{" "}
        <i>Glossa Ordinaria</i> in full. A few elements that were intermixed with the gloss in the ER have therefore
        been excluded:
      </p>
      <ul>
        <li>
          First off, Bernard's <i>Casus longi</i>, which were not, in any case, embedded in editions of the gloss
          until the 16th century, have been left out. The exception to this is when Bernard himself decided to
          transmit the text of one of his <i>Casus</i> in the form of a gloss using the incipit as the lemma (a fact
          attested in the earliest manuscripts of the gloss).
        </li>
        <li>
          Also excluded, for obvious reasons, are the editorial remarks of the Correctores Romani themselves, which
          appear in the ER as italicized text inserted into the gloss.
        </li>
        <li>
          Furthermore, all of the non-Bernard material that post-dates his final recension of the{" "}
          <i>Glossa Ordinaria</i> (completed in the 1260s) has been excluded. In the main, this consists of the{" "}
          <i>communi divisiones</i> of later canonists like Panormitanus (aka Nicholas de Tudeschi / Abbas Siculus /
          Abbas Modernus), Antonius de Butrio or Johannes Andreae that appear at the beginning of the gloss of many
          capitula, along with some occasional later additions appended to existing lemmata (identified and
          separated off by the Correctores from the older material with an <i>Additio</i> heading), or keyed to
          entirely new lemmata — much of which was taken from Johannes Andreae's <i>Liber extra</i> commentary.
        </li>
      </ul>
      <p>
        Kept, however, are all of the non-Bernard glosses that he himself added from previous canonists like
        Vincentius Hispanus, Johannes Teutonicus, Alanus Anglicus and others, which are identified as such by those
        canonists' sigla (on querying the names of specific jurists, see{" "}
        <Link href="/allegations#jurists">Legal Allegations</Link>). Besides the <i>Casus</i> and the Correctores'
        comments, the sum total of the non-Bernard material excluded is actually quite minimal, and Prof. Reno is
        open in the future to adding it back in.
      </p>

      <h2>Orthography</h2>
      <p>
        The orthography of the ER has basically been followed — the changes applied for the sake of standardization
        have tended to skew in the direction of classical spelling rather than medieval usage. Thus, most of the
        diphthongs are spelled out, particularly "ae" and "oe" instead of just "e" (e.g., <i>quae</i> instead of{" "}
        <i>que</i>; <i>saecularis</i> instead of <i>secularis</i>; <i>poenitentia</i> instead of <i>penitentia</i>).
        There are a few exceptions arising from the conventions of the abbreviated titles, but these may be easily
        gleaned from a simple spot-search of the text (e.g., <i>hereditas</i> instead of <i>haereditas</i>;{" "}
        <i>femina</i> instead of <i>foemina</i>). Finally, "v" is used in its classical form rather than "u" (
        <i>vultus</i> instead of <i>uultus</i>).
      </p>
      <p>
        The overall imperative has been to achieve consistency, and so once an orthographical form has been settled
        upon, it is used consistently throughout the entire transcription. Note that no diacritical marks have been
        employed, such as a cedilla (ę), diaeresis (ö), or accents (é).
      </p>

      <h2>Abbreviations</h2>
      <p>
        All of the conventional textual abbreviations in the printed edition have been expanded, with the exception
        of a few stock elements that are pervasive in medieval and early modern legal commentary. These are limited
        to:
      </p>
      <ul>
        <li>
          <i>arg.</i> = argumentum, -a; arguit; arguitur
        </li>
        <li>
          <i>colum.</i> = columna
        </li>
        <li>
          <i>etc.</i> = et caetera
        </li>
        <li>
          <i>fi.</i> = [ad/in] finem, -e; finalis
        </li>
        <li>
          <i>not.</i> = nota; notatur
        </li>
        <li>
          <i>penulti.</i> = penultimus, -a, -um
        </li>
        <li>
          <i>princ.</i> = [circa/in] principium, -o
        </li>
        <li>
          <i>resp.</i> = responsum; respondeo; responditur; responsio
        </li>
        <li>
          <i>sol.</i> = solutio; solvo; solvitur; solve
        </li>
        <li>
          <i>ulti.</i> = ultimus, -a, -um
        </li>
        <li>
          <i>vers.</i> = versus [only in the context of legal allegations; when introducing a mnemonic verse, the
          expanded <i>versus</i> or <i>versibus</i> is always employed]
        </li>
      </ul>

      <h2>Punctuation</h2>
      <p>
        While the punctuation of the ER is not necessarily idiosyncratic, it is governed by conventions that are no
        longer appropriate in modern usage, even for a Latin legal text. The punctuation has therefore been
        standardized, prioritizing making grammatical sense of the sentences:
      </p>
      <ul>
        <li>
          <b>.</b> The period does the normal work of ending sentences and marking the abbreviations in the legal
          allegations.
        </li>
        <li>
          <b>,</b> Commas are employed to divide sentences into their discrete grammatical elements, and to
          distinguish the separate units of the legal allegations.
        </li>
        <li>
          <b>;</b> Semi-colons are employed essentially as in modern English to separate two disparate but conjoined
          thoughts, and to break into discrete components a long list/series of similar items. The semi-colon is
          also used to separate a string of legal allegations.
        </li>
        <li>
          <b>:</b> Colons are seldom used, and are reserved for things like the introduction of quotations or cited
          text.
        </li>
        <li>
          <b>?</b> The ER's practice of adding question marks at the end of sentences formed as a question is
          replicated.
        </li>
      </ul>
      <p>
        Besides those just mentioned, no other punctuation marks have been employed in the text, such as hyphens (–),
        quotation marks (" "), parentheses ( ), or square brackets [ ]. The one exception is the addition of a
        double slash // to mark line breaks in the mnemonic verses, which are discussed at the bottom of the{" "}
        <Link href="/allegations#verses">Legal Allegations</Link> page.
      </p>

      <h2>Numeration</h2>
      <p>
        The ER is not consistent in how it records numbers, and employs all three conventions — Latin numerals (X),
        alphabetized enumeration (decem), and Arabic numerals (10) — sometimes in the same gloss. To avoid any
        confusion with the legal allegations, the numeration has been standardized in alphabetized form, reserving
        Arabic numerals for the legal allegations and Latin numerals for proper names (e.g., Innocentius III).
      </p>

      <h2>Downloads</h2>
      <p className="note">
        Per the project's mission, the full text is yours to download and use on your own devices. A file of the
        complete gloss (Books 1–5, rev. 9/23) is given first, followed by separate files for individual books for
        those looking to do more targeted investigation book by book. The same materials are also available on the{" "}
        <a href="https://sites.google.com/view/digitaldecretals/the-text" target="_blank" rel="noopener noreferrer">
          original site
        </a>{" "}
        (whose "Embedded Text" pages, provided there for quick in-browser searching, are superseded here by the{" "}
        <Link href="/">Search</Link> page).
      </p>
      {DL.map((d) => (
        <div className="dl-card" key={d.file}>
          <span className="ico" aria-hidden>
            {d.ico}
          </span>
          <span className="meta">
            <b>{d.label}</b>
            <span>{d.note}</span>
          </span>
          <a className="get" href={asset(`/downloads/${encodeURIComponent(d.file)}`)} download>
            Download
          </a>
        </div>
      ))}
      <div className="dl-card">
        <span className="ico" aria-hidden>
          🌐
        </span>
        <span className="meta">
          <b>Single-file offline edition — HTML</b>
          <span>
            The complete searchable edition (search, filters, browse) in one 5 MB file: download it, double-click
            it, and it works in any browser with no internet connection — handy for archives, travel, and teaching.
          </span>
        </span>
        <a className="get" href={asset("/downloads/digital-decretals-offline.html")} download>
          Download
        </a>
      </div>
      <h3>Individual books (Word, rev. 9/23)</h3>
      {BOOKS_DL.map(([book, note]) => {
        const file = `Glossa Ordinaria to the Decretals, ${book}, rev. 9.23.docx`;
        return (
          <div className="dl-card" key={book}>
            <span className="ico" aria-hidden>
              📄
            </span>
            <span className="meta">
              <b>Glossa Ordinaria — {book}</b>
              <span>{note}</span>
            </span>
            <a className="get" href={asset(`/downloads/${encodeURIComponent(file)}`)} download>
              Download
            </a>
          </div>
        );
      })}

      <h3>Comment on use of the Word file</h3>
      <p>
        The gloss architecture is viewable through the Navigation Pane sidebar, which can be opened by checking the
        "Navigation Pane" box under the "View" tab in the top menu. To search the text in Word (Ctrl+F), it helps to
        have enabled the "Highlight all" and "Incremental find" options in the Navigation sidebar that opens
        automatically when doing a search (these appear as a dropdown list when clicking on the down arrow at the
        right of the bar where the text is entered). Additional options, such as prefix/suffix matching, searching
        whole words only, or ignoring punctuation, may occasionally prove useful as well.
      </p>
      <h3>Comment on use of the PDF file</h3>
      <p>
        The gloss architecture is viewable through the Bookmarks tree in the left sidebar of Adobe Acrobat. Note
        that of the two search methods in Acrobat, the advanced search feature (Shift+Ctrl+F) is usually more useful
        — as opposed to the basic find function (Ctrl+F) — since it opens up a separate window and produces a
        hyperlinked list of all search hits.
      </p>

      <h2>The abbreviations spreadsheet</h2>
      <p>
        The spreadsheet contains 9 separate sheets (all of its data is also browsable directly in the{" "}
        <Link href="/abbreviations">Abbreviations explorer</Link>):
      </p>
      <ul>
        <li>
          <b>Decretals Capitula:</b> a register of all 1971 capitula of the <i>Liber extra</i> and extravagantes
          cited in the gloss, along with their relevant identifying information: modern reference number, title,
          incipit (both a full incipit and the one used in the Digital Decretals), the inscription, and finally the
          number of times each capitulum is alleged in the gloss.
        </li>
        <li>
          <b>Decretals Sortable:</b> a quick-start version of the first tab, with just the modern numerical
          reference, the abbreviated title, the Digital Decretals incipit, and the allegation count for each
          capitulum. It is unlocked so you can play around freely with regrouping the texts according to different
          parameters, without worrying about compromising the integrity of the information.
        </li>
        <li>
          <b>Extravagantes:</b> a list of all the post-1234 extravagantes cited in the gloss, along with the titles
          under which they were placed.
        </li>
        <li>
          <b>Decretals Titles:</b> a list of the abbreviations for the 185 Decretals titles.
        </li>
        <li>
          <b>Combined CL and RL Titles:</b> a combined list of every title abbreviation <i>in utroque</i> used in
          the gloss, arranged alphabetically by abbreviation.
        </li>
        <li>
          Four additional sheets that list the title abbreviations for each separate volume of the{" "}
          <i>Corpus iuris civilis</i> (Codex, Digest, Institutes, Novellae).
        </li>
      </ul>
      <p>
        Note that each sheet (except for the "Decretals Sortable" tab) is individually protected with the same
        password, <b>Decretals</b>, visible at the top of every page. This is to prevent accidental cell overwrite;
        you may unprotect any and all sheets to sort the data or to add to them however you like (the "Unprotect
        Sheet" option under the "Review" tab in Excel). Please note that the spreadsheet does not contain an
        abbreviation for every Roman Law title in the <i>Corpus iuris civilis</i>, but only those that have been
        cited in the gloss.
      </p>
    </main>
  );
}
