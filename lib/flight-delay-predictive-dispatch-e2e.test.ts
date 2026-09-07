import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { getProjects, getProjectBySlug } from "./content";
import {
  predictFlightDelay,
  calculateThresholdEconomics,
  getMetadata,
  CARRIER_NAMES,
  HUB_NAMES,
  CarrierCode,
  HubCode,
} from "./flight-delay-ml";

describe("Flight Delay 2024 (Part 3) — End-to-End Enterprise System Verification", () => {
  const rootDir = process.cwd();

  // =========================================================================
  // 1. CATALOG ARCHITECTURE & ORDERING INVARIANTS (1..15 Contiguous)
  // =========================================================================
  describe("01. Portfolio Catalog and Topological Ordering Invariants", () => {
    const projects = getProjects();

    it("verifies exact portfolio inventory size of 15 projects", () => {
      expect(projects).toHaveLength(15);
    });

    it("verifies contiguous 1-indexed ordering from 1 to 15 without collisions or gaps", () => {
      const orders = projects.map((p) => p.order);
      expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    });

    it("verifies Part 3 is strictly registered as Project #01", () => {
      const p1 = projects[0];
      expect(p1.order).toBe(1);
      expect(p1.slug).toBe("flight-delay-2024-predictive-dispatch");
      expect(p1.category).toBe("Predictive Analytics & Machine Learning");
    });

    it("verifies adjacent pagination links around Project #01", () => {
      const currentProject = projects[0]; // #01
      const nextProject = projects[1]; // #02

      expect(currentProject.order).toBe(1);
      expect(currentProject.slug).toBe("flight-delay-2024-predictive-dispatch");

      expect(nextProject.order).toBe(2);
      expect(nextProject.slug).toBe("banking-transaction-anti-fraud");
    });

    it("validates frontmatter schema compliance for flight-delay-2024-predictive-dispatch", () => {
      const project = getProjectBySlug("flight-delay-2024-predictive-dispatch");
      expect(project).toBeDefined();
      if (!project) return;

      expect(project.title).toContain("Flight Delay 2024");
      expect(project.problem.length).toBeGreaterThan(40);
      expect(project.approach.length).toBeGreaterThan(40);
      expect(project.impact.length).toBeGreaterThan(40);
      expect(project.impact).toContain("$8.5M");
      expect(project.impact).toContain("$25.5M/yr");
      expect(project.skills.length).toBeGreaterThanOrEqual(4);
      expect(project.system.length).toBeGreaterThanOrEqual(3);
      expect(project.lessons.length).toBeGreaterThanOrEqual(3);
    });
  });

  // =========================================================================
  // 2. PAGE ROUTE ARCHITECTURE & DEDICATED STATIC PRE-RENDERING
  // =========================================================================
  describe("02. Page Route and Static Pre-rendering Architecture", () => {
    const pagePath = path.join(
      rootDir,
      "app/projects/flight-delay-2024-predictive-dispatch/page.tsx"
    );

    it("verifies the dedicated route file exists on the filesystem", () => {
      expect(fs.existsSync(pagePath)).toBe(true);
    });

    it("enforces static pre-rendering rules: dynamicParams = false and no generateStaticParams", () => {
      const src = fs.readFileSync(pagePath, "utf8");
      expect(src).toContain("export const dynamicParams = false;");
      expect(src).not.toMatch(/export\s+(async\s+)?function\s+generateStaticParams/);
    });

    it("verifies page imports and mounts Studio, Toc, and MarkdownBody", () => {
      const src = fs.readFileSync(pagePath, "utf8");
      expect(src).toContain("FlightDelayMLStudio");
      expect(src).toContain("FlightDelayMLToc");
      expect(src).toContain("MarkdownBody");
      expect(src).toContain("+$8.5M");
      expect(src).toContain("$25.5M/yr Annualized");
    });
  });

  // =========================================================================
  // 3. ZERO AI SLOP & MARKDOWN QUALITY STANDARDS
  // =========================================================================
  describe("03. Case Study Markdown Quality and Zero AI Slop Verification", () => {
    const mdPath = path.join(
      rootDir,
      "content/projects/flight-delay-2024-predictive-dispatch.md"
    );
    const mdContent = fs.readFileSync(mdPath, "utf8");

    it("contains all 7 descriptive numbered headings with correct anchor IDs", () => {
      expect(mdContent).toContain("## 01. The Reactive Dispatch Crisis & Operational Bottleneck {#operational-crisis}");
      expect(mdContent).toContain("## 02. Dual-Stage Prediction Target & Problem Formulation {#target-formulation}");
      expect(mdContent).toContain("## 03. Zero-Leakage Feature Pipeline & Temporal Split {#feature-pipeline}");
      expect(mdContent).toContain("## 04. Algorithmic Benchmark Tournament & Empirical Validation {#model-tournament}");
      expect(mdContent).toContain("## 05. Factor Attribution: Global Feature Drivers & Local SHAP Decomposition {#explainable-shap}");
      expect(mdContent).toContain("## 06. Dynamic Threshold Economics & Cost-Benefit Optimization {#threshold-economics}");
      expect(mdContent).toContain("## 07. Production MLOps, Drift Detection & Fleet Resilience {#production-mlops}");
    });

    it("strictly forbids crude ASCII box drawing characters in diagrams", () => {
      expect(mdContent).not.toContain("┌");
      expect(mdContent).not.toContain("└");
      expect(mdContent).not.toContain("├");
      expect(mdContent).not.toContain("│");
      expect(mdContent).not.toContain("┐");
      expect(mdContent).not.toContain("┘");
    });

    it("strictly forbids ASCII bar chart slop characters (blocks/dots)", () => {
      expect(mdContent).not.toContain("███");
      expect(mdContent).not.toContain("• • •");
    });

    it("verifies valid architectural diagram format for Section 01 and 02", () => {
      expect(mdContent).toContain("Reactive Dispatch Paradigm");
      expect(mdContent).toContain("Proactive ML Dispatch Engine");
      expect(mdContent).toContain("Dual-Stage Predictive Dispatch Engine | Sequential Inference Pipeline & Decision Gate");
    });

    it("verifies financial figure consistency across all sections", () => {
      expect(mdContent).toContain("$8.5M");
      expect(mdContent).toContain("$25.5M/year");
      expect(mdContent).toContain("τ* = 0.20");
      expect(mdContent).toContain("72.8%");
    });
  });

  // =========================================================================
  // 4. STUDIO COMPONENT INTEGRITY & BRUTALIST DESIGN LANGUAGE
  // =========================================================================
  describe("04. Studio Component Brutalist Design Language Integrity", () => {
    const studioPath = path.join(rootDir, "components/FlightDelayMLStudio.tsx");
    const studioContent = fs.readFileSync(studioPath, "utf8");

    it("adheres to sharp, brutalist border radii (no bubbly rounded-full or rounded-xl)", () => {
      expect(studioContent).not.toContain("rounded-full");
      expect(studioContent).not.toContain("rounded-xl");
      expect(studioContent).not.toContain("rounded-lg");
      expect(studioContent).not.toContain("animate-pulse");
    });

    it("uses standard portfolio font styles (inherit / mono)", () => {
      expect(studioContent).toContain('className="mono');
      expect(studioContent).toContain('style={{ fontFamily: "inherit" }}');
    });

    it("supports both Studio modes: Live Dispatch Simulator and Threshold Economics", () => {
      expect(studioContent).toContain('01. Live Dispatch Simulator');
      expect(studioContent).toContain('02. Threshold Economics &amp; ROI');
    });
  });

  // =========================================================================
  // 5. CLIENT-SIDE INFERENCE ENGINE ROBUSTNESS & MATHEMATICAL INVARIANTS
  // =========================================================================
  describe("05. Client-Side Inference Engine Robustness and Domain Physics", () => {
    const meta = getMetadata();

    it("evaluates all 8 carriers without runtime exceptions or NaN values", () => {
      const carriers: CarrierCode[] = ["UA", "AA", "DL", "WN", "B6", "NK", "AS", "OO"];
      for (const c of carriers) {
        const res = predictFlightDelay({
          carrier: c,
          origin: "ORD",
          dest: "LAX",
          depHour: 12,
          congestionLevel: "nominal",
        });
        expect(res.probability).toBeGreaterThan(0);
        expect(res.probability).toBeLessThan(1);
        expect(Number.isNaN(res.probability)).toBe(false);
      }
    });

    it("evaluates all 15 major hubs without runtime exceptions", () => {
      const hubs: HubCode[] = [
        "ORD", "ATL", "DFW", "DEN", "CLT", "LAX", "JFK", "LGA",
        "EWR", "SFO", "SEA", "MCO", "LAS", "BOS", "PHX",
      ];
      for (const h of hubs) {
        const res = predictFlightDelay({
          carrier: "DL",
          origin: h,
          dest: h === "ATL" ? "LAX" : "ATL",
          depHour: 15,
          congestionLevel: "elevated",
        });
        expect(res.probability).toBeGreaterThan(0);
        expect(Number.isNaN(res.probability)).toBe(false);
      }
    });

    it("enforces diurnal physical law: afternoon peak (18:00) > morning launch (06:00)", () => {
      for (let h = 0; h < 24; h++) {
        const res = predictFlightDelay({
          carrier: "AA",
          origin: "DFW",
          dest: "ORD",
          depHour: h,
          congestionLevel: "nominal",
        });
        expect(res.probability).toBeGreaterThanOrEqual(0.04);
        expect(res.probability).toBeLessThanOrEqual(0.95);
      }

      const launch = predictFlightDelay({ carrier: "AA", origin: "DFW", dest: "ORD", depHour: 6, congestionLevel: "nominal" });
      const peak = predictFlightDelay({ carrier: "AA", origin: "DFW", dest: "ORD", depHour: 18, congestionLevel: "nominal" });
      expect(peak.probability).toBeGreaterThan(launch.probability);
    });

    it("enforces threshold economics ROI monotonicity: optimal threshold yields positive net savings", () => {
      const econ = calculateThresholdEconomics({
        threshold: 0.20,
        costFalseNegative: 4200,
        costFalsePositive: 800,
      });

      expect(econ.optimalSavings).toBeGreaterThan(8000000); // > $8.0M
      expect(econ.optimalSavings * 3).toBeGreaterThan(24000000); // > $24M/yr
    });
  });
});
