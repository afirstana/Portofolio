import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SystemDiagram } from "@/components/SystemDiagram";
import { VisualEvidence } from "@/components/VisualEvidence";
import { MarkdownBody } from "@/components/MarkdownBody";
import { FlightDelay2024Toc } from "@/components/FlightDelay2024Toc";
import { FlightDelay2024Dashboard } from "@/components/FlightDelay2024Dashboard";
import { getAdjacentProjects, getProjectBySlug, getRelatedProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";

const slug = "flight-delay-2024-operations-cockpit";

export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Flight Delay 2024 — National Airline Operations Control & Bottleneck Dashboard — Abimael.Data",
  description:
    "An interactive operational control cockpit analyzing 7,079,081 U.S. domestic commercial flights across 15 operating carriers, 348 origin hubs, and 103.8 million minutes of delay attribution.",
  alternates: { canonical: `/projects/${slug}/` },
  openGraph: {
    title: "Flight Delay 2024 — National Airline Operations Control & Bottleneck Dashboard — Abimael.Data",
    description:
      "Interactive 2D operations cockpit uncovering late-aircraft cascading delay ripple effects, taxi-out surface bottlenecks, and diurnal compounding curves across 7.08M commercial flights.",
    url: `/projects/${slug}/`,
    siteName: siteConfig.name,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flight Delay 2024 — National Airline Operations Control & Bottleneck Dashboard — Abimael.Data",
    description:
      "Interactive 2D operations cockpit uncovering late-aircraft cascading delay ripple effects, taxi-out surface bottlenecks, and diurnal compounding curves across 7.08M commercial flights.",
  },
};

export default function FlightDelay2024OperationsPage() {
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

        <div className="tags detail-tags" style={{ marginBottom: 32 }}>
          {project.tools.map((tool) => (
            <span key={tool}>{tool}</span>
          ))}
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
            <span className="mono" style={{ fontSize: 11, color: "var(--muted)", display: "block", letterSpacing: "0.06em" }}>
              ANALYZED FLIGHTS
            </span>
            <strong className="mono" style={{ fontSize: 24, color: "var(--ink-heading)", display: "block", marginTop: 4 }}>
              7,079,081
            </strong>
            <span style={{ fontSize: 12.5, color: "var(--muted)" }}>BTS TranStats 2024</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "16px 20px" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--muted)", display: "block", letterSpacing: "0.06em" }}>
              FAA ON-TIME RATE
            </span>
            <strong className="mono" style={{ fontSize: 24, color: "var(--ink-heading)", display: "block", marginTop: 4 }}>
              79.23%
            </strong>
            <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Arrival &lt;15m scheduled</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "16px 20px" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--muted)", display: "block", letterSpacing: "0.06em" }}>
              EARLY ARRIVALS
            </span>
            <strong className="mono" style={{ fontSize: 24, color: "var(--ink-heading)", display: "block", marginTop: 4 }}>
              61.85%
            </strong>
            <span style={{ fontSize: 12.5, color: "var(--muted)" }}>+5.5m Scheduled Buffer</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "16px 20px", borderTop: "3px solid var(--accent)" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--accent)", display: "block", letterSpacing: "0.06em", fontWeight: 700 }}>
              PROBLEM: LATE TURN RIPPLE
            </span>
            <strong className="mono" style={{ fontSize: 24, color: "var(--accent)", display: "block", marginTop: 4 }}>
              40.44%
            </strong>
            <span style={{ fontSize: 12.5, color: "var(--muted)" }}>#1 Root Cause (41.97M min)</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "16px 20px", borderTop: "3px solid var(--accent)" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--accent)", display: "block", letterSpacing: "0.06em", fontWeight: 700 }}>
              PROBLEM: TAXI BOTTLENECK
            </span>
            <strong className="mono" style={{ fontSize: 24, color: "var(--accent)", display: "block", marginTop: 4 }}>
              23.79 min
            </strong>
            <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Chicago O&#39;Hare (ORD)</span>
          </div>
        </div>

        {/* 2D Interactive Operations Cockpit Showcase */}
        <section id="operations-cockpit" style={{ margin: "40px 0 60px" }} aria-label="Flight Delay Operations Cockpit">
          <div style={{ marginBottom: 20 }}>
            <p className="mono case-label" style={{ marginBottom: 6 }}>
              Interactive Console • 7.08M Flights
            </p>
            <h2 style={{ margin: 0, fontSize: "clamp(24px, 3.5vw, 36px)", letterSpacing: "-0.03em", color: "var(--ink-heading)", fontWeight: 700 }}>
              National Operations Control &amp; Bottleneck Diagnostics
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 14.5, lineHeight: 1.6, maxWidth: 840, margin: "8px 0 0" }}>
              Live telemetry grid profiling 7,079,081 commercial flights across the continental United States. Use the interactive filter bar to drill through 15 major operating airlines, 12 operating months, and top origin hubs to examine cascading delay ripples, runway queuing friction, and diurnal compounding curves in real time.
            </p>
          </div>

          <FlightDelay2024Dashboard />
        </section>

        {/* System Diagram */}
        <section id="pipeline" aria-label="Architecture Pipeline">
          <SystemDiagram nodes={project.system} />
        </section>

        {/* Case Narrative with TOC */}
        <div className="case-layout">
          <FlightDelay2024Toc />
          <div className="case-story">
            {project.body && <MarkdownBody source={project.body} />}

            {project.evidence && project.evidence.length > 0 && (
              <section id="evidence" aria-label="Visual Evidence">
                <VisualEvidence projectSlug={project.slug} evidence={project.evidence} />
              </section>
            )}

            <section className="case-stage" id="impact">
              <p className="mono case-label">Impact</p>
              <p>{project.impact}</p>
            </section>

            {project.lessons && project.lessons.length > 0 && (
              <section className="case-stage" id="takeaways">
                <p className="mono case-label">Engineering Takeaways &amp; Operational Lessons</p>
                <ul className="lesson-list">
                  {project.lessons.map((lesson) => (
                    <li key={lesson}>{lesson}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        {/* Related Projects */}
        {related && related.length > 0 && (
          <section style={{ margin: "60px 0 40px", borderTop: "1px solid var(--line)", paddingTop: 40 }}>
            <h3 className="mono" style={{ fontSize: 13, color: "var(--dim)", textTransform: "uppercase", marginBottom: 20 }}>
              Related Case Studies
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/projects/${r.slug}/`}
                  style={{
                    display: "block",
                    padding: 16,
                    border: "1px solid var(--line)",
                    borderRadius: 4,
                    textDecoration: "none",
                    backgroundColor: "var(--panel)",
                  }}
                >
                  <p className="mono" style={{ fontSize: 10, color: "var(--dim)", margin: "0 0 6px" }}>
                    {r.category}
                  </p>
                  <h4 style={{ fontSize: 14, color: "var(--ink-heading)", margin: "0 0 8px" }}>{r.title}</h4>
                  <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>{r.one_liner}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Adjacent Navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "24px 0",
            borderTop: "1px solid var(--line)",
            marginTop: 40,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          {adjacent.previous ? (
            <Link
              href={`/projects/${adjacent.previous.slug}/`}
              className="mono"
              style={{ fontSize: 12, color: "var(--ink)", textDecoration: "none" }}
            >
              ← {adjacent.previous.title}
            </Link>
          ) : (
            <span />
          )}
          {adjacent.next ? (
            <Link
              href={`/projects/${adjacent.next.slug}/`}
              className="mono"
              style={{ fontSize: 12, color: "var(--ink)", textDecoration: "none" }}
            >
              {adjacent.next.title} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}