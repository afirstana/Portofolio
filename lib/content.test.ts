import { describe, expect, it } from "vitest";
import { getMethod, getProjectBySlug, getProjects, getSkills } from "./content";

describe("local Markdown content", () => {
  it("reads the authored portfolio projects with unique slugs", () => {
    const projects = getProjects();
    expect(projects).toHaveLength(11);
    expect(new Set(projects.map((project) => project.slug)).size).toBe(projects.length);
    expect(projects.every((project) => project.category && project.system.length > 0 && project.preview.metrics.length >= 3 && project.preview.takeaway)).toBe(true);
    expect(projects.some((project) => project.slug === "banking-transaction-anti-fraud")).toBe(true);
    expect(projects.some((project) => project.slug === "banking-fraud-3d-network-intelligence")).toBe(true);
    expect(projects.some((project) => project.slug === "brent-oil-3d-volatility-manifold")).toBe(true);
    expect(projects.some((project) => project.slug === "olist-payment-behavior-analytics")).toBe(true);
    expect(projects.some((project) => project.slug === "brent-oil-market-dynamics")).toBe(true);
    expect(projects.some((project) => project.slug === "global-cancer-epidemiology-surveillance")).toBe(true);
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
    expect(project?.body).toContain("01. Brazilian Payment Infrastructure & Wallet Share Matrix");
    expect(project?.body).toContain("02. Multi-Payment Ingestion & Normalization Rules");
    expect(project?.body).toContain("03. Installment Elasticity Model & Basket Size Multiplier");
    expect(project?.body).toContain("04. Diagnostic Investigation: The 10x Checkout Anomaly");
    expect(project?.body).toContain("05. Category Financing Sensitivity Matrix");
    expect(project?.body).toContain("06. Strategic Spotlight: \"Watches & Gifts\" Commercial Blueprint");
    expect(project?.body).toContain("07. Strategic Action Recommendations");
    expect(project?.body).toContain("08. Strategic Fintech Lessons");
  });

  it("loads comprehensive markdown narrative for brent oil market dynamics", () => {
    const project = getProjectBySlug("brent-oil-market-dynamics");
    expect(project).toBeDefined();
    expect(project?.tools).toContain("Time-Series Econometrics");
    expect(project?.preview.metrics).toHaveLength(3);
    expect(project?.body.length).toBeGreaterThan(1000);
    expect(project?.body).toContain("01. 35.5-Year Benchmark Telemetry Matrix");
    expect(project?.body).toContain("02. Dataset Hygiene & Multi-Format Date Normalization Pipeline");
    expect(project?.body).toContain("03. Four Decades of Market Regimes");
    expect(project?.body).toContain("04. Geopolitical Shock & Event-Driven Impact Modeling");
    expect(project?.body).toContain("05. Statistical Risk Dynamics: Volatility Clustering, Fat Tails & VaR");
    expect(project?.body).toContain("06. Time-Series Dynamics: Trend Regimes & Stationarity");
    expect(project?.body).toContain("07. Interactive Power BI DAX & Enterprise Dashboard Architecture");
    expect(project?.body).toContain("08. Institutional Decision Impact & Governance");
  });

  it("loads comprehensive markdown narrative for global cancer epidemiology surveillance", () => {
    const project = getProjectBySlug("global-cancer-epidemiology-surveillance");
    expect(project).toBeDefined();
    expect(project?.tools).toContain("Python");
    expect(project?.preview.metrics).toHaveLength(3);
    expect(project?.body.length).toBeGreaterThan(1000);
    expect(project?.body).toContain("01. Global Epidemiological Telemetry Matrix");
    expect(project?.body).toContain("02. Multi-File Panel Ingestion & Data Hygiene Protocol");
    expect(project?.body).toContain("03. Thirty-Year Longitudinal Trends & Age-Standardized Trajectories");
    expect(project?.body).toContain("04. Cross-National Disparities & Eastern European Mortality Clustering");
    expect(project?.body).toContain("05. Cancer Site Etiology & Behavioral Risk Attribution");
    expect(project?.body).toContain("06. Socio-Economic Elasticity: GDP per Capita vs Cancer Mortality");
    expect(project?.body).toContain("07. 5-Year Clinical Survival Heterogeneity Matrix");
    expect(project?.body).toContain("08. Strategic Epidemiological Lessons");
  });

  it("filters out dedicated route folders from dynamic project static params", () => {
    const dynamicSlugs = getProjects()
      .filter(
        (p) =>
          p.slug !== "amazon-product-intelligence" &&
          p.slug !== "olist-payment-behavior-analytics" &&
          p.slug !== "banking-transaction-anti-fraud" &&
          p.slug !== "brent-oil-market-dynamics" &&
          p.slug !== "brent-oil-3d-volatility-manifold" &&
          p.slug !== "banking-fraud-3d-network-intelligence"
      )
      .map((project) => ({ slug: project.slug }));

    expect(dynamicSlugs).toHaveLength(5);
    expect(dynamicSlugs.map((s) => s.slug)).not.toContain("amazon-product-intelligence");
    expect(dynamicSlugs.map((s) => s.slug)).not.toContain("olist-payment-behavior-analytics");
    expect(dynamicSlugs.map((s) => s.slug)).not.toContain("banking-transaction-anti-fraud");
    expect(dynamicSlugs.map((s) => s.slug)).not.toContain("brent-oil-market-dynamics");
    expect(dynamicSlugs.map((s) => s.slug)).not.toContain("brent-oil-3d-volatility-manifold");
    expect(dynamicSlugs.map((s) => s.slug)).not.toContain("banking-fraud-3d-network-intelligence");
    expect(dynamicSlugs.map((s) => s.slug)).toContain("global-cancer-epidemiology-surveillance");
  });
});
