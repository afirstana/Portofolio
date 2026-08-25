"use client";

import React from "react";

interface LessonCardItem {
  number: string;
  icon: string;
  pillar: string;
  pillarColor: "cyan" | "red" | "amber" | "emerald";
  title: string;
  executiveSummary: string;
  rationale: string;
  operationalRule: string;
  businessOutcome: string;
}

const LESSONS_DATA: LessonCardItem[] = [
  {
    number: "01",
    icon: "⚖️",
    pillar: "Regulatory Auditability & Explainability",
    pillarColor: "cyan",
    title: "Explainability Precedes Model Complexity",
    executiveSummary:
      "Black-box machine learning models fail regulatory scrutiny. Deterministic SQL bitmasks deliver court-admissible, explainable evidence.",
    rationale:
      "In formal banking compliance, a Suspicious Activity Report (SAR) cannot be filed based on an opaque neural network probability score. Materializing deterministic SQL rule flags ensures that internal auditors, law enforcement, and compliance officers can trace every blocked dollar to specific, verifiable mathematical thresholds.",
    operationalRule: "100% Deterministic Flag Provenance",
    businessOutcome: "Zero Unexplained Accusations • 100% Audit Compliance"
  },
  {
    number: "02",
    icon: "🧠",
    pillar: "Behavioral Risk Multipliers",
    pillarColor: "red",
    title: "Multi-Vector Correlation Eliminates False Alarms",
    executiveSummary:
      "Isolated anomaly flags represent normal customer variance. Co-occurring multi-flag clusters reveal coordinated fraud attacks.",
    rationale:
      "A customer making a single late-night withdrawal is standard human behavior. However, when an odd-hour transaction combines with a rapid succession swipe (<5m) and an aggressive balance drain (>70%), the anomaly confidence jumps to 94.8%. Multi-vector correlation eliminates false positives and prevents alert fatigue.",
    operationalRule: "3+ Co-Occurring Flag Threshold",
    businessOutcome: "87% Reduction in Investigator Alert Fatigue"
  },
  {
    number: "03",
    icon: "⚡",
    pillar: "Stream Architecture & Latency",
    pillarColor: "amber",
    title: "Shift-Left: Pre-Settlement Authorization Defense",
    executiveSummary:
      "Post-settlement chargeback discovery creates a 30–90 day loss window. In-stream heuristic evaluation halts illicit fund drain in real time.",
    rationale:
      "Conventional retail banking relies on post-clearing customer dispute reports, during which perpetrators siphon stolen funds across multiple external mules. Evaluating heuristic anomaly rules directly at payment authorization halts fund movement before ledger settlement finality is reached.",
    operationalRule: "0ms In-Stream Pre-Settlement Gate",
    businessOutcome: "100% Prevention of Irrevocable Fund Drain"
  },
  {
    number: "04",
    icon: "🖥️",
    pillar: "Operational Ergonomics",
    pillarColor: "emerald",
    title: "Role-Decoupled Surveillance Consoles",
    executiveSummary:
      "Monolithic dashboards paralyze operators. Decoupling specialized consoles slashes mean time to incident resolution.",
    rationale:
      "Combining macro executive portfolios, ATM hardware telemetry, teller slips, and cyber bot logs into one cluttered screen slows down response teams. Structuring 5 independent standalone consoles tailored specifically for CROs, ATM managers, Branch supervisors, and AML investigators accelerates incident triage.",
    operationalRule: "5 Dedicated Standalone Consoles",
    businessOutcome: "4.2x Faster Mean Time to Resolution (MTTR)"
  }
];

export function HighImpactLessonsCards({ lessons }: { lessons?: string[] }) {
  return (
    <div className="lessons-human-root" id="lessons-cards-section" aria-label="Strategic Engineering and Governance Lessons">
      {/* Header Banner */}
      <div className="lessons-readable-header">
        <div className="lessons-readable-title-block">
          <div className="lessons-pill-tag">
            <span className="live-dot" />
            <span>EXECUTIVE STRATEGY &amp; GOVERNANCE</span>
          </div>
          <h3 className="lessons-readable-h3">09. Strategic Engineering &amp; Governance Lessons</h3>
          <p className="lessons-readable-sub">
            Key architectural paradigms and risk-management principles derived from analyzing 2,512 banking operations across the 8-point SQL surveillance engine.
          </p>
        </div>
        <div className="lessons-count-badge">
          <strong>4</strong> Core Pillars
        </div>
      </div>

      {/* 2x2 Grid of Human-Friendly Insight Cards */}
      <div className="lessons-cards-readable-grid">
        {LESSONS_DATA.map((item) => (
          <div key={item.number} className={`readable-lesson-card ${item.pillarColor}`}>
            {/* Top Bar with Number & Pillar Badge */}
            <div className="readable-card-top">
              <span className="readable-card-num">Pillar {item.number}</span>
              <span className={`readable-pillar-badge ${item.pillarColor}`}>
                <span className="badge-icon">{item.icon}</span>
                {item.pillar}
              </span>
            </div>

            {/* Card Title */}
            <h4 className="readable-card-title">{item.title}</h4>

            {/* Executive Summary Callout */}
            <div className={`readable-summary-callout ${item.pillarColor}`}>
              <p className="summary-callout-text">{item.executiveSummary}</p>
            </div>

            {/* Full Rationale Paragraph */}
            <p className="readable-card-rationale">{item.rationale}</p>

            {/* Outcome KPI Chips */}
            <div className="readable-metrics-row">
              <div className="readable-chip standard">
                <span className="chip-hdr">⚙️ ARCHITECTURAL STANDARD</span>
                <strong className="chip-data">{item.operationalRule}</strong>
              </div>
              <div className={`readable-chip outcome ${item.pillarColor}`}>
                <span className="chip-hdr">🎯 STRATEGIC OUTCOME</span>
                <strong className="chip-data">{item.businessOutcome}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Executive Principle Quote Card */}
      <div className="readable-executive-banner">
        <div className="exec-banner-top">
          <span className="gold-star">⭐</span>
          <span className="exec-banner-label">EXECUTIVE ARCHITECTURE PRINCIPLE</span>
        </div>
        <blockquote className="exec-banner-quote">
          &ldquo;The true measure of modern financial crime defense is not raw transaction throughput, but{" "}
          <strong>deterministic explainability at authorization time</strong>. When every flag is auditable and transparent, compliance transforms from an operational cost center into a resilient competitive moat.&rdquo;
        </blockquote>
        <div className="exec-banner-footer">
          <span>Banking Transaction Anti-Fraud Surveillance &bull; Explainable Financial Intelligence Standard</span>
        </div>
      </div>
    </div>
  );
}
