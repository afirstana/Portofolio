"use client";

import React, { useMemo } from "react";
import { generateSyntheticAntiFraudDataset } from "@/lib/anti-fraud";
import { DrillDownInvestigationView } from "./DrillDownInvestigationView";

export function ForensicAuditDashboard() {
  const masterDataset = useMemo(() => generateSyntheticAntiFraudDataset(), []);

  return (
    <div className="anti-fraud-dashboard-root standalone-dashboard" id="forensic-audit" aria-label="Forensic Investigation & Audit Console">
      {/* Standalone Dashboard Header */}
      <div className="fraud-dashboard-header">
        <div className="fraud-header-top mono">
          <div className="hud-badge">
            <span className="pulse-dot" />
            <strong>05. FORENSIC TRANSACTION AUDIT &amp; DRILL-DOWN CONSOLE</strong>
          </div>
          <div className="hud-right-tags">
            <span className="hud-local-tag">⚡ 100% LOCAL-FIRST</span>
            <span className="hud-live-tag">12-COLUMN AUDIT TABLE • CONTEXT HISTORIES</span>
          </div>
        </div>

        <div className="standalone-header-bar">
          <p className="standalone-header-sub">
            Granular forensic inspection table with column-level sorting, risk severity threshold sliders (0 to 6 flags), specific anomaly rule filtering, and clickable account context sub-panels showing historical transactions.
          </p>
        </div>
      </div>

      <DrillDownInvestigationView
        transactions={masterDataset}
        allTransactions={masterDataset}
      />
    </div>
  );
}
