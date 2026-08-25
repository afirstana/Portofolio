"use client";

import React, { useMemo } from "react";
import {
  computeDashboardAggregates,
  generateSyntheticAntiFraudDataset
} from "@/lib/anti-fraud";
import { CustomerProfileView } from "./CustomerProfileView";

export function BehavioralAmlDashboard() {
  const masterDataset = useMemo(() => generateSyntheticAntiFraudDataset(), []);
  const aggregates = useMemo(() => computeDashboardAggregates(masterDataset), [masterDataset]);

  return (
    <div className="anti-fraud-dashboard-root standalone-dashboard" id="behavioral-aml" aria-label="Behavioral & AML Risk Profiling Console">
      {/* Standalone Dashboard Header */}
      <div className="fraud-dashboard-header">
        <div className="fraud-header-top mono">
          <div className="hud-badge">
            <span className="pulse-dot" />
            <strong>04. CUSTOMER BEHAVIORAL &amp; AML RISK PROFILING CONSOLE</strong>
          </div>
          <div className="hud-right-tags">
            <span className="hud-local-tag">⚡ 100% LOCAL-FIRST</span>
            <span className="hud-live-tag">DEMOGRAPHICS • BALANCE DRAIN • TARGET QUEUE</span>
          </div>
        </div>

        <div className="standalone-header-bar">
          <p className="standalone-header-sub">
            Anti-Money Laundering (AML) behavioral analytics tracking age cohort vulnerability, occupation sensitivity, account balance depletion ratios (&gt; 70% drain), and automated prioritization of top target accounts.
          </p>
        </div>
      </div>

      <CustomerProfileView
        ageBinMetrics={aggregates.ageBinMetrics}
        occupationMetrics={aggregates.occupationMetrics}
        loginAttemptsDistribution={aggregates.loginAttemptsDistribution}
        topRiskAccounts={aggregates.topRiskAccounts}
      />
    </div>
  );
}
