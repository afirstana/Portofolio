"use client";

import React, { useState, useMemo } from "react";
import { FlaggedTransaction, MerchantRiskMetric } from "@/lib/anti-fraud";

interface OnlineChannelDashboardProps {
  transactions: FlaggedTransaction[];
  topMerchants: MerchantRiskMetric[];
}

export function OnlineChannelDashboard({ transactions, topMerchants }: OnlineChannelDashboardProps) {
  const [minLoginFilter, setMinLoginFilter] = useState<number>(1);
  const [activeOnlineFlag, setActiveOnlineFlag] = useState<string | null>(null);
  const [merchantSearch, setMerchantSearch] = useState<string>("");
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null);

  const rawOnlineTransactions = useMemo(() => transactions.filter((t) => t.channel === "Online"), [transactions]);

  // Interactive filtering
  const onlineTransactions = useMemo(() => {
    return rawOnlineTransactions.filter((tx) => {
      if (tx.loginAttempts < minLoginFilter) return false;
      if (selectedMerchantId && tx.merchantId !== selectedMerchantId) return false;
      if (activeOnlineFlag && !tx.flagReasons.some(f => f.toLowerCase().includes(activeOnlineFlag.toLowerCase()))) return false;
      return true;
    });
  }, [rawOnlineTransactions, minLoginFilter, selectedMerchantId, activeOnlineFlag]);

  const totalOnline = onlineTransactions.length;
  const totalVolume = onlineTransactions.reduce((acc, t) => acc + t.transactionAmount, 0);
  const flaggedOnline = onlineTransactions.filter((t) => t.isFlagged);
  const flaggedCount = flaggedOnline.length;
  const fraudRate = totalOnline > 0 ? (flaggedCount / totalOnline) * 100 : 0;
  const potentialLoss = flaggedOnline.reduce((acc, t) => acc + t.transactionAmount, 0);

  // Digital Specific Flags
  const failedLoginsCount = onlineTransactions.filter((t) => t.flagLoginAttempts).length;
  const newDeviceCount = onlineTransactions.filter((t) => t.flagNewDeviceLocation).length;
  const rapidBotCount = onlineTransactions.filter((t) => t.flagRapidSuccession).length;
  const balanceDrainCount = onlineTransactions.filter((t) => t.flagBalanceDrain).length;
  const oddHourCount = onlineTransactions.filter((t) => t.flagOddHour).length;

  const filteredMerchants = useMemo(() => {
    if (!merchantSearch.trim()) return topMerchants;
    return topMerchants.filter(m => m.merchantId.toLowerCase().includes(merchantSearch.toLowerCase()));
  }, [topMerchants, merchantSearch]);

  const maxMerchantFlagged = Math.max(...topMerchants.map((m) => m.flagged), 1);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="channel-dedicated-dashboard" aria-label="Online & Digital Banking Dashboard">
      {/* Interactive Controls Bar */}
      <div className="channel-toolbar mono">
        <div className="toolbar-item">
          <label className="toolbar-label">LOGIN ATTEMPTS THRESHOLD: <strong>&gt;= {minLoginFilter}x</strong></label>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={minLoginFilter}
            onChange={(e) => setMinLoginFilter(Number(e.target.value))}
            className="risk-slider"
          />
        </div>

        <div className="toolbar-item">
          <label className="toolbar-label">CYBER HEURISTIC FILTER:</label>
          <div className="filter-pill-row">
            <button
              type="button"
              className={`pill-btn ${activeOnlineFlag === null ? "active" : ""}`}
              onClick={() => setActiveOnlineFlag(null)}
            >
              All Cyber Vectors
            </button>
            <button
              type="button"
              className={`pill-btn ${activeOnlineFlag === "Logins" ? "active" : ""}`}
              onClick={() => setActiveOnlineFlag(activeOnlineFlag === "Logins" ? null : "Logins")}
            >
              🔑 Failed Logins
            </button>
            <button
              type="button"
              className={`pill-btn ${activeOnlineFlag === "Device" ? "active" : ""}`}
              onClick={() => setActiveOnlineFlag(activeOnlineFlag === "Device" ? null : "Device")}
            >
              📱 New Device / IP
            </button>
            <button
              type="button"
              className={`pill-btn ${activeOnlineFlag === "Rapid" ? "active" : ""}`}
              onClick={() => setActiveOnlineFlag(activeOnlineFlag === "Rapid" ? null : "Rapid")}
            >
              🤖 Bot Checkout (&lt;5m)
            </button>
          </div>
        </div>

        {selectedMerchantId && (
          <button
            type="button"
            className="filter-reset-btn"
            onClick={() => setSelectedMerchantId(null)}
          >
            ✕ Clear Merchant [{selectedMerchantId}]
          </button>
        )}
      </div>

      {/* Digital Macro KPI Ribbon */}
      <div className="kpi-cards-grid">
        <div className="kpi-card">
          <span className="mono kpi-label">ONLINE DIGITAL TXNS</span>
          <strong className="kpi-value">{totalOnline.toLocaleString()}</strong>
          <span className="mono kpi-sub">Web &amp; Mobile Banking API</span>
        </div>

        <div className="kpi-card">
          <span className="mono kpi-label">DIGITAL PROCESSED VALUE</span>
          <strong className="kpi-value">{formatCurrency(totalVolume)}</strong>
          <span className="mono kpi-sub">E-Commerce &amp; Wire Transfers</span>
        </div>

        <div className="kpi-card flagged-kpi">
          <span className="mono kpi-label">FLAGGED DIGITAL INCIDENTS</span>
          <strong className="kpi-value flagged-value">{flaggedCount.toLocaleString()}</strong>
          <span className="mono kpi-sub">Cyber &amp; Bot Escalations</span>
        </div>

        <div className="kpi-card">
          <span className="mono kpi-label">DIGITAL FRAUD RATE</span>
          <strong className={`kpi-value ${fraudRate > 5 ? "rate-red" : fraudRate >= 2 ? "rate-yellow" : "rate-green"}`}>
            {fraudRate.toFixed(2)}%
          </strong>
          <span className="mono kpi-sub">Online Anomaly Rate</span>
        </div>

        <div className="kpi-card">
          <span className="mono kpi-label">DIGITAL VALUE AT RISK</span>
          <strong className="kpi-value exposure-value">{formatCurrency(potentialLoss)}</strong>
          <span className="mono kpi-sub">Flagged Cyber Exposure</span>
        </div>
      </div>

      {/* 2-Column Digital Analytics Row */}
      <div className="exec-charts-grid">
        {/* Visual 1: Cyber Anomaly Heuristics */}
        <div className="exec-chart-panel">
          <div className="panel-header mono">
            <span className="panel-tag">DIGITAL SURVEILLANCE • CYBER VECTORS (CLICK TO FILTER)</span>
            <h4>Online Anomaly Attack Vector Hierarchy</h4>
            <p className="panel-sub">Click any vector below to isolate matching digital transactions in real time.</p>
          </div>

          <div className="top-flags-list mono">
            <div
              className={`flag-item-row interactive-flag-item ${activeOnlineFlag === "Logins" ? "flag-active-row" : ""}`}
              onClick={() => setActiveOnlineFlag(activeOnlineFlag === "Logins" ? null : "Logins")}
            >
              <div className="flag-row-top">
                <span className="flag-name">01. Failed Login Spikes (LoginAttempts &gt;= 3)</span>
                <span className="flag-count-pill">{failedLoginsCount} txns (Click)</span>
              </div>
              <div className="flag-progress-track">
                <div className="flag-progress-fill" style={{ width: `${Math.min((failedLoginsCount / (totalOnline || 1)) * 300, 100)}%` }} />
              </div>
            </div>

            <div
              className={`flag-item-row interactive-flag-item ${activeOnlineFlag === "Device" ? "flag-active-row" : ""}`}
              onClick={() => setActiveOnlineFlag(activeOnlineFlag === "Device" ? null : "Device")}
            >
              <div className="flag-row-top">
                <span className="flag-name">02. New Device ID / Location Pairing</span>
                <span className="flag-count-pill">{newDeviceCount} txns (Click)</span>
              </div>
              <div className="flag-progress-track">
                <div className="flag-progress-fill" style={{ width: `${Math.min((newDeviceCount / (totalOnline || 1)) * 300, 100)}%` }} />
              </div>
            </div>

            <div
              className={`flag-item-row interactive-flag-item ${activeOnlineFlag === "Rapid" ? "flag-active-row" : ""}`}
              onClick={() => setActiveOnlineFlag(activeOnlineFlag === "Rapid" ? null : "Rapid")}
            >
              <div className="flag-row-top">
                <span className="flag-name">03. Rapid Succession Bot Velocity (&lt; 5 mins)</span>
                <span className="flag-count-pill">{rapidBotCount} txns (Click)</span>
              </div>
              <div className="flag-progress-track">
                <div className="flag-progress-fill" style={{ width: `${Math.min((rapidBotCount / (totalOnline || 1)) * 300, 100)}%` }} />
              </div>
            </div>

            <div
              className={`flag-item-row interactive-flag-item ${activeOnlineFlag === "Drain" ? "flag-active-row" : ""}`}
              onClick={() => setActiveOnlineFlag(activeOnlineFlag === "Drain" ? null : "Drain")}
            >
              <div className="flag-row-top">
                <span className="flag-name">04. Balance Drain Over-Expenditure (&gt; 70%)</span>
                <span className="flag-count-pill">{balanceDrainCount} txns (Click)</span>
              </div>
              <div className="flag-progress-track">
                <div className="flag-progress-fill" style={{ width: `${Math.min((balanceDrainCount / (totalOnline || 1)) * 300, 100)}%` }} />
              </div>
            </div>

            <div
              className={`flag-item-row interactive-flag-item ${activeOnlineFlag === "Odd Hour" ? "flag-active-row" : ""}`}
              onClick={() => setActiveOnlineFlag(activeOnlineFlag === "Odd Hour" ? null : "Odd Hour")}
            >
              <div className="flag-row-top">
                <span className="flag-name">05. Off-Hours Digital Activity (00:00 – 04:00 UTC)</span>
                <span className="flag-count-pill">{oddHourCount} txns (Click)</span>
              </div>
              <div className="flag-progress-track">
                <div className="flag-progress-fill" style={{ width: `${Math.min((oddHourCount / (totalOnline || 1)) * 300, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Visual 2: Authentication Security Health Box */}
        <div className="exec-chart-panel">
          <div className="panel-header mono">
            <span className="panel-tag">DIGITAL SURVEILLANCE • AUTHENTICATION HEALTH</span>
            <h4>Digital Authentication Security &amp; Bot Defense</h4>
            <p className="panel-sub">Real-time inspection of credential retry spikes and bot velocity telemetry.</p>
          </div>

          <div className="scatter-drain-box mono">
            <div className="scatter-quadrant-header">
              <span className="quad-tag high-drain">⚠️ HIGH-RISK CREDENTIAL STUFFING (&gt;= 3 ATTEMPTS)</span>
              <span className="quad-tag normal">CLEAN AUTHENTICATION (1 ATTEMPT)</span>
            </div>
            <div className="drain-bars-demo">
              <div className="drain-demo-item">
                <span>Account: ACC-1014</span>
                <span>Logins: 4 failed attempts</span>
                <span className="red-badge">ATO RISK FLAGGED</span>
              </div>
              <div className="drain-demo-item">
                <span>Account: ACC-1088</span>
                <span>Logins: 5 failed attempts</span>
                <span className="red-badge">ATO RISK FLAGGED</span>
              </div>
              <div className="drain-demo-item safe">
                <span>Account: ACC-1240</span>
                <span>Logins: 1 successful attempt</span>
                <span className="green-badge">CLEAN SESSION</span>
              </div>
            </div>
            <p className="scatter-footnote">
              *The SQL engine automatically sets `flag_login_attempts = TRUE` on any digital transaction where authentication retries equal or exceed 3.
            </p>
          </div>
        </div>
      </div>

      {/* Visual 3: Top Flagged E-Commerce & Online Merchants */}
      <div className="exec-chart-panel">
        <div className="panel-header mono">
          <div className="panel-header-flex">
            <div>
              <span className="panel-tag">DIGITAL SURVEILLANCE • THIRD-PARTY MERCHANTS (CLICK TO ISOLATE)</span>
              <h4>Top Online Merchants with Highest Anomaly Incidents</h4>
            </div>
            <input
              type="text"
              className="city-search-input mono"
              placeholder="Search merchant ID..."
              value={merchantSearch}
              onChange={(e) => setMerchantSearch(e.target.value)}
            />
          </div>
          <p className="panel-sub">Click any third-party merchant below to isolate operations and review chargeback exposure.</p>
        </div>

        <div className="merchants-grid mono">
          {filteredMerchants.map((m, idx) => {
            const isMerchantActive = selectedMerchantId === m.merchantId;
            const widthPct = Math.min((m.flagged / maxMerchantFlagged) * 100, 100);
            return (
              <div
                key={m.merchantId}
                className={`merchant-item interactive-merchant ${isMerchantActive ? "active-merchant-card" : ""}`}
                onClick={() => setSelectedMerchantId(isMerchantActive ? null : m.merchantId)}
                title={`Click to isolate ${m.merchantId} transactions`}
              >
                <div className="merchant-header">
                  <span className="m-idx">#{idx + 1}</span>
                  <strong className="m-id">{m.merchantId} {isMerchantActive ? "★ ACTIVE" : ""}</strong>
                  <span className="m-rate-tag">{m.fraudRate.toFixed(1)}% Incident Rate</span>
                </div>
                <div className="m-bar-track">
                  <div className="m-bar-fill" style={{ width: `${widthPct}%` }} />
                </div>
                <div className="m-footer">
                  <span>{m.flagged} Flagged / {m.total} Operations (Click)</span>
                  <span className="red-highlight">${m.exposureAmount.toLocaleString()} Exposure</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
