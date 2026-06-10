import type { MetadataRoute } from "next";
import { SITE_URL, ROUTES } from "@/lib/site";
import { uniqueRefs } from "@/lib/chapters";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const pages: MetadataRoute.Sitemap = ROUTES.map((path) => ({
    url: path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}/`,
    lastModified,
    changeFrequency: path === "/" ? "monthly" : "yearly",
    priority: path === "/" ? 1 : path === "/abbreviations" ? 0.8 : 0.6,
  }));
  const chapters: MetadataRoute.Sitemap = uniqueRefs.map((ref) => ({
    url: `${SITE_URL}/x/${ref}/`,
    lastModified,
    changeFrequency: "yearly",
    priority: 0.5,
  }));
  return [...pages, ...chapters];
}
