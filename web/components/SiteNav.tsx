"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS: Array<[href: string, label: string]> = [
  ["/", "Search"],
  ["/abbreviations", "Abbreviations"],
  ["/statistics", "Statistics"],
  ["/text", "The Text"],
  ["/allegations", "Legal Allegations"],
  ["/about", "About"],
  ["/ancillaria", "Ancillaria"],
  ["/gratissimi", "Gratissimi"],
  ["/contact", "Contact"],
];

export default function SiteNav() {
  const path = usePathname() ?? "/";
  return (
    <nav className="mainnav" aria-label="Site">
      {LINKS.map(([href, label]) => {
        const active = href === "/" ? path === "/" : path.startsWith(href);
        return (
          <Link key={href} href={href} className={active ? "active" : ""}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
