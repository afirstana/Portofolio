import { describe, expect, it } from "vitest";
import { getAdjacentOpinions, getOpinionBySlug, getOpinions } from "./opinions";

describe("Opinions Content Layer", () => {
  it("loads and parses all opinion essays with required fields", () => {
    const opinions = getOpinions();
    expect(opinions.length).toBeGreaterThanOrEqual(3);

    for (const opinion of opinions) {
      expect(opinion.title).toBeTruthy();
      expect(opinion.slug).toBeTruthy();
      expect(opinion.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(opinion.readTime).toMatch(/min read/);
      expect(opinion.category).toBeTruthy();
      expect(opinion.thesis).toBeTruthy();
      expect(opinion.body.length).toBeGreaterThan(100);
      expect(Array.isArray(opinion.tags)).toBe(true);
      expect(opinion.tags.length).toBeGreaterThan(0);
    }
  });

  it("retrieves a single opinion essay by slug", () => {
    const target = "why-dashboards-fail-to-drive-decisions";
    const opinion = getOpinionBySlug(target);
    expect(opinion).toBeDefined();
    expect(opinion?.slug).toBe(target);
    expect(opinion?.title).toContain("Why Most Dashboards Fail");
  });

  it("returns correct previous and next adjacent opinions", () => {
    const opinions = getOpinions();
    const first = opinions[0];
    const adjacent = getAdjacentOpinions(first);
    expect(adjacent.next).toBeDefined();
    expect(adjacent.previous).toBeDefined();
  });
});
