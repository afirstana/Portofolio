import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    return [
      parseInt(clean[0] + clean[0], 16),
      parseInt(clean[1] + clean[1], 16),
      parseInt(clean[2] + clean[2], 16),
    ];
  }
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

function relativeLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hexToRgb(hex1));
  const l2 = relativeLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe("Light Mode Compatibility & WCAG Contrast Verification", () => {
  const repoRoot = path.resolve(__dirname, "..");
  const globalsCss = fs.readFileSync(path.join(repoRoot, "app", "globals.css"), "utf-8");
  const interactiveCss = fs.readFileSync(path.join(repoRoot, "app", "interactive.css"), "utf-8");
  const markdownBody = fs.readFileSync(path.join(repoRoot, "components", "MarkdownBody.tsx"), "utf-8");

  it("01. declares complete light mode token triad in globals.css", () => {
    expect(globalsCss).toContain('html[data-theme="light"]');
    expect(globalsCss).toContain("--bg: #f8fafc;");
    expect(globalsCss).toContain("--panel: #ffffff;");
    expect(globalsCss).toContain("--ink: #0f172a;");
    expect(globalsCss).toContain("--ink-heading: #020617;");
    expect(globalsCss).toContain("--muted: #475569;");
    expect(globalsCss).toContain("--accent: #0284c7;");
  });

  it("02. satisfies WCAG AAA contrast for body ink on light background (>= 7:1)", () => {
    // Light bg: #f8fafc, Light ink: #0f172a
    const ratio = contrastRatio("#f8fafc", "#0f172a");
    expect(ratio).toBeGreaterThanOrEqual(7.0);
    // Typical slate-900 on slate-50 is ~15:1
    expect(ratio).toBeGreaterThan(14.0);
  });

  it("03. satisfies WCAG AAA contrast for heading ink on light background (>= 7:1)", () => {
    // Light bg: #f8fafc, Light ink-heading: #020617
    const ratio = contrastRatio("#f8fafc", "#020617");
    expect(ratio).toBeGreaterThanOrEqual(7.0);
    // Almost pure black on slate-50 is ~19:1
    expect(ratio).toBeGreaterThan(18.0);
  });

  it("04. satisfies WCAG AA contrast for muted secondary copy on light background (>= 4.5:1)", () => {
    // Light bg: #f8fafc, Light muted: #475569
    const ratio = contrastRatio("#f8fafc", "#475569");
    expect(ratio).toBeGreaterThanOrEqual(4.5);
    // slate-600 on slate-50 is ~7.3:1
    expect(ratio).toBeGreaterThan(7.0);
  });

  it("05. enables dual-mode table zebra striping via var(--surface-hover)", () => {
    expect(markdownBody).toContain('backgroundColor: rIdx % 2 === 0 ? "var(--surface-hover)" : "transparent"');
    expect(globalsCss).toContain("--surface-hover: rgba(15, 23, 42, 0.03);");
    expect(globalsCss).toContain("--surface-hover: rgba(255, 255, 255, 0.03);");
  });

  it("06. supports sticky navigation bars in light mode", () => {
    expect(interactiveCss).toContain('[data-theme="light"] .case-toc-sticky-bar');
    expect(interactiveCss).toContain('[data-theme="light"] .minimal-sticky-toc');
    expect(interactiveCss).toContain('[data-theme="light"] .case-toc');
  });

  it("07. enforces zero theme-inverting text variables inside dark 3D studios", () => {
    const files = [
      "components/BankingFraud3DAnomalyManifold.tsx",
      "components/BankingFraud3DGraph.tsx",
      "components/BrentOil3DManifold.tsx",
      "components/FlightDelay3DNetworkStudio.tsx",
    ];

    const darkBgPattern = /backgroundColor:\s*["'](rgba\(\s*([0-9]|1[0-9]|2[0-5]),\s*([0-9]|1[0-9]|2[0-5]),\s*([0-9]|1[0-9]|2[0-5])|#0[0-9a-f]{5}|#1[0-9a-f]{5}|#000|#05|#0a)/i;
    const themeVarPattern = /color:\s*["']var\(--(ink|ink-heading|muted|dim)\)["']/;

    let collisionCount = 0;
    for (const rel of files) {
      const content = fs.readFileSync(path.join(repoRoot, rel), "utf-8");
      const lines = content.split("\n");
      let currentDarkScope = -1;
      for (let idx = 0; idx < lines.length; idx++) {
        if (darkBgPattern.test(lines[idx])) {
          currentDarkScope = idx;
        }
        if (currentDarkScope !== -1 && idx - currentDarkScope <= 25) {
          if (themeVarPattern.test(lines[idx])) {
            collisionCount++;
          }
        }
      }
    }
    expect(collisionCount).toBe(0);
  });
});
