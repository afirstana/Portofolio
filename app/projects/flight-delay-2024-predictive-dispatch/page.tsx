import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SystemDiagram } from "@/components/SystemDiagram";
import { VisualEvidence } from "@/components/VisualEvidence";
import { MarkdownBody } from "@/components/MarkdownBody";
import { FlightDelayMLToc } from "@/components/FlightDelayMLToc";
import FlightDelayMLStudio from "@/components/FlightDelayMLStudio";
import { getAdjacentProjects, getProjectBySlug, getRelatedProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";

const slug = "flight-delay-2024-predictive-dispatch";

export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Flight Delay 2024 — Machine Learning Delay Risk Engine & Dispatch Economics — Abimael.Data",
  description:
    "A dual-stage machine learning system predicting commercial flight delays with zero target leakage, calibrated gradient boosting, local SHAP attribution, and dynamic threshold economics on 2024 BTS data.",
  alternates: { canonical: `/projects/${slug}/` },
  openGraph: {
    title: "Flight Delay 2024 — Machine Learning Delay Risk Engine & Dispatch Economics — Abimael.Data",
    description:
      "Dual-stage ML delay prediction engine on 7M BTS flight records with zero-leakage pipeline, SHAP attribution, and fleet cost-minimizing threshold economics.",
    url: `/projects/${slug}/`,
    siteName: siteConfig.name,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flight Delay 2024 — Machine Learning Delay Risk Engine & Dispatch Economics — Abimael.Data",
    description:
      "Dual-stage ML delay prediction engine on 7M BTS flight records with zero-leakage pipeline, SHAP attribution, and fleet cost-minimizing threshold economics.",
  },
};

export default function FlightDelayMLPage() {
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
              VALIDATION ROC-AUC
            </span>
            <strong className="mono" style={{ fontSize: 24, color: "var(--ink-heading)", display: "block", marginTop: 4 }}>
              0.6174
            </strong>
            <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Calibrated HistGradientBoosting</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "16px 20px" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--muted)", display: "block", letterSpacing: "0.06em" }}>
              OPTIMAL THRESHOLD
            </span>
            <strong className="mono" style={{ fontSize: 24, color: "var(--ink-heading)", display: "block", marginTop: 4 }}>
              τ* = 0.20
            </strong>
            <span style={{ fontSize: 12.5, color: "var(--muted)" }}>72.8% Recall · Max F1</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "16px 20px" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--muted)", display: "block", letterSpacing: "0.06em" }}>
              MODELED NET SAVINGS
            </span>
            <strong className="mono" style={{ fontSize: 24, color: "#10b981", display: "block", marginTop: 4 }}>
              +$8.5M
            </strong>
            <span style={{ fontSize: 12.5, color: "var(--muted)" }}>vs Naive ($25.5M/yr Annualized)</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "16px 20px" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--muted)", display: "block", letterSpacing: "0.06em" }}>
              PRE-DEPARTURE PIPELINE
            </span>
            <strong className="mono" style={{ fontSize: 24, color: "var(--ink-heading)", display: "block", marginTop: 4 }}>
              100% Zero-Leakage
            </strong>
            <span style={{ fontSize: 12.5, color: "var(--muted)" }}>T-120min Feasible Features</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "16px 20px", borderTop: "3px solid var(--accent)" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--accent)", display: "block", letterSpacing: "0.06em", fontWeight: 700 }}>
              CLIENT INFERENCE
            </span>
            <strong className="mono" style={{ fontSize: 24, color: "var(--accent)", display: "block", marginTop: 4 }}>
              &lt; 0.8 ms
            </strong>
            <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Zero-Latency Browser Runtime</span>
          </div>
        </div>

        {/* Interactive Studio Section */}
        <section id="predictive-dispatch-studio" style={{ margin: "40px 0 60px" }} aria-label="Interactive Dispatch Studio">
          <div style={{ marginBottom: 20 }}>
            <p className="mono case-label" style={{ marginBottom: 6 }}>
              Interactive Studio • Dual-Stage Prediction &amp; Economics
            </p>
            <h2 style={{ margin: 0, fontSize: "clamp(24px, 3.5vw, 36px)", letterSpacing: "-0.03em", color: "var(--ink-heading)", fontWeight: 700 }}>
              Pre-Flight Delay Risk &amp; Fleet Economics Studio
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 14.5, lineHeight: 1.6, maxWidth: 840, margin: "8px 0 0" }}>
              Interactive decision simulator powered by calibrated gradient boosting and 2024 BTS TranStats data. Tab 1 enables real-time flight risk testing with local SHAP factor attribution and automated dispatch directives. Tab 2 simulates asymmetric airline economics (C_FN vs C_FP) to calculate the exact cost-minimizing operational threshold τ*.
            </p>
          </div>

          <FlightDelayMLStudio />
        </section>

        {/* System Diagram */}
        {project.system && project.system.length > 0 && (
          <section id="pipeline" aria-label="Architecture Pipeline">
            <SystemDiagram nodes={project.system} />
          </section>
        )}

        {/* Case Narrative with TOC */}
        <div className="case-layout">
          <FlightDelayMLToc />
          <div className="case-story">
            {project.body && <MarkdownBody source={project.body} />}

            {project.evidence && project.evidence.length > 0 && (
              <section id="evidence" aria-label="Visual Evidence">
                <VisualEvidence projectSlug={project.slug} evidence={project.evidence} />
              </section>
            )}
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
