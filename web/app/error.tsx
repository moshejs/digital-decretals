"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="page" style={{ textAlign: "center", paddingTop: 70, paddingBottom: 120 }}>
      <h1 style={{ fontSize: 30 }}>Something went wrong</h1>
      <p className="lede">{error?.message || "An unexpected error occurred."}</p>
      <p>
        <button
          onClick={reset}
          style={{
            border: "1px solid var(--line)",
            background: "var(--panel)",
            borderRadius: 9,
            padding: "9px 22px",
            color: "var(--rubric)",
            fontWeight: 600,
          }}
        >
          Try again
        </button>
      </p>
    </main>
  );
}
