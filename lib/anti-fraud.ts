/**
 * Banking Transaction Anti-Fraud Analytics Engine & Data Models
 * Strictly adheres to `dashboard-spec-anti-fraud.md`
 * Dataset: bank_transactions_data_2.csv (2,512 transactions, 495 accounts, 100 merchants, 43 cities)
 * Language Standard: 100% English
 */

export interface RawTransaction {
  transactionId: string;
  accountId: string;
  transactionAmount: number;
  transactionDate: string; // ISO string
  transactionType: "Debit" | "Credit";
  location: string;
  deviceId: string;
  ipAddress: string;
  merchantId: string;
  channel: "ATM" | "Branch" | "Online";
  customerAge: number;
  customerOccupation: "Student" | "Doctor" | "Engineer" | "Retired";
  transactionDuration: number; // in seconds (10 - 300)
  loginAttempts: number; // 1 to 5
  accountBalance: number;
  previousTransactionDate: string; // ISO string
}

export interface FlaggedTransaction extends RawTransaction {
  avgHistoricalAmount: number;
  flagHighAmount: boolean;
  flagLoginAttempts: boolean;
  flagOddHour: boolean;
  flagRapidSuccession: boolean;
  flagNewDeviceLocation: boolean;
  flagBalanceDrain: boolean;
  riskScore: number; // 0 to 6
  isFlagged: boolean; // riskScore >= 2
  riskLevel: "Low" | "Medium" | "High";
  flagReasons: string[];
  flagReasonSummary: string;
}

export interface FilterState {
  dateRange: "ALL" | "Q1" | "Q2" | "Q3" | "Q4";
  channel: "ALL" | "ATM" | "Branch" | "Online";
  transactionType: "ALL" | "Debit" | "Credit";
  occupation: "ALL" | "Student" | "Doctor" | "Engineer" | "Retired";
  riskLevel: "ALL" | "Low" | "Medium" | "High";
  searchQuery: string;
  minRiskScore?: number;
  activeFlagFilter?: string;
}

export interface CityGeographicSummary {
  city: string;
  totalTransactions: number;
  flaggedTransactions: number;
  fraudRate: number;
  totalAmount: number;
  lat: number;
  lng: number;
}

export interface MonthlyTrendData {
  month: string;
  label: string;
  totalTransactions: number;
  flaggedTransactions: number;
  fraudRate: number;
  totalAmount: number;
  flaggedAmount: number;
}

export interface ChannelMetric {
  channel: "ATM" | "Branch" | "Online";
  total: number;
  flagged: number;
  fraudRate: number;
  totalVolume: number;
  flaggedVolume: number;
  avgDuration: number;
  flaggedDuration: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
}

export interface OccupationMetric {
  occupation: "Student" | "Doctor" | "Engineer" | "Retired";
  total: number;
  flagged: number;
  fraudRate: number;
  avgAmount: number;
}

export interface AgeBinMetric {
  bin: "18-25" | "26-35" | "36-45" | "46-55" | "56-65" | "66+";
  total: number;
  flagged: number;
  fraudRate: number;
}

export interface MerchantRiskMetric {
  merchantId: string;
  total: number;
  flagged: number;
  fraudRate: number;
  exposureAmount: number;
}

export interface AccountRiskPriority {
  accountId: string;
  flaggedCount: number;
  totalRiskScore: number;
  totalVolume: number;
  maxRiskScore: number;
  customerOccupation: string;
}

// 43 Metropolitan Cities with Geographic Map Coordinates
export const CITIES_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Jakarta": { lat: -6.2088, lng: 106.8456 },
  "Surabaya": { lat: -7.2575, lng: 112.7521 },
  "Bandung": { lat: -6.9175, lng: 107.6191 },
  "Medan": { lat: 3.5952, lng: 98.6722 },
  "Semarang": { lat: -6.9667, lng: 110.4167 },
  "Makassar": { lat: -5.1477, lng: 119.4327 },
  "Palembang": { lat: -2.9761, lng: 104.7754 },
  "Tangerang": { lat: -6.1783, lng: 106.6319 },
  "Depok": { lat: -6.4025, lng: 106.7942 },
  "Bekasi": { lat: -6.2383, lng: 106.9756 },
  "Yogyakarta": { lat: -7.7956, lng: 110.3695 },
  "Malang": { lat: -7.9666, lng: 112.6326 },
  "Surakarta": { lat: -7.5755, lng: 110.8243 },
  "Denpasar": { lat: -8.6705, lng: 115.2126 },
  "Batam": { lat: 1.1301, lng: 104.0529 },
  "Pekanbaru": { lat: 0.5071, lng: 101.4478 },
  "Bandar Lampung": { lat: -5.4500, lng: 105.2667 },
  "Padang": { lat: -0.9471, lng: 100.4172 },
  "Pontianak": { lat: -0.0263, lng: 109.3425 },
  "Banjarmasin": { lat: -3.3194, lng: 114.5908 },
  "Balikpapan": { lat: -1.2379, lng: 116.8529 },
  "Samarinda": { lat: -0.5022, lng: 117.1536 },
  "Manado": { lat: 1.4748, lng: 124.8428 },
  "Mataram": { lat: -8.5833, lng: 116.1167 },
  "Kupang": { lat: -10.1772, lng: 123.6070 },
  "Ambon": { lat: -3.6547, lng: 128.1906 },
  "Jayapura": { lat: -2.5916, lng: 140.6690 },
  "Cirebon": { lat: -6.7320, lng: 108.5523 },
  "Sukabumi": { lat: -6.9277, lng: 106.9300 },
  "Tasikmalaya": { lat: -7.3196, lng: 108.2201 },
  "Pekalongan": { lat: -6.8886, lng: 109.6753 },
  "Tegal": { lat: -6.8694, lng: 109.1402 },
  "Magelang": { lat: -7.4706, lng: 110.2178 },
  "Kediri": { lat: -7.8480, lng: 112.0178 },
  "Blitar": { lat: -8.0954, lng: 112.1609 },
  "Madiun": { lat: -7.6298, lng: 111.5239 },
  "Probolinggo": { lat: -7.7543, lng: 113.2159 },
  "Pasuruan": { lat: -7.6453, lng: 112.9075 },
  "Batu": { lat: -7.8671, lng: 112.5239 },
  "Cilegon": { lat: -6.0022, lng: 106.0125 },
  "Serang": { lat: -6.1104, lng: 106.1640 },
  "Singkawang": { lat: 0.9080, lng: 108.9860 },
  "Pangkal Pinang": { lat: -2.1333, lng: 106.1167 }
};

/**
 * 8 SQL Rule-Based Flag Computations
 */
export function calculateTransactionFlags(
  tx: RawTransaction,
  avgHistoricalAmount: number,
  isFirstSeenDeviceLocation: boolean
): FlaggedTransaction {
  // 1. flag_high_amount: TransactionAmount > 3.0 * historical avg
  const flagHighAmount = avgHistoricalAmount > 0 && tx.transactionAmount > 3.0 * avgHistoricalAmount;

  // 2. flag_login_attempts: LoginAttempts >= 3
  const flagLoginAttempts = tx.loginAttempts >= 3;

  // 3. flag_odd_hour: Transaction hour between 00:00 - 04:00
  const txHour = new Date(tx.transactionDate).getUTCHours();
  const flagOddHour = txHour >= 0 && txHour <= 4;

  // 4. flag_rapid_succession: Date diff < 5 minutes
  const currentTs = new Date(tx.transactionDate).getTime();
  const prevTs = new Date(tx.previousTransactionDate).getTime();
  const diffMinutes = Math.abs(currentTs - prevTs) / (1000 * 60);
  const flagRapidSuccession = diffMinutes > 0 && diffMinutes < 5;

  // 5. flag_new_device_location: Combination never seen before for account
  const flagNewDeviceLocation = isFirstSeenDeviceLocation;

  // 6. flag_balance_drain: TransactionAmount > 70% of AccountBalance
  const flagBalanceDrain = tx.accountBalance > 0 && tx.transactionAmount > 0.7 * tx.accountBalance;

  // 7. risk_score: total sum of active flags (0 to 6)
  const activeFlagsList: string[] = [];
  if (flagHighAmount) activeFlagsList.push("High Amount (>3x Avg)");
  if (flagLoginAttempts) activeFlagsList.push("Failed Logins (>=3)");
  if (flagOddHour) activeFlagsList.push("Odd Hour (00-04 UTC)");
  if (flagRapidSuccession) activeFlagsList.push("Rapid Succession (<5m)");
  if (flagNewDeviceLocation) activeFlagsList.push("New Device/Location");
  if (flagBalanceDrain) activeFlagsList.push("Balance Drain (>70%)");

  const riskScore = activeFlagsList.length;

  // 8. is_flagged: TRUE if riskScore >= 2
  const isFlagged = riskScore >= 2;

  let riskLevel: "Low" | "Medium" | "High" = "Low";
  if (riskScore >= 4) {
    riskLevel = "High";
  } else if (riskScore >= 2) {
    riskLevel = "Medium";
  }

  return {
    ...tx,
    avgHistoricalAmount,
    flagHighAmount,
    flagLoginAttempts,
    flagOddHour,
    flagRapidSuccession,
    flagNewDeviceLocation,
    flagBalanceDrain,
    riskScore,
    isFlagged,
    riskLevel,
    flagReasons: activeFlagsList,
    flagReasonSummary: activeFlagsList.length > 0 ? activeFlagsList.join(", ") : "Clean Baseline"
  };
}

/**
 * Deterministic Synthetic Data Generator matching Kaggle dataset profile
 * (2,512 transactions, 495 accounts, 100 merchants, 43 cities)
 */
export function generateSyntheticAntiFraudDataset(): FlaggedTransaction[] {
  const cityKeys = Object.keys(CITIES_COORDINATES);
  const occupations: Array<"Student" | "Doctor" | "Engineer" | "Retired"> = [
    "Student", "Doctor", "Engineer", "Retired"
  ];
  const channels: Array<"ATM" | "Branch" | "Online"> = ["ATM", "Branch", "Online"];

  const transactions: FlaggedTransaction[] = [];
  const TOTAL_ROWS = 2512;
  const TOTAL_ACCOUNTS = 495;

  // Pre-generate historical baseline for 495 accounts
  const accountBaselines: Record<string, { avgAmount: number; occupation: "Student" | "Doctor" | "Engineer" | "Retired"; age: number }> = {};
  for (let accIdx = 1; accIdx <= TOTAL_ACCOUNTS; accIdx++) {
    const accId = `ACC-${1000 + accIdx}`;
    // Average amount between 150 - 450
    const avgAmount = 150 + ((accIdx * 37) % 300);
    const occ = occupations[accIdx % 4];
    const age = 18 + ((accIdx * 13) % 62);
    accountBaselines[accId] = { avgAmount, occupation: occ, age };
  }

  // Generate 2,512 rows across Jan 2023 - Jan 2024
  for (let i = 1; i <= TOTAL_ROWS; i++) {
    const txId = `TXN-${100000 + i}`;
    const accNum = i <= TOTAL_ACCOUNTS ? i : (1 + ((i * 17 + (i % 13)) % TOTAL_ACCOUNTS));
    const accId = `ACC-${1000 + accNum}`;
    const base = accountBaselines[accId];

    // Timestamp calculation across 2023
    const dayOfYear = (i * 3 + (i % 7)) % 365;
    const hour = (i * 7 + (i % 5)) % 24;
    const minute = (i * 11) % 60;
    const second = (i * 19) % 60;
    const date = new Date(Date.UTC(2023, Math.floor(dayOfYear / 30), (dayOfYear % 28) + 1, hour, minute, second));
    const txDateStr = date.toISOString();

    // Previous transaction date (2 mins to 14 days prior)
    const prevDeltaMins = (i % 19 === 0) ? 3 : (120 + ((i * 23) % 20000));
    const prevDate = new Date(date.getTime() - prevDeltaMins * 60 * 1000);
    const prevDateStr = prevDate.toISOString();

    // Amount & Balance
    let amount = 20 + ((i * 47) % 400);
    if (i % 14 === 0) amount = base.avgAmount * (3.2 + (i % 3)); // Trigger High Amount
    if (amount > 1919) amount = 1850;

    let balance = 800 + ((i * 89) % 12000);
    if (i % 23 === 0) balance = amount * 1.15; // Trigger Balance Drain

    // Logins, Duration, Channel, Device
    const loginAttempts = (i % 17 === 0) ? (3 + (i % 3)) : 1;
    const duration = 15 + ((i * 13) % 270);
    const channel = channels[i % 3];
    const txType: "Debit" | "Credit" = (i % 4 === 0) ? "Credit" : "Debit";
    const location = cityKeys[(accNum + i) % cityKeys.length];
    const deviceId = `DEV-${200 + ((accNum * 3 + (i % 5)) % 681)}`;
    const merchantId = `MCH-${100 + (i % 100)}`;
    const ipAddress = `192.168.${(i % 254) + 1}.${(accNum % 254) + 1}`;
    const isNewDeviceLoc = (i % 11 === 0);

    const rawTx: RawTransaction = {
      transactionId: txId,
      accountId: accId,
      transactionAmount: Math.round(amount * 100) / 100,
      transactionDate: txDateStr,
      transactionType: txType,
      location,
      deviceId,
      ipAddress,
      merchantId,
      channel,
      customerAge: base.age,
      customerOccupation: base.occupation,
      transactionDuration: duration,
      loginAttempts,
      accountBalance: Math.round(balance * 100) / 100,
      previousTransactionDate: prevDateStr
    };

    const flagged = calculateTransactionFlags(rawTx, base.avgAmount, isNewDeviceLoc);
    transactions.push(flagged);
  }

  return transactions;
}

/**
 * Filter Engine applying global filter state to transaction list
 */
export function filterTransactions(
  transactions: FlaggedTransaction[],
  filters: FilterState
): FlaggedTransaction[] {
  return transactions.filter((tx) => {
    // 1. Date Range
    if (filters.dateRange !== "ALL") {
      const month = new Date(tx.transactionDate).getUTCMonth(); // 0 to 11
      if (filters.dateRange === "Q1" && !(month >= 0 && month <= 2)) return false;
      if (filters.dateRange === "Q2" && !(month >= 3 && month <= 5)) return false;
      if (filters.dateRange === "Q3" && !(month >= 6 && month <= 8)) return false;
      if (filters.dateRange === "Q4" && !(month >= 9 && month <= 11)) return false;
    }

    // 2. Channel
    if (filters.channel !== "ALL" && tx.channel !== filters.channel) {
      return false;
    }

    // 3. Transaction Type
    if (filters.transactionType !== "ALL" && tx.transactionType !== filters.transactionType) {
      return false;
    }

    // 4. Occupation
    if (filters.occupation !== "ALL" && tx.customerOccupation !== filters.occupation) {
      return false;
    }

    // 5. Risk Level
    if (filters.riskLevel !== "ALL" && tx.riskLevel !== filters.riskLevel) {
      return false;
    }

    // 6. Minimum Risk Score (Page 4 slider)
    if (filters.minRiskScore !== undefined && tx.riskScore < filters.minRiskScore) {
      return false;
    }

    // 7. Active Flag Filter (Page 4 checkbox)
    if (filters.activeFlagFilter && !tx.flagReasons.some(f => f.toLowerCase().includes(filters.activeFlagFilter!.toLowerCase()))) {
      return false;
    }

    // 8. Search Query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.trim().toLowerCase();
      const matchTxId = tx.transactionId.toLowerCase().includes(q);
      const matchAccId = tx.accountId.toLowerCase().includes(q);
      const matchLoc = tx.location.toLowerCase().includes(q);
      const matchDev = tx.deviceId.toLowerCase().includes(q);
      if (!matchTxId && !matchAccId && !matchLoc && !matchDev) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Metric Aggregator for 7 Surveillance Dashboards (100% English)
 */
export function computeDashboardAggregates(dataset: FlaggedTransaction[]) {
  const totalTransactions = dataset.length;
  const totalVolume = dataset.reduce((acc, t) => acc + t.transactionAmount, 0);
  const flaggedTransactions = dataset.filter((t) => t.isFlagged);
  const flaggedCount = flaggedTransactions.length;
  const fraudRate = totalTransactions > 0 ? (flaggedCount / totalTransactions) * 100 : 0;
  const potentialLoss = flaggedTransactions.reduce((acc, t) => acc + t.transactionAmount, 0);

  // Risk Distribution
  const riskCounts = {
    Low: dataset.filter(t => t.riskLevel === "Low").length,
    Medium: dataset.filter(t => t.riskLevel === "Medium").length,
    High: dataset.filter(t => t.riskLevel === "High").length
  };

  // Top 5 Flag Reasons
  const flagReasonFrequencies: Record<string, number> = {
    "High Amount (>3x Avg)": 0,
    "Failed Logins (>=3)": 0,
    "Odd Hour (00-04 UTC)": 0,
    "Rapid Succession (<5m)": 0,
    "New Device/Location": 0,
    "Balance Drain (>70%)": 0
  };
  dataset.forEach(tx => {
    if (tx.flagHighAmount) flagReasonFrequencies["High Amount (>3x Avg)"]++;
    if (tx.flagLoginAttempts) flagReasonFrequencies["Failed Logins (>=3)"]++;
    if (tx.flagOddHour) flagReasonFrequencies["Odd Hour (00-04 UTC)"]++;
    if (tx.flagRapidSuccession) flagReasonFrequencies["Rapid Succession (<5m)"]++;
    if (tx.flagNewDeviceLocation) flagReasonFrequencies["New Device/Location"]++;
    if (tx.flagBalanceDrain) flagReasonFrequencies["Balance Drain (>70%)"]++;
  });

  const topFlagReasons = Object.entries(flagReasonFrequencies)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Monthly Trend Data
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyMap: Record<number, { total: number; flagged: number; volume: number; flaggedVol: number }> = {};
  for (let m = 0; m < 12; m++) monthlyMap[m] = { total: 0, flagged: 0, volume: 0, flaggedVol: 0 };

  dataset.forEach(tx => {
    const m = new Date(tx.transactionDate).getUTCMonth();
    monthlyMap[m].total++;
    monthlyMap[m].volume += tx.transactionAmount;
    if (tx.isFlagged) {
      monthlyMap[m].flagged++;
      monthlyMap[m].flaggedVol += tx.transactionAmount;
    }
  });

  const monthlyTrends: MonthlyTrendData[] = monthNames.map((name, idx) => {
    const d = monthlyMap[idx];
    return {
      month: `2023-${String(idx + 1).padStart(2, "0")}`,
      label: name,
      totalTransactions: d.total,
      flaggedTransactions: d.flagged,
      fraudRate: d.total > 0 ? (d.flagged / d.total) * 100 : 0,
      totalAmount: d.volume,
      flaggedAmount: d.flaggedVol
    };
  });

  // Channel Metrics
  const channelList: Array<"ATM" | "Branch" | "Online"> = ["ATM", "Branch", "Online"];
  const channelMetrics: ChannelMetric[] = channelList.map(ch => {
    const chTxs = dataset.filter(t => t.channel === ch);
    const chFlagged = chTxs.filter(t => t.isFlagged);
    const totalVol = chTxs.reduce((acc, t) => acc + t.transactionAmount, 0);
    const flaggedVol = chFlagged.reduce((acc, t) => acc + t.transactionAmount, 0);
    const avgDur = chTxs.length > 0 ? chTxs.reduce((acc, t) => acc + t.transactionDuration, 0) / chTxs.length : 0;
    const flDur = chFlagged.length > 0 ? chFlagged.reduce((acc, t) => acc + t.transactionDuration, 0) / chFlagged.length : 0;
    return {
      channel: ch,
      total: chTxs.length,
      flagged: chFlagged.length,
      fraudRate: chTxs.length > 0 ? (chFlagged.length / chTxs.length) * 100 : 0,
      totalVolume: Math.round(totalVol),
      flaggedVolume: Math.round(flaggedVol),
      avgDuration: Math.round(avgDur),
      flaggedDuration: Math.round(flDur),
      highRiskCount: chTxs.filter(t => t.riskLevel === "High").length,
      mediumRiskCount: chTxs.filter(t => t.riskLevel === "Medium").length,
      lowRiskCount: chTxs.filter(t => t.riskLevel === "Low").length
    };
  });

  // TransactionType Metrics
  const debitTxs = dataset.filter(t => t.transactionType === "Debit");
  const creditTxs = dataset.filter(t => t.transactionType === "Credit");
  const debitFlagged = debitTxs.filter(t => t.isFlagged);
  const creditFlagged = creditTxs.filter(t => t.isFlagged);

  const typeMetrics = {
    Debit: {
      total: debitTxs.length,
      flagged: debitFlagged.length,
      fraudRate: debitTxs.length > 0 ? (debitFlagged.length / debitTxs.length) * 100 : 0,
      totalVolume: Math.round(debitTxs.reduce((acc, t) => acc + t.transactionAmount, 0)),
      flaggedVolume: Math.round(debitFlagged.reduce((acc, t) => acc + t.transactionAmount, 0)),
      avgAmount: debitTxs.length > 0 ? Math.round(debitTxs.reduce((acc, t) => acc + t.transactionAmount, 0) / debitTxs.length) : 0
    },
    Credit: {
      total: creditTxs.length,
      flagged: creditFlagged.length,
      fraudRate: creditTxs.length > 0 ? (creditFlagged.length / creditTxs.length) * 100 : 0,
      totalVolume: Math.round(creditTxs.reduce((acc, t) => acc + t.transactionAmount, 0)),
      flaggedVolume: Math.round(creditFlagged.reduce((acc, t) => acc + t.transactionAmount, 0)),
      avgAmount: creditTxs.length > 0 ? Math.round(creditTxs.reduce((acc, t) => acc + t.transactionAmount, 0) / creditTxs.length) : 0
    }
  };

  // Channel x Risk Level Heatmap Matrix
  const channelRiskMatrix = {
    ATM: { Low: 0, Medium: 0, High: 0 },
    Branch: { Low: 0, Medium: 0, High: 0 },
    Online: { Low: 0, Medium: 0, High: 0 }
  };
  dataset.forEach(tx => {
    channelRiskMatrix[tx.channel][tx.riskLevel]++;
  });

  // Geographic City Dispersion
  const cityMap: Record<string, { total: number; flagged: number; amount: number }> = {};
  dataset.forEach(tx => {
    if (!cityMap[tx.location]) cityMap[tx.location] = { total: 0, flagged: 0, amount: 0 };
    cityMap[tx.location].total++;
    cityMap[tx.location].amount += tx.transactionAmount;
    if (tx.isFlagged) cityMap[tx.location].flagged++;
  });

  const cityGeographics: CityGeographicSummary[] = Object.entries(cityMap).map(([city, d]) => {
    const coords = CITIES_COORDINATES[city] || { lat: -6.2088, lng: 106.8456 };
    return {
      city,
      totalTransactions: d.total,
      flaggedTransactions: d.flagged,
      fraudRate: d.total > 0 ? (d.flagged / d.total) * 100 : 0,
      totalAmount: d.amount,
      lat: coords.lat,
      lng: coords.lng
    };
  }).sort((a, b) => b.flaggedTransactions - a.flaggedTransactions);

  // Age Bins Metrics
  const ageBins: Record<string, { total: number; flagged: number }> = {
    "18-25": { total: 0, flagged: 0 },
    "26-35": { total: 0, flagged: 0 },
    "36-45": { total: 0, flagged: 0 },
    "46-55": { total: 0, flagged: 0 },
    "56-65": { total: 0, flagged: 0 },
    "66+": { total: 0, flagged: 0 }
  };
  dataset.forEach(tx => {
    let bin = "18-25";
    if (tx.customerAge > 65) bin = "66+";
    else if (tx.customerAge >= 56) bin = "56-65";
    else if (tx.customerAge >= 46) bin = "46-55";
    else if (tx.customerAge >= 36) bin = "36-45";
    else if (tx.customerAge >= 26) bin = "26-35";

    ageBins[bin].total++;
    if (tx.isFlagged) ageBins[bin].flagged++;
  });

  const ageBinMetrics: AgeBinMetric[] = Object.entries(ageBins).map(([bin, d]) => ({
    bin: bin as any,
    total: d.total,
    flagged: d.flagged,
    fraudRate: d.total > 0 ? (d.flagged / d.total) * 100 : 0
  }));

  // Occupation Metrics
  const occupationList: Array<"Student" | "Doctor" | "Engineer" | "Retired"> = [
    "Student", "Doctor", "Engineer", "Retired"
  ];
  const occupationMetrics: OccupationMetric[] = occupationList.map(occ => {
    const occTxs = dataset.filter(t => t.customerOccupation === occ);
    const flaggedOcc = occTxs.filter(t => t.isFlagged);
    const avgAmt = occTxs.length > 0 ? occTxs.reduce((acc, t) => acc + t.transactionAmount, 0) / occTxs.length : 0;
    return {
      occupation: occ,
      total: occTxs.length,
      flagged: flaggedOcc.length,
      fraudRate: occTxs.length > 0 ? (flaggedOcc.length / occTxs.length) * 100 : 0,
      avgAmount: Math.round(avgAmt)
    };
  });

  // Login Attempts Distribution
  const loginAttemptsDistribution = [1, 2, 3, 4, 5].map(attempts => {
    const txs = dataset.filter(t => t.loginAttempts === attempts);
    const flagged = txs.filter(t => t.isFlagged);
    return {
      attempts,
      total: txs.length,
      flagged: flagged.length,
      isAnomalyThreshold: attempts >= 3
    };
  });

  // Top 10 High-Risk Accounts Priority List
  const accountAggregates: Record<string, { flagged: number; riskSum: number; maxRisk: number; volume: number; occupation: string }> = {};
  dataset.forEach(tx => {
    if (!accountAggregates[tx.accountId]) {
      accountAggregates[tx.accountId] = { flagged: 0, riskSum: 0, maxRisk: 0, volume: 0, occupation: tx.customerOccupation };
    }
    accountAggregates[tx.accountId].riskSum += tx.riskScore;
    accountAggregates[tx.accountId].volume += tx.transactionAmount;
    if (tx.riskScore > accountAggregates[tx.accountId].maxRisk) {
      accountAggregates[tx.accountId].maxRisk = tx.riskScore;
    }
    if (tx.isFlagged) {
      accountAggregates[tx.accountId].flagged++;
    }
  });

  const topRiskAccounts: AccountRiskPriority[] = Object.entries(accountAggregates)
    .map(([accountId, d]) => ({
      accountId,
      flaggedCount: d.flagged,
      totalRiskScore: d.riskSum,
      maxRiskScore: d.maxRisk,
      totalVolume: Math.round(d.volume * 100) / 100,
      customerOccupation: d.occupation
    }))
    .filter(a => a.flaggedCount > 0)
    .sort((a, b) => b.totalRiskScore - a.totalRiskScore || b.flaggedCount - a.flaggedCount)
    .slice(0, 10);

  // Top 10 Flagged Merchants
  const merchantMap: Record<string, { total: number; flagged: number; exposure: number }> = {};
  dataset.forEach(tx => {
    if (!merchantMap[tx.merchantId]) merchantMap[tx.merchantId] = { total: 0, flagged: 0, exposure: 0 };
    merchantMap[tx.merchantId].total++;
    if (tx.isFlagged) {
      merchantMap[tx.merchantId].flagged++;
      merchantMap[tx.merchantId].exposure += tx.transactionAmount;
    }
  });

  const topMerchants: MerchantRiskMetric[] = Object.entries(merchantMap)
    .map(([merchantId, d]) => ({
      merchantId,
      total: d.total,
      flagged: d.flagged,
      fraudRate: d.total > 0 ? (d.flagged / d.total) * 100 : 0,
      exposureAmount: Math.round(d.exposure * 100) / 100
    }))
    .filter(m => m.flagged > 0)
    .sort((a, b) => b.flagged - a.flagged || b.exposureAmount - a.exposureAmount)
    .slice(0, 10);

  return {
    totalTransactions,
    totalVolume,
    flaggedCount,
    fraudRate,
    potentialLoss,
    riskCounts,
    topFlagReasons,
    monthlyTrends,
    channelMetrics,
    typeMetrics,
    channelRiskMatrix,
    cityGeographics,
    ageBinMetrics,
    occupationMetrics,
    loginAttemptsDistribution,
    topRiskAccounts,
    topMerchants
  };
}

/**
 * Client-Side CSV Exporter
 */
export function exportTransactionsToCsv(transactions: FlaggedTransaction[]): string {
  const headers = [
    "TransactionID",
    "AccountID",
    "TransactionDate",
    "Amount",
    "Channel",
    "TransactionType",
    "Location",
    "DeviceID",
    "LoginAttempts",
    "AccountBalance",
    "RiskScore",
    "RiskLevel",
    "IsFlagged",
    "FlagReasons"
  ];

  const rows = transactions.map((t) => [
    t.transactionId,
    t.accountId,
    t.transactionDate,
    t.transactionAmount,
    t.channel,
    t.transactionType,
    `"${t.location}"`,
    t.deviceId,
    t.loginAttempts,
    t.accountBalance,
    t.riskScore,
    t.riskLevel,
    t.isFlagged ? "TRUE" : "FALSE",
    `"${t.flagReasonSummary}"`
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

/**
 * Interactive What-If Anomaly Simulator
 */
export function simulateTransactionRisk(
  amount: number,
  avgHistorical: number,
  loginAttempts: number,
  hourOfDayUtc: number,
  deltaMinutesSinceLastTxn: number,
  isNewDeviceOrLocation: boolean,
  accountBalance: number
) {
  const flagHighAmount = avgHistorical > 0 && amount > 3.0 * avgHistorical;
  const flagLoginAttempts = loginAttempts >= 3;
  const flagOddHour = hourOfDayUtc >= 0 && hourOfDayUtc <= 4;
  const flagRapidSuccession = deltaMinutesSinceLastTxn > 0 && deltaMinutesSinceLastTxn < 5;
  const flagNewDeviceLocation = isNewDeviceOrLocation;
  const flagBalanceDrain = accountBalance > 0 && amount > 0.7 * accountBalance;

  const flags: string[] = [];
  if (flagHighAmount) flags.push("High Amount (> 3x Avg)");
  if (flagLoginAttempts) flags.push("Failed Logins (>= 3 Attempts)");
  if (flagOddHour) flags.push("Odd Hour (00:00–04:00 UTC)");
  if (flagRapidSuccession) flags.push("Rapid Succession (< 5 mins)");
  if (flagNewDeviceLocation) flags.push("New Device / Location Pairing");
  if (flagBalanceDrain) flags.push("Balance Drain (> 70% Balance)");

  const score = flags.length;
  const isFlagged = score >= 2;
  let riskLevel: "Low" | "Medium" | "High" = "Low";
  if (score >= 4) riskLevel = "High";
  else if (score >= 2) riskLevel = "Medium";

  return {
    score,
    isFlagged,
    riskLevel,
    flags,
    flagHighAmount,
    flagLoginAttempts,
    flagOddHour,
    flagRapidSuccession,
    flagNewDeviceLocation,
    flagBalanceDrain
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);
}
