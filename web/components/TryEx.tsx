import Link from "next/link";

/** A documented allegation example with a working "search it" button. */
export default function TryEx({
  q,
  eq,
  ww,
  cs,
  noBtn,
}: {
  q: string;
  eq: string;
  ww?: boolean;
  cs?: boolean;
  noBtn?: boolean;
}) {
  const href = `/?q=${encodeURIComponent(q)}${ww ? "&ww=1" : ""}${cs ? "&cs=1" : ""}`;
  return (
    <div className="ex-line">
      <code>{q}</code>
      <span className="eq">=</span>
      <span>{eq}</span>
      {!noBtn && (
        <Link className="try" href={href}>
          Search →
        </Link>
      )}
    </div>
  );
}
