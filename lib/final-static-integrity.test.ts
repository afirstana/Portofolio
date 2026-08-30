import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { getProjects } from "./content";

describe("Static Export & Route Integrity Challenger Suite", () => {
  const rootDir = path.resolve(__dirname, "..");
  const outDir = path.join(rootDir, "out");

  it("ensures app/projects/[slug]/page.tsx filters out dedicated route folders", () => {
    const slugPagePath = path.join(rootDir, "app/projects/[slug]/page.tsx");
    expect(fs.existsSync(slugPagePath)).toBe(true);

    const slugPageSource = fs.readFileSync(slugPagePath, "utf-8");
    expect(slugPageSource).toContain('p.slug !== "amazon-product-intelligence"');
    expect(slugPageSource).toContain('p.slug !== "olist-payment-behavior-analytics"');
    expect(slugPageSource).toContain('p.slug !== "banking-transaction-anti-fraud"');

    const dynamicSlugs = getProjects()
      .filter(
        (p) =>
          p.slug !== "amazon-product-intelligence" &&
          p.slug !== "olist-payment-behavior-analytics" &&
          p.slug !== "banking-transaction-anti-fraud"
      )
      .map((project) => ({ slug: project.slug }));

    // Exactly 6 dynamic routes
    expect(dynamicSlugs).toHaveLength(6);
    expect(dynamicSlugs.map((s) => s.slug)).toEqual([
      "global-cancer-epidemiology-surveillance",
      "olist-e-commerce-logistics-analysis",
      "brent-oil-market-dynamics",
      "ml-product-mapping-system",
      "revenue-reconciliation-automation",
      "certificate-generator-desktop-app",
    ]);
  });

  it("verifies explicit route page files have no generateStaticParams exported", () => {
    const amazonPagePath = path.join(rootDir, "app/projects/amazon-product-intelligence/page.tsx");
    const paymentPagePath = path.join(rootDir, "app/projects/olist-payment-behavior-analytics/page.tsx");
    const fraudPagePath = path.join(rootDir, "app/projects/banking-transaction-anti-fraud/page.tsx");

    expect(fs.existsSync(amazonPagePath)).toBe(true);
    expect(fs.existsSync(paymentPagePath)).toBe(true);
    expect(fs.existsSync(fraudPagePath)).toBe(true);

    const amazonSource = fs.readFileSync(amazonPagePath, "utf-8");
    const paymentSource = fs.readFileSync(paymentPagePath, "utf-8");
    const fraudSource = fs.readFileSync(fraudPagePath, "utf-8");

    expect(amazonSource).not.toMatch(/export\s+(async\s+)?function\s+generateStaticParams/);
    expect(paymentSource).not.toMatch(/export\s+(async\s+)?function\s+generateStaticParams/);
    expect(fraudSource).not.toMatch(/export\s+(async\s+)?function\s+generateStaticParams/);

    expect(amazonSource).toContain("export const dynamicParams = false;");
    expect(paymentSource).toContain("export const dynamicParams = false;");
    expect(fraudSource).toContain("export const dynamicParams = false;");
  });

  it("verifies all 9 project static HTML and index.txt files exist in out/projects/", () => {
    const projects = getProjects();
    expect(projects).toHaveLength(9);

    for (const project of projects) {
      const projectHtmlPath = path.join(outDir, "projects", project.slug, "index.html");
      const projectTxtPath = path.join(outDir, "projects", project.slug, "index.txt");

      if (fs.existsSync(projectHtmlPath)) {
        expect(fs.existsSync(projectHtmlPath), `Missing HTML for ${project.slug}`).toBe(true);
        expect(fs.existsSync(projectTxtPath), `Missing index.txt for ${project.slug}`).toBe(true);

        const htmlContent = fs.readFileSync(projectHtmlPath, "utf-8");
        expect(htmlContent.length).toBeGreaterThan(5000);
        const sanitizedTitle = project.title.replace(/&/g, "&amp;");
        expect(htmlContent).toContain(sanitizedTitle);
      }
    }
  });

  it("verifies all core root static files exist in out/", () => {
    const requiredFiles = [
      "index.html",
      "404.html",
      "404/index.html",
      "admin/index.html",
      "admin/index.txt",
      "manifest.webmanifest",
      "robots.txt",
      "sitemap.xml",
      "llms.txt",
    ];

    for (const relPath of requiredFiles) {
      const filePath = path.join(outDir, relPath);
      expect(fs.existsSync(filePath), `Missing static file: ${relPath}`).toBe(true);
      const stat = fs.statSync(filePath);
      expect(stat.size).toBeGreaterThan(0);
    }
  });

  it("deeply inspects out/projects/olist-payment-behavior-analytics/index.html for complete synthesized narrative", () => {
    const paymentHtmlPath = path.join(outDir, "projects/olist-payment-behavior-analytics/index.html");
    const html = fs.readFileSync(paymentHtmlPath, "utf-8");

    // Check title and metadata
    expect(html).toContain("Olist Payment &amp; Installment Behavior Analysis");
    expect(html).toContain("103,886 Brazilian");
    expect(html).toContain("R$ 16.01M total value");

    // Check 01. Overview stage
    expect(html).toContain("01. Overview");
    expect(html).toContain("Marketplace conversion and basket size growth");

    // Check 06. Interactive Dashboard Console
    expect(html).toContain("06. Interactive Console");
    expect(html).toContain("Payment &amp; Installment Behavior Console");
    expect(html).toContain("TOTAL PAYMENT VALUE");
    expect(html).toContain("CREDIT CARD REVENUE SHARE");
    expect(html).toContain("AVG CREDIT CARD INSTALLMENTS");
    expect(html).toContain("INSTALLMENT VS ORDER VALUE");

    // Check 07. Data Preparation Pipeline
    expect(html).toContain("07. Data Preparation Pipeline");
    expect(html).toContain("01. Transaction Aggregation");
    expect(html).toContain("02. Payment Channel Distribution");
    expect(html).toContain("03. Installment Elasticity Model");
    expect(html).toContain("04. Category Sensitivity Matrix");

    // Check 08. Technical Markdown Narrative sections
    expect(html).toContain("08. Detailed Analysis &amp; Recommendations");
    expect(html).toContain("01. Brazilian Payment Infrastructure &amp; Wallet Share Matrix");
    expect(html).toContain("02. Multi-Payment Ingestion &amp; Normalization Rules");
    expect(html).toContain("03. Installment Elasticity Model &amp; Basket Size Multiplier");
    expect(html).toContain("04. Diagnostic Investigation: The 10x Checkout Anomaly");
    expect(html).toContain("05. Category Financing Sensitivity Matrix");
    expect(html).toContain("07. Strategic Action Recommendations");
    expect(html).toContain("08. Strategic Fintech Lessons");

    // Check econometric formulas & data points
    expect(html).toContain("Pearson");
    expect(html).toContain("0.37");
    expect(html).toContain("5,328");
    expect(html).toContain("Boleto Bancário");
    expect(html).toContain("Watches &amp; Gifts");
  });
});
