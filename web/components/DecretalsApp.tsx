"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  flatten,
  nf,
  type Book,
  type ChapterNode,
  type Flat,
  type GlossData,
  type Title,
} from "@/lib/data";
import { findMatches, normalize, type Norm } from "@/lib/search";
import { asset, type AbbrevData, type Capitulum } from "@/lib/abbrev";
import type { Example } from "@/lib/examples";
import Toolbar, { type Mode, type Scope } from "@/components/Toolbar";
import Tree from "@/components/Tree";
import Welcome from "@/components/Welcome";
import Results, { type Hit, type SearchResults } from "@/components/Results";
import ReadingView from "@/components/ReadingView";

type View = { kind: "search" } | { kind: "read"; node: ChapterNode; focusUnit: number | null };

export default function DecretalsApp() {
  const [data, setData] = useState<GlossData | null>(null);
  const [capMap, setCapMap] = useState<Map<string, Capitulum> | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [rawQ, setRawQ] = useState("");
  const [q, setQ] = useState(""); // debounced
  const [mode, setMode] = useState<Mode>({ cs: false, ip: false, ww: false });
  const [scope, setScope] = useState<Scope>({ book: null, title: null, chap: null });
  const [view, setView] = useState<View>({ kind: "search" });
  const [treeOpen, setTreeOpen] = useState(false);
  const initialized = useRef(false);

  /* ---- load data ---- */
  useEffect(() => {
    fetch(asset("/gloss-data.json"))
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d: GlossData) => setData(d))
      .catch((e) => {
        setLoadError(
          window.location.protocol === "file:"
            ? "The data file cannot be loaded over file:// — serve this folder over HTTP (e.g. `npx serve out`) or use the single-file edition."
            : `Could not load gloss-data.json (${e.message}).`
        );
      });
    fetch(asset("/abbrev-data.json"))
      .then((r) => (r.ok ? r.json() : null))
      .then((a: AbbrevData | null) => {
        if (a) setCapMap(new Map(a.capitula.map((c) => [c.ref, c])));
      })
      .catch(() => {}); // register info is an enhancement; search works without it
  }, []);

  const flat: Flat | null = useMemo(() => (data ? flatten(data) : null), [data]);

  /* ---- normalization cache (recomputed when case/punctuation modes change) ---- */
  const cache = useMemo(() => {
    if (!flat) return null;
    const unit = flat.units.map((u) => ({
      t: normalize(u.text, mode.cs, mode.ip),
      l: u.lemma ? normalize(u.lemma, mode.cs, mode.ip) : null,
    }));
    const chapInc = new Map<ChapterNode, Norm>();
    const titleRub = new Map<Title, Norm>();
    for (const n of flat.nodes)
      if (n.kind === "ch") {
        chapInc.set(n, normalize(n.chap!.incipit, mode.cs, mode.ip));
        if (!titleRub.has(n.title!)) titleRub.set(n.title!, normalize(n.title!.rubric, mode.cs, mode.ip));
      }
    return { unit, chapInc, titleRub };
  }, [flat, mode.cs, mode.ip]);

  const qn = useMemo(() => normalize(q, mode.cs, mode.ip).n, [q, mode.cs, mode.ip]);

  /* ---- search ---- */
  const results: SearchResults | null = useMemo(() => {
    if (!data || !flat || !cache || qn.length < 2) return null;
    const t0 = performance.now();
    const hits: Hit[] = [];
    let occ = 0;
    const perBook = new Map<Book, number>(data.books.map((b) => [b, 0]));
    const chapSet = new Set<ChapterNode>();
    const inScope = (u: Flat["units"][number]) =>
      (!scope.book || u.book === scope.book) &&
      (!scope.title || u.title === scope.title) &&
      (!scope.chap || u.chap === scope.chap);
    for (const u of flat.units) {
      const c = cache.unit[u.id];
      const tr = findMatches(c.t, qn, mode.ww);
      const lr = c.l ? findMatches(c.l, qn, mode.ww) : [];
      const n = tr.length + lr.length;
      if (!n) continue;
      perBook.set(u.book, (perBook.get(u.book) ?? 0) + n);
      if (!inScope(u)) continue;
      occ += n;
      chapSet.add(u.node);
      hits.push({ u, tr, lr, n });
    }
    const locs: ChapterNode[] = [];
    const titleLocs: Title[] = [];
    const seenT = new Set<Title>();
    for (const node of flat.nodes) {
      if (node.kind !== "ch") continue;
      if (scope.book && node.book !== scope.book) continue;
      if (scope.title && node.title !== scope.title) continue;
      if (scope.chap && node.chap !== scope.chap) continue;
      if (findMatches(cache.chapInc.get(node)!, qn, mode.ww).length) locs.push(node);
      if (!seenT.has(node.title!)) {
        seenT.add(node.title!);
        if (findMatches(cache.titleRub.get(node.title!)!, qn, mode.ww).length) titleLocs.push(node.title!);
      }
    }
    return { hits, occ, chapCount: chapSet.size, perBook, locs, titleLocs, ms: performance.now() - t0, qn };
  }, [data, flat, cache, qn, mode.ww, scope]);

  /* ---- debounce ---- */
  useEffect(() => {
    const t = setTimeout(() => setQ(rawQ), 160);
    return () => clearTimeout(t);
  }, [rawQ]);

  /* ---- initial state from URL (query params; legacy #hash from the single-file edition) ---- */
  useEffect(() => {
    if (!data || !flat || initialized.current) return;
    const search = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const get = (k: string) => search.get(k) ?? hash.get(k);
    const loc = get("loc");
    if (loc) {
      const node =
        loc === "RP"
          ? flat.nodes.find((n) => n.kind === "rp")
          : flat.nodes.find((n) => n.kind === "ch" && n.chap!.num === loc);
      if (node) setView({ kind: "read", node, focusUnit: null });
    }
    const uq = get("q");
    if (uq) {
      setRawQ(uq);
      setQ(uq);
      setMode({ cs: get("cs") === "1", ip: get("ip") === "1", ww: get("ww") === "1" });
      const book = data.books.find((b) => b.id === get("b")) ?? null;
      const title = book?.titles.find((t) => t.num === get("t")) ?? null;
      const chap = title?.chapters.find((c) => c.num === get("c")) ?? null;
      setScope({ book, title, chap });
    }
    initialized.current = true;
  }, [data, flat]);

  /* ---- write state to URL (shareable links) ---- */
  useEffect(() => {
    if (!initialized.current) return;
    const p = new URLSearchParams();
    if (view.kind === "read") {
      p.set("loc", view.node.kind === "rp" ? "RP" : view.node.chap!.num);
    } else if (rawQ) {
      p.set("q", rawQ);
      if (scope.book) p.set("b", scope.book.id);
      if (scope.title) p.set("t", scope.title.num);
      if (scope.chap) p.set("c", scope.chap.num);
      if (mode.cs) p.set("cs", "1");
      if (mode.ip) p.set("ip", "1");
      if (mode.ww) p.set("ww", "1");
    }
    const s = p.toString();
    try {
      window.history.replaceState(null, "", s ? `?${s}` : window.location.pathname);
    } catch {
      /* restricted environments: shareable URLs just won't update */
    }
  }, [rawQ, mode, scope, view]);

  /* ---- actions ---- */
  const onQuery = (val: string, immediate = false) => {
    setRawQ(val);
    if (immediate) setQ(val);
    if (view.kind !== "search") setView({ kind: "search" });
  };
  const openNode = (node: ChapterNode, focusUnit?: number) => {
    setView({ kind: "read", node, focusUnit: focusUnit ?? null });
    setTreeOpen(false);
  };
  const onBookChip = (b: Book) =>
    setScope(scope.book === b ? { book: null, title: null, chap: null } : { book: b, title: null, chap: null });
  const onOpenTitle = (t: Title) => {
    const node = flat?.nodes.find((n) => n.title === t);
    if (node) openNode(node);
  };
  const onExample = (e: Example) => {
    setMode({ cs: !!e.cs, ip: false, ww: !!e.ww });
    onQuery(e.q, true);
  };
  const onBack = () => {
    setView({ kind: "search" });
    window.scrollTo(0, 0);
  };

  /* ---- render ---- */
  return (
    <>
      {data && flat ? (
        <>
          <Toolbar
            data={data}
            rawQ={rawQ}
            mode={mode}
            scope={scope}
            onQuery={onQuery}
            onMode={setMode}
            onScope={setScope}
            onOpenTree={() => setTreeOpen(true)}
          />
          <div className="wrap">
            <Tree
              data={data}
              flat={flat}
              activeNode={view.kind === "read" ? view.node : null}
              open={treeOpen}
              onOpenNode={openNode}
            />
            <main>
              {view.kind === "read" ? (
                <ReadingView
                  node={view.node}
                  flat={flat}
                  focusUnit={view.focusUnit}
                  hasResults={results !== null}
                  unitNorms={cache?.unit ?? null}
                  qn={results ? results.qn : null}
                  ww={mode.ww}
                  register={view.node.kind === "ch" ? capMap?.get(view.node.chap!.num) ?? null : null}
                  onSearch={(q) => {
                    setMode({ cs: false, ip: false, ww: false });
                    onQuery(q, true);
                  }}
                  onBack={onBack}
                  onNavigate={(n) => setView({ kind: "read", node: n, focusUnit: null })}
                />
              ) : results ? (
                <Results
                  key={`${results.qn}|${mode.ww ? 1 : 0}|${scope.book?.id ?? ""}|${scope.title?.num ?? ""}|${scope.chap?.num ?? ""}`}
                  data={data}
                  results={results}
                  rawQ={rawQ}
                  scope={scope}
                  onBookChip={onBookChip}
                  onOpenNode={openNode}
                  onOpenTitle={onOpenTitle}
                />
              ) : (
                <Welcome data={data} onExample={onExample} />
              )}
            </main>
          </div>
          <div className={`scrim${treeOpen ? " on" : ""}`} onClick={() => setTreeOpen(false)} />
        </>
      ) : (
        <main>
          <div className="loading">{loadError ?? "Loading the gloss… (≈5 MB on first visit)"}</div>
        </main>
      )}
    </>
  );
}
