"use client";

import React, { useState, useMemo } from "react";
import { FlaggedTransaction } from "@/lib/anti-fraud";

interface CardTypeAnalysisDashboardProps {
  transactions: FlaggedTransaction[];
  channelRiskMatrix: {
    ATM: { Low: number; Medium: number; High: number };
    Branch: { Low: number; Medium: number; High: number };
    Online: { Low: number; Medium: number; High: number };
  };
}

export function CardTypeAnalysisDashboard({ transactions, channelRiskMatrix }: CardTypeAnalysisDashboardProps) {
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<"ALL" | "Debit" | "Credit">("ALL");
  const [selectedMatrixCell, setSelectedMatrixCell] = useState<{ channel: "ATM" | "Branch" | "Online"; risk: "Low" | "Medium" | "High" } | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (selectedTypeFilter !== "ALL" && t.transactionType !== selectedTypeFilter) return false;
      if (selectedMatrixCell) {
        if (t.channel !== selectedMatrixCell.channel || t.riskLevel !== selectedMatrixCell.risk) return false;
      }
      return true;
    });
  }, [transactions, selectedTypeFilter, selectedMatrixCell]);

  const debitTxs = filteredTransactions.filter((t) => t.transactionType === "Debit");
  const creditTxs = filteredTransactions.filter((t) => t.transactionType === "Credit");

  const debitFlagged = debitTxs.filter((t) => t.isFlagged);
  const creditFlagged = creditTxs.filter((t) => t.isFlagged);

  const debitTotal = debitTxs.length;
  const creditTotal = creditTxs.length;

  const debitVolume = debitTxs.reduce((acc, t) => acc + t.transactionAmount, 0);
  const creditVolume = creditTxs.reduce((acc, t) => acc + t.transactionAmount, 0);

  const debitExposure = debitFlagged.reduce((acc, t) => acc + t.transactionAmount, 0);
  const creditExposure = creditFlagged.reduce((acc, t) => acc + t.transactionAmount, 0);

  const debitRate = debitTotal > 0 ? (debitFlagged.length / debitTotal) * 100 : 0;
  const creditRate = creditTotal > 0 ? (creditFlagged.length / creditTotal) * 100 : 0;

  const debitAvgTicket = debitTotal > 0 ? Math.round(debitVolume / debitTotal) : 0;
  const creditAvgTicket = creditTotal > 0 ? Math.round(creditVolume / creditTotal) : 0;

  const allMatrixValues = [
    channelRiskMatrix.ATM.Low, channelRiskMatrix.ATM.Medium, channelRiskMatrix.ATM.High,
    channelRiskMatrix.Branch.Low, channelRiskMatrix.Branch.Medium, channelRiskMatrix.Branch.High,
    channelRiskMatrix.Online.Low, channelRiskMatrix.Online.Medium, channelRiskMatrix.Online.High,
  ];
  const maxMatrixCell = Math.max(...allMatrixValues, 1);

  const getHeatmapBg = (val: number, isHighRisk: boolean, isSelected: boolean) => {
    if (isSelected) {
      return "rgba(2, 132, 199, 0.4)";
    }
    const intensity = Math.min((val / maxMatrixCell) * 0.45, 0.45);
    if (isHighRisk) {
      return `rgba(239, 68, 68, ${0.15 + intensity})`;
    }
    return `rgba(2, 132, 199, ${0.08 + intensity * 0.5})`;
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="channel-dedicated-dashboard" aria-label="Payment Instrument (Debit vs Credit) Dashboard">
      {/* Instrument Slicer Controls */}
      <div className="channel-toolbar mono">
        <div className="toolbar-item">
          <label className="toolbar-label">INSTRUMENT TOGGLE:</label>
          <div className="filter-pill-row">
            <button
              type="button"
              className={`pill-btn ${selectedTypeFilter === "ALL" ? "active" : ""}`}
              onClick={() => setSelectedTypeFilter("ALL")}
            >
              All Instruments
            </button>
            <button
              type="button"
              className={`pill-btn ${selectedTypeFilter === "Debit" ? "active" : ""}`}
              onClick={() => setSelectedTypeFilter("Debit")}
            >
              💳 Debit Cards
            </button>
            <button
              type="button"
              className={`pill-btn ${selectedTypeFilter === "Credit" ? "active" : ""}`}
              onClick={() => setSelectedTypeFilter("Credit")}
            >
              💳 Credit Cards
            </button>
          </div>
        </div>

        {selectedMatrixCell && (
          <button
            type="button"
            className="filter-reset-btn"
            onClick={() => setSelectedMatrixCell(null)}
          >
            ✕ Clear Matrix Filter [{selectedMatrixCell.channel} × {selectedMatrixCell.risk}]
          </button>
        )}
      </div>

      {/* Instrument Comparison Ribbon */}
      <div className="kpi-cards-grid">
        <div
          className={`kpi-card interactive-kpi ${selectedTypeFilter === "Debit" ? "kpi-active-ring" : ""}`}
          onClick={() => setSelectedTypeFilter(selectedTypeFilter === "Debit" ? "ALL" : "Debit")}
        >
          <span className="mono kpi-label">DEBIT CARD VOLUME (CLICK)</span>
          <strong className="kpi-value">{debitTotal.toLocaleString()} Txns</strong>
          <span className="mono kpi-sub">{formatCurrency(debitVolume)} Processed</span>
        </div>

        <div
          className={`kpi-card interactive-kpi ${selectedTypeFilter === "Credit" ? "kpi-active-ring" : ""}`}
          onClick={() => setSelectedTypeFilter(selectedTypeFilter === "Credit" ? "ALL" : "Credit")}
        >
          <span className="mono kpi-label">CREDIT CARD VOLUME (CLICK)</span>
          <strong className="kpi-value">{creditTotal.toLocaleString()} Txns</strong>
          <span className="mono kpi-sub">{formatCurrency(creditVolume)} Processed</span>
        </div>

        <div className="kpi-card flagged-kpi">
          <span className="mono kpi-label">DEBIT FRAUD INCIDENCE</span>
          <strong className={`kpi-value ${debitRate > 5 ? "rate-red" : debitRate >= 2 ? "rate-yellow" : "rate-green"}`}>
            {debitRate.toFixed(2)}%
          </strong>
          <span className="mono kpi-sub">{debitFlagged.length} Flagged Incidents</span>
        </div>

        <div className="kpi-card flagged-kpi">
          <span className="mono kpi-label">CREDIT FRAUD INCIDENCE</span>
          <strong className={`kpi-value ${creditRate > 5 ? "rate-red" : creditRate >= 2 ? "rate-yellow" : "rate-green"}`}>
            {creditRate.toFixed(2)}%
          </strong>
          <span className="mono kpi-sub">{creditFlagged.length} Flagged Incidents</span>
        </div>

        <div className="kpi-card">
          <span className="mono kpi-label">TOTAL CARDS AT RISK</span>
          <strong className="kpi-value exposure-value">{formatCurrency(debitExposure + creditExposure)}</strong>
          <span className="mono kpi-sub">Combined Card Exposure</span>
        </div>
      </div>

      {/* 2-Column Row: Detailed Instrument Cards + Channel Cross Matrix */}
      <div className="exec-charts-grid">
        {/* Visual 1: Debit vs Credit Comparative Profiles */}
        <div className="exec-chart-panel">
          <div className="panel-header mono">
            <span className="panel-tag">INSTRUMENT PROFILING • VULNERABILITY MATRIX</span>
            <h4>Debit vs Credit Card Behavioral Telemetry</h4>
            <p className="panel-sub">Evaluating ticket sizes, financing velocities, and balance exhaustion across payment rails.</p>
          </div>

          <div className="type-comparison-cards mono">
            {/* Debit Card */}
            <div
              className={`type-card interactive-type-card ${selectedTypeFilter === "Debit" ? "active-type-card" : ""}`}
              onClick={() => setSelectedTypeFilter(selectedTypeFilter === "Debit" ? "ALL" : "Debit")}
            >
              <div className="type-card-top">
                <span className="type-name">DEBIT CARD RAIL (DIRECT SETTLEMENT)</span>
                <span className="type-pill">High Velocity (Click)</span>
              </div>
              <div className="type-stats-grid">
                <div>
                  <span className="t-stat-label">Total Volume:</span>
                  <strong>{debitTotal.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="t-stat-label">Mean Ticket:</span>
                  <strong>${debitAvgTicket}</strong>
                </div>
                <div>
                  <span className="t-stat-label">Exposure Value:</span>
                  <strong className="red-highlight">{formatCurrency(debitExposure)}</strong>
                </div>
              </div>
              <div className="type-progress-track">
                <div className="type-progress-fill" style={{ width: `${Math.min(debitRate * 8, 100)}%` }} />
              </div>
            </div>

            {/* Credit Card */}
            <div
              className={`type-card interactive-type-card ${selectedTypeFilter === "Credit" ? "active-type-card" : ""}`}
              onClick={() => setSelectedTypeFilter(selectedTypeFilter === "Credit" ? "ALL" : "Credit")}
            >
              <div className="type-card-top">
                <span className="type-name">CREDIT CARD RAIL (REVOLVING LINE)</span>
                <span className="type-pill">Higher Exposure (Click)</span>
              </div>
              <div className="type-stats-grid">
                <div>
                  <span className="t-stat-label">Total Volume:</span>
                  <strong>{creditTotal.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="t-stat-label">Mean Ticket:</span>
                  <strong>${creditAvgTicket}</strong>
                </div>
                <div>
                  <span className="t-stat-label">Exposure Value:</span>
                  <strong className="red-highlight">{formatCurrency(creditExposure)}</strong>
                </div>
              </div>
              <div className="type-progress-track">
                <div className="type-progress-fill credit" style={{ width: `${Math.min(creditRate * 8, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Visual 2: Matrix Heatmap with Click-to-Filter Cells */}
        <div className="exec-chart-panel">
          <div className="panel-header mono">
            <div className="panel-header-flex">
              <div>
                <span className="panel-tag">CROSS-TABULATION • HEATMAP MATRIX (CLICK CELL)</span>
                <h4>Channel × Risk Tier Severity Matrix</h4>
              </div>
              {selectedMatrixCell && (
                <button
                  type="button"
                  className="mini-clear-btn"
                  onClick={() => setSelectedMatrixCell(null)}
                >
                  ✕ Reset Cell
                </button>
              )}
            </div>
            <p className="panel-sub">Click any cell below to filter and inspect the exact matching transactions.</p>
          </div>

          <div className="matrix-table-wrapper mono">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th>Channel Topology</th>
                  <th>Low Risk (0–1)</th>
                  <th>Medium Risk (2–3)</th>
                  <th>High Risk (&gt;= 4)</th>
                </tr>
              </thead>
              <tbody>
                {(["ATM", "Branch", "Online"] as const).map((ch) => (
                  <tr key={ch}>
                    <td className="ch-cell"><strong>{ch} Terminal / Hub</strong></td>
                    {(["Low", "Medium", "High"] as const).map((risk) => {
                      const isCellSelected = selectedMatrixCell?.channel === ch && selectedMatrixCell?.risk === risk;
                      const val = channelRiskMatrix[ch][risk];
                      return (
                        <td
                          key={risk}
                          className={`matrix-interactive-cell ${isCellSelected ? "cell-selected" : ""}`}
                          style={{ backgroundColor: getHeatmapBg(val, risk !== "Low", isCellSelected) }}
                          onClick={() => setSelectedMatrixCell(isCellSelected ? null : { channel: ch, risk })}
                          title={`Click to filter ${ch} × ${risk} Risk`}
                        >
                          <strong className={risk === "High" ? "red-highlight" : risk === "Medium" ? "yellow-text" : ""}>
                            {val}
                          </strong>
                          {isCellSelected && <span className="cell-active-indicator">★</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
