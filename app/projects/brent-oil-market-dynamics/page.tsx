import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SystemDiagram } from "@/components/SystemDiagram";
import { VisualEvidence } from "@/components/VisualEvidence";
import { MarkdownBody } from "@/components/MarkdownBody";
import { BrentOilMarketDynamicsToc } from "@/components/BrentOilMarketDynamicsToc";
import { BrentOilInteractiveShowcase } from "@/components/BrentOilInteractiveShowcase";
import { BrentOilRegimesShowcase } from "@/components/BrentOilRegimesShowcase";
import { BrentOilRiskShowcase } from "@/components/BrentOilRiskShowcase";
import { getAdjacentProjects, getProjectBySlug, getRelatedProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";

const slug = "brent-oil-market-dynamics";

export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Brent Crude Oil Market Dynamics & Geopolitical Econometrics — Abimael.Data",
  description:
    "An econometric risk study and structural volatility analysis spanning 35.5 years (1987-2024), 9,011 trading days, and 7 major geopolitical shocks modeled with fat-tail kurtosis diagnostics.",
  alternates: { canonical: `/projects/${slug}/` },
  openGraph: {
    title: "Brent Crude Oil Market Dynamics & Geopolitical Econometrics — Abimael.Data",
    description:
      "35.5 years of spot price volatility (1987–2024), 9,011 trading days, and 7 geopolitical shocks with econometric regime shift models.",
    url: `/projects/${slug}/`,
    siteName: siteConfig.name,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brent Crude Oil Market Dynamics & Geopolitical Econometrics — Abimael.Data",
    description:
      "35.5 years of spot price volatility (1987–2024), 9,011 trading days, and 7 geopolitical shocks with econometric regime shift models.",
  },
};

export default function BrentOilProjectPage() {
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const adjacent = getAdjacentProjects(project);
  const related = getRelatedProjects(project);

  return (
    <main className="site-shell">
      <SiteHeader />
      <article className="project-detail page-width-wide">
        <Link className="back-link mono" href="/#work">
          ← All work
        </Link>
        <p className="section-label mono">Case study / {project.category}</p>
        <h1 className="payment-hero-title">{project.title}</h1>
        <p className="detail-lede payment-lede">{project.one_liner}</p>

        {/* Cross-Link Banner to 3D Manifold Studio */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 18px",
            backgroundColor: "rgba(244, 63, 94, 0.05)",
            border: "1px solid rgba(244, 63, 94, 0.25)",
            borderRadius: 4,
            margin: "24px 0 32px",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 14 }}>🌐</span>
            <span style={{ fontSize: 13, color: "var(--ink)" }}>
              Want to inspect this volatility in 3D orbit? Explore the dedicated 3D interactive terrain.
            </span>
          </div>
          <Link
            href="/projects/brent-oil-3d-volatility-manifold/"
            className="mono"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              fontWeight: 700,
              color: "#f43f5e",
              textDecoration: "none",
              letterSpacing: "0.04em",
            }}
          >
            <span>LAUNCH 3D VOLATILITY MANIFOLD STUDIO (#2)</span>
            <span>→</span>
          </Link>
        </div>

        {/* Telemetry Summary Banner */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 1,
            backgroundColor: "var(--line)",
            border: "1px solid var(--line)",
            margin: "0 0 40px",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <div style={{ backgroundColor: "var(--panel)", padding: "16px 20px" }}>
            <span className="mono" style={{ fontSize: 9.5, color: "var(--dim)", display: "block" }}>
              SAMPLE DURATION
            </span>
            <strong className="mono" style={{ fontSize: 20, color: "var(--ink-heading)", display: "block", marginTop: 4 }}>
              35.5 Years
            </strong>
            <span style={{ fontSize: 11.5, color: "var(--muted)" }}>May 1987 — Nov 2024</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "16px 20px" }}>
            <span className="mono" style={{ fontSize: 9.5, color: "var(--dim)", display: "block" }}>
              TRADING OBSERVATIONS
            </span>
            <strong className="mono" style={{ fontSize: 20, color: "var(--ink-heading)", display: "block", marginTop: 4 }}>
              9,011 Days
            </strong>
            <span style={{ fontSize: 11.5, color: "var(--muted)" }}>Zero interpolation gaps</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "16px 20px" }}>
            <span className="mono" style={{ fontSize: 9.5, color: "var(--dim)", display: "block" }}>
              HISTORIC PRICE SPREAD
            </span>
            <strong className="mono" style={{ fontSize: 20, color: "var(--ink-heading)", display: "block", marginTop: 4 }}>
              $9.10 — $143.95
            </strong>
            <span style={{ fontSize: 11.5, color: "var(--muted)" }}>15.8x historical spread</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "16px 20px" }}>
            <span className="mono" style={{ fontSize: 9.5, color: "var(--dim)", display: "block" }}>
              EXCESS KURTOSIS
            </span>
            <strong className="mono" style={{ fontSize: 20, color: "#f59e0b", display: "block", marginTop: 4 }}>
              45.43
            </strong>
            <span style={{ fontSize: 11.5, color: "var(--muted)" }}>Severe fat-tail leptokurtosis</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "16px 20px" }}>
            <span className="mono" style={{ fontSize: 9.5, color: "var(--dim)", display: "block" }}>
              99% DAILY VaR
            </span>
            <strong className="mono" style={{ fontSize: 20, color: "#f43f5e", display: "block", marginTop: 4 }}>
              -7.12%
            </strong>
            <span style={{ fontSize: 11.5, color: "var(--muted)" }}>1-in-100 day downside risk</span>
          </div>
        </div>

        {/* System Diagram */}
        <section id="pipeline" aria-label="System Architecture Pipeline">
          <SystemDiagram nodes={project.system} />
        </section>

        <div className="case-layout">
          <BrentOilMarketDynamicsToc />

          <div className="case-story">
            {/* 2D Interactive Shock Engine */}
            <section id="explorer" aria-label="35-Year Price and Risk Explorer">
              <BrentOilInteractiveShowcase />
            </section>

            {/* 4 Decades of Market Regimes */}
            <section id="regimes" aria-label="Four Decades of Market Regimes">
              <BrentOilRegimesShowcase />
            </section>

            {/* Fat-Tail Risk & VaR Distribution */}
            <section id="risk" aria-label="Non-Gaussian Fat-Tail Risk and VaR Terminal">
              <BrentOilRiskShowcase />
            </section>

            {/* Deep Technical Markdown Narrative */}
            {project.body && <MarkdownBody source={project.body} />}

            <VisualEvidence projectSlug={project.slug} evidence={project.evidence} />

            <section className="case-stage" id="impact">
              <p className="mono case-label">Impact</p>
              <p>{project.impact}</p>
            </section>

            <section className="case-stage" id="lessons">
              <p className="mono case-label">Lessons</p>
              <ul className="lesson-list">
                {project.lessons.map((lesson) => (
                  <li key={lesson}>{lesson}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <section className="related-projects">
          <p className="mono">Related systems</p>
          <div>
            {related.map((item) => (
              <Link href={`/projects/${item.slug}/`} key={item.slug}>
                <span>{item.category}</span>
                <strong>{item.title}</strong>
                <i>↗</i>
              </Link>
            ))}
          </div>
        </section>

        <nav className="project-pager" aria-label="Project navigation">
          {adjacent.previous && (
            <Link href={`/projects/${adjacent.previous.slug}/`}>
              <span className="mono">← Previous system (#{adjacent.previous.order})</span>
              <strong>{adjacent.previous.title}</strong>
            </Link>
          )}
          {adjacent.next && (
            <Link href={`/projects/${adjacent.next.slug}/`}>
              <span className="mono">Next system (#{adjacent.next.order}) →</span>
              <strong>{adjacent.next.title}</strong>
            </Link>
          )}
        </nav>
      </article>
      <SiteFooter />
    </main>
  );
}
