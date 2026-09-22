import { describe, it, expect } from "vitest";
import {
  calculateDSCR,
  calculateDER,
  calculateCCR,
  calculateDepreciatedCCR,
  calculateBaselScore,
  getScoreCategory,
  calculateExpectedLoss,
  calculateMacroStressedPD,
  evaluateCreditApplication,
  CreditApplicationInput,
} from "./credit-risk";

describe("Heavy Equipment Credit Risk & Scorecard Engine", () => {
  describe("Financial Ratios (Capacity & Capital)", () => {
    it("computes DSCR accurately and respects division by zero", () => {
      // OCF IDR 320M, Debt Service IDR 251.62M -> 1.27x
      expect(calculateDSCR(320_000_000, 251_620_000)).toBe(1.27);
      expect(calculateDSCR(100_000_000, 0)).toBe(99.9);
      expect(calculateDSCR(100_000_000, 100_000_000)).toBe(1.0);
    });

    it("computes DER accurately and handles negative or zero equity safely", () => {
      // Total Liabilities 18.2B, Net Equity 14.5B -> 1.26x
      expect(calculateDER(18_200_000_000, 14_500_000_000)).toBe(1.26);
      expect(calculateDER(5_000_000_000, 0)).toBe(99.9);
    });
  });

  describe("Collateral Valuation & Depreciation (Collateral Coverage)", () => {
    it("computes initial CCR Day 0 accurately", () => {
      // 4 units @ IDR 1.5B = IDR 6B invoice, 20% DP -> Plafond IDR 4.8B
      // CCR Day 0 = 6.0B / 4.8B = 125.0%
      expect(calculateCCR(6_000_000_000, 4_800_000_000)).toBe(125.0);
    });

    it("tracks amortized equipment CCR over 12 and 24 months with 15% annual depreciation", () => {
      const initialValue = 6_000_000_000;
      const initialLoan = 4_800_000_000;
      const tenor = 36;

      const m12 = calculateDepreciatedCCR(initialValue, initialLoan, tenor, 12, 0.15);
      // After 1 year (15% dep): 6B * 0.85 = 5.1B
      // Loan remaining after 12/36: 4.8B * (24/36) = 3.2B
      // CCR = 5.1B / 3.2B = ~159.4%
      expect(m12.marketValue).toBe(5_100_000_000);
      expect(m12.remainingPrincipal).toBe(3_200_000_000);
      expect(m12.ccrPct).toBeGreaterThan(150.0);

      const m24 = calculateDepreciatedCCR(initialValue, initialLoan, tenor, 24, 0.15);
      expect(m24.ccrPct).toBeGreaterThan(m12.ccrPct);
    });
  });

  describe("Basel II Scorecard Point Scaling", () => {
    it("calibrates base score 600 at 50:1 odds (PD = 1/51 ~ 0.0196)", () => {
      const pd50to1 = 1.0 / (1.0 + 50.0); // ~0.0196078
      const score = calculateBaselScore(pd50to1, 20, 600, 50.0);
      expect(score).toBe(600);
    });

    it("increases by ~20 points when odds double (PDO = 20)", () => {
      const pd100to1 = 1.0 / (1.0 + 100.0);
      const scoreDoubled = calculateBaselScore(pd100to1, 20, 600, 50.0);
      expect(scoreDoubled).toBe(620);
    });

    it("strictly clamps credit score between 300 and 850", () => {
      expect(calculateBaselScore(0.000001)).toBeLessThanOrEqual(850);
      expect(calculateBaselScore(0.999999)).toBeGreaterThanOrEqual(300);
    });

    it("correctly maps scores to underwriting rating tiers", () => {
      expect(getScoreCategory(760).ratingTier).toBe("AAA");
      expect(getScoreCategory(760).recommendation).toBe("Auto-Approve");

      expect(getScoreCategory(710).ratingTier).toBe("AA");
      expect(getScoreCategory(710).recommendation).toBe("Approve (Standard)");

      expect(getScoreCategory(640).ratingTier).toBe("A");
      expect(getScoreCategory(640).recommendation).toBe("Conditional Approval");

      expect(getScoreCategory(580).ratingTier).toBe("BBB");
      expect(getScoreCategory(580).recommendation).toBe("High Risk (Watchlist)");

      expect(getScoreCategory(480).ratingTier).toBe("REJECT");
      expect(getScoreCategory(480).recommendation).toBe("Decline");
    });
  });

  describe("IFRS 9 Expected Loss & Macro Overlay", () => {
    it("calculates Expected Loss: EL = PD * LGD * EAD", () => {
      const pd = 0.02; // 2%
      const lgd = 0.25; // 25% for Excavator
      const ead = 4_800_000_000;
      expect(calculateExpectedLoss(pd, lgd, ead)).toBe(24_000_000);
    });

    it("amplifies PD under negative commodity price shock in mining sector", () => {
      const basePd = 0.02;
      const stressedPd = calculateMacroStressedPD(basePd, "mining", -20);
      expect(stressedPd).toBeGreaterThan(basePd);
      // Mining elasticity is highest
      const constructionPd = calculateMacroStressedPD(basePd, "construction", -20);
      expect(stressedPd).toBeGreaterThan(constructionPd);
    });
  });

  describe("End-to-End 5C Application Evaluation", () => {
    it("evaluates a prime mining contractor application", () => {
      const app: CreditApplicationInput = {
        companyName: "PT Nusantara Mining Logistik",
        sector: "mining",
        equipmentType: "excavator_20t",
        unitCount: 4,
        unitPriceIdr: 1_500_000_000,
        downPaymentPct: 20,
        tenorMonths: 36,
        interestRateAnnualPct: 10.75,
        monthlyOperatingRevenueIdr: 1_450_000_000,
        monthlyOperatingExpenseIdr: 1_130_000_000,
        existingMonthlyDebtServiceIdr: 95_000_000,
        totalAssetsIdr: 32_700_000_000,
        totalLiabilitiesIdr: 18_200_000_000,
        pastDelinquencyCodesCount: 0,
        hasSevereDelinquency: false,
        hbaCommodityShockPct: 0,
      };

      const result = evaluateCreditApplication(app);

      expect(result.isDscrCompliant).toBe(true);
      expect(result.isDerCompliant).toBe(true);
      expect(result.isCcrCompliant).toBe(true);
      expect(result.score).toBeGreaterThanOrEqual(680);
      expect(["AAA", "AA"]).toContain(result.ratingTier);
      expect(result.eadIdr).toBe(4_800_000_000);
      expect(result.expectedLossIdr).toBeGreaterThan(0);
    });

    it("penalizes delinquent applicant with low score and Decline recommendation", () => {
      const app: CreditApplicationInput = {
        companyName: "PT Gagal Bayar",
        sector: "mining",
        equipmentType: "bulldozer",
        unitCount: 2,
        unitPriceIdr: 2_000_000_000,
        downPaymentPct: 10,
        tenorMonths: 36,
        interestRateAnnualPct: 12.0,
        monthlyOperatingRevenueIdr: 200_000_000,
        monthlyOperatingExpenseIdr: 180_000_000,
        existingMonthlyDebtServiceIdr: 150_000_000,
        totalAssetsIdr: 1_000_000_000,
        totalLiabilitiesIdr: 5_000_000_000,
        pastDelinquencyCodesCount: 4,
        hasSevereDelinquency: true, // 90+ DPD
        hbaCommodityShockPct: -25,
      };

      const result = evaluateCreditApplication(app);
      expect(result.isDscrCompliant).toBe(false);
      expect(result.isDerCompliant).toBe(false);
      expect(result.score).toBeLessThan(550);
      expect(result.recommendation).toBe("Decline");
    });
  });
});
