# The Digital Decretals — Next.js site

The complete Digital Decretals as a static Next.js site: searchable **Glossa Ordinaria, Books 1–5 (rev. 9/23)**, the full capitula register and abbreviation tables as a live explorer, and all documentation pages from the original Google Site.

## Commands

```bash
npm install        # once
npm run dev        # development server at http://localhost:3000
npm run build      # production build → ./out  (fully static, deploy anywhere)
npm run start      # serve ./out locally (npx serve)
npm run data       # regenerate public/gloss-data.json from the master .docx (needs python-docx)
npm test           # 39 checks: search counts, register agreement, examples (node --experimental-strip-types)
```

A pre-built `out/` is included — copy its contents to any static host. It must be served over HTTP (the data is fetched); for `file://` use, hand people `../digital-decretals.html` instead. Hosting under a sub-path (e.g. GitHub Pages project site): `BASE_PATH=/repo-name npm run build`.

## Structure

```
public/gloss-data.json    9,872 gloss units (≈5 MB; ~1 MB gzipped) — from build/parse_gloss.py
public/abbrev-data.json   capitula register + all abbreviation tables — from the rev. 9/23 spreadsheet
public/downloads/         the rev. 9/23 Word, PDF and Excel files, served from /text

lib/search.ts             pure search core (exact-punctuation default; ip/cs/ww modes)
lib/data.ts               types + hierarchy flattening
lib/abbrev.ts             register types, allegationQuery(), BASE-path helper

components/DecretalsApp   search page orchestrator (state, caches, URL sync ?q= / ?loc= + legacy #hash)
components/ReadingView    chapter reader + register block ("Find the allegations of this capitulum")
components/AbbrevExplorer /abbreviations — filterable register & abbreviation tables
app/…                     /, /abbreviations, /about, /text, /allegations, /ancillaria, /gratissimi, /contact

tests/search.test.ts      corpus + register tests (39 checks)
tests/smoke.jsdom.js      end-to-end against ./out (25 checks; SMOKE_PART=a|b|c to run in slices)
```

Searching is entirely client-side: nothing leaves the user's machine, hosting stays free, results are instant (9,872 units scanned in a few ms).

## Data notes

- Register integration is validated corpus-wide: 1,969/1,971 capitula have register allegation counts exactly matching corpus hits of `abbrev, incipit`. The two exceptions, and other source-file quirks, are documented in `../README.md` (errata).
- One documented correction was applied to the extracted spreadsheet data: X 4.7.6 incipit *signifiasti* → *significasti* (matches the gloss text and the chapter heading).

## Versions

Pinned to Next 15.5 / React 19 (stable App Router APIs only; `npm install next@latest` to move to 16 when desired).
