"use client";

import { useEffect, useMemo, useState } from "react";

type HistogramBin = { start: number; end: number; count: number };
type Term = { term: string; count?: number; weight?: number };
type ProductRecord = { id: string; name: string; category: string; topCategory: string; actualPrice: number | null; discountedPrice: number | null; rating: number | null; ratingCount: number | null; discountPercentage: number | null };
type DashboardData = {
  dataset: { sourceRows: number; cleanRows: number; uniqueProducts: number; uniqueCategories: number; topLevelCategories: number; generatedAt: string };
  quality: { exactDuplicateRowsRemoved: number; missingByField: Record<string, number>; cleaningRules: string[] };
  reviewIntelligence: { reviewRecords: number; averageReviewWords: number; positiveTerms: Term[]; negativeTerms: Term[]; method: string };
  productRecords: ProductRecord[];
};
type ModelMetric = { name: string; type: string; accuracy: number; precision: number; recall: number; f1: number; rocAuc: number | null };
type ModelPayload = {
  evaluation: { status: string; threshold: number; thresholdNote: string; classDistribution: { label: string; count: number }[]; split: { train: number; test: number; randomState: number; stratified: boolean }; models: ModelMetric[]; bestModel: string; confusionMatrix: { truePositive: number; falseNegative: number; falsePositive: number; trueNegative: number; labelOrder: string }; explainability: { model: string; note: string; positiveTerms: Term[]; negativeTerms: Term[] } };
  inference: { modelName: string; threshold: number; intercept: number; vocabulary: Record<string, number>; idf: number[]; coefficients: number[]; tokenPattern: string; note: string };
};
type Prediction = { probability: number; matches: { term: string; contribution: number }[] } | { error: string };
type Range = { label: string; min?: number; max?: number };

const ratingRanges: Record<string, Range> = { all: { label: "All ratings" }, under4: { label: "Below 4.0", max: 4 }, fourTo42: { label: "4.0 to <4.2", min: 4, max: 4.2 }, high: { label: "4.2 and above", min: 4.2 } };
const discountRanges: Record<string, Range> = { all: { label: "All discounts" }, noTo25: { label: "0–25%", min: 0, max: 25 }, twentyFiveTo50: { label: "25–50%", min: 25, max: 50 }, fiftyPlus: { label: "50% and above", min: 50 } };
const priceRanges: Record<string, Range> = { all: { label: "All discounted prices" }, under500: { label: "Up to ₹500", max: 500 }, fiveTo15: { label: "₹500–₹1,500", min: 500, max: 1500 }, fifteenTo30: { label: "₹1,500–₹3,000", min: 1500, max: 3000 }, over30: { label: "Above ₹3,000", min: 3000 } };
const stopWords = new Set("a about above after again against all am an and any are as at be because been before being below between both but by can could did do does doing down during each few for from further had has have having he her here hers herself him himself his how i if in into is it its itself just me more most my myself no nor not now of off on once only or other our ours ourselves out over own same she should so some such than that the their theirs them themselves then there these they this those through to too under until up very was we were what when where which while who whom why will with would you your yours yourself yourselves".split(" "));
const compact = new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 });
const decimals = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });
const number = (value: number | null | undefined) => value === null || value === undefined || Number.isNaN(value) ? "—" : decimals.format(value);
const percent = (value: number | null | undefined) => value === null || value === undefined ? "—" : `${(value * 100).toFixed(1)}%`;
const shortCategory = (value: string) => value.split("|").at(-1)?.trim() || value;
const inRange = (value: number | null, range: Range) => value !== null && value !== undefined && (range.min === undefined || value >= range.min) && (range.max === undefined || value < range.max);

function buildHistogram(values: Array<number | null>, minimum: number, maximum: number) {
  const bins = Array.from({ length: 10 }, (_, index) => ({ start: minimum + ((maximum - minimum) / 10) * index, end: minimum + ((maximum - minimum) / 10) * (index + 1), count: 0 }));
  for (const value of values) if (value !== null && value !== undefined && value >= minimum && value <= maximum) bins[Math.min(Math.floor(((value - minimum) / Math.max(maximum - minimum, 1)) * 10), 9)].count += 1;
  return bins;
}

function correlation(rows: ProductRecord[], x: (row: ProductRecord) => number | null, y: (row: ProductRecord) => number | null) {
  const pairs = rows.map((row) => [x(row), y(row)] as const).filter((pair): pair is [number, number] => pair[0] !== null && pair[1] !== null);
  if (pairs.length < 2) return null;
  const xMean = pairs.reduce((sum, pair) => sum + pair[0], 0) / pairs.length; const yMean = pairs.reduce((sum, pair) => sum + pair[1], 0) / pairs.length;
  const numerator = pairs.reduce((sum, pair) => sum + (pair[0] - xMean) * (pair[1] - yMean), 0);
  const denominator = Math.sqrt(pairs.reduce((sum, pair) => sum + (pair[0] - xMean) ** 2, 0) * pairs.reduce((sum, pair) => sum + (pair[1] - yMean) ** 2, 0));
  return denominator ? numerator / denominator : null;
}

function Histogram({ bins, label, suffix = "" }: { bins: HistogramBin[]; label: string; suffix?: string }) {
  const max = Math.max(...bins.map((bin) => bin.count), 1);
  return <div className="amazon-histogram" role="img" aria-label={label}>{bins.map((bin) => <div className="amazon-hist-bin" key={`${bin.start}-${bin.end}`}><div className="amazon-hist-track"><span style={{ height: `${Math.max((bin.count / max) * 100, 2)}%` }}><i>{bin.count}</i></span></div><small>{`${bin.start.toFixed(suffix ? 0 : 1)}${suffix}`}</small></div>)}</div>;
}

function ScatterPlot({ rows, label, xLabel, yLabel, getX, getY, xLog = false }: { rows: ProductRecord[]; label: string; xLabel: string; yLabel: string; getX: (row: ProductRecord) => number | null; getY: (row: ProductRecord) => number | null; xLog?: boolean }) {
  const points = rows.map((row) => ({ row, x: getX(row), y: getY(row) })).filter((point): point is { row: ProductRecord; x: number; y: number } => point.x !== null && point.y !== null).slice(0, 400);
  if (!points.length) return <p className="playground-note">No complete numeric pairs are available for the selected filters.</p>;
  const convertedX = points.map((point) => xLog ? Math.log10(point.x + 1) : point.x); const valuesY = points.map((point) => point.y);
  const minX = Math.min(...convertedX, 0); const maxX = Math.max(...convertedX, 1); const minY = Math.min(...valuesY, 0); const maxY = Math.max(...valuesY, 1);
  const scaled = (value: number, min: number, max: number, start: number, size: number) => start + ((value - min) / Math.max(max - min, 1)) * size;
  return <><svg className="amazon-scatter" viewBox="0 0 440 235" role="img" aria-label={label}><path d="M42 190H416M42 126H416M42 62H416M42 30V190" />{points.map((point, index) => { const x = scaled(xLog ? Math.log10(point.x + 1) : point.x, minX, maxX, 42, 374); const y = 190 - scaled(point.y, minY, maxY, 0, 160); return <circle key={`${point.row.id}-${index}`} cx={x} cy={y} r="2.7"><title>{`${point.row.name} — ${xLabel}: ${number(point.x)}; ${yLabel}: ${number(point.y)}`}</title></circle>; })}</svg><div className="chart-axis"><span>{xLabel}</span><span>{yLabel}</span><span>{`${points.length} points shown`}</span></div></>;
}

function TermList({ title, terms, tone }: { title: string; terms: Term[]; tone: "positive" | "negative" }) {
  const max = Math.max(...terms.map((term) => Math.abs(term.count ?? term.weight ?? 0)), 1);
  return <div className={`amazon-term-list amazon-term-list-${tone}`}><p className="mono">{title}</p>{terms.map((term) => { const value = Math.abs(term.count ?? term.weight ?? 0); return <div key={term.term}><span>{term.term}</span><i style={{ width: `${Math.max((value / max) * 100, 3)}%` }} /><b>{term.count ?? number(term.weight)}</b></div>; })}</div>;
}

function runInference(text: string, model: ModelPayload["inference"]): Prediction {
  const tokens = (text.toLowerCase().match(/[a-z]{2,}/g) ?? []).filter((token) => !stopWords.has(token));
  if (!tokens.length) return { error: "Enter a short English product or review description to test the exported model vocabulary." };
  const features = [...tokens, ...tokens.slice(0, -1).map((token, index) => `${token} ${tokens[index + 1]}`)];
  const counts = new Map<number, { term: string; count: number }>();
  for (const feature of features) { const index = model.vocabulary[feature]; if (index !== undefined) { const current = counts.get(index); counts.set(index, { term: feature, count: (current?.count ?? 0) + 1 }); } }
  if (!counts.size) return { error: "No terms from this input appear in the exported TF-IDF vocabulary. Try more specific product or review language." };
  const weighted = [...counts.entries()].map(([index, entry]) => ({ index, term: entry.term, weight: entry.count * model.idf[index] })); const norm = Math.sqrt(weighted.reduce((sum, item) => sum + item.weight ** 2, 0)) || 1;
  const contributions = weighted.map((item) => ({ term: item.term, contribution: (item.weight / norm) * model.coefficients[item.index] })); const score = model.intercept + contributions.reduce((sum, item) => sum + item.contribution, 0);
  return { probability: 1 / (1 + Math.exp(-score)), matches: contributions.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution)).slice(0, 8) };
}

const sampleReviews = [
  { label: "⭐ High Quality & Fast Charging", text: "Excellent build quality and fast charging speed, very durable cord and great value for money!" },
  { label: "⚠️ Stopped Working / Overheating", text: "Stopped working after two days, poor wire durability and overheats immediately." },
  { label: "⚡ Budget & Clear Audio", text: "Decent sound quality for the price, clear audio and comfortable fit." },
  { label: "❌ Slow Transfer / Defective", text: "Slow data transfer rate and defective connector, misleading description and cheap plastic." },
];

export function AmazonDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [model, setModel] = useState<ModelPayload | null>(null);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("All categories");
  const [ratingRange, setRatingRange] = useState("all");
  const [discountRange, setDiscountRange] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [predictionInput, setPredictionInput] = useState("");
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [sortField, setSortField] = useState<"name" | "rating" | "ratingCount" | "discountPercentage">("rating");
  const [sortAsc, setSortAsc] = useState(false);
  const [pageSize, setPageSize] = useState(12);

  useEffect(() => {
    let live = true;
    if (window.matchMedia("(max-width: 720px)").matches) setFiltersOpen(false);
    Promise.all([
      fetch("/data/amazon/amazon-dashboard.json"),
      fetch("/data/amazon/amazon-model.json"),
    ])
      .then(async ([dashboardResponse, modelResponse]) => {
        if (!dashboardResponse.ok || !modelResponse.ok) throw new Error("The local data artifact could not be loaded.");
        return [await dashboardResponse.json(), await modelResponse.json()] as [DashboardData, ModelPayload];
      })
      .then(([dashboardData, modelData]) => {
        if (live) {
          setDashboard(dashboardData);
          setModel(modelData);
        }
      })
      .catch(() => {
        if (live) setError("The local Amazon data artifacts are unavailable. Rebuild public/data/amazon/ from analysis/amazon/analyze_amazon.py and export the static site again.");
      });
    return () => { live = false; };
  }, []);

  const categories = useMemo(() => dashboard ? ["All categories", ...Array.from(new Set(dashboard.productRecords.map((item) => item.category))).sort()] : [], [dashboard]);

  const filtered = useMemo(() => {
    return dashboard?.productRecords.filter((item) =>
      (category === "All categories" || item.category === category) &&
      inRange(item.rating, ratingRanges[ratingRange]) &&
      (discountRange === "all" || inRange(item.discountPercentage, discountRanges[discountRange])) &&
      (priceRange === "all" || inRange(item.discountedPrice, priceRanges[priceRange]))
    ) ?? [];
  }, [dashboard, category, ratingRange, discountRange, priceRange]);

  const sortedAndFilteredRows = useMemo(() => {
    const matching = filtered.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
    return matching.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortAsc ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
    });
  }, [filtered, query, sortField, sortAsc]);

  const tableRows = useMemo(() => sortedAndFilteredRows.slice(0, pageSize), [sortedAndFilteredRows, pageSize]);

  const ratingHistogram = useMemo(() => buildHistogram(filtered.map((item) => item.rating), 0, 5), [filtered]);
  const discountHistogram = useMemo(() => buildHistogram(filtered.map((item) => item.discountPercentage), 0, 100), [filtered]);

  const categoryBars = useMemo(() => {
    const counts = new Map<string, number>();
    filtered.forEach((item) => counts.set(item.category, (counts.get(item.category) ?? 0) + 1));
    return [...counts.entries()].map(([name, records]) => ({ category: name, records, percent: filtered.length ? (records / filtered.length) * 100 : 0 })).sort((a, b) => b.records - a.records).slice(0, 10);
  }, [filtered]);

  const activeProducts = new Set(filtered.map((item) => item.id)).size;
  const avgRating = filtered.length ? filtered.reduce((sum, item) => sum + (item.rating ?? 0), 0) / filtered.filter((item) => item.rating !== null).length : null;
  const availableDiscounts = filtered.filter((item) => item.discountPercentage !== null);
  const avgDiscount = availableDiscounts.length ? availableDiscounts.reduce((sum, item) => sum + (item.discountPercentage ?? 0), 0) / availableDiscounts.length : null;
  const activeCategory = category === "All categories" ? null : category;
  const selectedCategoryRows = activeCategory ? filtered : [];
  const medianPrice = selectedCategoryRows.length ? [...selectedCategoryRows].map((item) => item.discountedPrice).filter((value): value is number => value !== null).sort((a, b) => a - b)[Math.floor(selectedCategoryRows.filter((item) => item.discountedPrice !== null).length / 2)] ?? null : null;

  const resetFilters = () => {
    setCategory("All categories");
    setRatingRange("all");
    setDiscountRange("all");
    setPriceRange("all");
    setQuery("");
  };

  const handleSort = (field: "name" | "rating" | "ratingCount" | "discountPercentage") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleApplyPresetReview = (presetText: string) => {
    setPredictionInput(presetText);
    if (model) {
      setPrediction(runInference(presetText, model.inference));
    }
  };

  if (error) return <div className="amazon-dashboard-state empty-state" role="status"><p className="mono">Static data unavailable</p><p>{error}</p></div>;
  if (!dashboard || !model) return <div className="amazon-dashboard-state amazon-loading" role="status" aria-live="polite" aria-busy="true"><p className="mono">Loading local data artifacts</p><div /><div /><div /></div>;

  const { dataset, quality, reviewIntelligence } = dashboard;
  const { evaluation } = model;

  return (
    <div className="amazon-dashboard" aria-label="Amazon Product Intelligence dashboard">
      <div className="amazon-dashboard-intro">
        <p className="mono">Interactive Data Lab / 1,465 Records</p>
        <p>Explore catalog patterns, filter product distributions in real time, and test live client-side NLP inference directly in your browser without backend latency.</p>
      </div>

      {/* Quick Filter Presets */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "18px 0 8px", alignItems: "center" }}>
        <span className="mono" style={{ fontSize: "9px", color: "var(--dim)", marginRight: "4px" }}>Quick Presets:</span>
        <button type="button" className="mono" style={{ fontSize: "10px", padding: "4px 10px", border: "1px solid var(--line)", background: ratingRange === "high" ? "var(--accent-subtle)" : "var(--surface-secondary)", color: ratingRange === "high" ? "var(--accent)" : "var(--muted)", cursor: "pointer", borderRadius: "3px" }} onClick={() => setRatingRange(ratingRange === "high" ? "all" : "high")}>⭐ Top Rated (≥4.2★)</button>
        <button type="button" className="mono" style={{ fontSize: "10px", padding: "4px 10px", border: "1px solid var(--line)", background: discountRange === "fiftyPlus" ? "var(--accent-subtle)" : "var(--surface-secondary)", color: discountRange === "fiftyPlus" ? "var(--accent)" : "var(--muted)", cursor: "pointer", borderRadius: "3px" }} onClick={() => setDiscountRange(discountRange === "fiftyPlus" ? "all" : "fiftyPlus")}>🔥 Deep Discounts (≥50%)</button>
        <button type="button" className="mono" style={{ fontSize: "10px", padding: "4px 10px", border: "1px solid var(--line)", background: priceRange === "under500" ? "var(--accent-subtle)" : "var(--surface-secondary)", color: priceRange === "under500" ? "var(--accent)" : "var(--muted)", cursor: "pointer", borderRadius: "3px" }} onClick={() => setPriceRange(priceRange === "under500" ? "all" : "under500")}>💰 Budget (≤₹500)</button>
        <button type="button" className="mono" style={{ fontSize: "10px", padding: "4px 10px", border: "1px solid var(--line)", background: category.includes("Computers") ? "var(--accent-subtle)" : "var(--surface-secondary)", color: category.includes("Computers") ? "var(--accent)" : "var(--muted)", cursor: "pointer", borderRadius: "3px" }} onClick={() => { const comp = categories.find(c => c.includes("Computers")) || "All categories"; setCategory(category === comp ? "All categories" : comp); }}>💻 Computers</button>
        <button type="button" className="mono" style={{ fontSize: "10px", padding: "4px 10px", border: "1px solid var(--line)", background: category.includes("Electronics") ? "var(--accent-subtle)" : "var(--surface-secondary)", color: category.includes("Electronics") ? "var(--accent)" : "var(--muted)", cursor: "pointer", borderRadius: "3px" }} onClick={() => { const elec = categories.find(c => c.includes("Electronics")) || "All categories"; setCategory(category === elec ? "All categories" : elec); }}>🎧 Electronics</button>
      </div>

      <div className="amazon-filter-rack">
        <button className="amazon-filter-toggle mono" type="button" aria-expanded={filtersOpen} aria-controls="amazon-global-filters" onClick={() => setFiltersOpen((value) => !value)}>
          <span>Global filters ({filtered.length} matching rows)</span>
          <i>{filtersOpen ? "−" : "+"}</i>
        </button>
        {filtersOpen && (
          <div id="amazon-global-filters" className="amazon-filter-controls">
            <label>
              <span className="mono">Category path</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by Amazon category">
                {categories.map((item) => (
                  <option key={item} value={item}>{item === "All categories" ? item : shortCategory(item)}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="mono">Rating</span>
              <select value={ratingRange} onChange={(event) => setRatingRange(event.target.value)} aria-label="Filter by rating range">
                {Object.entries(ratingRanges).map(([key, range]) => (
                  <option key={key} value={key}>{range.label}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="mono">Discount</span>
              <select value={discountRange} onChange={(event) => setDiscountRange(event.target.value)} aria-label="Filter by discount range">
                {Object.entries(discountRanges).map(([key, range]) => (
                  <option key={key} value={key}>{range.label}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="mono">Discounted price</span>
              <select value={priceRange} onChange={(event) => setPriceRange(event.target.value)} aria-label="Filter by discounted price range">
                {Object.entries(priceRanges).map(([key, range]) => (
                  <option key={key} value={key}>{range.label}</option>
                ))}
              </select>
            </label>
            <button className="reset-button mono" type="button" onClick={resetFilters}>Reset all</button>
          </div>
        )}
      </div>

      <div className="kpi-grid amazon-kpi-grid" aria-live="polite">
        <div>
          <span className="mono">Active records</span>
          <strong>{compact.format(filtered.length)}</strong>
          <p>Of {dataset.sourceRows} source rows in catalog snapshot.</p>
        </div>
        <div>
          <span className="mono">Active products</span>
          <strong>{compact.format(activeProducts)}</strong>
          <p>Unique product IDs in the active view.</p>
        </div>
        <div>
          <span className="mono">Average rating</span>
          <strong>{number(avgRating)} ★</strong>
          <p>Computed from currently filtered records.</p>
        </div>
        <div>
          <span className="mono">Average discount</span>
          <strong>{number(avgDiscount)}%</strong>
          <p>Average price reduction across filtered items.</p>
        </div>
      </div>

      {activeCategory && (
        <div className="amazon-stat-strip" aria-live="polite">
          <span className="mono">Selected path</span>
          <strong>{activeCategory}</strong>
          <div><b>{filtered.length}</b><span>active records</span></div>
          <div><b>{number(avgRating)}</b><span>avg. rating</span></div>
          <div><b>{number(avgDiscount)}%</b><span>avg. discount</span></div>
          <div><b>{medianPrice === null ? "—" : `₹${compact.format(medianPrice)}`}</b><span>median discounted price</span></div>
        </div>
      )}

      {!filtered.length && (
        <div className="empty-state amazon-empty-state" role="status">
          <p className="mono">No records match these filters</p>
          <button type="button" onClick={resetFilters}>Reset all filters</button>
        </div>
      )}

      <section className="amazon-section-grid" aria-labelledby="amazon-distribution-title">
        <div className="chart-panel">
          <div className="chart-heading">
            <p id="amazon-distribution-title" className="mono">Rating distribution</p>
            <span>active view / 0–5 ★</span>
          </div>
          <Histogram bins={ratingHistogram} label="Histogram of filtered Amazon product ratings" />
          <p className="playground-note">Observed rating frequencies across active filter selections.</p>
        </div>
        <div className="chart-panel">
          <div className="chart-heading">
            <p className="mono">Discount distribution</p>
            <span>active view / 0–100%</span>
          </div>
          <Histogram bins={discountHistogram} label="Histogram of filtered discount percentages" suffix="%" />
          <p className="playground-note">Standardized discount depth across promotional catalog records.</p>
        </div>
      </section>

      <section className="amazon-section-grid" aria-labelledby="amazon-category-title">
        <div className="chart-panel">
          <div className="chart-heading">
            <p id="amazon-category-title" className="mono">Most frequent category paths</p>
            <span>Top 10 / active view</span>
          </div>
          <div className="amazon-category-bars">
            {categoryBars.map((item) => (
              <div key={item.category} style={{ cursor: "pointer" }} onClick={() => setCategory(item.category)}>
                <span title={item.category}>{shortCategory(item.category)}</span>
                <i><b style={{ width: `${item.percent}%` }} /></i>
                <em>{item.records}</em>
              </div>
            ))}
          </div>
          {!categoryBars.length && <p className="playground-note">No category paths are in the active view.</p>}
          <p className="playground-note">Click any category bar to filter the entire dashboard by that taxonomy node.</p>
        </div>
        <div className="chart-panel">
          <div className="chart-heading">
            <p className="mono">Observed correlations</p>
            <span>Pearson / active view</span>
          </div>
          <div className="amazon-correlation">
            <div>
              <span className="mono">Rating × rating count</span>
              <strong>{number(correlation(filtered, (row) => row.rating, (row) => row.ratingCount))}</strong>
            </div>
            <div>
              <span className="mono">Discount × rating</span>
              <strong>{number(correlation(filtered, (row) => row.discountPercentage, (row) => row.rating))}</strong>
            </div>
          </div>
          <p className="playground-note">Correlation values dynamically recompute as you manipulate filters.</p>
        </div>
      </section>

      <section className="amazon-section-grid" aria-label="Scatter plots filtered by global Amazon controls">
        <div className="chart-panel">
          <div className="chart-heading">
            <p className="mono">Rating versus rating count</p>
            <span>active view / log x</span>
          </div>
          <ScatterPlot rows={filtered} label="Scatter plot of filtered rating count and rating" xLabel="rating count (log scale)" yLabel="rating" getX={(row) => row.ratingCount} getY={(row) => row.rating} xLog />
        </div>
        <div className="chart-panel">
          <div className="chart-heading">
            <p className="mono">Discount versus rating</p>
            <span>active view / raw</span>
          </div>
          <ScatterPlot rows={filtered} label="Scatter plot of filtered discount percentage and rating" xLabel="discount %" yLabel="rating" getX={(row) => row.discountPercentage} getY={(row) => row.rating} />
        </div>
      </section>

      {/* Interactive Sortable Product Explorer */}
      <section className="amazon-product-explorer table-panel" aria-labelledby="amazon-product-title" style={{ height: "auto", maxHeight: "none" }}>
        <div className="table-heading" style={{ flexWrap: "wrap", gap: "10px" }}>
          <p id="amazon-product-title" className="mono">Product explorer ({sortedAndFilteredRows.length} items)</p>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <label>
              <span className="sr-only">Search current filtered Amazon products</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search active product names..." aria-label="Search active product names" />
            </label>
            <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="mono" style={{ fontSize: "10px", padding: "6px", background: "var(--surface-secondary)", color: "var(--ink)", border: "1px solid var(--line)" }} aria-label="Rows per page">
              <option value={12}>12 rows</option>
              <option value={25}>25 rows</option>
              <option value={50}>50 rows</option>
            </select>
          </div>
        </div>
        <div className="table-scroll">
          <table aria-label="Amazon products matching the active filters">
            <thead>
              <tr>
                <th scope="col" onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                  Product {sortField === "name" && (sortAsc ? "↑" : "↓")}
                </th>
                <th scope="col">Category</th>
                <th scope="col" onClick={() => handleSort("rating")} style={{ cursor: "pointer" }}>
                  Rating {sortField === "rating" && (sortAsc ? "↑" : "↓")}
                </th>
                <th scope="col" onClick={() => handleSort("ratingCount")} style={{ cursor: "pointer" }}>
                  Ratings {sortField === "ratingCount" && (sortAsc ? "↑" : "↓")}
                </th>
                <th scope="col" onClick={() => handleSort("discountPercentage")} style={{ cursor: "pointer" }}>
                  Discount {sortField === "discountPercentage" && (sortAsc ? "↑" : "↓")}
                </th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((item) => (
                <tr key={`${item.id}-${item.name}`}>
                  <td title={item.name}>{item.name}</td>
                  <td title={item.category}>{shortCategory(item.category)}</td>
                  <td><b>{number(item.rating)} ★</b></td>
                  <td>{item.ratingCount === null ? "—" : compact.format(item.ratingCount)}</td>
                  <td>{item.discountPercentage === null ? "—" : `${number(item.discountPercentage)}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!tableRows.length && <p className="playground-note">No product names match the current filters and local search.</p>}
        </div>
      </section>

      {/* Review Intelligence */}
      <section className="amazon-review-section" aria-labelledby="amazon-review-title">
        <div className="amazon-section-heading">
          <p className="mono">Review intelligence / full snapshot</p>
          <h3 id="amazon-review-title">Review Language Signals</h3>
          <p>{reviewIntelligence.reviewRecords} records contain review text; the average non-empty review has {number(reviewIntelligence.averageReviewWords)} words.</p>
        </div>
        <div className="amazon-term-grid">
          <TermList title="Frequent terms / rating ≥ 4.2 ★ (Positive Signals)" terms={reviewIntelligence.positiveTerms} tone="positive" />
          <TermList title="Frequent terms / rating < 4.2 ★ (Negative Signals)" terms={reviewIntelligence.negativeTerms} tone="negative" />
        </div>
      </section>

      {/* Supervised ML Benchmark */}
      <section id="model" className="amazon-model-section" aria-labelledby="amazon-model-title">
        <div className="amazon-section-heading">
          <p className="mono">Held-out model evaluation / 80-20 split</p>
          <h3 id="amazon-model-title">Machine Learning Benchmark</h3>
          <p>{evaluation.thresholdNote} The split is {evaluation.split.train} training / {evaluation.split.test} test records, stratified with random state {evaluation.split.randomState}.</p>
        </div>
        <div className="table-panel" style={{ height: "auto", maxHeight: "none" }}>
          <div className="table-heading">
            <p className="mono">Supervised Model Comparison</p>
            <span className="mono">Best F1 / {evaluation.bestModel}</span>
          </div>
          <div className="table-scroll">
            <table aria-label="Model evaluation results on a held-out test set">
              <thead>
                <tr>
                  <th scope="col">Model</th>
                  <th scope="col">Accuracy</th>
                  <th scope="col">Precision</th>
                  <th scope="col">Recall</th>
                  <th scope="col">F1-Score</th>
                  <th scope="col">ROC-AUC</th>
                </tr>
              </thead>
              <tbody>
                {evaluation.models.map((item) => (
                  <tr className={item.name === evaluation.bestModel ? "amazon-best-model" : ""} key={item.name}>
                    <td>{item.name}{item.name === evaluation.bestModel && <span className="mono"> ★ best</span>}</td>
                    <td>{percent(item.accuracy)}</td>
                    <td>{percent(item.precision)}</td>
                    <td>{percent(item.recall)}</td>
                    <td><b>{percent(item.f1)}</b></td>
                    <td><b>{percent(item.rocAuc)}</b></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="amazon-model-lower">
          <div className="chart-panel">
            <div className="chart-heading">
              <p className="mono">Best model confusion matrix</p>
              <span>Actual / predicted</span>
            </div>
            <div className="amazon-confusion" role="img" aria-label="Confusion matrix for the best Linear SVM model">
              <span>actual ↓ / predicted →</span>
              <span>High (≥4.2★)</span>
              <span>Not high (&lt;4.2★)</span>
              <span>High (≥4.2★)</span>
              <strong>{evaluation.confusionMatrix.truePositive}<small>TP</small></strong>
              <strong>{evaluation.confusionMatrix.falseNegative}<small>FN</small></strong>
              <span>Not high (&lt;4.2★)</span>
              <strong>{evaluation.confusionMatrix.falsePositive}<small>FP</small></strong>
              <strong>{evaluation.confusionMatrix.trueNegative}<small>TN</small></strong>
            </div>
          </div>
          <div className="chart-panel">
            <div className="chart-heading">
              <p className="mono">Coefficient evidence</p>
              <span>{evaluation.explainability.model}</span>
            </div>
            <div className="amazon-term-grid compact">
              <TermList title="Toward high rating (+ weights)" terms={evaluation.explainability.positiveTerms} tone="positive" />
              <TermList title="Toward not-high rating (- weights)" terms={evaluation.explainability.negativeTerms} tone="negative" />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Client-Side NLP Simulator with 1-Click Test Presets */}
      <section id="predict-lab" className="amazon-predict-section" aria-labelledby="prediction-title">
        <div className="amazon-section-heading">
          <p className="mono">Interactive Simulator / Zero-Latency Browser NLP</p>
          <h3 id="prediction-title">Live Client-Side Review Scoring</h3>
          <p>Test real-time TF-IDF feature extraction and logistic regression inference directly inside your browser. No server calls or API latency.</p>
        </div>

        {/* 1-Click Sample Reviews */}
        <div style={{ margin: "20px 0 12px", display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
          <span className="mono" style={{ fontSize: "9px", color: "var(--dim)" }}>Try Sample Reviews:</span>
          {sampleReviews.map((sample) => (
            <button
              key={sample.label}
              type="button"
              className="mono"
              style={{
                fontSize: "10px",
                padding: "5px 10px",
                border: "1px solid var(--line)",
                background: "var(--surface-secondary)",
                color: "var(--ink)",
                cursor: "pointer",
                borderRadius: "3px",
                transition: "all .15s ease",
              }}
              onClick={() => handleApplyPresetReview(sample.text)}
            >
              {sample.label}
            </button>
          ))}
        </div>

        <div className="amazon-predict-grid">
          <label>
            <span className="mono">Product or review text</span>
            <textarea
              value={predictionInput}
              onChange={(event) => {
                setPredictionInput(event.target.value);
                setPrediction(null);
              }}
              placeholder="Type or click a sample review above to evaluate sentiment..."
              rows={5}
            />
            <button
              type="button"
              className="reset-button mono"
              onClick={() => setPrediction(runInference(predictionInput, model.inference))}
            >
              Run Local NLP Inference ⚡
            </button>
          </label>
          <div className="amazon-prediction-output" aria-live="polite">
            {!prediction && (
              <p className="playground-note">
                No text has been scored yet. Click a sample button or type a review, then press &quot;Run Local NLP Inference&quot; to test client-side TF-IDF scoring across {compact.format(Object.keys(model.inference.vocabulary).length)} n-gram features.
              </p>
            )}
            {prediction && "error" in prediction && (
              <p className="playground-note" style={{ color: "var(--accent)" }}>{prediction.error}</p>
            )}
            {prediction && !("error" in prediction) && (
              <>
                <p className="mono">Estimated High-Rating Likelihood (≥ 4.2★)</p>
                <strong style={{ color: prediction.probability >= 0.5 ? "var(--accent)" : "var(--muted)" }}>
                  {percent(prediction.probability)}
                </strong>
                <p>
                  {prediction.probability >= 0.5
                    ? "✨ Positive Sentiment: The text activates strong positive quality terms."
                    : "⚠️ Negative/Moderate Sentiment: The text contains friction keywords or low-score signals."}
                </p>
                <div className="amazon-match-list">
                  {prediction.matches.map((match) => (
                    <span key={match.term}>
                      {match.term}
                      <i style={{ color: match.contribution >= 0 ? "var(--accent)" : "#ef4444" }}>
                        {match.contribution >= 0 ? "+" : ""}{match.contribution.toFixed(3)}
                      </i>
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
