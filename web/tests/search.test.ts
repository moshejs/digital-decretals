/**
 * Search-core + register tests against the real corpus (Books 1–5 complete, rev. 9/23).
 * Run:  npm test   (node --experimental-strip-types tests/search.test.ts)
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { normalize, findMatches } from "../lib/search.ts";
import { flatten, type GlossData } from "../lib/data.ts";
import { allegationQuery, type AbbrevData } from "../lib/abbrev.ts";
import { EXAMPLES } from "../lib/examples.ts";

const here = dirname(fileURLToPath(import.meta.url));
const data: GlossData = JSON.parse(readFileSync(join(here, "..", "public", "gloss-data.json"), "utf8"));
const abbrev: AbbrevData = JSON.parse(readFileSync(join(here, "..", "public", "abbrev-data.json"), "utf8"));
const flat = flatten(data);

let pass = 0,
  fail = 0;
function check(name: string, cond: boolean, extra?: unknown) {
  if (cond) {
    pass++;
    console.log(`  ok  ${name}${extra !== undefined ? `  [${extra}]` : ""}`);
  } else {
    fail++;
    console.log(`  FAIL ${name}${extra !== undefined ? `  [${extra}]` : ""}`);
  }
}

function count(q: string, opts: { cs?: boolean; ip?: boolean; ww?: boolean; or?: boolean } = {}) {
  const cs = !!opts.cs,
    ip = !!opts.ip,
    ww = !!opts.ww,
    or = !!opts.or;
  const qn = normalize(q, cs, ip, or).n;
  let occ = 0,
    units = 0;
  for (const u of flat.units) {
    const tr = findMatches(normalize(u.text, cs, ip, or), qn, ww);
    const lr = u.lemma ? findMatches(normalize(u.lemma, cs, ip, or), qn, ww) : [];
    const n = tr.length + lr.length;
    if (n) {
      occ += n;
      units++;
    }
  }
  return { occ, units };
}

console.log("== corpus (Books 1–5 complete) ==");
check("9,872 gloss units", flat.units.length === 9872, flat.units.length);
check("1,971 reading locations (1,970 chapter headings + preface)", flat.nodes.length === 1971, flat.nodes.length);
check("books: RP + I–V", data.books.map((b) => b.id).join(",") === "RP,1,2,3,4,5");
check("185 titles", data.books.reduce((s, b) => s + b.titles.length, 0) === 185);

console.log("== canonical searches (independently verified against the Word file) ==");
check("X 4.17.13 allegation: 8 occurrences", count("qui fil. sint legit., per venerabilem").occ === 8);
check("same with punctuation ignored", count("qui fil sint legit per venerabilem", { ip: true }).occ === 8);
check("matrimonium: 452 (449 in gloss text + 3 in lemmata)", count("matrimonium").occ === 452, count("matrimonium").occ);
check("extravag.: 140", count("extravag.").occ === 140, count("extravag.").occ);
check("ff. de regul. iur.: 133", count("ff. de regul. iur.").occ === 133);
const vWW = count("versus", { ww: true }).occ;
const vAll = count("versus").occ;
check("whole-word 'versus' 44 (plain 114 incl. lemmata)", vWW === 44 && vAll === 114, `${vWW} / ${vAll}`);
check("versibus (ww): 13", count("versibus", { ww: true }).occ === 13);
check("Host. (ww+case): 6", count("Host.", { ww: true, cs: true }).occ === 6);
check("stray 'ff. de reg. iur.' fixed in rev 9/23: 0 hits", count("ff. de reg. iur.").occ === 0);

console.log("== capitula register (abbreviations spreadsheet) ==");
check("2,002 register rows (1,971 capitula + 31 extravagantes)", abbrev.capitula.length === 2002, abbrev.capitula.length);
check("185 Decretals titles / 896 Roman-law rows", abbrev.decretalsTitles.length === 185 && abbrev.roman.length === 896);
const pv = abbrev.capitula.find((c) => c.ref === "4.17.13")!;
check(
  'allegationQuery(X 4.17.13) = "qui fil. sint legit., per venerabilem"',
  allegationQuery(pv) === "qui fil. sint legit., per venerabilem"
);
check("register count for X 4.17.13 (8) matches corpus", count(allegationQuery(pv)).occ === pv.n);
// spot-check a spread of capitula: register count must equal corpus occurrences
const SPOT = ["1.1.1", "1.6.34", "2.13.13", "2.24.26", "3.5.28", "3.32.7", "4.1.13", "4.15.2", "5.39.51", "5.12.6", "4.7.6"];
for (const ref of SPOT) {
  const c = abbrev.capitula.find((x) => x.ref === ref)!;
  const got = count(allegationQuery(c)).occ;
  check(`register vs corpus, X ${ref} (${c.n})`, got === c.n, `${got}`);
}

console.log("== citation hypertext (precomputed links) ==");
{
  const reg = new Map(abbrev.capitula.map((c) => [c.ref, c]));
  let n = 0, bad = 0, overlap = 0, inbound4_17_13 = 0;
  for (const u of flat.units) {
    let last = -1;
    for (const [s, e, ref] of u.links) {
      n++;
      if (ref === "4.17.13") inbound4_17_13++;
      const c = reg.get(ref);
      const expect = c ? `${c.abbrev}, ${c.ddinc}`.toLowerCase() : null;
      if (!expect || u.text.slice(s, e).toLowerCase() !== expect) bad++;
      if (s < last) overlap++;
      last = e;
    }
  }
  check("18,257 allegations hyperlinked", n === 18257, n);
  check("every link slices to its standardized allegation", bad === 0, bad);
  check("links are sorted and non-overlapping", overlap === 0);
  check("X 4.17.13 has 8 inbound links (= register)", inbound4_17_13 === 8, inbound4_17_13);
}

console.log("== orthographic tolerance (ae/oe = e, v = u) ==");
{
  check('normalize("poenitentia") → "penitentia"', normalize("poenitentia", false, false, true).n === "penitentia");
  check('normalize("uultus") matches "vultus"', normalize("vultus", false, false, true).n === normalize("uultus", false, false, true).n);
  const hay = normalize("de poenitentia loqui", false, false, true);
  const m = findMatches(hay, normalize("penitentia", false, false, true).n, false);
  check("ortho match maps back over the full digraph", m.length === 1 && "de poenitentia loqui".slice(m[0][0], m[0][1]) === "poenitentia", JSON.stringify(m));
  const plain = count("quae", { ww: true }).occ;
  const tolerant = count("que", { ww: true, or: true }).occ;
  check("ortho 'que' (ww) ≥ classical 'quae' (ww)", tolerant >= plain && plain > 0, `${tolerant} vs ${plain}`);
}

console.log("== highlight ranges map back to original text ==");
{
  const u = flat.units.find((u) => u.text.toLowerCase().includes("per venerabilem"))!;
  const qn = normalize("per venerabilem", false, false).n;
  const [a, b] = findMatches(normalize(u.text, false, false), qn, false)[0];
  check("range slices the original string correctly", u.text.slice(a, b).toLowerCase() === "per venerabilem", u.text.slice(a, b));
}

console.log("== every Welcome example returns hits ==");
for (const e of EXAMPLES) {
  const r = count(e.q, e);
  check(`example: ${e.q}`, r.units > 0, `${r.occ} occ`);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
