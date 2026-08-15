import { describe, expect, it } from "vitest";
import { getMethod, getProjectBySlug, getProjects, getSkills } from "./content";

describe("local Markdown content", () => {
  it("reads the authored portfolio projects with unique slugs", () => {
    const projects = getProjects();
    expect(projects).toHaveLength(5);
    expect(new Set(projects.map((project) => project.slug)).size).toBe(projects.length);
    expect(projects.every((project) => project.category && project.system.length > 0 && project.preview.metrics.length === 3 && project.preview.takeaway)).toBe(true);
  });

  it("keeps project detail metadata available at build time", () => {
    const project = getProjectBySlug("ml-product-mapping-system");
    expect(project?.tools).toContain("Python");
    expect(project?.lessons.length).toBeGreaterThan(0);
    expect(project?.evidence).toHaveLength(3);
    expect(project?.evidence.every((item) => item.slot && item.title && item.alt)).toBe(true);
  });

  it("exposes the Amazon case study and its static-only evidence at build time", () => {
    const project = getProjectBySlug("amazon-product-intelligence");
    expect(project?.category).toBe("Applied Data Science");
    expect(project?.tools).toContain("scikit-learn");
    expect(project?.evidence).toHaveLength(3);
    expect(project?.preview.metrics).toContainEqual({ label: "Best F1", value: "0.7414" });
  });

  it("links skills to local project evidence and provides a method section", () => {
    const skills = getSkills();
    expect(skills.groups.flatMap((group) => group.skills).some((skill) => skill.evidence.length > 0)).toBe(true);
    expect(getMethod().steps).toHaveLength(3);
  });
});
