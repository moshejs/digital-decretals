#!/usr/bin/env python3
"""
Digital Decretals — docx -> JSON parser
=======================================
Parses the master Word file of the Glossa Ordinaria (Bernard of Parma) into
structured JSON for the search web app.

Document architecture (native Word headings):
  Heading 1 = Book        ("REX PACIFICUS", "BOOK I", ...)
  Heading 2 = Title       ("X 1.01 DE SUMMA TRINITATE ET FIDE CATHOLICA")
  Heading 3 = Chapter     ("X 1.01.01 Firmiter")
  Heading 4 = Lemma       ("Firmiter")  -- the gloss word(s), s.v.
  Normal    = gloss text  (one unit = consecutive non-empty paragraphs)

Text appearing under a chapter BEFORE its first lemma is stored as a unit
with lemma = None (rendered as "in princ." by the app).

Usage:
  python3 parse_gloss.py MASTER.docx -o gloss_data.json [--books auto|all|1,4]

  --books auto  (default) include Rex pacificus + every book whose title
                count matches the expected count for a complete book
                (1:43, 2:30, 3:50, 4:21, 5:41), per the author's wish that
                only completed books go online.
  --books all   include everything found in the file.
  --books 1,4   explicit list (RP is always included; add 'RP' to be explicit).
"""
import argparse, json, re, sys, datetime
from docx import Document

EXPECTED_TITLES = {"1": 43, "2": 30, "3": 50, "4": 21, "5": 41}
ROMAN = {"I": "1", "II": "2", "III": "3", "IV": "4", "V": "5"}

RE_TITLE = re.compile(r"^X\s+(\d)\.(\d+)\s+(.*)$")
RE_CHAP = re.compile(r"^X\s+(\d)\.(\d+)\.(\d+)\s*(.*)$")


def book_id(h1_text):
    t = h1_text.strip().upper()
    if t.startswith("BOOK"):
        return ROMAN.get(t.split()[-1], t.split()[-1])
    return "RP"  # Rex pacificus preface


def norm_num(*parts):
    """'1','01','01' -> '1.1.1' (strip zero padding for modern citation)."""
    return ".".join(str(int(p)) for p in parts)


def sentence_case(s):
    s = " ".join(s.split())
    low = s.lower()
    return low[:1].upper() + low[1:] if low else s


def parse(path):
    doc = Document(path)
    books = []   # [{id,label,heading,titles:[...] ,units:[...] (RP only)}]
    cur_book = cur_title = cur_chap = None
    pending = []          # paragraphs of the unit being accumulated
    pending_lemma = None  # None => in princ. ; str => lemma
    container = None      # list that finished units get appended to

    def flush():
        nonlocal pending, pending_lemma
        text = "\n".join(pending).strip()
        if pending_lemma is not None or text:
            if container is None:
                print(f"WARNING: orphan text skipped: {text[:80]!r}", file=sys.stderr)
            else:
                container.append({"lemma": pending_lemma, "text": text})
        pending, pending_lemma = [], None

    for p in doc.paragraphs:
        style, text = p.style.name, p.text.strip()
        if style == "Heading 1":
            flush()
            cur_book = {"id": book_id(text), "heading": text, "titles": [], "units": []}
            books.append(cur_book)
            cur_title = cur_chap = None
            container = cur_book["units"]  # for RP-style direct lemmata
        elif style == "Heading 2":
            flush()
            m = RE_TITLE.match(text)
            if not m:
                sys.exit(f"Unrecognised Heading 2: {text!r}")
            cur_title = {"raw": text, "num": norm_num(m.group(1), m.group(2)),
                         "rubric": sentence_case(m.group(3)), "chapters": []}
            cur_book["titles"].append(cur_title)
            cur_chap, container = None, None
        elif style == "Heading 3":
            flush()
            m = RE_CHAP.match(text)
            if not m:
                sys.exit(f"Unrecognised Heading 3: {text!r}")
            cur_chap = {"raw": text, "num": norm_num(m.group(1), m.group(2), m.group(3)),
                        "incipit": " ".join(m.group(4).split()), "units": []}
            cur_title["chapters"].append(cur_chap)
            container = cur_chap["units"]
            pending_lemma = None  # text before first lemma = in princ.
        elif style == "Heading 4":
            if not text:
                continue  # two stray empty H4 paragraphs exist in the master
            flush()
            pending_lemma = text
        else:
            if text:
                pending.append(text)
    flush()
    return books


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("docx")
    ap.add_argument("-o", "--out", default="gloss_data.json")
    ap.add_argument("--books", default="auto")
    args = ap.parse_args()

    books = parse(args.docx)

    if args.books == "all":
        keep = books
    elif args.books == "auto":
        keep = [b for b in books if b["id"] == "RP"
                or len(b["titles"]) == EXPECTED_TITLES.get(b["id"])]
        skipped = [b for b in books if b not in keep]
        for b in skipped:
            print(f"  - skipping incomplete {b['heading']} "
                  f"({len(b['titles'])}/{EXPECTED_TITLES.get(b['id'], '?')} titles)")
    else:
        ids = {x.strip().upper() for x in args.books.split(",")} | {"RP"}
        keep = [b for b in books if b["id"].upper() in ids]

    n_units = n_chaps = 0
    for b in keep:
        b["label"] = "Rex pacificus" if b["id"] == "RP" else f"Book {b['heading'].split()[-1]}"
        n_units += len(b["units"])
        for t in b["titles"]:
            for c in t["chapters"]:
                n_chaps += 1
                n_units += len(c["units"])
        print(f"  + {b['label']}: {len(b['titles'])} titles, "
              f"{sum(len(t['chapters']) for t in b['titles'])} chapters, "
              f"{len(b['units']) + sum(len(c['units']) for t in b['titles'] for c in t['chapters'])} gloss units")

    data = {
        "project": "The Digital Decretals — Glossa Ordinaria of Bernard of Parma",
        "source": args.docx.split("/")[-1],
        "generated": datetime.date.today().isoformat(),
        "books": keep,
        "stats": {"chapters": n_chaps, "units": n_units},
    }
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
    print(f"wrote {args.out}: {n_chaps} chapters, {n_units} gloss units")


if __name__ == "__main__":
    main()
