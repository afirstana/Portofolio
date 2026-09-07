"use client";

import React, { useState, useMemo } from "react";
import rawData from "@/content/data/flight_delay_2024_cube.json";

type Carrier = {
  carrier_code: string;
  carrier_name: string;
  total_flights: number;
  cancelled_flights: number;
  diverted_flights: number;
  delayed_ge15_flights: number;
  ontime_flights: number;
  delay_rate_pct: number;
  cancel_rate_pct: number;
  divert_rate_pct: number;
  early_rate_pct: number;
  mean_dep_delay: number;
  mean_arr_delay: number;
  carrier_delay_min: number;
  weather_delay_min: number;
  nas_delay_min: number;
  security_delay_min: number;
  late_aircraft_delay_min: number;
};

type Airport = {
  airport_code: string;
  city: string;
  state: string;
  total_departures: number;
  delay_rate_pct: number;
  mean_dep_delay: number;
  mean_taxi_out: number;
};

type Hourly = {
  dep_hour: number;
  total_flights: number;
  delay_rate_pct: number;
  mean_dep_delay: number;
  mean_taxi_out: number;
};

type Monthly = {
  month: number;
  total_flights: number;
  delay_rate_pct: number;
  cancel_rate_pct: number;
  mean_dep_delay: number;
  mean_arr_delay: number;
  weather_delay_min: number;
  carrier_delay_min: number;
  nas_delay_min: number;
  late_aircraft_delay_min: number;
};

const MONTH_NAMES = [
  "All Months (2024)",
  "01 - Jan", "02 - Feb", "03 - Mar", "04 - Apr",
  "05 - May", "06 - Jun", "07 - Jul", "08 - Aug",
  "09 - Sep", "10 - Oct", "11 - Nov", "12 - Dec"
];

const CARRIER_CATEGORIES: Record<string, string> = {
  WN: "Major LCC",
  DL: "Legacy Major",
  AA: "Legacy Major",
  UA: "Legacy Major",
  OO: "Regional Feeder",
  YX: "Regional Feeder",
  MQ: "Regional Feeder",
  NK: "Ultra LCC",
  AS: "Major Carrier",
  B6: "Low-Cost",
  OH: "Regional Feeder",
  F9: "Ultra LCC",
  "9E": "Regional Feeder",
  G4: "Ultra LCC",
  HA: "Island Major"
};

export function FlightDelay2024Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [selectedCarrier, setSelectedCarrier] = useState<string>("ALL");
  const [selectedHub, setSelectedHub] = useState<string>("ALL");
  const [metricMode, setMetricMode] = useState<"arr" | "dep">("arr");

  const [carrierSortKey, setCarrierSortKey] = useState<"volume" | "delay" | "early" | "ripple">("ripple");
  const [carrierSortAsc, setCarrierSortAsc] = useState<boolean>(false);
  const [hoveredHour, setHoveredHour] = useState<Hourly | null>(null);

  const macroKpis = rawData.macro_kpis;
  const carriersList: Carrier[] = rawData.carriers;
  const monthlyList: Monthly[] = rawData.monthly;
  const hourlyList: Hourly[] = rawData.hourly_departure;
  const airportsList: Airport[] = rawData.top_origin_airports;
  const carrierByMonth = rawData.carrier_by_month as Record<string, Record<string, any>>;
  const hubByMonth = rawData.hub_by_month as Record<string, Record<string, any>>;

  const fmtNum = (n: number) => n.toLocaleString();
  const fmtPct = (n: number) => `${n.toFixed(1)}%`;
  const fmtMin = (n: number) => `${n.toFixed(1)}m`;

  const dynamicTelemetry = useMemo(() => {
    let flights = macroKpis.operated_flights;
    let delayRate = macroKpis.overall_delayed_rate_pct;
    let earlyRate = macroKpis.overall_early_rate_pct;
    let meanDelay = metricMode === "arr" ? macroKpis.mean_arr_delay : macroKpis.mean_dep_delay;
    let cancelRate = macroKpis.overall_cancel_rate_pct;

    if (selectedCarrier !== "ALL") {
      const c = carriersList.find((x) => x.carrier_code === selectedCarrier);
      if (c) {
        if (selectedMonth > 0 && carrierByMonth[selectedCarrier]?.[selectedMonth.toString()]) {
          const cm = carrierByMonth[selectedCarrier][selectedMonth.toString()];
          flights = cm.flights;
          delayRate = cm.delay_rate_pct;
          earlyRate = c.early_rate_pct;
          meanDelay = metricMode === "arr" ? cm.mean_arr_delay : cm.mean_dep_delay;
        } else {
          flights = c.total_flights;
          delayRate = c.delay_rate_pct;
          earlyRate = c.early_rate_pct;
          meanDelay = metricMode === "arr" ? c.mean_arr_delay : c.mean_dep_delay;
        }
      }
    } else if (selectedHub !== "ALL") {
      const a = airportsList.find((x) => x.airport_code === selectedHub);
      if (a) {
        if (selectedMonth > 0 && hubByMonth[selectedHub]?.[selectedMonth.toString()]) {
          const hm = hubByMonth[selectedHub][selectedMonth.toString()];
          flights = hm.flights ?? hm.departures;
          delayRate = hm.delay_rate_pct;
          meanDelay = hm.mean_dep_delay;
        } else {
          flights = a.total_departures;
          delayRate = a.delay_rate_pct;
          meanDelay = a.mean_dep_delay;
        }
      }
    } else if (selectedMonth > 0) {
      const m = monthlyList.find((x) => x.month === selectedMonth);
      if (m) {
        flights = m.total_flights;
        delayRate = m.delay_rate_pct;
        cancelRate = m.cancel_rate_pct;
        meanDelay = metricMode === "arr" ? m.mean_arr_delay : m.mean_dep_delay;
      }
    }

    const onTimeRate = Math.max(0, 100 - delayRate - cancelRate);

    return {
      flights,
      delayRate,
      onTimeRate,
      earlyRate,
      meanDelay,
      cancelRate
    };
  }, [selectedMonth, selectedCarrier, selectedHub, metricMode, macroKpis, carriersList, monthlyList, airportsList, carrierByMonth, hubByMonth]);

  const sortedCarriers = useMemo(() => {
    return [...carriersList].sort((a, b) => {
      let valA = 0;
      let valB = 0;
      const mA = selectedMonth > 0 ? carrierByMonth[a.carrier_code]?.[selectedMonth.toString()] : null;
      const mB = selectedMonth > 0 ? carrierByMonth[b.carrier_code]?.[selectedMonth.toString()] : null;

      if (carrierSortKey === "volume") {
        valA = mA ? mA.flights : a.total_flights;
        valB = mB ? mB.flights : b.total_flights;
      } else if (carrierSortKey === "delay") {
        valA = mA ? mA.delay_rate_pct : a.delay_rate_pct;
        valB = mB ? mB.delay_rate_pct : b.delay_rate_pct;
      } else if (carrierSortKey === "early") {
        valA = a.early_rate_pct;
        valB = b.early_rate_pct;
      } else if (carrierSortKey === "ripple") {
        const totalA = a.late_aircraft_delay_min + a.carrier_delay_min + a.nas_delay_min + a.weather_delay_min;
        const totalB = b.late_aircraft_delay_min + b.carrier_delay_min + b.nas_delay_min + b.weather_delay_min;
        valA = totalA > 0 ? (a.late_aircraft_delay_min / totalA) * 100 : 0;
        valB = totalB > 0 ? (b.late_aircraft_delay_min / totalB) * 100 : 0;
      }
      return carrierSortAsc ? valA - valB : valB - valA;
    });
  }, [carriersList, carrierSortKey, carrierSortAsc, selectedMonth, carrierByMonth]);

  const maxHourDelay = 32;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* STATIC SLICER BAR — DOES NOT FOLLOW SCROLL */}
      <header
        style={{
          position: "relative",
          backgroundColor: "var(--panel)",
          border: "1px solid var(--line)",
          borderRadius: 4,
          padding: "16px 20px",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div>
            <span className="mono" style={{ color: "var(--dim)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", display: "block" }}>
              BTS TRANSTATS 2024 • 7,079,081 FLIGHTS
            </span>
            <strong style={{ fontSize: 16, color: "var(--ink-heading)", display: "block", marginTop: 2 }}>
              Delay Attribution &amp; Bottleneck Filter
            </strong>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            {/* Month Filter */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label htmlFor="month-select" className="mono" style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>
                Month
              </label>
              <select
                id="month-select"
                aria-label="Filter by month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                style={{
                  backgroundColor: "var(--panel)",
                  border: "1px solid var(--line)",
                  color: "var(--ink)",
                  fontSize: 13,
                  borderRadius: 3,
                  padding: "7px 12px",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={m} value={idx}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Carrier Filter */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label htmlFor="carrier-select" className="mono" style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>
                Carrier
              </label>
              <select
                id="carrier-select"
                aria-label="Filter by carrier"
                value={selectedCarrier}
                onChange={(e) => setSelectedCarrier(e.target.value)}
                style={{
                  backgroundColor: "var(--panel)",
                  border: "1px solid var(--line)",
                  color: "var(--ink)",
                  fontSize: 13,
                  borderRadius: 3,
                  padding: "7px 12px",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="ALL">All Carriers (15)</option>
                {carriersList.map((c) => (
                  <option key={c.carrier_code} value={c.carrier_code}>
                    {c.carrier_code} — {c.carrier_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Hub Filter */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label htmlFor="hub-select" className="mono" style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>
                Origin Hub
              </label>
              <select
                id="hub-select"
                aria-label="Filter by origin hub"
                value={selectedHub}
                onChange={(e) => setSelectedHub(e.target.value)}
                style={{
                  backgroundColor: "var(--panel)",
                  border: "1px solid var(--line)",
                  color: "var(--ink)",
                  fontSize: 13,
                  borderRadius: 3,
                  padding: "7px 12px",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="ALL">All Hubs (Top 15)</option>
                {airportsList.slice(0, 15).map((a) => (
                  <option key={a.airport_code} value={a.airport_code}>
                    {a.airport_code} ({a.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Metric Mode Toggle */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span className="mono" style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>
                Metric Basis
              </span>
              <div
                style={{
                  display: "inline-flex",
                  borderRadius: 3,
                  border: "1px solid var(--line)",
                  padding: 2,
                  backgroundColor: "var(--panel)",
                }}
              >
                <button
                  type="button"
                  className="mono"
                  onClick={() => setMetricMode("arr")}
                  style={{
                    padding: "6px 12px",
                    fontSize: 12,
                    borderRadius: 2,
                    cursor: "pointer",
                    border: "none",
                    backgroundColor: metricMode === "arr" ? "var(--accent)" : "transparent",
                    color: metricMode === "arr" ? "#ffffff" : "var(--muted)",
                    fontWeight: metricMode === "arr" ? 700 : 500,
                    transition: "all .15s ease",
                  }}
                >
                  Arrival
                </button>
                <button
                  type="button"
                  className="mono"
                  onClick={() => setMetricMode("dep")}
                  style={{
                    padding: "6px 12px",
                    fontSize: 12,
                    borderRadius: 2,
                    cursor: "pointer",
                    border: "none",
                    backgroundColor: metricMode === "dep" ? "var(--accent)" : "transparent",
                    color: metricMode === "dep" ? "#ffffff" : "var(--muted)",
                    fontWeight: metricMode === "dep" ? 700 : 500,
                    transition: "all .15s ease",
                  }}
                >
                  Departure
                </button>
              </div>
            </div>

            {/* Reset Button */}
            {(selectedMonth !== 0 || selectedCarrier !== "ALL" || selectedHub !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSelectedMonth(0);
                  setSelectedCarrier("ALL");
                  setSelectedHub("ALL");
                }}
                className="mono"
                style={{
                  alignSelf: "flex-end",
                  padding: "7px 12px",
                  fontSize: 11.5,
                  color: "var(--ink-heading)",
                  border: "1px solid var(--line-strong)",
                  borderRadius: 3,
                  backgroundColor: "var(--surface)",
                  cursor: "pointer",
                  transition: "all .15s ease",
                }}
              >
                ↺ Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Telemetry Summary Ticker */}
        <div
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: "1px solid var(--line)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 14,
            fontSize: 12,
            color: "var(--muted)",
          }}
        >
          <div className="mono" style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", fontSize: 11.5 }}>
            <span>
              FILTERED: <strong style={{ color: "var(--ink-heading)", fontSize: 13 }}>{fmtNum(dynamicTelemetry.flights)}</strong>
            </span>
            <span style={{ color: "var(--line-strong)" }}>|</span>
            <span>
              ON-TIME (&lt;15M): <strong style={{ color: "var(--ink-heading)", fontSize: 13 }}>{fmtPct(dynamicTelemetry.onTimeRate)}</strong>
            </span>
            <span style={{ color: "var(--line-strong)" }}>|</span>
            <span>
              DELAY RATE: <strong style={{ color: "var(--accent)", fontSize: 13 }}>{fmtPct(dynamicTelemetry.delayRate)}</strong>
            </span>
            <span style={{ color: "var(--line-strong)" }}>|</span>
            <span>
              MEAN DELAY: <strong style={{ color: "var(--ink-heading)", fontSize: 13 }}>{fmtMin(dynamicTelemetry.meanDelay)}</strong>
            </span>
          </div>
          <div className="mono" style={{ fontSize: 10.5, color: "var(--muted)" }}>
            BTS TRANSTATS 2024 CENSUS
          </div>
        </div>
      </header>

      {/* MODULE 1: MACRO OPERATIONAL TELEMETRY — DISCIPLINED HIGH-CONTRAST MONOCHROME */}
      <section id="macro-telemetry">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 1,
            backgroundColor: "var(--line)",
            border: "1px solid var(--line)",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div style={{ backgroundColor: "var(--panel)", padding: "20px 22px" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--muted)", display: "block", letterSpacing: "0.06em" }}>
              OPERATED FLIGHT VOLUME
            </span>
            <strong className="mono" style={{ fontSize: 28, color: "var(--ink-heading)", display: "block", marginTop: 8 }}>
              {fmtNum(dynamicTelemetry.flights)}
            </strong>
            <span style={{ fontSize: 12.5, color: "var(--muted)", display: "block", marginTop: 6 }}>
              {selectedCarrier !== "ALL" ? `${selectedCarrier} Operations` : selectedHub !== "ALL" ? `${selectedHub} Departures` : "National Fleet Census"}
            </span>
            <div style={{ width: "100%", height: 3, backgroundColor: "var(--surface-secondary)", borderRadius: 2, marginTop: 14, overflow: "hidden" }}>
              <div
                style={{
                  width: `${Math.min((dynamicTelemetry.flights / macroKpis.operated_flights) * 100, 100)}%`,
                  height: "100%",
                  backgroundColor: "var(--line-strong)",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "20px 22px" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--muted)", display: "block", letterSpacing: "0.06em" }}>
              FAA ON-TIME RATE (OTP)
            </span>
            <strong className="mono" style={{ fontSize: 28, color: "var(--ink-heading)", display: "block", marginTop: 8 }}>
              {fmtPct(dynamicTelemetry.onTimeRate)}
            </strong>
            <span style={{ fontSize: 12.5, color: "var(--muted)", display: "block", marginTop: 6 }}>
              Arrival within 14m of scheduled CRS
            </span>
            <div style={{ width: "100%", height: 3, backgroundColor: "var(--surface-secondary)", borderRadius: 2, marginTop: 14, overflow: "hidden" }}>
              <div
                style={{
                  width: `${Math.min(dynamicTelemetry.onTimeRate, 100)}%`,
                  height: "100%",
                  backgroundColor: "var(--line-strong)",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>

          {/* Core Problem KPI: Delay Escalation Highlighted */}
          <div style={{ backgroundColor: "var(--panel)", padding: "20px 22px", borderTop: "3px solid var(--accent)" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--accent)", display: "block", letterSpacing: "0.06em", fontWeight: 700 }}>
              PROBLEM: DELAY RATE (≥15M)
            </span>
            <strong className="mono" style={{ fontSize: 28, color: "var(--accent)", display: "block", marginTop: 8 }}>
              {fmtPct(dynamicTelemetry.delayRate)}
            </strong>
            <span style={{ fontSize: 12.5, color: "var(--muted)", display: "block", marginTop: 6 }}>
              Mean Delay: {fmtMin(dynamicTelemetry.meanDelay)} (103.8M min total)
            </span>
            <div style={{ width: "100%", height: 3, backgroundColor: "var(--surface-secondary)", borderRadius: 2, marginTop: 14, overflow: "hidden" }}>
              <div
                style={{
                  width: `${Math.min((dynamicTelemetry.delayRate / 35) * 100, 100)}%`,
                  height: "100%",
                  backgroundColor: "var(--accent)",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "20px 22px" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--muted)", display: "block", letterSpacing: "0.06em" }}>
              CANCELLATION RATE
            </span>
            <strong className="mono" style={{ fontSize: 28, color: "var(--ink-heading)", display: "block", marginTop: 8 }}>
              {fmtPct(dynamicTelemetry.cancelRate)}
            </strong>
            <span style={{ fontSize: 12.5, color: "var(--muted)", display: "block", marginTop: 6 }}>
              55.7% weather ground stops | 32.1% crew timeouts
            </span>
            <div style={{ width: "100%", height: 3, backgroundColor: "var(--surface-secondary)", borderRadius: 2, marginTop: 14, overflow: "hidden" }}>
              <div
                style={{
                  width: `${Math.min((dynamicTelemetry.cancelRate / 5) * 100, 100)}%`,
                  height: "100%",
                  backgroundColor: "var(--line-strong)",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* MODULE 2: DIURNAL DELAY PROGRESSION — FOCUSED ON THE 3.3x COMPOUNDING PROBLEM */}
      <section
        id="afternoon-wave"
        style={{
          backgroundColor: "var(--panel)",
          border: "1px solid var(--line)",
          borderRadius: 4,
          padding: "26px 24px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14, borderBottom: "1px solid var(--line)", paddingBottom: 18, marginBottom: 22 }}>
          <div>
            <span className="mono" style={{ color: "var(--accent)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>
              PROBLEM DIAGNOSTICS: 24-HOUR DIURNAL ESCALATION
            </span>
            <h3 style={{ fontSize: "clamp(20px, 2.4vw, 26px)", color: "var(--ink-heading)", letterSpacing: "-0.03em", margin: "4px 0 0", fontWeight: 700 }}>
              02. Diurnal Delay Progression: The 3.3× Compounding Peak
            </h3>
            <p style={{ fontSize: 14, color: "var(--muted)", margin: "8px 0 0", maxWidth: 840, lineHeight: 1.6 }}>
              Early morning flights (05:00) launch with clean aircraft rotations (<strong>8.9% delay</strong>). As turn delay accumulates without buffer recovery, evening departures escalate non-linearly to <strong>29.8% by 20:00 (a 3.3× risk surge)</strong>.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: "var(--line-strong)", display: "inline-block" }} />
              <span className="mono" style={{ fontSize: 11.5, color: "var(--muted)" }}>HOURLY DELAY RATE (%)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: "var(--accent)", display: "inline-block" }} />
              <span className="mono" style={{ fontSize: 11.5, color: "var(--accent)", fontWeight: 700 }}>PROBLEM PEAK (18:00–20:00)</span>
            </div>
          </div>
        </div>

        {/* Spacious 270px Bar Chart with Disciplined Monochrome Baseline and Accent on Problem */}
        <div style={{ width: "100%", overflowX: "auto" }}>
          <div style={{ minWidth: 700, height: 270, position: "relative", display: "flex", alignItems: "flex-end", gap: 5, paddingBottom: 30, borderBottom: "1px solid var(--line)" }}>
            {/* Horizontal Percentage Gridlines */}
            {[10, 20, 30].map((pct) => {
              const bottomPct = (pct / maxHourDelay) * (240 / 270) * 100;
              return (
                <div
                  key={pct}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: `${bottomPct + 10}%`,
                    borderTop: "1px dashed var(--line)",
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                >
                  <span
                    className="mono"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: -16,
                      fontSize: 10.5,
                      color: "var(--muted)",
                      backgroundColor: "var(--panel)",
                      padding: "0 4px",
                    }}
                  >
                    {pct}%
                  </span>
                </div>
              );
            })}

            {hourlyList.map((h) => {
              const barHeightPct = (h.delay_rate_pct / maxHourDelay) * 100;
              const isPeakProblem = h.dep_hour >= 18 && h.dep_hour <= 20;
              const isHovered = hoveredHour?.dep_hour === h.dep_hour;

              return (
                <div
                  key={h.dep_hour}
                  onMouseEnter={() => setHoveredHour(h)}
                  onMouseLeave={() => setHoveredHour(null)}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    height: "100%",
                    position: "relative",
                    cursor: "pointer",
                    zIndex: 2,
                  }}
                >
                  {isHovered && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "100%",
                        marginBottom: 10,
                        zIndex: 30,
                        backgroundColor: "var(--surface)",
                        border: "1px solid var(--line-strong)",
                        borderRadius: 4,
                        padding: "10px 14px",
                        boxShadow: "0 14px 32px rgba(0,0,0,0.6)",
                        minWidth: 190,
                        pointerEvents: "none",
                      }}
                    >
                      <div className="mono" style={{ color: isPeakProblem ? "var(--accent)" : "var(--ink-heading)", fontWeight: 700, borderBottom: "1px solid var(--line)", paddingBottom: 5, marginBottom: 6, fontSize: 12.5 }}>
                        HOUR {h.dep_hour.toString().padStart(2, "0")}:00 CRS
                      </div>
                      <div className="mono" style={{ display: "flex", justifyContent: "space-between", gap: 10, margin: "3px 0", fontSize: 11.5 }}>
                        <span style={{ color: "var(--muted)" }}>VOLUME:</span>
                        <strong style={{ color: "var(--ink-heading)" }}>{fmtNum(h.total_flights)}</strong>
                      </div>
                      <div className="mono" style={{ display: "flex", justifyContent: "space-between", gap: 10, margin: "3px 0", fontSize: 11.5 }}>
                        <span style={{ color: "var(--muted)" }}>DELAY:</span>
                        <strong style={{ color: isPeakProblem ? "var(--accent)" : "var(--ink-heading)" }}>{fmtPct(h.delay_rate_pct)}</strong>
                      </div>
                      <div className="mono" style={{ display: "flex", justifyContent: "space-between", gap: 10, margin: "3px 0", fontSize: 11.5 }}>
                        <span style={{ color: "var(--muted)" }}>MEAN DEP:</span>
                        <strong style={{ color: "var(--ink)" }}>{fmtMin(h.mean_dep_delay)}</strong>
                      </div>
                      <div className="mono" style={{ display: "flex", justifyContent: "space-between", gap: 10, margin: "3px 0", fontSize: 11.5 }}>
                        <span style={{ color: "var(--muted)" }}>TAXI-OUT:</span>
                        <strong style={{ color: "var(--ink)" }}>{fmtMin(h.mean_taxi_out)}</strong>
                      </div>
                    </div>
                  )}

                  <div
                    style={{
                      width: "100%",
                      borderRadius: "2px 2px 0 0",
                      transition: "all 0.15s ease",
                      height: `${barHeightPct}%`,
                      backgroundColor: isPeakProblem
                        ? "var(--accent)"
                        : isHovered
                        ? "var(--ink-heading)"
                        : "var(--line-strong)",
                      opacity: isHovered ? 1 : 0.85,
                      boxShadow: isPeakProblem ? "0 0 10px rgba(255, 77, 28, 0.3)" : "none",
                    }}
                  />

                  <span
                    className="mono"
                    style={{
                      position: "absolute",
                      top: "100%",
                      marginTop: 8,
                      fontSize: 11,
                      color: isPeakProblem ? "var(--accent)" : isHovered ? "var(--ink-heading)" : "var(--muted)",
                      fontWeight: isPeakProblem || isHovered ? 700 : 500,
                    }}
                  >
                    {h.dep_hour.toString().padStart(2, "0")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3-COLUMN PROBLEM PROGRESSION STRIP */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 1,
            backgroundColor: "var(--line)",
            border: "1px solid var(--line)",
            marginTop: 20,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div style={{ backgroundColor: "var(--panel)", padding: "14px 18px" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--muted)", display: "block" }}>
              05:00–06:00 LAUNCH BASELINE
            </span>
            <strong className="mono" style={{ fontSize: 18, color: "var(--ink-heading)", display: "block", marginTop: 4 }}>
              8.9% – 9.4%
            </strong>
            <span style={{ fontSize: 12, color: "var(--muted)", display: "block", marginTop: 2 }}>Clean overnight turns</span>
          </div>
          <div style={{ backgroundColor: "var(--panel)", padding: "14px 18px" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--muted)", display: "block" }}>
              12:00–14:00 MIDDAY WAVE
            </span>
            <strong className="mono" style={{ fontSize: 18, color: "var(--ink-heading)", display: "block", marginTop: 4 }}>
              18.9% – 23.0%
            </strong>
            <span style={{ fontSize: 12, color: "var(--muted)", display: "block", marginTop: 2 }}>Turn buffers start eroding</span>
          </div>
          <div style={{ backgroundColor: "var(--panel)", padding: "14px 18px", borderLeft: "3px solid var(--accent)" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--accent)", display: "block", fontWeight: 700 }}>
              18:00–20:00 PEAK COMPOUNDING
            </span>
            <strong className="mono" style={{ fontSize: 18, color: "var(--accent)", display: "block", marginTop: 4 }}>
              28.8% – 29.8%
            </strong>
            <span style={{ fontSize: 12, color: "var(--muted)", display: "block", marginTop: 2 }}>3.3× diurnal risk multiplier</span>
          </div>
        </div>
      </section>

      {/* MODULE 3: CARRIER LEAGUE TABLE — FOCUSED ON RIPPLE VULNERABILITY */}
      <section
        id="carrier-league"
        style={{
          backgroundColor: "var(--panel)",
          border: "1px solid var(--line)",
          borderRadius: 4,
          padding: "26px 24px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14, borderBottom: "1px solid var(--line)", paddingBottom: 18, marginBottom: 22 }}>
          <div>
            <span className="mono" style={{ color: "var(--accent)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>
              PROBLEM METRIC: LATE AIRCRAFT RIPPLE DOMINANCE
            </span>
            <h3 style={{ fontSize: "clamp(20px, 2.4vw, 26px)", color: "var(--ink-heading)", letterSpacing: "-0.03em", margin: "4px 0 0", fontWeight: 700 }}>
              03. Carrier Performance &amp; Turnaround Ripple Attribution
            </h3>
            <p style={{ fontSize: 14, color: "var(--muted)", margin: "8px 0 0", maxWidth: 840, lineHeight: 1.6 }}>
              Upstream late-aircraft ripple accounts for over <strong>50% of delay minutes</strong> at Southwest (WN: 51.8%) and Frontier (F9: 54.3%). Point-to-point networks with tight turnaround buffers are inherently vulnerable to cascading network delays.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              <span className="mono" style={{ fontSize: 10.5, color: "var(--muted)", letterSpacing: "0.06em" }}>
                TABLE SCOPE:
              </span>
              <span className="mono" style={{ fontSize: 11, padding: "3px 8px", borderRadius: 2, backgroundColor: selectedMonth > 0 ? "var(--surface-secondary)" : "var(--panel)", border: "1px solid var(--line-strong)", color: "var(--ink-heading)", fontWeight: 600 }}>
                {selectedMonth > 0 ? `${MONTH_NAMES[selectedMonth]} 2024` : "Full Year 2024 (7.08M Flights)"}
              </span>
              {selectedCarrier !== "ALL" && (
                <span className="mono" style={{ fontSize: 11, padding: "3px 8px", borderRadius: 2, backgroundColor: "var(--accent-subtle)", border: "1px solid var(--accent)", color: "var(--accent)", fontWeight: 700 }}>
                  Active Focus: {selectedCarrier}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span className="mono" style={{ color: "var(--muted)", fontSize: 11, fontWeight: 600 }}>SORT:</span>
            <button
              type="button"
              className="mono"
              onClick={() => {
                if (carrierSortKey === "ripple") setCarrierSortAsc(!carrierSortAsc);
                else { setCarrierSortKey("ripple"); setCarrierSortAsc(false); }
              }}
              style={{
                fontSize: 11.5,
                padding: "6px 12px",
                borderRadius: 3,
                cursor: "pointer",
                backgroundColor: carrierSortKey === "ripple" ? "var(--accent-subtle)" : "var(--surface)",
                border: carrierSortKey === "ripple" ? "1px solid var(--accent)" : "1px solid var(--line)",
                color: carrierSortKey === "ripple" ? "var(--accent)" : "var(--muted)",
                fontWeight: carrierSortKey === "ripple" ? 700 : 500,
              }}
            >
              Ripple % (Problem) {carrierSortKey === "ripple" && (carrierSortAsc ? "↑" : "↓")}
            </button>
            <button
              type="button"
              className="mono"
              onClick={() => {
                if (carrierSortKey === "delay") setCarrierSortAsc(!carrierSortAsc);
                else { setCarrierSortKey("delay"); setCarrierSortAsc(false); }
              }}
              style={{
                fontSize: 11.5,
                padding: "6px 12px",
                borderRadius: 3,
                cursor: "pointer",
                backgroundColor: carrierSortKey === "delay" ? "var(--accent-subtle)" : "var(--surface)",
                border: carrierSortKey === "delay" ? "1px solid var(--accent)" : "1px solid var(--line)",
                color: carrierSortKey === "delay" ? "var(--accent)" : "var(--muted)",
                fontWeight: carrierSortKey === "delay" ? 700 : 500,
              }}
            >
              Delay % {carrierSortKey === "delay" && (carrierSortAsc ? "↑" : "↓")}
            </button>
            <button
              type="button"
              className="mono"
              onClick={() => {
                if (carrierSortKey === "volume") setCarrierSortAsc(!carrierSortAsc);
                else { setCarrierSortKey("volume"); setCarrierSortAsc(false); }
              }}
              style={{
                fontSize: 11.5,
                padding: "6px 12px",
                borderRadius: 3,
                cursor: "pointer",
                backgroundColor: carrierSortKey === "volume" ? "var(--accent-subtle)" : "var(--surface)",
                border: carrierSortKey === "volume" ? "1px solid var(--accent)" : "1px solid var(--line)",
                color: carrierSortKey === "volume" ? "var(--accent)" : "var(--muted)",
                fontWeight: carrierSortKey === "volume" ? 700 : 500,
              }}
            >
              Volume {carrierSortKey === "volume" && (carrierSortAsc ? "↑" : "↓")}
            </button>
          </div>
        </div>

        <div
          className="top-down-scroll"
          style={{
            width: "100%",
            maxHeight: 390,
            overflowY: "auto",
            overflowX: "auto",
            border: "1px solid var(--line)",
            borderRadius: "4px 4px 0 0",
            backgroundColor: "var(--panel)",
            position: "relative",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead
              style={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                backgroundColor: "var(--surface)",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.45)",
              }}
            >
              <tr style={{ borderBottom: "2px solid var(--line-strong)", backgroundColor: "var(--surface)" }}>
                <th className="mono" style={{ padding: "10px 14px", textAlign: "left", color: "var(--ink-heading)", fontSize: 11, fontWeight: 700 }}>Carrier / Code</th>
                <th className="mono" style={{ padding: "10px 14px", textAlign: "left", color: "var(--ink-heading)", fontSize: 11, fontWeight: 700 }}>Category</th>
                <th className="mono" style={{ padding: "10px 14px", textAlign: "right", color: "var(--ink-heading)", fontSize: 11, fontWeight: 700 }}>Flights {selectedMonth > 0 ? `(${MONTH_NAMES[selectedMonth].slice(5)})` : ""}</th>
                <th className="mono" style={{ padding: "10px 14px", textAlign: "right", color: "var(--ink-heading)", fontSize: 11, fontWeight: 700 }}>Delay % {selectedMonth > 0 ? `(${MONTH_NAMES[selectedMonth].slice(5)})` : ""}</th>
                <th className="mono" style={{ padding: "10px 14px", textAlign: "right", color: "var(--accent)", fontSize: 11, fontWeight: 700 }}>Late Air Ripple</th>
                <th className="mono" style={{ padding: "10px 14px", textAlign: "right", color: "var(--ink-heading)", fontSize: 11, fontWeight: 700 }}>Early Arr</th>
                <th className="mono" style={{ padding: "10px 14px", textAlign: "right", color: "var(--ink-heading)", fontSize: 11, fontWeight: 700 }}>Mean {metricMode === "arr" ? "Arr" : "Dep"} {selectedMonth > 0 ? `(${MONTH_NAMES[selectedMonth].slice(5)})` : ""}</th>
                <th className="mono" style={{ padding: "10px 14px", textAlign: "left", color: "var(--ink-heading)", fontSize: 11, fontWeight: 700 }}>Attribution (Ripple Highlighted)</th>
              </tr>
            </thead>
            <tbody>
              {sortedCarriers.map((c) => {
                const mData = selectedMonth > 0 ? carrierByMonth[c.carrier_code]?.[selectedMonth.toString()] : null;
                const displayFlights = mData ? mData.flights : c.total_flights;
                const displayDelayRate = mData ? mData.delay_rate_pct : c.delay_rate_pct;
                const displayMeanDelay = mData
                  ? (metricMode === "arr" ? mData.mean_arr_delay : mData.mean_dep_delay)
                  : (metricMode === "arr" ? c.mean_arr_delay : c.mean_dep_delay);

                const totalCauseMin =
                  c.late_aircraft_delay_min + c.carrier_delay_min + c.nas_delay_min + c.weather_delay_min + c.security_delay_min;
                const lateAirPct = totalCauseMin > 0 ? (c.late_aircraft_delay_min / totalCauseMin) * 100 : 0;
                const carrierPct = totalCauseMin > 0 ? (c.carrier_delay_min / totalCauseMin) * 100 : 0;
                const nasPct = totalCauseMin > 0 ? (c.nas_delay_min / totalCauseMin) * 100 : 0;
                const wxPct = totalCauseMin > 0 ? (c.weather_delay_min / totalCauseMin) * 100 : 0;
                const isSelected = selectedCarrier === c.carrier_code;
                const isHighRipple = lateAirPct >= 45;
                const isDimmed = selectedCarrier !== "ALL" && !isSelected;

                return (
                  <tr
                    key={c.carrier_code}
                    onClick={() => setSelectedCarrier(isSelected ? "ALL" : c.carrier_code)}
                    style={{
                      borderBottom: "1px solid var(--line)",
                      backgroundColor: isSelected ? "var(--accent-subtle)" : "transparent",
                      cursor: "pointer",
                      transition: "all 0.12s ease",
                      opacity: isDimmed ? 0.42 : 1,
                    }}
                  >
                    <td style={{ padding: "12px 14px", color: "var(--ink-heading)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span
                          className="mono"
                          style={{
                            padding: "3px 8px",
                            borderRadius: 3,
                            backgroundColor: isSelected ? "var(--accent)" : "var(--surface-secondary)",
                            border: isSelected ? "1px solid var(--accent)" : "1px solid var(--line)",
                            color: isSelected ? "#000000" : "var(--ink)",
                            fontSize: 11.5,
                            fontWeight: 700,
                          }}
                        >
                          {c.carrier_code}
                        </span>
                        <span style={{ fontWeight: 600, fontSize: 13.5 }}>{c.carrier_name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px", color: "var(--muted)" }}>
                      <span className="mono" style={{ fontSize: 11, padding: "3px 7px", borderRadius: 3, backgroundColor: "var(--surface)", border: "1px solid var(--line)" }}>
                        {CARRIER_CATEGORIES[c.carrier_code] || "Commercial"}
                      </span>
                    </td>
                    <td className="mono" style={{ padding: "12px 14px", textAlign: "right", color: "var(--ink)" }}>
                      {fmtNum(displayFlights)}
                    </td>
                    <td className="mono" style={{ padding: "12px 14px", textAlign: "right", fontWeight: 600 }}>
                      <span style={{ color: displayDelayRate > 25 ? "var(--accent)" : "var(--ink)" }}>
                        {fmtPct(displayDelayRate)}
                      </span>
                    </td>
                    <td className="mono" style={{ padding: "12px 14px", textAlign: "right", fontWeight: 700 }}>
                      <span style={{ color: isHighRipple ? "var(--accent)" : "var(--ink-heading)" }}>
                        {lateAirPct.toFixed(1)}%
                      </span>
                    </td>
                    <td className="mono" style={{ padding: "12px 14px", textAlign: "right", color: "var(--muted)" }}>
                      {fmtPct(c.early_rate_pct)}
                    </td>
                    <td className="mono" style={{ padding: "12px 14px", textAlign: "right", color: "var(--muted)" }}>
                      {fmtMin(displayMeanDelay)}
                    </td>
                    <td style={{ padding: "12px 14px", minWidth: 220 }}>
                      <div
                        style={{
                          width: "100%",
                          height: 7,
                          backgroundColor: "var(--surface-secondary)",
                          borderRadius: 3,
                          overflow: "hidden",
                          display: "flex",
                        }}
                        title={`Late Ripple: ${lateAirPct.toFixed(1)}% | Carr: ${carrierPct.toFixed(1)}% | NAS: ${nasPct.toFixed(1)}% | Wx: ${wxPct.toFixed(1)}%`}
                      >
                        {/* Late Ripple Highlighted with Accent; remaining causes in clean monochrome/slate */}
                        <div style={{ width: `${lateAirPct}%`, height: "100%", backgroundColor: "var(--accent)" }} />
                        <div style={{ width: `${carrierPct}%`, height: "100%", backgroundColor: "rgba(255, 255, 255, 0.4)" }} />
                        <div style={{ width: `${nasPct}%`, height: "100%", backgroundColor: "rgba(255, 255, 255, 0.22)" }} />
                        <div style={{ width: `${wxPct}%`, height: "100%", backgroundColor: "rgba(255, 255, 255, 0.12)" }} />
                      </div>
                      <div className="mono" style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 600, marginTop: 4 }}>
                        <span style={{ color: "var(--accent)" }}>RIPPLE {lateAirPct.toFixed(0)}%</span>
                        <span style={{ color: "var(--muted)" }}>CARR {carrierPct.toFixed(0)}%</span>
                        <span style={{ color: "var(--muted)" }}>NAS {nasPct.toFixed(0)}%</span>
                        <span style={{ color: "var(--muted)" }}>WX {wxPct.toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div
          className="mono"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
            padding: "8px 14px",
            border: "1px solid var(--line)",
            borderTop: "none",
            borderRadius: "0 0 4px 4px",
            backgroundColor: "var(--surface-secondary)",
            fontSize: 11,
            color: "var(--muted)",
          }}
        >
          <span>{sortedCarriers.length} REPORTING CARRIERS • TOP-DOWN SCROLL (STICKY HEADER)</span>
          <span>↕ SCROLL CONTAINER • CLICK ROW TO FILTER TELEMETRY</span>
        </div>
      </section>

      {/* MODULE 4: AIRPORT RUNWAY QUEUING — FOCUSED ON GROUND TAXI BOTTLENECK */}
      <section
        id="runway-bottlenecks"
        style={{
          backgroundColor: "var(--panel)",
          border: "1px solid var(--line)",
          borderRadius: 4,
          padding: "26px 24px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14, borderBottom: "1px solid var(--line)", paddingBottom: 18, marginBottom: 22 }}>
          <div>
            <span className="mono" style={{ color: "var(--accent)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>
              PROBLEM: GROUND TAXI-OUT SURFACE FRICTION
            </span>
            <h3 style={{ fontSize: "clamp(20px, 2.4vw, 26px)", color: "var(--ink-heading)", letterSpacing: "-0.03em", margin: "4px 0 0", fontWeight: 700 }}>
              04. Top 15 Origin Hubs &amp; Surface Queuing Friction
            </h3>
            <p style={{ fontSize: 14, color: "var(--muted)", margin: "8px 0 0", maxWidth: 840, lineHeight: 1.6 }}>
              Aircraft at Chicago O&#39;Hare (ORD) and New York LaGuardia (LGA) spend over <strong>23 minutes queuing on the tarmac</strong> before takeoff, burning jet fuel while passenger connection windows narrow downstream.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              <span className="mono" style={{ fontSize: 10.5, color: "var(--muted)", letterSpacing: "0.06em" }}>
                TABLE SCOPE:
              </span>
              <span className="mono" style={{ fontSize: 11, padding: "3px 8px", borderRadius: 2, backgroundColor: selectedMonth > 0 ? "var(--surface-secondary)" : "var(--panel)", border: "1px solid var(--line-strong)", color: "var(--ink-heading)", fontWeight: 600 }}>
                {selectedMonth > 0 ? `${MONTH_NAMES[selectedMonth]} 2024` : "Full Year 2024 (Top 15 Hubs)"}
              </span>
              {selectedHub !== "ALL" && (
                <span className="mono" style={{ fontSize: 11, padding: "3px 8px", borderRadius: 2, backgroundColor: "var(--accent-subtle)", border: "1px solid var(--accent)", color: "var(--accent)", fontWeight: 700 }}>
                  Active Focus: {selectedHub}
                </span>
              )}
            </div>
          </div>
          <span className="mono" style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>
            TOP 15 ORIGIN HUBS
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 12,
          }}
        >
          {airportsList.slice(0, 15).map((a) => {
            const hData = selectedMonth > 0 ? hubByMonth[a.airport_code]?.[selectedMonth.toString()] : null;
            const displayDepartures = hData ? (hData.flights ?? hData.departures) : a.total_departures;
            const displayDelayRate = hData ? hData.delay_rate_pct : a.delay_rate_pct;
            const displayTaxiOut = hData ? hData.mean_taxi_out : a.mean_taxi_out;
            const isWorstTaxi = displayTaxiOut >= 22;
            const isHighDelay = displayDelayRate >= 25;
            const isSelected = selectedHub === a.airport_code;
            const isDimmed = selectedHub !== "ALL" && !isSelected;

            return (
              <div
                key={a.airport_code}
                onClick={() => setSelectedHub(isSelected ? "ALL" : a.airport_code)}
                style={{
                  backgroundColor: isSelected ? "var(--accent-subtle)" : "var(--surface)",
                  border: isSelected
                    ? "1px solid var(--accent)"
                    : isWorstTaxi
                    ? "1px solid var(--accent)"
                    : "1px solid var(--line)",
                  borderRadius: 3,
                  padding: 14,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  opacity: isDimmed ? 0.42 : 1,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span className="mono" style={{ fontSize: 18, fontWeight: 700, color: "var(--ink-heading)" }}>
                      {a.airport_code}
                    </span>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{a.city}</div>
                  </div>
                  {isWorstTaxi ? (
                    <span
                      className="mono"
                      style={{
                        fontSize: 9.5,
                        padding: "3px 6px",
                        borderRadius: 2,
                        backgroundColor: "var(--accent-subtle)",
                        color: "var(--accent)",
                        border: "1px solid var(--accent)",
                        fontWeight: 700,
                      }}
                    >
                      &gt;22m Bottleneck
                    </span>
                  ) : isHighDelay ? (
                    <span
                      className="mono"
                      style={{
                        fontSize: 9.5,
                        padding: "3px 6px",
                        borderRadius: 2,
                        backgroundColor: "var(--surface-secondary)",
                        color: "var(--ink)",
                        border: "1px solid var(--line-strong)",
                        fontWeight: 600,
                      }}
                    >
                      &gt;25% Delay
                    </span>
                  ) : null}
                </div>

                <div
                  className="mono"
                  style={{
                    marginTop: 12,
                    paddingTop: 10,
                    borderTop: "1px solid var(--line)",
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 6,
                    fontSize: 11,
                  }}
                >
                  <div>
                    <div style={{ color: "var(--muted)", fontSize: 10 }}>DEP {selectedMonth > 0 ? `(${MONTH_NAMES[selectedMonth].slice(5)})` : ""}</div>
                    <div style={{ color: "var(--ink-heading)", fontWeight: 700, marginTop: 2 }}>{fmtNum(displayDepartures)}</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--muted)", fontSize: 10 }}>DELAY {selectedMonth > 0 ? `(${MONTH_NAMES[selectedMonth].slice(5)})` : ""}</div>
                    <div style={{ color: isHighDelay ? "var(--accent)" : "var(--ink)", fontWeight: 700, marginTop: 2 }}>
                      {fmtPct(displayDelayRate)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "var(--muted)", fontSize: 10 }}>TAXI QUEUE {selectedMonth > 0 ? `(${MONTH_NAMES[selectedMonth].slice(5)})` : ""}</div>
                    <div style={{ color: isWorstTaxi ? "var(--accent)" : "var(--ink-heading)", fontWeight: 700, marginTop: 2 }}>
                      {fmtMin(displayTaxiOut)}
                    </div>
                  </div>
                </div>

                <div style={{ width: "100%", height: 3, backgroundColor: "var(--surface-secondary)", borderRadius: 2, marginTop: 10, overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${Math.min((displayTaxiOut / 25) * 100, 100)}%`,
                      height: "100%",
                      backgroundColor: isWorstTaxi ? "var(--accent)" : "var(--line-strong)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MODULE 5: CAUSE DECOMPOSITION & SEASONALITY — CORE PROBLEM HIGHLIGHT */}
      <section
        id="cause-decomposition"
        style={{
          backgroundColor: "var(--panel)",
          border: "1px solid var(--line)",
          borderRadius: 4,
          padding: "26px 24px",
        }}
      >
        <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: 18, marginBottom: 22 }}>
          <span className="mono" style={{ color: "var(--accent)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>
            ROOT CAUSE ATTRIBUTION • 103,795,067 TOTAL DELAY MINUTES
          </span>
          <h3 style={{ fontSize: "clamp(20px, 2.4vw, 26px)", color: "var(--ink-heading)", letterSpacing: "-0.03em", margin: "4px 0 0", fontWeight: 700 }}>
            05. National Delay Causality: The Turnaround Deficit
          </h3>
          <p style={{ fontSize: 14, color: "var(--muted)", margin: "8px 0 0", maxWidth: 840, lineHeight: 1.6 }}>
            Network-propagated turnaround delays account for <strong>40.44% of all delayed minutes (41.97M minutes)</strong>, demonstrating that upstream rotational integrity is the single largest operational failure point.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: 1,
            backgroundColor: "var(--line)",
            border: "1px solid var(--line)",
            borderRadius: 4,
            overflow: "hidden",
            marginBottom: 24,
          }}
        >
          {/* Highlight #1 Root Cause Problem */}
          <div style={{ backgroundColor: "var(--panel)", padding: "16px 18px", borderTop: "3px solid var(--accent)" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--accent)", display: "block", fontWeight: 700 }}>
              #1 LATE AIRCRAFT TURN
            </span>
            <strong className="mono" style={{ fontSize: 26, color: "var(--accent)", display: "block", marginTop: 6 }}>40.4%</strong>
            <span className="mono" style={{ fontSize: 12, color: "var(--ink-heading)", display: "block", marginTop: 4 }}>41.97M min</span>
            <span style={{ fontSize: 11.5, color: "var(--muted)", display: "block", marginTop: 4 }}>743k turns (56.5m/turn)</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "16px 18px" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--muted)", display: "block", fontWeight: 600 }}>2. CARRIER OPERATIONS</span>
            <strong className="mono" style={{ fontSize: 26, color: "var(--ink-heading)", display: "block", marginTop: 6 }}>34.5%</strong>
            <span className="mono" style={{ fontSize: 12, color: "var(--muted)", display: "block", marginTop: 4 }}>35.82M min</span>
            <span style={{ fontSize: 11.5, color: "var(--muted)", display: "block", marginTop: 4 }}>789k events (45.4m/inc)</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "16px 18px" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--muted)", display: "block", fontWeight: 600 }}>3. NAS AIR TRAFFIC</span>
            <strong className="mono" style={{ fontSize: 26, color: "var(--ink-heading)", display: "block", marginTop: 6 }}>18.9%</strong>
            <span className="mono" style={{ fontSize: 12, color: "var(--muted)", display: "block", marginTop: 4 }}>19.62M min</span>
            <span style={{ fontSize: 11.5, color: "var(--muted)", display: "block", marginTop: 4 }}>726k holds (27.0m/inc)</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "16px 18px" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--muted)", display: "block", fontWeight: 600 }}>4. SEVERE WEATHER</span>
            <strong className="mono" style={{ fontSize: 26, color: "var(--ink-heading)", display: "block", marginTop: 6 }}>6.0%</strong>
            <span className="mono" style={{ fontSize: 12, color: "var(--muted)", display: "block", marginTop: 4 }}>6.20M min</span>
            <span style={{ fontSize: 11.5, color: "var(--muted)", display: "block", marginTop: 4 }}>Mean: 69.7m/event</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "16px 18px" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--muted)", display: "block", fontWeight: 600 }}>5. SECURITY SCREENING</span>
            <strong className="mono" style={{ fontSize: 26, color: "var(--ink-heading)", display: "block", marginTop: 6 }}>0.2%</strong>
            <span className="mono" style={{ fontSize: 12, color: "var(--muted)", display: "block", marginTop: 4 }}>179.9k min</span>
            <span style={{ fontSize: 11.5, color: "var(--muted)", display: "block", marginTop: 4 }}>7.4k events (24.3m/inc)</span>
          </div>
        </div>

        {/* MONTHLY SEASONALITY MATRIX — CLEAN MONOCHROME */}
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: 20 }}>
          <div style={{ marginBottom: 14 }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>
              MONTHLY DISRUPTIONS (CLICK MONTH TO SLICE)
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: 8,
            }}
          >
            {monthlyList.map((m) => {
              const isPeakDelay = m.delay_rate_pct >= 25;
              const isSelected = selectedMonth === m.month;

              return (
                <button
                  type="button"
                  key={m.month}
                  onClick={() => setSelectedMonth(isSelected ? 0 : m.month)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 3,
                    border: isSelected
                      ? "1px solid var(--accent)"
                      : isPeakDelay
                      ? "1px solid var(--accent)"
                      : "1px solid var(--line)",
                    backgroundColor: isSelected
                      ? "var(--accent-subtle)"
                      : isPeakDelay
                      ? "rgba(255, 77, 28, 0.06)"
                      : "var(--surface)",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all .15s ease",
                  }}
                >
                  <div className="mono" style={{ fontWeight: 700, color: isPeakDelay ? "var(--accent)" : "var(--ink-heading)", fontSize: 12 }}>
                    {MONTH_NAMES[m.month].slice(5)}
                  </div>
                  <div className="mono" style={{ marginTop: 5, fontSize: 12, color: "var(--muted)" }}>
                    DELAY: <span style={{ color: isPeakDelay ? "var(--accent)" : "var(--ink)", fontWeight: isPeakDelay ? 700 : 500 }}>{fmtPct(m.delay_rate_pct)}</span>
                  </div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                    MEAN: {fmtMin(m.mean_arr_delay)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
