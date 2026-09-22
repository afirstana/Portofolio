/**
 * credit-risk.ts
 * Heavy Equipment Credit Risk Analytics & Basel II Scorecard Calculation Engine
 * 
 * Standards:
 * - OJK POJK No. 35/POJK.05/2018 (Prinsip Kehati-hatian Pembiayaan)
 * - Basel II / IFRS 9 Expected Loss Framework (EL = PD x LGD x EAD)
 * - Scorecard Scaling: PDO 20, Base 600 at 50:1 Odds
 */

export interface CreditApplicationInput {
  companyName: string;
  sector: "mining" | "plantation" | "construction";
  equipmentType: "excavator_20t" | "dump_truck" | "bulldozer" | "wheel_loader";
  unitCount: number;
  unitPriceIdr: number;
  downPaymentPct: number; // e.g. 20 (for 20%)
  tenorMonths: number; // e.g. 36
  interestRateAnnualPct: number; // e.g. 10.75%
  monthlyOperatingRevenueIdr: number;
  monthlyOperatingExpenseIdr: number;
  existingMonthlyDebtServiceIdr: number;
  totalAssetsIdr: number;
  totalLiabilitiesIdr: number;
  pastDelinquencyCodesCount: number; // 30-59 DPD
  hasSevereDelinquency: boolean; // 90+ DPD or error code 96/98
  hbaCommodityShockPct: number; // 0 = baseline, -20 = 20% decline
}

export interface CreditScorecardDetails {
  score: number;
  ratingTier: "AAA" | "AA" | "A" | "BBB" | "REJECT";
  recommendation: "Auto-Approve" | "Approve (Standard)" | "Conditional Approval" | "High Risk (Watchlist)" | "Decline";
  baselinePdPct: number;
  stressedPdPct: number;
  lgdPct: number;
  eadIdr: number;
  expectedLossIdr: number;
  elRatioPct: number;
  dscr: number;
  der: number;
  ccrDay0Pct: number;
  ccrMonth12Pct: number;
  ccrMonth24Pct: number;
  isDscrCompliant: boolean;
  isDerCompliant: boolean;
  isCcrCompliant: boolean;
}

/**
 * 1. Debt Service Coverage Ratio (Capacity)
 * Target: >= 1.15x
 */
export function calculateDSCR(netOperatingCashFlow: number, totalDebtService: number): number {
  if (totalDebtService <= 0) return 99.9;
  return Number((netOperatingCashFlow / totalDebtService).toFixed(2));
}

/**
 * 2. Debt to Equity Ratio (Capital)
 * Target: <= 2.00x
 */
export function calculateDER(totalLiabilities: number, totalEquity: number): number {
  if (totalEquity <= 0) return 99.9;
  return Number((totalLiabilities / totalEquity).toFixed(2));
}

/**
 * 3. Collateral Coverage Ratio (Collateral)
 * Target: >= 120% at origination (Day 0)
 */
export function calculateCCR(appraisedMarketValue: number, loanExposure: number): number {
  if (loanExposure <= 0) return 999.0;
  return Number(((appraisedMarketValue / loanExposure) * 100).toFixed(1));
}

/**
 * Equipment Depreciation & Amortization Collateral Tracking
 * Standard heavy equipment depreciation: 15% - 20% annual declining balance.
 */
export function calculateDepreciatedCCR(
  initialMarketValue: number,
  initialLoanAmount: number,
  tenorMonths: number,
  month: number,
  annualDepreciationRate: number = 0.15
): { marketValue: number; remainingPrincipal: number; ccrPct: number } {
  const years = month / 12;
  const marketValue = initialMarketValue * Math.pow(1 - annualDepreciationRate, years);
  
  // Straight-line / linear principal reduction proxy
  const principalPaidRatio = Math.min(month / tenorMonths, 1.0);
  const remainingPrincipal = Math.max(initialLoanAmount * (1 - principalPaidRatio), 1);
  const ccrPct = Number(((marketValue / remainingPrincipal) * 100).toFixed(1));
  
  return {
    marketValue: Math.round(marketValue),
    remainingPrincipal: Math.round(remainingPrincipal),
    ccrPct,
  };
}

/**
 * Basel II Scorecard Point Scaling
 * Formula: Score = Offset + Factor * ln((1 - PD) / PD)
 * Factor = PDO / ln(2)
 * Offset = BaseScore - Factor * ln(BaseOdds)
 * For PDO=20, Base=600 at 50:1:
 * Factor = 28.85390082, Offset = 487.1229
 */
export function calculateBaselScore(
  pd: number,
  pdo: number = 20,
  baseScore: number = 600,
  baseOdds: number = 50.0
): number {
  const factor = pdo / Math.log(2.0);
  const offset = baseScore - factor * Math.log(baseOdds);
  
  // Bound PD to avoid -Infinity / NaN
  const clampedPd = Math.min(Math.max(pd, 0.0001), 0.9999);
  const odds = (1.0 - clampedPd) / clampedPd;
  const rawScore = offset + factor * Math.log(odds);
  
  return Math.min(Math.max(Math.round(rawScore), 300), 850);
}

/**
 * Rating Tier & Underwriting Decision Matrix
 */
export function getScoreCategory(score: number): {
  ratingTier: "AAA" | "AA" | "A" | "BBB" | "REJECT";
  recommendation: "Auto-Approve" | "Approve (Standard)" | "Conditional Approval" | "High Risk (Watchlist)" | "Decline";
  maxLtvPct: number;
  minDpPct: number;
  color: string;
} {
  if (score >= 750) {
    return {
      ratingTier: "AAA",
      recommendation: "Auto-Approve",
      maxLtvPct: 85,
      minDpPct: 15,
      color: "#10b981", // Emerald
    };
  } else if (score >= 680) {
    return {
      ratingTier: "AA",
      recommendation: "Approve (Standard)",
      maxLtvPct: 80,
      minDpPct: 20,
      color: "#3b82f6", // Blue
    };
  } else if (score >= 620) {
    return {
      ratingTier: "A",
      recommendation: "Conditional Approval",
      maxLtvPct: 75,
      minDpPct: 25,
      color: "#f59e0b", // Amber
    };
  } else if (score >= 550) {
    return {
      ratingTier: "BBB",
      recommendation: "High Risk (Watchlist)",
      maxLtvPct: 65,
      minDpPct: 35,
      color: "#f97316", // Orange
    };
  } else {
    return {
      ratingTier: "REJECT",
      recommendation: "Decline",
      maxLtvPct: 0,
      minDpPct: 50,
      color: "#ef4444", // Red
    };
  }
}

/**
 * Expected Loss (IFRS 9 / Basel II): EL = PD * LGD * EAD
 */
export function calculateExpectedLoss(pd: number, lgd: number, ead: number): number {
  return Math.round(pd * lgd * ead);
}

/**
 * Macroeconomic Sensitivity Overlay (Commodity Price Shock vs Contractor Cashflow)
 * - Mining elasticity to HBA: ~1.75x under -20% commodity drop
 * - Plantation elasticity: ~1.40x
 * - Construction elasticity: ~1.30x
 */
export function calculateMacroStressedPD(
  baselinePd: number,
  sector: "mining" | "plantation" | "construction",
  hbaShockPct: number // e.g. -20 for 20% decline
): number {
  if (hbaShockPct >= 0) return baselinePd;
  
  const absShock = Math.abs(hbaShockPct) / 100.0;
  let elasticity = 1.30;
  if (sector === "mining") elasticity = 1.75;
  else if (sector === "plantation") elasticity = 1.40;
  
  const multiplier = 1.0 + (absShock * (elasticity - 1.0) * 2.5);
  return Math.min(Number((baselinePd * multiplier).toFixed(4)), 0.50);
}

/**
 * Equipment Loss Given Default (LGD) Haircut Matrix
 * Based on secondary market asset liquidity in Indonesia
 */
export function getEquipmentLGD(equipmentType: CreditApplicationInput["equipmentType"]): number {
  switch (equipmentType) {
    case "excavator_20t":
      return 0.25; // 25% LGD (High liquidity, high demand)
    case "dump_truck":
      return 0.35; // 35% LGD (Moderate wear & tear)
    case "wheel_loader":
      return 0.30; // 30% LGD (Standard agro/industrial)
    case "bulldozer":
      return 0.35; // 35% LGD (Heavy component wear)
    default:
      return 0.30;
  }
}

/**
 * Comprehensive 5C Underwriting Evaluator
 */
export function evaluateCreditApplication(input: CreditApplicationInput): CreditScorecardDetails {
  const totalInvoice = input.unitCount * input.unitPriceIdr;
  const downPaymentIdr = totalInvoice * (input.downPaymentPct / 100);
  const loanPrincipal = totalInvoice - downPaymentIdr;
  
  // Monthly payment calculation (Standard Annuity / Flat Amortization proxy)
  const monthlyRate = (input.interestRateAnnualPct / 100) / 12;
  const monthlyPayment = (loanPrincipal * (1 + monthlyRate * input.tenorMonths)) / input.tenorMonths;
  
  // Capacity: DSCR
  const netOperatingCashFlow = input.monthlyOperatingRevenueIdr - input.monthlyOperatingExpenseIdr;
  const totalMonthlyDebtService = input.existingMonthlyDebtServiceIdr + monthlyPayment;
  const dscr = calculateDSCR(netOperatingCashFlow, totalMonthlyDebtService);
  
  // Capital: DER
  const totalPostLiabilities = input.totalLiabilitiesIdr + loanPrincipal;
  const netEquity = Math.max(input.totalAssetsIdr - input.totalLiabilitiesIdr, 1);
  const der = calculateDER(totalPostLiabilities, netEquity);
  
  // Collateral: CCR Day 0, Month 12, Month 24
  const ccrDay0Pct = calculateCCR(totalInvoice, loanPrincipal);
  const ccrM12 = calculateDepreciatedCCR(totalInvoice, loanPrincipal, input.tenorMonths, 12);
  const ccrM24 = calculateDepreciatedCCR(totalInvoice, loanPrincipal, input.tenorMonths, 24);
  
  // Additive Basel II Scorecard Point Engine (300 - 850 range)
  let scorePoints = 550; // Base score

  // 1. Character: Delinquency History
  if (input.hasSevereDelinquency) {
    scorePoints -= 150;
  } else if (input.pastDelinquencyCodesCount === 0) {
    scorePoints += 110;
  } else if (input.pastDelinquencyCodesCount === 1) {
    scorePoints += 25;
  } else {
    scorePoints -= 45;
  }

  // 2. Capacity: DSCR
  if (dscr >= 1.50) {
    scorePoints += 50;
  } else if (dscr >= 1.25) {
    scorePoints += 35;
  } else if (dscr >= 1.15) {
    scorePoints += 15;
  } else if (dscr >= 1.00) {
    scorePoints -= 35;
  } else {
    scorePoints -= 85;
  }

  // 3. Capital: DER
  if (der <= 1.00) {
    scorePoints += 35;
  } else if (der <= 1.50) {
    scorePoints += 20;
  } else if (der <= 2.00) {
    scorePoints += 10;
  } else if (der <= 2.50) {
    scorePoints -= 25;
  } else {
    scorePoints -= 50;
  }

  // 4. Collateral: Initial CCR Day 0 & Down Payment
  if (ccrDay0Pct >= 140) {
    scorePoints += 25;
  } else if (ccrDay0Pct >= 125) {
    scorePoints += 15;
  } else if (ccrDay0Pct < 115) {
    scorePoints -= 25;
  }

  if (input.downPaymentPct >= 25) {
    scorePoints += 15;
  } else if (input.downPaymentPct >= 20) {
    scorePoints += 5;
  } else {
    scorePoints -= 20;
  }

  // 5. Condition: Macroeconomic & Sector Shock
  if (input.hbaCommodityShockPct < 0) {
    const shockAbs = Math.abs(input.hbaCommodityShockPct);
    const sectorSensitivity = input.sector === "mining" ? 1.8 : input.sector === "plantation" ? 1.4 : 1.1;
    scorePoints -= Math.round(shockAbs * sectorSensitivity * 1.2);
  }

  const score = Math.min(Math.max(scorePoints, 300), 850);
  const tierInfo = getScoreCategory(score);

  // Deriving Calibrated PD from Scorecard Basel Formula:
  // Score = Offset + Factor * ln(Odds) => Odds = exp((Score - Offset) / Factor) => PD = 1 / (1 + Odds)
  const factor = 20 / Math.log(2.0); // 28.8539
  const offset = 600 - factor * Math.log(50.0); // 487.1229
  const logOdds = (score - offset) / factor;
  const odds = Math.exp(Math.min(Math.max(logOdds, -10), 10));
  const stressedPd = Number((1.0 / (1.0 + odds)).toFixed(4));
  const basePd = Number(Math.min(stressedPd * 0.85, 0.40).toFixed(4));

  // Loss metrics
  const lgd = getEquipmentLGD(input.equipmentType);
  const ead = loanPrincipal;
  const expectedLoss = calculateExpectedLoss(stressedPd, lgd, ead);
  const elRatioPct = Number(((expectedLoss / ead) * 100).toFixed(3));
  
  return {
    score,
    ratingTier: tierInfo.ratingTier,
    recommendation: tierInfo.recommendation,
    baselinePdPct: Number((basePd * 100).toFixed(2)),
    stressedPdPct: Number((stressedPd * 100).toFixed(2)),
    lgdPct: Number((lgd * 100).toFixed(1)),
    eadIdr: ead,
    expectedLossIdr: expectedLoss,
    elRatioPct,
    dscr,
    der,
    ccrDay0Pct,
    ccrMonth12Pct: ccrM12.ccrPct,
    ccrMonth24Pct: ccrM24.ccrPct,
    isDscrCompliant: dscr >= 1.15,
    isDerCompliant: der <= 2.00,
    isCcrCompliant: ccrDay0Pct >= 120.0,
  };
}
