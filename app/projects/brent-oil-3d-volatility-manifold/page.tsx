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
import { getAdjacentProjects, getProjectBySlug, getRelatedProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";

const slug = "brent-oil-3d-volatility-manifold";

export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Brent Crude Oil — 3D Volatility & Crisis Manifold — Abimael.Data",
  description:
    "An interactive 3D topographical surface manifold modeling 35.5 years of crude oil spot price volatility (1987–2024), 9,011 trading days, and 7 geopolitical shock regimes across a non-Gaussian fat-tail distribution (Kurtosis 45.43).",
  alternates: { canonical: `/projects/${slug}/` },
  openGraph: {
    title: "Brent Crude Oil — 3D Volatility & Crisis Manifold — Abimael.Data",
    description:
      "Interactive 3D surface manifold modeling 35.5 years of oil volatility and 7 geopolitical shock beacons with zero-dependency matrix mathematics.",
    url: `/projects/${slug}/`,
    siteName: siteConfig.name,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brent Crude Oil — 3D Volatility & Crisis Manifold — Abimael.Data",
    description:
      "Interactive 3D surface manifold modeling 35.5 years of oil volatility and 7 geopolitical shock beacons with zero-dependency matrix mathematics.",
  },
};

export default function BrentOil3DProjectPage() {
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

        {/* Cross-Link Banner to 2D Econometrics Study */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 18px",
            backgroundColor: "rgba(0, 240, 255, 0.04)",
            border: "1px solid rgba(0, 240, 255, 0.2)",
            borderRadius: 4,
            margin: "24px 0 32px",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 14 }}>📈</span>
            <span style={{ fontSize: 13, color: "var(--ink)" }}>
              Looking for the full 35-year historical time series & structural regimes?
            </span>
          </div>
          <Link
            href="/projects/brent-oil-market-dynamics/"
            className="mono"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              fontWeight: 700,
              color: "#00f0ff",
              textDecoration: "none",
              letterSpacing: "0.04em",
            }}
          >
            <span>EXPLORE 2D ECONOMETRICS CASE STUDY (#6)</span>
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
              OBSERVATIONS
            </span>
            <strong className="mono" style={{ fontSize: 20, color: "var(--ink-heading)", display: "block", marginTop: 4 }}>
              9,011 Days
            </strong>
            <span style={{ fontSize: 11.5, color: "var(--muted)" }}>36 Time Epochs</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "16px 20px" }}>
            <span className="mono" style={{ fontSize: 9.5, color: "var(--dim)", display: "block" }}>
              PRICE SPREAD
            </span>
            <strong className="mono" style={{ fontSize: 20, color: "var(--ink-heading)", display: "block", marginTop: 4 }}>
              $9.10 — $143.95
            </strong>
            <span style={{ fontSize: 11.5, color: "var(--muted)" }}>15.8x historical envelope</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "16px 20px" }}>
            <span className="mono" style={{ fontSize: 9.5, color: "var(--dim)", display: "block" }}>
              LEPTOKURTOSIS
            </span>
            <strong className="mono" style={{ fontSize: 20, color: "#f59e0b", display: "block", marginTop: 4 }}>
              45.43
            </strong>
            <span style={{ fontSize: 11.5, color: "var(--muted)" }}>Extreme non-Gaussian fat tails</span>
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
            <p className="section-label mono">01. 3D Manifold Surface Studio</p>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", letterSpacing: "-0.04em", margin: "0 0 8px", color: "var(--ink-heading)" }}>
              Interactive 3D Volatility &amp; Crisis Manifold
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 14.5, lineHeight: 1.65, maxWidth: 840, margin: 0 }}>
              Topographical manifold surface{" "}
              <code className="mono" style={{ color: "#00f0ff", padding: "2px 7px", backgroundColor: "rgba(0, 240, 255, 0.08)", border: "1px solid rgba(0, 240, 255, 0.2)", borderRadius: 3, fontSize: 12 }}>
                ℳ(t, r) ⟶ z
              </code>{" "}
              projecting 35.5 years of empirical price shock distributions across 36 annual epochs. Rotate freely in 3D orbit, zoom into specific regimes, and inspect the 7 historical geopolitical crisis beacons.
            </p>
          </div>

          <BrentOil3DManifold />
        </section>

        {/* System Diagram */}
        <SystemDiagram nodes={project.system} />

        <div className="case-layout">
          <CaseStudyToc />

          <div className="case-story">
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
