"use client";

import React from "react";
import { FlaggedTransaction } from "@/lib/anti-fraud";

interface BranchChannelDashboardProps {
  transactions: FlaggedTransaction[];
}

export function BranchChannelDashboard({ transactions }: BranchChannelDashboardProps) {
  const branchTransactions = transactions.filter((t) => t.channel === "Branch");
  const totalBranch = branchTransactions.length;
  const totalVolume = branchTransactions.reduce((acc, t) => acc + t.transactionAmount, 0);
  const flaggedBranch = branchTransactions.filter((t) => t.isFlagged);
  const flaggedCount = flaggedBranch.length;
  const fraudRate = totalBranch > 0 ? (flaggedCount / totalBranch) * 100 : 0;
  const potentialLoss = flaggedBranch.reduce((acc, t) => acc + t.transactionAmount, 0);

  // High amount in Branch
  const highAmountCount = branchTransactions.filter((t) => t.flagHighAmount).length;
  const balanceDrainCount = branchTransactions.filter((t) => t.flagBalanceDrain).length;
  const avgBranchAmount = totalBranch > 0 ? Math.round(totalVolume / totalBranch) : 0;
  const avgFlaggedAmount = flaggedCount > 0 ? Math.round(potentialLoss / flaggedCount) : 0;

  // Occupation breakdown in Branch
  const occBranchMap: Record<string, { total: number; flagged: number; volume: number }> = {
    Doctor: { total: 0, flagged: 0, volume: 0 },
    Engineer: { total: 0, flagged: 0, volume: 0 },
    Retired: { total: 0, flagged: 0, volume: 0 },
    Student: { total: 0, flagged: 0, volume: 0 }
  };
  branchTransactions.forEach(tx => {
    if (occBranchMap[tx.customerOccupation]) {
      occBranchMap[tx.customerOccupation].total++;
      occBranchMap[tx.customerOccupation].volume += tx.transactionAmount;
      if (tx.isFlagged) occBranchMap[tx.customerOccupation].flagged++;
    }
  });

  const occList = Object.entries(occBranchMap).map(([occupation, d]) => ({
    occupation,
    ...d,
    fraudRate: d.total > 0 ? (d.flagged / d.total) * 100 : 0
  }));

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="channel-dedicated-dashboard" aria-label="Bank Branch Surveillance Dashboard">
      {/* Branch Macro KPI Ribbon */}
      <div className="kpi-cards-grid">
        <div className="kpi-card">
          <span className="mono kpi-label">BRANCH MONITORED TXNS</span>
          <strong className="kpi-value">{totalBranch.toLocaleString()}</strong>
          <span className="mono kpi-sub">In-Person Counter Operations</span>
        </div>

        <div className="kpi-card">
          <span className="mono kpi-label">TELLER PROCESSED VOLUME</span>
          <strong className="kpi-value">{formatCurrency(totalVolume)}</strong>
          <span className="mono kpi-sub">Over-the-Counter Settlement</span>
        </div>

        <div className="kpi-card flagged-kpi">
          <span className="mono kpi-label">FLAGGED BRANCH TXNS</span>
          <strong className="kpi-value flagged-value">{flaggedCount.toLocaleString()}</strong>
          <span className="mono kpi-sub">Counter Anomaly Escalations</span>
        </div>

        <div className="kpi-card">
          <span className="mono kpi-label">BRANCH FRAUD RATE</span>
          <strong className={`kpi-value ${fraudRate > 5 ? "rate-red" : fraudRate >= 2 ? "rate-yellow" : "rate-green"}`}>
            {fraudRate.toFixed(2)}%
          </strong>
          <span className="mono kpi-sub">Counter Escalation Ratio</span>
        </div>

        <div className="kpi-card">
          <span className="mono kpi-label">BRANCH VALUE AT RISK</span>
          <strong className="kpi-value exposure-value">{formatCurrency(potentialLoss)}</strong>
          <span className="mono kpi-sub">Flagged Counter Exposure</span>
        </div>
      </div>

      {/* 2-Column Branch Analytics Row */}
      <div className="exec-charts-grid">
        {/* Visual 1: Branch High-Ticket Size Comparison */}
        <div className="exec-chart-panel">
          <div className="panel-header mono">
            <span className="panel-tag">BRANCH SURVEILLANCE • TICKET SIZES</span>
            <h4>Average Branch Ticket Size vs Anomaly Spikes</h4>
            <p className="panel-sub">Comparing standard teller counter ticket sizes against high-risk withdrawal surges.</p>
          </div>

          <div className="duration-comparison-list mono">
            <div className="duration-item">
              <div className="dur-top">
                <strong>Standard Branch Ticket Average</strong>
                <span className="dur-delta">Normal In-Person Counter Flow</span>
              </div>
              <div className="dur-bars-grid">
                <div>
                  <span className="dur-label">Mean Amount:</span>
                  <span className="dur-val normal-val">${avgBranchAmount}</span>
                </div>
                <div>
                  <span className="dur-label">Baseline:</span>
                  <span className="dur-val normal-val">Expected Teller Threshold</span>
                </div>
              </div>
            </div>

            <div className="duration-item" style={{ borderLeft: "3px solid #ef4444" }}>
              <div className="dur-top">
                <strong className="red-highlight">Flagged Counter Transaction Average</strong>
                <span className="dur-delta red-highlight">High-Value Teller Surge</span>
              </div>
              <div className="dur-bars-grid">
                <div>
                  <span className="dur-label">Mean Amount:</span>
                  <span className="dur-val flagged-val">${avgFlaggedAmount}</span>
                </div>
                <div>
                  <span className="dur-label">Surge Multiple:</span>
                  <span className="dur-val flagged-val">
                    {(avgFlaggedAmount / Math.max(avgBranchAmount, 1)).toFixed(1)}x Normal Ticket
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual 2: Occupation Risk at Physical Branches */}
        <div className="exec-chart-panel">
          <div className="panel-header mono">
            <span className="panel-tag">BRANCH SURVEILLANCE • OCCUPATION RISK</span>
            <h4>Demographic Occupation Vulnerability in Branches</h4>
            <p className="panel-sub">Evaluating social engineering and identity theft vulnerabilities across counter customers.</p>
          </div>

          <div className="occupation-cards-grid mono">
            {occList.map((occ) => (
              <div key={occ.occupation} className="occ-card">
                <div className="occ-header">
                  <strong className="occ-title">{occ.occupation}</strong>
                  <span className="occ-rate-pill red-badge">{occ.fraudRate.toFixed(2)}% Flagged</span>
                </div>
                <div className="occ-stats-sub">
                  <span>{occ.flagged} Flagged / {occ.total} Total</span>
                  <span className="red-highlight">{formatCurrency(occ.volume)}</span>
                </div>
                <div className="occ-progress-track">
                  <div className="occ-progress-fill" style={{ width: `${Math.min(occ.fraudRate * 8, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visual 3: Branch Anomaly Heuristics Summary */}
      <div className="exec-chart-panel">
        <div className="panel-header mono">
          <span className="panel-tag">BRANCH SURVEILLANCE • HEURISTIC SUMMARY</span>
          <h4>Branch Audit Flags Breakdown</h4>
          <p className="panel-sub">Dominant flag reasons observed during in-person banking operations.</p>
        </div>

        <div className="top-flags-list mono">
          <div className="flag-item-row">
            <div className="flag-row-top">
              <span className="flag-name">High Ticket Size (&gt; 3x Historical Average)</span>
              <span className="flag-count-pill">{highAmountCount} incidents</span>
            </div>
            <div className="flag-progress-track">
              <div className="flag-progress-fill" style={{ width: `${Math.min((highAmountCount / (totalBranch || 1)) * 300, 100)}%` }} />
            </div>
          </div>

          <div className="flag-item-row">
            <div className="flag-row-top">
              <span className="flag-name">Balance Drain Surge (&gt; 70% Account Balance)</span>
              <span className="flag-count-pill">{balanceDrainCount} incidents</span>
            </div>
            <div className="flag-progress-track">
              <div className="flag-progress-fill" style={{ width: `${Math.min((balanceDrainCount / (totalBranch || 1)) * 300, 100)}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
