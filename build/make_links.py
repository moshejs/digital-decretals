#!/usr/bin/env python3
"""
Citation hypertext: annotate every gloss unit with the positions of
standardized Liber extra allegations, so the web app can render them as links.

For each of the 1,971 capitula the standardized allegation string is
"<title abbrev>, <DD incipit>" (e.g. "qui fil. sint legit., per venerabilem").
Matching is case-insensitive; overlapping matches keep the longest string
(handles pairs like "tua nos" / "tua nos 1").

Usage: python3 make_links.py gloss-data.json abbrev-data.json
       (modifies gloss-data.json in place: each unit gains "k": [[start,end,ref],...])
"""
import json, sys
from bisect import bisect_right


def main(gloss_path, abbrev_path):
    gloss = json.load(open(gloss_path, encoding="utf-8"))
    abbrev = json.load(open(abbrev_path, encoding="utf-8"))

    queries = []  # (lowercased allegation string, ref)
    for c in abbrev["capitula"]:
        if c["ref"].endswith(".ex"):
            continue
        q = f"{c['abbrev']}, {c['ddinc']}".lower().strip()
        if len(q) >= 8:
            queries.append((q, c["ref"]))
    # longest first so greedy overlap resolution prefers the longer match
    queries.sort(key=lambda x: -len(x[0]))

    units = []  # (unit dict, its own chapter ref or None)
    for b in gloss["books"]:
        for u in b["units"]:
            units.append(u)
        for t in b["titles"]:
            for ch in t["chapters"]:
                for u in ch["units"]:
                    units.append(u)

    # one big concatenated corpus with offsets back to units
    SEP = "\n\x00\n"
    offsets, texts = [], []
    pos = 0
    for u in units:
        offsets.append(pos)
        texts.append(u["text"])
        pos += len(u["text"]) + len(SEP)
    corpus = SEP.join(texts).lower()

    per_unit = [[] for _ in units]
    total = 0
    for q, ref in queries:
        start = 0
        while (i := corpus.find(q, start)) != -1:
            ui = bisect_right(offsets, i) - 1
            local = i - offsets[ui]
            if local + len(q) <= len(units[ui]["text"]):  # not spanning the separator
                per_unit[ui].append((local, local + len(q), ref))
                total += 1
            start = i + 1

    kept = 0
    by_ref = {}
    for u, matches in zip(units, per_unit):
        if not matches:
            u.pop("k", None)
            continue
        # greedy: longer matches were appended first per query order? No — per unit they
        # arrive grouped by query; sort by (start, -length) and drop overlaps.
        matches.sort(key=lambda m: (m[0], -(m[1] - m[0])))
        out, last_end = [], -1
        for s, e, ref in matches:
            if s >= last_end:
                out.append([s, e, ref])
                last_end = e
        u["k"] = out
        kept += len(out)
        for _, _, ref in out:
            by_ref[ref] = by_ref.get(ref, 0) + 1

    json.dump(gloss, open(gloss_path, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    print(f"linked {kept} allegations ({total - kept} dropped as overlaps) across {sum(1 for m in per_unit if m)} units")
    print(f"distinct capitula linked: {len(by_ref)}")
    # spot verification against the register
    reg = {c["ref"]: c["n"] for c in abbrev["capitula"] if not c["ref"].endswith(".ex")}
    exact = sum(1 for r, n in reg.items() if by_ref.get(r, 0) == n)
    print(f"register agreement: {exact}/{len(reg)} capitula with exact link-count match")
    for probe in ["4.17.13", "1.1.1", "4.15.2"]:
        print(f"  X {probe}: links={by_ref.get(probe, 0)} register={reg.get(probe)}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
