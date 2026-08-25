import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SystemDiagram } from "@/components/SystemDiagram";
import { MarkdownBody } from "@/components/MarkdownBody";
import { AntiFraudCaseStudyToc } from "@/components/AntiFraud/AntiFraudCaseStudyToc";
import { ExecutivePortfolioDashboard } from "@/components/AntiFraud/ExecutivePortfolioDashboard";
import { GeographicIntelligenceDashboard } from "@/components/AntiFraud/GeographicIntelligenceDashboard";
import { ChannelInstrumentDashboard } from "@/components/AntiFraud/ChannelInstrumentDashboard";
import { BankBranchDashboard } from "@/components/AntiFraud/BankBranchDashboard";
import { BehavioralAmlDashboard } from "@/components/AntiFraud/BehavioralAmlDashboard";
import { ForensicAuditDashboard } from "@/components/AntiFraud/ForensicAuditDashboard";
import { InteractiveSqlEngineViewer } from "@/components/AntiFraud/InteractiveSqlEngineViewer";
import { LiveAnomalySandbox } from "@/components/AntiFraud/LiveAnomalySandbox";
import { DashboardArchitectureTable } from "@/components/AntiFraud/DashboardArchitectureTable";
import { ForensicFindingsCards } from "@/components/AntiFraud/ForensicFindingsCards";
import { HighImpactLessonsCards } from "@/components/AntiFraud/HighImpactLessonsCards";
import { getAdjacentProjects, getProjectBySlug } from "@/lib/content";
import { siteConfig } from "@/lib/site";

const slug = "banking-transaction-anti-fraud";

export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Banking Anti-Fraud Detection & Transaction Surveillance — Abimael.Data",
  description: "A production-grade financial crime surveillance architecture featuring 6 separated specialized dashboards evaluating 2,512 transactions across 495 accounts, powered by an 8-point SQL rule-based anomaly engine.",
  alternates: { canonical: `/projects/${slug}/` },
  openGraph: {
    title: "Banking Anti-Fraud Detection & Transaction Surveillance — Abimael.Data",
    description: "A production-grade financial crime surveillance architecture featuring 6 separated specialized dashboards evaluating 2,512 transactions across 495 accounts.",
    url: `/projects/${slug}/`,
    siteName: siteConfig.name,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Banking Anti-Fraud Detection & Transaction Surveillance — Abimael.Data",
    description: "A production-grade financial crime surveillance architecture featuring 6 separated specialized dashboards evaluating 2,512 transactions across 495 accounts.",
  },
};

export default function BankingAntiFraudProjectPage() {
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const adjacent = getAdjacentProjects(project);

  return (
    <main className="site-shell">
      <SiteHeader />
      <article className="project-detail page-width-wide fraud-case-study">
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

        {/* Minimalist Sticky TOC Navigator */}
        <AntiFraudCaseStudyToc />

        {/* Full-Width Showcase Canvas */}
        <div className="payment-full-canvas">
          {/* ========================================================================= */}
          {/* PART I: INTERACTIVE SURVEILLANCE DASHBOARD SUITE (6 STANDALONE CONSOLES)  */}
          {/* ========================================================================= */}
          <div id="part-dashboards" className="master-division-container dashboards-zone">
            <div className="minimal-division-divider cyan">
              <div className="division-header-left">
                <span className="minimal-tag cyan">PART I &bull; OPERATIONAL CONSOLES</span>
                <h2 className="minimal-h2">Surveillance Dashboard Suite</h2>
              </div>
              <span className="minimal-counter mono">6 Interactive Consoles</span>
            </div>

            {/* 01. Standalone Console 01: Executive Portfolio Surveillance */}
            <section id="dashboard-executive" className="case-stage payment-dashboard-stage">
              <p className="mono case-label">Console 01. Executive Portfolio Surveillance</p>
              <ExecutivePortfolioDashboard />
            </section>

            {/* 02. Standalone Console 02: Geographic Incident & Metropolitan Surveillance */}
            <section id="dashboard-geographic" className="case-stage payment-dashboard-stage">
              <p className="mono case-label">Console 02. Geographic Incident &amp; Metropolitan Surveillance</p>
              <GeographicIntelligenceDashboard />
            </section>

            {/* 03. Standalone Console 03: Channel Topology & Payment Instruments */}
            <section id="dashboard-channels" className="case-stage payment-dashboard-stage">
              <p className="mono case-label">Console 03. Channel Topology &amp; Payment Instruments</p>
              <ChannelInstrumentDashboard />
            </section>

            {/* 04. Standalone Console 04: Bank Branch Operations & Teller Surveillance */}
            <section id="dashboard-branches" className="case-stage payment-dashboard-stage">
              <p className="mono case-label">Console 04. Bank Branch Operations &amp; Teller Surveillance</p>
              <BankBranchDashboard />
            </section>

            {/* 05. Standalone Console 05: Customer Behavioral & AML Risk Profiling */}
            <section id="dashboard-behavioral" className="case-stage payment-dashboard-stage">
              <p className="mono case-label">Console 05. Customer Behavioral &amp; AML Risk Profiling</p>
              <BehavioralAmlDashboard />
            </section>

            {/* 06. Standalone Console 06: Forensic Transaction Audit & Drill-Down */}
            <section id="dashboard-forensic" className="case-stage payment-dashboard-stage">
              <p className="mono case-label">Console 06. Forensic Transaction Audit &amp; Drill-Down</p>
              <ForensicAuditDashboard />
            </section>
          </div>

          {/* ========================================================================= */}
          {/* PART II: IN-DEPTH TECHNICAL & FORENSIC ANALYSIS (PEMBAHASAN DETAIL)        */}
          {/* ========================================================================= */}
          <div id="part-analysis" className="master-division-container analysis-zone">
            <div className="minimal-division-divider amber">
              <div className="division-header-left">
                <span className="minimal-tag amber">PART II &bull; TECHNICAL ANALYSIS</span>
                <h2 className="minimal-h2">Engineering Foundation &amp; Governance Analysis</h2>
              </div>
              <span className="minimal-counter mono">6 Analytical Sections</span>
            </div>

            {/* 07. Operational Context & Problem Overview */}
            <section id="overview" className="case-stage payment-overview-stage">
              <p className="mono case-label">07. Operational Context &amp; Stream Defense Paradigm</p>
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
                  <span className="mono">Key Impact</span>
                  <p>{project.impact}</p>
                </div>
              </div>

              {project.system && project.system.length > 0 && (
                <div style={{ marginTop: "24px" }}>
                  <SystemDiagram nodes={project.system} />
                </div>
              )}

              <div className="prose-container" style={{ marginTop: "24px" }}>
                <MarkdownBody source={project.body} />
              </div>
            </section>

            {/* 08. Data Engineering & SQL Anomaly Engine */}
            <section id="sql-engine" className="case-stage payment-body-stage">
              <p className="mono case-label">08. Data Engineering &amp; 8-Point SQL Anomaly Engine</p>
              <InteractiveSqlEngineViewer />
            </section>

            {/* 09. Live Interactive Anomaly Sandbox & Risk Meter */}
            <section id="live-sandbox" className="case-stage payment-body-stage">
              <p className="mono case-label">09. Live Interactive Anomaly Sandbox &amp; Risk Meter</p>
              <LiveAnomalySandbox />
            </section>

            {/* 10. Multi-Dashboard Surveillance Architecture Blueprint */}
            <section id="architecture" className="case-stage payment-body-stage">
              <p className="mono case-label">10. Multi-Dashboard Surveillance Architecture Blueprint</p>
              <DashboardArchitectureTable />
            </section>

            {/* 11. Key Forensic Findings & Governance Recommendations */}
            <section id="findings" className="case-stage payment-body-stage">
              <p className="mono case-label">11. Key Forensic Takeaways &amp; Governance Protocols</p>
              <ForensicFindingsCards />
            </section>

            {/* 12. Strategic Engineering & Governance Lessons */}
            <section id="lessons" className="case-stage payment-lessons-stage">
              <p className="mono case-label">12. Strategic Engineering &amp; Governance Lessons</p>
              <HighImpactLessonsCards lessons={project.lessons} />
            </section>
          </div>

          {/* Adjacent Projects Pager */}
          <nav className="project-pager" aria-label="Adjacent projects navigation" style={{ marginTop: "40px" }}>
            {adjacent.previous && (
              <Link href={`/projects/${adjacent.previous.slug}/`} className="pager-link prev">
                <span className="mono">← Previous project</span>
                <strong>{adjacent.previous.title}</strong>
              </Link>
            )}
            {adjacent.next && (
              <Link href={`/projects/${adjacent.next.slug}/`} className="pager-link next">
                <span className="mono">Next project →</span>
                <strong>{adjacent.next.title}</strong>
              </Link>
            )}
          </nav>
        </div>
      </article>
      <SiteFooter wide backHref="#top" backLabel="Back to top ↑" />
    </main>
  );
}
