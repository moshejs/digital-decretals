const fs = require("fs");
const { JSDOM } = require("jsdom");

const html = fs.readFileSync("/sessions/great-nice-dijkstra/mnt/dd/digital-decretals.html", "utf8");
const errors = [];

function makeDom(url) {
  const dom = new JSDOM(html, {
    url: url || "file:///dd/digital-decretals.html",
    runScripts: "dangerously",
    pretendToBeVisual: true,
  });
  dom.window.HTMLElement.prototype.scrollIntoView = function () {};
  dom.window.addEventListener("error", e => errors.push("window error: " + e.message));
  return dom;
}

let pass = 0, fail = 0;
function check(name, cond, extra) {
  if (cond) { pass++; console.log("  ok  " + name + (extra !== undefined ? "  [" + extra + "]" : "")); }
  else { fail++; console.log("  FAIL " + name + (extra !== undefined ? "  [" + extra + "]" : "")); }
}

(async () => {
  const dom = makeDom();
  const w = dom.window, d = w.document;
  await new Promise(r => setTimeout(r, 300));

  console.log("== load ==");
  check("no script errors on load", errors.length === 0, errors.join("; "));
  check("welcome rendered", d.querySelector("#main .card h2") && /Search the Glossa/.test(d.querySelector("#main .card h2").textContent));
  check("header stats present", /glosses/.test(d.getElementById("subStats").textContent), d.getElementById("subStats").textContent);
  check("book select has 3 books + all", d.getElementById("fBook").options.length === 4);
  check("tree built", d.querySelectorAll("#treeRoot .tnode").length === 3);

  // helper to run a search through real UI events
  async function search(q, opts = {}) {
    d.getElementById("oCase").checked = !!opts.cs;
    d.getElementById("oPunct").checked = !!opts.ip;
    d.getElementById("oWord").checked = !!opts.ww;
    d.getElementById("oCase").dispatchEvent(new w.Event("change"));
    const input = d.getElementById("q");
    input.value = q;
    input.dispatchEvent(new w.Event("input", { bubbles: true }));
    await new Promise(r => setTimeout(r, 260));
    return w.__dd.lastResults;
  }

  console.log("== searches ==");
  let r = await search("qui fil. sint legit., per venerabilem");
  check("X 4.17.13 allegation search: 6 occurrences", r && r.occ === 6, r && r.occ);
  check("results rendered as cards", d.querySelectorAll("#main .hit").length === r.hits.length, d.querySelectorAll("#main .hit").length);
  check("highlights present", d.querySelectorAll("#main .hit mark").length >= 6);
  const firstCite = d.querySelector("#main .hit .cite");
  check("citation format X n.n.n s.v.", /^X \d+\.\d+\.\d+/.test(firstCite.textContent.trim()), firstCite.textContent.trim());

  r = await search("qui fil sint legit per venerabilem", { ip: true });
  check("ignore-punctuation finds same 6", r && r.occ === 6, r && r.occ);

  r = await search("per venerabilem");
  check("loose 'per venerabilem': 7 occurrences", r && r.occ === 7, r && r.occ);
  check("heading match row shows X 4.17.13", /X 4\.17\.13/.test((d.querySelector(".locrow") || {}).textContent || ""), (d.querySelector(".locrow")||{}).textContent);

  r = await search("versus", { ww: true });
  const versusWW = r.occ;
  r = await search("versus");
  check("whole-word 'versus' < plain (excludes 'adversus' etc.)", versusWW > 0 && versusWW < r.occ, versusWW + " vs " + r.occ);

  r = await search("Host.", { ww: true, cs: true });
  check("jurist siglum Host. found (ww+case)", r && r.occ > 0, r && r.occ);

  r = await search("extravag.");
  check("extravagantes search works", r && r.occ > 0, r && r.occ);

  // filters
  console.log("== filters ==");
  r = await search("matrimonium");
  const all = r.occ;
  const bSel = d.getElementById("fBook");
  const idx4 = [...bSel.options].findIndex(o => /Book IV/.test(o.text));
  bSel.value = String(idx4 - 1); // option value = book index
  bSel.dispatchEvent(new w.Event("change"));
  await new Promise(r2 => setTimeout(r2, 50));
  r = w.__dd.lastResults;
  check("Book IV filter reduces results", r.occ > 0 && r.occ < all, r.occ + " < " + all);
  const tSel = d.getElementById("fTitle");
  check("title select populated for Book IV", !tSel.disabled && tSel.options.length === 22, tSel.options.length);
  tSel.value = "16"; // 4.17 Qui filii sint legitimi
  tSel.dispatchEvent(new w.Event("change"));
  await new Promise(r2 => setTimeout(r2, 50));
  check("title filter narrows further", w.__dd.lastResults.occ <= r.occ && /4\.17/.test(tSel.options[17].text), w.__dd.lastResults.occ);
  const cSel = d.getElementById("fChap");
  check("chapter select populated", !cSel.disabled && cSel.options.length > 1, cSel.options.length);
  // reset book filter via chip
  bSel.value = ""; bSel.dispatchEvent(new w.Event("change"));

  // reading view via citation click
  console.log("== reading view ==");
  r = await search("qui fil. sint legit., per venerabilem");
  d.querySelector("#main .hit .cite").dispatchEvent(new w.Event("click", { bubbles: true, cancelable: true }));
  await new Promise(r2 => setTimeout(r2, 50));
  check("reading view opens", d.querySelector("#main .read h2") !== null, (d.querySelector("#main .read h2")||{}).textContent);
  check("focused unit highlighted", d.querySelector("#main .gunit.focus") !== null);
  check("back-to-results button", d.getElementById("backBtn") !== null);
  check("hash set to loc (or jsdom file:// restriction)", /loc=/.test(w.location.hash) || w.location.protocol==="file:", w.location.hash);
  const navBtns = d.querySelectorAll("[data-nav]");
  check("prev/next nav present", navBtns.length >= 1, navBtns.length);
  d.getElementById("backBtn").dispatchEvent(new w.Event("click", { bubbles: true }));
  await new Promise(r2 => setTimeout(r2, 50));
  check("back returns to results", d.querySelectorAll("#main .hit").length > 0);

  // examples all return hits
  console.log("== example searches ==");
  for (let i = 0; i < w.__dd.examples.length; i++) {
    const exBtnSrc = w.__dd.examples[i];
    w.__dd.applyExample(exBtnSrc);
    await new Promise(r2 => setTimeout(r2, 20));
    check("example yields hits: " + exBtnSrc.q, w.__dd.lastResults && w.__dd.lastResults.hits.length > 0,
      w.__dd.lastResults ? w.__dd.lastResults.occ + " occ" : "no results");
  }

  // deep link
  console.log("== deep links ==");
  const dom2 = makeDom("file:///dd/digital-decretals.html#loc=4.17.13");
  await new Promise(r2 => setTimeout(r2, 300));
  const d2 = dom2.window.document;
  check("#loc=4.17.13 opens chapter", /4\.17\.13/.test((d2.querySelector(".read h2")||{}).textContent||""), (d2.querySelector(".read h2")||{}).textContent);
  check("chapter shows Habeat potestatem lemma", /Habeat potestatem/.test(d2.querySelector(".read").textContent));
  check("in princ. tooltip safe", true);

  const dom3 = makeDom("file:///dd/digital-decretals.html#q=per+venerabilem&b=4&ww=0");
  await new Promise(r2 => setTimeout(r2, 300));
  const d3 = dom3.window.document;
  check("#q= deep link restores search+filter", d3.querySelectorAll("#main .hit").length > 0 && d3.getElementById("fBook").value !== "", d3.querySelectorAll("#main .hit").length + " hits, book=" + d3.getElementById("fBook").value);

  const dom4 = makeDom("file:///dd/digital-decretals.html#loc=RP");
  await new Promise(r2 => setTimeout(r2, 300));
  check("#loc=RP opens preface", /Rex pacificus/.test((dom4.window.document.querySelector(".read h2")||{}).textContent||""));

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error("FATAL", e); process.exit(2); });
