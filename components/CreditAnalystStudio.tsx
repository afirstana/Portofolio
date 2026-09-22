"use client";

import React, { useState, useMemo } from "react";
import {
  evaluateCreditApplication,
  CreditApplicationInput,
  calculateDepreciatedCCR,
} from "@/lib/credit-risk";

interface PresetApplicant {
  name: string;
  label: string;
  sectorName: string;
  data: CreditApplicationInput;
}

const PRESET_APPLICANTS: PresetApplicant[] = [
  {
    name: "PT Nusantara Mining Logistik",
    label: "PT Nusantara Mining Logistik (Prime Mining Contractor)",
    sectorName: "Mining",
    data: {
      companyName: "PT Nusantara Mining Logistik",
      sector: "mining",
      equipmentType: "excavator_20t",
      unitCount: 4,
      unitPriceIdr: 1500000000,
      downPaymentPct: 20,
      tenorMonths: 36,
      interestRateAnnualPct: 10.75,
      monthlyOperatingRevenueIdr: 1450000000,
      monthlyOperatingExpenseIdr: 1130000000,
      existingMonthlyDebtServiceIdr: 95000000,
      totalAssetsIdr: 32700000000,
      totalLiabilitiesIdr: 18200000000,
      pastDelinquencyCodesCount: 0,
      hasSevereDelinquency: false,
      hbaCommodityShockPct: 0,
    },
  },
  {
    name: "PT Sawit Sejahtera Bersama",
    label: "PT Sawit Sejahtera Bersama (Mid-Tier Agro Contractor)",
    sectorName: "Plantation",
    data: {
      companyName: "PT Sawit Sejahtera Bersama",
      sector: "plantation",
      equipmentType: "wheel_loader",
      unitCount: 3,
      unitPriceIdr: 950000000,
      downPaymentPct: 25,
      tenorMonths: 36,
      interestRateAnnualPct: 11.25,
      monthlyOperatingRevenueIdr: 850000000,
      monthlyOperatingExpenseIdr: 660000000,
      existingMonthlyDebtServiceIdr: 65000000,
      totalAssetsIdr: 14500000000,
      totalLiabilitiesIdr: 8900000000,
      pastDelinquencyCodesCount: 1,
      hasSevereDelinquency: false,
      hbaCommodityShockPct: -10,
    },
  },
  {
    name: "CV Bangun Megah Konstruksi",
    label: "CV Bangun Megah Konstruksi (Moderate Civil Contractor)",
    sectorName: "Construction",
    data: {
      companyName: "CV Bangun Megah Konstruksi",
      sector: "construction",
      equipmentType: "dump_truck",
      unitCount: 5,
      unitPriceIdr: 1200000000,
      downPaymentPct: 15,
      tenorMonths: 36,
      interestRateAnnualPct: 12.0,
      monthlyOperatingRevenueIdr: 980000000,
      monthlyOperatingExpenseIdr: 840000000,
      existingMonthlyDebtServiceIdr: 80000000,
      totalAssetsIdr: 11200000000,
      totalLiabilitiesIdr: 9800000000,
      pastDelinquencyCodesCount: 2,
      hasSevereDelinquency: false,
      hbaCommodityShockPct: -15,
    },
  },
  {
    name: "PT Batu Hitam Abadi",
    label: "PT Batu Hitam Abadi (Stressed / Severe Delinquent)",
    sectorName: "Mining",
    data: {
      companyName: "PT Batu Hitam Abadi",
      sector: "mining",
      equipmentType: "bulldozer",
      unitCount: 2,
      unitPriceIdr: 2200000000,
      downPaymentPct: 10,
      tenorMonths: 36,
      interestRateAnnualPct: 13.5,
      monthlyOperatingRevenueIdr: 450000000,
      monthlyOperatingExpenseIdr: 410000000,
      existingMonthlyDebtServiceIdr: 120000000,
      totalAssetsIdr: 6500000000,
      totalLiabilitiesIdr: 9200000000,
      pastDelinquencyCodesCount: 3,
      hasSevereDelinquency: true,
      hbaCommodityShockPct: -25,
    },
  },
];

const EQUIPMENT_CATALOG = [
  { type: "excavator_20t", name: "Excavator 20-Ton (Komatsu PC200)", defaultPrice: 1500000000, defaultLgd: 0.25 },
  { type: "dump_truck", name: "Heavy Dump Truck (Hino 500 / Scania)", defaultPrice: 1200000000, defaultLgd: 0.35 },
  { type: "bulldozer", name: "Bulldozer Heavy Track (Komatsu D85)", defaultPrice: 2200000000, defaultLgd: 0.35 },
  { type: "wheel_loader", name: "Wheel Loader 3.0 m³ (CAT / SDLG)", defaultPrice: 950000000, defaultLgd: 0.30 },
] as const;

export function CreditAnalystStudio() {
  const [selectedPresetIdx, setSelectedPresetIdx] = useState<number>(0);
  const [appState, setAppState] = useState<CreditApplicationInput>(PRESET_APPLICANTS[0].data);
  const [activeTab, setActiveTab] = useState<"underwriting" | "collateral" | "macro" | "memo">("underwriting");

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIdx(idx);
    setAppState(PRESET_APPLICANTS[idx].data);
  };

  const handleEquipmentChange = (type: CreditApplicationInput["equipmentType"]) => {
    const item = EQUIPMENT_CATALOG.find((eq) => eq.type === type);
    setAppState((prev) => ({
      ...prev,
      equipmentType: type,
      unitPriceIdr: item ? item.defaultPrice : prev.unitPriceIdr,
    }));
  };

  const evalResult = useMemo(() => {
    return evaluateCreditApplication(appState);
  }, [appState]);

  const totalInvoice = appState.unitCount * appState.unitPriceIdr;
  const downPaymentIdr = totalInvoice * (appState.downPaymentPct / 100);
  const loanPrincipal = totalInvoice - downPaymentIdr;

  // Collateral schedule over 36 months
  const collateralSchedule = useMemo(() => {
    const intervals = [0, 6, 12, 18, 24, 30, 36];
    return intervals.map((m) => {
      const dep = calculateDepreciatedCCR(totalInvoice, loanPrincipal, appState.tenorMonths, m, 0.15);
      return {
        month: m,
        marketValue: dep.marketValue,
        remainingPrincipal: dep.remainingPrincipal,
        ccrPct: dep.ccrPct,
      };
    });
  }, [totalInvoice, loanPrincipal, appState.tenorMonths]);

  // Macro shock scenario table
  const macroScenarios = useMemo(() => {
    const shocks = [0, -10, -20, -30];
    return shocks.map((s) => {
      const miningRes = evaluateCreditApplication({ ...appState, sector: "mining", hbaCommodityShockPct: s });
      const agroRes = evaluateCreditApplication({ ...appState, sector: "plantation", hbaCommodityShockPct: s });
      const civilRes = evaluateCreditApplication({ ...appState, sector: "construction", hbaCommodityShockPct: s });
      return {
        shock: s,
        miningPd: miningRes.stressedPdPct,
        miningScore: miningRes.score,
        agroPd: agroRes.stressedPdPct,
        agroScore: agroRes.score,
        civilPd: civilRes.stressedPdPct,
        civilScore: civilRes.score,
      };
    });
  }, [appState]);

  const formatIdr = (val: number) => {
    if (val >= 1000000000) {
      return `IDR ${(val / 1000000000).toFixed(2)}B`;
    } else if (val >= 1000000) {
      return `IDR ${(val / 1000000).toFixed(1)}M`;
    }
    return `IDR ${val.toLocaleString()}`;
  };

  return (
    <div
      style={{
        marginTop: "2.5rem",
        marginBottom: "3rem",
        border: "1px solid var(--line)",
        borderRadius: "4px",
        backgroundColor: "var(--panel)",
        overflow: "hidden",
      }}
    >
      {/* Telemetry Header */}
      <div
        style={{
          padding: "12px 18px",
          backgroundColor: "var(--surface)",
          borderBottom: "1px solid var(--line)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
          fontFamily: "var(--font-mono), monospace",
          fontSize: "11px",
          letterSpacing: "0.04em",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981" }} />
          <strong>CREDIT RISK ANALYST STUDIO</strong>
          <span style={{ color: "var(--text-muted)" }}>// BASEL II 5C ENGINE</span>
        </div>
        <div style={{ display: "flex", gap: "16px", color: "var(--text-muted)" }}>
          <span>AUC: <strong style={{ color: "var(--text)" }}>0.8688</strong></span>
          <span>KS: <strong style={{ color: "var(--text)" }}>56.13%</strong></span>
          <span>GINI: <strong style={{ color: "var(--text)" }}>0.7229</strong></span>
          <span>PDO: <strong style={{ color: "var(--text)" }}>20</strong></span>
        </div>
      </div>

      {/* Preset Applicant Selector Strip */}
      <div
        style={{
          padding: "12px 18px",
          backgroundColor: "rgba(255, 255, 255, 0.02)",
          borderBottom: "1px solid var(--line)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--text-muted)", marginRight: "4px" }}>
          PRESET APPLICANTS:
        </span>
        {PRESET_APPLICANTS.map((preset, idx) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => handleSelectPreset(idx)}
            style={{
              padding: "5px 10px",
              fontFamily: "var(--font-mono), monospace",
              fontSize: "11px",
              border: selectedPresetIdx === idx ? "1px solid var(--accent, #3b82f6)" : "1px solid var(--line)",
              backgroundColor: selectedPresetIdx === idx ? "rgba(59, 130, 246, 0.15)" : "transparent",
              color: selectedPresetIdx === idx ? "#60a5fa" : "var(--text-muted)",
              borderRadius: "3px",
              cursor: "pointer",
            }}
          >
            {preset.name.replace("PT ", "").replace("CV ", "")}
          </button>
        ))}
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--line)",
          backgroundColor: "var(--surface)",
        }}
      >
        {[
          { id: "underwriting", label: "01. Underwriting & Scorecard" },
          { id: "collateral", label: "02. Collateral & Depreciation Schedule" },
          { id: "macro", label: "03. Macro Stress Overlay (HBA)" },
          { id: "memo", label: "04. Credit Memo (NAK Preview)" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            style={{
              flex: 1,
              padding: "11px 14px",
              fontFamily: "var(--font-mono), monospace",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.03em",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid var(--accent, #3b82f6)" : "2px solid transparent",
              backgroundColor: activeTab === tab.id ? "var(--panel)" : "transparent",
              color: activeTab === tab.id ? "var(--text)" : "var(--text-muted)",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Tab Content */}
      <div style={{ padding: "20px" }}>
        {activeTab === "underwriting" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
            {/* Left Column: Interactive Parameters */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "12px", fontWeight: 700, borderBottom: "1px solid var(--line)", paddingBottom: "6px" }}>
                // APPLICATION & 5C PARAMETERS
              </div>

              {/* Sector & Equipment */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>
                    SEKTOR INDUSTRI
                  </label>
                  <select
                    value={appState.sector}
                    onChange={(e) => setAppState((p) => ({ ...p, sector: e.target.value as CreditApplicationInput["sector"] }))}
                    style={{
                      width: "100%",
                      padding: "8px",
                      backgroundColor: "var(--surface)",
                      color: "var(--text)",
                      border: "1px solid var(--line)",
                      borderRadius: "3px",
                      fontSize: "12px",
                      fontFamily: "var(--font-mono), monospace",
                    }}
                  >
                    <option value="mining">Pertambangan Batu Bara</option>
                    <option value="plantation">Perkebunan Kelapa Sawit</option>
                    <option value="construction">Konstruksi & Sipil</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>
                    JENIS ALAT BERAT
                  </label>
                  <select
                    value={appState.equipmentType}
                    onChange={(e) => handleEquipmentChange(e.target.value as CreditApplicationInput["equipmentType"])}
                    style={{
                      width: "100%",
                      padding: "8px",
                      backgroundColor: "var(--surface)",
                      color: "var(--text)",
                      border: "1px solid var(--line)",
                      borderRadius: "3px",
                      fontSize: "12px",
                      fontFamily: "var(--font-mono), monospace",
                    }}
                  >
                    {EQUIPMENT_CATALOG.map((eq) => (
                      <option key={eq.type} value={eq.type}>
                        {eq.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Unit Count & Down Payment */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <label style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--text-muted)" }}>
                      JUMLAH UNIT
                    </label>
                    <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", fontWeight: 700 }}>
                      {appState.unitCount} Unit
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={appState.unitCount}
                    onChange={(e) => setAppState((p) => ({ ...p, unitCount: Number(e.target.value) }))}
                    style={{ width: "100%" }}
                  />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <label style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--text-muted)" }}>
                      UANG MUKA (DP)
                    </label>
                    <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", fontWeight: 700 }}>
                      {appState.downPaymentPct}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={40}
                    step={5}
                    value={appState.downPaymentPct}
                    onChange={(e) => setAppState((p) => ({ ...p, downPaymentPct: Number(e.target.value) }))}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              {/* Tenor & Interest Rate */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <label style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--text-muted)" }}>
                      TENOR PEMBIAYAAN
                    </label>
                    <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", fontWeight: 700 }}>
                      {appState.tenorMonths} Bulan
                    </span>
                  </div>
                  <input
                    type="range"
                    min={12}
                    max={48}
                    step={12}
                    value={appState.tenorMonths}
                    onChange={(e) => setAppState((p) => ({ ...p, tenorMonths: Number(e.target.value) }))}
                    style={{ width: "100%" }}
                  />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <label style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--text-muted)" }}>
                      SUKU BUNGA P.A.
                    </label>
                    <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", fontWeight: 700 }}>
                      {appState.interestRateAnnualPct.toFixed(2)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={9.0}
                    max={16.0}
                    step={0.25}
                    value={appState.interestRateAnnualPct}
                    onChange={(e) => setAppState((p) => ({ ...p, interestRateAnnualPct: Number(e.target.value) }))}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              {/* Character: Delinquency History */}
              <div style={{ padding: "10px 14px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "3px" }}>
                <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", fontWeight: 700, marginBottom: "8px" }}>
                  CHARACTER (BIRO KREDIT / SLIK OJK)
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono), monospace" }}>
                    Tunggakan 30-59 Hari (DPD):
                  </span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {[0, 1, 2, 3].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setAppState((p) => ({ ...p, pastDelinquencyCodesCount: cnt }))}
                        style={{
                          padding: "3px 8px",
                          fontFamily: "var(--font-mono), monospace",
                          fontSize: "11px",
                          border: appState.pastDelinquencyCodesCount === cnt ? "1px solid #3b82f6" : "1px solid var(--line)",
                          backgroundColor: appState.pastDelinquencyCodesCount === cnt ? "#2563eb" : "transparent",
                          color: appState.pastDelinquencyCodesCount === cnt ? "#fff" : "var(--text-muted)",
                          borderRadius: "2px",
                          cursor: "pointer",
                        }}
                      >
                        {cnt}x
                      </button>
                    ))}
                  </div>
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", fontFamily: "var(--font-mono), monospace", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={appState.hasSevereDelinquency}
                    onChange={(e) => setAppState((p) => ({ ...p, hasSevereDelinquency: e.target.checked }))}
                  />
                  <span>Ada Riwayat Macet 90+ DPD / Kode Error 96-98</span>
                </label>
              </div>

              {/* Condition: Macro Shock Slider */}
              <div style={{ padding: "10px 14px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "3px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", fontWeight: 700 }}>
                    CONDITION: ESDM HBA COMMODITY SHOCK
                  </span>
                  <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: appState.hbaCommodityShockPct < 0 ? "#ef4444" : "#10b981", fontWeight: 700 }}>
                    {appState.hbaCommodityShockPct}% Drop
                  </span>
                </div>
                <input
                  type="range"
                  min={-35}
                  max={0}
                  step={5}
                  value={appState.hbaCommodityShockPct}
                  onChange={(e) => setAppState((p) => ({ ...p, hbaCommodityShockPct: Number(e.target.value) }))}
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            {/* Right Column: Scorecard Gauge & Underwriting Verdict */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "12px", fontWeight: 700, borderBottom: "1px solid var(--line)", paddingBottom: "6px" }}>
                // UNDERWRITING SCORECARD VERDICT
              </div>

              {/* Main Score & Recommendation Card */}
              <div
                style={{
                  padding: "18px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "4px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>
                  BASEL II CREDIT SCORE (SCALE 300 - 850)
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "48px",
                    fontWeight: 800,
                    lineHeight: 1.1,
                    color:
                      evalResult.score >= 750
                        ? "#10b981"
                        : evalResult.score >= 680
                        ? "#3b82f6"
                        : evalResult.score >= 620
                        ? "#f59e0b"
                        : evalResult.score >= 550
                        ? "#f97316"
                        : "#ef4444",
                  }}
                >
                  {evalResult.score}
                </div>

                <div style={{ display: "flex", gap: "8px", marginTop: "8px", alignItems: "center" }}>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: "2px",
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "12px",
                      fontWeight: 700,
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    TIER: {evalResult.ratingTier}
                  </span>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: "2px",
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "12px",
                      fontWeight: 700,
                      backgroundColor:
                        evalResult.ratingTier === "AAA" || evalResult.ratingTier === "AA"
                          ? "rgba(16, 185, 129, 0.15)"
                          : evalResult.ratingTier === "A"
                          ? "rgba(245, 158, 11, 0.15)"
                          : "rgba(239, 68, 68, 0.15)",
                      color:
                        evalResult.ratingTier === "AAA" || evalResult.ratingTier === "AA"
                          ? "#10b981"
                          : evalResult.ratingTier === "A"
                          ? "#f59e0b"
                          : "#ef4444",
                    }}
                  >
                    {evalResult.recommendation.toUpperCase()}
                  </span>
                </div>

                <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "12px", marginBottom: 0, maxWidth: "340px" }}>
                  Calibrated via Logistic & HistGradientBoosting with PDO=20, Base=600 at 50:1.
                  Stressed PD: <strong>{evalResult.stressedPdPct}%</strong> | LGD: <strong>{evalResult.lgdPct}%</strong>
                </p>
              </div>

              {/* 5C Covenant Checks Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {/* DSCR */}
                <div style={{ padding: "10px 12px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "3px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "10px", color: "var(--text-muted)" }}>
                      CAPACITY (DSCR)
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontFamily: "var(--font-mono), monospace",
                        fontWeight: 700,
                        color: evalResult.isDscrCompliant ? "#10b981" : "#ef4444",
                      }}
                    >
                      {evalResult.isDscrCompliant ? "PASS (>=1.15x)" : "FAIL (<1.15x)"}
                    </span>
                  </div>
                  <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "20px", fontWeight: 700, marginTop: "4px" }}>
                    {evalResult.dscr}x
                  </div>
                </div>

                {/* DER */}
                <div style={{ padding: "10px 12px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "3px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "10px", color: "var(--text-muted)" }}>
                      CAPITAL (DER)
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontFamily: "var(--font-mono), monospace",
                        fontWeight: 700,
                        color: evalResult.isDerCompliant ? "#10b981" : "#ef4444",
                      }}
                    >
                      {evalResult.isDerCompliant ? "PASS (<=2.0x)" : "FAIL (>2.0x)"}
                    </span>
                  </div>
                  <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "20px", fontWeight: 700, marginTop: "4px" }}>
                    {evalResult.der}x
                  </div>
                </div>

                {/* CCR Day 0 */}
                <div style={{ padding: "10px 12px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "3px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "10px", color: "var(--text-muted)" }}>
                      COLLATERAL (DAY 0 CCR)
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontFamily: "var(--font-mono), monospace",
                        fontWeight: 700,
                        color: evalResult.isCcrCompliant ? "#10b981" : "#ef4444",
                      }}
                    >
                      {evalResult.isCcrCompliant ? "PASS (>=120%)" : "FAIL (<120%)"}
                    </span>
                  </div>
                  <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "20px", fontWeight: 700, marginTop: "4px" }}>
                    {evalResult.ccrDay0Pct}%
                  </div>
                </div>

                {/* Expected Loss */}
                <div style={{ padding: "10px 12px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "3px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "10px", color: "var(--text-muted)" }}>
                      EXPECTED LOSS (EL)
                    </span>
                    <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--text-muted)" }}>
                      {evalResult.elRatioPct}% EAD
                    </span>
                  </div>
                  <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "16px", fontWeight: 700, marginTop: "4px" }}>
                    {formatIdr(evalResult.expectedLossIdr)}
                  </div>
                </div>
              </div>

              {/* Exposure Summary Strip */}
              <div
                style={{
                  padding: "10px 14px",
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid var(--line)",
                  borderRadius: "3px",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "11px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>TOTAL OTR: <strong>{formatIdr(totalInvoice)}</strong></span>
                <span>DP: <strong>{formatIdr(downPaymentIdr)} ({appState.downPaymentPct}%)</strong></span>
                <span>EAD: <strong>{formatIdr(loanPrincipal)}</strong></span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "collateral" && (
          <div>
            <div style={{ marginBottom: "16px" }}>
              <h3 style={{ fontSize: "14px", fontFamily: "var(--font-mono), monospace", fontWeight: 700, margin: "0 0 6px 0" }}>
                COLLATERAL DEPRECIATION VS PRINCIPAL AMORTIZATION (36-MONTH TRACK)
              </h3>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
                Heavy equipment undergoes a ~15% annual declining balance market depreciation. Because loan principal amortizes at a faster linear rate,
                the Collateral Coverage Ratio (CCR) strengthens over time, mitigating secondary market liquidation risk.
              </p>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-mono), monospace", fontSize: "12px" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
                    <th style={{ textAlign: "left", padding: "8px 12px" }}>TIMELINE</th>
                    <th style={{ textAlign: "right", padding: "8px 12px" }}>APPRAISED MARKET VALUE</th>
                    <th style={{ textAlign: "right", padding: "8px 12px" }}>REMAINING PRINCIPAL</th>
                    <th style={{ textAlign: "right", padding: "8px 12px" }}>COLLATERAL COVERAGE (CCR)</th>
                    <th style={{ textAlign: "center", padding: "8px 12px" }}>RISK BUFFER STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {collateralSchedule.map((row) => (
                    <tr key={row.month} style={{ borderBottom: "1px solid var(--line)" }}>
                      <td style={{ padding: "8px 12px" }}>
                        {row.month === 0 ? "Month 0 (Origination)" : `Month ${row.month} (${row.month / 12} Yrs)`}
                      </td>
                      <td style={{ textAlign: "right", padding: "8px 12px" }}>{formatIdr(row.marketValue)}</td>
                      <td style={{ textAlign: "right", padding: "8px 12px" }}>{formatIdr(row.remainingPrincipal)}</td>
                      <td style={{ textAlign: "right", padding: "8px 12px", fontWeight: 700, color: row.ccrPct >= 120 ? "#10b981" : "#ef4444" }}>
                        {row.ccrPct}%
                      </td>
                      <td style={{ textAlign: "center", padding: "8px 12px" }}>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: "2px",
                            fontSize: "10px",
                            backgroundColor: row.ccrPct >= 140 ? "rgba(16, 185, 129, 0.15)" : "rgba(59, 130, 246, 0.15)",
                            color: row.ccrPct >= 140 ? "#10b981" : "#60a5fa",
                          }}
                        >
                          {row.ccrPct >= 140 ? "ADEQUATE BUFFER" : "BASELINE SECURED"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "macro" && (
          <div>
            <div style={{ marginBottom: "16px" }}>
              <h3 style={{ fontSize: "14px", fontFamily: "var(--font-mono), monospace", fontWeight: 700, margin: "0 0 6px 0" }}>
                ESDM HBA & COMMODITY CYCLE SENSITIVITY STRESS TEST
              </h3>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
                Simulates default probability (PD) escalation and credit score degradation across sectors under severe commodity downturns.
                Mining contractors exhibit the highest sensitivity (elasticity ~1.75x) to coal price contractions.
              </p>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-mono), monospace", fontSize: "12px" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
                    <th style={{ textAlign: "left", padding: "8px 12px" }}>COMMODITY SHOCK SCENARIO</th>
                    <th style={{ textAlign: "right", padding: "8px 12px" }}>MINING PD (%)</th>
                    <th style={{ textAlign: "right", padding: "8px 12px" }}>MINING SCORE</th>
                    <th style={{ textAlign: "right", padding: "8px 12px" }}>AGRO PD (%)</th>
                    <th style={{ textAlign: "right", padding: "8px 12px" }}>AGRO SCORE</th>
                    <th style={{ textAlign: "right", padding: "8px 12px" }}>CONSTRUCTION PD (%)</th>
                    <th style={{ textAlign: "right", padding: "8px 12px" }}>CONSTRUCTION SCORE</th>
                  </tr>
                </thead>
                <tbody>
                  {macroScenarios.map((scen) => (
                    <tr key={scen.shock} style={{ borderBottom: "1px solid var(--line)" }}>
                      <td style={{ padding: "8px 12px", fontWeight: 600 }}>
                        {scen.shock === 0 ? "Baseline (Current HBA)" : `Stressed (${scen.shock}% Drop)`}
                      </td>
                      <td style={{ textAlign: "right", padding: "8px 12px", color: "#f87171" }}>{scen.miningPd}%</td>
                      <td style={{ textAlign: "right", padding: "8px 12px", fontWeight: 700 }}>{scen.miningScore}</td>
                      <td style={{ textAlign: "right", padding: "8px 12px", color: "#fbbf24" }}>{scen.agroPd}%</td>
                      <td style={{ textAlign: "right", padding: "8px 12px", fontWeight: 700 }}>{scen.agroScore}</td>
                      <td style={{ textAlign: "right", padding: "8px 12px", color: "#60a5fa" }}>{scen.civilPd}%</td>
                      <td style={{ textAlign: "right", padding: "8px 12px", fontWeight: 700 }}>{scen.civilScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "memo" && (
          <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", lineHeight: 1.6 }}>
            <div style={{ border: "1px solid var(--line)", padding: "16px", backgroundColor: "var(--surface)", borderRadius: "3px" }}>
              <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px", marginBottom: "12px", display: "flex", justifyContent: "space-between" }}>
                <strong>NOTA ANALISIS KREDIT (NAK) — CREDIT COMMITTEE MEMO</strong>
                <span style={{ color: "var(--text-muted)" }}>REF: CR-ALAT-BERAT/2026/MEMO-AUTO</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                <div>
                  <div>DEBITUR: <strong>{appState.companyName}</strong></div>
                  <div>SEKTOR: <strong>{appState.sector.toUpperCase()}</strong></div>
                  <div>UNIT: <strong>{appState.unitCount}x {appState.equipmentType.toUpperCase()}</strong></div>
                  <div>OTR VALUE: <strong>{formatIdr(totalInvoice)}</strong></div>
                </div>
                <div>
                  <div>DP ({appState.downPaymentPct}%): <strong>{formatIdr(downPaymentIdr)}</strong></div>
                  <div>PLAFON (EAD): <strong>{formatIdr(loanPrincipal)}</strong></div>
                  <div>TENOR: <strong>{appState.tenorMonths} BULAN ({appState.interestRateAnnualPct}% P.A.)</strong></div>
                  <div>COLLATERAL DAY 0 CCR: <strong>{evalResult.ccrDay0Pct}%</strong></div>
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--line)", paddingTop: "12px", marginBottom: "16px" }}>
                <strong>5C UNDERWRITING EVALUATION:</strong>
                <div>• Character: {appState.hasSevereDelinquency ? "REJECT (Riwayat 90+ DPD / Kode 96-98 terdeteksi)" : `${appState.pastDelinquencyCodesCount}x tunggakan minor; SLIK OJK patuh.`}</div>
                <div>• Capacity: DSCR = <strong>{evalResult.dscr}x</strong> ({evalResult.isDscrCompliant ? "Memenuhi syarat min. 1.15x" : "Pelanggaran kovenan kas"})</div>
                <div>• Capital: DER = <strong>{evalResult.der}x</strong> ({evalResult.isDerCompliant ? "Memenuhi syarat maks. 2.00x" : "Over-leveraged balance sheet"})</div>
                <div>• Collateral: CCR Day 0 = <strong>{evalResult.ccrDay0Pct}%</strong>; LGD = <strong>{evalResult.lgdPct}%</strong></div>
                <div>• Condition: Macro shock overlay = <strong>{appState.hbaCommodityShockPct}%</strong></div>
              </div>

              <div style={{ borderTop: "1px solid var(--line)", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  SCORE: <strong style={{ fontSize: "14px" }}>{evalResult.score}</strong> | TIER: <strong>{evalResult.ratingTier}</strong> | EXPECTED LOSS: <strong>{formatIdr(evalResult.expectedLossIdr)}</strong>
                </div>
                <div style={{ fontWeight: 700, padding: "4px 12px", backgroundColor: evalResult.ratingTier === "AAA" || evalResult.ratingTier === "AA" ? "#10b981" : "#ef4444", color: "#fff", borderRadius: "2px" }}>
                  VERDICT: {evalResult.recommendation.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
