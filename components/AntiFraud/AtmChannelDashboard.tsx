"use client";

import React, { useState, useMemo } from "react";
import { FlaggedTransaction } from "@/lib/anti-fraud";

interface AtmChannelDashboardProps {
  transactions: FlaggedTransaction[];
}

export function AtmChannelDashboard({ transactions }: AtmChannelDashboardProps) {
  const [activeAtmFilter, setActiveAtmFilter] = useState<"ALL" | "ODD_HOUR" | "RAPID" | "HIGH_AMOUNT" | "BALANCE_DRAIN">("ALL");
  const [maxAmountSlider, setMaxAmountSlider] = useState<number>(2000);
  const [selectedAtmCity, setSelectedAtmCity] = useState<string | null>(null);

  const rawAtmTransactions = useMemo(() => transactions.filter((t) => t.channel === "ATM"), [transactions]);

  // Interactive filtering within ATM Dashboard
  const atmTransactions = useMemo(() => {
    return rawAtmTransactions.filter((tx) => {
      if (tx.transactionAmount > maxAmountSlider) return false;
      if (selectedAtmCity && tx.location !== selectedAtmCity) return false;
      if (activeAtmFilter === "ODD_HOUR" && !tx.flagOddHour) return false;
      if (activeAtmFilter === "RAPID" && !tx.flagRapidSuccession) return false;
      if (activeAtmFilter === "HIGH_AMOUNT" && !tx.flagHighAmount) return false;
      if (activeAtmFilter === "BALANCE_DRAIN" && !tx.flagBalanceDrain) return false;
      return true;
    });
  }, [rawAtmTransactions, maxAmountSlider, selectedAtmCity, activeAtmFilter]);

  const totalAtm = atmTransactions.length;
  const totalVolume = atmTransactions.reduce((acc, t) => acc + t.transactionAmount, 0);
  const flaggedAtm = atmTransactions.filter((t) => t.isFlagged);
  const flaggedCount = flaggedAtm.length;
  const fraudRate = totalAtm > 0 ? (flaggedCount / totalAtm) * 100 : 0;
  const potentialLoss = flaggedAtm.reduce((acc, t) => acc + t.transactionAmount, 0);

  // ATM Specific Flags across filtered scope
  const oddHourCount = atmTransactions.filter((t) => t.flagOddHour).length;
  const rapidSuccessionCount = atmTransactions.filter((t) => t.flagRapidSuccession).length;
  const highAmountCount = atmTransactions.filter((t) => t.flagHighAmount).length;
  const balanceDrainCount = atmTransactions.filter((t) => t.flagBalanceDrain).length;

  const normalDuration = atmTransactions.filter(t => !t.isFlagged);
  const avgNormalDur = normalDuration.length > 0 ? Math.round(normalDuration.reduce((acc, t) => acc + t.transactionDuration, 0) / normalDuration.length) : 0;
  const avgFlaggedDur = flaggedAtm.length > 0 ? Math.round(flaggedAtm.reduce((acc, t) => acc + t.transactionDuration, 0) / flaggedAtm.length) : 0;

  // Top ATM Cities
  const cityAtmMap: Record<string, { total: number; flagged: number; volume: number }> = {};
  atmTransactions.forEach(tx => {
    if (!cityAtmMap[tx.location]) cityAtmMap[tx.location] = { total: 0, flagged: 0, volume: 0 };
    cityAtmMap[tx.location].total++;
    cityAtmMap[tx.location].volume += tx.transactionAmount;
    if (tx.isFlagged) cityAtmMap[tx.location].flagged++;
  });

  const topAtmCities = Object.entries(cityAtmMap)
    .map(([city, d]) => ({ city, ...d, rate: d.total > 0 ? (d.flagged / d.total) * 100 : 0 }))
    .sort((a, b) => b.flagged - a.flagged)
    .slice(0, 8);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="channel-dedicated-dashboard" aria-label="ATM Terminal Surveillance Dashboard">
      {/* ATM Interactive Control Toolbar */}
      <div className="channel-toolbar mono">
        <div className="toolbar-item">
          <label className="toolbar-label">MAX WITHDRAWAL SLIDER: <strong>${maxAmountSlider}</strong></label>
          <input
            type="range"
            min="100"
            max="2000"
            step="50"
            value={maxAmountSlider}
            onChange={(e) => setMaxAmountSlider(Number(e.target.value))}
            className="risk-slider"
          />
        </div>

        <div className="toolbar-item">
          <label className="toolbar-label">VECTOR FILTER:</label>
          <div className="filter-pill-row">
            <button
              type="button"
              className={`pill-btn ${activeAtmFilter === "ALL" ? "active" : ""}`}
              onClick={() => setActiveAtmFilter("ALL")}
            >
              All ATM Vectors
            </button>
            <button
              type="button"
              className={`pill-btn ${activeAtmFilter === "ODD_HOUR" ? "active" : ""}`}
              onClick={() => setActiveAtmFilter(activeAtmFilter === "ODD_HOUR" ? "ALL" : "ODD_HOUR")}
            >
              🌙 Odd Hours
            </button>
            <button
              type="button"
              className={`pill-btn ${activeAtmFilter === "RAPID" ? "active" : ""}`}
              onClick={() => setActiveAtmFilter(activeAtmFilter === "RAPID" ? "ALL" : "RAPID")}
            >
              ⚡ Rapid Swipes (&lt;5m)
            </button>
            <button
              type="button"
              className={`pill-btn ${activeAtmFilter === "BALANCE_DRAIN" ? "active" : ""}`}
              onClick={() => setActiveAtmFilter(activeAtmFilter === "BALANCE_DRAIN" ? "ALL" : "BALANCE_DRAIN")}
            >
              ⚠️ Balance Drain
            </button>
          </div>
        </div>

        {selectedAtmCity && (
          <button
            type="button"
            className="filter-reset-btn"
            onClick={() => setSelectedAtmCity(null)}
          >
            ✕ Clear City [{selectedAtmCity}]
          </button>
        )}
      </div>

      {/* ATM Macro KPI Ribbon */}
      <div className="kpi-cards-grid">
        <div className="kpi-card">
          <span className="mono kpi-label">ATM MONITORED TXNS</span>
          <strong className="kpi-value">{totalAtm.toLocaleString()}</strong>
          <span className="mono kpi-sub">Total Terminal Operations</span>
        </div>

        <div className="kpi-card">
          <span className="mono kpi-label">ATM PROCESSED VALUE</span>
          <strong className="kpi-value">{formatCurrency(totalVolume)}</strong>
          <span className="mono kpi-sub">Cash &amp; Debit Withdrawals</span>
        </div>

        <div className="kpi-card flagged-kpi">
          <span className="mono kpi-label">FLAGGED ATM INCIDENTS</span>
          <strong className="kpi-value flagged-value">{flaggedCount.toLocaleString()}</strong>
          <span className="mono kpi-sub">Multi-Flagged Operations</span>
        </div>

        <div className="kpi-card">
          <span className="mono kpi-label">ATM FRAUD RATE</span>
          <strong className={`kpi-value ${fraudRate > 5 ? "rate-red" : fraudRate >= 2 ? "rate-yellow" : "rate-green"}`}>
            {fraudRate.toFixed(2)}%
          </strong>
          <span className="mono kpi-sub">Terminal Anomaly Ratio</span>
        </div>

        <div className="kpi-card">
          <span className="mono kpi-label">ATM VALUE AT RISK</span>
          <strong className="kpi-value exposure-value">{formatCurrency(potentialLoss)}</strong>
          <span className="mono kpi-sub">Flagged Cash Exposure</span>
        </div>
      </div>

      {/* 2-Column ATM Analytics Row */}
      <div className="exec-charts-grid">
        {/* Visual 1: Specific ATM Anomaly Vector Distribution */}
        <div className="exec-chart-panel">
          <div className="panel-header mono">
            <span className="panel-tag">ATM TELEMETRY • VECTOR ANALYSIS (CLICKABLE)</span>
            <h4>ATM Anomaly Heuristics Distribution</h4>
            <p className="panel-sub">Click any vector below to isolate and filter matching ATM transactions in real time.</p>
          </div>

          <div className="top-flags-list mono">
            <div
              className={`flag-item-row interactive-flag-item ${activeAtmFilter === "ODD_HOUR" ? "flag-active-row" : ""}`}
              onClick={() => setActiveAtmFilter(activeAtmFilter === "ODD_HOUR" ? "ALL" : "ODD_HOUR")}
              title="Click to filter by Odd Hour cash outs"
            >
              <div className="flag-row-top">
                <span className="flag-name">01. Odd-Hour Cash Out (00:00 – 04:00 UTC)</span>
                <span className="flag-count-pill">{oddHourCount} txns (Click)</span>
              </div>
              <div className="flag-progress-track">
                <div className="flag-progress-fill" style={{ width: `${Math.min((oddHourCount / (totalAtm || 1)) * 300, 100)}%` }} />
              </div>
            </div>

            <div
              className={`flag-item-row interactive-flag-item ${activeAtmFilter === "RAPID" ? "flag-active-row" : ""}`}
              onClick={() => setActiveAtmFilter(activeAtmFilter === "RAPID" ? "ALL" : "RAPID")}
              title="Click to filter by Rapid Succession swipes"
            >
              <div className="flag-row-top">
                <span className="flag-name">02. Rapid Succession Swipes (&lt; 5 mins)</span>
                <span className="flag-count-pill">{rapidSuccessionCount} txns (Click)</span>
              </div>
              <div className="flag-progress-track">
                <div className="flag-progress-fill" style={{ width: `${Math.min((rapidSuccessionCount / (totalAtm || 1)) * 300, 100)}%` }} />
              </div>
            </div>

            <div
              className={`flag-item-row interactive-flag-item ${activeAtmFilter === "HIGH_AMOUNT" ? "flag-active-row" : ""}`}
              onClick={() => setActiveAtmFilter(activeAtmFilter === "HIGH_AMOUNT" ? "ALL" : "HIGH_AMOUNT")}
              title="Click to filter by High Withdrawal Amounts"
            >
              <div className="flag-row-top">
                <span className="flag-name">03. High Withdrawal Amount (&gt; 3x Avg)</span>
                <span className="flag-count-pill">{highAmountCount} txns (Click)</span>
              </div>
              <div className="flag-progress-track">
                <div className="flag-progress-fill" style={{ width: `${Math.min((highAmountCount / (totalAtm || 1)) * 300, 100)}%` }} />
              </div>
            </div>

            <div
              className={`flag-item-row interactive-flag-item ${activeAtmFilter === "BALANCE_DRAIN" ? "flag-active-row" : ""}`}
              onClick={() => setActiveAtmFilter(activeAtmFilter === "BALANCE_DRAIN" ? "ALL" : "BALANCE_DRAIN")}
              title="Click to filter by Balance Drain"
            >
              <div className="flag-row-top">
                <span className="flag-name">04. Balance Exhaustion (&gt; 70% Balance)</span>
                <span className="flag-count-pill">{balanceDrainCount} txns (Click)</span>
              </div>
              <div className="flag-progress-track">
                <div className="flag-progress-fill" style={{ width: `${Math.min((balanceDrainCount / (totalAtm || 1)) * 300, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Visual 2: ATM Terminal Session Latency */}
        <div className="exec-chart-panel">
          <div className="panel-header mono">
            <span className="panel-tag">ATM TELEMETRY • SESSION DURATION</span>
            <h4>Physical ATM Session Latency (Seconds)</h4>
            <p className="panel-sub">Evaluating differences in cardholder interaction duration between legitimate and fraudulent operations.</p>
          </div>

          <div className="duration-comparison-list mono">
            <div className="duration-item">
              <div className="dur-top">
                <strong>Clean ATM Transactions Benchmark</strong>
                <span className="dur-delta">Baseline Cardholder Interaction</span>
              </div>
              <div className="dur-bars-grid">
                <div>
                  <span className="dur-label">Mean Duration:</span>
                  <span className="dur-val normal-val">{avgNormalDur} seconds</span>
                </div>
                <div>
                  <span className="dur-label">Profile:</span>
                  <span className="dur-val normal-val">Standard PIN &amp; Dispense</span>
                </div>
              </div>
            </div>

            <div className="duration-item" style={{ borderLeft: "3px solid #ef4444" }}>
              <div className="dur-top">
                <strong className="red-highlight">Flagged ATM Suspicious Incidents</strong>
                <span className="dur-delta red-highlight">Abnormal Interaction Velocity</span>
              </div>
              <div className="dur-bars-grid">
                <div>
                  <span className="dur-label">Mean Duration:</span>
                  <span className="dur-val flagged-val">{avgFlaggedDur} seconds</span>
                </div>
                <div>
                  <span className="dur-label">Anomaly Delta:</span>
                  <span className="dur-val flagged-val">{Math.abs(avgFlaggedDur - avgNormalDur)}s Variance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual 3: Top ATM Cities with Click-to-Filter */}
      <div className="exec-chart-panel">
        <div className="panel-header mono">
          <span className="panel-tag">ATM GEOGRAPHY • TERMINAL HOTSPOTS (CLICK TO ISOLATE CITY)</span>
          <h4>Top Geographic Hotspots for ATM Terminal Anomalies</h4>
          <p className="panel-sub">Click any terminal cluster to filter the entire ATM dashboard to that specific city.</p>
        </div>

        <div className="merchants-grid mono">
          {topAtmCities.map((city, idx) => {
            const isCityActive = selectedAtmCity === city.city;
            return (
              <div
                key={city.city}
                className={`merchant-item interactive-merchant ${isCityActive ? "active-merchant-card" : ""}`}
                onClick={() => setSelectedAtmCity(isCityActive ? null : city.city)}
                title={`Click to isolate ${city.city} ATM operations`}
              >
                <div className="merchant-header">
                  <span className="m-idx">#{idx + 1}</span>
                  <strong className="m-id">{city.city} Terminals {isCityActive ? "★ ACTIVE" : ""}</strong>
                  <span className="m-rate-tag">{city.rate.toFixed(1)}% Incident Rate</span>
                </div>
                <div className="m-bar-track">
                  <div className="m-bar-fill" style={{ width: `${Math.min(city.rate * 8, 100)}%` }} />
                </div>
                <div className="m-footer">
                  <span>{city.flagged} Flagged / {city.total} Operations (Click)</span>
                  <span className="red-highlight">{formatCurrency(city.volume)} Processed</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
