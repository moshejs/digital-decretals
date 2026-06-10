#!/usr/bin/env python3
"""
Statistics for the /statistics page: totals, top-alleged capitula, citation
markers by source corpus, jurist sigla frequencies, and the mnemonic-verse
anthology. Exact where exact is possible; clearly-labelled marker counts
where only a heuristic exists (Decretum / Roman-law markers).

Usage: python3 make_stats.py gloss-data.json abbrev-data.json -o ../web/data/stats.json
"""
import argparse, json, re, datetime

JURISTS = [
    ("Ala.", "Alanus Anglicus"), ("Azo", "Azo of Bologna"), ("Bart.", "Bartholomeus Brixiensis"),
    ("Bazian.", "Johannes Bassianus"), ("Ber.", "Bernard of Parma"), ("Bulg.", "Bulgarus"),
    ("Dama.", "Damasus"), ("Gandulf.", "Gandulfus"), ("Gott.", "Gottfried of Trani"),
    ("Gratian.", "Gratian"), ("Host.", "Hostiensis (Henricus de Segusio)"), ("Hug.", "Huguccio of Pisa"),
    ("Iacob.", "Jacobus Balduini"), ("Inno. iiii", "Innocent IV (Sinebaldus Fieschi)"),
    ("Io.", "Iohannes Teutonicus"), ("Ioan. And.", "Johannes Andreae"), ("Ioan. Favent.", "Johannes Faventinus"),
    ("Laur.", "Laurentius Hispanus"), ("Marc.", "Marcoaldus"), ("Mart.", "Martinus"),
    ("Melend.", "Melendus Hispanus"), ("Naso", "Guilelmus Naso"), ("Petr. Hisp.", "Petrus Hispanus"),
    ("Placen.", "Placentinus"), ("Rich.", "Richardus Anglicus"), ("Tanc.", "Tancred of Bologna"),
    ("Vincen.", "Vincentius Hispanus"),
]

WB = r"(?<![A-Za-z0-9]){}(?![A-Za-z0-9])"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("gloss"); ap.add_argument("abbrev"); ap.add_argument("-o", "--out", required=True)
    a = ap.parse_args()
    g = json.load(open(a.gloss, encoding="utf-8"))
    ab = json.load(open(a.abbrev, encoding="utf-8"))

    units = []  # (cite, lemma, text, links)
    per_book_units, per_book_links = {}, {}
    for b in g["books"]:
        label = b["label"]
        def add(u, chap=None):
            cite = (f"X {chap['num']}" + (", in princ." if u["lemma"] is None else f" s.v. {u['lemma']}")) if chap \
                   else f"Rex pacificus, s.v. {u['lemma']}"
            units.append((cite, u.get("lemma"), u["text"], u.get("k", []), chap["num"] if chap else None))
            per_book_units[label] = per_book_units.get(label, 0) + 1
            per_book_links[label] = per_book_links.get(label, 0) + len(u.get("k", []))
        for u in b["units"]: add(u)
        for t in b["titles"]:
            for ch in t["chapters"]:
                for u in ch["units"]: add(u, ch)

    full = "\n\n".join(t for _, _, t, _, _ in units)
    low = full.lower()
    n_links = sum(len(k) for _, _, _, k, _ in units)

    # top-alleged capitula from the register (exact)
    caps = [c for c in ab["capitula"] if not c["ref"].endswith(".ex")]
    top = sorted(caps, key=lambda c: -c["n"])[:25]
    top_alleged = [{"ref": c["ref"], "title": c["title"], "inc": c["inc"], "abbrev": c["abbrev"], "ddinc": c["ddinc"], "n": c["n"]} for c in top]

    # source-corpus citation markers
    sources = {
        "liberExtraLinked": n_links,  # exact, by construction of the hypertext
        "extravag": low.count("extravag."),
        "digest_ff": len(re.findall(r"(?<![A-Za-z])ff\.", full)),
        "codex_C_de": len(re.findall(r"(?<![A-Za-z])C\. de ", full)),
        "inst": len(re.findall(r"(?<![A-Za-z])Inst\. ", full)),
        "auth": len(re.findall(r"(?<![A-Za-z])in Auth\.", full)),
        "decretum_causa": len(re.findall(r"\d+\. q\. \d+", low)),
        "decretum_dist": len(re.findall(r"\d+\. dist\.", low)),
        "decretum_poen": low.count("de poen. dist."),
        "decretum_conse": low.count("de conse. dist."),
    }

    jurists = []
    for sig, name in JURISTS:
        n = len(re.findall(WB.format(re.escape(sig)), full))
        jurists.append({"siglum": sig, "name": name, "n": n})
    jurists.sort(key=lambda j: -j["n"])

    verses = []
    rx = re.compile(r"(?<![A-Za-z0-9])(versus|versibus)(?![A-Za-z0-9])", re.I)
    for cite, lemma, text, _, ref in units:
        if rx.search(text):
            verses.append({"cite": cite, "ref": ref, "text": text})

    stats = {
        "generated": datetime.date.today().isoformat(),
        "totals": {
            "books": 5, "titles": 185,
            "chapters": g["stats"]["chapters"], "units": g["stats"]["units"],
            "chars": len(full.replace("\n", "")),
            "linkedAllegations": n_links,
            "registerCapitula": len(caps),
            "registerAllegations": sum(c["n"] for c in caps),
        },
        "perBook": [{"book": k, "units": per_book_units[k], "links": per_book_links[k]} for k in per_book_units],
        "topAlleged": top_alleged,
        "sources": sources,
        "jurists": jurists,
        "verses": verses,
    }
    json.dump(stats, open(a.out, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    print(f"stats: {n_links} linked allegations, {len(verses)} verse glosses, top capitulum X {top[0]['ref']} ({top[0]['n']}×)")


if __name__ == "__main__":
    main()
