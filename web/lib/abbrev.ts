/** Types for abbrev-data.json (extracted from Reno's abbreviations spreadsheet, rev. 9/23). */

export interface Capitulum {
  ref: string; // "4.17.13" (or "1.3.ex" for extravagantes rows in the register)
  title: string; // "Qui filii sint legitimi"
  fullInc: string; // "Per venerabilem fratrem"
  inc: string; // "Per venerabilem" (display incipit)
  insc: string; // inscription, e.g. "Idem nobili viro G. Montis Pessulani."
  n: number; // times alleged in the gloss, per the register
  abbrev: string; // "qui fil. sint legit."
  ddinc: string; // "per venerabilem" — Digital Decretals standardized incipit
}
export interface ExtravRow {
  ref: string;
  title: string;
  inc: string;
}
export interface DTitle {
  num: string;
  abbrev: string;
  full: string;
}
export interface RomanRow {
  code: string; // Cod | Dig | Inst | Nov
  loc: string;
  abbrev: string;
  full: string;
  alt: string; // "abbreviation sometimes found"
}
export interface AbbrevData {
  generated: string;
  capitula: Capitulum[];
  extravagantes: ExtravRow[];
  decretalsTitles: DTitle[];
  roman: RomanRow[];
}

/** The standardized allegation search string for a capitulum. */
export const allegationQuery = (c: Capitulum) => `${c.abbrev}, ${c.ddinc}`;

/** Prefix for static assets; set BASE_PATH at build time when hosting under a sub-path. */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (p: string) => `${BASE}${p}`;
