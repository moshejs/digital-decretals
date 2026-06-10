/** Canonical site URL: explicit env first, then Vercel's production URL, then localhost. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const ROUTES = ["/", "/abbreviations", "/text", "/allegations", "/about", "/ancillaria", "/gratissimi", "/contact"];
