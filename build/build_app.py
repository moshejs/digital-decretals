#!/usr/bin/env python3
"""
Digital Decretals — one-step build
==================================
Parses the master Word file and injects the data into the web app template.

Usage:
    python3 build_app.py "MASTER.docx" [-o ../digital-decretals.html] [--books auto|all|1,4]

Requires: pip install python-docx
Run this again whenever the master Word file is updated (e.g. when a new
book is completed); with --books auto, newly completed books are picked up
automatically.
"""
import argparse, json, os, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("docx")
    ap.add_argument("-o", "--out", default=os.path.join(HERE, "..", "digital-decretals.html"))
    ap.add_argument("--books", default="auto")
    args = ap.parse_args()

    with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tf:
        tmp = tf.name
    try:
        subprocess.run([sys.executable, os.path.join(HERE, "parse_gloss.py"),
                        args.docx, "-o", tmp, "--books", args.books], check=True)
        with open(tmp, encoding="utf-8") as f:
            data = f.read()
    finally:
        os.unlink(tmp)

    # make the JSON safe to embed inside a <script> element
    data = data.replace("</", "<\\/")

    with open(os.path.join(HERE, "app_template.html"), encoding="utf-8") as f:
        tpl = f.read()
    marker = "/*__DATA__*/"
    if marker not in tpl:
        sys.exit("template marker not found")
    out = tpl.replace(marker, data)

    with open(args.out, "w", encoding="utf-8") as f:
        f.write(out)
    print(f"built {os.path.abspath(args.out)} ({len(out)/1e6:.1f} MB)")

if __name__ == "__main__":
    main()
