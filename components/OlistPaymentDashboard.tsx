"use client";

import { useMemo, useState } from "react";
import rawData from "@/content/data/olist_payment_analysis.json";

type PaymentMethod = {
  id: string;
  name: string;
  count: number;
  count_pct: number;
  total_value: number;
  value_pct: number;
  avg_value: number;
  avg_installments: number;
};

type InstallmentBucket = {
  bucket: string;
  order_count: number;
  order_pct: number;
  avg_order_value: number;
  median_order_value: number;
  multiplier_vs_1x: number;
};

type CategoryItem = {
  category: string;
  total_orders: number;
  total_revenue: number;
  avg_order_value: number;
  cc_orders_count: number;
  avg_installments: number;
  payment_mix: {
    credit_card: number;
    boleto: number;
    voucher: number;
    debit_card: number;
  };
  is_high_installment: boolean;
};

type MonthlyTrend = {
  month: string;
  total_value: number;
  total_orders: number;
  avg_installments: number;
  credit_card_value: number;
  boleto_value: number;
  voucher_value: number;
  debit_card_value: number;
  credit_card_orders: number;
  boleto_orders: number;
  voucher_orders: number;
  debit_card_orders: number;
};

type Transaction = {
  order_id: string;
  full_order_id: string;
  order_date: string;
  month: string;
  category: string;
  payment_type: string;
  installments: number;
  order_value: number;
  customer_state: string;
  customer_city: string;
};

const currency = (val: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

const formatNumber = (val: number) =>
  new Intl.NumberFormat("en-US").format(val);

const METHOD_COLORS: Record<string, string> = {
  credit_card: "#ff4d1c", // Accent Orange
  boleto: "#38bdf8",     // Sky Blue
  voucher: "#34d399",    // Emerald Green
  debit_card: "#fbbf24",  // Amber
};

export function OlistPaymentDashboard() {
  const data = rawData;

  // Filter state
  const [selectedMethod, setSelectedMethod] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [minInstallments, setMinInstallments] = useState<number>(1);
  const [maxInstallments, setMaxInstallments] = useState<number>(24);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [stateFilter, setStateFilter] = useState<string>("all");

  // Chart view modes
  const [trendMetric, setTrendMetric] = useState<"value" | "orders">("value");
  const [showInstallmentLine, setShowInstallmentLine] = useState<boolean>(true);
  const [categorySort, setCategorySort] = useState<"installments" | "orders" | "aov">("installments");
  const [hoveredMonth, setHoveredMonth] = useState<MonthlyTrend | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<CategoryItem | null>(null);
  const [hoveredBucket, setHoveredBucket] = useState<InstallmentBucket | null>(null);

  // Table sorting & pagination
  const [sortField, setSortField] = useState<keyof Transaction>("order_date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Available unique categories and states
  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(data.categories.map((c) => c.category))).sort();
  }, [data.categories]);

  const uniqueStates = useMemo(() => {
    return Array.from(new Set(data.sample_transactions.map((t) => t.customer_state))).sort();
  }, [data.sample_transactions]);

  // Filtered sample transactions
  const filteredTransactions = useMemo(() => {
    return (data.sample_transactions as Transaction[]).filter((item) => {
      if (selectedMethod !== "all" && item.payment_type !== selectedMethod) return false;
      if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
      if (stateFilter !== "all" && item.customer_state !== stateFilter) return false;
      if (item.installments < minInstallments || item.installments > maxInstallments) return false;
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matches =
          item.full_order_id.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.customer_city.toLowerCase().includes(q) ||
          item.customer_state.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [data.sample_transactions, selectedMethod, selectedCategory, stateFilter, minInstallments, maxInstallments, searchQuery]);

  // Sorted and paginated transactions
  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDirection === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredTransactions, sortField, sortDirection]);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedTransactions.slice(start, start + pageSize);
  }, [sortedTransactions, currentPage]);

  const totalPages = Math.ceil(sortedTransactions.length / pageSize) || 1;

  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedMethod("all");
    setSelectedCategory("all");
    setMinInstallments(1);
    setMaxInstallments(24);
    setStateFilter("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  // CSV Export handler
  const handleExportCSV = () => {
    const headers = ["Order ID", "Date", "Month", "Category", "Payment Method", "Installments", "Order Value (BRL)", "State", "City"];
    const rows = filteredTransactions.map((t) => [
      t.full_order_id,
      t.order_date,
      t.month,
      `"${t.category.replace(/"/g, '""')}"`,
      t.payment_type,
      t.installments,
      t.order_value,
      t.customer_state,
      `"${t.customer_city.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `olist_payment_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Monthly trends scaling
  const months = data.monthly_trends as MonthlyTrend[];
  const maxMonthValue = useMemo(() => {
    return Math.max(...months.map((m) => (trendMetric === "value" ? m.total_value : m.total_orders)), 1);
  }, [months, trendMetric]);

  const maxMonthInst = useMemo(() => {
    return Math.max(...months.map((m) => m.avg_installments), 5);
  }, [months]);

  // Top 15 Categories sorted
  const sortedCategories = useMemo(() => {
    const cats = [...(data.categories as CategoryItem[])].filter((c) => c.total_orders >= 100);
    if (categorySort === "installments") {
      return cats.sort((a, b) => b.avg_installments - a.avg_installments).slice(0, 15);
    } else if (categorySort === "orders") {
      return cats.sort((a, b) => b.total_orders - a.total_orders).slice(0, 15);
    } else {
      return cats.sort((a, b) => b.avg_order_value - a.avg_order_value).slice(0, 15);
    }
  }, [data.categories, categorySort]);

  const maxCatBar = useMemo(() => {
    if (categorySort === "installments") return 8.0;
    if (categorySort === "orders") return Math.max(...sortedCategories.map((c) => c.total_orders), 1000);
    return Math.max(...sortedCategories.map((c) => c.avg_order_value), 1000);
  }, [sortedCategories, categorySort]);

  // Dynamic filtered summary stats
  const activeTxCount = filteredTransactions.length;
  const activeTxSum = filteredTransactions.reduce((acc, t) => acc + t.order_value, 0);
  const activeAOV = activeTxCount > 0 ? activeTxSum / activeTxCount : 0;
  const activeCCShare = activeTxCount > 0 ? (filteredTransactions.filter((t) => t.payment_type === "credit_card").length / activeTxCount) * 100 : 0;

  return (
    <div className="olist-payment-dashboard" id="interactive-dashboard">
      {/* SECTION 1: EXECUTIVE KPI CARDS */}
      <div className="payment-kpi-grid">
        <div className="payment-kpi-card">
          <span className="mono">01 / TOTAL PAYMENT VALUE</span>
          <strong>{currency(data.metadata.total_gmv)}</strong>
          <p className="kpi-meta">
            <span>{formatNumber(data.metadata.total_orders)}</span> total orders recorded across 27 Brazilian states.
          </p>
          <div className="payment-mini-bar" title="Payment Value Distribution">
            {data.payment_methods.map((m) => (
              <span
                key={m.id}
                style={{
                  width: `${m.value_pct}%`,
                  backgroundColor: METHOD_COLORS[m.id] || "#888",
                }}
                title={`${m.name}: ${m.value_pct}% (R$ ${formatNumber(m.total_value)})`}
              />
            ))}
          </div>
        </div>

        <div className="payment-kpi-card">
          <span className="mono">02 / CREDIT CARD REVENUE SHARE</span>
          <strong className="accent-highlight">{data.metadata.credit_card_share_value}%</strong>
          <p className="kpi-meta">
            Generates <strong>78.3%</strong> of GMV via 76.8k transactions. Only method offering installment flexibility.
          </p>
          <div className="kpi-tag-row">
            <span className="kpi-pill">Boleto: 17.9%</span>
            <span className="kpi-pill">Voucher: 2.4%</span>
            <span className="kpi-pill">Debit: 1.4%</span>
          </div>
        </div>

        <div className="payment-kpi-card">
          <span className="mono">03 / AVG CREDIT CARD INSTALLMENTS</span>
          <strong>{data.metadata.avg_credit_card_installments}x</strong>
          <p className="kpi-meta">
            Strongest volume in 1x (50.6%), with a notable secondary concentration at <strong>10x (5,328 orders)</strong>.
          </p>
          <div className="kpi-alert-badge">
            <span className="mono">Anomaly: 10x volume jump (+727% vs 9x)</span>
          </div>
        </div>

        <div className="payment-kpi-card">
          <span className="mono">04 / INSTALLMENT VS ORDER VALUE</span>
          <strong>3.3x</strong>
          <p className="kpi-meta">
            Pearson correlation <strong>r = {data.metadata.pearson_correlation}</strong> (descriptive). 7–10x orders average R$ 336.44 vs R$ 100.91 for 1x.
          </p>
          <div className="kpi-tag-row">
            <span className="kpi-pill accent">7–10x vs 1x: +233%</span>
            <span className="kpi-pill">Computers AOV: R$ 1.28k</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: MULTI-SERIES MONTHLY TREND EXPLORER */}
      <div className="dashboard-card trend-section">
        <div className="dashboard-card-header">
          <div>
            <p className="mono card-eyebrow">Temporal Dynamics (2017–2018)</p>
            <h3>Monthly Payment Trajectory & Installment Overlay</h3>
          </div>
          <div className="trend-controls">
            <div className="btn-group">
              <button
                type="button"
                className={`mono-btn ${trendMetric === "value" ? "active" : ""}`}
                onClick={() => setTrendMetric("value")}
              >
                GMV (R$)
              </button>
              <button
                type="button"
                className={`mono-btn ${trendMetric === "orders" ? "active" : ""}`}
                onClick={() => setTrendMetric("orders")}
              >
                Order Volume
              </button>
            </div>
            <button
              type="button"
              className={`mono-btn toggle-btn ${showInstallmentLine ? "active" : ""}`}
              onClick={() => setShowInstallmentLine(!showInstallmentLine)}
            >
              Installment Trend {showInstallmentLine ? "● ON" : "○ OFF"}
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="chart-legend">
          <span className="legend-item">
            <i style={{ backgroundColor: METHOD_COLORS.credit_card }} /> Credit Card ({data.payment_methods[0].value_pct}%)
          </span>
          <span className="legend-item">
            <i style={{ backgroundColor: METHOD_COLORS.boleto }} /> Boleto ({data.payment_methods[1].value_pct}%)
          </span>
          <span className="legend-item">
            <i style={{ backgroundColor: METHOD_COLORS.voucher }} /> Voucher ({data.payment_methods[2].value_pct}%)
          </span>
          <span className="legend-item">
            <i style={{ backgroundColor: METHOD_COLORS.debit_card }} /> Debit Card ({data.payment_methods[3].value_pct}%)
          </span>
          {showInstallmentLine && (
            <span className="legend-item installment-legend">
              <i className="dashed-line" /> Avg Installments (Right Axis)
            </span>
          )}
        </div>

        {/* SVG Chart */}
        <div className="trend-svg-container">
          <svg viewBox="0 0 900 320" className="responsive-svg" preserveAspectRatio="none">
            <defs>
              <linearGradient id="ccGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff4d1c" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#ff4d1c" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid horizontal lines */}
            {[0, 0.25, 0.5, 0.75, 1.0].map((ratio, idx) => {
              const y = 30 + ratio * 240;
              const val = maxMonthValue * (1 - ratio);
              return (
                <g key={idx}>
                  <line x1="50" y1={y} x2="850" y2={y} stroke="var(--line)" strokeDasharray="3 3" />
                  <text x="42" y={y + 4} fill="var(--dim)" fontSize="9" textAnchor="end" fontFamily="monospace">
                    {trendMetric === "value" ? `R$ ${(val / 1000).toFixed(0)}k` : formatNumber(Math.round(val))}
                  </text>
                </g>
              );
            })}

            {/* Credit Card Area Fill */}
            <polygon
              points={`50,270 ${months
                .map((m, i) => {
                  const x = 50 + (i / (months.length - 1)) * 800;
                  const v = trendMetric === "value" ? m.credit_card_value : m.credit_card_orders;
                  const y = 270 - (v / maxMonthValue) * 240;
                  return `${x},${y}`;
                })
                .join(" ")} 850,270`}
              fill="url(#ccGrad)"
            />

            {/* Multi-series Polylines */}
            {(["credit_card", "boleto", "voucher", "debit_card"] as const).map((methodKey) => {
              const points = months
                .map((m, i) => {
                  const x = 50 + (i / (months.length - 1)) * 800;
                  const v = trendMetric === "value" ? m[`${methodKey}_value`] : m[`${methodKey}_orders`];
                  const y = 270 - (v / maxMonthValue) * 240;
                  return `${x},${y}`;
                })
                .join(" ");
              return (
                <polyline
                  key={methodKey}
                  points={points}
                  fill="none"
                  stroke={METHOD_COLORS[methodKey]}
                  strokeWidth={methodKey === "credit_card" ? "2.5" : "1.75"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}

            {/* Installment Line (Dashed Orange/White) */}
            {showInstallmentLine && (
              <polyline
                points={months
                  .map((m, i) => {
                    const x = 50 + (i / (months.length - 1)) * 800;
                    const y = 270 - (m.avg_installments / maxMonthInst) * 240;
                    return `${x},${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="var(--ink-heading)"
                strokeWidth="1.8"
                strokeDasharray="4 4"
              />
            )}

            {/* Interactive hover points & vertical cursor */}
            {months.map((m, i) => {
              const x = 50 + (i / (months.length - 1)) * 800;
              const isHovered = hoveredMonth?.month === m.month;
              return (
                <g key={m.month} onMouseEnter={() => setHoveredMonth(m)} onMouseLeave={() => setHoveredMonth(null)}>
                  <rect x={x - 20} y={20} width={40} height={260} fill="transparent" style={{ cursor: "pointer" }} />
                  {isHovered && (
                    <line x1={x} y1={20} x2={x} y2={270} stroke="var(--accent)" strokeWidth="1" strokeDasharray="2 2" />
                  )}
                  <circle
                    cx={x}
                    cy={270 - ((trendMetric === "value" ? m.credit_card_value : m.credit_card_orders) / maxMonthValue) * 240}
                    r={isHovered ? 5 : 3}
                    fill={METHOD_COLORS.credit_card}
                    stroke="var(--panel)"
                    strokeWidth="1.5"
                  />
                  {/* Month X Labels */}
                  {i % 2 === 0 && (
                    <text x={x} y="295" fill="var(--dim)" fontSize="9" textAnchor="middle" fontFamily="monospace">
                      {m.month}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Floating Hover Tooltip */}
          {hoveredMonth && (
            <div className="trend-tooltip">
              <div className="tooltip-header">
                <strong>{hoveredMonth.month}</strong>
                <span>{currency(hoveredMonth.total_value)} • {formatNumber(hoveredMonth.total_orders)} orders</span>
              </div>
              <div className="tooltip-grid">
                <div className="tooltip-row">
                  <span style={{ color: METHOD_COLORS.credit_card }}>Credit Card:</span>
                  <strong>{currency(hoveredMonth.credit_card_value)} ({formatNumber(hoveredMonth.credit_card_orders)} orders)</strong>
                </div>
                <div className="tooltip-row">
                  <span style={{ color: METHOD_COLORS.boleto }}>Boleto:</span>
                  <strong>{currency(hoveredMonth.boleto_value)} ({formatNumber(hoveredMonth.boleto_orders)} orders)</strong>
                </div>
                <div className="tooltip-row">
                  <span style={{ color: METHOD_COLORS.voucher }}>Voucher:</span>
                  <strong>{currency(hoveredMonth.voucher_value)} ({formatNumber(hoveredMonth.voucher_orders)} orders)</strong>
                </div>
                <div className="tooltip-row">
                  <span style={{ color: METHOD_COLORS.debit_card }}>Debit Card:</span>
                  <strong>{currency(hoveredMonth.debit_card_value)} ({formatNumber(hoveredMonth.debit_card_orders)} orders)</strong>
                </div>
                <div className="tooltip-row tooltip-inst">
                  <span>Avg CC Installments:</span>
                  <strong className="accent-highlight">{hoveredMonth.avg_installments}x</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: DUAL DEEP-DIVE PANELS */}
      <div className="dual-panel-grid">
        {/* PANEL A: TOP PRODUCT CATEGORIES BY INSTALLMENTS */}
        <div className="dashboard-card category-panel">
          <div className="dashboard-card-header">
            <div>
              <p className="mono card-eyebrow">Category Elasticity Hierarchy</p>
              <h3>Top 15 Categories by Installment Length</h3>
            </div>
            <div className="btn-group">
              <button
                type="button"
                className={`mono-btn ${categorySort === "installments" ? "active" : ""}`}
                onClick={() => setCategorySort("installments")}
              >
                Installments
              </button>
              <button
                type="button"
                className={`mono-btn ${categorySort === "orders" ? "active" : ""}`}
                onClick={() => setCategorySort("orders")}
              >
                Volume
              </button>
              <button
                type="button"
                className={`mono-btn ${categorySort === "aov" ? "active" : ""}`}
                onClick={() => setCategorySort("aov")}
              >
                AOV
              </button>
            </div>
          </div>

          <p className="panel-explanation">
            Durable goods (Computers, Furniture, Home Appliances) exhibit high installment counts ({">"}5x) and high ticket sizes (up to R$ 1,288), whereas consumables (Food, Drinks) average {"<"}2.5x.
          </p>

          <div className="category-bars-list">
            {sortedCategories.map((cat) => {
              const barValue =
                categorySort === "installments"
                  ? cat.avg_installments
                  : categorySort === "orders"
                  ? cat.total_orders
                  : cat.avg_order_value;
              const barWidth = Math.min((barValue / maxCatBar) * 100, 100);

              return (
                <div
                  key={cat.category}
                  className={`category-bar-row ${hoveredCategory?.category === cat.category ? "highlighted" : ""}`}
                  onMouseEnter={() => setHoveredCategory(cat)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="cat-meta-left">
                    <span className="cat-name" title={cat.category}>
                      {cat.category}
                    </span>
                    <span className="cat-sub mono">
                      {formatNumber(cat.total_orders)} orders • {currency(cat.avg_order_value)} AOV
                    </span>
                  </div>

                  <div className="cat-bar-track">
                    <div
                      className="cat-bar-fill"
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: cat.avg_installments >= 5.0 ? "var(--accent)" : "#d97706",
                      }}
                    />
                  </div>

                  <div className="cat-value-right mono">
                    {categorySort === "installments"
                      ? `${cat.avg_installments.toFixed(2)}x`
                      : categorySort === "orders"
                      ? formatNumber(cat.total_orders)
                      : currency(cat.avg_order_value)}
                  </div>
                </div>
              );
            })}
          </div>

          {hoveredCategory && (
            <div className="category-detail-box">
              <div className="cat-detail-header">
                <strong>{hoveredCategory.category}</strong>
                <span className="mono">Avg Installments: {hoveredCategory.avg_installments}x</span>
              </div>
              <div className="cat-mix-bar" title="Payment Mix for this category">
                <span
                  style={{ width: `${hoveredCategory.payment_mix.credit_card}%`, backgroundColor: METHOD_COLORS.credit_card }}
                  title={`Credit Card: ${hoveredCategory.payment_mix.credit_card}%`}
                />
                <span
                  style={{ width: `${hoveredCategory.payment_mix.boleto}%`, backgroundColor: METHOD_COLORS.boleto }}
                  title={`Boleto: ${hoveredCategory.payment_mix.boleto}%`}
                />
                <span
                  style={{ width: `${hoveredCategory.payment_mix.voucher}%`, backgroundColor: METHOD_COLORS.voucher }}
                  title={`Voucher: ${hoveredCategory.payment_mix.voucher}%`}
                />
                <span
                  style={{ width: `${hoveredCategory.payment_mix.debit_card}%`, backgroundColor: METHOD_COLORS.debit_card }}
                  title={`Debit: ${hoveredCategory.payment_mix.debit_card}%`}
                />
              </div>
              <p className="mono cat-mix-labels">
                CC: {hoveredCategory.payment_mix.credit_card}% | Boleto: {hoveredCategory.payment_mix.boleto}% | Voucher: {hoveredCategory.payment_mix.voucher}%
              </p>
            </div>
          )}
        </div>

        {/* PANEL B: INSTALLMENT BUCKET VS AOV SCATTER / DISTRIBUTION */}
        <div className="dashboard-card scatter-panel">
          <div className="dashboard-card-header">
            <div>
              <p className="mono card-eyebrow">Descriptive Correlation (r = 0.37)</p>
              <h3>Installment Tier vs Average Order Value</h3>
            </div>
            <span className="kpi-pill accent">3.3x vs 1x Baseline</span>
          </div>

          <p className="panel-explanation">
            The data shows a consistent positive relationship: orders in 7–10 installments average <strong>R$ 336.44</strong> (3.33x the 1x baseline of R$ 100.91).
          </p>

          <div className="scatter-svg-wrapper">
            <svg viewBox="0 0 460 260" className="responsive-svg">
              {/* Grid Lines */}
              {[100, 200, 300, 400].map((val) => {
                const y = 220 - (val / 400) * 180;
                return (
                  <g key={val}>
                    <line x1="45" y1={y} x2="430" y2={y} stroke="var(--line)" />
                    <text x="38" y={y + 4} fill="var(--dim)" fontSize="9" textAnchor="end" fontFamily="monospace">
                      R${val}
                    </text>
                  </g>
                );
              })}

              {/* Connecting Trend Line */}
              <polyline
                points={(data.installment_buckets as InstallmentBucket[])
                  .map((b, idx) => {
                    const x = 75 + idx * 80;
                    const y = 220 - (b.avg_order_value / 400) * 180;
                    return `${x},${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2.5"
                strokeDasharray="2 2"
              />

              {/* Bucket Bubbles */}
              {(data.installment_buckets as InstallmentBucket[]).map((b, idx) => {
                const x = 75 + idx * 80;
                const y = 220 - (b.avg_order_value / 400) * 180;
                const r = Math.max(Math.sqrt(b.order_count / 100), 7);
                const isHovered = hoveredBucket?.bucket === b.bucket;

                return (
                  <g
                    key={b.bucket}
                    className="bubble-node"
                    onMouseEnter={() => setHoveredBucket(b)}
                    onMouseLeave={() => setHoveredBucket(null)}
                    style={{ cursor: "pointer" }}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? r + 3 : r}
                      fill={isHovered ? "var(--accent)" : "rgba(255,77,28,0.75)"}
                      stroke="var(--panel)"
                      strokeWidth={isHovered ? "2" : "1"}
                    />
                    <text x={x} y={y - r - 6} fill="var(--ink-heading)" fontSize="9" fontWeight="600" textAnchor="middle" fontFamily="monospace">
                      {currency(b.avg_order_value)}
                    </text>
                    <text x={x} y="240" fill="var(--dim)" fontSize="10" textAnchor="middle" fontFamily="monospace">
                      {b.bucket}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bucket Detail Card */}
          <div className="bucket-detail-grid">
            {(data.installment_buckets as InstallmentBucket[]).map((b) => (
              <div
                key={b.bucket}
                className={`bucket-stat-card ${hoveredBucket?.bucket === b.bucket ? "active-bucket" : ""}`}
                onMouseEnter={() => setHoveredBucket(b)}
                onMouseLeave={() => setHoveredBucket(null)}
              >
                <span className="mono bucket-title">{b.bucket}</span>
                <strong className="bucket-aov">{currency(b.avg_order_value)}</strong>
                <p className="mono bucket-meta">
                  {formatNumber(b.order_count)} orders ({b.order_pct}%)
                </p>
                <div className="bucket-multiplier mono">
                  {b.multiplier_vs_1x}x vs 1x
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: MULTI-FACET FILTER ENGINE */}
      <div className="dashboard-card filter-card">
        <div className="filter-card-header">
          <div>
            <p className="mono card-eyebrow">Data Control & Explorer</p>
            <h3>Multi-Parameter Filter Toolbar</h3>
          </div>
          <div className="filter-actions">
            <span className="mono active-count-badge">
              Active Records: {formatNumber(filteredTransactions.length)} / {formatNumber(data.sample_transactions.length)}
            </span>
            <button type="button" className="mono-btn reset-filter-btn" onClick={handleResetFilters}>
              Reset Filters ↺
            </button>
          </div>
        </div>

        <div className="filter-controls-row">
          {/* Method Filter Chips */}
          <div className="filter-group">
            <label className="mono">Payment Method</label>
            <div className="chip-list">
              {["all", "credit_card", "boleto", "voucher", "debit_card"].map((m) => (
                <button
                  type="button"
                  key={m}
                  className={`chip-btn ${selectedMethod === m ? "active" : ""}`}
                  onClick={() => {
                    setSelectedMethod(m);
                    setCurrentPage(1);
                  }}
                >
                  {m === "all" ? "All Methods" : m.replace("_", " ").toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="filter-group">
            <label className="mono" htmlFor="cat-select">Product Category</label>
            <select
              id="cat-select"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="styled-select"
            >
              <option value="all">All Categories ({uniqueCategories.length})</option>
              {uniqueCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Installment Range */}
          <div className="filter-group">
            <label className="mono">Installments: {minInstallments}x — {maxInstallments}x</label>
            <div className="range-controls">
              <input
                type="range"
                min="1"
                max="24"
                value={maxInstallments}
                onChange={(e) => {
                  setMaxInstallments(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="styled-range"
              />
            </div>
          </div>

          {/* Customer State Filter */}
          <div className="filter-group">
            <label className="mono" htmlFor="state-select">Customer State</label>
            <select
              id="state-select"
              value={stateFilter}
              onChange={(e) => {
                setStateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="styled-select"
            >
              <option value="all">All States (27)</option>
              {uniqueStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="filter-group search-group">
            <label className="mono" htmlFor="search-tx">Search Transactions</label>
            <input
              id="search-tx"
              type="text"
              placeholder="Search by ID, city, category..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="styled-input"
            />
          </div>
        </div>
      </div>

      {/* SECTION 5: AUDITABLE TRANSACTION DATA TABLE */}
      <div className="dashboard-card table-section">
        <div className="dashboard-card-header">
          <div>
            <p className="mono card-eyebrow">Granular Audit View</p>
            <h3>Representative Order Payment Transactions</h3>
          </div>
          <button type="button" className="mono-btn export-csv-btn" onClick={handleExportCSV}>
            Export Filtered CSV ↓
          </button>
        </div>

        <div className="table-responsive">
          <table className="styled-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("order_id")}>
                  Order ID {sortField === "order_id" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("order_date")}>
                  Date {sortField === "order_date" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("category")}>
                  Category {sortField === "category" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("payment_type")}>
                  Method {sortField === "payment_type" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("installments")}>
                  Installments {sortField === "installments" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("order_value")}>
                  Gross Value (R$) {sortField === "order_value" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("customer_state")}>
                  Location {sortField === "customer_state" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((tx, idx) => (
                  <tr key={`${tx.full_order_id}-${idx}`}>
                    <td className="mono order-code" title={tx.full_order_id}>
                      {tx.order_id}
                    </td>
                    <td className="mono">{tx.order_date}</td>
                    <td>{tx.category}</td>
                    <td>
                      <span
                        className="method-badge"
                        style={{
                          borderColor: METHOD_COLORS[tx.payment_type] || "var(--line)",
                          color: METHOD_COLORS[tx.payment_type] || "var(--ink)",
                        }}
                      >
                        {tx.payment_type.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="mono">
                      <span className={`inst-count ${tx.installments >= 10 ? "anomaly-text" : ""}`}>
                        {tx.installments}x
                      </span>
                    </td>
                    <td className="mono bold-val">{currency(tx.order_value)}</td>
                    <td className="mono state-col">
                      {tx.customer_city}, {tx.customer_state}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="empty-table-row">
                    No transactions match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="table-pagination">
          <span className="mono pagination-info">
            Showing {sortedTransactions.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, sortedTransactions.length)} of {formatNumber(sortedTransactions.length)} transactions
          </span>
          <div className="pagination-buttons">
            <button
              type="button"
              className="mono-btn"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              ← Previous
            </button>
            <span className="mono page-indicator">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              className="mono-btn"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
