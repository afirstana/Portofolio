import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const contentRoot = path.join(process.cwd(), "content");

export type HeroContent = { name: string; tagline: string; cta_label: string; location: string; eyebrow: string };
export type AboutContent = { photo: string; bio_text: string; values: string[]; eyebrow: string; heading: string };
export type Skill = { name: string; evidence: string[] };
export type SkillsContent = { eyebrow: string; heading: string; groups: Array<{ name: string; skills: Skill[] }> };
export type TimelineContent = { eyebrow: string; heading: string; entries: Array<{ role: string; period: string; description: string; detail: string; tools: string[] }> };
export type ContactContent = { eyebrow: string; heading: string; email: string; cta_text: string; copy_label: string; social_links: Array<{ label: string; url: string }> };
export type MethodContent = { eyebrow: string; heading: string; steps: Array<{ title: string; description: string }> };
export type ProjectSystem = { label: string; value: string };
export type ProjectEvidence = { slot: string; kind: "screenshot" | "diagram" | "dashboard"; title: string; description: string; alt: string; image?: string };
export type ProjectPreview = { eyebrow: string; metrics: Array<{ label: string; value: string }>; takeaway: string };
export type Project = {
  title: string; slug: string; one_liner: string; problem: string; approach: string; impact: string;
  category: string; tools: string[]; skills: string[]; order: number; system: ProjectSystem[]; lessons: string[]; evidence: ProjectEvidence[]; preview: ProjectPreview; body: string;
};

function readFrontmatter<T>(relativePath: string): T {
  const source = fs.readFileSync(path.join(contentRoot, relativePath), "utf8");
  return matter(source).data as T;
}

export function getHero() { return readFrontmatter<HeroContent>("hero.md"); }
export function getAbout() { return readFrontmatter<AboutContent>("about.md"); }
export function getSkills() { return readFrontmatter<SkillsContent>("skills.md"); }
export function getTimeline() { return readFrontmatter<TimelineContent>("timeline.md"); }
export function getContact() { return readFrontmatter<ContactContent>("contact.md"); }
export function getMethod() { return readFrontmatter<MethodContent>("method.md"); }

export function getProjects(): Project[] {
  const directory = path.join(contentRoot, "projects");
  return fs.readdirSync(directory)
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => {
      const parsed = matter(fs.readFileSync(path.join(directory, filename), "utf8"));
      return { ...(parsed.data as Omit<Project, "body">), body: parsed.content.trim() };
    })
    .sort((left, right) => left.order - right.order);
}

export function getProjectBySlug(slug: string) { return getProjects().find((project) => project.slug === slug); }
export function getRelatedProjects(project: Project) {
  return getProjects().filter((item) => item.slug !== project.slug && item.skills.some((skill) => project.skills.includes(skill))).slice(0, 2);
}
export function getAdjacentProjects(project: Project) {
  const projects = getProjects(); const position = projects.findIndex((item) => item.slug === project.slug);
  return { previous: projects[position - 1] ?? projects.at(-1), next: projects[position + 1] ?? projects[0] };
}
