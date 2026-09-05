import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SystemDiagram } from "@/components/SystemDiagram";
import { VisualEvidence } from "@/components/VisualEvidence";
import { MarkdownBody } from "@/components/MarkdownBody";
import { BankingFraud3DToc } from "@/components/BankingFraud3DToc";
import { BankingFraud3DGraph } from "@/components/BankingFraud3DGraph";
import { BankingFraud3DAnomalyManifold } from "@/components/BankingFraud3DAnomalyManifold";
import { getAdjacentProjects, getProjectBySlug, getRelatedProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";

const slug = "banking-fraud-3d-network-intelligence";

export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Banking Anti-Fraud — 3D Financial Crime Graph & Mule Network — Abimael.Data",
  description:
    "An interactive 3D Force-Directed Knowledge Graph and financial crime surveillance studio simulating 2,512 transactions across 495 accounts, isolating coordinated money mule rings, shared device takeover clusters, and real-time 1-hop/2-hop fund flow paths.",
  alternates: { canonical: `/projects/${slug}/` },
  openGraph: {
    title: "Banking Anti-Fraud — 3D Financial Crime Graph & Mule Network — Abimael.Data",
    description:
      "Interactive 3D Knowledge Graph simulating financial crime syndicates across 495 accounts with zero-dependency native Canvas matrix mathematics.",
    url: `/projects/${slug}/`,
    siteName: siteConfig.name,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Banking Anti-Fraud — 3D Financial Crime Graph & Mule Network — Abimael.Data",
    description:
      "Interactive 3D Knowledge Graph simulating financial crime syndicates across 495 accounts with zero-dependency native Canvas matrix mathematics.",
  },
};

export default function BankingFraud3DProjectPage() {
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

        {/* Cross-Link Banner to 2D Enterprise SQL Suite */}
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
            <span style={{ fontSize: 14 }}>🏛️</span>
            <span style={{ fontSize: 13, color: "var(--ink)" }}>
              Looking for the 6-dashboard Power BI surveillance suite &amp; SQL window function engine?
            </span>
          </div>
          <Link
            href="/projects/banking-transaction-anti-fraud/"
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
            <span>EXPLORE 2D ENTERPRISE SQL SUITE (#1)</span>
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
              ANALYZED TRANSACTIONS
            </span>
            <strong className="mono" style={{ fontSize: 20, color: "var(--ink-heading)", display: "block", marginTop: 4 }}>
              2,512 Txns
            </strong>
            <span style={{ fontSize: 11.5, color: "var(--muted)" }}>495 Accounts • 43 Cities</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "16px 20px" }}>
            <span className="mono" style={{ fontSize: 9.5, color: "var(--dim)", display: "block" }}>
              SYNDICATE RINGS
            </span>
            <strong className="mono" style={{ fontSize: 20, color: "#f43f5e", display: "block", marginTop: 4 }}>
              3 Rings Isolated
            </strong>
            <span style={{ fontSize: 11.5, color: "var(--muted)" }}>Mule, ATO &amp; Skimming Funnels</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "16px 20px" }}>
            <span className="mono" style={{ fontSize: 9.5, color: "var(--dim)", display: "block" }}>
              GRAPH TOPOLOGY
            </span>
            <strong className="mono" style={{ fontSize: 20, color: "#00f0ff", display: "block", marginTop: 4 }}>
              3D Force-Directed
            </strong>
            <span style={{ fontSize: 11.5, color: "var(--muted)" }}>Coulomb-Hooke Equilibrium</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "16px 20px" }}>
            <span className="mono" style={{ fontSize: 9.5, color: "var(--dim)", display: "block" }}>
              TRAVERSAL LATENCY
            </span>
            <strong className="mono" style={{ fontSize: 20, color: "#10b981", display: "block", marginTop: 4 }}>
              &lt; 15 ms
            </strong>
            <span style={{ fontSize: 11.5, color: "var(--muted)" }}>In-memory 2-hop neighborhood</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "16px 20px" }}>
            <span className="mono" style={{ fontSize: 9.5, color: "var(--dim)", display: "block" }}>
              SAR TRACEABILITY
            </span>
            <strong className="mono" style={{ fontSize: 20, color: "#f59e0b", display: "block", marginTop: 4 }}>
              100% Auditable
            </strong>
            <span style={{ fontSize: 11.5, color: "var(--muted)" }}>Court-admissible bitmasks</span>
          </div>
        </div>

        {/* 3D Force-Directed Graph Flagship Section */}
        <section id="graph-studio" style={{ margin: "40px 0 60px" }} aria-label="3D Interactive Financial Crime Graph">
          <div style={{ marginBottom: 16 }}>
            <p className="section-label mono">01. 3D Financial Crime Graph Studio</p>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", letterSpacing: "-0.04em", margin: "0 0 8px", color: "var(--ink-heading)" }}>
              Interactive 3D Syndicate &amp; Mule Network Surveillance
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 14.5, lineHeight: 1.65, maxWidth: 840, margin: 0 }}>
              Holographic 3D topological graph{" "}
              <code className="mono" style={{ color: "#00f0ff", padding: "2px 7px", backgroundColor: "rgba(0, 240, 255, 0.08)", border: "1px solid rgba(0, 240, 255, 0.2)", borderRadius: 3, fontSize: 12 }}>
                G = (V, E)
              </code>{" "}
              modeling financial crime networks across 495 accounts, shared device fingerprints, and automated bot farms. Rotate freely in 3D orbit, trigger 1-hop/2-hop subgraph isolation, inspect live laser fund flow pulses, and track the 3 isolated criminal syndicate rings.
            </p>
          </div>

          <BankingFraud3DGraph />
        </section>

        {/* Section 02: 3D Transaction Anomaly Feature Manifold & Decision Hyperplane Studio */}
        <section id="anomaly-manifold" style={{ margin: "40px 0 60px" }} aria-label="3D Transaction Anomaly Feature Manifold">
          <div style={{ marginBottom: 16 }}>
            <p className="section-label mono">02. 3D Transaction Anomaly Feature Manifold</p>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", letterSpacing: "-0.04em", margin: "0 0 8px", color: "var(--ink-heading)" }}>
              Latent Feature Space Embedding &amp; Real-Time Decision Hyperplane
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 14.5, lineHeight: 1.65, maxWidth: 840, margin: 0 }}>
              Direct 3D Euclidean feature projection mapping all 2,512 historical banking transactions across Amount (<code className="mono" style={{ color: "#00f0ff", padding: "2px 6px", backgroundColor: "rgba(0, 240, 255, 0.08)", borderRadius: 3, fontSize: 11 }}>log₁₀</code> scale), Diurnal Time (<code className="mono" style={{ color: "#f59e0b", padding: "2px 6px", backgroundColor: "rgba(245, 158, 11, 0.08)", borderRadius: 3, fontSize: 11 }}>00:00–24:00 UTC</code>), and Anomaly Risk Severity (<code className="mono" style={{ color: "#f43f5e", padding: "2px 6px", backgroundColor: "rgba(244, 63, 94, 0.08)", borderRadius: 3, fontSize: 11 }}>0.0–1.0</code>). Adjust the glowing neon <strong style={{ color: "#f43f5e" }}>3D Decision Hyperplane (τ)</strong> to slice through the point cloud in real time, dynamically optimizing Precision, Recall, and Blocked Capital.
            </p>
          </div>

          <BankingFraud3DAnomalyManifold />
        </section>

        {/* System Diagram */}
        <section id="pipeline" aria-label="Architecture Pipeline">
          <SystemDiagram nodes={project.system} />
        </section>

        <div className="case-layout">
          <BankingFraud3DToc />

          <div className="case-story">
            {/* Deep Technical Markdown Narrative */}
            {project.body && <MarkdownBody source={project.body} />}

            <section id="evidence" aria-label="Visual Evidence">
              <VisualEvidence projectSlug={project.slug} evidence={project.evidence} />
            </section>

            <section className="case-stage" id="impact">
              <p className="mono case-label">Impact</p>
              <p>{project.impact}</p>
            </section>

            <section className="case-stage" id="lessons">
              <p className="mono case-label">Engineering Takeaways &amp; Compliance Lessons</p>
              <ul className="lessons-list">
                {project.lessons.map((lesson) => (
                  <li key={lesson}>{lesson}</li>
                ))}
              </ul>
            </section>

            <div className="project-pager">
              <Link className="pager-card" href={`/projects/${adjacent.previous.slug}/`}>
                <span className="mono">← Previous Case</span>
                <strong>{adjacent.previous.title}</strong>
              </Link>
              <Link className="pager-card next" href={`/projects/${adjacent.next.slug}/`}>
                <span className="mono">Next Case →</span>
                <strong>{adjacent.next.title}</strong>
              </Link>
            </div>
          </div>
        </div>

        {/* Related Projects Footer */}
        {related.length > 0 && (
          <section className="related-projects" style={{ marginTop: 64, borderTop: "1px solid var(--line)", paddingTop: 32 }}>
            <p className="mono section-label">Related Case Studies</p>
            <div className="related-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginTop: 16 }}>
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/projects/${rel.slug}/`}
                  className="card"
                  style={{ textDecoration: "none", padding: "18px 20px", display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <span className="mono" style={{ fontSize: 10, color: "var(--dim)" }}>
                    {rel.category}
                  </span>
                  <strong style={{ fontSize: 14, color: "var(--ink-heading)" }}>{rel.title}</strong>
                  <p style={{ fontSize: 12, color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                    {rel.one_liner}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
      <SiteFooter />
    </main>
  );
}
