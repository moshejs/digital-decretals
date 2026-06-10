import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ancillaria — The Digital Decretals",
  description: "Digital canon law resources: ancillary sites and editions for the study of medieval canon law.",
};

const RESOURCES = [
  {
    href: "http://web.colby.edu/canonlaw/",
    name: "Medieval Canon Law Virtual Library",
    desc: "Site founded by Prof. David Freidenreich and Prof. Reno, maintained at Prof. Freidenreich's University website at Colby. This includes a curated list of essential juridical texts from the medieval and early modern period.",
  },
  {
    href: "http://amesfoundation.law.harvard.edu/BioBibCanonists/HomePage_biobib2.php",
    name: "Bio-Bibliography of Medieval and Early Modern Jurists",
    desc: "Absolutely essential register and bibliography of Canon Law jurists and collections begun by Prof. Kenneth Pennington and housed now at the Ames Foundation website.",
  },
  {
    href: "http://digital.library.ucla.edu/canonlaw/",
    name: "Editio Romana of 1582",
    desc: "High resolution scans of the Corpus iuris canonici, done by UCLA's Library and Center for Medieval and Renaissance Studies.",
  },
  {
    href: "http://www.intratext.com/ixt/lat0833/",
    name: "Hypertext version of the Liber extra",
    desc: "Published by the IntraText service, this presents the Liber extra using a concordance and word-based hyperlinks.",
  },
  {
    href: "https://drive.google.com/file/d/18NvY1pSvbtsPzBI66tqnq_t00H2uAJku/view?usp=sharing",
    name: "Mommsen–Krueger–Schoell edition of the Corpus iuris civilis, bookmarked and hyperlinked",
    desc: "From Prof. Reno's personal stash, marked-up in the odd hours of downtime between other things. There is a bookmark tree containing every single title for each of the four volumes, and the opening 14-page alphabetized index of titles for the Codex, Digest, and Institutes is entirely hyperlinked. While there is no index for the Novellae, one may approximate such by performing a search and including the bookmarks in the queried data.",
  },
];

export default function AncillariaPage() {
  return (
    <main className="page">
      <h1>Ancillaria</h1>
      <p className="lede">Digital canon law resources</p>
      {RESOURCES.map((r) => (
        <div className="dl-card" key={r.href}>
          <span className="ico" aria-hidden>
            🔗
          </span>
          <span className="meta">
            <b>
              <a href={r.href} target="_blank" rel="noopener noreferrer">
                {r.name}
              </a>
            </b>
            <span>{r.desc}</span>
          </span>
        </div>
      ))}
    </main>
  );
}
