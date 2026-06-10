import type { Metadata } from "next";
import AbbrevExplorer from "@/components/AbbrevExplorer";

export const metadata: Metadata = {
  title: "Abbreviations & Capitula Register",
  description:
    "Look up every title abbreviation used in the Glossa Ordinaria's standardized allegations — Liber extra, Codex, Digest, Institutes, Novellae — plus the full register of 1971 capitula with allegation counts.",
};

export default function AbbreviationsPage() {
  return <AbbrevExplorer />;
}
