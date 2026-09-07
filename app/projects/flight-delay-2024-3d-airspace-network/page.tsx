import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SystemDiagram } from "@/components/SystemDiagram";
import { VisualEvidence } from "@/components/VisualEvidence";
import { MarkdownBody } from "@/components/MarkdownBody";
import { FlightDelay3DToc } from "@/components/FlightDelay3DToc";
import { FlightDelay3DNetworkManifold } from "@/components/FlightDelay3DNetworkManifold";
import { FlightOperationalLessons } from "@/components/FlightOperationalLessons";
import { getAdjacentProjects, getProjectBySlug, getRelatedProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";

const slug = "flight-delay-2024-3d-airspace-network";

export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Flight Delay 2024 — 3D National Airspace Delay Topology & Rotational Ripple Manifold — Abimael.Data",
  description:
    "An interactive 3D spherical airspace topology mapping 7.08 million commercial flights across the top 30 mega hubs and 72 flight corridors with dynamic taxi elevation pillars and real-time turnaround ripple flow.",
  alternates: { canonical: `/projects/${slug}/` },
  openGraph: {
    title: "Flight Delay 2024 — 3D National Airspace Delay Topology & Rotational Ripple Manifold — Abimael.Data",
    description:
      "Interactive 3D airspace manifold visualizes ground taxi elevation pillars and great-circle late-aircraft ripple propagation across 7.08M commercial flights.",
    url: `/projects/${slug}/`,
    siteName: siteConfig.name,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flight Delay 2024 — 3D National Airspace Delay Topology & Rotational Ripple Manifold — Abimael.Data",
    description:
      "Interactive 3D airspace manifold visualizes ground taxi elevation pillars and great-circle late-aircraft ripple propagation across 7.08M commercial flights.",
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
              MONITORED HUBS
            </span>
            <strong className="mono" style={{ fontSize: 24, color: "var(--ink-heading)", display: "block", marginTop: 4 }}>
              30 Mega Hubs
            </strong>
            <span style={{ fontSize: 12.5, color: "var(--muted)" }}>68.4% of U.S. Traffic</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "16px 20px" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--muted)", display: "block", letterSpacing: "0.06em" }}>
              FLIGHT CORRIDORS
            </span>
            <strong className="mono" style={{ fontSize: 24, color: "var(--ink-heading)", display: "block", marginTop: 4 }}>
              72 Trunk Arcs
            </strong>
            <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Great-Circle Trajectories</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "16px 20px" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--muted)", display: "block", letterSpacing: "0.06em" }}>
              CANVAS ENGINE
            </span>
            <strong className="mono" style={{ fontSize: 24, color: "var(--ink-heading)", display: "block", marginTop: 4 }}>
              60 FPS
            </strong>
            <span style={{ fontSize: 12.5, color: "var(--muted)" }}>0ms Hydration Latency</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "16px 20px", borderTop: "3px solid var(--accent)" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--accent)", display: "block", letterSpacing: "0.06em", fontWeight: 700 }}>
              PROBLEM: PEAK TAXI QUEUE
            </span>
            <strong className="mono" style={{ fontSize: 24, color: "var(--accent)", display: "block", marginTop: 4 }}>
              24.10 min
            </strong>
            <span style={{ fontSize: 12.5, color: "var(--muted)" }}>New York JFK &amp; ORD (23.8m)</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "16px 20px", borderTop: "3px solid var(--accent)" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--accent)", display: "block", letterSpacing: "0.06em", fontWeight: 700 }}>
              PROBLEM: TURN RIPPLE PEAK
            </span>
            <strong className="mono" style={{ fontSize: 24, color: "var(--accent)", display: "block", marginTop: 4 }}>
              53.4% Ripple
            </strong>
            <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Dallas Love (DAL) – Chicago (MDW)</span>
          </div>
        </div>

        {/* 3D Interactive Airspace Studio Showcase */}
        <section id="airspace-manifold" style={{ margin: "40px 0 60px" }} aria-label="3D Airspace Topology Studio">
          <div style={{ marginBottom: 20 }}>
            <p className="mono case-label" style={{ marginBottom: 6 }}>
              Interactive 3D Studio • 30 Hubs • 72 Corridors
            </p>
            <h2 style={{ margin: 0, fontSize: "clamp(24px, 3.5vw, 36px)", letterSpacing: "-0.03em", color: "var(--ink-heading)", fontWeight: 700 }}>
              3D National Airspace Topology &amp; Rotational Ripple Manifold
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 14.5, lineHeight: 1.6, maxWidth: 840, margin: "8px 0 0" }}>
              Explore the three-dimensional geometry of the continental U.S. commercial aviation network. Drag to orbit the camera, scroll to zoom, and toggle between preset camera modes to evaluate how runway ground taxi queuing at Chicago (ORD) and New York (LGA) compounds into high-elevation flight corridor ripples.
            </p>
          </div>

          <FlightDelay3DNetworkManifold />
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
              sectionNumber="06"
              eyebrow="ENGINEERING LESSONS & 3D DYNAMICS"
              title="Engineering Lessons & Airspace Topology Takeaways"
              subtitle="Spatial modeling paradigms, surface queue extrusion benchmarks, and cognitive ergonomics synthesized from 30 mega hubs."
              impact={project.impact}
              projectType="3d-airspace"
            />
          </div>
        </div>

        {/* Bottom Navigation Pager */}
        <footer className="project-detail-footer">
          <div className="adjacent-projects">
            {adjacent.previous && (
              <Link className="adjacent-card previous" href={`/projects/${adjacent.previous.slug}/`}>
                <span className="mono">← Previous Project</span>
                <strong>{adjacent.previous.title}</strong>
              </Link>
            )}
            {adjacent.next && (
              <Link className="adjacent-card next" href={`/projects/${adjacent.next.slug}/`}>
                <span className="mono">Next Project →</span>
                <strong>{adjacent.next.title}</strong>
              </Link>
            )}
          </div>
        </footer>
      </article>
      <SiteFooter />
    </main>
  );
}
