"use client";

import React, { useState } from "react";

interface DashboardRowInfo {
  id: string;
  number: string;
  name: string;
  anchor: string;
  persona: string;
  coreObjective: string;
  keyVisualizations: string;
  badge: string;
  metricsSummary: string;
  wireframeType: "kpi-trend" | "atm-duration" | "branch-ticket" | "cyber-ato" | "card-matrix" | "aml-drain" | "master-table";
}

const DASHBOARDS_DATA: DashboardRowInfo[] = [
  {
    id: "executive",
    number: "01",
    name: "Executive Portfolio",
    anchor: "dashboard-executive",
    persona: "Chief Risk Officer / Heads of Fraud",
    coreObjective: "High-level portfolio fraud rate, dual-axis temporal volume, and top high-risk merchant exposure.",
    keyVisualizations: "5 KPI Cards, Monthly Dual-Axis Trend, Risk Donut, Top Flags, High-Risk Merchants Leaderboard",
    badge: "MACRO SURVEILLANCE",
    metricsSummary: "2,512 Txns • $762K Gross Volume • 4.86% Portfolio Fraud Rate",
    wireframeType: "kpi-trend"
  },
  {
    id: "geographic",
    number: "02",
    name: "Geographic Incident (43 Cities)",
    anchor: "dashboard-geographic",
    persona: "Regional Fraud Managers / Spatial Investigators",
    coreObjective: "Full-width spatial radar projection of Indonesia isolating regional anomaly hotspots and telemetry.",
    keyVisualizations: "Full-Width SVG Map, Mouse-Tracking Floating HUD, Island Region Slicers, City Dossier",
    badge: "SPATIAL RADAR",
    metricsSummary: "43 Metropolitan Cities • 6 Hotspots • Floating Hover HUD",
    wireframeType: "atm-duration"
  },
  {
    id: "channels",
    number: "03",
    name: "Channel Topology & Instruments",
    anchor: "dashboard-channels",
    persona: "ATM Network Leads & Digital Security",
    coreObjective: "Cash-out surges across ATM terminals, credential stuffing online, and debit vs credit rails.",
    keyVisualizations: "ATM Peak Analysis, Digital Bot Velocity, Debit vs Credit Exposure, Channel × Risk Matrix",
    badge: "CHANNEL DYNAMICS",
    metricsSummary: "ATM vs Online vs Branch • Debit vs Credit Matrix Heatmap",
    wireframeType: "card-matrix"
  },
  {
    id: "branches",
    number: "04",
    name: "Bank Branch Operations",
    anchor: "dashboard-branches",
    persona: "Branch Operations / Teller Supervisors",
    coreObjective: "Over-the-counter high-ticket transactions, teller overrides, and business hour distribution.",
    keyVisualizations: "Branch Ticket Comparisons, Teller Surge Ratios, Business Hours vs Off-Hours",
    badge: "IN-PERSON COUNTER",
    metricsSummary: "Mean Ticket Surges • Teller Overrides • In-Person AML",
    wireframeType: "branch-ticket"
  },
  {
    id: "behavioral",
    number: "05",
    name: "Behavioral & AML Risk",
    anchor: "dashboard-behavioral",
    persona: "AML Investigators / Behavioral Analysts",
    coreObjective: "Demographic risk curves, rapid balance exhaustion (>70% drain), and top 10 targeted queue.",
    keyVisualizations: "Age Cohort Bins (18–66+), Occupation Vulnerability, Balance Drain Scatter, Target Accounts Queue",
    badge: "AML & BEHAVIORAL",
    metricsSummary: "6 Age Cohorts • Balance Drain (>70%) • Priority Account Queue",
    wireframeType: "aml-drain"
  },
  {
    id: "audit",
    number: "06",
    name: "Forensic Transaction Audit",
    anchor: "dashboard-forensic",
    persona: "Fraud Analysts / Compliance Officers",
    coreObjective: "Granular forensic transaction audit table with multi-criteria slicers and 5-txn account history.",
    keyVisualizations: "12-Column Master Table, 5-Transaction Historical Context Sub-Panel, Min Risk Slider, CSV Export",
    badge: "FORENSIC INVESTIGATION",
    metricsSummary: "12-Col Master Table • Min Risk Slider • CSV Export",
    wireframeType: "master-table"
  }
];

export function DashboardArchitectureTable() {
  const [hoveredDashboard, setHoveredDashboard] = useState<DashboardRowInfo | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="architecture-table-section mono" onMouseMove={handleMouseMove}>
      <div className="table-scroll-wrapper">
        <table className="architecture-master-table">
          <thead>
            <tr>
              <th>DASHBOARD (HOVER FOR PREVIEW)</th>
              <th>PERSONA</th>
              <th>CORE OBJECTIVE</th>
              <th>KEY VISUALIZATIONS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {DASHBOARDS_DATA.map((row) => {
              const isHovered = hoveredDashboard?.id === row.id;
              return (
                <tr
                  key={row.id}
                  className={`architecture-row ${isHovered ? "hovered-row" : ""}`}
                  onMouseEnter={() => setHoveredDashboard(row)}
                  onMouseLeave={() => setHoveredDashboard(null)}
                >
                  <td className="dashboard-name-cell">
                    <a
                      href={`#${row.anchor}`}
                      className="dashboard-name-link"
                      title={`Click to jump to ${row.name}`}
                    >
                      <span className="dash-num-tag">{row.number}</span>
                      <strong className="dash-name-title">{row.name}</strong>
                      <span className="hover-peek-indicator">👁️ Sneak Peek</span>
                    </a>
                  </td>
                  <td className="persona-cell">
                    <span className="persona-text">{row.persona}</span>
                  </td>
                  <td className="objective-cell">
                    <p className="objective-text">{row.coreObjective}</p>
                  </td>
                  <td className="visuals-cell">
                    <span className="visuals-text">{row.keyVisualizations}</span>
                  </td>
                  <td className="action-cell">
                    <a href={`#${row.anchor}`} className="table-jump-btn">
                      Jump ↓
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Floating Sneak Peek Hover Card */}
      {hoveredDashboard && (
        <div
          className="floating-sneak-peek-card mono"
          style={{
            top: Math.min(mousePos.y + 16, typeof window !== "undefined" ? window.innerHeight - 280 : 400),
            left: Math.min(mousePos.x + 20, typeof window !== "undefined" ? window.innerWidth - 380 : 600),
          }}
        >
          <div className="sneak-peek-header">
            <div className="sneak-peek-title-group">
              <span className="pulse-dot" />
              <strong>{hoveredDashboard.number}. {hoveredDashboard.name.toUpperCase()}</strong>
            </div>
            <span className="sneak-peek-badge">{hoveredDashboard.badge}</span>
          </div>

          <div className="sneak-peek-meta">
            <div><span className="meta-lbl">Target Persona:</span> <strong>{hoveredDashboard.persona}</strong></div>
            <div><span className="meta-lbl">Core Scope:</span> <span className="green-highlight">{hoveredDashboard.metricsSummary}</span></div>
          </div>

          {/* Mini Mockup Visual Wireframe */}
          <div className="sneak-peek-wireframe">
            {hoveredDashboard.wireframeType === "kpi-trend" && (
              <div className="mini-wireframe kpi-wf">
                <div className="mini-kpis-row">
                  <div className="m-kpi"><span>TXNS</span><strong>2,512</strong></div>
                  <div className="m-kpi"><span>FRAUD</span><strong className="red-highlight">2.8%</strong></div>
                  <div className="m-kpi"><span>VALUE</span><strong>$762K</strong></div>
                </div>
                <div className="mini-bars-mockup">
                  {[35, 55, 75, 45, 90, 60, 80, 50, 65, 85, 40, 70].map((h, idx) => (
                    <div key={idx} className="m-bar" style={{ height: `${h}%` }}>
                      <div className="m-bar-red" style={{ height: "30%" }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hoveredDashboard.wireframeType === "atm-duration" && (
              <div className="mini-wireframe atm-wf">
                <div className="m-vector-row"><span>🌙 Odd-Hour (00–04 UTC):</span> <span className="red-highlight">28% Spikes</span></div>
                <div className="m-vector-row"><span>⚡ Rapid Swipes (&lt;5m):</span> <span className="red-highlight">18% Clusters</span></div>
                <div className="m-dur-bar"><span>Clean: 145s</span> <span className="red-highlight">Flagged: 42s</span></div>
              </div>
            )}

            {hoveredDashboard.wireframeType === "branch-ticket" && (
              <div className="mini-wireframe branch-wf">
                <div className="m-vector-row"><span>Teller Normal Ticket:</span> <strong>$180</strong></div>
                <div className="m-vector-row"><span>Surge Anomaly Average:</span> <strong className="red-highlight">$920 (5.1x)</strong></div>
                <div className="m-occ-chips"><span>Doctor</span><span>Engineer</span><span>Retired</span><span>Student</span></div>
              </div>
            )}

            {hoveredDashboard.wireframeType === "cyber-ato" && (
              <div className="mini-wireframe cyber-wf">
                <div className="m-vector-row"><span>🔑 Login Retries &gt;= 3:</span> <strong className="red-highlight">ATO Risk Flag</strong></div>
                <div className="m-vector-row"><span>📱 New Device Pairing:</span> <strong className="red-highlight">Fingerprint Switch</strong></div>
                <div className="m-vector-row"><span>🤖 Bot Checkout (&lt;5m):</span> <strong className="red-highlight">Script Velocity</strong></div>
              </div>
            )}

            {hoveredDashboard.wireframeType === "card-matrix" && (
              <div className="mini-wireframe matrix-wf">
                <div className="m-matrix-grid">
                  <div className="m-cell">ATM: Low 612</div>
                  <div className="m-cell red">ATM: High 48</div>
                  <div className="m-cell">Web: Low 580</div>
                  <div className="m-cell red">Web: High 72</div>
                </div>
              </div>
            )}

            {hoveredDashboard.wireframeType === "aml-drain" && (
              <div className="mini-wireframe aml-wf">
                <div className="m-vector-row"><span>⚠️ Balance Drain:</span> <strong className="red-highlight">&gt; 70% Liquidity Drop</strong></div>
                <div className="m-vector-row"><span>Target Priority Queue:</span> <strong>10 Accounts Isolated</strong></div>
                <div className="m-dossier-pill">🔒 Freeze • 📑 SAR Report • 📲 2FA</div>
              </div>
            )}

            {hoveredDashboard.wireframeType === "master-table" && (
              <div className="mini-wireframe table-wf">
                <div className="m-table-rows">
                  <div className="m-t-row"><span>TXN-10024</span><span>$1,420</span><span className="red-highlight">High (5/6)</span></div>
                  <div className="m-t-row"><span>TXN-10089</span><span>$890</span><span className="yellow-text">Med (3/6)</span></div>
                  <div className="m-t-row"><span>TXN-10112</span><span>$240</span><span className="green-text">Low (1/6)</span></div>
                </div>
                <div className="m-csv-tag">📥 Instant CSV Export Enabled</div>
              </div>
            )}
          </div>

          <div className="sneak-peek-footer">
            <span>Click row to jump directly to this dashboard</span>
            <span className="jump-arrow">➔</span>
          </div>
        </div>
      )}
    </div>
  );
}
