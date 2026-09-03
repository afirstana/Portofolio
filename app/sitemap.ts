import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content";
import { getLearningTracks } from "@/lib/learning";
import { getOpinions } from "@/lib/opinions";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const now = new Date();

  // Core Landing & Index Pages
  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/learning/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/opinion/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
  ];

  // All 9 Project Case Studies
  const projectRoutes: MetadataRoute.Sitemap = getProjects().map((project) => ({
    url: `${baseUrl}/projects/${project.slug}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  // All 7 Certification & Learning Tracks
  const learningRoutes: MetadataRoute.Sitemap = getLearningTracks().map((track) => ({
    url: `${baseUrl}/learning/${track.slug}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // All 4 Technical Architecture Opinions
  const opinionRoutes: MetadataRoute.Sitemap = getOpinions().map((opinion) => ({
    url: `${baseUrl}/opinion/${opinion.slug}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...coreRoutes, ...projectRoutes, ...learningRoutes, ...opinionRoutes];
}
