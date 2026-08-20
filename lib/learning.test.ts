import { describe, expect, it } from "vitest";
import { getAdjacentLearningTracks, getLearningTrackBySlug, getLearningTracks } from "./learning";

describe("Ongoing Learning & Academy Modules System", () => {
  it("loads all active learning tracks with full metadata and progress bar values", () => {
    const tracks = getLearningTracks();
    expect(tracks.length).toBeGreaterThan(0);

    const awsTrack = tracks.find((t) => t.slug === "aws-ai-academy-2026");
    expect(awsTrack).toBeDefined();
    expect(awsTrack?.title).toBe("AWS AI Academy 2026");
    expect(awsTrack?.provider).toContain("AWS");
    expect(awsTrack?.progressPct).toBe(1);
    expect(awsTrack?.progressFraction).toBe("1/100");
    expect(awsTrack?.modules.length).toBe(4);
  });

  it("retrieves a track by slug accurately", () => {
    const track = getLearningTrackBySlug("aws-ai-academy-2026");
    expect(track).toBeDefined();
    expect(track?.slug).toBe("aws-ai-academy-2026");
    expect(track?.badge).toBe("AWS SCHOLARSHIP COHORT");
    expect(track?.body).toContain("01. Program Objective & Context");
  });

  it("handles adjacent track navigation gracefully", () => {
    const track = getLearningTrackBySlug("aws-ai-academy-2026");
    expect(track).toBeDefined();
    if (track) {
      const adjacent = getAdjacentLearningTracks(track);
      expect(adjacent).toHaveProperty("previous");
      expect(adjacent).toHaveProperty("next");
    }
  });
});
