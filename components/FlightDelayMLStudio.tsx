"use client";

import React, { useState, useMemo } from "react";
import {
  CarrierCode,
  HubCode,
  CongestionLevel,
  CARRIER_NAMES,
  HUB_NAMES,
  predictFlightDelay,
  calculateThresholdEconomics,
  getMetadata,
} from "../lib/flight-delay-ml";

export default function FlightDelayMLStudio() {
  const meta = useMemo(() => getMetadata(), []);

  // Studio Mode State: "simulator" | "economics"
  const [activeTab, setActiveTab] = useState<"simulator" | "economics">("simulator");

  // --- Tab 1: Simulator State ---
  const [carrier, setCarrier] = useState<CarrierCode>("AA");
  const [origin, setOrigin] = useState<HubCode>("ORD");
  const [dest, setDest] = useState<HubCode>("DFW");
  const [depHour, setDepHour] = useState<number>(18);
  const [isWeekend, setIsWeekend] = useState<boolean>(false);
  const [congestionLevel, setCongestionLevel] = useState<CongestionLevel>("severe");

  // --- Tab 2: Economics State ---
  const [threshold, setThreshold] = useState<number>(0.2);
  const [costFN, setCostFN] = useState<number>(4200);
  const [costFP, setCostFP] = useState<number>(800);

  // Predictions
  const prediction = useMemo(() => {
    return predictFlightDelay({
      carrier,
      origin,
      dest: dest === origin ? (origin === "ORD" ? "LAX" : "ORD") : dest,
      depHour,
      isWeekend,
      congestionLevel,
    });
  }, [carrier, origin, dest, depHour, isWeekend, congestionLevel]);

  // Economics
  const economics = useMemo(() => {
    return calculateThresholdEconomics({
      threshold,
      costFalseNegative: costFN,
      costFalsePositive: costFP,
    });
  }, [threshold, costFN, costFP]);

  // Quick Presets for Economics
  const applyPreset = (type: "legacy" | "lcc" | "balanced") => {
    if (type === "legacy") {
      setCostFN(5500);
      setCostFP(700);
    } else if (type === "lcc") {
      setCostFN(2400);
      setCostFP(1500);
    } else {
      setCostFN(4200);
      setCostFP(800);
    }
  };

  // Color mapping for risk badge
  const riskBadgeStyle = {
    MINIMAL: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    MODERATE: "border-amber-500/30 text-amber-400 bg-amber-500/10",
    ELEVATED: "border-orange-500/40 text-orange-400 bg-orange-500/10",
    CRITICAL: "border-red-500/50 text-red-400 bg-red-500/15",
  }[prediction.riskTier];

  return (
    <div
      id="predictive-dispatch-studio"
      className="my-10 rounded-[3px] border border-[var(--line)] bg-[var(--surface-sunken)] p-4 sm:p-6 transition-all"
      style={{ fontFamily: "inherit" }}
    >
      {/* Studio Header & Telemetry Strip */}
      <div className="flex flex-col gap-3 pb-5 border-b border-[var(--line)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-[1px] bg-[var(--accent)]" />
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-[var(--ink-heading)]">
              Pre-Flight Delay Risk &amp; Dispatch Economics Console
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted)] mt-0.5">
            Dual-Stage Classifier · 2024 BTS TranStats Out-of-Time Validation (168k Records)
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center rounded-[3px] border border-[var(--line)] bg-[var(--surface)] p-0.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("simulator")}
            className={`mono px-3 py-1.5 text-xs font-semibold rounded-[3px] transition-all ${
              activeTab === "simulator"
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-[var(--dim)] hover:text-[var(--ink-heading)]"
            }`}
          >
            01. Live Dispatch Simulator
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("economics")}
            className={`mono px-3 py-1.5 text-xs font-semibold rounded-[3px] transition-all ${
              activeTab === "economics"
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-[var(--dim)] hover:text-[var(--ink-heading)]"
            }`}
          >
            02. Threshold Economics &amp; ROI
          </button>
        </div>
      </div>

      {/* Telemetry Stats Bar */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 my-4 py-3 px-4 rounded-[3px] bg-[var(--surface)] border border-[var(--line)] text-xs">
        <div>
          <span className="mono text-[var(--muted)] block text-[10.5px] uppercase tracking-wider font-semibold">
            Evaluation Metric
          </span>
          <strong className="mono text-[var(--ink-heading)] font-semibold text-xs block">ROC-AUC: 0.6174</strong>
        </div>
        <div>
          <span className="mono text-[var(--muted)] block text-[10.5px] uppercase tracking-wider font-semibold">
            Temporal Validation
          </span>
          <strong className="mono text-[var(--ink-heading)] font-semibold text-xs block">Jan-Aug → Sep-Dec Split</strong>
        </div>
        <div>
          <span className="mono text-[var(--muted)] block text-[10.5px] uppercase tracking-wider font-semibold">
            National Delay Base
          </span>
          <strong className="mono text-[var(--ink-heading)] font-semibold text-xs block">24.4% (≥ 15 min)</strong>
        </div>
        <div>
          <span className="mono text-[var(--muted)] block text-[10.5px] uppercase tracking-wider font-semibold">
            Feature Constraints
          </span>
          <strong className="mono text-emerald-400 font-semibold text-xs block">Pre-Departure Only (Zero Leakage)</strong>
        </div>
      </div>

      {/* TAB 1: LIVE DISPATCH SIMULATOR */}
      {activeTab === "simulator" && (
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
            {/* Input Controls Column (Left, 50%) */}
            <div className="rounded-[3px] border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
                <span className="mono text-xs font-bold text-[var(--ink-heading)] uppercase tracking-wider">
                  Flight Parameters
                </span>
                <span className="mono text-[11px] text-[var(--muted)]">PRE-FLIGHT INPUTS</span>
              </div>

              <div className="space-y-4 my-auto py-2">
                {/* Operating Carrier */}
                <div>
                  <label className="mono block text-[11px] font-semibold text-[var(--muted)] mb-1 uppercase tracking-wider">
                    Operating Carrier
                  </label>
                  <select
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value as CarrierCode)}
                    style={{
                      backgroundColor: "var(--panel)",
                      color: "var(--ink)",
                    }}
                    className="w-full rounded-[3px] border border-[var(--line)] px-3 py-2 text-xs focus:border-[var(--accent)] focus:outline-none cursor-pointer"
                  >
                    {meta.top_carriers.map((c) => (
                      <option
                        key={c}
                        value={c}
                      >
                        {c} — {CARRIER_NAMES[c as CarrierCode]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Origin & Destination Hubs */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mono block text-[11px] font-semibold text-[var(--muted)] mb-1 uppercase tracking-wider">
                      Origin Hub
                    </label>
                    <select
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value as HubCode)}
                      style={{
                        backgroundColor: "var(--panel)",
                        color: "var(--ink)",
                      }}
                      className="w-full rounded-[3px] border border-[var(--line)] px-2.5 py-2 text-xs focus:border-[var(--accent)] focus:outline-none cursor-pointer"
                    >
                      {meta.top_hubs.map((h) => (
                        <option
                          key={h}
                          value={h}
                        >
                          {h} ({HUB_NAMES[h as HubCode].split(" ")[0]})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mono block text-[11px] font-semibold text-[var(--muted)] mb-1 uppercase tracking-wider">
                      Destination Hub
                    </label>
                    <select
                      value={dest}
                      onChange={(e) => setDest(e.target.value as HubCode)}
                      style={{
                        backgroundColor: "var(--panel)",
                        color: "var(--ink)",
                      }}
                      className="w-full rounded-[3px] border border-[var(--line)] px-2.5 py-2 text-xs focus:border-[var(--accent)] focus:outline-none cursor-pointer"
                    >
                      {meta.top_hubs.map((h) => (
                        <option
                          key={h}
                          value={h}
                          disabled={h === origin}
                        >
                          {h} ({HUB_NAMES[h as HubCode].split(" ")[0]})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Scheduled Departure Time */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="mono text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">Scheduled Departure Slot</span>
                    <span className="mono font-semibold text-[var(--ink-heading)] text-xs">
                      {depHour.toString().padStart(2, "0")}:00
                      {depHour >= 15 && depHour <= 19
                        ? " (Evening Peak)"
                        : depHour >= 6 && depHour <= 9
                        ? " (Morning Wave)"
                        : ""}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="23"
                    step="1"
                    value={depHour}
                    onChange={(e) => setDepHour(parseInt(e.target.value, 10))}
                    className="w-full accent-[var(--accent)] cursor-pointer"
                  />
                  <div className="mono flex justify-between text-[10px] text-[var(--muted)] mt-1">
                    <span>00:00</span>
                    <span>06:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>23:00</span>
                  </div>
                </div>

                {/* Surface Congestion Level */}
                <div>
                  <label className="mono block text-[11px] font-semibold text-[var(--muted)] mb-1 uppercase tracking-wider">
                    Origin Surface &amp; Radar Congestion
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["nominal", "elevated", "severe"] as CongestionLevel[]).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setCongestionLevel(lvl)}
                        className={`mono py-1.5 px-2 rounded-[3px] border text-xs capitalize transition-all ${
                          congestionLevel === lvl
                            ? lvl === "severe"
                              ? "border-red-500 bg-red-500/15 text-red-400 font-bold"
                              : "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)] font-bold"
                            : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink-heading)]"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weekend Toggle */}
                <div className="flex items-center justify-between pt-1">
                  <span className="mono text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">Weekend Schedule Impact</span>
                  <button
                    type="button"
                    onClick={() => setIsWeekend(!isWeekend)}
                    className={`mono px-3 py-1 rounded-[3px] text-xs transition-all border ${
                      isWeekend
                        ? "border-amber-500/40 bg-amber-500/10 text-amber-400 font-semibold"
                        : "border-[var(--line)] text-[var(--muted)]"
                    }`}
                  >
                    {isWeekend ? "● Weekend Active" : "○ Weekday Profile"}
                  </button>
                </div>
              </div>
            </div>

            {/* Inference Output Column (Right, 50%) */}
            <div className="flex flex-col justify-between space-y-4">
              {/* Primary Gauge & Severity Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Delay Probability Gauge */}
                <div className="rounded-[3px] border border-[var(--line)] bg-[var(--surface)] p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="mono text-[11px] uppercase tracking-wider text-[var(--muted)] font-semibold">
                        Predicted P(Delay ≥ 15m)
                      </span>
                      <span
                        className={`mono text-[11px] px-2 py-0.5 rounded-[2px] border font-semibold ${riskBadgeStyle}`}
                      >
                        {prediction.riskTier} RISK
                      </span>
                    </div>
                    <div className="my-2 flex items-baseline gap-2">
                      <strong className="mono text-4xl font-bold tracking-tight text-[var(--ink-heading)]">
                        {prediction.probabilityPct}%
                      </strong>
                      <span className="mono text-xs text-[var(--muted)]">
                        vs 24.4% baseline
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-[var(--surface-sunken)] h-2 rounded-[2px] overflow-hidden border border-[var(--line)]">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${prediction.probabilityPct}%`,
                        backgroundColor:
                          prediction.probability >= 0.5 ? "var(--accent)" : "#10b981",
                      }}
                    />
                  </div>
                </div>

                {/* Severity Tier Card */}
                <div className="rounded-[3px] border border-[var(--line)] bg-[var(--surface)] p-4">
                  <span className="mono text-[11px] uppercase tracking-wider text-[var(--muted)] font-semibold block">
                    Stage 2: Predicted Severity Tier
                  </span>
                  <div className="mono my-2 text-sm font-bold text-[var(--ink-heading)] flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-[1px] ${
                        prediction.predictedSeverity.includes("Severe")
                          ? "bg-red-500"
                          : prediction.predictedSeverity.includes("Moderate")
                          ? "bg-amber-500"
                          : prediction.predictedSeverity.includes("Minor")
                          ? "bg-yellow-500"
                          : "bg-emerald-500"
                      }`}
                    />
                    {prediction.predictedSeverity}
                  </div>
                  <div className="mono space-y-1.5 pt-1 text-xs">
                    <div className="flex justify-between text-[var(--muted)]">
                      <span>On-Time (&lt;15m)</span>
                      <span>{(prediction.severityProbabilities.onTime * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-[var(--muted)]">
                      <span>Minor (15-30m)</span>
                      <span>{(prediction.severityProbabilities.minor * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-[var(--muted)]">
                      <span>Moderate (31-60m)</span>
                      <span>{(prediction.severityProbabilities.moderate * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-[var(--accent)] font-semibold">
                      <span>Severe (&gt;60m)</span>
                      <span>{(prediction.severityProbabilities.severe * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Local SHAP Waterfall Attribution */}
              <div className="flex-1 rounded-[3px] border border-[var(--line)] bg-[var(--surface)] p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="mono text-xs font-bold text-[var(--ink-heading)] uppercase tracking-wider">
                    Factor Attribution (SHAP Waterfall)
                  </span>
                  <span className="mono text-[11px] text-[var(--muted)]">
                    Baseline: 24.4%
                  </span>
                </div>
                <div className="space-y-2.5 flex-1 flex flex-col justify-around">
                  {prediction.shapWaterfall.map((factor, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="mono text-[var(--ink-heading)] font-semibold text-xs">
                          {factor.name}
                        </span>
                        <span
                          className={`mono font-bold text-xs ${
                            factor.direction === "increase"
                              ? "text-[var(--accent)]"
                              : "text-emerald-400"
                          }`}
                        >
                          {factor.impactPct > 0 ? `+${factor.impactPct}%` : `${factor.impactPct}%`}
                        </span>
                      </div>
                      <div className="w-full bg-[var(--surface-sunken)] h-1.5 rounded-[1px] overflow-hidden flex">
                        {factor.direction === "decrease" && (
                          <div
                            className="bg-emerald-500 h-full rounded-[1px] transition-all duration-300"
                            style={{ width: `${Math.min(100, Math.abs(factor.impactPct) * 3)}%` }}
                          />
                        )}
                        {factor.direction === "increase" && (
                          <div
                            className="bg-[var(--accent)] h-full rounded-[1px] transition-all duration-300"
                            style={{ width: `${Math.min(100, Math.abs(factor.impactPct) * 3)}%` }}
                          />
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--muted)]">{factor.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Dispatch Directive — Full Width Footer Banner */}
          <div className="rounded-[3px] border border-amber-500/30 bg-amber-500/5 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 mb-2.5 border-b border-amber-500/20">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-[1px] bg-amber-400" />
                <span className="mono text-xs font-bold text-amber-400 uppercase tracking-wider">
                  AOC Dispatch Advisory &amp; Mitigation Directive
                </span>
              </div>
              {prediction.dispatchMitigation.expectedSavingsMinutes > 0 && (
                <span className="mono text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30 self-start sm:self-auto">
                  ~{prediction.dispatchMitigation.expectedSavingsMinutes}m recovered buffer
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-8">
                <p className="text-xs text-[var(--ink-heading)] font-medium leading-relaxed">
                  {prediction.dispatchMitigation.action}
                </p>
              </div>
              <div className="md:col-span-4 md:text-right border-t md:border-t-0 md:border-l border-amber-500/20 pt-2 md:pt-0 md:pl-4">
                <span className="text-xs text-[var(--muted)] block">
                  {prediction.dispatchMitigation.impactText}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: THRESHOLD ECONOMICS & FLEET ROI */}
      {activeTab === "economics" && (
        <div className="space-y-4 mt-4">
          {/* Business Preset Quick Buttons (Full Width) */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-[3px] border border-[var(--line)] bg-[var(--surface)]">
            <span className="mono text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
              Airline Business Model Presets:
            </span>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => applyPreset("legacy")}
                className="mono px-2.5 py-1 text-xs rounded-[3px] border border-[var(--line)] hover:border-[var(--accent)] text-[var(--ink-heading)] transition-all font-medium"
              >
                Legacy Hub-and-Spoke (High Delay Cost)
              </button>
              <button
                type="button"
                onClick={() => applyPreset("lcc")}
                className="mono px-2.5 py-1 text-xs rounded-[3px] border border-[var(--line)] hover:border-[var(--accent)] text-[var(--ink-heading)] transition-all font-medium"
              >
                Low-Cost Carrier (Point-to-Point)
              </button>
              <button
                type="button"
                onClick={() => applyPreset("balanced")}
                className="mono px-2.5 py-1 text-xs rounded-[3px] border border-[var(--line)] hover:border-[var(--accent)] text-[var(--ink-heading)] transition-all font-medium"
              >
                Industry Standard Benchmark
              </button>
            </div>
          </div>

          {/* Financial KPI Cards (Full Width, 3 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-[3px] border border-[var(--line)] bg-[var(--surface)] p-3.5">
              <span className="mono text-[10.5px] uppercase tracking-wider text-[var(--muted)] font-semibold block">
                Current Fleet Cost
              </span>
              <strong className="mono text-xl font-bold text-[var(--ink-heading)] mt-1 block">
                ${(economics.currentPoint.totalCost / 1_000_000).toFixed(2)}M
              </strong>
              <span className="text-[11px] text-[var(--muted)] block">
                Across test validation fleet
              </span>
            </div>

            <div className="rounded-[3px] border border-emerald-500/30 bg-emerald-500/5 p-3.5">
              <span className="mono text-[10.5px] uppercase tracking-wider text-emerald-400 block font-semibold">
                Net Savings vs Naive
              </span>
              <strong className="mono text-xl font-bold text-emerald-400 mt-1 block">
                +${(economics.currentPoint.savingsVsNaive / 1_000_000).toFixed(2)}M
              </strong>
              <span className="text-[11px] text-emerald-400/80 block">
                vs zero-intervention baseline
              </span>
            </div>

            <div className="rounded-[3px] border border-[var(--line)] bg-[var(--surface)] p-3.5">
              <span className="mono text-[10.5px] uppercase tracking-wider text-[var(--muted)] font-semibold block">
                Max Possible Savings
              </span>
              <strong className="mono text-xl font-bold text-[var(--ink-heading)] mt-1 block">
                +${(economics.optimalSavings / 1_000_000).toFixed(2)}M
              </strong>
              <span className="mono text-[11px] text-[var(--muted)] block">
                At τ* = {economics.optimalThreshold.toFixed(2)}
              </span>
            </div>
          </div>

          {/* 50/50 Symmetrical Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
            {/* Economic Controls (Left, 50%) */}
            <div className="rounded-[3px] border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5 flex flex-col justify-between space-y-4">
              <div className="pb-2 border-b border-[var(--line)] flex justify-between items-center">
                <span className="mono text-xs font-bold text-[var(--ink-heading)] uppercase tracking-wider">
                  Economic Parameters
                </span>
                <span className="mono text-[11px] text-[var(--muted)]">57,953 TEST FLIGHTS</span>
              </div>

              {/* Threshold Slider */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="mono text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">Decision Threshold (τ)</span>
                  <strong className="mono font-bold text-[var(--accent)] text-xs">
                    τ = {threshold.toFixed(2)}
                  </strong>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.90"
                  step="0.05"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  className="w-full accent-[var(--accent)] cursor-pointer"
                />
                <div className="mono flex justify-between text-[10px] text-[var(--muted)] mt-1">
                  <span>0.10 (Aggressive Alert)</span>
                  <span>0.50 (Default Naive)</span>
                  <span>0.90 (Conservative)</span>
                </div>
              </div>

              {/* Cost of False Negative */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="mono text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                    Cost of Unmitigated Delay (FN)
                  </span>
                  <span className="mono font-semibold text-[var(--ink-heading)] text-xs">
                    ${costFN.toLocaleString()} / flight
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="8000"
                  step="200"
                  value={costFN}
                  onChange={(e) => setCostFN(parseInt(e.target.value, 10))}
                  className="w-full accent-[var(--accent)] cursor-pointer"
                />
                <p className="text-[11px] text-[var(--muted)] mt-0.5">
                  Includes passenger compensation, missed hub connections, and crew duty timeouts.
                </p>
              </div>

              {/* Cost of False Positive */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="mono text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                    Cost of Over-Buffering Alert (FP)
                  </span>
                  <span className="mono font-semibold text-[var(--ink-heading)] text-xs">
                    ${costFP.toLocaleString()} / flight
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="2500"
                  step="100"
                  value={costFP}
                  onChange={(e) => setCostFP(parseInt(e.target.value, 10))}
                  className="w-full accent-[var(--accent)] cursor-pointer"
                />
                <p className="text-[11px] text-[var(--muted)] mt-0.5">
                  Unnecessary gate holds, buffer fuel burn, and preemptive schedule deceleration.
                </p>
              </div>

              {/* Optimal Operating Point Callout */}
              <div className="rounded-[3px] border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs">
                <span className="mono text-emerald-400 font-bold block text-[11px] mb-1 uppercase tracking-wider">
                  Cost-Minimizing Equilibrium
                </span>
                <p className="text-[var(--ink-heading)] leading-relaxed">
                  For your cost ratio (1 FN = {(costFN / costFP).toFixed(1)} FP), the optimal
                  mathematical threshold is{" "}
                  <strong className="mono text-emerald-400">
                    τ* = {economics.optimalThreshold.toFixed(2)}
                  </strong>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => setThreshold(economics.optimalThreshold)}
                  className="mono mt-2 w-full py-1 text-xs rounded-[3px] bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-all font-semibold"
                >
                  Snap to Optimal Threshold (τ = {economics.optimalThreshold.toFixed(2)})
                </button>
              </div>
            </div>

            {/* Economic Results & Curve (Right, 50%) */}
            <div className="flex flex-col justify-between space-y-4">
              {/* Confusion Matrix Breakdown */}
              <div className="rounded-[3px] border border-[var(--line)] bg-[var(--surface)] p-4">
                <span className="mono text-xs font-bold text-[var(--ink-heading)] uppercase tracking-wider block mb-3">
                  Validation Fleet Matrix (τ = {threshold.toFixed(2)})
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded border border-emerald-500/20 bg-emerald-500/5">
                    <div className="mono flex justify-between text-emerald-400 font-semibold text-xs">
                      <span>True Positives (TP)</span>
                      <span>{economics.currentPoint.tp.toLocaleString()}</span>
                    </div>
                    <p className="text-[11px] text-[var(--muted)] mt-1">
                      Correctly flagged delays proactively mitigated
                    </p>
                  </div>

                  <div className="p-2.5 rounded border border-amber-500/20 bg-amber-500/5">
                    <div className="mono flex justify-between text-amber-400 font-semibold text-xs">
                      <span>False Positives (FP)</span>
                      <span>{economics.currentPoint.fp.toLocaleString()}</span>
                    </div>
                    <p className="text-[11px] text-[var(--muted)] mt-1">
                      Unnecessary buffer costs (${costFP}/flight)
                    </p>
                  </div>

                  <div className="p-2.5 rounded border border-[var(--line)] bg-[var(--surface-sunken)]">
                    <div className="mono flex justify-between text-[var(--dim)] font-semibold text-xs">
                      <span>True Negatives (TN)</span>
                      <span>{economics.currentPoint.tn.toLocaleString()}</span>
                    </div>
                    <p className="text-[11px] text-[var(--muted)] mt-1">
                      On-time flights dispatched with zero extra cost
                    </p>
                  </div>

                  <div className="p-2.5 rounded border border-red-500/30 bg-red-500/10">
                    <div className="mono flex justify-between text-red-400 font-semibold text-xs">
                      <span>False Negatives (FN)</span>
                      <span>{economics.currentPoint.fn.toLocaleString()}</span>
                    </div>
                    <p className="text-[11px] text-red-400/80 mt-1">
                      Unmitigated delays (${costFN}/flight)
                    </p>
                  </div>
                </div>

                <div className="mono flex justify-between text-xs pt-3 mt-3 border-t border-[var(--line)] text-[var(--muted)]">
                  <span>
                    Precision:{" "}
                    <strong className="text-[var(--ink-heading)]">
                      {(economics.currentPoint.precision * 100).toFixed(1)}%
                    </strong>
                  </span>
                  <span>
                    Recall:{" "}
                    <strong className="text-[var(--ink-heading)]">
                      {(economics.currentPoint.recall * 100).toFixed(1)}%
                    </strong>
                  </span>
                  <span>
                    F1-Score:{" "}
                    <strong className="text-[var(--ink-heading)]">
                      {economics.currentPoint.f1.toFixed(3)}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Economic Cost Curve Visualization */}
              <div className="rounded-[3px] border border-[var(--line)] bg-[var(--surface)] p-4 flex-1 flex flex-col justify-between">
                <span className="mono text-xs font-bold text-[var(--ink-heading)] uppercase tracking-wider block mb-2">
                  Cost Minimization Curve Across Decision Thresholds
                </span>
                <div className="h-28 flex items-end gap-1 pt-4 pb-1">
                  {economics.curve.map((pt) => {
                    const isSelected = Math.abs(pt.threshold - threshold) < 0.026;
                    const isOptimal = Math.abs(pt.threshold - economics.optimalThreshold) < 0.026;
                    // Normalize cost for height (between 15% and 100%)
                    const maxC = economics.baselineNaiveCost;
                    const minC = economics.curve.reduce(
                      (min, p) => (p.totalCost < min ? p.totalCost : min),
                      Infinity
                    );
                    const range = maxC - minC;
                    const heightPct = 15 + ((pt.totalCost - minC) / (range || 1)) * 85;

                    return (
                      <div
                        key={pt.threshold}
                        onClick={() => setThreshold(pt.threshold)}
                        className="flex-1 flex flex-col items-center cursor-pointer group relative"
                      >
                        <div
                          className={`w-full rounded-none transition-all ${
                            isOptimal
                              ? "bg-emerald-500"
                              : isSelected
                              ? "bg-[var(--accent)]"
                              : "bg-[var(--line)] group-hover:bg-[var(--dim)]"
                          }`}
                          style={{ height: `${heightPct}%` }}
                        />
                        <span className="mono text-[9px] text-[var(--muted)] mt-1 opacity-0 group-hover:opacity-100 sm:opacity-100">
                          {pt.threshold.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="mono flex justify-between items-center text-xs text-[var(--muted)] pt-2 border-t border-[var(--line)]">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-[1px] bg-emerald-500" />
                    Optimal Minimum (τ* = {economics.optimalThreshold.toFixed(2)})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-[1px] bg-[var(--accent)]" />
                    Selected Operating Point (τ = {threshold.toFixed(2)})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
