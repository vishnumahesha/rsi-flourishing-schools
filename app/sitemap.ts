import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rsi-flourishing.vercel.app";

/** Public, indexable routes. Dashboard/auth/api are intentionally excluded. */
const routes = [
  "",
  "/about",
  "/research",
  "/professional-development",
  "/flourishing-schools-project",
  "/impact",
  "/resources",
  "/get-involved",
  "/apply",
  "/blog",
  "/contact",
  "/privacy",
  "/responsible-ai",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
