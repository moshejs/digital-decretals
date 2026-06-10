import type { Metadata, Viewport } from "next";
import SiteNav from "@/components/SiteNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Digital Decretals — Glossa Ordinaria of Bernard of Parma",
  description:
    "Searchable edition of Bernard of Parma's Glossa Ordinaria to the Decretals of Gregory IX (Liber extra), Books 1–5 complete, with standardized legal allegations, abbreviation tables, and the full capitula register. Text by Edward A. Reno III.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site">
          <div className="site-inner">
            <h1>
              <span className="dd">The Digital Decretals</span> · Glossa Ordinaria
            </h1>
            <p className="sub">
              Bernard of Parma's gloss on the <b>Decretals of Gregory IX</b> (Liber extra) · Books 1–5 complete ·
              text by <b>Edward A. Reno III</b>, Adelphi University
            </p>
            <SiteNav />
          </div>
        </header>
        {children}
        <footer className="site">
          <div className="site-inner">
            <span>
              Text &amp; standardized allegations © Edward A. Reno III —{" "}
              <a href="https://sites.google.com/view/digitaldecretals/" target="_blank" rel="noopener noreferrer">
                original Digital Decretals site
              </a>
            </span>
            <span>Glossa Ordinaria, Books 1–5 complete (rev. 9/23), based on the Editio Romana (1582)</span>
            <span>
              <a href="mailto:ereno@adelphi.edu">ereno@adelphi.edu</a>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
