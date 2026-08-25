import { describe, expect, it } from "vitest";
import {
  calculateTransactionFlags,
  computeDashboardAggregates,
  filterTransactions,
  generateSyntheticAntiFraudDataset,
  RawTransaction
} from "./anti-fraud";

describe("Banking Anti-Fraud Data Layer & SQL Rule-Based Flag Engine", () => {
  const baseSampleTx: RawTransaction = {
    transactionId: "TXN-TEST-1",
    accountId: "ACC-9999",
    transactionAmount: 100,
    transactionDate: "2023-06-15T10:30:00.000Z",
    transactionType: "Debit",
    location: "Jakarta",
    deviceId: "DEV-101",
    ipAddress: "192.168.1.1",
    merchantId: "MCH-01",
    channel: "Online",
    customerAge: 35,
    customerOccupation: "Engineer",
    transactionDuration: 60,
    loginAttempts: 1,
    accountBalance: 5000,
    previousTransactionDate: "2023-06-10T10:30:00.000Z"
  };

  it("evaluates clean transaction as Low Risk (0 flags, isFlagged = false)", () => {
    const flagged = calculateTransactionFlags(baseSampleTx, 150, false);
    expect(flagged.riskScore).toBe(0);
    expect(flagged.isFlagged).toBe(false);
    expect(flagged.riskLevel).toBe("Low");
    expect(flagged.flagReasons.length).toBe(0);
  });

  it("triggers flag_high_amount when amount exceeds 3.0x historical average", () => {
    const highAmountTx: RawTransaction = {
      ...baseSampleTx,
      transactionAmount: 480 // 480 > 3.0 * 150 (450)
    };
    const flagged = calculateTransactionFlags(highAmountTx, 150, false);
    expect(flagged.flagHighAmount).toBe(true);
    expect(flagged.riskScore).toBe(1);
    expect(flagged.isFlagged).toBe(false); // only 1 flag < 2
  });

  it("triggers flag_login_attempts when loginAttempts >= 3", () => {
    const failLoginTx: RawTransaction = {
      ...baseSampleTx,
      loginAttempts: 3
    };
    const flagged = calculateTransactionFlags(failLoginTx, 150, false);
    expect(flagged.flagLoginAttempts).toBe(true);
    expect(flagged.riskScore).toBe(1);
  });

  it("triggers flag_odd_hour when transaction occurs between 00:00 - 04:00 UTC", () => {
    const oddHourTx: RawTransaction = {
      ...baseSampleTx,
      transactionDate: "2023-06-15T02:15:00.000Z"
    };
    const flagged = calculateTransactionFlags(oddHourTx, 150, false);
    expect(flagged.flagOddHour).toBe(true);
    expect(flagged.riskScore).toBe(1);
  });

  it("triggers flag_rapid_succession when previous transaction was < 5 minutes ago", () => {
    const rapidTx: RawTransaction = {
      ...baseSampleTx,
      transactionDate: "2023-06-15T10:33:00.000Z",
      previousTransactionDate: "2023-06-15T10:30:00.000Z" // 3 mins difference
    };
    const flagged = calculateTransactionFlags(rapidTx, 150, false);
    expect(flagged.flagRapidSuccession).toBe(true);
    expect(flagged.riskScore).toBe(1);
  });

  it("triggers flag_balance_drain when transaction exceeds 70% of account balance", () => {
    const balanceDrainTx: RawTransaction = {
      ...baseSampleTx,
      transactionAmount: 800,
      accountBalance: 1000 // 800 > 70% of 1000 (700)
    };
    const flagged = calculateTransactionFlags(balanceDrainTx, 300, false);
    expect(flagged.flagBalanceDrain).toBe(true);
    expect(flagged.riskScore).toBe(1);
  });

  it("correctly elevates to Medium and High risk when multiple flags are triggered", () => {
    // 2 flags (High Amount + Odd Hour) -> Medium Risk, isFlagged = true
    const medTx: RawTransaction = {
      ...baseSampleTx,
      transactionAmount: 500, // > 3x 150
      transactionDate: "2023-06-15T03:00:00.000Z" // Odd hour
    };
    const flaggedMed = calculateTransactionFlags(medTx, 150, false);
    expect(flaggedMed.riskScore).toBe(2);
    expect(flaggedMed.isFlagged).toBe(true);
    expect(flaggedMed.riskLevel).toBe("Medium");

    // 4 flags (High Amount + Odd Hour + Logins + Balance Drain) -> High Risk
    const highTx: RawTransaction = {
      ...baseSampleTx,
      transactionAmount: 900,
      accountBalance: 1000,
      loginAttempts: 4,
      transactionDate: "2023-06-15T01:30:00.000Z"
    };
    const flaggedHigh = calculateTransactionFlags(highTx, 150, false);
    expect(flaggedHigh.riskScore).toBe(4);
    expect(flaggedHigh.isFlagged).toBe(true);
    expect(flaggedHigh.riskLevel).toBe("High");
  });

  it("generates 2,512 synthetic transactions matching Kaggle specifications", () => {
    const dataset = generateSyntheticAntiFraudDataset();
    expect(dataset.length).toBe(2512);

    const uniqueAccounts = new Set(dataset.map((t) => t.accountId));
    expect(uniqueAccounts.size).toBe(495);

    const flaggedCount = dataset.filter((t) => t.isFlagged).length;
    expect(flaggedCount).toBeGreaterThan(0);
    expect(flaggedCount).toBeLessThan(2512);
  });

  it("filters dataset accurately across multi-slicer dimensions", () => {
    const dataset = generateSyntheticAntiFraudDataset();

    // Filter by Channel
    const atmFiltered = filterTransactions(dataset, {
      dateRange: "ALL",
      channel: "ATM",
      transactionType: "ALL",
      occupation: "ALL",
      riskLevel: "ALL",
      searchQuery: ""
    });
    expect(atmFiltered.every((t) => t.channel === "ATM")).toBe(true);

    // Filter by High Risk
    const highRiskFiltered = filterTransactions(dataset, {
      dateRange: "ALL",
      channel: "ALL",
      transactionType: "ALL",
      occupation: "ALL",
      riskLevel: "High",
      searchQuery: ""
    });
    expect(highRiskFiltered.every((t) => t.riskLevel === "High")).toBe(true);

    // Search by AccountID
    const searchFiltered = filterTransactions(dataset, {
      dateRange: "ALL",
      channel: "ALL",
      transactionType: "ALL",
      occupation: "ALL",
      riskLevel: "ALL",
      searchQuery: "ACC-1005"
    });
    expect(searchFiltered.every((t) => t.accountId.includes("ACC-1005"))).toBe(true);
  });

  it("computes comprehensive 4-page dashboard aggregates accurately", () => {
    const dataset = generateSyntheticAntiFraudDataset();
    const aggs = computeDashboardAggregates(dataset);

    expect(aggs.totalTransactions).toBe(2512);
    expect(aggs.totalVolume).toBeGreaterThan(0);
    expect(aggs.fraudRate).toBeGreaterThan(0);
    expect(aggs.monthlyTrends.length).toBe(12);
    expect(aggs.channelMetrics.length).toBe(3);
    expect(aggs.occupationMetrics.length).toBe(4);
    expect(aggs.ageBinMetrics.length).toBe(6);
    expect(aggs.topRiskAccounts.length).toBeLessThanOrEqual(10);
    expect(aggs.topMerchants.length).toBeLessThanOrEqual(10);
  });
});
