const { JSDOM } = require("jsdom");

const BASE = "http://127.0.0.1:8077/";
let pass = 0, fail = 0;
const check = (name, cond, extra) => {
  if (cond) { pass++; console.log("  ok  " + name + (extra !== undefined ? `  [${extra}]` : "")); }
  else { fail++; console.log("  FAIL " + name + (extra !== undefined ? `  [${extra}]` : "")); }
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function makeDom(url) {
  return JSDOM.fromURL(url, {
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true,
    beforeParse(window) {
      window.fetch = (input, init) => fetch(new URL(String(input), url).href, init);
      window.HTMLElement.prototype.scrollIntoView = function () {};
      window.scrollTo = () => {};
      for (const k of ["ReadableStream", "WritableStream", "TransformStream", "TextEncoder", "TextDecoder", "MessageChannel", "MessagePort", "Response", "Request", "Headers", "structuredClone", "queueMicrotask"])
        if (!(k in window) && k in globalThis) window[k] = globalThis[k];
    },
  });
}

function setReactInput(window, input, value) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  setter.call(input, value);
  input.dispatchEvent(new window.Event("input", { bubbles: true }));
}

(async () => {
  const PART = process.env.SMOKE_PART || "all";
  const want = (p) => PART === "all" || PART === p;
  if (want("a")) {
  console.log("== static pages (server-rendered content) ==");
  const pages = [
    ["about/", ["Origo operis", "Glossa Ordinaria", "Mission statement"]],
    ["text/", ["Casus longi", "Decretals%20Gloss%2C%20Books%201-5%20Complete%2C%20rev.%209.23.docx", "Numeration", "password", "Glossa%20Ordinaria%20to%20the%20Decretals%2C%20Book%202", "Glossa%20Ordinaria%20to%20the%20Decretals%2C%20Book%205", "superseded here"]],
    ["allegations/", ["Hostiensis", "extravag.", "Mnemonic verses", "qui vult", "Vincentius Hispanus", "de elect., bonae 2"]],
    ["ancillaria/", ["Medieval Canon Law Virtual Library", "Mommsen"]],
    ["gratissimi/", ["Bob Scott", "thank a librarian"]],
    ["contact/", ["ereno@adelphi.edu", "845-380-0167"]],
  ];
  for (const [path, needles] of pages) {
    const html = await (await fetch(BASE + path)).text();
    const missing = needles.filter((n) => !html.includes(n));
    check(`/${path} complete`, missing.length === 0, missing.join("|") || `${needles.length} checks`);
  }
  const navHtml = await (await fetch(BASE + "about/")).text();
  check("nav present on content pages", navHtml.includes("Legal Allegations") && navHtml.includes("Abbreviations"));

  }
  if (want("b")) {
  console.log("== search app (all 5 books) ==");
  const dom = await makeDom(BASE);
  const w = dom.window, d = w.document;
  let tries = 0;
  while (!d.querySelector(".card h2") && tries++ < 80) await sleep(250);
  check("app hydrated, 5-book data loaded", !!d.querySelector(".card h2"));
  check("welcome shows Books I–V", /Book V/.test(d.querySelector(".stats-line")?.textContent || ""), (d.querySelector(".stats-line")?.textContent || "").slice(0, 80));
  const introTxt = [...d.querySelectorAll(".card h2")].map(h=>h.textContent).join("|");
  check("Home introduction migrated to landing page", /Welcome to the Digital Decretals/.test(introTxt) && /Raymond of Penyafort/.test(d.body.textContent), introTxt);
  check("tree shows 6 nodes (RP + 5 books)", d.querySelectorAll(".tnode").length === 6, d.querySelectorAll(".tnode").length);

  const input = d.getElementById("q");
  setReactInput(w, input, "qui fil. sint legit., per venerabilem");
  await sleep(600);
  check("8 occurrences for X 4.17.13 allegation", /^8 occurrences/.test(d.querySelector(".rsum")?.textContent || ""), (d.querySelector(".rsum")?.textContent || "").slice(0, 40));
  check("8 hit cards", d.querySelectorAll(".hit").length === 8, d.querySelectorAll(".hit").length);
  check("hits span multiple books", new Set([...d.querySelectorAll(".hit .crumb")].map((c) => c.textContent.split("·")[0].trim())).size >= 3);

  console.log("== reading view + register integration ==");
  const dom2 = await makeDom(BASE + "?loc=4.17.13");
  const w2 = dom2.window, d2 = w2.document;
  let t2 = 0;
  while (!d2.querySelector(".read h2") && t2++ < 80) await sleep(250);
  check("?loc=4.17.13 opens chapter", /4\.17\.13/.test(d2.querySelector(".read h2")?.textContent || ""));
  const regTxt = d2.querySelector(".reginfo")?.textContent || "";
  check("register block: inscription", /Montis Pessulani/.test(regTxt), regTxt.slice(0, 60));
  check("register block: standardized allegation + count", /qui fil\. sint legit\., per venerabilem/.test(regTxt) && /8× per the register/.test(regTxt));
  const findBtn = d2.querySelector(".reginfo button");
  check("find-allegations button present", !!findBtn);
  findBtn.click();
  await sleep(500);
  check("button runs the allegation search (8 hits)", d2.querySelectorAll(".hit").length === 8, d2.querySelectorAll(".hit").length);

  }
  if (want("c")) {
  console.log("== abbreviations explorer ==");
  const dom3 = await makeDom(BASE + "abbreviations/");
  const w3 = dom3.window, d3 = w3.document;
  let t3 = 0;
  while (!d3.querySelector("table.abbr") && t3++ < 80) await sleep(250);
  check("explorer loads with capitula table", !!d3.querySelector("table.abbr"));
  const filterBox = d3.querySelector(".abbr-filter");
  setReactInput(w3, filterBox, "per venerabilem");
  await sleep(300);
  const rows = [...d3.querySelectorAll("table.abbr tbody tr")];
  check("filter narrows to Per venerabilem row(s)", rows.length >= 1 && rows.length < 10, rows.length);
  check("row shows allegation count 8", rows.some((r) => /qui fil\. sint legit\., per venerabilem/.test(r.textContent) && /8/.test(r.textContent)));
  check("row links to search + open", !!d3.querySelector('table.abbr a[href*="?q="]') && !!d3.querySelector('table.abbr a[href*="?loc="]'));
  // tab switch
  const romanTab = [...d3.querySelectorAll(".tabbar button")].find((b) => /Roman law/.test(b.textContent));
  romanTab.click();
  await sleep(200);
  setReactInput(w3, d3.querySelector(".abbr-filter"), "de probation.");
  await sleep(300);
  const romanRows = [...d3.querySelectorAll("table.abbr tbody tr")];
  check("roman tab: de probation. in Codex and Digest", romanRows.length >= 2 && /C\./.test(romanRows.map((r) => r.textContent).join()) && /ff\./.test(romanRows.map((r) => r.textContent).join()), romanRows.length);

  console.log("== deep links & legacy ==");
  const dom4 = await makeDom(BASE + "?loc=RP");
  let t4 = 0;
  while (!dom4.window.document.querySelector(".read h2") && t4++ < 80) await sleep(250);
  check("?loc=RP opens preface", /Rex pacificus/.test(dom4.window.document.querySelector(".read h2")?.textContent || ""));
  const dom5 = await makeDom(BASE + "#q=matrimonium&b=4");
  let t5 = 0;
  while (!dom5.window.document.querySelector(".rsum") && t5++ < 80) await sleep(250);
  const sum5 = dom5.window.document.querySelector(".rsum")?.textContent || "";
  check("legacy #hash restores search + Book IV filter", /limited to Book IV/.test(sum5), sum5.slice(0, 70));

  }
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error("FATAL", e); process.exit(2); });
