import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SystemDiagram } from "@/components/SystemDiagram";
import { VisualEvidence } from "@/components/VisualEvidence";
import { MarkdownBody } from "@/components/MarkdownBody";
import { CaseStudyToc } from "@/components/CaseStudyToc";
import { BrentOil3DManifold } from "@/components/BrentOil3DManifold";
import { BrentOilInteractiveShowcase } from "@/components/BrentOilInteractiveShowcase";
import { BrentOilRegimesShowcase } from "@/components/BrentOilRegimesShowcase";
import { BrentOilRiskShowcase } from "@/components/BrentOilRiskShowcase";
import { getAdjacentProjects, getProjectBySlug, getProjects, getRelatedProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";

const slug = "brent-oil-market-dynamics";

export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Brent Crude Oil Market Dynamics & Geopolitical Econometrics — Abimael.Data",
  description:
    "An econometric risk study and 3D volatility surface analysis spanning 35.5 years (1987-2024), 9,011 trading days, and 7 major geopolitical shocks modeled with fat-tail kurtosis diagnostics.",
  alternates: { canonical: `/projects/${slug}/` },
  openGraph: {
    title: "Brent Crude Oil Market Dynamics & Geopolitical Econometrics — Abimael.Data",
    description:
      "35.5 years of spot price volatility (1987–2024), 9,011 trading days, and 7 geopolitical shocks with 3D interactive volatility manifold.",
    url: `/projects/${slug}/`,
    siteName: siteConfig.name,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brent Crude Oil Market Dynamics & Geopolitical Econometrics — Abimael.Data",
    description:
      "35.5 years of spot price volatility (1987–2024), 9,011 trading days, and 7 geopolitical shocks with 3D interactive volatility manifold.",
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

        {/* Telemetry Summary Banner */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 1,
            backgroundColor: "var(--line)",
            border: "1px solid var(--line)",
            margin: "32px 0 40px",
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

        {/* 3D Volatility Manifold Flagship Section */}
        <section style={{ margin: "40px 0 60px" }} aria-label="3D Interactive Volatility Manifold">
          <div style={{ marginBottom: 16 }}>
            <p className="section-label mono">01. 3D Manifold Surface</p>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", letterSpacing: "-0.04em", margin: "0 0 8px", color: "var(--ink-heading)" }}>
              Interactive 3D Volatility & Crisis Manifold
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 14.5, lineHeight: 1.65, maxWidth: 840, margin: 0 }}>
              Topographical manifold tensor \( \mathcal&#123;M&#125;(t, r) \mapsto z \) projecting 35.5 years of empirical price shock distributions.
              Rotate freely in 3D orbit, zoom into specific regimes, and inspect the 7 historical geopolitical crisis beacons.
            </p>
          </div>

          <BrentOil3DManifold />
        </section>

        {/* System Diagram */}
        <SystemDiagram nodes={project.system} />

        <div className="case-layout">
          <CaseStudyToc />

          <div className="case-story">
            {/* 2D Interactive Shock Engine */}
            <BrentOilInteractiveShowcase />

            {/* 4 Decades of Market Regimes */}
            <BrentOilRegimesShowcase />

            {/* Fat-Tail Risk & VaR Distribution */}
            <BrentOilRiskShowcase />

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
