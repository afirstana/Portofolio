"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  type CityGeographicSummary,
  type FlaggedTransaction,
  CITIES_COORDINATES,
  computeDashboardAggregates,
  generateSyntheticAntiFraudDataset,
  formatCurrency
} from "@/lib/anti-fraud";

// Map bounds for Indonesia projection
const MIN_LNG = 95.0;
const MAX_LNG = 141.0;
const MIN_LAT = -11.5;
const MAX_LAT = 6.0;
const SVG_WIDTH = 920;
const SVG_HEIGHT = 420;

function projectCoords(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * (SVG_WIDTH - 80) + 40;
  const y = SVG_HEIGHT - (((lat - MIN_LAT) / (MAX_LAT - MIN_LAT)) * (SVG_HEIGHT - 80) + 40);
  return { x, y };
}

function getCityRegion(cityName: string): "Java" | "Sumatra" | "Kalimantan" | "Sulawesi" | "NusaTenggara" | "Eastern" {
  const javaCities = ["Jakarta", "Surabaya", "Bandung", "Semarang", "Tangerang", "Depok", "Bekasi", "Yogyakarta", "Malang", "Surakarta", "Cirebon", "Sukabumi", "Tasikmalaya", "Pekalongan", "Tegal", "Magelang", "Kediri", "Blitar", "Madiun", "Probolinggo", "Pasuruan", "Batu", "Cilegon", "Serang", "Bogor", "Cimahi"];
  const sumatraCities = ["Medan", "Palembang", "Batam", "Pekanbaru", "Bandar Lampung", "Padang", "Banda Aceh", "Jambi", "Bengkulu", "Pangkal Pinang", "Tanjung Pinang"];
  const kalimantanCities = ["Pontianak", "Banjarmasin", "Balikpapan", "Samarinda", "Palangka Raya", "Tarakan", "Singkawang"];
  const sulawesiCities = ["Makassar", "Manado", "Palu", "Kendari", "Gorontalo", "Bitung"];
  const nusaTenggaraCities = ["Denpasar", "Mataram", "Kupang", "Bima"];

  if (javaCities.includes(cityName)) return "Java";
  if (sumatraCities.includes(cityName)) return "Sumatra";
  if (kalimantanCities.includes(cityName)) return "Kalimantan";
  if (sulawesiCities.includes(cityName)) return "Sulawesi";
  if (nusaTenggaraCities.includes(cityName)) return "NusaTenggara";
  return "Eastern";
}

export function GeographicIntelligenceDashboard() {
  const masterDataset = useMemo(() => generateSyntheticAntiFraudDataset(), []);
  const aggregates = useMemo(() => computeDashboardAggregates(masterDataset), [masterDataset]);

  const [activeRegion, setActiveRegion] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [heatMetric, setHeatMetric] = useState<"FLAGGED" | "VOLUME">("FLAGGED");
  const [selectedCity, setSelectedCity] = useState<CityGeographicSummary | null>(null);
  const [hoveredCity, setHoveredCity] = useState<CityGeographicSummary | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Filtered Cities list
  const filteredCities = useMemo(() => {
    return aggregates.cityGeographics.filter((c) => {
      const matchSearch = c.city.toLowerCase().includes(searchQuery.toLowerCase().trim());
      const matchRegion = activeRegion === "ALL" || getCityRegion(c.city) === activeRegion;
      return matchSearch && matchRegion;
    });
  }, [aggregates.cityGeographics, searchQuery, activeRegion]);

  const maxFlagged = useMemo(
    () => Math.max(...aggregates.cityGeographics.map((c) => c.flaggedTransactions), 1),
    [aggregates.cityGeographics]
  );
  const maxVolume = useMemo(
    () => Math.max(...aggregates.cityGeographics.map((c) => c.totalAmount), 1),
    [aggregates.cityGeographics]
  );

  // Top 6 Hotspot Cities
  const topHotspots = useMemo(() => {
    return [...aggregates.cityGeographics].sort((a, b) => b.flaggedTransactions - a.flaggedTransactions).slice(0, 6);
  }, [aggregates.cityGeographics]);

  // Selected city recent transactions
  const cityRecentTransactions = useMemo(() => {
    if (!selectedCity) return [];
    return masterDataset
      .filter((t) => t.location === selectedCity.city)
      .slice(0, 5);
  }, [selectedCity, masterDataset]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div className="fraud-dashboard-container mono" aria-label="Geographic Incident & Metropolitan Surveillance Dashboard">
      {/* Top Header Bar */}
      <div className="dashboard-top-bar">
        <div className="top-bar-left">
          <div className="dashboard-tag-row">
            <span className="pulse-dot" />
            <span className="db-tag">STANDALONE CONSOLE 02</span>
            <span className="db-subtag">GEOGRAPHIC SURVEILLANCE &amp; SPATIAL INTELLIGENCE</span>
          </div>
          <h3 className="dashboard-main-title">Geographic Incident Dispersion (43 Metropolitan Cities)</h3>
          <p className="dashboard-subtitle">
            Spatial monitoring across Indonesian metropolitan payment gateways. Interactive radar projection isolating regional anomaly density and fraud exposure.
          </p>
        </div>

        {/* Action Controls */}
        <div className="top-bar-right">
          <input
            type="text"
            className="geo-search-input mono"
            placeholder="🔍 Search 43 cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {selectedCity && (
            <button
              type="button"
              className="reset-filter-btn mono"
              onClick={() => setSelectedCity(null)}
            >
              ✕ Clear Selection
            </button>
          )}
        </div>
      </div>

      {/* 4 Macro Spatial KPI Cards */}
      <div className="kpi-cards-grid">
        <div className="kpi-card">
          <span className="kpi-label">METROPOLITAN CLUSTERS</span>
          <strong className="kpi-value">{filteredCities.length} / 43 Hubs</strong>
          <span className="kpi-sub">Total Monitored Cities</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">PRIMARY ANOMALY HOTSPOT</span>
          <strong className="kpi-value flagged-value">
            {topHotspots[0]?.city || "Kupang"} ({topHotspots[0]?.flaggedTransactions || 10} Flags)
          </strong>
          <span className="kpi-sub">Highest Cluster Incident Rate</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">PORTFOLIO FRAUD RATE</span>
          <strong className="kpi-value rate-red">{aggregates.fraudRate.toFixed(2)}%</strong>
          <span className="kpi-sub">National Anomaly Average</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">GROSS GEOGRAPHIC VALUE</span>
          <strong className="kpi-value exposure-value">{formatCurrency(aggregates.totalVolume)}</strong>
          <span className="kpi-sub">Cumulative Monitored Volume</span>
        </div>
      </div>

      {/* Regional Slicers & Metric Toggle Bar */}
      <div className="geo-slicer-toolbar">
        <div className="region-pills-wrap">
          <span className="slicer-prefix-label">REGION QUICK-FILTER:</span>
          {[
            { id: "ALL", label: "🇮🇩 All Indonesia (43)" },
            { id: "Java", label: "Java (18)" },
            { id: "Sumatra", label: "Sumatra (7)" },
            { id: "Kalimantan", label: "Kalimantan (4)" },
            { id: "Sulawesi", label: "Sulawesi (3)" },
            { id: "NusaTenggara", label: "Bali & Nusa (3)" },
            { id: "Eastern", label: "Eastern / Papua (8)" }
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              className={`region-filter-pill ${activeRegion === r.id ? "active" : ""}`}
              onClick={() => setActiveRegion(r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="heat-metric-pills">
          <span className="slicer-prefix-label">HEAT METRIC:</span>
          <button
            type="button"
            className={`metric-pill-btn ${heatMetric === "FLAGGED" ? "active" : ""}`}
            onClick={() => setHeatMetric("FLAGGED")}
          >
            🚩 Anomaly Count
          </button>
          <button
            type="button"
            className={`metric-pill-btn ${heatMetric === "VOLUME" ? "active" : ""}`}
            onClick={() => setHeatMetric("VOLUME")}
          >
            💰 Gross Volume ($)
          </button>
        </div>
      </div>

      {/* Full-Width Interactive SVG Map Canvas */}
      <div
        className="geo-standalone-map-card"
        ref={mapContainerRef}
        onMouseMove={handleMouseMove}
      >
        <div className="map-card-header">
          <div className="map-header-left">
            <span className="pulse-dot" />
            <strong>INTERACTIVE SPATIAL RADAR PROJECTION</strong>
            <span className="map-view-hint">Hover any node for floating HUD &bull; Click to lock inspection</span>
          </div>
          <div className="map-legend-row">
            <span className="legend-item"><span className="dot red" /> High Risk (&gt;=8 Incidents)</span>
            <span className="legend-item"><span className="dot yellow" /> Medium Risk (4–7 Incidents)</span>
            <span className="legend-item"><span className="dot green" /> Low Risk (1–3 Incidents)</span>
          </div>
        </div>

        <div className="geo-svg-viewport">
          <svg
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            className="standalone-indonesia-svg"
            role="img"
            aria-label="Map of Indonesia with financial crime incident hotspots"
          >
            <defs>
              <radialGradient id="hotspot-pulse-red" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#ef4444" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>
              <pattern id="standalone-geo-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.5" />
              </pattern>
            </defs>

            {/* Grid Pattern */}
            <rect width="100%" height="100%" fill="url(#standalone-geo-grid)" />

            {/* Equator & Reference Lines */}
            <g className="geo-gridlines" opacity="0.4">
              <line
                x1="20"
                y1={projectCoords(0, 95).y}
                x2={SVG_WIDTH - 20}
                y2={projectCoords(0, 141).y}
                stroke="var(--accent)"
                strokeDasharray="4 4"
                strokeWidth="0.8"
              />
              <text x="25" y={projectCoords(0, 95).y - 4} fill="var(--dim)" fontSize="7">
                0° EQUATOR
              </text>

              {[100, 105, 110, 115, 120, 125, 130, 135, 140].map((lng) => {
                const px = projectCoords(0, lng).x;
                return (
                  <g key={lng}>
                    <line x1={px} y1="15" x2={px} y2={SVG_HEIGHT - 15} stroke="rgba(255,255,255,0.05)" strokeDasharray="2 4" />
                    <text x={px + 2} y={SVG_HEIGHT - 8} fill="var(--dim)" fontSize="6.5">
                      {lng}°E
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Island Landmasses */}
            <g className="island-landmasses">
              {/* Sumatra */}
              <path
                className="island-shape"
                d="M 50,75 L 85,55 L 115,85 L 145,130 L 180,185 L 205,240 L 195,255 L 175,250 L 140,195 L 110,145 L 75,105 Z"
              />
              {/* Java & Madura */}
              <path
                className="island-shape"
                d="M 195,270 L 255,275 L 320,285 L 380,295 L 420,295 L 435,305 L 420,312 L 350,308 L 270,295 L 200,285 Z"
              />
              {/* Kalimantan */}
              <path
                className="island-shape"
                d="M 270,140 L 330,120 L 385,130 L 415,170 L 390,225 L 340,240 L 285,230 L 260,180 Z"
              />
              {/* Sulawesi */}
              <path
                className="island-shape"
                d="M 460,135 L 485,115 L 505,130 L 490,165 L 530,175 L 515,195 L 480,190 L 495,245 L 465,245 L 460,185 Z"
              />
              {/* Bali & Nusa Tenggara */}
              <path
                className="island-shape"
                d="M 445,308 L 470,312 L 510,318 L 565,325 L 610,335 L 620,345 L 585,340 L 530,332 L 485,324 L 445,316 Z"
              />
              {/* Maluku */}
              <path
                className="island-shape"
                d="M 590,140 L 610,130 L 625,160 L 605,185 Z M 620,210 L 650,215 L 645,235 L 615,230 Z"
              />
              {/* Papua */}
              <path
                className="island-shape"
                d="M 700,165 L 750,150 L 830,160 L 860,185 L 860,280 L 810,270 L 760,235 L 720,200 Z"
              />
            </g>

            {/* City Hotspot Pins */}
            <g className="city-hotspots-group">
              {filteredCities.map((c) => {
                const coords = CITIES_COORDINATES[c.city] || { lat: c.lat, lng: c.lng };
                const pt = projectCoords(coords.lat, coords.lng);
                const isSelected = selectedCity?.city === c.city;
                const isHovered = hoveredCity?.city === c.city;
                const isTopHotspot = topHotspots.some((h) => h.city === c.city);

                const baseRadius =
                  heatMetric === "FLAGGED"
                    ? Math.max(5, Math.min(20, (c.flaggedTransactions / maxFlagged) * 20))
                    : Math.max(5, Math.min(20, (c.totalAmount / maxVolume) * 20));

                const fillColor =
                  c.flaggedTransactions >= 8 ? "#ef4444" : c.flaggedTransactions >= 4 ? "#f59e0b" : "#10b981";

                return (
                  <g
                    key={c.city}
                    className={`city-node-group ${isSelected ? "selected-node" : ""} ${isHovered ? "hovered-node" : ""}`}
                    transform={`translate(${pt.x}, ${pt.y})`}
                    onClick={() => setSelectedCity(isSelected ? null : c)}
                    onMouseEnter={() => setHoveredCity(c)}
                    onMouseLeave={() => setHoveredCity(null)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Animated Radar Pulse */}
                    {isTopHotspot && (
                      <circle
                        r={baseRadius * 2.2}
                        fill="none"
                        stroke={fillColor}
                        strokeWidth="1"
                        className="radar-ping-circle"
                        opacity="0.7"
                      />
                    )}

                    {/* Outer Glow Ring on Selected/Hovered */}
                    {(isSelected || isHovered) && (
                      <circle
                        r={baseRadius + 8}
                        fill="url(#hotspot-pulse-red)"
                        className="selected-glow-ring"
                      />
                    )}

                    {/* Main Heat Bubble */}
                    <circle
                      r={baseRadius}
                      fill={fillColor}
                      fillOpacity={isSelected || isHovered ? "0.95" : "0.75"}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? "2" : "0.8"}
                      className="city-heat-circle"
                    />

                    {/* City Label Badge */}
                    {(isTopHotspot || isSelected || isHovered || filteredCities.length <= 15) && (
                      <g className="city-svg-label">
                        <rect
                          x={baseRadius + 4}
                          y="-9"
                          width={c.city.length * 6.5 + 24}
                          height="18"
                          rx="3"
                          fill="rgba(15, 23, 42, 0.92)"
                          stroke={isSelected ? "var(--accent)" : "rgba(255,255,255,0.18)"}
                          strokeWidth="0.8"
                        />
                        <text
                          x={baseRadius + 8}
                          y="3.5"
                          fill={isSelected ? "var(--accent)" : "#ffffff"}
                          fontSize="8"
                          fontWeight="800"
                        >
                          {c.city} ({c.flaggedTransactions})
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Mouse-Tracking Floating Glassmorphism Tooltip HUD */}
          {hoveredCity && (
            <div
              className="geo-mouse-floating-hud mono"
              style={{
                left: Math.min(mousePos.x + 15, SVG_WIDTH - 240),
                top: Math.max(mousePos.y - 110, 10)
              }}
            >
              <div className="floating-hud-header">
                <span className="pulse-dot" />
                <strong className="floating-hud-city">{hoveredCity.city.toUpperCase()}</strong>
                <span className="floating-hud-region">{getCityRegion(hoveredCity.city)}</span>
              </div>
              <div className="floating-hud-stats">
                <div className="hud-stat-item">
                  <span>Monitored Ops:</span>
                  <strong>{hoveredCity.totalTransactions}</strong>
                </div>
                <div className="hud-stat-item red">
                  <span>Flagged Incidents:</span>
                  <strong>{hoveredCity.flaggedTransactions} Incidents</strong>
                </div>
                <div className="hud-stat-item">
                  <span>Fraud Density:</span>
                  <strong className={hoveredCity.fraudRate > 5 ? "red-highlight" : ""}>
                    {hoveredCity.fraudRate.toFixed(1)}%
                  </strong>
                </div>
                <div className="hud-stat-item">
                  <span>Gross Exposure:</span>
                  <strong>{formatCurrency(hoveredCity.totalAmount)}</strong>
                </div>
              </div>
              <div className="floating-hud-coords">
                LAT: {CITIES_COORDINATES[hoveredCity.city]?.lat.toFixed(4) || hoveredCity.lat} &bull; LNG:{" "}
                {CITIES_COORDINATES[hoveredCity.city]?.lng.toFixed(4) || hoveredCity.lng}
              </div>
              <div className="floating-hud-action">Click pin to lock inspection drawer &darr;</div>
            </div>
          )}
        </div>
      </div>

      {/* Selected City Deep-Dive Inspection Panel */}
      {selectedCity ? (
        <div className="geo-city-inspection-dossier mono">
          <div className="dossier-top-bar">
            <div className="dossier-title-wrap">
              <span className="pulse-dot" />
              <strong>METROPOLITAN SURVEILLANCE DOSSIER: {selectedCity.city.toUpperCase()}</strong>
              <span className="dossier-region-pill">{getCityRegion(selectedCity.city)} Territory</span>
            </div>
            <div className="dossier-coords-wrap">
              <span>COORDINATES: [{selectedCity.lat.toFixed(4)}, {selectedCity.lng.toFixed(4)}]</span>
              <button
                type="button"
                className="dossier-close-btn"
                onClick={() => setSelectedCity(null)}
              >
                ✕ Deselect City
              </button>
            </div>
          </div>

          <div className="dossier-stats-grid">
            <div className="dossier-stat-box">
              <span className="dossier-stat-lbl">TOTAL MONITORED TXNS</span>
              <strong className="dossier-stat-val">{selectedCity.totalTransactions} Operations</strong>
            </div>
            <div className="dossier-stat-box red">
              <span className="dossier-stat-lbl">FLAGGED ANOMALIES</span>
              <strong className="dossier-stat-val red-highlight">{selectedCity.flaggedTransactions} Incidents</strong>
            </div>
            <div className="dossier-stat-box">
              <span className="dossier-stat-lbl">FRAUD INCIDENCE RATE</span>
              <strong className={`dossier-stat-val ${selectedCity.fraudRate > 5 ? "rate-red" : "rate-yellow"}`}>
                {selectedCity.fraudRate.toFixed(1)}%
              </strong>
            </div>
            <div className="dossier-stat-box">
              <span className="dossier-stat-lbl">GROSS PROCESSED VALUE</span>
              <strong className="dossier-stat-val">{formatCurrency(selectedCity.totalAmount)}</strong>
            </div>
          </div>

          {/* Recent Operations in this City */}
          <div className="dossier-recent-txns">
            <span className="recent-txns-title">RECENT MONITORED OPERATIONS IN {selectedCity.city.toUpperCase()}:</span>
            <div className="recent-txns-pills">
              {cityRecentTransactions.map((tx) => (
                <div key={tx.transactionId} className={`recent-txn-chip ${tx.isFlagged ? "flagged" : "clean"}`}>
                  <span className="txn-id">{tx.transactionId}</span>
                  <span className="txn-amt">${tx.transactionAmount.toFixed(0)}</span>
                  <span className="txn-chn">{tx.channel}</span>
                  <span className={`txn-risk-badge ${tx.riskLevel.toLowerCase()}`}>
                    {tx.riskLevel} ({tx.riskScore}/6)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="geo-empty-selection-card mono">
          <span>💡 Select any city pin or region pill above to isolate local terminal telemetries and recent incident logs.</span>
        </div>
      )}

      {/* Top Metropolitan Hotspots Leaderboard Grid */}
      <div className="geo-hotspots-leaderboard">
        <div className="leaderboard-header">
          <span className="lb-tag">RANKING</span>
          <h4>Top Metropolitan Anomaly Hotspots Across Indonesia</h4>
        </div>
        <div className="hotspots-cards-grid">
          {topHotspots.map((c, idx) => {
            const isSelected = selectedCity?.city === c.city;
            return (
              <div
                key={c.city}
                className={`hotspot-rank-card ${isSelected ? "selected" : ""}`}
                onClick={() => setSelectedCity(c)}
              >
                <div className="rank-badge-wrap">
                  <span className="rank-num">#{idx + 1}</span>
                  <strong className="hotspot-name">{c.city}</strong>
                  <span className="hotspot-region">{getCityRegion(c.city)}</span>
                </div>
                <div className="hotspot-metrics">
                  <div className="hs-row">
                    <span>Flagged Incidents:</span>
                    <strong className="red-highlight">{c.flaggedTransactions} Incidents</strong>
                  </div>
                  <div className="hs-row">
                    <span>Fraud Density:</span>
                    <strong>{c.fraudRate.toFixed(1)}%</strong>
                  </div>
                  <div className="hs-row">
                    <span>Total Volume:</span>
                    <strong>{formatCurrency(c.totalAmount)}</strong>
                  </div>
                </div>
                <span className="inspect-city-link">Inspect Radar &rarr;</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
