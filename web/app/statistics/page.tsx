import type { Metadata } from "next";
import Link from "next/link";
import stats from "@/data/stats.json";
import { nf } from "@/lib/data";

export const metadata: Metadata = {
  title: "Statistics",
  description:
    "Quantitative views of the Glossa Ordinaria: the most-alleged capitula of the Liber extra, citation markers by source corpus, jurist sigla frequencies, and the anthology of mnemonic verses.",
};

export default function StatisticsPage() {
  const s = stats;
  const dec =
    s.sources.decretum_causa + s.sources.decretum_dist + s.sources.decretum_poen + s.sources.decretum_conse;
  const roman = s.sources.digest_ff + s.sources.codex_C_de + s.sources.inst + s.sources.auth;
  return (
    <main className="page" style={{ maxWidth: 980 }}>
      <h1>Statistics</h1>
      <p className="lede">
        Quantitative views of the gloss, computed from the rev. 9/23 text and register. Where a figure rests on a
        heuristic rather than an exact construction, it says so.
      </p>

      <h2>The corpus</h2>
      <p>
        {nf(s.totals.units)} gloss units under {nf(s.totals.chapters)} glossed capitula headings in {s.totals.titles}{" "}
        titles across {s.totals.books} books (plus the Rex pacificus preface) — {nf(s.totals.chars)} characters of
        Latin. The register records {nf(s.totals.registerAllegations)} <i>Liber extra</i> allegations across{" "}
        {nf(s.totals.registerCapitula)} capitula; the citation hypertext on this site links{" "}
        {nf(s.totals.linkedAllegations)} of them in place (the difference of one is a documented register
        over-count at X 1.22.1).
      </p>
      <table className="abbr" style={{ maxWidth: 560 }}>
        <thead>
          <tr>
            <th>Book</th>
            <th style={{ textAlign: "right" }}>Glosses</th>
            <th style={{ textAlign: "right" }}>Linked allegations</th>
          </tr>
        </thead>
        <tbody>
          {s.perBook.map((b) => (
            <tr key={b.book}>
              <td>{b.book}</td>
              <td className="n">{nf(b.units)}</td>
              <td className="n">{nf(b.links)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Citations by source corpus</h2>
      <p className="dim">
        <i>Liber extra</i> cross-references are exact (constructed from the standardized allegations). The other
        figures count citation markers in the text — a close proxy, honestly approximate.
      </p>
      <table className="abbr" style={{ maxWidth: 640 }}>
        <thead>
          <tr>
            <th>Source</th>
            <th>Marker</th>
            <th style={{ textAlign: "right" }}>Count</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Liber extra (internal cross-references)</td>
            <td className="ab">standardized allegations</td>
            <td className="n">{nf(s.sources.liberExtraLinked)}</td>
          </tr>
          <tr>
            <td>Extravagantes (post-1234)</td>
            <td className="ab">extravag.</td>
            <td className="n">{nf(s.sources.extravag)}</td>
          </tr>
          <tr>
            <td>Decretum Gratiani — Causae</td>
            <td className="ab">n. q. n</td>
            <td className="n">{nf(s.sources.decretum_causa)}</td>
          </tr>
          <tr>
            <td>Decretum — Distinctiones</td>
            <td className="ab">n. dist.</td>
            <td className="n">{nf(s.sources.decretum_dist)}</td>
          </tr>
          <tr>
            <td>Decretum — De poenitentia / De consecratione</td>
            <td className="ab">de poen. dist. / de conse. dist.</td>
            <td className="n">{nf(s.sources.decretum_poen + s.sources.decretum_conse)}</td>
          </tr>
          <tr>
            <td>Digest</td>
            <td className="ab">ff.</td>
            <td className="n">{nf(s.sources.digest_ff)}</td>
          </tr>
          <tr>
            <td>Codex</td>
            <td className="ab">C. de …</td>
            <td className="n">{nf(s.sources.codex_C_de)}</td>
          </tr>
          <tr>
            <td>Institutes</td>
            <td className="ab">Inst.</td>
            <td className="n">{nf(s.sources.inst)}</td>
          </tr>
          <tr>
            <td>Novellae / Authenticum</td>
            <td className="ab">in Auth.</td>
            <td className="n">{nf(s.sources.auth)}</td>
          </tr>
        </tbody>
      </table>
      <p>
        Roughly {nf(s.sources.liberExtraLinked + s.sources.extravag)} canon-law cross-references, ~{nf(dec)}{" "}
        <i>Decretum</i> citations, and ~{nf(roman)} Roman-law citations — the "tens of thousands of legal
        allegations" of the project's introduction, made countable.
      </p>

      <h2>Most-alleged capitula</h2>
      <p className="dim">From the register (exact); each links to its gloss and to the live search for its allegations.</p>
      <table className="abbr" style={{ maxWidth: 880 }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Capitulum</th>
            <th>Title</th>
            <th>Alleged as</th>
            <th style={{ textAlign: "right" }}>Alleg.</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {s.topAlleged.map((t, i) => (
            <tr key={t.ref}>
              <td className="n">{i + 1}</td>
              <td className="ref">
                <Link href={`/x/${t.ref}/`}>
                  X {t.ref} <i>{t.inc}</i>
                </Link>
              </td>
              <td>{t.title}</td>
              <td className="ab">
                {t.abbrev}, {t.ddinc}
              </td>
              <td className="n">{t.n}</td>
              <td>
                <Link href={`/?q=${encodeURIComponent(`${t.abbrev}, ${t.ddinc}`)}`}>allegations →</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Jurists cited in the gloss</h2>
      <p className="dim">
        Exact whole-word counts of the standardized sigla (see{" "}
        <Link href="/allegations#jurists">Legal Allegations</Link> for the system). Bernard's own siglum appears
        only where the Editio Romana appends it — far fewer times than the glosses he wrote.
      </p>
      <table className="abbr" style={{ maxWidth: 560 }}>
        <thead>
          <tr>
            <th>Siglum</th>
            <th>Jurist</th>
            <th style={{ textAlign: "right" }}>Citations</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {s.jurists.map((j) => (
            <tr key={j.siglum}>
              <td className="ab">{j.siglum}</td>
              <td>{j.name}</td>
              <td className="n">{nf(j.n)}</td>
              <td>
                <Link href={`/?q=${encodeURIComponent(j.siglum)}&ww=1&cs=1`}>search →</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 id="verses">Mnemonic verses — an anthology</h2>
      <p className="dim">
        All {s.verses.length} glosses containing the pedagogical verses (introduced by <i>versus</i> /{" "}
        <i>versibus</i>; line breaks marked //). The classroom poetry of the medieval law school, collected in one
        place.
      </p>
      {s.verses.map((v, i) => (
        <article className="hit" key={i}>
          <header>
            {v.ref ? (
              <Link className="cite" href={`/x/${v.ref}/`}>
                {v.cite}
              </Link>
            ) : (
              <span className="cite">{v.cite}</span>
            )}
          </header>
          <div className="txt" lang="la">
            {v.text}
          </div>
        </article>
      ))}
    </main>
  );
}
