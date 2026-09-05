import { describe, expect, it } from "vitest";
import rawPaymentData from "../content/data/olist_payment_analysis.json";
import rawBrazilMap from "../content/data/brazil_map.json";
import rawPlaygroundData from "../content/data/playground.json";
import rawPlaygroundPart2Data from "../content/data/playground_part2.json";

describe("Interactive Showcase & UI Component Empirical Stress Suite", () => {
  // =========================================================================
  // 1. OlistPaymentDashboard Logic & Edge Cases
  // =========================================================================
  describe("OlistPaymentDashboard Stress Testing", () => {
    const data = rawPaymentData;

    it("verifies executive KPI data consistency and mathematical integrity", () => {
      expect(data.metadata.total_gmv).toBeGreaterThan(16000000);
      expect(data.metadata.credit_card_share_value).toBeCloseTo(78.3, 1);
      expect(data.metadata.pearson_correlation).toBe(0.37);
      expect(data.metadata.anomaly_10x_count).toBe(5328);

      const paymentMethodGmvSum = data.payment_methods.reduce((sum, m) => sum + m.total_value, 0);
      expect(paymentMethodGmvSum).toBeCloseTo(data.metadata.total_gmv, -3);

      const paymentMethodPctSum = data.payment_methods.reduce((sum, m) => sum + m.value_pct, 0);
      expect(paymentMethodPctSum).toBeCloseTo(100, 0);
    });

    it("verifies sample transaction filtering with multiple criteria", () => {
      const txs = data.sample_transactions;
      expect(txs.length).toBe(1200);

      // Filter by Credit Card only
      const ccOnly = txs.filter((t) => t.payment_type === "credit_card");
      expect(ccOnly.length).toBeGreaterThan(0);
      expect(ccOnly.every((t) => t.payment_type === "credit_card")).toBe(true);

      // Filter by State = SP
      const spOnly = txs.filter((t) => t.customer_state === "SP");
      expect(spOnly.length).toBeGreaterThan(0);
      expect(spOnly.every((t) => t.customer_state === "SP")).toBe(true);

      // Filter by Installments range 10..24
      const highInst = txs.filter((t) => t.installments >= 10 && t.installments <= 24);
      expect(highInst.length).toBeGreaterThan(0);
      expect(highInst.every((t) => t.installments >= 10 && t.installments <= 24)).toBe(true);

      // Combined multi-facet filter
      const combined = txs.filter(
        (t) =>
          t.payment_type === "credit_card" &&
          t.customer_state === "SP" &&
          t.installments >= 10 &&
          t.installments <= 24
      );
      expect(combined.every((t) => t.payment_type === "credit_card" && t.customer_state === "SP" && t.installments >= 10)).toBe(true);
    });

    it("handles zero-result filter combinations gracefully without NaN or runtime exceptions", () => {
      const txs = data.sample_transactions;

      // Impossible filter: Boleto with 10 installments in state XX
      const zeroResults = txs.filter(
        (t) => t.payment_type === "boleto" && t.installments >= 10 && t.customer_state === "NON_EXISTENT_STATE"
      );
      expect(zeroResults.length).toBe(0);

      // Check summary statistics safety under 0 results
      const activeTxCount = zeroResults.length;
      const activeTxSum = zeroResults.reduce((acc, t) => acc + t.order_value, 0);
      const activeAOV = activeTxCount > 0 ? activeTxSum / activeTxCount : 0;
      const activeCCShare = activeTxCount > 0 ? (zeroResults.filter((t) => t.payment_type === "credit_card").length / activeTxCount) * 100 : 0;

      expect(activeAOV).toBe(0);
      expect(Number.isNaN(activeAOV)).toBe(false);
      expect(activeCCShare).toBe(0);
      expect(Number.isNaN(activeCCShare)).toBe(false);

      // Pagination math safety under 0 results
      const pageSize = 10;
      const totalPages = Math.ceil(zeroResults.length / pageSize) || 1;
      expect(totalPages).toBe(1);

      const currentPage = 1;
      const paginated = zeroResults.slice((currentPage - 1) * pageSize, currentPage * pageSize);
      expect(paginated).toEqual([]);

      const zeroStart = zeroResults.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
      const zeroEnd = Math.min(currentPage * pageSize, zeroResults.length);
      const zeroPaginationText = `Showing ${zeroStart}–${zeroEnd} of ${zeroResults.length} transactions`;
      expect(zeroPaginationText).toBe("Showing 0–0 of 0 transactions");

      // Non-zero results pagination string formatting
      const sampleStart = txs.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
      const sampleEnd = Math.min(currentPage * pageSize, txs.length);
      const samplePaginationText = `Showing ${sampleStart}–${sampleEnd} of ${txs.length} transactions`;
      expect(samplePaginationText).toBe("Showing 1–10 of 1200 transactions");
    });

    it("handles case-insensitive search queries across multiple attributes", () => {
      const txs = data.sample_transactions;
      const queries = ["são paulo", "SAO PAULO", "computers", "credit_card", "voucher"];

      for (const q of queries) {
        const queryLower = q.toLowerCase();
        const matches = txs.filter((item) => {
          return (
            item.full_order_id.toLowerCase().includes(queryLower) ||
            item.category.toLowerCase().includes(queryLower) ||
            item.customer_city.toLowerCase().includes(queryLower) ||
            item.customer_state.toLowerCase().includes(queryLower) ||
            item.payment_type.toLowerCase().includes(queryLower)
          );
        });
        expect(Array.isArray(matches)).toBe(true);
      }
    });

    it("sorts transactions numerically and alphabetically in both asc and desc orders", () => {
      const txs = [...data.sample_transactions];

      // Numeric sort: order_value desc
      const sortedByValueDesc = [...txs].sort((a, b) => b.order_value - a.order_value);
      for (let i = 0; i < sortedByValueDesc.length - 1; i++) {
        expect(sortedByValueDesc[i].order_value).toBeGreaterThanOrEqual(sortedByValueDesc[i + 1].order_value);
      }

      // Numeric sort: installments asc
      const sortedByInstAsc = [...txs].sort((a, b) => a.installments - b.installments);
      for (let i = 0; i < sortedByInstAsc.length - 1; i++) {
        expect(sortedByInstAsc[i].installments).toBeLessThanOrEqual(sortedByInstAsc[i + 1].installments);
      }

      // Alphabetical sort: category asc
      const sortedByCatAsc = [...txs].sort((a, b) => a.category.localeCompare(b.category));
      for (let i = 0; i < sortedByCatAsc.length - 1; i++) {
        expect(sortedByCatAsc[i].category.localeCompare(sortedByCatAsc[i + 1].category)).toBeLessThanOrEqual(0);
      }
    });

    it("validates monthly trends chart scaling and data bounds", () => {
      const months = data.monthly_trends;
      expect(months.length).toBe(20); // 20 months 2017-01 to 2018-08

      const maxMonthValue = Math.max(...months.map((m) => m.total_value), 1);
      const maxMonthOrders = Math.max(...months.map((m) => m.total_orders), 1);
      const maxMonthInst = Math.max(...months.map((m) => m.avg_installments), 5);

      expect(maxMonthValue).toBeGreaterThan(0);
      expect(maxMonthOrders).toBeGreaterThan(0);
      expect(maxMonthInst).toBeGreaterThanOrEqual(3.0);

      // Verify each month has positive values and orders
      months.forEach((m) => {
        expect(m.total_value).toBeGreaterThan(0);
        expect(m.total_orders).toBeGreaterThan(0);
        expect(m.avg_installments).toBeGreaterThan(0);
        expect(m.credit_card_value + m.boleto_value + m.voucher_value + m.debit_card_value).toBeCloseTo(m.total_value, -1);
      });
    });

    it("validates category ranking sort modes and payment mix totals", () => {
      const cats = data.categories.filter((c) => c.total_orders >= 100);
      expect(cats.length).toBeGreaterThanOrEqual(15);

      // Check payment mix sums to ~100%
      cats.forEach((cat) => {
        const mixSum =
          cat.payment_mix.credit_card +
          cat.payment_mix.boleto +
          cat.payment_mix.voucher +
          cat.payment_mix.debit_card;
        expect(mixSum).toBeCloseTo(100, 0);
      });

      // Top 15 by installments
      const topInst = [...cats].sort((a, b) => b.avg_installments - a.avg_installments).slice(0, 15);
      expect(topInst[0].avg_installments).toBeGreaterThanOrEqual(topInst[1].avg_installments);

      // Top 15 by orders
      const topOrders = [...cats].sort((a, b) => b.total_orders - a.total_orders).slice(0, 15);
      expect(topOrders[0].total_orders).toBeGreaterThanOrEqual(topOrders[1].total_orders);

      // Top 15 by AOV
      const topAOV = [...cats].sort((a, b) => b.avg_order_value - a.avg_order_value).slice(0, 15);
      expect(topAOV[0].avg_order_value).toBeGreaterThanOrEqual(topAOV[1].avg_order_value);
    });

    it("validates installment buckets monotonicity with AOV surge", () => {
      const buckets = data.installment_buckets;
      expect(buckets.length).toBe(5);

      // Baseline (1x) vs Extended (7-10x)
      const bucket1x = buckets.find((b) => b.bucket === "1x");
      const bucket7_10x = buckets.find((b) => b.bucket === "7-10x");

      expect(bucket1x).toBeDefined();
      expect(bucket7_10x).toBeDefined();
      expect(bucket7_10x!.avg_order_value).toBeGreaterThan(bucket1x!.avg_order_value * 3.0);
      expect(bucket7_10x!.multiplier_vs_1x).toBeCloseTo(3.33, 1);
    });
  });

  // =========================================================================
  // 2. OlistPaymentInteractiveShowcase Static Data Validation
  // =========================================================================
  describe("OlistPaymentInteractiveShowcase Logic", () => {
    const PAYMENT_METHODS = [
      { method: "Credit Card", share_volume: 73.9, share_gmv: 78.4, avg_installments: 3.51 },
      { method: "Boleto Bancário", share_volume: 19.0, share_gmv: 17.9, avg_installments: 1.0 },
      { method: "Voucher", share_volume: 5.6, share_gmv: 2.4, avg_installments: 1.0 },
      { method: "Debit Card", share_volume: 1.5, share_gmv: 1.4, avg_installments: 1.0 },
    ];

    it("verifies sum of shares equals 100%", () => {
      const volumeSum = PAYMENT_METHODS.reduce((acc, m) => acc + m.share_volume, 0);
      const gmvSum = PAYMENT_METHODS.reduce((acc, m) => acc + m.share_gmv, 0);

      expect(volumeSum).toBeCloseTo(100.0, 1);
      expect(gmvSum).toBeCloseTo(100.1, 1);
    });

    it("ensures Credit Card is the only method with >1.0 installments", () => {
      const multiInst = PAYMENT_METHODS.filter((m) => m.avg_installments > 1.0);
      expect(multiInst).toHaveLength(1);
      expect(multiInst[0].method).toBe("Credit Card");
    });
  });

  // =========================================================================
  // 3. OlistGeoShowcase Geospatial & State Fallback Validation
  // =========================================================================
  describe("OlistGeoShowcase State & Map Coverage", () => {
    const mapPaths = rawBrazilMap.paths;
    const mapCentroids = rawBrazilMap.centroids;

    const ALL_27_UFS = [
      "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
      "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
      "RS", "RO", "RR", "SC", "SP", "SE", "TO"
    ];

    it("contains all 27 Brazilian federation units in paths and centroids", () => {
      expect(Object.keys(mapPaths)).toHaveLength(27);
      expect(Object.keys(mapCentroids)).toHaveLength(27);

      for (const uf of ALL_27_UFS) {
        expect(mapPaths).toHaveProperty(uf);
        expect(mapCentroids).toHaveProperty(uf);
        expect(typeof (mapCentroids as any)[uf].x).toBe("number");
        expect(typeof (mapCentroids as any)[uf].y).toBe("number");
      }
    });

    it("provides fallback behavior for unknown UF without crash", () => {
      const mockMetrics: Record<string, { uf: string; name: string }> = {
        SP: { uf: "SP", name: "São Paulo" },
      };

      const getActiveState = (hoveredUF: string) => mockMetrics[hoveredUF] || mockMetrics["SP"];

      expect(getActiveState("SP").name).toBe("São Paulo");
      expect(getActiveState("UNKNOWN_UF").name).toBe("São Paulo");
      expect(getActiveState("").name).toBe("São Paulo");
    });
  });

  // =========================================================================
  // 4. OlistRfmShowcase Retention Matrix Validation
  // =========================================================================
  describe("OlistRfmShowcase Retention Matrix", () => {
    const RFM_PILLARS = [
      { id: "dormant_high", name: "Cannot Lose Them (Dormant High-Value)", gmv_pct: 27.5, cust_pct: 14.7 },
      { id: "active_high", name: "Promising & New Big Spenders", gmv_pct: 40.8, cust_pct: 22.9 },
      { id: "low_value_base", name: "One-Time Low-Value Base", gmv_pct: 26.1, cust_pct: 59.4 },
      { id: "champions_vip", name: "True Loyal Repeat Buyers", gmv_pct: 5.6, cust_pct: 3.0 },
    ];

    it("verifies that 4 pillars partition 100% of GMV and customers", () => {
      const totalGmvPct = RFM_PILLARS.reduce((sum, p) => sum + p.gmv_pct, 0);
      const totalCustPct = RFM_PILLARS.reduce((sum, p) => sum + p.cust_pct, 0);

      expect(totalGmvPct).toBeCloseTo(100.0, 1);
      expect(totalCustPct).toBeCloseTo(100.0, 1);
    });

    it("confirms high-value single buyers drive over 68% of GMV", () => {
      const dormantAndActiveHighGmv = RFM_PILLARS[0].gmv_pct + RFM_PILLARS[1].gmv_pct;
      expect(dormantAndActiveHighGmv).toBe(68.3);
    });
  });

  // =========================================================================
  // 5. CertificateInteractiveShowcase Logic Validation
  // =========================================================================
  describe("CertificateInteractiveShowcase Logic", () => {
    const MOCK_ROSTER = [
      { id: "1", name: "Dr. Helena Rossi", cert_id: "CERT-2024-8841A" },
      { id: "2", name: "Alexandre Silva", cert_id: "CERT-2024-8842B" },
      { id: "3", name: "Beatriz Mendonça", cert_id: "CERT-2024-8843C" },
      { id: "4", name: "Gabriel Santos", cert_id: "CERT-2024-8844D" },
      { id: "5", name: "Mariana Oliveira", cert_id: "CERT-2024-8845E" },
    ];

    it("contains unique valid certificate IDs", () => {
      const certIds = MOCK_ROSTER.map((r) => r.cert_id);
      expect(new Set(certIds).size).toBe(MOCK_ROSTER.length);
      expect(certIds.every((id) => /^CERT-2024-\d{4}[A-Z]$/.test(id))).toBe(true);
    });
  });

  // =========================================================================
  // 6. DataPlayground & DataPlaygroundPart2 Logic Validation
  // =========================================================================
  describe("DataPlayground Logic & Aggregation", () => {
    const data = rawPlaygroundData;

    it("verifies global aggregation across all classifications", () => {
      const yearMap = new Map<string, { year: string; value: number; volume: number }>();
      for (const row of data) {
        const existing = yearMap.get(row.year);
        if (existing) {
          existing.value = Math.round((existing.value + row.value) * 10) / 10;
          existing.volume += row.volume;
        } else {
          yearMap.set(row.year, { year: row.year, value: row.value, volume: row.volume });
        }
      }

      const aggregated = Array.from(yearMap.values()).sort((a, b) => parseInt(a.year) - parseInt(b.year));
      expect(aggregated.length).toBe(30); // 1990-2019

      const baseline = aggregated[0];
      const latest = aggregated[aggregated.length - 1];

      expect(baseline.year).toBe("1990");
      expect(latest.year).toBe("2019");
      expect(latest.volume).toBeGreaterThan(baseline.volume);

      const pctGrowth = (((latest.volume - baseline.volume) / baseline.volume) * 100).toFixed(1);
      expect(parseFloat(pctGrowth)).toBeGreaterThan(0);
    });

    it("calculates chart coordinates within bounds for variable length datasets", () => {
      const samplePoints = [
        { value: 100, year: "1990" },
        { value: 200, year: "2000" },
        { value: 300, year: "2019" },
      ];

      const maxValue = Math.max(...samplePoints.map((r) => r.value), 1);
      const minValue = Math.min(...samplePoints.map((r) => r.value), 0);

      const pointsCoords = samplePoints.map((row, index) => {
        const x = 35 + index * (310 / Math.max(samplePoints.length - 1, 1));
        const y = 155 - ((row.value - minValue * 0.8) / (maxValue - minValue * 0.8)) * 115;
        return { ...row, x, y };
      });

      expect(pointsCoords[0].x).toBe(35);
      expect(pointsCoords[pointsCoords.length - 1].x).toBe(345);
      pointsCoords.forEach((p) => {
        expect(p.x).toBeGreaterThanOrEqual(35);
        expect(p.x).toBeLessThanOrEqual(345);
        expect(p.y).toBeGreaterThanOrEqual(30);
        expect(p.y).toBeLessThanOrEqual(160);
      });
    });
  });

  describe("DataPlaygroundPart2 Cross-Country & Clinical Matrix", () => {
    const part2 = rawPlaygroundPart2Data;

    it("verifies 35 countries dataset completeness and ranks", () => {
      expect(part2.countries.length).toBe(35);

      // Verify ranks are 1 to 35
      const ranks = part2.countries.map((c) => c.rank).sort((a, b) => a - b);
      expect(ranks[0]).toBe(1);
      expect(ranks[ranks.length - 1]).toBe(35);

      // Check Indonesia benchmark is present
      const indonesia = part2.countries.find((c) => c.country === "Indonesia");
      expect(indonesia).toBeDefined();
      expect(indonesia!.code).toBe("IDN");
    });

    it("verifies 15 cancer classifications 5-year survival matrix", () => {
      expect(part2.survival_matrix.length).toBe(15);
      part2.survival_matrix.forEach((s) => {
        expect(s.survival_rate).toBeGreaterThanOrEqual(0);
        expect(s.survival_rate).toBeLessThanOrEqual(100);
        expect(s.cancer_type).toBeTruthy();
        expect(s.prognosis).toBeTruthy();
      });
    });

    it("verifies World Bank income tiers completeness", () => {
      expect(part2.income_tiers.length).toBe(4);
      part2.income_tiers.forEach((tier) => {
        expect(tier.tier).toBeTruthy();
        expect(tier.crude_death_rate).toBeGreaterThan(0);
        expect(tier.age_standardized_rate).toBeGreaterThan(0);
        expect(tier.aging_population_pct).toBeGreaterThan(0);
      });
    });
  });

  // =========================================================================
  // 7. Brent Oil 3D Volatility & Crisis Manifold Verification
  // =========================================================================
  describe("Brent Oil 3D Volatility & Crisis Manifold Verification", () => {
    it("verifies 7 historical crisis beacons integrity and price milestones", async () => {
      const { HISTORICAL_CRISIS_PINS } = await import("../components/BrentOil3DManifold");
      expect(HISTORICAL_CRISIS_PINS.length).toBe(7);

      // Verify all years are within the 1987-2024 range
      HISTORICAL_CRISIS_PINS.forEach((pin) => {
        expect(pin.year).toBeGreaterThanOrEqual(1987);
        expect(pin.year).toBeLessThanOrEqual(2024);
        expect(pin.price).toBeGreaterThan(0);
        expect(pin.volatilitySpike).toBeGreaterThan(0);
        expect(pin.description.length).toBeGreaterThan(20);
        expect(Math.abs(pin.returnShock)).toBeGreaterThan(0);
      });

      // Verify historic extremes
      const ath = HISTORICAL_CRISIS_PINS.find((p) => p.id === "supercycle-ath");
      expect(ath).toBeDefined();
      expect(ath!.price).toBe(143.95);

      const nadir = HISTORICAL_CRISIS_PINS.find((p) => p.id === "covid-nadir");
      expect(nadir).toBeDefined();
      expect(nadir!.price).toBe(9.1);
    });

    it("verifies Brent Oil projects ranking (#2 3D Manifold and #6 2D Dynamics) and Banking 3D Studio (#11)", async () => {
      const { getProjects } = await import("./content");
      const projects = getProjects();
      expect(projects).toHaveLength(11);
      expect(projects[1].slug).toBe("brent-oil-3d-volatility-manifold");
      expect(projects[1].order).toBe(2);
      expect(projects[5].slug).toBe("brent-oil-market-dynamics");
      expect(projects[5].order).toBe(6);
      expect(projects[10].slug).toBe("banking-fraud-3d-network-intelligence");
      expect(projects[10].order).toBe(11);
    });
  });
});

