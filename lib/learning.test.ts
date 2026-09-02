import { describe, expect, it } from "vitest";
import { getAdjacentLearningTracks, getLearningTrackBySlug, getLearningTracks } from "./learning";

describe("Ongoing Learning & Academy Modules System", () => {
  it("loads all active learning tracks with full metadata and progress bar values", () => {
    const tracks = getLearningTracks();
    expect(tracks.length).toBeGreaterThanOrEqual(6);

    const awsTrack = tracks.find((t) => t.slug === "aws-ai-academy-2026");
    expect(awsTrack).toBeDefined();
    expect(awsTrack?.title).toBe("AWS AI Academy 2026");
    expect(awsTrack?.provider).toContain("AWS");
    expect(awsTrack?.progressPct).toBe(1);
    expect(awsTrack?.progressFraction).toBe("1/100");
    expect(awsTrack?.modules.length).toBe(4);

    const datacampTrack = tracks.find((t) => t.slug === "datacamp-data-analyst-associate");
    expect(datacampTrack).toBeDefined();
    expect(datacampTrack?.title).toContain("Data Analyst Associate");
    expect(datacampTrack?.provider).toContain("DataCamp");
    expect(datacampTrack?.progressPct).toBe(100);
    expect(datacampTrack?.modules.length).toBe(4);

    const komdigiTrack = tracks.find((t) => t.slug === "komdigi-project-management-fundamental");
    expect(komdigiTrack).toBeDefined();
    expect(komdigiTrack?.provider).toContain("Komdigi");
    expect(komdigiTrack?.progressPct).toBe(100);

    const dqlabTrack = tracks.find((t) => t.slug === "dqlab-data-science-ai-foundations");
    expect(dqlabTrack).toBeDefined();
    expect(dqlabTrack?.provider).toContain("DQLab");
    expect(dqlabTrack?.modules.length).toBe(5);
  });

  it("retrieves a track by slug accurately", () => {
    const awsTrack = getLearningTrackBySlug("aws-ai-academy-2026");
    expect(awsTrack).toBeDefined();
    expect(awsTrack?.slug).toBe("aws-ai-academy-2026");
    expect(awsTrack?.badge).toBe("AWS SCHOLARSHIP COHORT");
    expect(awsTrack?.body).toContain("01. Program Objective & Context");

    const datacampTrack = getLearningTrackBySlug("datacamp-data-analyst-associate");
    expect(datacampTrack).toBeDefined();
    expect(datacampTrack?.slug).toBe("datacamp-data-analyst-associate");
    expect(datacampTrack?.badge).toBe("VERIFIED CREDENTIAL");
    expect(datacampTrack?.body).toContain("01. Certification Overview");
  });

  it("handles adjacent track navigation gracefully between tracks", () => {
    const track = getLearningTrackBySlug("datacamp-data-analyst-associate");
    expect(track).toBeDefined();
    if (track) {
      const adjacent = getAdjacentLearningTracks(track);
      expect(adjacent).toHaveProperty("previous");
      expect(adjacent).toHaveProperty("next");
    }
  });
});
