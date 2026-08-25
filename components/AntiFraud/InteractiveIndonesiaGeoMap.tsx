"use client";

import React, { useState, useMemo } from "react";
import { type CityGeographicSummary, CITIES_COORDINATES, formatCurrency } from "@/lib/anti-fraud";

interface GeoMapProps {
  cities: CityGeographicSummary[];
  selectedCity: CityGeographicSummary | null;
  onSelectCity: (city: CityGeographicSummary | null) => void;
}

// Bounding box for Indonesia archipelago projection
const MIN_LNG = 95.0;
const MAX_LNG = 141.0;
const MIN_LAT = -11.5;
const MAX_LAT = 6.0;
const SVG_WIDTH = 900;
const SVG_HEIGHT = 400;

function projectCoords(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * (SVG_WIDTH - 80) + 40;
  const y = SVG_HEIGHT - (((lat - MIN_LAT) / (MAX_LAT - MIN_LAT)) * (SVG_HEIGHT - 80) + 40);
  return { x, y };
}

// Region categorization for quick-focus
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

export function InteractiveIndonesiaGeoMap({ cities, selectedCity, onSelectCity }: GeoMapProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeRegion, setActiveRegion] = useState<string>("ALL");
  const [heatMetric, setHeatMetric] = useState<"FLAGGED" | "VOLUME">("FLAGGED");
  const [viewMode, setViewMode] = useState<"MAP" | "GRID">("MAP");
  const [hoveredCity, setHoveredCity] = useState<CityGeographicSummary | null>(null);

  // Filter cities by search and region
  const filteredCities = useMemo(() => {
    return cities.filter((c) => {
      const matchSearch = c.city.toLowerCase().includes(searchQuery.toLowerCase().trim());
      const matchRegion = activeRegion === "ALL" || getCityRegion(c.city) === activeRegion;
      return matchSearch && matchRegion;
    });
  }, [cities, searchQuery, activeRegion]);

  const maxFlagged = useMemo(() => Math.max(...cities.map((c) => c.flaggedTransactions), 1), [cities]);
  const maxVolume = useMemo(() => Math.max(...cities.map((c) => c.totalAmount), 1), [cities]);

  // Top 5 hotspot cities with most flags
  const topHotspots = useMemo(() => {
    return [...cities].sort((a, b) => b.flaggedTransactions - a.flaggedTransactions).slice(0, 6);
  }, [cities]);

  return (
    <div className="indonesia-geo-map-root mono" aria-label="Interactive Geographic Incident Dispersion Map">
      {/* Top Map Toolbar */}
      <div className="geomap-toolbar">
        <div className="toolbar-left">
          <div className="map-title-row">
            <span className="pulse-dot" />
            <span className="map-badge">SPATIAL SURVEILLANCE RADAR</span>
            <span className="map-city-counter">{filteredCities.length} / 43 Metropolitan Clusters</span>
          </div>
          {/* Region Tabs */}
          <div className="region-filter-tabs" role="tablist">
            <button
              type="button"
              className={`region-tab ${activeRegion === "ALL" ? "active" : ""}`}
              onClick={() => setActiveRegion("ALL")}
            >
              🇮🇩 All (43)
            </button>
            <button
              type="button"
              className={`region-tab ${activeRegion === "Java" ? "active" : ""}`}
              onClick={() => setActiveRegion("Java")}
            >
              Java
            </button>
            <button
              type="button"
              className={`region-tab ${activeRegion === "Sumatra" ? "active" : ""}`}
              onClick={() => setActiveRegion("Sumatra")}
            >
              Sumatra
            </button>
            <button
              type="button"
              className={`region-tab ${activeRegion === "Kalimantan" ? "active" : ""}`}
              onClick={() => setActiveRegion("Kalimantan")}
            >
              Kalimantan
            </button>
            <button
              type="button"
              className={`region-tab ${activeRegion === "Sulawesi" ? "active" : ""}`}
              onClick={() => setActiveRegion("Sulawesi")}
            >
              Sulawesi
            </button>
            <button
              type="button"
              className={`region-tab ${activeRegion === "NusaTenggara" ? "active" : ""}`}
              onClick={() => setActiveRegion("NusaTenggara")}
            >
              Bali &amp; Nusa
            </button>
            <button
              type="button"
              className={`region-tab ${activeRegion === "Eastern" ? "active" : ""}`}
              onClick={() => setActiveRegion("Eastern")}
            >
              Eastern / Papua
            </button>
          </div>
        </div>

        {/* Search and Toggle Controls */}
        <div className="toolbar-right">
          <input
            type="text"
            className="geomap-search-input mono"
            placeholder="🔍 Search city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="metric-toggle-group">
            <button
              type="button"
              className={`metric-toggle-btn ${heatMetric === "FLAGGED" ? "active" : ""}`}
              onClick={() => setHeatMetric("FLAGGED")}
              title="Scale bubbles by Flagged Anomaly Count"
            >
              🚩 Anomaly Count
            </button>
            <button
              type="button"
              className={`metric-toggle-btn ${heatMetric === "VOLUME" ? "active" : ""}`}
              onClick={() => setHeatMetric("VOLUME")}
              title="Scale bubbles by Gross Transaction Volume"
            >
              💰 Gross Value ($)
            </button>
          </div>

          <div className="view-mode-toggle">
            <button
              type="button"
              className={`view-btn ${viewMode === "MAP" ? "active" : ""}`}
              onClick={() => setViewMode("MAP")}
              title="Switch to Geographic Map View"
            >
              🗺️ Map
            </button>
            <button
              type="button"
              className={`view-btn ${viewMode === "GRID" ? "active" : ""}`}
              onClick={() => setViewMode("GRID")}
              title="Switch to Data Grid View"
            >
              📋 Grid
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Canvas */}
      {viewMode === "MAP" ? (
        <div className="svg-map-wrapper">
          <svg
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            className="indonesia-svg-canvas"
            role="img"
            aria-label="Map of Indonesia showing fraud incident clusters"
          >
            <defs>
              {/* Radial Gradients for Glowing Hotspot Pins */}
              <radialGradient id="hotspot-glow-red" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#ef4444" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="hotspot-glow-green" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </radialGradient>
              <pattern id="geo-grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.5" />
              </pattern>
            </defs>

            {/* Background Geo Grid */}
            <rect width="100%" height="100%" fill="url(#geo-grid-pattern)" />

            {/* Latitude & Longitude Reference Gridlines */}
            <g className="geo-reference-lines" opacity="0.35">
              {/* Equator (0° Lat) */}
              <line
                x1="20"
                y1={projectCoords(0, 95).y}
                x2={SVG_WIDTH - 20}
                y2={projectCoords(0, 141).y}
                stroke="var(--accent)"
                strokeDasharray="4 4"
                strokeWidth="0.8"
              />
              <text x="25" y={projectCoords(0, 95).y - 4} fill="var(--dim)" fontSize="7" fontFamily="monospace">
                0° EQUATOR
              </text>

              {/* Meridian Longitudes */}
              {[100, 110, 120, 130, 140].map((lng) => {
                const px = projectCoords(0, lng).x;
                return (
                  <g key={lng}>
                    <line x1={px} y1="20" x2={px} y2={SVG_HEIGHT - 20} stroke="rgba(255,255,255,0.06)" strokeDasharray="2 4" />
                    <text x={px + 2} y={SVG_HEIGHT - 10} fill="var(--dim)" fontSize="6.5" fontFamily="monospace">
                      {lng}°E
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Accurate Archipelago Landmass Polygons */}
            <g className="indonesia-landmass-group">
              {/* Sumatra Island */}
              <path
                className="island-poly"
                d="M 50,75 L 85,55 L 115,85 L 145,130 L 180,185 L 205,240 L 195,255 L 175,250 L 140,195 L 110,145 L 75,105 Z"
              />
              {/* Java Island & Madura */}
              <path
                className="island-poly"
                d="M 195,270 L 255,275 L 320,285 L 380,295 L 420,295 L 435,305 L 420,312 L 350,308 L 270,295 L 200,285 Z"
              />
              {/* Kalimantan / Borneo (Indonesian Territory) */}
              <path
                className="island-poly"
                d="M 270,140 L 330,120 L 385,130 L 415,170 L 390,225 L 340,240 L 285,230 L 260,180 Z"
              />
              {/* Sulawesi Island (Distinct K-Shape) */}
              <path
                className="island-poly"
                d="M 460,135 L 485,115 L 505,130 L 490,165 L 530,175 L 515,195 L 480,190 L 495,245 L 465,245 L 460,185 Z"
              />
              {/* Bali, Lombok, Sumbawa, Flores, Timor / Kupang (Nusa Tenggara) */}
              <path
                className="island-poly"
                d="M 445,308 L 470,312 L 510,318 L 565,325 L 610,335 L 620,345 L 585,340 L 530,332 L 485,324 L 445,316 Z"
              />
              {/* Maluku & Halmahera Islands */}
              <path
                className="island-poly"
                d="M 590,140 L 610,130 L 625,160 L 605,185 Z M 620,210 L 650,215 L 645,235 L 615,230 Z"
              />
              {/* Papua / Irian Jaya Territory */}
              <path
                className="island-poly"
                d="M 700,165 L 750,150 L 830,160 L 860,185 L 860,280 L 810,270 L 760,235 L 720,200 Z"
              />
            </g>

            {/* City Hotspot Pins & Heat Bubbles */}
            <g className="city-pins-group">
              {filteredCities.map((c) => {
                const coords = CITIES_COORDINATES[c.city] || { lat: c.lat, lng: c.lng };
                const pt = projectCoords(coords.lat, coords.lng);
                const isSelected = selectedCity?.city === c.city;
                const isHovered = hoveredCity?.city === c.city;
                const isTopHotspot = topHotspots.some((h) => h.city === c.city);

                // Bubble radius calculation
                const baseRadius =
                  heatMetric === "FLAGGED"
                    ? Math.max(5, Math.min(18, (c.flaggedTransactions / maxFlagged) * 18))
                    : Math.max(5, Math.min(18, (c.totalAmount / maxVolume) * 18));

                const fillColor =
                  c.flaggedTransactions >= 8 ? "#ef4444" : c.flaggedTransactions >= 4 ? "#f59e0b" : "#10b981";

                return (
                  <g
                    key={c.city}
                    className={`city-node-group ${isSelected ? "selected-node" : ""} ${isHovered ? "hovered-node" : ""}`}
                    transform={`translate(${pt.x}, ${pt.y})`}
                    onClick={() => onSelectCity(isSelected ? null : c)}
                    onMouseEnter={() => setHoveredCity(c)}
                    onMouseLeave={() => setHoveredCity(null)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Animated Radar Pulse for Top Anomaly Hotspots */}
                    {isTopHotspot && (
                      <circle
                        r={baseRadius * 2}
                        fill="none"
                        stroke={fillColor}
                        strokeWidth="1"
                        className="radar-ping-circle"
                        opacity="0.6"
                      />
                    )}

                    {/* Outer Glow Ring on Selected/Hovered */}
                    {(isSelected || isHovered) && (
                      <circle
                        r={baseRadius + 6}
                        fill={fillColor === "#ef4444" ? "url(#hotspot-glow-red)" : "url(#hotspot-glow-green)"}
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

                    {/* City Name Label (Visible for Major Hotspots or Selected/Hovered) */}
                    {(isTopHotspot || isSelected || isHovered || filteredCities.length <= 15) && (
                      <g className="city-svg-label">
                        <rect
                          x={baseRadius + 4}
                          y="-8"
                          width={c.city.length * 6 + 22}
                          height="16"
                          rx="3"
                          fill="rgba(15, 23, 42, 0.9)"
                          stroke={isSelected ? "var(--accent)" : "rgba(255,255,255,0.15)"}
                          strokeWidth="0.8"
                        />
                        <text
                          x={baseRadius + 8}
                          y="3"
                          fill={isSelected ? "var(--accent)" : "#f8fafc"}
                          fontSize="7.5"
                          fontWeight="700"
                          fontFamily="monospace"
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

          {/* Floating Hover Tooltip HUD */}
          {hoveredCity && (
            <div className="geomap-floating-tooltip mono">
              <div className="tooltip-top">
                <span className="pulse-dot" />
                <strong>{hoveredCity.city.toUpperCase()}</strong>
                <span className="tooltip-region-badge">{getCityRegion(hoveredCity.city)}</span>
              </div>
              <div className="tooltip-metrics-grid">
                <div><span>Total Ops:</span> <strong>{hoveredCity.totalTransactions}</strong></div>
                <div><span>Flagged:</span> <strong className="red-highlight">{hoveredCity.flaggedTransactions} Incidents</strong></div>
                <div><span>Fraud Rate:</span> <strong className="red-highlight">{hoveredCity.fraudRate.toFixed(1)}%</strong></div>
                <div><span>Gross Value:</span> <strong>{formatCurrency(hoveredCity.totalAmount)}</strong></div>
              </div>
              <div className="tooltip-footer">Click to lock terminal inspector</div>
            </div>
          )}
        </div>
      ) : (
        /* Alternative Data Grid View */
        <div className="geomap-grid-view">
          <div className="grid-city-cards">
            {filteredCities.map((c) => {
              const isSelected = selectedCity?.city === c.city;
              return (
                <div
                  key={c.city}
                  className={`grid-city-card ${isSelected ? "selected" : ""}`}
                  onClick={() => onSelectCity(isSelected ? null : c)}
                >
                  <div className="card-top">
                    <strong className="city-title">{c.city}</strong>
                    <span className="region-tag">{getCityRegion(c.city)}</span>
                  </div>
                  <div className="card-stats">
                    <span className="stat-item">Ops: <strong>{c.totalTransactions}</strong></span>
                    <span className="stat-item red-highlight">Flags: <strong>{c.flaggedTransactions}</strong></span>
                    <span className="stat-item">Rate: <strong>{c.fraudRate.toFixed(1)}%</strong></span>
                    <span className="stat-item">Val: <strong>{formatCurrency(c.totalAmount)}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected City Inspector HUD */}
      {selectedCity ? (
        <div className="geomap-inspector-hud mono">
          <div className="inspector-top">
            <div className="inspector-title-group">
              <span className="pulse-dot" />
              <strong>SELECTED METROPOLITAN CLUSTER: {selectedCity.city.toUpperCase()}</strong>
              <span className="inspector-region-pill">{getCityRegion(selectedCity.city)} Region</span>
            </div>
            <div className="inspector-coords">
              <span>LAT: {CITIES_COORDINATES[selectedCity.city]?.lat.toFixed(4) || selectedCity.lat}</span>
              <span>LNG: {CITIES_COORDINATES[selectedCity.city]?.lng.toFixed(4) || selectedCity.lng}</span>
              <button
                type="button"
                className="inspector-close-btn"
                onClick={() => onSelectCity(null)}
                title="Clear selected city filter"
              >
                ✕ Deselect
              </button>
            </div>
          </div>

          <div className="inspector-kpi-row">
            <div className="insp-kpi">
              <span className="kpi-lbl">TOTAL MONITORED VOLUME</span>
              <strong className="kpi-num">{selectedCity.totalTransactions} Operations</strong>
            </div>
            <div className="insp-kpi">
              <span className="kpi-lbl">FLAGGED ANOMALIES</span>
              <strong className="kpi-num red-highlight">{selectedCity.flaggedTransactions} Incidents</strong>
            </div>
            <div className="insp-kpi">
              <span className="kpi-lbl">INCIDENT RATE</span>
              <strong className={`kpi-num ${selectedCity.fraudRate > 5 ? "rate-red" : "rate-yellow"}`}>
                {selectedCity.fraudRate.toFixed(1)}%
              </strong>
            </div>
            <div className="insp-kpi">
              <span className="kpi-lbl">GROSS TRANSACTED VALUE</span>
              <strong className="kpi-num">{formatCurrency(selectedCity.totalAmount)}</strong>
            </div>
          </div>
        </div>
      ) : (
        <div className="geomap-empty-prompt mono">
          <span>💡 Click any glowing city pin on the radar map to isolate and inspect detailed terminal statistics.</span>
        </div>
      )}
    </div>
  );
}
