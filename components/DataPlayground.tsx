"use client";

import { useMemo, useState, useRef } from "react";
import Link from "next/link";

export type PlaygroundRow = {
  year: string;
  month: string;
  category: string;
  value: number; // in thousands (k)
  volume: number; // raw count
  metric_label?: string;
};

type SortKey = "year" | "value" | "volume";

export function DataPlayground({ data }: { data: PlaygroundRow[] }) {
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortKey>("year");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [hoveredPoint, setHoveredPoint] = useState<{ year: string; value: number; volume: number; x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(data.map((row) => row.category)))];
  }, [data]);

  // Aggregate or filter data by selected category
  const filteredData = useMemo(() => {
    if (category === "All") {
      // Group by year and sum values across all cancer types for global total trend
      const yearMap = new Map<string, { year: string; month: string; category: string; value: number; volume: number }>();
      for (const row of data) {
        const existing = yearMap.get(row.year);
        if (existing) {
          existing.value = Math.round((existing.value + row.value) * 10) / 10;
          existing.volume += row.volume;
        } else {
          yearMap.set(row.year, {
            year: row.year,
            month: row.year,
            category: "Global Total",
            value: row.value,
            volume: row.volume,
          });
        }
      }
      return Array.from(yearMap.values()).sort((a, b) => parseInt(a.year) - parseInt(b.year));
    }
    return data
      .filter((row) => row.category === category)
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }, [category, data]);

  const sortedRows = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1;
      if (sortBy === "year") {
        return (parseInt(a.year) - parseInt(b.year)) * multiplier;
      }
      return (a[sortBy] - b[sortBy]) * multiplier;
    });
  }, [filteredData, sortBy, sortOrder]);

  const latestRecord = filteredData[filteredData.length - 1] || { value: 0, volume: 0 };
  const baselineRecord = filteredData[0] || { value: 0, volume: 0 };
  const percentChange = baselineRecord.volume > 0
    ? (((latestRecord.volume - baselineRecord.volume) / baselineRecord.volume) * 100).toFixed(1)
    : "0.0";

  // SVG Chart Dimensions with generous padding and clean minimal layout
  const maxValue = Math.max(...filteredData.map((row) => row.value), 1);
  const minValue = Math.min(...filteredData.map((row) => row.value), 0);

  const pointsCoordinates = useMemo(() => {
    return filteredData.map((row, index) => {
      const x = 35 + index * (310 / Math.max(filteredData.length - 1, 1));
      const y = 155 - ((row.value - minValue * 0.8) / (maxValue - minValue * 0.8)) * 115;
      return { ...row, x, y };
    });
  }, [filteredData, minValue, maxValue]);

  const chartPoints = pointsCoordinates.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPoints = `35,160 ${chartPoints} 345,160`;

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortOrder("desc");
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || pointsCoordinates.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 380;
    
    // Find closest point along the X axis
    let closest = pointsCoordinates[0];
    let minDistance = Math.abs(closest.x - mouseX);
    for (let i = 1; i < pointsCoordinates.length; i++) {
      const dist = Math.abs(pointsCoordinates[i].x - mouseX);
      if (dist < minDistance) {
        minDistance = dist;
        closest = pointsCoordinates[i];
      }
    }
    setHoveredPoint(closest);
  };

  return (
    <section id="playground" className="section playground-section" aria-labelledby="playground-title">
      <div className="page-width">
        <p className="section-label mono">05 / Real-world data playground</p>
        
        <div className="playground-heading">
          <h2 id="playground-title" className="section-title">
            Global Cancer Epidemiology & Trends.
          </h2>
          <p className="body-copy">
            Real panel dataset (1990–2019) from <strong>Our World in Data</strong> & <strong>IHME Global Burden of Disease</strong>. 
            Inspect 30-year epidemiological trajectories, longitudinal shifts, and mortality distribution across major cancer classifications.
          </p>
          <div style={{ marginTop: 14, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <Link
              href="/projects/global-cancer-epidemiology-surveillance"
              className="mono"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: "var(--accent)",
                color: "#000",
                fontWeight: 700,
                padding: "8px 16px",
                borderRadius: 3,
                fontSize: 11.5,
                textDecoration: "none",
                letterSpacing: "0.04em",
              }}
            >
              <span>VIEW FULL 281.4k SURVEILLANCE CASE STUDY</span>
              <span style={{ fontSize: 13 }}>→</span>
            </Link>
            <span className="mono" style={{ fontSize: 10.5, color: "var(--dim)" }}>
              [204-Country rankings, 29-cancer mix, tobacco driver & GDP scatter]
            </span>
          </div>
        </div>

        {/* Toolbar & Category Filters */}
        <div className="playground-controls">
          <div className="filter-list" aria-label="Filter cancer types">
            {categories.map((item) => (
              <button
                type="button"
                aria-pressed={category === item}
                onClick={() => {
                  setCategory(item);
                  setHoveredPoint(null);
                }}
                key={item}
              >
                {item}
              </button>
            ))}
          </div>
          <button
            className="reset-button mono"
            type="button"
            onClick={() => {
              setCategory("All");
              setSortBy("year");
              setSortOrder("desc");
              setHoveredPoint(null);
            }}
          >
            Reset view
          </button>
        </div>

        {/* Purposeful Signal-Driven KPI Cards */}
        <div className="kpi-grid" aria-live="polite">
          <div>
            <span className="mono" style={{ color: "var(--accent)", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--accent)" }} />
              2019 ANNUAL MORTALITY (GLOBAL BURDEN)
            </span>
            <strong style={{ color: "var(--accent)", textShadow: "0 0 24px rgba(255,77,28,0.2)" }}>
              {(latestRecord.volume / 1000000).toFixed(2)}M
            </strong>
            <p>{latestRecord.volume.toLocaleString()} recorded deaths in 2019 ({category === "All" ? "all types" : category}).</p>
          </div>
          <div>
            <span className="mono">30-YEAR TREND CHANGE</span>
            <strong>+{percentChange}%</strong>
            <p>Net growth from 1990 ({baselineRecord.volume.toLocaleString()} baseline deaths).</p>
          </div>
          <div>
            <span className="mono">DATASET SCOPE</span>
            <strong>30 Years</strong>
            <p>1990–2019 standardized longitudinal panel (228 entities).</p>
          </div>
        </div>

        {/* Chart & Table Panels */}
        <div className="playground-grid">
          {/* Clean, Minimalist SVG Line Chart */}
          <div className="chart-panel">
            <div className="chart-heading">
              <div>
                <p className="mono" style={{ margin: 0 }}>Mortality Trajectory (1990–2019)</p>
                <span style={{ fontSize: 10, color: "var(--dim)" }}>
                  {category === "All" ? "Global Total (in thousands)" : `${category} (in thousands)`}
                </span>
              </div>
              {hoveredPoint ? (
                <div style={{ backgroundColor: "rgba(255,77,28,0.15)", border: "1px solid var(--accent)", padding: "3px 9px", borderRadius: 4, fontSize: 10, color: "#ffffff", fontFamily: "monospace" }}>
                  <strong style={{ color: "var(--accent)" }}>Year {hoveredPoint.year}:</strong> {hoveredPoint.volume.toLocaleString()} deaths ({hoveredPoint.value.toLocaleString()}k)
                </div>
              ) : (
                <div style={{ fontSize: 9, color: "var(--dim)", fontFamily: "monospace" }}>
                  Hover over chart to trace
                </div>
              )}
            </div>
            
            <svg
              ref={svgRef}
              viewBox="0 0 380 185"
              role="img"
              aria-label={`Trend chart for ${category}`}
              style={{ marginTop: 12, cursor: "crosshair" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff4d1c" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ff4d1c" stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {/* Minimal Baseline Grid */}
              <path d="M35 155H345M35 100H345M35 45H345" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

              {/* Shaded Area Under Curve */}
              <polygon points={areaPoints} fill="url(#chartGradient)" />

              {/* Single Crisp Clean Trend Line */}
              <polyline
                points={chartPoints}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Crosshair and Single Tracker Dot ON HOVER ONLY */}
              {hoveredPoint && (
                <g>
                  {/* Vertical Crosshair */}
                  <line
                    x1={hoveredPoint.x}
                    y1={25}
                    x2={hoveredPoint.x}
                    y2={155}
                    stroke="rgba(255,77,28,0.5)"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  {/* Outer Pulsing Glow */}
                  <circle
                    cx={hoveredPoint.x}
                    cy={hoveredPoint.y}
                    r="8"
                    fill="rgba(255,77,28,0.25)"
                  />
                  {/* Center Dot */}
                  <circle
                    cx={hoveredPoint.x}
                    cy={hoveredPoint.y}
                    r="4.5"
                    fill="var(--accent)"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </g>
              )}
            </svg>

            {/* Clean X-Axis with 5-Year Spacing */}
            <div className="chart-axis" style={{ padding: "0 10px" }}>
              {filteredData
                .filter((_, idx) => idx % 5 === 0 || idx === filteredData.length - 1)
                .map((row) => (
                  <span key={row.year} style={{ color: hoveredPoint?.year === row.year ? "var(--accent)" : "var(--dim)", fontWeight: hoveredPoint?.year === row.year ? "bold" : "normal" }}>
                    {row.year}
                  </span>
                ))}
            </div>
          </div>

          {/* Inspectable Data Table */}
          <div className="table-panel">
            <div className="table-heading">
              <p className="mono">Annual Records ({filteredData.length} Years)</p>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  type="button"
                  aria-pressed={sortBy === "year"}
                  onClick={() => toggleSort("year")}
                >
                  Year {sortBy === "year" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </button>
                <button
                  type="button"
                  aria-pressed={sortBy === "volume"}
                  onClick={() => toggleSort("volume")}
                >
                  Deaths {sortBy === "volume" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </button>
              </div>
            </div>

            <div className="table-scroll">
              <table aria-label="Annual cancer mortality data table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th scope="col" style={{ width: "18%" }}>Year</th>
                    <th scope="col" style={{ width: "38%" }}>Classification</th>
                    <th scope="col" style={{ width: "22%", textAlign: "right" }}>Deaths (k)</th>
                    <th scope="col" style={{ width: "22%", textAlign: "right" }}>Exact Count</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRows.map((row) => {
                    const isHovered = hoveredPoint?.year === row.year;
                    const matchedCoord = pointsCoordinates.find((p) => p.year === row.year);

                    return (
                      <tr
                        key={`${row.year}-${row.category}`}
                        onMouseEnter={() => {
                          if (matchedCoord) {
                            setHoveredPoint(matchedCoord);
                          }
                        }}
                        onMouseLeave={() => setHoveredPoint(null)}
                        style={{
                          backgroundColor: isHovered ? "var(--accent-subtle)" : "transparent",
                          cursor: "pointer",
                          transition: "background 0.15s ease-out",
                          borderLeft: isHovered ? "3px solid var(--accent)" : "3px solid transparent",
                        }}
                      >
                        <td><strong style={{ color: isHovered ? "var(--accent)" : "var(--ink-heading)" }}>{row.year}</strong></td>
                        <td style={{ color: "var(--ink)" }}>
                          {row.category === "All Cancer Types (Global Total)" ? "Global Total" : row.category}
                        </td>
                        <td style={{ textAlign: "right", fontFamily: "monospace", color: "var(--ink)" }}>
                          {row.value.toLocaleString()}k
                        </td>
                        <td style={{ textAlign: "right", fontFamily: "monospace", color: isHovered ? "var(--accent)" : "var(--muted)" }}>
                          {row.volume.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Data Provenance & Methodology Note */}
        <div className="playground-note" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ margin: 0 }}>
            <strong>Data Provenance:</strong> Source records from the <em>Global Burden of Disease Study (IHME / Our World in Data)</em>. 
            Processed locally into static-first JSON with zero external API latency, demonstrating transparent analytical exploration and reproducible aggregation.
          </p>
          <Link
            href="/projects/global-cancer-epidemiology-surveillance"
            className="mono"
            style={{ color: "var(--accent)", textDecoration: "underline", fontSize: 11, whiteSpace: "nowrap" }}
          >
            Open Full Working Portfolio Study ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
