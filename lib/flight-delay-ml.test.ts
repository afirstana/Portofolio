import { describe, it, expect } from "vitest";
import {
  predictFlightDelay,
  calculateThresholdEconomics,
  getMetadata,
  CARRIER_NAMES,
  HUB_NAMES,
} from "./flight-delay-ml";

describe("Flight Delay ML Predictive Engine & Inference Engine", () => {
  describe("Metadata Integrity & Tournament Benchmarks", () => {
    it("loads valid census-backed metadata with top carriers and hubs", () => {
      const meta = getMetadata();
      expect(meta.dataset_census_year).toBe(2024);
      expect(meta.top_carriers).toContain("UA");
      expect(meta.top_carriers).toContain("DL");
      expect(meta.top_carriers).toContain("AA");
      expect(meta.top_hubs).toContain("ORD");
      expect(meta.top_hubs).toContain("JFK");
      expect(meta.top_hubs).toContain("ATL");
    });

    it("confirms all tournament models beat random baseline (ROC-AUC > 0.60)", () => {
      const meta = getMetadata();
      const lr = meta.models_eval["Logistic Regression"];
      const rf = meta.models_eval["Random Forest"];
      const hgb = meta.models_eval["HistGradientBoosting"];

      expect(lr.roc_auc).toBeGreaterThan(0.6);
      expect(rf.roc_auc).toBeGreaterThan(0.61);
      expect(hgb.roc_auc).toBeGreaterThan(0.61);
    });

    it("verifies carrier and hub name dictionaries cover all codes", () => {
      const meta = getMetadata();
      for (const c of meta.top_carriers) {
        expect(CARRIER_NAMES[c as keyof typeof CARRIER_NAMES]).toBeDefined();
      }
      for (const h of meta.top_hubs) {
        expect(HUB_NAMES[h as keyof typeof HUB_NAMES]).toBeDefined();
      }
    });
  });

  describe("predictFlightDelay (Zero-Leakage Real-Time Inference)", () => {
    it("outputs well-bounded probability strictly within [0.04, 0.95]", () => {
      const result = predictFlightDelay({
        carrier: "DL",
        origin: "ATL",
        dest: "LAX",
        depHour: 8,
        congestionLevel: "nominal",
      });

      expect(result.probability).toBeGreaterThanOrEqual(0.04);
      expect(result.probability).toBeLessThanOrEqual(0.95);
      expect(result.probabilityPct).toBe(Number((result.probability * 100).toFixed(1)));
    });

    it("demonstrates diurnal evening compounding: 18:00 has strictly higher delay risk than 06:00", () => {
      const morningFlight = predictFlightDelay({
        carrier: "UA",
        origin: "ORD",
        dest: "SFO",
        depHour: 6,
        congestionLevel: "nominal",
      });

      const eveningFlight = predictFlightDelay({
        carrier: "UA",
        origin: "ORD",
        dest: "SFO",
        depHour: 18,
        congestionLevel: "nominal",
      });

      expect(eveningFlight.probability).toBeGreaterThan(morningFlight.probability);
    });

    it("demonstrates ground congestion impact: severe congestion yields higher risk than nominal", () => {
      const nominalFlight = predictFlightDelay({
        carrier: "AA",
        origin: "DFW",
        dest: "ORD",
        depHour: 14,
        congestionLevel: "nominal",
      });

      const severeFlight = predictFlightDelay({
        carrier: "AA",
        origin: "DFW",
        dest: "ORD",
        depHour: 14,
        congestionLevel: "severe",
      });

      expect(severeFlight.probability).toBeGreaterThan(nominalFlight.probability);
    });

    it("produces valid severity probabilities that sum to approximately 1.0", () => {
      const res = predictFlightDelay({
        carrier: "B6",
        origin: "JFK",
        dest: "MCO",
        depHour: 17,
        congestionLevel: "elevated",
      });

      const sum =
        res.severityProbabilities.onTime +
        res.severityProbabilities.minor +
        res.severityProbabilities.moderate +
        res.severityProbabilities.severe;

      expect(sum).toBeCloseTo(1.0, 1);
    });

    it("generates local SHAP waterfall with proper factor sorting and attributes", () => {
      const res = predictFlightDelay({
        carrier: "NK",
        origin: "ORD",
        dest: "LAS",
        depHour: 19,
        congestionLevel: "severe",
      });

      expect(res.shapWaterfall.length).toBeGreaterThanOrEqual(4);
      // Ensure sorted by descending absolute impact
      for (let i = 0; i < res.shapWaterfall.length - 1; i++) {
        expect(Math.abs(res.shapWaterfall[i].impactPct)).toBeGreaterThanOrEqual(
          Math.abs(res.shapWaterfall[i + 1].impactPct)
        );
      }
    });

    it("assigns actionable dispatch mitigations scaled to risk tier", () => {
      const lowRisk = predictFlightDelay({
        carrier: "DL",
        origin: "ATL",
        dest: "SLC" as any,
        depHour: 5,
        congestionLevel: "nominal",
      });
      expect(lowRisk.dispatchMitigation.expectedSavingsMinutes).toBe(0);

      const highRisk = predictFlightDelay({
        carrier: "AA",
        origin: "DFW",
        dest: "ORD",
        depHour: 19,
        congestionLevel: "severe",
      });
      expect(highRisk.dispatchMitigation.expectedSavingsMinutes).toBeGreaterThan(20);
    });
  });

  describe("calculateThresholdEconomics (Dynamic Cost-Benefit Calculus)", () => {
    it("computes baseline naive cost based on unmitigated delays", () => {
      const econ = calculateThresholdEconomics({
        threshold: 0.2,
        costFalseNegative: 4200,
        costFalsePositive: 800,
      });

      // 9,860 delays * $4,200 = $41,412,000
      expect(econ.baselineNaiveCost).toBe(9860 * 4200);
      expect(econ.curve.length).toBeGreaterThan(10);
    });

    it("proves high FN cost pulls optimal threshold lower (more aggressive alerting)", () => {
      const legacyCarrier = calculateThresholdEconomics({
        threshold: 0.25,
        costFalseNegative: 6000, // High cost of missed connection & crew overtime
        costFalsePositive: 600,
      });

      expect(legacyCarrier.optimalThreshold).toBeLessThanOrEqual(0.25);
      expect(legacyCarrier.optimalSavings).toBeGreaterThan(0);
    });

    it("proves high FP cost shifts optimal threshold higher (conservative alerting to avoid over-buffering)", () => {
      const lccCarrier = calculateThresholdEconomics({
        threshold: 0.35,
        costFalseNegative: 2000,
        costFalsePositive: 2500, // High cost of wasted fuel / holding gates
      });

      expect(lccCarrier.optimalThreshold).toBeGreaterThanOrEqual(0.25);
    });
  });
});
