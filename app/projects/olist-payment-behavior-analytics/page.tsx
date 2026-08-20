import type { Metadata } from "next";
import Link from "next/link";
import { PaymentCaseStudyToc } from "@/components/PaymentCaseStudyToc";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { OlistPaymentDashboard } from "@/components/OlistPaymentDashboard";
import { OlistPaymentInteractiveShowcase } from "@/components/OlistPaymentInteractiveShowcase";
import { OlistInstallmentAnomalyShowcase } from "@/components/OlistInstallmentAnomalyShowcase";
import { OlistCategoryFinancingShowcase } from "@/components/OlistCategoryFinancingShowcase";
import { OlistPipelineFlowchart } from "@/components/OlistPipelineFlowchart";
import { SystemDiagram } from "@/components/SystemDiagram";
import { MarkdownBody } from "@/components/MarkdownBody";
import { VisualEvidence } from "@/components/VisualEvidence";
import { getAdjacentProjects, getProjectBySlug, getRelatedProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { notFound } from "next/navigation";

const slug = "olist-payment-behavior-analytics";

export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Olist Payment & Installment Behavior Analysis — Abimael.Data",
  description: "An empirical analysis of 103,886 Brazilian e-commerce payment records (R$ 16.01M total value) examining payment method mix, installment-to-order-value relationships (r = 0.37), and category-level financing patterns.",
  alternates: { canonical: `/projects/${slug}/` },
  openGraph: {
    title: "Olist Payment & Installment Behavior Analysis — Abimael.Data",
    description: "An empirical analysis of 103,886 Brazilian e-commerce payment records (R$ 16.01M total value) examining payment method mix, installment-to-order-value relationships (r = 0.37), and category-level financing patterns.",
    url: `/projects/${slug}/`,
    siteName: siteConfig.name,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Olist Payment & Installment Behavior Analysis — Abimael.Data",
    description: "An empirical analysis of 103,886 Brazilian e-commerce payment records (R$ 16.01M total value).",
  },
};

export default function OlistPaymentAnalyticsPage() {
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const related = getRelatedProjects(project);
  const adjacent = getAdjacentProjects(project);

  return (
    <main className="site-shell">
      <SiteHeader />
      <article className="project-detail page-width-wide payment-case-study">
        <Link className="back-link mono" href="/#work">
          ← All work
        </Link>
        <p className="section-label mono">Case study / {project.category}</p>
        <h1 className="payment-hero-title">{project.title}</h1>
        <p className="detail-lede payment-lede">{project.one_liner}</p>

        <div className="tags detail-tags">
          {project.tools.map((tool) => (
            <span key={tool}>{tool}</span>
          ))}
        </div>

        {/* Sleek Horizontal Top Navigation Bar */}
        <PaymentCaseStudyToc hasEvidence={Boolean(project.evidence?.some((e) => Boolean(e.image && e.image.trim() !== "")))} />

        {/* Full-Width Stage Container */}
        <div className="payment-full-canvas">
          {/* 01. Overview Cards */}
          <section id="overview" className="case-stage payment-overview-stage">
            <p className="mono case-label">01. Overview</p>
            <div className="payment-executive-grid">
              <div className="exec-card">
                <span className="mono">Problem</span>
                <p>{project.problem}</p>
              </div>
              <div className="exec-card">
                <span className="mono">Approach</span>
                <p>{project.approach}</p>
              </div>
              <div className="exec-card">
                <span className="mono">Key Finding</span>
                <p>{project.impact}</p>
              </div>
            </div>
          </section>

          {/* 02. Data Ingestion & Transformation Flowchart Architecture */}
          <section id="flowchart" className="case-stage">
            <p className="mono case-label">02. Flowchart Architecture</p>
            <OlistPipelineFlowchart />
          </section>

          {/* 03. Standalone Interactive Pie & Telemetry Terminal */}
          <section id="payment-mix" className="case-stage">
            <p className="mono case-label">03. Interactive Payment Mix</p>
            <OlistPaymentInteractiveShowcase />
          </section>

          {/* 04. Diagnostic Investigation: The 10x Installment Spike Anomaly Terminal */}
          <section id="anomaly" className="case-stage">
            <p className="mono case-label">04. 10x Checkout Anomaly</p>
            <OlistInstallmentAnomalyShowcase />
          </section>

          {/* 05. Category Financing Sensitivity Matrix Terminal */}
          <section id="categories" className="case-stage">
            <p className="mono case-label">05. Category Sensitivity Matrix</p>
            <OlistCategoryFinancingShowcase />
          </section>

          {/* 06. Comprehensive Interactive Dashboard Console */}
          <section id="interactive-dashboard" className="case-stage payment-dashboard-stage">
            <div className="dashboard-stage-header">
              <div>
                <p className="mono case-label">06. Interactive Console</p>
                <h2>Payment & Installment Behavior Console</h2>
              </div>
              <p className="dashboard-stage-sub">
                Explore monthly method trends, category average installments, and order-level audit records.
              </p>
            </div>
            <OlistPaymentDashboard />
          </section>

          {/* 07. Relational System Architecture */}
          <section id="system" className="case-stage" aria-label="Data preparation and system architecture">
            <p className="mono case-label">07. Data Preparation Pipeline</p>
            <SystemDiagram nodes={project.system} />
          </section>

          {/* 08. Technical Markdown Narrative */}
          <section id="narrative" className="case-stage payment-narrative-stage">
            <p className="mono case-label">08. Detailed Analysis & Recommendations</p>
            {project.body && <MarkdownBody source={project.body} />}
          </section>

          {/* 09. Impact */}
          <section className="case-stage" id="impact">
            <p className="mono case-label">09. Impact</p>
            <p>{project.impact}</p>
          </section>

          {/* 10. Lessons Learned */}
          <section className="case-stage" id="lessons">
            <p className="mono case-label">10. Lessons Learned</p>
            <ul className="lesson-list">
              {project.lessons.map((lesson) => (
                <li key={lesson}>{lesson}</li>
              ))}
            </ul>
          </section>

          {/* 11. Visual Evidence */}
          <VisualEvidence projectSlug={project.slug} evidence={project.evidence} />
        </div>

        {/* Related Projects */}
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

        {/* Project Pager */}
        <nav className="project-pager" aria-label="Project navigation">
          <Link href={`/projects/${adjacent.previous.slug}/`}>
            <span className="mono">Previous</span>
            <strong>{adjacent.previous.title}</strong>
          </Link>
          <Link href={`/projects/${adjacent.next.slug}/`}>
            <span className="mono">Next</span>
            <strong>{adjacent.next.title}</strong>
          </Link>
        </nav>
      </article>

      <SiteFooter wide backHref="/" backLabel="Home ↑" />
    </main>
  );
}
