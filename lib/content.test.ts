import { describe, expect, it } from "vitest";
import { getMethod, getProjectBySlug, getProjects, getSkills } from "./content";

describe("local Markdown content", () => {
  it("reads the authored portfolio projects with unique slugs", () => {
    const projects = getProjects();
    expect(projects).toHaveLength(7);
    expect(new Set(projects.map((project) => project.slug)).size).toBe(projects.length);
    expect(projects.every((project) => project.category && project.system.length > 0 && project.preview.metrics.length === 3 && project.preview.takeaway)).toBe(true);
    expect(projects.some((project) => project.slug === "olist-payment-behavior-analytics")).toBe(true);
    expect(projects.some((project) => project.slug === "brent-oil-market-dynamics")).toBe(true);
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

  it("loads comprehensive markdown narrative for olist payment behavior analytics", () => {
    const project = getProjectBySlug("olist-payment-behavior-analytics");
    expect(project).toBeDefined();
    expect(project?.body.length).toBeGreaterThan(1000);
    expect(project?.body).toContain("1. Executive Summary & Problem Scope");
    expect(project?.body).toContain("2. Relational Schema & Data Preparation Pipeline");
    expect(project?.body).toContain("3. Empirical Finding 1: Payment Method Distribution & Wallet Share");
    expect(project?.body).toContain("4. Empirical Finding 2: Installment Elasticity Model & Basket Size Multiplier");
    expect(project?.body).toContain("5. Diagnostic Investigation: The 10x Installment Checkout Anomaly");
    expect(project?.body).toContain("6. Empirical Finding 3: Category Financing Sensitivity Matrix");
    expect(project?.body).toContain("7. Strategic Action Recommendations");
    expect(project?.body).toContain("8. Analytical Limitations & Methodological Guardrails");
  });

  it("loads comprehensive markdown narrative for brent oil market dynamics", () => {
    const project = getProjectBySlug("brent-oil-market-dynamics");
    expect(project).toBeDefined();
    expect(project?.tools).toContain("Time-Series Econometrics");
    expect(project?.preview.metrics).toHaveLength(3);
    expect(project?.body.length).toBeGreaterThan(1000);
    expect(project?.body).toContain("1. Executive Summary & Macro Problem Scope");
    expect(project?.body).toContain("2. Dataset Hygiene & Multi-Format Date Normalization Pipeline");
    expect(project?.body).toContain("3. Four Decades of Market Regimes (1987–2022 Macro Evolution)");
    expect(project?.body).toContain("4. Geopolitical Shock & Event-Driven Impact Modeling");
    expect(project?.body).toContain("5. Statistical Risk Dynamics: Volatility Clustering, Fat Tails & VaR");
    expect(project?.body).toContain("6. Time-Series Dynamics: Trend Decomposition & Forecasting Limits");
    expect(project?.body).toContain("7. Interactive Power BI DAX & Enterprise Dashboard Architecture");
    expect(project?.body).toContain("8. Methodological Limitations & Commodity Forecasting Guardrails");
  });

  it("filters out dedicated route folders from dynamic project static params", () => {
    const dynamicSlugs = getProjects()
      .filter((p) => p.slug !== "amazon-product-intelligence" && p.slug !== "olist-payment-behavior-analytics")
      .map((project) => ({ slug: project.slug }));

    expect(dynamicSlugs).toHaveLength(5);
    expect(dynamicSlugs.map((s) => s.slug)).not.toContain("amazon-product-intelligence");
    expect(dynamicSlugs.map((s) => s.slug)).not.toContain("olist-payment-behavior-analytics");
    expect(dynamicSlugs.map((s) => s.slug)).toContain("brent-oil-market-dynamics");
  });
});
