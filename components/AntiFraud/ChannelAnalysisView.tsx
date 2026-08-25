"use client";

import React from "react";
import { ChannelMetric, MerchantRiskMetric } from "@/lib/anti-fraud";

interface ChannelAnalysisViewProps {
  channelMetrics: ChannelMetric[];
  typeMetrics: {
    Debit: { total: number; flagged: number; fraudRate: number };
    Credit: { total: number; flagged: number; fraudRate: number };
  };
  channelRiskMatrix: {
    ATM: { Low: number; Medium: number; High: number };
    Branch: { Low: number; Medium: number; High: number };
    Online: { Low: number; Medium: number; High: number };
  };
  topMerchants: MerchantRiskMetric[];
}

export function ChannelAnalysisView({
  channelMetrics,
  typeMetrics,
  channelRiskMatrix,
  topMerchants
}: ChannelAnalysisViewProps) {
  const maxChannelTotal = Math.max(...channelMetrics.map((c) => c.total), 1);
  const maxMerchantFlagged = Math.max(...topMerchants.map((m) => m.flagged), 1);

  // Maximum cell in matrix for heat intensity calculation
  const allMatrixValues = [
    channelRiskMatrix.ATM.Low, channelRiskMatrix.ATM.Medium, channelRiskMatrix.ATM.High,
    channelRiskMatrix.Branch.Low, channelRiskMatrix.Branch.Medium, channelRiskMatrix.Branch.High,
    channelRiskMatrix.Online.Low, channelRiskMatrix.Online.Medium, channelRiskMatrix.Online.High,
  ];
  const maxMatrixCell = Math.max(...allMatrixValues, 1);

  const getHeatmapBg = (val: number, isHighRisk: boolean) => {
    const intensity = Math.min((val / maxMatrixCell) * 0.45, 0.45);
    if (isHighRisk) {
      return `rgba(239, 68, 68, ${0.15 + intensity})`;
    }
    return `rgba(2, 132, 199, ${0.08 + intensity * 0.5})`;
  };

  return (
    <div className="channel-analysis-view" aria-label="Page 2: Channel & Transaction Type Analysis">
      {/* Upper Grid: Channel Clustered Bars + Debit/Credit Comparison */}
      <div className="channel-upper-grid">
        {/* Visual 1: Fraud Rate per Channel */}
        <div className="exec-chart-panel">
          <div className="panel-header mono">
            <span className="panel-tag">VISUAL 01 • CHANNEL TELEMETRY</span>
            <h4>Fraud Incidence Rate per Channel</h4>
            <p className="panel-sub">Perbandingan volume transaksi total vs transaksi mencurigakan di ATM, Branch, dan Online.</p>
          </div>

          <div className="channel-clustered-bars">
            {channelMetrics.map((ch) => {
              const totalWidthPct = (ch.total / maxChannelTotal) * 100;
              const flaggedWidthPct = (ch.flagged / maxChannelTotal) * 100;
              return (
                <div key={ch.channel} className="channel-bar-group">
                  <div className="channel-info-row mono">
                    <strong className="channel-title">{ch.channel} Channel</strong>
                    <span className="channel-rate-badge red-badge">{ch.fraudRate.toFixed(2)}% Fraud Rate</span>
                  </div>

                  {/* Total Bar */}
                  <div className="channel-metric-subrow mono">
                    <span className="subrow-label">Total Volume:</span>
                    <div className="subrow-track">
                      <div className="subrow-fill total" style={{ width: `${totalWidthPct}%` }} />
                    </div>
                    <span className="subrow-val">{ch.total.toLocaleString()} txns</span>
                  </div>

                  {/* Flagged Bar */}
                  <div className="channel-metric-subrow mono">
                    <span className="subrow-label">Flagged Txns:</span>
                    <div className="subrow-track">
                      <div className="subrow-fill flagged" style={{ width: `${flaggedWidthPct}%` }} />
                    </div>
                    <span className="subrow-val flagged-text">{ch.flagged.toLocaleString()} txns</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visual 2: Debit vs Credit Comparison */}
        <div className="exec-chart-panel">
          <div className="panel-header mono">
            <span className="panel-tag">VISUAL 02 • INSTRUMENT TYPE</span>
            <h4>Debit vs Credit Card Vulnerability</h4>
            <p className="panel-sub">Evaluasi rasio anomali antara kartu Debit dan kartu Kredit.</p>
          </div>

          <div className="type-comparison-cards">
            {/* Debit Card */}
            <div className="type-card">
              <div className="type-card-top mono">
                <span className="type-name">DEBIT CARD TRANSACTIONS</span>
                <span className="type-pill">Dominant Channel</span>
              </div>
              <div className="type-stats-grid mono">
                <div>
                  <span className="t-stat-label">Total Volume:</span>
                  <strong>{typeMetrics.Debit.total.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="t-stat-label">Flagged Count:</span>
                  <strong className="red-highlight">{typeMetrics.Debit.flagged}</strong>
                </div>
                <div>
                  <span className="t-stat-label">Fraud Rate:</span>
                  <strong className="red-highlight">{typeMetrics.Debit.fraudRate.toFixed(2)}%</strong>
                </div>
              </div>
              <div className="type-progress-track">
                <div
                  className="type-progress-fill"
                  style={{ width: `${typeMetrics.Debit.fraudRate * 8}%` }}
                />
              </div>
            </div>

            {/* Credit Card */}
            <div className="type-card">
              <div className="type-card-top mono">
                <span className="type-name">CREDIT CARD TRANSACTIONS</span>
                <span className="type-pill">Higher Exposure</span>
              </div>
              <div className="type-stats-grid mono">
                <div>
                  <span className="t-stat-label">Total Volume:</span>
                  <strong>{typeMetrics.Credit.total.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="t-stat-label">Flagged Count:</span>
                  <strong className="red-highlight">{typeMetrics.Credit.flagged}</strong>
                </div>
                <div>
                  <span className="t-stat-label">Fraud Rate:</span>
                  <strong className="red-highlight">{typeMetrics.Credit.fraudRate.toFixed(2)}%</strong>
                </div>
              </div>
              <div className="type-progress-track">
                <div
                  className="type-progress-fill credit"
                  style={{ width: `${typeMetrics.Credit.fraudRate * 8}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Grid: Matrix Heatmap + Duration Anomaly Comparison */}
      <div className="channel-middle-grid">
        {/* Visual 3: Channel x Risk Level Heatmap Matrix */}
        <div className="exec-chart-panel">
          <div className="panel-header mono">
            <span className="panel-tag">VISUAL 03 • CROSS-TAB MATRIX</span>
            <h4>Matrix Heatmap: Channel × Risk Tier</h4>
            <p className="panel-sub">Distribusi intensitas silang antara jalur transaksi dengan tingkat keparahan risiko SQL.</p>
          </div>

          <div className="matrix-table-wrapper">
            <table className="matrix-table mono">
              <thead>
                <tr>
                  <th>Channel</th>
                  <th>Low Risk (0–1)</th>
                  <th>Medium Risk (2–3)</th>
                  <th>High Risk (&gt;= 4)</th>
                </tr>
              </thead>
              <tbody>
                {(["ATM", "Branch", "Online"] as const).map((ch) => (
                  <tr key={ch}>
                    <td className="ch-cell"><strong>{ch}</strong></td>
                    <td style={{ backgroundColor: getHeatmapBg(channelRiskMatrix[ch].Low, false) }}>
                      {channelRiskMatrix[ch].Low}
                    </td>
                    <td style={{ backgroundColor: getHeatmapBg(channelRiskMatrix[ch].Medium, true) }}>
                      <strong className="yellow-text">{channelRiskMatrix[ch].Medium}</strong>
                    </td>
                    <td style={{ backgroundColor: getHeatmapBg(channelRiskMatrix[ch].High, true) }}>
                      <strong className="red-highlight">{channelRiskMatrix[ch].High}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visual 4: Transaction Duration Breakdown */}
        <div className="exec-chart-panel">
          <div className="panel-header mono">
            <span className="panel-tag">VISUAL 04 • BEHAVIORAL LATENCY</span>
            <h4>Durasi Transaksi: Normal vs Flagged</h4>
            <p className="panel-sub">Rata-rata durasi waktu penyelesaian transaksi (detik) per channel perbankan.</p>
          </div>

          <div className="duration-comparison-list">
            {channelMetrics.map((ch) => (
              <div key={ch.channel} className="duration-item mono">
                <div className="dur-top">
                  <strong>{ch.channel} Channel</strong>
                  <span className="dur-delta">
                    {ch.flaggedDuration < ch.avgDuration ? "⚡ Faster Execution" : "⏳ Slower Execution"}
                  </span>
                </div>
                <div className="dur-bars-grid">
                  <div>
                    <span className="dur-label">Normal Txn Avg:</span>
                    <span className="dur-val normal-val">{ch.avgDuration}s</span>
                  </div>
                  <div>
                    <span className="dur-label">Flagged Txn Avg:</span>
                    <span className="dur-val flagged-val">{ch.flaggedDuration}s</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visual 5: Top 10 Flagged Merchants */}
      <div className="exec-chart-panel">
        <div className="panel-header mono">
          <span className="panel-tag">VISUAL 05 • MERCHANT EXPOSURE SURVEILLANCE</span>
          <h4>Top 10 Merchant dengan Transaksi Flagged Terbanyak</h4>
          <p className="panel-sub">Daftar merchant pihak ketiga dengan akumulasi insiden anomali tertinggi untuk prioritas audit.</p>
        </div>

        <div className="merchants-grid">
          {topMerchants.map((m, idx) => {
            const widthPct = Math.min((m.flagged / maxMerchantFlagged) * 100, 100);
            return (
              <div key={m.merchantId} className="merchant-item mono">
                <div className="merchant-header">
                  <span className="m-idx">#{idx + 1}</span>
                  <strong className="m-id">{m.merchantId}</strong>
                  <span className="m-rate-tag">{m.fraudRate.toFixed(1)}% Anomaly</span>
                </div>
                <div className="m-bar-track">
                  <div className="m-bar-fill" style={{ width: `${widthPct}%` }} />
                </div>
                <div className="m-footer">
                  <span>{m.flagged} Flagged of {m.total} total</span>
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
