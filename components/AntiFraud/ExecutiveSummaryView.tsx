"use client";

import React, { useState } from "react";
import { CityGeographicSummary, MonthlyTrendData } from "@/lib/anti-fraud";

interface ExecutiveSummaryViewProps {
  totalTransactions: number;
  totalVolume: number;
  flaggedCount: number;
  fraudRate: number;
  potentialLoss: number;
  riskCounts: { Low: number; Medium: number; High: number };
  topFlagReasons: Array<{ name: string; count: number }>;
  monthlyTrends: MonthlyTrendData[];
  cityGeographics: CityGeographicSummary[];
}

export function ExecutiveSummaryView({
  totalTransactions,
  totalVolume,
  flaggedCount,
  fraudRate,
  potentialLoss,
  riskCounts,
  topFlagReasons,
  monthlyTrends,
  cityGeographics
}: ExecutiveSummaryViewProps) {
  const [selectedCity, setSelectedCity] = useState<CityGeographicSummary | null>(cityGeographics[0] || null);

  const maxFlagCount = Math.max(...topFlagReasons.map((f) => f.count), 1);
  const maxMonthlyVolume = Math.max(...monthlyTrends.map((m) => m.totalTransactions), 1);
  const maxCityFlagged = Math.max(...cityGeographics.map((c) => c.flaggedTransactions), 1);

  let fraudRateColorClass = "rate-green";
  if (fraudRate > 5) {
    fraudRateColorClass = "rate-red";
  } else if (fraudRate >= 2) {
    fraudRateColorClass = "rate-yellow";
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="exec-summary-view" aria-label="Executive Overview Dashboard">
      {/* 5 Macro KPI Cards */}
      <div className="kpi-cards-grid">
        <div className="kpi-card">
          <span className="mono kpi-label">TOTAL TRANSACTIONS</span>
          <strong className="kpi-value">{totalTransactions.toLocaleString()}</strong>
          <span className="mono kpi-sub">Total Monitored Operations</span>
        </div>

        <div className="kpi-card">
          <span className="mono kpi-label">GROSS PROCESSED VALUE</span>
          <strong className="kpi-value">{formatCurrency(totalVolume)}</strong>
          <span className="mono kpi-sub">Cumulative Portfolio Volume</span>
        </div>

        <div className="kpi-card flagged-kpi">
          <span className="mono kpi-label">FLAGGED ANOMALIES</span>
          <strong className="kpi-value flagged-value">{flaggedCount.toLocaleString()}</strong>
          <span className="mono kpi-sub">Risk Score &gt;= 2 Threshold</span>
        </div>

        <div className="kpi-card">
          <span className="mono kpi-label">FRAUD INCIDENCE RATE</span>
          <strong className={`kpi-value ${fraudRateColorClass}`}>{fraudRate.toFixed(2)}%</strong>
          <span className="mono kpi-sub">Benchmark: &lt;2% Safe | 2-5% Med | &gt;5% High</span>
        </div>

        <div className="kpi-card">
          <span className="mono kpi-label">VALUE AT RISK EXPOSURE</span>
          <strong className="kpi-value exposure-value">{formatCurrency(potentialLoss)}</strong>
          <span className="mono kpi-sub">Flagged Transaction Volume</span>
        </div>
      </div>

      {/* 2-Column Analytics Row */}
      <div className="exec-charts-grid">
        {/* Visual 1: Monthly Dual-Axis Trend */}
        <div className="exec-chart-panel">
          <div className="panel-header mono">
            <span className="panel-tag">VISUAL 01 • TEMPORAL SURVEILLANCE</span>
            <h4>Monthly Transaction &amp; Anomaly Trends (2023)</h4>
            <p className="panel-sub">Evaluating monthly gross transaction throughput against flagged anomaly incidence.</p>
          </div>

          <div className="monthly-bars-container">
            {monthlyTrends.map((m) => {
              const heightPct = Math.max((m.totalTransactions / maxMonthlyVolume) * 100, 10);
              const flaggedHeightPct = (m.flaggedTransactions / Math.max(m.totalTransactions, 1)) * 100;
              return (
                <div
                  key={m.month}
                  className="monthly-col"
                  title={`${m.label}: ${m.flaggedTransactions} flagged (${m.fraudRate.toFixed(1)}%) out of ${m.totalTransactions} total`}
                >
                  <div className="bar-track" style={{ height: `${heightPct}%` }}>
                    <div className="bar-flagged-fill" style={{ height: `${flaggedHeightPct}%` }} />
                  </div>
                  <span className="mono bar-month-label">{m.label}</span>
                  <span className="mono bar-flag-stat">{m.flaggedTransactions}</span>
                </div>
              );
            })}
          </div>

          <div className="chart-legend-row mono">
            <span className="legend-item"><span className="legend-box total" /> Total Volume</span>
            <span className="legend-item"><span className="legend-box flagged" /> Flagged Incidents (Red Infill)</span>
          </div>
        </div>

        {/* Visual 2: Risk Tier Distribution */}
        <div className="exec-chart-panel">
          <div className="panel-header mono">
            <span className="panel-tag">VISUAL 02 • RISK TIER BREAKDOWN</span>
            <h4>Risk Tier Severity Distribution (SQL Scoring Engine)</h4>
            <p className="panel-sub">Classification based on multi-flag accumulation: Low (&lt;2), Medium (2–3), High (&gt;=4).</p>
          </div>

          <div className="risk-donut-summary">
            {/* High Risk Tier */}
            <div className="risk-tier-item high">
              <div className="tier-info">
                <span className="tier-badge high mono">HIGH RISK (&gt;= 4 CONCURRENT FLAGS)</span>
                <strong className="tier-count">{riskCounts.High} Txns</strong>
              </div>
              <div className="tier-bar-track">
                <div
                  className="tier-bar-fill high"
                  style={{ width: `${totalTransactions > 0 ? (riskCounts.High / totalTransactions) * 100 : 0}%` }}
                />
              </div>
              <span className="mono tier-pct">
                {totalTransactions > 0 ? ((riskCounts.High / totalTransactions) * 100).toFixed(1) : 0}%
              </span>
            </div>

            {/* Medium Risk Tier */}
            <div className="risk-tier-item med">
              <div className="tier-info">
                <span className="tier-badge med mono">MEDIUM RISK (2–3 CONCURRENT FLAGS)</span>
                <strong className="tier-count">{riskCounts.Medium} Txns</strong>
              </div>
              <div className="tier-bar-track">
                <div
                  className="tier-bar-fill med"
                  style={{ width: `${totalTransactions > 0 ? (riskCounts.Medium / totalTransactions) * 100 : 0}%` }}
                />
              </div>
              <span className="mono tier-pct">
                {totalTransactions > 0 ? ((riskCounts.Medium / totalTransactions) * 100).toFixed(1) : 0}%
              </span>
            </div>

            {/* Low Risk Tier */}
            <div className="risk-tier-item low">
              <div className="tier-info">
                <span className="tier-badge low mono">LOW RISK / CLEAN (0–1 FLAGS)</span>
                <strong className="tier-count">{riskCounts.Low} Txns</strong>
              </div>
              <div className="tier-bar-track">
                <div
                  className="tier-bar-fill low"
                  style={{ width: `${totalTransactions > 0 ? (riskCounts.Low / totalTransactions) * 100 : 0}%` }}
                />
              </div>
              <span className="mono tier-pct">
                {totalTransactions > 0 ? ((riskCounts.Low / totalTransactions) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Analytics Row: Top Flags + City Geographic Map */}
      <div className="exec-lower-grid">
        {/* Visual 3: Top Flag Reasons */}
        <div className="exec-chart-panel">
          <div className="panel-header mono">
            <span className="panel-tag">VISUAL 03 • ANOMALY TAXONOMY</span>
            <h4>Top Rule-Based Flag Trigger Frequencies</h4>
            <p className="panel-sub">Ranked incidence of specific anomaly heuristics across suspicious operations.</p>
          </div>

          <div className="top-flags-list">
            {topFlagReasons.map((flag, idx) => {
              const widthPct = Math.min((flag.count / maxFlagCount) * 100, 100);
              return (
                <div key={flag.name} className="flag-item-row">
                  <div className="flag-row-top mono">
                    <span className="flag-name">0{idx + 1}. {flag.name}</span>
                    <span className="flag-count-pill">{flag.count.toLocaleString()} triggers</span>
                  </div>
                  <div className="flag-progress-track">
                    <div className="flag-progress-fill" style={{ width: `${widthPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visual 4: Geographic Dispersion */}
        <div className="exec-chart-panel">
          <div className="panel-header mono">
            <span className="panel-tag">VISUAL 04 • GEOGRAPHIC INTELLIGENCE</span>
            <h4>Geographic Incident Dispersion (43 Metropolitan Cities)</h4>
            <p className="panel-sub">Spatial mapping of flagged transactions across geographic terminal clusters.</p>
          </div>

          <div className="city-geo-browser">
            <div className="city-chips-container">
              {cityGeographics.slice(0, 14).map((c) => {
                const isSelected = selectedCity?.city === c.city;
                const bubbleSize = Math.max(8, Math.min(22, (c.flaggedTransactions / maxCityFlagged) * 22));
                return (
                  <button
                    key={c.city}
                    type="button"
                    className={`city-pill-btn mono ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedCity(c)}
                  >
                    <span className="city-dot" style={{ width: bubbleSize, height: bubbleSize }} />
                    <span className="city-name">{c.city}</span>
                    <span className="city-flag-val">{c.flaggedTransactions}</span>
                  </button>
                );
              })}
            </div>

            {selectedCity && (
              <div className="selected-city-card mono">
                <div className="city-card-header">
                  <span className="pulse-dot" />
                  <strong>LOCATION: {selectedCity.city.toUpperCase()}</strong>
                  <span className="city-coord">[{selectedCity.lat.toFixed(4)}, {selectedCity.lng.toFixed(4)}]</span>
                </div>
                <div className="city-card-stats-row">
                  <div>
                    <span className="stat-label">Total Volume:</span>
                    <strong>{selectedCity.totalTransactions}</strong>
                  </div>
                  <div>
                    <span className="stat-label">Flagged Incidents:</span>
                    <strong className="red-highlight">{selectedCity.flaggedTransactions}</strong>
                  </div>
                  <div>
                    <span className="stat-label">Fraud Incidence:</span>
                    <strong className="red-highlight">{selectedCity.fraudRate.toFixed(1)}%</strong>
                  </div>
                  <div>
                    <span className="stat-label">Gross Value:</span>
                    <strong>{formatCurrency(selectedCity.totalAmount)}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
