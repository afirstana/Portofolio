"use client";

import React, { useState, useMemo } from "react";
import {
  computeDashboardAggregates,
  generateSyntheticAntiFraudDataset,
  FilterState,
  filterTransactions,
  formatCurrency
} from "@/lib/anti-fraud";

export function ExecutivePortfolioDashboard() {
  const masterDataset = useMemo(() => generateSyntheticAntiFraudDataset(), []);

  const [selectedQuarter, setSelectedQuarter] = useState<"ALL" | "Q1" | "Q2" | "Q3" | "Q4">("ALL");
  const [selectedChannel, setSelectedChannel] = useState<"ALL" | "ATM" | "Branch" | "Online">("ALL");
  const [selectedRisk, setSelectedRisk] = useState<"ALL" | "Low" | "Medium" | "High">("ALL");
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [activeFlagFilter, setActiveFlagFilter] = useState<string | null>(null);
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  // Cross-filtering engine
  const filteredDataset = useMemo(() => {
    let result = filterTransactions(masterDataset, {
      dateRange: selectedQuarter,
      channel: selectedChannel,
      transactionType: "ALL",
      occupation: "ALL",
      riskLevel: selectedRisk,
      searchQuery: ""
    });

    if (selectedMonth) {
      result = result.filter((t) => t.transactionDate.startsWith(selectedMonth));
    }

    if (activeFlagFilter) {
      result = result.filter((t) => t.flagReasons.some(f => f.toLowerCase().includes(activeFlagFilter.toLowerCase())));
    }

    return result;
  }, [masterDataset, selectedQuarter, selectedChannel, selectedRisk, selectedMonth, activeFlagFilter]);

  const aggregates = useMemo(() => computeDashboardAggregates(filteredDataset), [filteredDataset]);

  const maxFlagCount = Math.max(...aggregates.topFlagReasons.map((f) => f.count), 1);
  const maxMonthlyVolume = Math.max(...aggregates.monthlyTrends.map((m) => m.totalTransactions), 1);

  const handleResetAll = () => {
    setSelectedQuarter("ALL");
    setSelectedChannel("ALL");
    setSelectedRisk("ALL");
    setSelectedMonth(null);
    setActiveFlagFilter(null);
  };

  const hasActiveFilters = selectedQuarter !== "ALL" || selectedChannel !== "ALL" || selectedRisk !== "ALL" || selectedMonth !== null || activeFlagFilter !== null;

  return (
    <div className="anti-fraud-dashboard-root standalone-dashboard" id="executive-portfolio" aria-label="Executive Portfolio Dashboard">
      {/* Standalone Dashboard Header */}
      <div className="fraud-dashboard-header">
        <div className="fraud-header-top mono">
          <div className="hud-badge">
            <span className="pulse-dot" />
            <strong>01. EXECUTIVE PORTFOLIO SURVEILLANCE CONSOLE</strong>
          </div>
          <div className="hud-right-tags">
            <span className="hud-local-tag">⚡ 100% LOCAL-FIRST IN-MEMORY</span>
            <span className="hud-live-tag">CROSS-FILTERING ACTIVE</span>
          </div>
        </div>

        <div className="standalone-header-bar">
          <p className="standalone-header-sub">
            Interactive macro risk surveillance console. Click any <strong>month bar</strong>, <strong>risk tier</strong>, <strong>flag reason</strong>, or <strong>city chip</strong> to dynamically cross-filter all 5 KPI cards and telemetry views.
          </p>

          {/* Interactive Slicer Bar */}
          <div className="executive-slicer-row mono">
            {/* Quarter Filter */}
            <div className="slicer-pill-group">
              <span className="slicer-inline-label">QUARTER:</span>
              {(["ALL", "Q1", "Q2", "Q3", "Q4"] as const).map((q) => (
                <button
                  key={q}
                  type="button"
                  className={`slicer-pill-btn ${selectedQuarter === q ? "active" : ""}`}
                  onClick={() => setSelectedQuarter(q)}
                >
                  {q === "ALL" ? "Full Year" : q}
                </button>
              ))}
            </div>

            {/* Channel Filter */}
            <div className="slicer-pill-group">
              <span className="slicer-inline-label">CHANNEL:</span>
              {(["ALL", "ATM", "Branch", "Online"] as const).map((ch) => (
                <button
                  key={ch}
                  type="button"
                  className={`slicer-pill-btn ${selectedChannel === ch ? "active" : ""}`}
                  onClick={() => setSelectedChannel(ch)}
                >
                  {ch === "ALL" ? "All Channels" : ch}
                </button>
              ))}
            </div>

            {/* Risk Tier Filter */}
            <div className="slicer-pill-group">
              <span className="slicer-inline-label">RISK TIER:</span>
              {(["ALL", "High", "Medium", "Low"] as const).map((rk) => (
                <button
                  key={rk}
                  type="button"
                  className={`slicer-pill-btn ${selectedRisk === rk ? "active" : ""}`}
                  onClick={() => setSelectedRisk(rk)}
                >
                  {rk === "ALL" ? "All Tiers" : rk}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                className="filter-reset-btn mono"
                onClick={handleResetAll}
                title="Reset all active cross-filters"
              >
                ↺ Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Filter Notification Bar */}
      {hasActiveFilters && (
        <div className="active-filter-banner mono">
          <span>
            Active Filters:{" "}
            {selectedQuarter !== "ALL" && <strong>[Quarter: {selectedQuarter}] </strong>}
            {selectedChannel !== "ALL" && <strong>[Channel: {selectedChannel}] </strong>}
            {selectedRisk !== "ALL" && <strong>[Risk: {selectedRisk}] </strong>}
            {selectedMonth && <strong>[Month: {selectedMonth}] </strong>}
            {activeFlagFilter && <strong>[Flag: {activeFlagFilter}] </strong>}
          </span>
          <span className="banner-match-count">
            Matching: <strong>{aggregates.totalTransactions.toLocaleString()}</strong> of {masterDataset.length.toLocaleString()} operations
          </span>
        </div>
      )}

      {/* 5 Macro KPI Cards */}
      <div className="kpi-cards-grid">
        <div className="kpi-card interactive-kpi" onClick={() => setSelectedRisk("ALL")}>
          <span className="mono kpi-label">TOTAL MONITORED TXNS</span>
          <strong className="kpi-value">{aggregates.totalTransactions.toLocaleString()}</strong>
          <span className="mono kpi-sub">Total Monitored Operations</span>
        </div>

        <div className="kpi-card">
          <span className="mono kpi-label">GROSS PORTFOLIO VALUE</span>
          <strong className="kpi-value">{formatCurrency(aggregates.totalVolume)}</strong>
          <span className="mono kpi-sub">Cumulative Processed Volume</span>
        </div>

        <div
          className={`kpi-card flagged-kpi interactive-kpi ${selectedRisk === "High" ? "kpi-active-ring" : ""}`}
          onClick={() => setSelectedRisk(selectedRisk === "High" ? "ALL" : "High")}
          title="Click to isolate High Risk anomalies"
        >
          <span className="mono kpi-label">FLAGGED ANOMALIES (CLICK)</span>
          <strong className="kpi-value flagged-value">{aggregates.flaggedCount.toLocaleString()}</strong>
          <span className="mono kpi-sub">Risk Score &gt;= 2 Threshold</span>
        </div>

        <div className="kpi-card">
          <span className="mono kpi-label">FRAUD INCIDENCE RATE</span>
          <strong className={`kpi-value ${aggregates.fraudRate > 5 ? "rate-red" : aggregates.fraudRate >= 2 ? "rate-yellow" : "rate-green"}`}>
            {aggregates.fraudRate.toFixed(2)}%
          </strong>
          <span className="mono kpi-sub">Benchmark: &lt;2% Safe | 2–5% Med | &gt;5% High</span>
        </div>

        <div className="kpi-card">
          <span className="mono kpi-label">VALUE AT RISK EXPOSURE</span>
          <strong className="kpi-value exposure-value">{formatCurrency(aggregates.potentialLoss)}</strong>
          <span className="mono kpi-sub">Flagged Volume Exposure</span>
        </div>
      </div>

      {/* 2-Column Analytics Row */}
      <div className="exec-charts-grid">
        {/* Visual 1: Monthly Dual-Axis Trend with Click-to-Filter */}
        <div className="exec-chart-panel">
          <div className="panel-header mono">
            <div className="panel-header-flex">
              <div>
                <span className="panel-tag">VISUAL 01 • TEMPORAL TELEMETRY</span>
                <h4>Monthly Transaction &amp; Anomaly Trends (2023)</h4>
              </div>
              {selectedMonth && (
                <button
                  type="button"
                  className="mini-clear-btn"
                  onClick={() => setSelectedMonth(null)}
                >
                  ✕ Clear Month
                </button>
              )}
            </div>
            <p className="panel-sub">Click any month column to isolate transactions for that specific month.</p>
          </div>

          <div className="monthly-bars-container">
            {aggregates.monthlyTrends.map((m) => {
              const isMonthSelected = selectedMonth === m.month;
              const heightPct = Math.max((m.totalTransactions / maxMonthlyVolume) * 100, 10);
              const flaggedHeightPct = (m.flaggedTransactions / Math.max(m.totalTransactions, 1)) * 100;
              return (
                <div
                  key={m.month}
                  className={`monthly-col interactive-col ${isMonthSelected ? "selected-col" : ""}`}
                  onClick={() => setSelectedMonth(selectedMonth === m.month ? null : m.month)}
                  onMouseEnter={() => setHoveredBar(m.month)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  <div className="bar-track" style={{ height: `${heightPct}%` }}>
                    <div className="bar-flagged-fill" style={{ height: `${flaggedHeightPct}%` }} />
                  </div>
                  <span className="mono bar-month-label">{m.label}</span>
                  <span className="mono bar-flag-stat">{m.flaggedTransactions}</span>

                  {/* Floating Hover Tooltip */}
                  {hoveredBar === m.month && (
                    <div className="bar-floating-tooltip mono">
                      <strong>{m.label} 2023</strong>
                      <div>Total: {m.totalTransactions} txns</div>
                      <div className="red-highlight">Flagged: {m.flaggedTransactions} ({m.fraudRate.toFixed(1)}%)</div>
                      <div>Value: {formatCurrency(m.totalAmount)}</div>
                      <div className="tooltip-action-hint">Click to filter month</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="chart-legend-row mono">
            <span className="legend-item"><span className="legend-box total" /> Total Volume</span>
            <span className="legend-item"><span className="legend-box flagged" /> Flagged Incidents (Red Infill)</span>
            <span className="legend-hint-text">💡 Click bar to filter</span>
          </div>
        </div>

        {/* Visual 2: Risk Tier Distribution with Click-to-Filter */}
        <div className="exec-chart-panel">
          <div className="panel-header mono">
            <div className="panel-header-flex">
              <div>
                <span className="panel-tag">VISUAL 02 • RISK TIER BREAKDOWN</span>
                <h4>Risk Tier Severity Distribution (SQL Scoring Engine)</h4>
              </div>
              {selectedRisk !== "ALL" && (
                <button
                  type="button"
                  className="mini-clear-btn"
                  onClick={() => setSelectedRisk("ALL")}
                >
                  ✕ Show All Tiers
                </button>
              )}
            </div>
            <p className="panel-sub">Click any risk tier card below to filter the entire dashboard by severity level.</p>
          </div>

          <div className="risk-donut-summary">
            {/* High Risk Tier */}
            <div
              className={`risk-tier-item high interactive-tier ${selectedRisk === "High" ? "tier-active-card" : ""}`}
              onClick={() => setSelectedRisk(selectedRisk === "High" ? "ALL" : "High")}
              title="Click to filter by High Risk"
            >
              <div className="tier-info">
                <span className="tier-badge high mono">HIGH RISK (&gt;= 4 CONCURRENT FLAGS)</span>
                <strong className="tier-count">{aggregates.riskCounts.High} Txns (Click)</strong>
              </div>
              <div className="tier-bar-track">
                <div
                  className="tier-bar-fill high"
                  style={{ width: `${aggregates.totalTransactions > 0 ? (aggregates.riskCounts.High / aggregates.totalTransactions) * 100 : 0}%` }}
                />
              </div>
              <span className="mono tier-pct">
                {aggregates.totalTransactions > 0 ? ((aggregates.riskCounts.High / aggregates.totalTransactions) * 100).toFixed(1) : 0}% of filtered scope
              </span>
            </div>

            {/* Medium Risk Tier */}
            <div
              className={`risk-tier-item med interactive-tier ${selectedRisk === "Medium" ? "tier-active-card" : ""}`}
              onClick={() => setSelectedRisk(selectedRisk === "Medium" ? "ALL" : "Medium")}
              title="Click to filter by Medium Risk"
            >
              <div className="tier-info">
                <span className="tier-badge med mono">MEDIUM RISK (2–3 CONCURRENT FLAGS)</span>
                <strong className="tier-count">{aggregates.riskCounts.Medium} Txns (Click)</strong>
              </div>
              <div className="tier-bar-track">
                <div
                  className="tier-bar-fill med"
                  style={{ width: `${aggregates.totalTransactions > 0 ? (aggregates.riskCounts.Medium / aggregates.totalTransactions) * 100 : 0}%` }}
                />
              </div>
              <span className="mono tier-pct">
                {aggregates.totalTransactions > 0 ? ((aggregates.riskCounts.Medium / aggregates.totalTransactions) * 100).toFixed(1) : 0}% of filtered scope
              </span>
            </div>

            {/* Low Risk Tier */}
            <div
              className={`risk-tier-item low interactive-tier ${selectedRisk === "Low" ? "tier-active-card" : ""}`}
              onClick={() => setSelectedRisk(selectedRisk === "Low" ? "ALL" : "Low")}
              title="Click to filter by Low Risk"
            >
              <div className="tier-info">
                <span className="tier-badge low mono">LOW RISK / CLEAN (0–1 FLAGS)</span>
                <strong className="tier-count">{aggregates.riskCounts.Low} Txns (Click)</strong>
              </div>
              <div className="tier-bar-track">
                <div
                  className="tier-bar-fill low"
                  style={{ width: `${aggregates.totalTransactions > 0 ? (aggregates.riskCounts.Low / aggregates.totalTransactions) * 100 : 0}%` }}
                />
              </div>
              <span className="mono tier-pct">
                {aggregates.totalTransactions > 0 ? ((aggregates.riskCounts.Low / aggregates.totalTransactions) * 100).toFixed(1) : 0}% of filtered scope
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Analytics Row: Top Flags + City Geographic Map */}
      <div className="exec-lower-grid">
        {/* Visual 3: Top Flag Reasons with Click-to-Filter */}
        <div className="exec-chart-panel">
          <div className="panel-header mono">
            <div className="panel-header-flex">
              <div>
                <span className="panel-tag">VISUAL 03 • ANOMALY TAXONOMY</span>
                <h4>Top Rule-Based Flag Trigger Frequencies</h4>
              </div>
              {activeFlagFilter && (
                <button
                  type="button"
                  className="mini-clear-btn"
                  onClick={() => setActiveFlagFilter(null)}
                >
                  ✕ Clear Flag
                </button>
              )}
            </div>
            <p className="panel-sub">Click any anomaly row to filter the entire dashboard by that specific heuristic flag.</p>
          </div>

          <div className="top-flags-list mono">
            {aggregates.topFlagReasons.map((flag, idx) => {
              const isFlagActive = activeFlagFilter === flag.name;
              const widthPct = Math.min((flag.count / maxFlagCount) * 100, 100);
              return (
                <div
                  key={flag.name}
                  className={`flag-item-row interactive-flag-item ${isFlagActive ? "flag-active-row" : ""}`}
                  onClick={() => setActiveFlagFilter(isFlagActive ? null : flag.name)}
                  title={`Click to filter by ${flag.name}`}
                >
                  <div className="flag-row-top">
                    <span className="flag-name">0{idx + 1}. {flag.name}</span>
                    <span className="flag-count-pill">{flag.count.toLocaleString()} triggers (Click)</span>
                  </div>
                  <div className="flag-progress-track">
                    <div className="flag-progress-fill" style={{ width: `${widthPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visual 4: High-Risk Merchant Exposure Leaderboard */}
        <div className="exec-chart-panel">
          <div className="panel-header mono">
            <div className="panel-header-flex">
              <div>
                <span className="panel-tag">VISUAL 04 • MERCHANT EXPOSURE &amp; VELOCITY</span>
                <h4>High-Risk Merchant Exposure Leaderboard</h4>
              </div>
              <span className="panel-badge-mini">Top 6 Outlets</span>
            </div>
            <p className="panel-sub">Commercial merchant endpoints exhibiting recurring multi-flag anomaly concentration.</p>
          </div>

          <div className="merchant-exposure-list mono">
            {aggregates.topMerchants.slice(0, 6).map((m, idx) => {
              const maxMerchantExp = Math.max(...aggregates.topMerchants.map(x => x.exposureAmount), 1);
              const widthPct = Math.min((m.exposureAmount / maxMerchantExp) * 100, 100);
              return (
                <div key={m.merchantId} className="merchant-exposure-row">
                  <div className="merchant-row-top">
                    <div className="merchant-id-group">
                      <span className="merchant-rank">0{idx + 1}.</span>
                      <strong className="merchant-id">{m.merchantId}</strong>
                    </div>
                    <span className="merchant-flags-val">{m.flagged} Flags ({m.fraudRate.toFixed(1)}%)</span>
                    <strong className="merchant-exposure-amt">{formatCurrency(m.exposureAmount)}</strong>
                  </div>
                  <div className="merchant-bar-track">
                    <div className="merchant-bar-fill" style={{ width: `${widthPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="merchant-panel-footer mono">
            <span>📍 Dedicated spatial dispersion available in <strong>Console 02: Geographic Intelligence</strong>.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
