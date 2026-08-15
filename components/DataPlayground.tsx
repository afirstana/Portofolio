"use client";

import { useMemo, useState } from "react";

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
            category: "All Cancer Types (Global Total)",
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

  // SVG Chart Dimensions
  const maxValue = Math.max(...filteredData.map((row) => row.value), 1);
  const chartPoints = filteredData
    .map((row, index) => {
      const x = 30 + index * (320 / Math.max(filteredData.length - 1, 1));
      const y = 164 - (row.value / maxValue) * 124;
      return `${x},${y}`;
    })
    .join(" ");

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortOrder("desc");
    }
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
        </div>

        {/* Toolbar & Category Filters */}
        <div className="playground-controls">
          <div className="filter-list" aria-label="Filter cancer types">
            {categories.map((item) => (
              <button
                type="button"
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
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
            }}
          >
            Reset view
          </button>
        </div>

        {/* Real Data KPI Cards */}
        <div className="kpi-grid" aria-live="polite">
          <div>
            <span className="mono">2019 Annual Mortality</span>
            <strong>{(latestRecord.volume / 1000000).toFixed(2)}M</strong>
            <p>{latestRecord.volume.toLocaleString()} recorded deaths in 2019.</p>
          </div>
          <div>
            <span className="mono">30-Year Trend Change</span>
            <strong>+{percentChange}%</strong>
            <p>Net growth from 1990 ({baselineRecord.volume.toLocaleString()} deaths).</p>
          </div>
          <div>
            <span className="mono">Dataset Scope</span>
            <strong>30 Years</strong>
            <p>1990–2019 standardized longitudinal panel.</p>
          </div>
        </div>

        {/* Chart & Table Panels */}
        <div className="playground-grid">
          {/* SVG Trend Chart */}
          <div className="chart-panel">
            <div className="chart-heading">
              <p className="mono">Mortality Trajectory (1990–2019)</p>
              <span>{category === "All" ? "Global Total (in thousands)" : `${category} (in thousands)`}</span>
            </div>
            
            <svg viewBox="0 0 380 190" role="img" aria-label={`Trend chart for ${category}`}>
              <path d="M30 164H350M30 102H350M30 40H350" />
              <polyline points={chartPoints} />
              <g>
                {filteredData.map((row, index) => {
                  const cx = 30 + index * (320 / Math.max(filteredData.length - 1, 1));
                  const cy = 164 - (row.value / maxValue) * 124;
                  return (
                    <circle key={row.year} cx={cx} cy={cy} r="4">
                      <title>{`Year ${row.year}: ${row.volume.toLocaleString()} deaths (${row.value.toLocaleString()}k)`}</title>
                    </circle>
                  );
                })}
              </g>
            </svg>

            <div className="chart-axis">
              {filteredData
                .filter((_, idx) => idx % 5 === 0 || idx === filteredData.length - 1)
                .map((row) => (
                  <span key={row.year}>{row.year}</span>
                ))}
            </div>
          </div>

          {/* Inspectable Data Table */}
          <div className="table-panel">
            <div className="table-heading">
              <p className="mono">Annual Records ({filteredData.length} Years)</p>
              <div>
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
              <table aria-label="Annual cancer mortality data table">
                <thead>
                  <tr>
                    <th scope="col">Year</th>
                    <th scope="col">Classification</th>
                    <th scope="col">Deaths (k)</th>
                    <th scope="col">Exact Count</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRows.map((row) => (
                    <tr key={`${row.year}-${row.category}`}>
                      <td><strong>{row.year}</strong></td>
                      <td>{row.category}</td>
                      <td>{row.value.toLocaleString()}k</td>
                      <td>{row.volume.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Data Provenance & Methodology Note */}
        <p className="playground-note">
          <strong>Data Provenance:</strong> Source records from the <em>Global Burden of Disease Study (IHME / Our World in Data)</em>. 
          Processed locally into static-first JSON with zero external API latency, demonstrating transparent analytical exploration and reproducible aggregation.
        </p>
      </div>
    </section>
  );
}
