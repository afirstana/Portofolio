import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const contentRoot = path.join(process.cwd(), "content", "learning");

export type LearningModule = {
  name: string;
  url: string;
  status: string;
  level: string;
  summary: string;
};

export type LearningTrack = {
  title: string;
  subtitle: string;
  slug: string;
  provider: string;
  status: string;
  progressPct: number;
  progressFraction?: string;
  startDate: string;
  endDate: string;
  category: string;
  badge: string;
  tags: string[];
  modules: LearningModule[];
  thesis: string;
  coverImage?: string;
  body: string;
};

export function getLearningTracks(): LearningTrack[] {
  if (!fs.existsSync(contentRoot)) {
    return [];
  }

  return fs
    .readdirSync(contentRoot)
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => {
      const fullPath = path.join(contentRoot, filename);
      const fileContent = fs.readFileSync(fullPath, "utf8");
      const parsed = matter(fileContent);
      return {
        ...(parsed.data as Omit<LearningTrack, "body">),
        body: parsed.content.trim(),
      };
    })
    .sort((a, b) => b.progressPct - a.progressPct);
}

export function getLearningTrackBySlug(slug: string): LearningTrack | undefined {
  return getLearningTracks().find((track) => track.slug === slug);
}

export function getAdjacentLearningTracks(current: LearningTrack) {
  const tracks = getLearningTracks();
  const index = tracks.findIndex((item) => item.slug === current.slug);
  return {
    previous: tracks[index - 1] ?? tracks.at(-1),
    next: tracks[index + 1] ?? tracks[0],
  };
}
