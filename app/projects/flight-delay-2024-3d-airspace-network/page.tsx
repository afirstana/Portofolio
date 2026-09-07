import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SystemDiagram } from "@/components/SystemDiagram";
import { VisualEvidence } from "@/components/VisualEvidence";
import { MarkdownBody } from "@/components/MarkdownBody";
import { FlightDelay3DToc } from "@/components/FlightDelay3DToc";
import { FlightDelay3DNetworkStudio } from "@/components/FlightDelay3DNetworkStudio";
import { FlightOperationalLessons } from "@/components/FlightOperationalLessons";
import { getAdjacentProjects, getProjectBySlug, getRelatedProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";

const slug = "flight-delay-2024-3d-airspace-network";

export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Flight Delay 2024 — 3D National Airspace Delay Topology & Rotational Ripple Manifold — Abimael.Data",
  description:
    "An interactive 3D WebGL airspace topology mapping 7.08 million commercial flights across the top 30 mega hubs and 50 strategic corridors with taxi elevation pillars and real-time turnaround ripple flow.",
  alternates: { canonical: `/projects/${slug}/` },
  openGraph: {
    title: "Flight Delay 2024 — 3D National Airspace Delay Topology & Rotational Ripple Manifold — Abimael.Data",
    description:
      "Interactive 3D WebGL airspace manifold visualizes ground taxi elevation pillars and great-circle late-aircraft ripple propagation across 7.08M commercial flights.",
    url: `/projects/${slug}/`,
    siteName: siteConfig.name,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flight Delay 2024 — 3D National Airspace Delay Topology & Rotational Ripple Manifold — Abimael.Data",
    description:
      "Interactive 3D WebGL airspace manifold visualizes ground taxi elevation pillars and great-circle late-aircraft ripple propagation across 7.08M commercial flights.",
  },
};

export default function FlightDelay3DAirspacePage() {
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
            <span style={{ fontSize: 12.5, color: "var(--muted)" }}>BTS TranStats Census</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "16px 20px" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--muted)", display: "block", letterSpacing: "0.06em" }}>
              MONITORED HUBS
            </span>
            <strong className="mono" style={{ fontSize: 24, color: "var(--ink-heading)", display: "block", marginTop: 4 }}>
              30 Mega Hubs
            </strong>
            <span style={{ fontSize: 12.5, color: "var(--muted)" }}>72.4% U.S. Departures</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "16px 20px" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--muted)", display: "block", letterSpacing: "0.06em" }}>
              GREAT-CIRCLE ARCS
            </span>
            <strong className="mono" style={{ fontSize: 24, color: "var(--ink-heading)", display: "block", marginTop: 4 }}>
              50 Corridors
            </strong>
            <span style={{ fontSize: 12.5, color: "var(--muted)" }}>High-Density City Pairs</span>
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

          <div style={{ backgroundColor: "var(--panel)", padding: "16px 20px", borderTop: "3px solid var(--accent)" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--accent)", display: "block", letterSpacing: "0.06em", fontWeight: 700 }}>
              PROBLEM: TURN RIPPLE
            </span>
            <strong className="mono" style={{ fontSize: 24, color: "var(--accent)", display: "block", marginTop: 4 }}>
              40.44%
            </strong>
            <span style={{ fontSize: 12.5, color: "var(--muted)" }}>41.97M Min National Delay</span>
          </div>
        </div>

        {/* 3D WebGL Interactive Airspace Studio Showcase */}
        <section id="3d-airspace" style={{ margin: "40px 0 60px" }} aria-label="3D Airspace Topology Studio">
          <div style={{ marginBottom: 20 }}>
            <p className="mono case-label" style={{ marginBottom: 6 }}>
              Interactive WebGL Studio • 30 Hubs &amp; 50 Corridors
            </p>
            <h2 style={{ margin: 0, fontSize: "clamp(24px, 3.5vw, 36px)", letterSpacing: "-0.03em", color: "var(--ink-heading)", fontWeight: 700 }}>
              National Airspace Delay Topology &amp; Great-Circle Ripple Studio
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 14.5, lineHeight: 1.6, maxWidth: 840, margin: "8px 0 0" }}>
              3D WebGL spatial visualization modeling continental flight corridors and surface runway bottlenecks. Vertical cylinder pillars scale directly with empirical taxi-out duration (isolating Chicago ORD at 23.8m and New York LGA at 23.5m), while 50 parabolic great-circle flight arcs illustrate real-time late-aircraft ripple propagation across high-density airline routes.
            </p>
          </div>

          <FlightDelay3DNetworkStudio />
        </section>

        {/* System Diagram */}
        <section id="pipeline" aria-label="Architecture Pipeline">
          <SystemDiagram nodes={project.system} />
        </section>

        {/* Case Narrative with TOC */}
        <div className="case-layout">
          <FlightDelay3DToc />
          <div className="case-story">
            {project.body && <MarkdownBody source={project.body} />}

            {project.evidence && project.evidence.length > 0 && (
              <section id="evidence" aria-label="Visual Evidence">
                <VisualEvidence projectSlug={project.slug} evidence={project.evidence} />
              </section>
            )}

            <FlightOperationalLessons
              sectionNumber="07"
              eyebrow="SPATIAL AIRSPACE LESSONS & GOVERNANCE"
              title="Engineering Takeaways & Airspace Lessons"
              subtitle="Core spatial dynamics, runway queuing topography, and WebGL lifecycle lessons synthesized from 7.08M commercial flights."
              impact={project.impact}
              projectType="3d-airspace"
            />
          </div>
        </div>

        {/* Related Case Studies */}
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
