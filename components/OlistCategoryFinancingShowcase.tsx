"use client";

import React, { useState, useMemo } from "react";

type CategoryData = {
  category: string;
  creditOrders: number;
  avgInstallments: number;
  avgOrderValue: number;
  classification: string;
  cohort: "durable" | "consumable";
  type: "durable_high" | "durable_mid" | "consumable" | "sweetspot";
  financingAction: string;
};

const CATEGORIES_DATA: CategoryData[] = [
  // 15 High-Installment Durables (Section 6.1)
  { category: "Computers", creditOrders: 149, avgInstallments: 7.41, avgOrderValue: 1288.65, classification: "High-ticket tech & hardware", cohort: "durable", type: "durable_high", financingAction: "Subsidize 10x 0% interest ('sem juros') to prevent cart abandonment on high-ticket tech." },
  { category: "Home Appliances 2", creditOrders: 179, avgInstallments: 5.55, avgOrderValue: 609.51, classification: "Major household appliances", cohort: "durable", type: "durable_high", financingAction: "Standardize 6x–10x merchant acquiring promotions for capital goods." },
  { category: "Home Comfort", creditOrders: 293, avgInstallments: 5.18, avgOrderValue: 183.53, classification: "Home improvement durables", cohort: "durable", type: "durable_high", financingAction: "Bundle with seasonal home renovation financing campaigns." },
  { category: "Office Furniture", creditOrders: 873, avgInstallments: 4.78, avgOrderValue: 276.90, classification: "Commercial & workspace equipment", cohort: "durable", type: "durable_mid", financingAction: "B2B bulk checkout installment plans up to 10 months." },
  { category: "Kitchen / Garden Furniture", creditOrders: 186, avgInstallments: 4.49, avgOrderValue: 254.10, classification: "Modular living furniture", cohort: "durable", type: "durable_mid", financingAction: "Offer free shipping subsidies on multi-item installment baskets." },
  { category: "Musical Instruments", creditOrders: 455, avgInstallments: 4.49, avgOrderValue: 363.37, classification: "Specialty durable assets", cohort: "durable", type: "durable_mid", financingAction: "Targeted 6x installment campaigns for hobbyists and professionals." },
  { category: "Agro Industry & Commerce", creditOrders: 124, avgInstallments: 4.46, avgOrderValue: 439.25, classification: "Commercial equipment", cohort: "durable", type: "durable_mid", financingAction: "Commercial installment terms aligned with agricultural harvest cashflows." },
  { category: "Watches & Gifts", creditOrders: 4485, avgInstallments: 4.46, avgOrderValue: 243.97, classification: "High-volume revenue sweetspot", cohort: "durable", type: "sweetspot", financingAction: "🔥 PLATFORM SWEETSPOT: High volume (4.5k orders) + high tenor (4.46x) = maximum GMV lift." },
  { category: "Small Appliances", creditOrders: 484, avgInstallments: 4.35, avgOrderValue: 337.86, classification: "Consumer electronics", cohort: "durable", type: "durable_mid", financingAction: "A/B test 3x vs 6x 0% interest on kitchen appliances." },
  { category: "Furniture Living Room", creditOrders: 314, avgInstallments: 4.34, avgOrderValue: 216.37, classification: "Bulky living furniture", cohort: "durable", type: "durable_mid", financingAction: "Subsidize delivery lead time guarantees on 6x installment checkouts." },
  { category: "Bed, Bath & Table", creditOrders: 7265, avgInstallments: 4.31, avgOrderValue: 137.18, classification: "High-volume home textile", cohort: "durable", type: "sweetspot", financingAction: "Core volume anchor (7.3k orders). Retain standard 3x–6x installment options." },
  { category: "Construction Tools Safety", creditOrders: 117, avgInstallments: 4.27, avgOrderValue: 281.95, classification: "Industrial safety equipment", cohort: "durable", type: "durable_mid", financingAction: "Offer trade credit installments for verified contractors." },
  { category: "Construction Tools", creditOrders: 571, avgInstallments: 4.12, avgOrderValue: 237.87, classification: "Workshop hardware & tools", cohort: "durable", type: "durable_mid", financingAction: "Promote seasonal DIY 4x installment bundles." },
  { category: "Home Construction", creditOrders: 375, avgInstallments: 4.10, avgOrderValue: 210.78, classification: "Building & repair materials", cohort: "durable", type: "durable_mid", financingAction: "Facilitate staged installment payouts for ongoing home repairs." },
  { category: "Luggage & Accessories", creditOrders: 805, avgInstallments: 4.07, avgOrderValue: 169.22, classification: "Travel & commute durables", cohort: "durable", type: "durable_mid", financingAction: "Pre-holiday travel season 6x interest-free installment promotions." },

  // 10 Low-Installment Consumables (Section 6.2)
  { category: "Books (General Interest)", creditOrders: 374, avgInstallments: 2.82, avgOrderValue: 113.22, classification: "Literature & leisure reading", cohort: "consumable", type: "consumable", financingAction: "Promote 1-click single payment or Boleto to avoid merchant financing fees." },
  { category: "Computers Accessories", creditOrders: 4637, avgInstallments: 2.74, avgOrderValue: 155.96, classification: "Peripherals, cables & storage", cohort: "consumable", type: "sweetspot", financingAction: "Encourage Boleto or 2x installments for small accessory purchases." },
  { category: "Telephony", creditOrders: 3040, avgInstallments: 2.71, avgOrderValue: 98.05, classification: "Mobile accessories & prepaid", cohort: "consumable", type: "sweetspot", financingAction: "Low financing need. Default to 1x–2x checkout selectors." },
  { category: "Art", creditOrders: 139, avgInstallments: 2.55, avgOrderValue: 106.38, classification: "Collectibles & wall decor", cohort: "consumable", type: "consumable", financingAction: "Standard 2x checkout plan; low financing price elasticity." },
  { category: "Books (Technical)", creditOrders: 187, avgInstallments: 2.48, avgOrderValue: 93.01, classification: "Educational media", cohort: "consumable", type: "consumable", financingAction: "Student discount voucher pairing instead of extended installments." },
  { category: "Food & Drink", creditOrders: 158, avgInstallments: 2.43, avgOrderValue: 95.93, classification: "Gourmet & perishables", cohort: "consumable", type: "consumable", financingAction: "Avoid extended installment financing fees on perishable inventory." },
  { category: "Food", creditOrders: 318, avgInstallments: 2.33, avgOrderValue: 86.17, classification: "Consumable groceries", cohort: "consumable", type: "consumable", financingAction: "Cash/Boleto and instant debit preferred to maintain grocer margins." },
  { category: "Home Appliances (Basic)", creditOrders: 597, avgInstallments: 2.22, avgOrderValue: 125.00, classification: "Entry-level home items", cohort: "consumable", type: "consumable", financingAction: "Low ticket size ($< R$ 130); encourage 1x–2x settlement." },
  { category: "Electronics (Small)", creditOrders: 1823, avgInstallments: 2.04, avgOrderValue: 87.68, classification: "Low-cost peripheral devices", cohort: "consumable", type: "consumable", financingAction: "Impulse purchase price point ($< R$ 90); 1x settlement standard." },
  { category: "Drinks", creditOrders: 230, avgInstallments: 1.95, avgOrderValue: 91.15, classification: "Fast-moving consumable beverage", cohort: "consumable", type: "consumable", financingAction: "Zero installment subsidy needed. Direct payment settles immediately." },
];

export function OlistCategoryFinancingShowcase() {
  const [activeTab, setActiveTab] = useState<"durables" | "consumables" | "table_view" | "contrast">("durables");
  const [hoveredCat, setHoveredCat] = useState<CategoryData | null>(null);
  const [selectedCat, setSelectedCat] = useState<CategoryData>(CATEGORIES_DATA[0]);
  const [tableSortKey, setTableSortKey] = useState<"installments" | "aov" | "orders" | "name">("installments");
  const [tableSortAsc, setTableSortAsc] = useState<boolean>(false);
  const [tableFilter, setTableFilter] = useState<"all" | "durable" | "consumable">("all");

  const activeCat = hoveredCat || selectedCat;

  // Filtered dataset for charts
  const chartList = useMemo(() => {
    if (activeTab === "durables") {
      return CATEGORIES_DATA.filter((c) => c.cohort === "durable");
    }
    if (activeTab === "consumables") {
      return CATEGORIES_DATA.filter((c) => c.cohort === "consumable").sort((a, b) => a.avgInstallments - b.avgInstallments);
    }
    if (activeTab === "contrast") {
      const top6Durable = CATEGORIES_DATA.filter((c) => c.cohort === "durable").slice(0, 6);
      const top6Consumable = CATEGORIES_DATA.filter((c) => c.cohort === "consumable").slice(0, 6);
      return [...top6Durable, ...top6Consumable];
    }
    return CATEGORIES_DATA;
  }, [activeTab]);

  // Sorted and filtered dataset for the interactive table
  const tableData = useMemo(() => {
    let list = [...CATEGORIES_DATA];
    if (tableFilter !== "all") {
      list = list.filter((c) => c.cohort === tableFilter);
    }
    list.sort((a, b) => {
      let diff = 0;
      if (tableSortKey === "installments") diff = b.avgInstallments - a.avgInstallments;
      else if (tableSortKey === "aov") diff = b.avgOrderValue - a.avgOrderValue;
      else if (tableSortKey === "orders") diff = b.creditOrders - a.creditOrders;
      else if (tableSortKey === "name") diff = a.category.localeCompare(b.category);
      return tableSortAsc ? -diff : diff;
    });
    return list;
  }, [tableFilter, tableSortKey, tableSortAsc]);

  const toggleSort = (key: "installments" | "aov" | "orders" | "name") => {
    if (tableSortKey === key) {
      setTableSortAsc(!tableSortAsc);
    } else {
      setTableSortKey(key);
      setTableSortAsc(false);
    }
  };

  return (
    <section
      id="category-financing-matrix"
      style={{
        margin: "32px 0",
        backgroundColor: "var(--panel)",
        border: "1px solid var(--line)",
        borderRadius: 4,
        padding: "24px 20px",
      }}
      aria-label="Category Financing Sensitivity Matrix & Interactive Table"
    >
      {/* Section Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, borderBottom: "1px solid var(--line)", paddingBottom: 16, marginBottom: 20 }}>
        <div>
          <span className="mono" style={{ color: "var(--accent)", fontSize: 9.5, letterSpacing: "0.08em", fontWeight: 700 }}>
            CATALOG ECONOMETRICS • DURABLES VS CONSUMABLES SPECTRUM
          </span>
          <h3 style={{ fontSize: "clamp(19px, 2.2vw, 24px)", color: "var(--ink-heading)", letterSpacing: "-0.03em", margin: "4px 0 0", fontWeight: 700 }}>
            Category Financing Sensitivity & Installment Matrix
          </h3>
        </div>

        {/* View Switcher Tabs */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setActiveTab("durables")}
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              padding: "6px 12px",
              borderRadius: 3,
              cursor: "pointer",
              backgroundColor: activeTab === "durables" ? "var(--accent-subtle)" : "var(--surface-secondary)",
              border: activeTab === "durables" ? "1px solid var(--accent)" : "1px solid var(--line)",
              color: activeTab === "durables" ? "var(--accent)" : "var(--dim)",
              fontWeight: activeTab === "durables" ? 700 : 400,
              transition: "all 0.15s ease",
            }}
          >
            01. High Durables (≥ 4.0x)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("consumables")}
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              padding: "6px 12px",
              borderRadius: 3,
              cursor: "pointer",
              backgroundColor: activeTab === "consumables" ? "var(--accent-subtle)" : "var(--surface-secondary)",
              border: activeTab === "consumables" ? "1px solid var(--accent)" : "1px solid var(--line)",
              color: activeTab === "consumables" ? "var(--accent)" : "var(--dim)",
              fontWeight: activeTab === "consumables" ? 700 : 400,
              transition: "all 0.15s ease",
            }}
          >
            02. Low Consumables (≤ 2.8x)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("contrast")}
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              padding: "6px 12px",
              borderRadius: 3,
              cursor: "pointer",
              backgroundColor: activeTab === "contrast" ? "var(--accent-subtle)" : "var(--surface-secondary)",
              border: activeTab === "contrast" ? "1px solid var(--accent)" : "1px solid var(--line)",
              color: activeTab === "contrast" ? "var(--accent)" : "var(--dim)",
              fontWeight: activeTab === "contrast" ? 700 : 400,
              transition: "all 0.15s ease",
            }}
          >
            03. Durables vs Consumables (2.3x Spread)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("table_view")}
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              padding: "6px 12px",
              borderRadius: 3,
              cursor: "pointer",
              backgroundColor: activeTab === "table_view" ? "var(--accent-subtle)" : "var(--surface-secondary)",
              border: activeTab === "table_view" ? "1px solid var(--accent)" : "1px solid var(--line)",
              color: activeTab === "table_view" ? "var(--accent)" : "var(--dim)",
              fontWeight: activeTab === "table_view" ? 700 : 400,
              transition: "all 0.15s ease",
            }}
          >
            📊 Interactive Table Explorer
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1, 2, 3: INTERACTIVE HORIZONTAL BAR CHARTS & FLOATING DOSSIER        */}
      {/* ========================================================================= */}
      {activeTab !== "table_view" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18, alignItems: "start" }}>
          {/* Left: Interactive Bar Chart */}
          <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", borderRadius: 3, padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span className="mono" style={{ fontSize: 9.5, color: "var(--dim)" }}>
                {activeTab === "durables"
                  ? "TOP 15 HIGH-INSTALLMENT DURABLES (X-AXIS: 1.0x TO 8.0x)"
                  : activeTab === "consumables"
                  ? "TOP 10 LOW-INSTALLMENT CONSUMABLES (X-AXIS: 1.0x TO 8.0x)"
                  : "DURABLE GOODS VS CONSUMABLES SPREAD COMPARISON"}
              </span>
              <span className="mono" style={{ fontSize: 9, color: "var(--accent)" }}>
                HOVER TO INSPECT
              </span>
            </div>

            {/* List of Bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {chartList.map((item) => {
                const isSelected = activeCat.category === item.category;
                const barWidthPct = Math.min(100, Math.max(12, (item.avgInstallments / 8.0) * 100));

                const barColor = item.avgInstallments >= 5.0
                  ? "var(--accent)"
                  : item.avgInstallments >= 4.0
                  ? "#f59e0b"
                  : item.avgInstallments >= 2.5
                  ? "#38bdf8"
                  : "#10b981";

                return (
                  <div
                    key={item.category}
                    onMouseEnter={() => {
                      setHoveredCat(item);
                      setSelectedCat(item);
                    }}
                    onMouseLeave={() => setHoveredCat(null)}
                    onClick={() => setSelectedCat(item)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "135px 1fr 52px",
                      gap: 10,
                      alignItems: "center",
                      padding: "4px 8px",
                      borderRadius: 3,
                      cursor: "pointer",
                      backgroundColor: isSelected ? "var(--accent-subtle)" : "transparent",
                      border: isSelected ? `1px solid ${barColor}` : "1px solid transparent",
                      transition: "all 0.12s ease",
                    }}
                  >
                    {/* Category Title */}
                    <span
                      style={{
                        fontSize: 11.5,
                        color: isSelected ? "var(--ink-heading)" : "var(--ink)",
                        fontWeight: isSelected ? 700 : 500,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={item.category}
                    >
                      {item.category}
                    </span>

                    {/* Visual Bar */}
                    <div style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", height: 16, borderRadius: 2, overflow: "hidden", position: "relative" }}>
                      <div
                        style={{
                          width: `${barWidthPct}%`,
                          height: "100%",
                          backgroundColor: barColor,
                          borderRadius: 2,
                          transition: "width 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          paddingRight: 6,
                        }}
                      >
                        <span style={{ fontSize: 9, fontFamily: "monospace", color: "#000", fontWeight: 700 }}>
                          {item.avgInstallments.toFixed(2)}x
                        </span>
                      </div>
                    </div>

                    {/* AOV Tag */}
                    <span className="mono" style={{ fontSize: 9.5, color: isSelected ? "var(--ink-heading)" : "var(--dim)", textAlign: "right" }}>
                      R${item.avgOrderValue.toFixed(0)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Floating Interactive Dossier Panel */}
          <div
            style={{
              backgroundColor: "var(--surface-secondary)",
              border: `1px solid ${activeCat.avgInstallments >= 4.0 ? "var(--accent)" : "var(--line)"}`,
              borderRadius: 4,
              padding: "18px 20px",
              transition: "all 0.15s ease",
            }}
          >
            {/* Header */}
            <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: 10, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span className="mono" style={{ fontSize: 9, color: "var(--accent)", fontWeight: 700 }}>
                  CATEGORY FINANCING PROFILE
                </span>
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: "monospace",
                    padding: "2px 6px",
                    borderRadius: 2,
                    backgroundColor: "var(--panel)",
                    color: "var(--dim)",
                    border: "1px solid var(--line)",
                  }}
                >
                  {activeCat.cohort === "durable" ? "DURABLE GOODS" : "FAST CONSUMABLE"}
                </span>
              </div>
              <h4 style={{ fontSize: 17, color: "var(--ink-heading)", margin: "3px 0 2px", fontWeight: 700 }}>
                {activeCat.category}
              </h4>
              <span style={{ fontSize: 11, color: "var(--dim)" }}>{activeCat.classification}</span>
            </div>

            {/* 4 Metrics Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
              <div style={{ backgroundColor: "var(--panel)", padding: "8px 10px", borderRadius: 3, border: "1px solid var(--line)" }}>
                <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)", display: "block" }}>AVG INSTALLMENTS</span>
                <strong style={{ fontSize: 18, color: activeCat.avgInstallments >= 4.0 ? "var(--accent)" : "#38bdf8", fontFamily: "monospace" }}>
                  {activeCat.avgInstallments.toFixed(2)}x
                </strong>
                <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)", display: "block" }}>tenor duration</span>
              </div>

              <div style={{ backgroundColor: "var(--panel)", padding: "8px 10px", borderRadius: 3, border: "1px solid var(--line)" }}>
                <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)", display: "block" }}>AVERAGE ORDER VALUE</span>
                <strong style={{ fontSize: 18, color: "#38bdf8", fontFamily: "monospace" }}>
                  R$ {activeCat.avgOrderValue.toFixed(2)}
                </strong>
                <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)", display: "block" }}>mean basket size</span>
              </div>

              <div style={{ backgroundColor: "var(--panel)", padding: "8px 10px", borderRadius: 3, border: "1px solid var(--line)" }}>
                <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)", display: "block" }}>TOTAL CREDIT ORDERS</span>
                <strong style={{ fontSize: 16, color: "var(--ink-heading)", fontFamily: "monospace" }}>
                  {activeCat.creditOrders.toLocaleString()}
                </strong>
                <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)", display: "block" }}>order volume</span>
              </div>

              <div style={{ backgroundColor: "var(--panel)", padding: "8px 10px", borderRadius: 3, border: "1px solid var(--line)" }}>
                <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)", display: "block" }}>ESTIMATED GMV</span>
                <strong style={{ fontSize: 16, color: "var(--ink-heading)", fontFamily: "monospace" }}>
                  R$ {((activeCat.creditOrders * activeCat.avgOrderValue) / 1000).toFixed(1)}k
                </strong>
                <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)", display: "block" }}>cohort revenue</span>
              </div>
            </div>

            {/* Strategy Action Box */}
            <div style={{ backgroundColor: "var(--panel)", border: "1px solid var(--line)", borderRadius: 3, padding: "12px 14px" }}>
              <span className="mono" style={{ fontSize: 8.5, color: "var(--accent)", display: "block", marginBottom: 4, fontWeight: 700 }}>
                COMMERCIAL FINANCING ACTION:
              </span>
              <p style={{ margin: 0, color: "var(--ink)", fontSize: 12, lineHeight: 1.5 }}>
                {activeCat.financingAction}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 4: COMPREHENSIVE INTERACTIVE DATA TABLE EXPLORER                      */}
      {/* ========================================================================= */}
      {activeTab === "table_view" && (
        <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", borderRadius: 4, padding: "16px 18px" }}>
          {/* Table Toolbar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span className="mono" style={{ fontSize: 9.5, color: "var(--dim)" }}>FILTER COHORT:</span>
              <button
                type="button"
                onClick={() => setTableFilter("all")}
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  padding: "4px 8px",
                  borderRadius: 2,
                  cursor: "pointer",
                  backgroundColor: tableFilter === "all" ? "var(--accent-subtle)" : "transparent",
                  border: tableFilter === "all" ? "1px solid var(--accent)" : "1px solid var(--line)",
                  color: tableFilter === "all" ? "var(--accent)" : "var(--dim)",
                }}
              >
                All Categories ({CATEGORIES_DATA.length})
              </button>
              <button
                type="button"
                onClick={() => setTableFilter("durable")}
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  padding: "4px 8px",
                  borderRadius: 2,
                  cursor: "pointer",
                  backgroundColor: tableFilter === "durable" ? "var(--accent-subtle)" : "transparent",
                  border: tableFilter === "durable" ? "1px solid var(--accent)" : "1px solid var(--line)",
                  color: tableFilter === "durable" ? "var(--accent)" : "var(--dim)",
                }}
              >
                Durables (15)
              </button>
              <button
                type="button"
                onClick={() => setTableFilter("consumable")}
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  padding: "4px 8px",
                  borderRadius: 2,
                  cursor: "pointer",
                  backgroundColor: tableFilter === "consumable" ? "var(--accent-subtle)" : "transparent",
                  border: tableFilter === "consumable" ? "1px solid var(--accent)" : "1px solid var(--line)",
                  color: tableFilter === "consumable" ? "var(--accent)" : "var(--dim)",
                }}
              >
                Consumables (10)
              </button>
            </div>

            <span className="mono" style={{ fontSize: 9, color: "var(--dim)" }}>
              CLICK COLUMN HEADER TO SORT
            </span>
          </div>

          {/* Table Element */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--line)", backgroundColor: "var(--panel)" }}>
                  <th
                    onClick={() => toggleSort("name")}
                    style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 9.5, color: "var(--dim)", cursor: "pointer" }}
                  >
                    CATEGORY NAME {tableSortKey === "name" ? (tableSortAsc ? "▲" : "▼") : ""}
                  </th>
                  <th
                    onClick={() => toggleSort("orders")}
                    style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 9.5, color: "var(--dim)", cursor: "pointer", textAlign: "center" }}
                  >
                    CREDIT ORDERS {tableSortKey === "orders" ? (tableSortAsc ? "▲" : "▼") : ""}
                  </th>
                  <th
                    onClick={() => toggleSort("installments")}
                    style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 9.5, color: "var(--accent)", cursor: "pointer", textAlign: "center" }}
                  >
                    AVG INSTALLMENTS {tableSortKey === "installments" ? (tableSortAsc ? "▲" : "▼") : ""}
                  </th>
                  <th
                    onClick={() => toggleSort("aov")}
                    style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 9.5, color: "var(--dim)", cursor: "pointer", textAlign: "right" }}
                  >
                    AVG ORDER VALUE (R$) {tableSortKey === "aov" ? (tableSortAsc ? "▲" : "▼") : ""}
                  </th>
                  <th style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 9.5, color: "var(--dim)" }}>
                    CATEGORY CLASSIFICATION
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, idx) => {
                  const isSelected = activeCat.category === row.category;
                  const isDurable = row.cohort === "durable";
                  return (
                    <tr
                      key={row.category}
                      onClick={() => {
                        setSelectedCat(row);
                        setActiveTab("durables");
                      }}
                      style={{
                        borderBottom: "1px solid var(--line)",
                        backgroundColor: isSelected
                          ? "var(--accent-subtle)"
                          : idx % 2 === 0
                          ? "rgba(255, 255, 255, 0.015)"
                          : "transparent",
                        cursor: "pointer",
                        transition: "background-color 0.12s ease",
                      }}
                    >
                      <td style={{ padding: "8px 12px", fontWeight: 600, color: "var(--ink-heading)" }}>
                        {row.category}
                      </td>
                      <td style={{ padding: "8px 12px", textAlign: "center", fontFamily: "monospace", color: "var(--ink)" }}>
                        {row.creditOrders.toLocaleString()}
                      </td>
                      <td style={{ padding: "8px 12px", textAlign: "center" }}>
                        <span
                          style={{
                            fontFamily: "monospace",
                            fontWeight: 700,
                            color: isDurable ? "var(--accent)" : "#38bdf8",
                            backgroundColor: isDurable ? "var(--accent-subtle)" : "rgba(56, 189, 248, 0.08)",
                            padding: "2px 6px",
                            borderRadius: 2,
                            border: `1px solid ${isDurable ? "var(--accent)" : "rgba(56, 189, 248, 0.3)"}`,
                          }}
                        >
                          {row.avgInstallments.toFixed(2)}x
                        </span>
                      </td>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", color: "var(--ink)" }}>
                        R$ {row.avgOrderValue.toFixed(2)}
                      </td>
                      <td style={{ padding: "8px 12px", color: "var(--dim)", fontSize: 11.5 }}>
                        {row.classification}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
