import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page" style={{ textAlign: "center", paddingTop: 70, paddingBottom: 120 }}>
      <h1 style={{ fontSize: 42, marginBottom: 6 }}>
        <span style={{ color: "var(--rubric)" }}>404</span> — non invenitur
      </h1>
      <p className="lede">This page is not in the collection.</p>
      <p>
        Try the <Link href="/">search page</Link> — every gloss, capitulum, and allegation is findable from there —
        or look up a citation in the <Link href="/abbreviations">Abbreviations explorer</Link>.
      </p>
    </main>
  );
}
