import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteConfig.url, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }, ...getProjects().map((project) => ({ url: `${siteConfig.url}/projects/${project.slug}/`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 }))];
}
