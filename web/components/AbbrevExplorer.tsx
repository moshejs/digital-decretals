"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { allegationQuery, asset, type AbbrevData, type Capitulum } from "@/lib/abbrev";
import { nf } from "@/lib/data";

type Tab = "capitula" | "decretals" | "roman" | "extravagantes";
const SHOW = 300;

const CODE_LABEL: Record<string, string> = { Cod: "C.", Dig: "ff.", Inst: "Inst.", Nov: "Auth." };

export default function AbbrevExplorer() {
  const [data, setData] = useState<AbbrevData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("capitula");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch(asset("/abbrev-data.json"))
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(`Could not load abbreviation data (${e.message}).`));
  }, []);

  const f = filter.trim().toLowerCase();
  const match = (...fields: string[]) => !f || fields.some((x) => x.toLowerCase().includes(f));

  const capitula = useMemo(
    () => (data ? data.capitula.filter((c) => match(c.ref, c.title, c.fullInc, c.inc, c.abbrev, c.ddinc, c.insc)) : []),
    [data, f] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const dtitles = useMemo(
    () => (data ? data.decretalsTitles.filter((t) => match(t.num, t.abbrev, t.full)) : []),
    [data, f] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const roman = useMemo(
    () => (data ? data.roman.filter((r) => match(r.code, r.loc, r.abbrev, r.full, r.alt)) : []),
    [data, f] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const extrav = useMemo(
    () => (data ? data.extravagantes.filter((e) => match(e.ref, e.title, e.inc)) : []),
    [data, f] // eslint-disable-line react-hooks/exhaustive-deps
  );

  if (error) return <main className="page"><div className="loading">{error}</div></main>;
  if (!data) return <main className="page"><div className="loading">Loading the abbreviation tables…</div></main>;

  const tabs: Array<[Tab, string, number]> = [
    ["capitula", "Capitula register", capitula.length],
    ["decretals", "Decretals titles", dtitles.length],
    ["roman", "Roman law titles", roman.length],
    ["extravagantes", "Extravagantes", extrav.length],
  ];

  return (
    <main className="page" style={{ maxWidth: 1000 }}>
      <h1>Abbreviations &amp; capitula register</h1>
      <p className="lede">
        Every title abbreviation used in the standardized allegations, and the register of all 1971 capitula of the{" "}
        <i>Liber extra</i> with their allegation counts (from the rev. 9/23 spreadsheet, downloadable on{" "}
        <Link href="/text">The Text</Link>). Filter, then jump straight into the gloss.
      </p>
      <input
        className="abbr-filter"
        type="search"
        placeholder="Filter… e.g.  4.17,  de probation.,  per venerabilem"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        aria-label="Filter the tables"
      />
      <div className="tabbar" role="tablist">
        {tabs.map(([id, label, n]) => (
          <button key={id} className={tab === id ? "on" : ""} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}>
            {label} <span style={{ opacity: 0.65 }}>({nf(n)})</span>
          </button>
        ))}
      </div>

      {tab === "capitula" && <CapitulaTable rows={capitula} />}
      {tab === "decretals" && <DTitlesTable rows={dtitles} />}
      {tab === "roman" && <RomanTable rows={roman} />}
      {tab === "extravagantes" && <ExtravTable rows={extrav} />}
    </main>
  );
}

function Truncated({ n, total }: { n: number; total: number }) {
  if (total <= n) return null;
  return (
    <p className="count-note">
      Showing the first {nf(n)} of {nf(total)} rows — narrow the filter to see the rest.
    </p>
  );
}

function CapitulaTable({ rows }: { rows: Capitulum[] }) {
  const slice = rows.slice(0, SHOW);
  return (
    <>
      <table className="abbr">
        <thead>
          <tr>
            <th>Ref.</th>
            <th>Title</th>
            <th>Incipit (DD form)</th>
            <th>Inscription</th>
            <th style={{ textAlign: "right" }} title="Times alleged in the gloss, per the register">
              Alleg.
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          {slice.map((c, i) => {
            const isExt = c.ref.endsWith(".ex");
            return (
              <tr key={`${c.ref}-${i}`}>
                <td className="ref">{isExt ? c.ref.replace(".ex", " (extravag.)") : `X ${c.ref}`}</td>
                <td>{c.title}</td>
                <td className="ab" title={`Full incipit: ${c.fullInc}`}>
                  {c.abbrev}, {c.ddinc}
                </td>
                <td style={{ color: "var(--muted)", fontSize: 12.5 }}>{c.insc}</td>
                <td className="n">{c.n}</td>
                <td>
                  {c.n > 0 && (
                    <Link href={`/?q=${encodeURIComponent(allegationQuery(c))}`} title="Find all allegations of this capitulum in the gloss">
                      allegations →
                    </Link>
                  )}
                  {!isExt && (
                    <>
                      {c.n > 0 && " · "}
                      <Link href={`/?loc=${encodeURIComponent(c.ref)}`} title="Open this capitulum's glosses">
                        open
                      </Link>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Truncated n={slice.length} total={rows.length} />
    </>
  );
}

function DTitlesTable({ rows }: { rows: AbbrevData["decretalsTitles"] }) {
  const slice = rows.slice(0, SHOW);
  return (
    <>
      <table className="abbr">
        <thead>
          <tr>
            <th>Book.Title</th>
            <th>Abbreviation</th>
            <th>Full title</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {slice.map((t) => (
            <tr key={t.num}>
              <td className="ref">X {t.num}</td>
              <td className="ab">{t.abbrev}</td>
              <td>{t.full}</td>
              <td>
                <Link href={`/?q=${encodeURIComponent(t.abbrev)}`} title="Find every allegation of this title in the gloss">
                  search →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Truncated n={slice.length} total={rows.length} />
    </>
  );
}

function RomanTable({ rows }: { rows: AbbrevData["roman"] }) {
  const slice = rows.slice(0, SHOW);
  return (
    <>
      <p className="count-note">
        C. = Codex · ff. = Digest · Inst. = Institutes · Auth. = Novellae/Authenticum. Only titles actually cited in
        the gloss are listed. Prefix a search with C. / ff. / Inst. to isolate one volume.
      </p>
      <table className="abbr">
        <thead>
          <tr>
            <th>Vol.</th>
            <th>Book.Title</th>
            <th>Abbreviation</th>
            <th>Full title</th>
            <th>Sometimes found</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {slice.map((r, i) => (
            <tr key={`${r.code}${r.loc}${i}`}>
              <td>
                <span className="badge">{CODE_LABEL[r.code] ?? r.code}</span>
              </td>
              <td className="ref">{r.loc}</td>
              <td className="ab">{r.abbrev}</td>
              <td>{r.full}</td>
              <td style={{ color: "var(--muted)" }}>{r.alt}</td>
              <td>
                <Link href={`/?q=${encodeURIComponent(r.abbrev)}`} title="Find allegations of this title in the gloss">
                  search →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Truncated n={slice.length} total={rows.length} />
    </>
  );
}

function ExtravTable({ rows }: { rows: AbbrevData["extravagantes"] }) {
  const slice = rows.slice(0, SHOW);
  return (
    <>
      <p className="count-note">
        Post-1234 legislation cited in the gloss, with the Liber extra titles under which each was placed. Search{" "}
        <i>extravag.</i> in the gloss to see them all at once.
      </p>
      <table className="abbr">
        <thead>
          <tr>
            <th>Placed under</th>
            <th>Title</th>
            <th>Incipit</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {slice.map((e, i) => (
            <tr key={`${e.ref}${i}`}>
              <td className="ref">{e.ref.replace(".ex", "")}</td>
              <td>{e.title}</td>
              <td className="ab">extravag. {e.inc.toLowerCase()}</td>
              <td>
                <Link href={`/?q=${encodeURIComponent(`extravag. ${e.inc.toLowerCase()}`)}`} title="Find allegations of this extravagans">
                  search →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Truncated n={slice.length} total={rows.length} />
    </>
  );
}
