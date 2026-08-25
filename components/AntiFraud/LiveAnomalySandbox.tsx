"use client";

import React, { useState, useMemo } from "react";
import { simulateTransactionRisk } from "@/lib/anti-fraud";

export function LiveAnomalySandbox() {
  const [amount, setAmount] = useState<number>(950);
  const [avgHistorical, setAvgHistorical] = useState<number>(250);
  const [loginAttempts, setLoginAttempts] = useState<number>(3);
  const [hourOfDay, setHourOfDay] = useState<number>(2); // 02:00 UTC
  const [deltaMinutes, setDeltaMinutes] = useState<number>(3); // 3 minutes
  const [isNewDevice, setIsNewDevice] = useState<boolean>(true);
  const [accountBalance, setAccountBalance] = useState<number>(1200);

  const verdict = useMemo(() => {
    return simulateTransactionRisk(
      amount,
      avgHistorical,
      loginAttempts,
      hourOfDay,
      deltaMinutes,
      isNewDevice,
      accountBalance
    );
  }, [amount, avgHistorical, loginAttempts, hourOfDay, deltaMinutes, isNewDevice, accountBalance]);

  const amountRatio = avgHistorical > 0 ? (amount / avgHistorical).toFixed(1) : "0.0";
  const drainRatio = accountBalance > 0 ? Math.round((amount / accountBalance) * 100) : 0;
  const isOddHour = hourOfDay >= 0 && hourOfDay <= 4;
  const isRapidSwipe = deltaMinutes < 5;
  const isLoginExceeded = loginAttempts >= 3;
  const isAmountSurge = amount > 3.0 * avgHistorical;
  const isDrainExceeded = accountBalance > 0 && amount > 0.7 * accountBalance;

  const handlePresetScenario = (type: "SAFE" | "ATO_ATTACK" | "NIGHT_DRAIN") => {
    if (type === "SAFE") {
      setAmount(120);
      setAvgHistorical(250);
      setLoginAttempts(1);
      setHourOfDay(14);
      setDeltaMinutes(240);
      setIsNewDevice(false);
      setAccountBalance(5000);
    } else if (type === "ATO_ATTACK") {
      setAmount(1400);
      setAvgHistorical(200);
      setLoginAttempts(4);
      setHourOfDay(3);
      setDeltaMinutes(2);
      setIsNewDevice(true);
      setAccountBalance(1500);
    } else if (type === "NIGHT_DRAIN") {
      setAmount(980);
      setAvgHistorical(300);
      setLoginAttempts(2);
      setHourOfDay(1);
      setDeltaMinutes(12);
      setIsNewDevice(false);
      setAccountBalance(1100);
    }
  };

  return (
    <div className="live-anomaly-sandbox-container mono" id="live-sandbox" aria-label="Interactive SQL Risk Rule Simulator">
      {/* Sandbox Header */}
      <div className="sandbox-top-header">
        <div className="sandbox-title-block">
          <div className="sandbox-badge-row">
            <span className="pulse-dot" />
            <span className="sandbox-tag">LIVE INTERACTIVE SIMULATION</span>
            <span className="sandbox-subtag">8-POINT SQL ANOMALY ENGINE</span>
          </div>
          <h3 className="sandbox-main-title">Interactive Transaction Risk Sandbox</h3>
          <p className="sandbox-subtitle">
            Adjust the sliders below to see how our in-stream SQL rule engine evaluates risk scores and flags suspicious behaviors in real time.
          </p>
        </div>

        {/* Preset Scenario Selector */}
        <div className="sandbox-presets-wrapper">
          <span className="preset-label">SCENARIO PRESETS:</span>
          <div className="preset-btn-group">
            <button
              type="button"
              className="preset-pill-btn safe"
              onClick={() => handlePresetScenario("SAFE")}
              title="Simulate normal customer transaction ($120 retail purchase at 2 PM)"
            >
              <span className="pill-dot green" />
              <span>🟢 Normal Retail</span>
            </button>
            <button
              type="button"
              className="preset-pill-btn warning"
              onClick={() => handlePresetScenario("NIGHT_DRAIN")}
              title="Simulate late-night $980 withdrawal"
            >
              <span className="pill-dot yellow" />
              <span>🟡 Night Withdrawal</span>
            </button>
            <button
              type="button"
              className="preset-pill-btn danger"
              onClick={() => handlePresetScenario("ATO_ATTACK")}
              title="Simulate coordinated account takeover with credential stuffing & rapid drain"
            >
              <span className="pill-dot red" />
              <span>🔴 Bot Account Takeover</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="sandbox-interactive-grid">
        {/* Left Column: Sliders & Controls */}
        <div className="sandbox-inputs-panel">
          <div className="panel-section-title">
            <span>⚙️ TRANSACTION PARAMETERS (INPUTS)</span>
            <span className="panel-hint">DRAG SLIDERS TO TEST</span>
          </div>

          {/* Slider 1: Transaction Amount */}
          <div className="param-card">
            <div className="param-header">
              <div className="param-title-wrap">
                <span className="param-icon">💵</span>
                <div>
                  <strong className="param-name">Transaction Amount</strong>
                  <span className="param-sub">Current payment requested</span>
                </div>
              </div>
              <div className="param-value-pill highlight">
                <span>${amount.toLocaleString()}</span>
              </div>
            </div>
            <input
              type="range"
              min="20"
              max="2000"
              step="10"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="styled-slider"
              aria-label="Transaction Amount"
            />
            <div className="slider-range-labels">
              <span>$20 Min</span>
              <span className={`slider-context-note ${isAmountSurge ? "danger" : ""}`}>
                {amountRatio}x baseline ({isAmountSurge ? "⚠️ > 3.0x threshold exceeded" : "Safe zone"})
              </span>
              <span>$2,000 Max</span>
            </div>
          </div>

          {/* Slider 2: Historical Baseline */}
          <div className="param-card">
            <div className="param-header">
              <div className="param-title-wrap">
                <span className="param-icon">📊</span>
                <div>
                  <strong className="param-name">Historical Average Baseline</strong>
                  <span className="param-sub">Customer typical transaction mean</span>
                </div>
              </div>
              <div className="param-value-pill">
                <span>${avgHistorical} / txn</span>
              </div>
            </div>
            <input
              type="range"
              min="50"
              max="600"
              step="10"
              value={avgHistorical}
              onChange={(e) => setAvgHistorical(Number(e.target.value))}
              className="styled-slider"
              aria-label="Historical Baseline"
            />
            <div className="slider-range-labels">
              <span>$50 Baseline</span>
              <span className="slider-context-note">Surge trigger threshold: &gt; ${avgHistorical * 3}</span>
              <span>$600 Baseline</span>
            </div>
          </div>

          {/* Slider 3: Failed Login Attempts */}
          <div className="param-card">
            <div className="param-header">
              <div className="param-title-wrap">
                <span className="param-icon">🔐</span>
                <div>
                  <strong className="param-name">Failed Login Retries</strong>
                  <span className="param-sub">Recent password / PIN failures</span>
                </div>
              </div>
              <div className={`param-value-pill ${isLoginExceeded ? "danger" : ""}`}>
                <span>{loginAttempts} {loginAttempts === 1 ? "attempt" : "attempts"}</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={loginAttempts}
              onChange={(e) => setLoginAttempts(Number(e.target.value))}
              className="styled-slider"
              aria-label="Login Attempts"
            />
            <div className="slider-range-labels">
              <span>1 attempt (Normal)</span>
              <span className={`slider-context-note ${isLoginExceeded ? "danger" : ""}`}>
                {isLoginExceeded ? "⚠️ Brute-force threshold (>=3) reached" : "Normal authentication"}
              </span>
              <span>5 attempts (Brute force)</span>
            </div>
          </div>

          {/* Slider 4: Time of Authorization */}
          <div className="param-card">
            <div className="param-header">
              <div className="param-title-wrap">
                <span className="param-icon">⏰</span>
                <div>
                  <strong className="param-name">Time of Authorization (UTC)</strong>
                  <span className="param-sub">Transaction execution hour</span>
                </div>
              </div>
              <div className={`param-value-pill ${isOddHour ? "warning" : ""}`}>
                <span>{String(hourOfDay).padStart(2, "0")}:00 UTC</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="23"
              step="1"
              value={hourOfDay}
              onChange={(e) => setHourOfDay(Number(e.target.value))}
              className="styled-slider"
              aria-label="Hour of Day"
            />
            <div className="slider-range-labels">
              <span>00:00 (Midnight)</span>
              <span className={`slider-context-note ${isOddHour ? "warning" : ""}`}>
                {isOddHour ? "⚠️ High-risk odd-hour window (00:00–04:00)" : "Daytime business hours"}
              </span>
              <span>23:00 (Night)</span>
            </div>
          </div>

          {/* Slider 5: Time Since Previous Transaction */}
          <div className="param-card">
            <div className="param-header">
              <div className="param-title-wrap">
                <span className="param-icon">⚡</span>
                <div>
                  <strong className="param-name">Time Since Last Transaction</strong>
                  <span className="param-sub">Elapsed minutes since prior swipe</span>
                </div>
              </div>
              <div className={`param-value-pill ${isRapidSwipe ? "danger" : ""}`}>
                <span>{deltaMinutes} {deltaMinutes === 1 ? "minute" : "minutes"}</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="60"
              step="1"
              value={deltaMinutes}
              onChange={(e) => setDeltaMinutes(Number(e.target.value))}
              className="styled-slider"
              aria-label="Time Delta"
            />
            <div className="slider-range-labels">
              <span>1 min (Rapid swipe)</span>
              <span className={`slider-context-note ${isRapidSwipe ? "danger" : ""}`}>
                {isRapidSwipe ? "⚠️ Velocity surge (<5 mins difference)" : "Normal transaction cadence"}
              </span>
              <span>60 mins</span>
            </div>
          </div>

          {/* Slider 6: Available Account Balance */}
          <div className="param-card">
            <div className="param-header">
              <div className="param-title-wrap">
                <span className="param-icon">💳</span>
                <div>
                  <strong className="param-name">Available Account Balance</strong>
                  <span className="param-sub">Total funds remaining in account</span>
                </div>
              </div>
              <div className="param-value-pill">
                <span>${accountBalance.toLocaleString()}</span>
              </div>
            </div>
            <input
              type="range"
              min="200"
              max="6000"
              step="50"
              value={accountBalance}
              onChange={(e) => setAccountBalance(Number(e.target.value))}
              className="styled-slider"
              aria-label="Account Balance"
            />
            <div className="slider-range-labels">
              <span>$200 Min</span>
              <span className={`slider-context-note ${isDrainExceeded ? "danger" : ""}`}>
                Drain ratio: {drainRatio}% ({isDrainExceeded ? "⚠️ > 70% threshold" : "Healthy balance"})
              </span>
              <span>$6,000 Max</span>
            </div>
          </div>

          {/* Toggle: First-time Device / Location */}
          <div className="device-toggle-card">
            <label className="toggle-label-wrap">
              <input
                type="checkbox"
                checked={isNewDevice}
                onChange={(e) => setIsNewDevice(e.target.checked)}
                className="styled-checkbox"
              />
              <div className="toggle-text-wrap">
                <strong className="toggle-title">📱 Unrecognized Device / IP Location</strong>
                <span className="toggle-desc">
                  Check to simulate a login from a first-time hardware fingerprint or foreign IP address.
                </span>
              </div>
            </label>
            <span className={`toggle-state-badge ${isNewDevice ? "danger" : "clean"}`}>
              {isNewDevice ? "NEW DEVICE (+1 FLAG)" : "KNOWN DEVICE"}
            </span>
          </div>
        </div>

        {/* Right Column: Risk Verdict & 6 SQL Flags */}
        <div className="sandbox-verdict-panel">
          <div className="panel-section-title">
            <span>🛡️ REAL-TIME SQL ENGINE VERDICT</span>
            <span className="panel-hint">COMPUTED VIA vw_transactions_flagged</span>
          </div>

          {/* Large Interactive Verdict Card */}
          <div className={`verdict-master-card ${verdict.riskLevel.toLowerCase()}`}>
            <div className="verdict-card-top">
              <div className="verdict-tier-badge">
                <span className="pulse-dot" />
                <span className="tier-name">{verdict.riskLevel.toUpperCase()} RISK TIER</span>
              </div>
              <span className="verdict-status-pill">
                {verdict.isFlagged ? "🚨 TRANSACTION FLAGGED" : "✅ TRANSACTION APPROVED"}
              </span>
            </div>

            {/* Score Display & Segmented Progress Bar */}
            <div className="verdict-score-display">
              <div className="score-number-group">
                <span className="score-big">{verdict.score}</span>
                <span className="score-total">/ 6 FLAGS</span>
              </div>
              <div className="score-progress-wrap">
                <div className="score-progress-bar">
                  {[1, 2, 3, 4, 5, 6].map((seg) => (
                    <div
                      key={seg}
                      className={`progress-segment ${
                        seg <= verdict.score
                          ? verdict.score >= 4
                            ? "active-red"
                            : verdict.score >= 2
                            ? "active-yellow"
                            : "active-green"
                          : ""
                      }`}
                    />
                  ))}
                </div>
                <div className="progress-legend">
                  <span className="leg-item green">0–1 Low</span>
                  <span className="leg-item yellow">2–3 Medium (2FA)</span>
                  <span className="leg-item red">4–6 High (Hold)</span>
                </div>
              </div>
            </div>

            {/* Automated Banking Action */}
            <div className="banking-action-box">
              <span className="action-tag">AUTOMATED BANK PROTOCOL:</span>
              <p className="action-text">
                {verdict.score >= 4 &&
                  "🛑 Critical Risk Threshold Exceeded! Transaction authorization immediately frozen. Account locked pending AML compliance review."}
                {verdict.score >= 2 && verdict.score < 4 &&
                  "⚠️ Multi-flag trigger detected (Score >= 2). Automated Step-Up 2FA challenge dispatched to primary customer device before settlement."}
                {verdict.score < 2 &&
                  "✅ Transaction parameters within historical baselines. Real-time authorization granted with zero latency."}
              </p>
            </div>
          </div>

          {/* 6 SQL Heuristic Flags Breakdown */}
          <div className="flags-breakdown-section">
            <div className="flags-section-header">
              <strong>EVALUATED SQL RULES BREAKDOWN</strong>
              <span className="flags-counter">{verdict.score} of 6 Triggered</span>
            </div>

            <div className="flags-cards-list">
              {/* Flag 1 */}
              <div className={`flag-status-card ${verdict.flagHighAmount ? "triggered" : "clean"}`}>
                <div className="flag-card-header">
                  <div className="flag-name-group">
                    <span className="flag-icon">{verdict.flagHighAmount ? "🚩" : "✓"}</span>
                    <strong>1. High Amount Surge</strong>
                  </div>
                  <span className={`flag-chip ${verdict.flagHighAmount ? "triggered" : "clean"}`}>
                    {verdict.flagHighAmount ? "+1 RISK (TRIGGERED)" : "0 (CLEAN)"}
                  </span>
                </div>
                <p className="flag-explanation">
                  {verdict.flagHighAmount
                    ? `Amount ($${amount.toLocaleString()}) is ${amountRatio}x above baseline (Threshold > 3.0x = $${avgHistorical * 3})`
                    : `Amount ($${amount.toLocaleString()}) is within normal spending baseline (< 3.0x)`}
                </p>
              </div>

              {/* Flag 2 */}
              <div className={`flag-status-card ${verdict.flagLoginAttempts ? "triggered" : "clean"}`}>
                <div className="flag-card-header">
                  <div className="flag-name-group">
                    <span className="flag-icon">{verdict.flagLoginAttempts ? "🚩" : "✓"}</span>
                    <strong>2. Failed Login Attempts</strong>
                  </div>
                  <span className={`flag-chip ${verdict.flagLoginAttempts ? "triggered" : "clean"}`}>
                    {verdict.flagLoginAttempts ? "+1 RISK (TRIGGERED)" : "0 (CLEAN)"}
                  </span>
                </div>
                <p className="flag-explanation">
                  {verdict.flagLoginAttempts
                    ? `${loginAttempts} failed logins detected (Threshold >= 3 attempts indicating brute-force / ATO)`
                    : `Normal login behavior (${loginAttempts} attempt)`}
                </p>
              </div>

              {/* Flag 3 */}
              <div className={`flag-status-card ${verdict.flagOddHour ? "triggered" : "clean"}`}>
                <div className="flag-card-header">
                  <div className="flag-name-group">
                    <span className="flag-icon">{verdict.flagOddHour ? "🚩" : "✓"}</span>
                    <strong>3. Odd-Hour Timing</strong>
                  </div>
                  <span className={`flag-chip ${verdict.flagOddHour ? "triggered" : "clean"}`}>
                    {verdict.flagOddHour ? "+1 RISK (TRIGGERED)" : "0 (CLEAN)"}
                  </span>
                </div>
                <p className="flag-explanation">
                  {verdict.flagOddHour
                    ? `Executed at ${String(hourOfDay).padStart(2, "0")}:00 UTC (Within high-risk window 00:00–04:00 UTC)`
                    : `Executed during normal daylight hours (${String(hourOfDay).padStart(2, "0")}:00 UTC)`}
                </p>
              </div>

              {/* Flag 4 */}
              <div className={`flag-status-card ${verdict.flagRapidSuccession ? "triggered" : "clean"}`}>
                <div className="flag-card-header">
                  <div className="flag-name-group">
                    <span className="flag-icon">{verdict.flagRapidSuccession ? "🚩" : "✓"}</span>
                    <strong>4. Rapid Succession Velocity</strong>
                  </div>
                  <span className={`flag-chip ${verdict.flagRapidSuccession ? "triggered" : "clean"}`}>
                    {verdict.flagRapidSuccession ? "+1 RISK (TRIGGERED)" : "0 (CLEAN)"}
                  </span>
                </div>
                <p className="flag-explanation">
                  {verdict.flagRapidSuccession
                    ? `Only ${deltaMinutes} mins since prior transaction (Threshold < 5 mins indicating rapid automated swipe)`
                    : `Normal elapsed interval (${deltaMinutes} mins since prior txn)`}
                </p>
              </div>

              {/* Flag 5 */}
              <div className={`flag-status-card ${verdict.flagBalanceDrain ? "triggered" : "clean"}`}>
                <div className="flag-card-header">
                  <div className="flag-name-group">
                    <span className="flag-icon">{verdict.flagBalanceDrain ? "🚩" : "✓"}</span>
                    <strong>5. Account Balance Drain</strong>
                  </div>
                  <span className={`flag-chip ${verdict.flagBalanceDrain ? "triggered" : "clean"}`}>
                    {verdict.flagBalanceDrain ? "+1 RISK (TRIGGERED)" : "0 (CLEAN)"}
                  </span>
                </div>
                <p className="flag-explanation">
                  {verdict.flagBalanceDrain
                    ? `Transaction consumes ${drainRatio}% of remaining balance (Threshold > 70% of $${accountBalance.toLocaleString()})`
                    : `Leaves healthy balance intact (Consumes ${drainRatio}% of funds)`}
                </p>
              </div>

              {/* Flag 6 */}
              <div className={`flag-status-card ${verdict.flagNewDeviceLocation ? "triggered" : "clean"}`}>
                <div className="flag-card-header">
                  <div className="flag-name-group">
                    <span className="flag-icon">{verdict.flagNewDeviceLocation ? "🚩" : "✓"}</span>
                    <strong>6. Unrecognized Device / IP Location</strong>
                  </div>
                  <span className={`flag-chip ${verdict.flagNewDeviceLocation ? "triggered" : "clean"}`}>
                    {verdict.flagNewDeviceLocation ? "+1 RISK (TRIGGERED)" : "0 (CLEAN)"}
                  </span>
                </div>
                <p className="flag-explanation">
                  {verdict.flagNewDeviceLocation
                    ? "First-time hardware fingerprint & unknown IP location combination"
                    : "Known, previously authenticated customer device & location"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
