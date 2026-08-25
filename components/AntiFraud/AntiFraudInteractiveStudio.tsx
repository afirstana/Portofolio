"use client";

import React, { useState } from "react";
import { ExecutivePortfolioDashboard } from "./ExecutivePortfolioDashboard";
import { GeographicIntelligenceDashboard } from "./GeographicIntelligenceDashboard";
import { ChannelInstrumentDashboard } from "./ChannelInstrumentDashboard";
import { BankBranchDashboard } from "./BankBranchDashboard";
import { BehavioralAmlDashboard } from "./BehavioralAmlDashboard";
import { ForensicAuditDashboard } from "./ForensicAuditDashboard";
import { InteractiveSqlEngineViewer } from "./InteractiveSqlEngineViewer";
import { LiveAnomalySandbox } from "./LiveAnomalySandbox";
import { DashboardArchitectureTable } from "./DashboardArchitectureTable";
import { ForensicFindingsCards } from "./ForensicFindingsCards";
import { HighImpactLessonsCards } from "./HighImpactLessonsCards";
import { SystemDiagram } from "@/components/SystemDiagram";
import { MarkdownBody } from "@/components/MarkdownBody";
import { Project } from "@/lib/content";

const CONSOLES = [
  { id: "executive", label: "Executive" },
  { id: "geographic", label: "Geographic Map" },
  { id: "channels", label: "Channels & Cards" },
  { id: "branches", label: "Branch Network" },
  { id: "behavioral", label: "Behavioral AML" },
  { id: "forensic", label: "Forensic Table" }
];

export function AntiFraudInteractiveStudio({ project }: { project: Project }) {
  const [activeMode, setActiveMode] = useState<"CONSOLES" | "DEEP_DIVE" | "ALL">("CONSOLES");
  const [activeConsole, setActiveConsole] = useState<string>("executive");

  const currentConsoleIndex = CONSOLES.findIndex((c) => c.id === activeConsole);

  const handleNextConsole = () => {
    const nextIdx = (currentConsoleIndex + 1) % CONSOLES.length;
    setActiveConsole(CONSOLES[nextIdx].id);
  };

  const handlePrevConsole = () => {
    const prevIdx = (currentConsoleIndex - 1 + CONSOLES.length) % CONSOLES.length;
    setActiveConsole(CONSOLES[prevIdx].id);
  };

  return (
    <div className="pure-minimal-studio" id="studio-root">
      {/* Sleek Segmented Switcher */}
      <div className="pure-segmented-bar">
        <div className="pure-segmented-control mono">
          <button
            type="button"
            className={`seg-btn ${activeMode === "CONSOLES" ? "active" : ""}`}
            onClick={() => setActiveMode("CONSOLES")}
          >
            Dashboards
          </button>
          <button
            type="button"
            className={`seg-btn ${activeMode === "DEEP_DIVE" ? "active" : ""}`}
            onClick={() => setActiveMode("DEEP_DIVE")}
          >
            Deep-Dive
          </button>
          <button
            type="button"
            className={`seg-btn ${activeMode === "ALL" ? "active" : ""}`}
            onClick={() => setActiveMode("ALL")}
          >
            Full
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: FOCUSED SURVEILLANCE CONSOLES                                     */}
      {/* ========================================================================= */}
      {(activeMode === "CONSOLES" || activeMode === "ALL") && (
        <div className="pure-consoles-zone">
          {activeMode === "CONSOLES" && (
            <>
              {/* Minimal Flat Console Tabs */}
              <div className="pure-tabs-row mono">
                {CONSOLES.map((c, i) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`pure-tab-item ${activeConsole === c.id ? "active" : ""}`}
                    onClick={() => setActiveConsole(c.id)}
                  >
                    <span className="tab-idx">0{i + 1}.</span> {c.label}
                  </button>
                ))}
              </div>

              {/* Active Focused Console */}
              <div className="pure-stage-view">
                {activeConsole === "executive" && <ExecutivePortfolioDashboard />}
                {activeConsole === "geographic" && <GeographicIntelligenceDashboard />}
                {activeConsole === "channels" && <ChannelInstrumentDashboard />}
                {activeConsole === "branches" && <BankBranchDashboard />}
                {activeConsole === "behavioral" && <BehavioralAmlDashboard />}
                {activeConsole === "forensic" && <ForensicAuditDashboard />}

                {/* Minimal Pager */}
                <div className="pure-pager-bar mono">
                  <button
                    type="button"
                    className="pure-pager-btn"
                    onClick={handlePrevConsole}
                  >
                    &larr; Prev
                  </button>
                  <span className="pure-pager-counter">
                    {currentConsoleIndex + 1} / {CONSOLES.length}
                  </span>
                  <button
                    type="button"
                    className="pure-pager-btn"
                    onClick={handleNextConsole}
                  >
                    Next &rarr;
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ALL Mode */}
          {activeMode === "ALL" && (
            <div className="pure-all-stack">
              <div className="pure-section-sep mono">── PART I: DASHBOARDS ──</div>
              <ExecutivePortfolioDashboard />
              <GeographicIntelligenceDashboard />
              <ChannelInstrumentDashboard />
              <BankBranchDashboard />
              <BehavioralAmlDashboard />
              <ForensicAuditDashboard />
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: TECHNICAL DEEP-DIVE & GOVERNANCE ANALYSIS (PEMBAHASAN DETAIL)     */}
      {/* ========================================================================= */}
      {(activeMode === "DEEP_DIVE" || activeMode === "ALL") && (
        <div className="studio-analysis-wrapper">
          {activeMode === "ALL" && (
            <div className="all-mode-divider amber" style={{ marginTop: "48px" }}>
              <h3>PART II &bull; Engineering Foundation &amp; Governance Analysis</h3>
            </div>
          )}

          {/* 07. Context */}
          <section id="overview" className="deep-dive-card">
            <div className="deep-dive-header">
              <span className="tag-label">01. OPERATIONAL CONTEXT</span>
              <h4>Problem Statement &amp; Stream Defense Paradigm</h4>
            </div>

            <div className="minimal-summary-grid">
              <div className="min-sum-box">
                <span className="box-hdr">PROBLEM</span>
                <p>{project.problem}</p>
              </div>
              <div className="min-sum-box">
                <span className="box-hdr">APPROACH</span>
                <p>{project.approach}</p>
              </div>
              <div className="min-sum-box">
                <span className="box-hdr">KEY IMPACT</span>
                <p>{project.impact}</p>
              </div>
            </div>

            {project.system && project.system.length > 0 && (
              <div style={{ marginTop: "16px" }}>
                <SystemDiagram nodes={project.system} />
              </div>
            )}

            <div className="prose-container" style={{ marginTop: "16px" }}>
              <MarkdownBody source={project.body} />
            </div>
          </section>

          {/* 08. SQL Engine */}
          <section id="sql-engine" className="deep-dive-card">
            <div className="deep-dive-header">
              <span className="tag-label">02. DATA ENGINEERING</span>
              <h4>8-Point SQL Rule-Based Anomaly Engine</h4>
            </div>
            <InteractiveSqlEngineViewer />
          </section>

          {/* 09. Sandbox */}
          <section id="live-sandbox" className="deep-dive-card">
            <div className="deep-dive-header">
              <span className="tag-label">03. RISK SIMULATOR</span>
              <h4>Live Interactive Parameter Sandbox &amp; Risk Meter</h4>
            </div>
            <LiveAnomalySandbox />
          </section>

          {/* 10. Architecture */}
          <section id="architecture" className="deep-dive-card">
            <div className="deep-dive-header">
              <span className="tag-label">04. ARCHITECTURAL BLUEPRINT</span>
              <h4>Multi-Dashboard Matrix &amp; Floating Sneak Peek Previews</h4>
            </div>
            <DashboardArchitectureTable />
          </section>

          {/* 11. Findings */}
          <section id="findings" className="deep-dive-card">
            <div className="deep-dive-header">
              <span className="tag-label">05. FORENSIC SYNTHESIS</span>
              <h4>Key Forensic Findings &amp; Governance Recommendations</h4>
            </div>
            <ForensicFindingsCards />
          </section>

          {/* 12. Lessons */}
          <section id="lessons" className="deep-dive-card">
            <div className="deep-dive-header">
              <span className="tag-label">06. STRATEGIC LESSONS</span>
              <h4>Engineering Governance Lessons &amp; Executive Standard</h4>
            </div>
            <HighImpactLessonsCards lessons={project.lessons} />
          </section>
        </div>
      )}
    </div>
  );
}
