import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const contentRoot = path.join(process.cwd(), "content", "opinions");

export type OpinionArticle = {
  title: string;
  subtitle: string;
  slug: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  thesis: string;
  coverImage?: string;
  body: string;
};

export function getOpinions(): OpinionArticle[] {
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
        ...(parsed.data as Omit<OpinionArticle, "body">),
        body: parsed.content.trim(),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getOpinionBySlug(slug: string): OpinionArticle | undefined {
  return getOpinions().find((opinion) => opinion.slug === slug);
}

export function getAdjacentOpinions(current: OpinionArticle) {
  const opinions = getOpinions();
  const index = opinions.findIndex((item) => item.slug === current.slug);
  return {
    previous: opinions[index - 1] ?? opinions.at(-1),
    next: opinions[index + 1] ?? opinions[0],
  };
}

export function getOpinionCategories(): string[] {
  const opinions = getOpinions();
  const set = new Set(opinions.map((o) => o.category));
  return ["All", ...Array.from(set)];
}
