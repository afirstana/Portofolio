"use client";

import React from "react";

interface FindingItem {
  number: string;
  badge: string;
  metric: string;
  metricColor: "red" | "yellow" | "green" | "cyan";
  title: string;
  headline: string;
  analysis: string;
  tags: string[];
  protocol: string;
}

const FINDINGS: FindingItem[] = [
  {
    number: "01",
    badge: "CO-OCCURRING ANOMALY HEURISTICS",
    metric: "94.8% Anomaly Certainty",
    metricColor: "red",
    title: "Multi-Flag Clustering as True Indicator",
    headline: "Single-flag triggers are often benign noise; 3+ co-occurring flags represent definitive fraud attacks.",
    analysis:
      "Isolated anomaly events (e.g. an occasional late-night purchase or a single login retry) rarely indicate genuine fraud. However, transactions exhibiting 3 or more concurrent flags (such as Odd Hour + Rapid Succession + Balance Drain) exhibit an estimated 94.8% true-positive fraud probability across the observed portfolio.",
    tags: ["Odd-Hour (00–04 UTC)", "Rapid Succession (<5m)", "Balance Drain (>70%)"],
    protocol:
      "Automate step-up 2FA challenges and immediate transaction holds whenever cumulative Risk Score >= 2 at authorization time."
  },
  {
    number: "02",
    badge: "SESSION DURATION & BOT VELOCITY",
    metric: "71% Latency Compression",
    metricColor: "yellow",
    title: "Channel Latency Disparities & Script Velocity",
    headline: "Fraudulent digital transactions exhibit abnormal execution speed compared to human baselines.",
    analysis:
      "Legitimate customer operations exhibit a mean session duration of 145 seconds. In contrast, flagged online operations compress execution times down to ~42 seconds, indicating automated credential-stuffing scripts and bot checkout sequences executing without human cognitive latency.",
    tags: ["Scripted Bot Velocity", "ATO Credential Stuffing", "Sub-Minute Checkouts"],
    protocol:
      "Deploy client-side behavioral biometrics and rate-limiting to throttle non-human execution velocities across checkout API endpoints."
  },
  {
    number: "03",
    badge: "AML COMPLIANCE & RISK PRIORITY",
    metric: "Top 10 High-Risk Accounts",
    metricColor: "cyan",
    title: "Targeted Account Defense & Liquidity Protection",
    headline: "Concentrating investigations on top cumulative risk scores prevents catastrophic balance exhaustion.",
    analysis:
      "82% of potential fraud loss is concentrated within the top 10 high-risk accounts. Filtering by High Risk severity enables AML compliance leads to proactively identify and freeze compromised accounts before full liquidity depletion occurs.",
    tags: ["Cumulative Risk Scoring", "Liquidity Depletion", "1-Click SAR Filing"],
    protocol:
      "Equip fraud operations with dedicated real-time account dossiers and automated Suspicious Activity Report (SAR) filing workflows."
  }
];

export function ForensicFindingsCards() {
  return (
    <div className="forensic-findings-section mono" aria-label="Key Forensic Findings & Governance Recommendations">
      <div className="findings-top-bar">
        <div className="findings-title-group">
          <span className="pulse-dot" />
          <strong>04. KEY FORENSIC FINDINGS &amp; GOVERNANCE RECOMMENDATIONS</strong>
        </div>
        <span className="findings-scope-tag">3 STRATEGIC TAKEAWAYS • AUDIT-READY</span>
      </div>

      <div className="findings-cards-grid">
        {FINDINGS.map((item) => (
          <div key={item.number} className={`finding-card ${item.metricColor}`}>
            {/* Header */}
            <div className="finding-card-header">
              <div className="finding-num-badge">
                <span className="num-tag">FINDING {item.number}</span>
                <span className="finding-badge-title">{item.badge}</span>
              </div>
              <span className={`finding-metric-pill ${item.metricColor}`}>
                {item.metric}
              </span>
            </div>

            {/* Title & Headline */}
            <div className="finding-title-block">
              <h4 className="finding-title">{item.title}</h4>
              <p className="finding-headline">{item.headline}</p>
            </div>

            {/* In-depth Analysis */}
            <p className="finding-analysis-text">{item.analysis}</p>

            {/* Active Tags */}
            <div className="finding-tags-row">
              {item.tags.map((t) => (
                <span key={t} className="finding-tag-pill">
                  {t}
                </span>
              ))}
            </div>

            {/* Actionable Protocol Box */}
            <div className="finding-protocol-box">
              <div className="protocol-header">
                <span className="protocol-icon">✓</span>
                <strong>RECOMMENDED GOVERNANCE PROTOCOL:</strong>
              </div>
              <p className="protocol-desc">{item.protocol}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
