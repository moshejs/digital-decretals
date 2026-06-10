export interface Example {
  q: string;
  what: string;
  ww?: boolean;
  cs?: boolean;
}

/** Clickable sample searches — every one verified to return hits in the current corpus. */
export const EXAMPLES: Example[] = [
  { q: "qui fil. sint legit., per venerabilem", what: "all citations of X 4.17.13" },
  { q: "de frig. et malef., quod sedem", what: "all citations of X 4.15.2" },
  { q: "de elect., venerabilem", what: "all citations of X 1.6.34" },
  { q: "15. q. 8, si quis presbyter", what: "Decretum, C. 15 q. 8 c. 4" },
  { q: "C. de legi. et const., non dubium", what: "Codex 1.14.5" },
  { q: "ff. de regul. iur.", what: "Digest 50.17, by title" },
  { q: "extravag.", what: "all post-1234 legislation" },
  { q: "matrimonium", what: "plain word search" },
  { q: "versus", what: "mnemonic verses", ww: true },
  { q: "Host.", what: "opinions of Hostiensis", ww: true, cs: true },
];
