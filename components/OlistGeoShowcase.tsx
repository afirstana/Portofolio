"use client";

import React, { useState } from "react";
import mapData from "@/content/data/brazil_map.json";

type StateRecord = {
  uf: string;
  name: string;
  region: string;
  orders: number;
  revenue: number;
  revenue_pct: number;
  aov: number;
  avg_lead_time: number;
  seller_count: number;
  top_city: string;
  cross_state_pct: number;
  insight: string;
};

const STATES_METRICS: Record<string, StateRecord> = {
  "SP": { uf: "SP", name: "São Paulo", region: "Southeast", orders: 40501, revenue: 5770266.2, revenue_pct: 37.4, aov: 142.5, avg_lead_time: 7.8, seller_count: 1849, top_city: "São Paulo (R$ 2.11M)", cross_state_pct: 21.4, insight: "Primary marketplace engine. Generates 37.4% of national GMV and houses 59.7% of all active sellers." },
  "RJ": { uf: "RJ", name: "Rio de Janeiro", region: "Southeast", orders: 12350, revenue: 2055690.4, revenue_pct: 13.3, aov: 166.4, avg_lead_time: 14.2, seller_count: 171, top_city: "Rio de Janeiro (R$ 1.11M)", cross_state_pct: 74.8, insight: "#2 market nationally. Prime candidate for secondary regional fulfillment hub." },
  "MG": { uf: "MG", name: "Minas Gerais", region: "Southeast", orders: 11354, revenue: 1819277.6, revenue_pct: 11.8, aov: 160.2, avg_lead_time: 11.9, seller_count: 244, top_city: "Belo Horizonte (R$ 406k)", cross_state_pct: 68.2, insight: "#3 market nationally. Strategic logistics nexus connecting Southeast and Northeast corridors." },
  "RS": { uf: "RS", name: "Rio Grande do Sul", region: "South", orders: 5345, revenue: 861802.4, revenue_pct: 5.6, aov: 161.2, avg_lead_time: 14.8, seller_count: 129, top_city: "Porto Alegre (R$ 214k)", cross_state_pct: 82.1, insight: "Southern economic leader with high purchasing power and strong consumer demand." },
  "PR": { uf: "PR", name: "Paraná", region: "South", orders: 4923, revenue: 781919.6, revenue_pct: 5.1, aov: 158.8, avg_lead_time: 11.6, seller_count: 183, top_city: "Curitiba (R$ 238k)", cross_state_pct: 71.5, insight: "High manufacturing density with moderate delivery lead times from São Paulo." },
  "SC": { uf: "SC", name: "Santa Catarina", region: "South", orders: 3546, revenue: 595208.4, revenue_pct: 3.9, aov: 167.8, avg_lead_time: 13.9, seller_count: 190, top_city: "Florianópolis (R$ 112k)", cross_state_pct: 77.4, insight: "High seller concentration relative to population; well-integrated southern distribution." },
  "BA": { uf: "BA", name: "Bahia", region: "Northeast", orders: 3256, revenue: 591270.6, revenue_pct: 3.8, aov: 181.6, avg_lead_time: 15.6, seller_count: 19, top_city: "Salvador (R$ 207k)", cross_state_pct: 94.2, insight: "Largest northeastern market with 94.2% cross-state transit dependency." },
  "DF": { uf: "DF", name: "Distrito Federal", region: "Central-West", orders: 2080, revenue: 346146.2, revenue_pct: 2.2, aov: 166.4, avg_lead_time: 12.3, seller_count: 30, top_city: "Brasília (R$ 345k)", cross_state_pct: 91.0, insight: "Federal capital hub with affluent civil servant base and steady online demand." },
  "GO": { uf: "GO", name: "Goiás", region: "Central-West", orders: 1957, revenue: 334294.2, revenue_pct: 2.2, aov: 170.8, avg_lead_time: 14.7, seller_count: 40, top_city: "Goiânia (R$ 130k)", cross_state_pct: 89.5, insight: "Key agribusiness hub with expanding e-commerce volume and stable order value." },
  "ES": { uf: "ES", name: "Espírito Santo", region: "Southeast", orders: 1995, revenue: 317682.6, revenue_pct: 2.1, aov: 159.2, avg_lead_time: 15.1, seller_count: 23, top_city: "Vitória (R$ 78k)", cross_state_pct: 88.0, insight: "Coastal southeast state benefiting from proximity to RJ and SP logistics hubs." },
  "PE": { uf: "PE", name: "Pernambuco", region: "Northeast", orders: 1593, revenue: 313904.5, revenue_pct: 2.0, aov: 197.0, avg_lead_time: 17.5, seller_count: 9, top_city: "Recife (R$ 128k)", cross_state_pct: 96.5, insight: "Northeastern tech and trade hub with higher average basket size balancing longer transit." },
  "CE": { uf: "CE", name: "Ceará", region: "Northeast", orders: 1308, revenue: 272464.3, revenue_pct: 1.8, aov: 208.3, avg_lead_time: 20.3, seller_count: 13, top_city: "Fortaleza (R$ 134k)", cross_state_pct: 97.2, insight: "Long-distance coastal market experiencing ~20-day delivery cycles from São Paulo." },
  "PA": { uf: "PA", name: "Pará", region: "North", orders: 947, revenue: 212543.8, revenue_pct: 1.4, aov: 224.4, avg_lead_time: 22.8, seller_count: 1, top_city: "Belém (R$ 102k)", cross_state_pct: 99.8, insight: "Amazonian gateway with high freight barrier driving basket consolidation >R$ 220." },
  "MT": { uf: "MT", name: "Mato Grosso", region: "Central-West", orders: 886, revenue: 182746.5, revenue_pct: 1.2, aov: 206.2, avg_lead_time: 17.6, seller_count: 4, top_city: "Cuiabá (R$ 84k)", cross_state_pct: 98.4, insight: "High-income agribusiness region with above-average basket sizes." },
  "MA": { uf: "MA", name: "Maranhão", region: "Northeast", orders: 717, revenue: 154687.2, revenue_pct: 1.0, aov: 215.7, avg_lead_time: 20.8, seller_count: 1, top_city: "São Luís (R$ 72k)", cross_state_pct: 99.5, insight: "Challenging northern logistics corridor requiring ~21 days transit from southeast warehouses." },
  "MS": { uf: "MS", name: "Mato Grosso do Sul", region: "Central-West", orders: 699, revenue: 133596.1, revenue_pct: 0.9, aov: 191.1, avg_lead_time: 14.9, seller_count: 5, top_city: "Campo Grande (R$ 68k)", cross_state_pct: 96.0, insight: "Southern central-west state with steady consumer purchasing power." },
  "PB": { uf: "PB", name: "Paraíba", region: "Northeast", orders: 517, revenue: 136274.6, revenue_pct: 0.9, aov: 263.5, avg_lead_time: 19.8, seller_count: 6, top_city: "João Pessoa (R$ 64k)", cross_state_pct: 97.5, insight: "Highest AOV in the Northeast region (>R$ 260) with strong premium consumer demand." },
  "PI": { uf: "PI", name: "Piauí", region: "Northeast", orders: 482, revenue: 105847.4, revenue_pct: 0.7, aov: 219.6, avg_lead_time: 18.9, seller_count: 1, top_city: "Teresina (R$ 56k)", cross_state_pct: 99.2, insight: "High dependency on national distribution; minimal local seller coverage." },
  "RN": { uf: "RN", name: "Rio Grande do Norte", region: "Northeast", orders: 474, revenue: 108745.2, revenue_pct: 0.7, aov: 229.4, avg_lead_time: 18.6, seller_count: 2, top_city: "Natal (R$ 59k)", cross_state_pct: 98.7, insight: "Coastal tourist economy with concentrated urban delivery demand in Natal." },
  "AL": { uf: "AL", name: "Alagoas", region: "Northeast", orders: 401, revenue: 92350.8, revenue_pct: 0.6, aov: 230.3, avg_lead_time: 23.5, seller_count: 1, top_city: "Maceió (R$ 51k)", cross_state_pct: 99.0, insight: "High transit duration (~23.5 days) creating customer friction and review score pressure." },
  "SE": { uf: "SE", name: "Sergipe", region: "Northeast", orders: 341, revenue: 72154.2, revenue_pct: 0.5, aov: 211.6, avg_lead_time: 20.4, seller_count: 2, top_city: "Aracaju (R$ 44k)", cross_state_pct: 98.2, insight: "Smallest geographical state in Brazil with high urban concentration in Aracaju." },
  "TO": { uf: "TO", name: "Tocantins", region: "North", orders: 274, revenue: 60578.4, revenue_pct: 0.4, aov: 221.1, avg_lead_time: 16.8, seller_count: 0, top_city: "Palmas (R$ 29k)", cross_state_pct: 100.0, insight: "100% cross-state reliance. Fast-growing agricultural state with zero local seller base." },
  "RO": { uf: "RO", name: "Rondônia", region: "North", orders: 243, revenue: 56975.7, revenue_pct: 0.4, aov: 234.5, avg_lead_time: 19.3, seller_count: 2, top_city: "Porto Velho (R$ 31k)", cross_state_pct: 98.8, insight: "Western Amazonian state with high basket value (R$ 234.50) offsetting high freight costs." },
  "AM": { uf: "AM", name: "Amazonas", region: "North", orders: 145, revenue: 27596.2, revenue_pct: 0.2, aov: 190.3, avg_lead_time: 25.6, seller_count: 1, top_city: "Manaus (R$ 22k)", cross_state_pct: 98.6, insight: "Longest average delivery lead time (25.6 days) due to river-based transit routes." },
  "AC": { uf: "AC", name: "Acre", region: "North", orders: 80, revenue: 19586.2, revenue_pct: 0.1, aov: 244.8, avg_lead_time: 20.4, seller_count: 0, top_city: "Rio Branco (R$ 15k)", cross_state_pct: 100.0, insight: "Farthest western state (>2,700 km). Second highest AOV nationally (R$ 244.80)." },
  "AP": { uf: "AP", name: "Amapá", region: "North", orders: 67, revenue: 16141.8, revenue_pct: 0.1, aov: 240.9, avg_lead_time: 26.2, seller_count: 0, top_city: "Macapá (R$ 13k)", cross_state_pct: 100.0, insight: "Isolated northern delta state with 26.2 days lead time and 100% reliance on out-of-state fulfillment." },
  "RR": { uf: "RR", name: "Roraima", region: "North", orders: 41, revenue: 9039.5, revenue_pct: 0.1, aov: 220.5, avg_lead_time: 27.9, seller_count: 0, top_city: "Boa Vista (R$ 8k)", cross_state_pct: 100.0, insight: "Farthest northern state (3,280 km). Longest transit time nationally (27.9 days)." }
};

const DISTANCE_SPECTRUM = [
  { tier: "< 50 km", lead_time: 5.7, label: "Metro / Local", orders: "11.7k orders", speed: "5.7 Days", color: "#10b981" },
  { tier: "50 – 200 km", lead_time: 7.6, label: "Intra-State Road", orders: "12.9k orders", speed: "7.6 Days", color: "#34d399" },
  { tier: "200 – 500 km", lead_time: 11.7, label: "Regional Neighbor", orders: "30.3k orders", speed: "11.7 Days", color: "#facc15" },
  { tier: "500 – 1,000 km", lead_time: 13.8, label: "Inter-State Trunk", orders: "25.7k orders", speed: "13.8 Days", color: "#fb923c" },
  { tier: "1,000 – 2,000 km", lead_time: 17.5, label: "Long-Haul Corridor", orders: "9.7k orders", speed: "17.5 Days", color: "#ff4d1c" },
  { tier: "> 2,000 km", lead_time: 20.7, label: "Continental Remote", orders: "5.6k orders", speed: "20.7 Days", color: "#ef4444" }
];

export function OlistGeoShowcase() {
  const [hoveredUF, setHoveredUF] = useState<string>("SP");
  const activeState = STATES_METRICS[hoveredUF] || STATES_METRICS["SP"];

  const getStateColor = (uf: string, isHovered: boolean) => {
    if (isHovered) return "var(--accent)";
    const metric = STATES_METRICS[uf];
    if (!metric) return "#1c1c24";
    if (metric.revenue_pct >= 20) return "rgba(255, 77, 28, 0.85)";
    if (metric.revenue_pct >= 10) return "rgba(255, 77, 28, 0.60)";
    if (metric.revenue_pct >= 3) return "rgba(255, 140, 50, 0.45)";
    if (metric.revenue_pct >= 1) return "rgba(255, 255, 255, 0.22)";
    return "rgba(255, 255, 255, 0.10)";
  };

  return (
    <div
      style={{
        margin: "36px 0",
        backgroundColor: "#07070a",
        border: "1px solid #1c1c24",
        borderRadius: 4,
        padding: "20px",
      }}
      aria-label="Olist Brazil Geospatial Logistics Map"
    >
      <div style={{ borderBottom: "1px solid #181822", paddingBottom: 12, marginBottom: 16 }}>
        <span className="mono" style={{ color: "var(--accent)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          GEOSPATIAL SUPPLY CHAIN BOTTLENECK • OLIST BRAZIL (27 STATES)
        </span>
        <h3 style={{ fontSize: "clamp(18px, 2.2vw, 24px)", color: "#ffffff", letterSpacing: "-0.03em", margin: "3px 0 0" }}>
          Geographic Revenue Monopoly & Cross-State Lead Time Disparity
        </h3>
      </div>

      {/* Map & Telemetry HUD Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 18, alignItems: "start", marginBottom: 18 }}>
        {/* Real Brazil Vector Map */}
        <div style={{ backgroundColor: "#060608", border: "1px solid #1a1a22", borderRadius: 3, padding: "14px", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span className="mono" style={{ color: "var(--accent)", fontSize: 9 }}>
              INTERACTIVE BRAZIL MAP (HOVER ANY STATE)
            </span>
            <span className="mono" style={{ color: "var(--dim)", fontSize: 9 }}>
              27 STATES (UF)
            </span>
          </div>

          <div style={{ position: "relative", width: "100%", height: 350, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg
              viewBox="0 0 550 620"
              style={{ width: "100%", height: "100%", maxHeight: 350, overflow: "visible" }}
              role="img"
              aria-label="Interactive SVG Map of Brazil E-Commerce GMV by State"
            >
              <defs>
                <filter id="geoEmberGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ff4d1c" floodOpacity="0.6" />
                </filter>
              </defs>

              {Object.entries(mapData.paths).map(([uf, pathD]) => {
                const isHovered = hoveredUF === uf;
                const centroid = (mapData.centroids as Record<string, { x: number; y: number }>)[uf];

                return (
                  <g
                    key={uf}
                    onMouseEnter={() => setHoveredUF(uf)}
                    onClick={() => setHoveredUF(uf)}
                    style={{ cursor: "pointer", transition: "all 0.15s ease" }}
                  >
                    <path
                      d={pathD}
                      fill={getStateColor(uf, isHovered)}
                      stroke={isHovered ? "#ffffff" : "#1f1f28"}
                      strokeWidth={isHovered ? 2 : 0.8}
                      filter={isHovered ? "url(#geoEmberGlow)" : "none"}
                    />

                    {centroid && (
                      <text
                        x={centroid.x}
                        y={centroid.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={isHovered ? "#ffffff" : (uf === "SP" || uf === "RJ" || uf === "MG" ? "#ffffff" : "var(--dim)")}
                        fontSize={isHovered ? 12 : (uf === "SP" || uf === "RJ" || uf === "MG" || uf === "BA" || uf === "RS" ? 10 : 8)}
                        fontFamily="'Courier New', monospace"
                        fontWeight={isHovered || uf === "SP" ? "bold" : "normal"}
                        style={{ pointerEvents: "none" }}
                      >
                        {uf}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            <div style={{ position: "absolute", bottom: 6, left: 8, fontSize: 8, fontFamily: "monospace", color: "var(--dim)", backgroundColor: "rgba(8,8,12,0.9)", border: "1px solid #1c1c24", padding: "3px 6px", borderRadius: 2 }}>
              <span style={{ color: "var(--accent)", marginRight: 5 }}>■ Southeast Core (62.5%)</span>
              <span style={{ color: "rgba(255,140,50,0.8)", marginRight: 5 }}>■ South (14.6%)</span>
              <span>□ Other</span>
            </div>
          </div>
        </div>

        {/* Real-Time Telemetry HUD */}
        <div style={{ backgroundColor: "#09090d", border: "1px solid #22222c", borderRadius: 3, padding: "16px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #1a1a24", paddingBottom: 10, marginBottom: 12 }}>
            <div>
              <span className="mono" style={{ color: "var(--accent)", fontSize: 9 }}>STATE TELEMETRY</span>
              <h4 style={{ fontSize: 18, color: "#ffffff", margin: "2px 0 0" }}>
                {activeState.name} <span className="mono" style={{ fontSize: 12, color: "var(--accent)", border: "1px solid var(--accent)", padding: "1px 4px", borderRadius: 2 }}>[{activeState.uf}]</span>
              </h4>
              <span className="mono" style={{ fontSize: 9, color: "var(--dim)", display: "block", marginTop: 2 }}>
                {activeState.region.toUpperCase()} • Top City: {activeState.top_city}
              </span>
            </div>

            <div style={{ textAlign: "right" }}>
              <strong style={{ fontSize: 18, color: "var(--accent)", fontFamily: "monospace", display: "block" }}>
                {activeState.revenue_pct}%
              </strong>
              <span className="mono" style={{ fontSize: 8, color: "var(--dim)" }}>NATIONAL GMV</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
            <div style={{ backgroundColor: "#0e0e14", padding: "8px 10px", border: "1px solid #1a1a24" }}>
              <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>TOTAL REVENUE</span>
              <strong style={{ fontSize: 14, color: "#ffffff", fontFamily: "monospace" }}>R$ {(activeState.revenue / 1000000).toFixed(2)}M</strong>
              <span className="mono" style={{ fontSize: 8, color: "#888892", display: "block" }}>{activeState.orders.toLocaleString()} Orders</span>
            </div>

            <div style={{ backgroundColor: "#0e0e14", padding: "8px 10px", border: "1px solid #1a1a24" }}>
              <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>LEAD TIME</span>
              <strong style={{ fontSize: 14, color: activeState.avg_lead_time > 18 ? "var(--accent)" : "#ffffff", fontFamily: "monospace" }}>{activeState.avg_lead_time} Days</strong>
              <span className="mono" style={{ fontSize: 8, color: "#888892", display: "block" }}>AOV: R$ {activeState.aov.toFixed(1)}</span>
            </div>

            <div style={{ backgroundColor: "#0e0e14", padding: "8px 10px", border: "1px solid #1a1a24" }}>
              <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>SELLER BASE</span>
              <strong style={{ fontSize: 13, color: "#ffffff", fontFamily: "monospace" }}>{activeState.seller_count} Sellers</strong>
            </div>

            <div style={{ backgroundColor: "#0e0e14", padding: "8px 10px", border: "1px solid #1a1a24" }}>
              <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>CROSS-STATE</span>
              <strong style={{ fontSize: 13, color: activeState.cross_state_pct > 90 ? "var(--accent)" : "#ffffff", fontFamily: "monospace" }}>{activeState.cross_state_pct}%</strong>
            </div>
          </div>

          <div style={{ backgroundColor: "#08080c", borderLeft: "3px solid var(--accent)", padding: "8px 12px" }}>
            <p style={{ margin: 0, color: "#c8c8ce", fontSize: 11, lineHeight: 1.45 }}>{activeState.insight}</p>
          </div>
        </div>
      </div>

      {/* Disparity & Distance Spectrum Banner */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div style={{ backgroundColor: "#0b0b0f", border: "1px solid #1e293b", padding: "12px 16px", borderRadius: 3 }}>
          <span className="mono" style={{ color: "#34d399", fontSize: 8 }}>SAME-STATE LOCAL TRANSIT (36.1% ORDERS)</span>
          <strong style={{ fontSize: 20, color: "#34d399", fontFamily: "monospace", display: "block", margin: "3px 0 1px" }}>
            7.48 Days <small style={{ fontSize: 11, color: "#94a3b8" }}>(153 km)</small>
          </strong>
          <p style={{ margin: 0, color: "#a0a0a8", fontSize: 11 }}>Direct courier dispatch within same state boundary without regional linehaul delay.</p>
        </div>

        <div style={{ backgroundColor: "#0b0b0f", border: "1px solid rgba(255,77,28,0.4)", padding: "12px 16px", borderRadius: 3 }}>
          <span className="mono" style={{ color: "var(--accent)", fontSize: 8 }}>CROSS-STATE TRANSIT (63.9% ORDERS) • 2.0x SLOWER</span>
          <strong style={{ fontSize: 20, color: "var(--accent)", fontFamily: "monospace", display: "block", margin: "3px 0 1px" }}>
            14.68 Days <small style={{ fontSize: 11, color: "#94a3b8" }}>(853 km)</small>
          </strong>
          <p style={{ margin: 0, color: "#a0a0a8", fontSize: 11 }}>Forced inter-state transit because 59.7% of all sellers are concentrated in São Paulo.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }}>
        {DISTANCE_SPECTRUM.map((item) => (
          <div key={item.tier} style={{ backgroundColor: "#0e0e14", border: "1px solid #1c1c26", padding: "8px 6px", borderRadius: 2, textAlign: "center" }}>
            <span className="mono" style={{ fontSize: 8, color: "#d0d0d8", display: "block" }}>{item.tier}</span>
            <strong style={{ fontSize: 14, color: item.color, fontFamily: "monospace", display: "block", margin: "2px 0" }}>{item.speed}</strong>
            <span className="mono" style={{ fontSize: 7, color: "var(--dim)", display: "block" }}>{item.orders}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
