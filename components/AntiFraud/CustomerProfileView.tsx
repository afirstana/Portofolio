"use client";

import React, { useState } from "react";
import { AccountRiskPriority, AgeBinMetric, OccupationMetric } from "@/lib/anti-fraud";

interface CustomerProfileViewProps {
  ageBinMetrics: AgeBinMetric[];
  occupationMetrics: OccupationMetric[];
  loginAttemptsDistribution: Array<{ attempts: number; total: number; flagged: number; isAnomalyThreshold: boolean }>;
  topRiskAccounts: AccountRiskPriority[];
}

export function CustomerProfileView({
  ageBinMetrics,
  occupationMetrics,
  loginAttemptsDistribution,
  topRiskAccounts
}: CustomerProfileViewProps) {
  // Interactive Sandbox Simulator State
  const [simAmount, setSimAmount] = useState<number>(850);
  const [simBalance, setSimBalance] = useState<number>(1000);

  // Selected Target Account Modal
  const [selectedAccount, setSelectedAccount] = useState<AccountRiskPriority | null>(topRiskAccounts[0] || null);
  const [accountActionNotice, setAccountActionNotice] = useState<string | null>(null);

  // Interactive filter states
  const [selectedAgeBin, setSelectedAgeBin] = useState<string | null>(null);
  const [selectedOccupation, setSelectedOccupation] = useState<string | null>(null);

  const maxAgeRate = Math.max(...ageBinMetrics.map((a) => a.fraudRate), 1);
  const maxOccTotal = Math.max(...occupationMetrics.map((o) => o.total), 1);
  const maxLoginTotal = Math.max(...loginAttemptsDistribution.map((l) => l.total), 1);

  // Live calculation of Drain Ratio
  const simDrainRatio = simBalance > 0 ? (simAmount / simBalance) * 100 : 0;
  const isSimDrainTriggered = simDrainRatio > 70;

  const handleSimulateAction = (action: string) => {
    setAccountActionNotice(`AML Action Dispatched: [${action}] recorded for Account ${selectedAccount?.accountId}`);
    setTimeout(() => setAccountActionNotice(null), 3500);
  };

  return (
    <div className="customer-profile-view" aria-label="Customer Profile &amp; Behavioral Surveillance Dashboard">
      {/* Upper 2-Column Row: Age Cohorts & Occupation Rates with Click-to-Select */}
      <div className="profile-upper-grid">
        {/* Visual 1: Fraud Rate per Age Cohort */}
        <div className="exec-chart-panel">
          <div className="panel-header mono">
            <div className="panel-header-flex">
              <div>
                <span className="panel-tag">BEHAVIORAL • DEMOGRAPHIC VULNERABILITY (CLICKABLE)</span>
                <h4>Fraud Incidence Rate by Age Cohort</h4>
              </div>
              {selectedAgeBin && (
                <button
                  type="button"
                  className="mini-clear-btn"
                  onClick={() => setSelectedAgeBin(null)}
                >
                  ✕ Clear Age
                </button>
              )}
            </div>
            <p className="panel-sub">Click any age cohort below to inspect demographic vulnerability patterns.</p>
          </div>

          <div className="age-bins-list mono">
            {ageBinMetrics.map((age) => {
              const isAgeSelected = selectedAgeBin === age.bin;
              const widthPct = Math.min((age.fraudRate / maxAgeRate) * 100, 100);
              return (
                <div
                  key={age.bin}
                  className={`age-item interactive-age-item ${isAgeSelected ? "age-active-row" : ""}`}
                  onClick={() => setSelectedAgeBin(isAgeSelected ? null : age.bin)}
                  title={`Click to select ${age.bin} age group`}
                >
                  <div className="age-item-top">
                    <span className="age-bin-title">{age.bin} Years Old {isAgeSelected ? "★" : ""}</span>
                    <span className="age-count-text">{age.flagged} Flagged / {age.total} Operations</span>
                    <span className="age-rate-pill red-badge">{age.fraudRate.toFixed(2)}% Rate</span>
                  </div>
                  <div className="age-bar-track">
                    <div className="age-bar-fill" style={{ width: `${widthPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visual 2: Fraud Rate per Occupation */}
        <div className="exec-chart-panel">
          <div className="panel-header mono">
            <div className="panel-header-flex">
              <div>
                <span className="panel-tag">BEHAVIORAL • OCCUPATION SEGMENTATION (CLICKABLE)</span>
                <h4>Customer Profile: Occupation Vulnerability</h4>
              </div>
              {selectedOccupation && (
                <button
                  type="button"
                  className="mini-clear-btn"
                  onClick={() => setSelectedOccupation(null)}
                >
                  ✕ Clear Occupation
                </button>
              )}
            </div>
            <p className="panel-sub">Click any occupation card to isolate demographic vulnerability risk.</p>
          </div>

          <div className="occupation-cards-grid mono">
            {occupationMetrics.map((occ) => {
              const isOccSelected = selectedOccupation === occ.occupation;
              const widthPct = (occ.total / maxOccTotal) * 100;
              return (
                <div
                  key={occ.occupation}
                  className={`occ-card interactive-occ-card ${isOccSelected ? "occ-card-active" : ""}`}
                  onClick={() => setSelectedOccupation(isOccSelected ? null : occ.occupation)}
                  title={`Click to select ${occ.occupation}`}
                >
                  <div className="occ-header">
                    <strong className="occ-title">{occ.occupation} {isOccSelected ? "★" : ""}</strong>
                    <span className="occ-rate-pill red-badge">{occ.fraudRate.toFixed(2)}% Flagged</span>
                  </div>
                  <div className="occ-stats-sub">
                    <span>Volume: {occ.total} Txns</span>
                    <span>Mean Ticket: ${occ.avgAmount}</span>
                  </div>
                  <div className="occ-progress-track">
                    <div className="occ-progress-fill" style={{ width: `${widthPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Middle 2-Column Row: Interactive Balance Drain Simulator & Login Attempts */}
      <div className="profile-middle-grid">
        {/* Visual 3: Interactive Balance Drain Simulator Sandbox */}
        <div className="exec-chart-panel">
          <div className="panel-header mono">
            <span className="panel-tag">LIVE SIMULATOR • BALANCE DRAIN SANDBOX</span>
            <h4>Interactive Balance Drain Engine (SQL Rule #6)</h4>
            <p className="panel-sub">Adjust transaction amount and account balance sliders to test real-time drain detection.</p>
          </div>

          <div className="scatter-drain-box mono">
            {/* Live Sliders */}
            <div className="drain-simulator-controls">
              <div className="sim-slider-row">
                <label>TRANSACTION AMOUNT: <strong>${simAmount}</strong></label>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="25"
                  value={simAmount}
                  onChange={(e) => setSimAmount(Number(e.target.value))}
                  className="risk-slider"
                />
              </div>

              <div className="sim-slider-row">
                <label>ACCOUNT BALANCE: <strong>${simBalance}</strong></label>
                <input
                  type="range"
                  min="200"
                  max="5000"
                  step="50"
                  value={simBalance}
                  onChange={(e) => setSimBalance(Number(e.target.value))}
                  className="risk-slider"
                />
              </div>
            </div>

            {/* Live Simulation Verdict */}
            <div className={`drain-sim-verdict ${isSimDrainTriggered ? "triggered" : "safe"}`}>
              <div className="verdict-header">
                <strong>DRAIN RATIO: {simDrainRatio.toFixed(1)}% OF BALANCE</strong>
                <span className={isSimDrainTriggered ? "red-badge" : "green-badge"}>
                  {isSimDrainTriggered ? "⚠️ FLAG TRIGGERED: flag_balance_drain = TRUE" : "✓ SAFE: flag_balance_drain = FALSE"}
                </span>
              </div>
              <p className="verdict-desc">
                {isSimDrainTriggered
                  ? `Critical Anomaly: Transaction ($${simAmount}) consumes ${simDrainRatio.toFixed(1)}% of total liquidity ($${simBalance}), exceeding the 70% threshold.`
                  : `Normal Expenditure: Transaction consumes only ${simDrainRatio.toFixed(1)}% of total account liquidity.`}
              </p>
            </div>
          </div>
        </div>

        {/* Visual 4: Login Attempts Distribution */}
        <div className="exec-chart-panel">
          <div className="panel-header mono">
            <span className="panel-tag">BEHAVIORAL • AUTHENTICATION STRESS</span>
            <h4>Authentication Retry Distribution (Login Attempts)</h4>
            <p className="panel-sub">Brute-force password guessing detection (SQL threshold: LoginAttempts &gt;= 3).</p>
          </div>

          <div className="login-attempts-list mono">
            {loginAttemptsDistribution.map((l) => {
              const widthPct = (l.total / maxLoginTotal) * 100;
              return (
                <div key={l.attempts} className={`login-item ${l.isAnomalyThreshold ? "anomaly" : ""}`}>
                  <div className="login-item-top">
                    <span className="login-title">
                      {l.attempts}x Attempt{l.attempts > 1 ? "s" : ""}
                    </span>
                    {l.isAnomalyThreshold && (
                      <span className="red-badge">⚠️ Anomaly Threshold (Rule Triggered)</span>
                    )}
                    <span className="login-count-val">{l.total} txns ({l.flagged} flagged)</span>
                  </div>
                  <div className="login-bar-track">
                    <div
                      className={`login-bar-fill ${l.isAnomalyThreshold ? "red-fill" : ""}`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Visual 5: Top 10 High Risk Accounts with Interactive Click-to-Inspect Drawer */}
      <div className="exec-chart-panel">
        <div className="panel-header mono">
          <div className="panel-header-flex">
            <div>
              <span className="panel-tag">BEHAVIORAL • TARGET ACCOUNT QUEUE (CLICK ROW TO INSPECT)</span>
              <h4>Top 10 High-Risk Accounts Priority Queue</h4>
            </div>
            <span className="table-scroll-badge">↕️ Scrollable Queue (Top 10 Targets)</span>
          </div>
          <p className="panel-sub">Click any account row below to open the forensic AML action console.</p>
        </div>

        <div className="accounts-table-scroll-container mono">
          <table className="accounts-table">
            <thead>
              <tr>
                <th>Priority</th>
                <th>Account ID</th>
                <th>Occupation</th>
                <th>Flagged Txns</th>
                <th>Max Risk Tier</th>
                <th>Cumulative Risk Score</th>
                <th>Gross Processed Value</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {topRiskAccounts.map((acc, idx) => {
                const isAccSelected = selectedAccount?.accountId === acc.accountId;
                return (
                  <tr
                    key={acc.accountId}
                    className={`interactive-acc-row ${isAccSelected ? "selected-acc-row" : ""}`}
                    onClick={() => setSelectedAccount(acc)}
                    title="Click to inspect account AML telemetry"
                  >
                    <td><span className="priority-badge">#{idx + 1}</span></td>
                    <td><strong>{acc.accountId}</strong></td>
                    <td>{acc.customerOccupation}</td>
                    <td><span className="red-highlight">{acc.flaggedCount} Txns</span></td>
                    <td>
                      <span className={`risk-pill ${acc.maxRiskScore >= 4 ? "high" : "med"}`}>
                        Score {acc.maxRiskScore} / 6
                      </span>
                    </td>
                    <td><strong>{acc.totalRiskScore}</strong></td>
                    <td>${acc.totalVolume.toLocaleString()}</td>
                    <td>
                      <button type="button" className="mini-inspect-btn">
                        Inspect →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Account AML Action Drawer */}
        {selectedAccount && (
          <div className="aml-action-drawer mono">
            <div className="drawer-header">
              <div className="drawer-title-left">
                <span className="pulse-dot" />
                <strong>AML FORENSIC DOSSIER: {selectedAccount.accountId}</strong>
                <span className="occ-tag">[{selectedAccount.customerOccupation}]</span>
              </div>
              <span className="drawer-priority-tag">CRITICAL PRIORITY TARGET</span>
            </div>

            <div className="drawer-stats-row">
              <div>
                <span className="stat-label">Cumulative Risk Score:</span>
                <strong className="red-highlight">{selectedAccount.totalRiskScore} points</strong>
              </div>
              <div>
                <span className="stat-label">Max Risk Severity:</span>
                <strong className="red-highlight">{selectedAccount.maxRiskScore} / 6 Flags</strong>
              </div>
              <div>
                <span className="stat-label">Total Monitored Volume:</span>
                <strong>${selectedAccount.totalVolume.toLocaleString()}</strong>
              </div>
              <div>
                <span className="stat-label">Flagged Anomaly Count:</span>
                <strong className="red-highlight">{selectedAccount.flaggedCount} operations</strong>
              </div>
            </div>

            <div className="drawer-action-buttons">
              <button
                type="button"
                className="aml-btn freeze-btn"
                onClick={() => handleSimulateAction("TEMPORARY_ACCOUNT_LOCK")}
              >
                🔒 Freeze Account
              </button>
              <button
                type="button"
                className="aml-btn sar-btn"
                onClick={() => handleSimulateAction("FILE_SAR_COMPLIANCE_REPORT")}
              >
                📑 Generate SAR Report
              </button>
              <button
                type="button"
                className="aml-btn verify-btn"
                onClick={() => handleSimulateAction("STEP_UP_2FA_VERIFICATION")}
              >
                📲 Force 2FA Step-Up
              </button>
            </div>

            {accountActionNotice && (
              <div className="action-notice-box">
                <span className="pulse-dot" />
                <span>{accountActionNotice}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
