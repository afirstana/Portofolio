/// <reference types="vitest/globals" />

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getProjects } from "./content";

const root = process.cwd();

describe("Project Explorer sneak peek", () => {
  it("keeps content-backed preview metadata for every authored project", () => {
    const projects = getProjects();
    expect(projects).toHaveLength(9);
    expect(projects.every((project) => project.preview.eyebrow && project.preview.metrics.length >= 3 && project.preview.takeaway)).toBe(true);
    expect(getProjects().find((project) => project.slug === "banking-transaction-anti-fraud")?.preview.metrics).toContainEqual({ label: "Analyzed Scope", value: "2,512 Txns" });
    expect(getProjects().find((project) => project.slug === "amazon-product-intelligence")?.preview.metrics).toContainEqual({ label: "ROC–AUC", value: "0.8369" });
    expect(getProjects().find((project) => project.slug === "brent-oil-market-dynamics")?.preview.metrics).toContainEqual({ label: "Timeline Span", value: "35.5 Yrs (9.0k Days)" });
    expect(getProjects().find((project) => project.slug === "global-cancer-epidemiology-surveillance")?.preview.metrics).toContainEqual({ label: "Panel Scope", value: "281.4k Rows (26 CSVs)" });
  });

  it("provides equivalent hover, keyboard-focus, and mobile touch selectors", () => {
    const css = fs.readFileSync(path.join(root, "app", "globals.css"), "utf8");
    expect(css).toContain(".project-row:hover, .project-row:focus-visible");
    expect(css).toContain(".project-row:hover .project-sneak, .project-row:focus-visible .project-sneak");
    expect(css).toContain(".project-sneak { position: static");
  });
});
