"use client";

import React, { useState, useMemo } from "react";
import {
  computeDashboardAggregates,
  FilterState,
  filterTransactions,
  generateSyntheticAntiFraudDataset
} from "@/lib/anti-fraud";
import { GlobalFilterBar } from "./GlobalFilterBar";
import { ExecutiveSummaryView } from "./ExecutiveSummaryView";
import { AtmChannelDashboard } from "./AtmChannelDashboard";
import { BranchChannelDashboard } from "./BranchChannelDashboard";
import { OnlineChannelDashboard } from "./OnlineChannelDashboard";
import { CardTypeAnalysisDashboard } from "./CardTypeAnalysisDashboard";
import { CustomerProfileView } from "./CustomerProfileView";
import { DrillDownInvestigationView } from "./DrillDownInvestigationView";

const INITIAL_FILTERS: FilterState = {
  dateRange: "ALL",
  channel: "ALL",
  transactionType: "ALL",
  occupation: "ALL",
  riskLevel: "ALL",
  searchQuery: ""
};

export function AntiFraudDashboard() {
  const [activeTab, setActiveTab] = useState<string>("executive");
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // Master Dataset (2,512 rows)
  const masterDataset = useMemo(() => {
    return generateSyntheticAntiFraudDataset();
  }, []);

  // Filtered Dataset based on global filters
  const filteredDataset = useMemo(() => {
    return filterTransactions(masterDataset, filters);
  }, [masterDataset, filters]);

  // Precomputed aggregates for current filtered view
  const aggregates = useMemo(() => {
    return computeDashboardAggregates(filteredDataset);
  }, [filteredDataset]);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  return (
    <div className="anti-fraud-dashboard-root" aria-label="Banking Anti-Fraud Multi-Dashboard Suite">
      {/* Top Header */}
      <div className="fraud-dashboard-header">
        <div className="fraud-header-top mono">
          <div className="hud-badge">
            <span className="pulse-dot" />
            <span>POWER BI MULTI-PAGE SURVEILLANCE SUITE • 2,512 OBSERVED OPERATIONS</span>
          </div>
          <div className="hud-right-tags">
            <span className="hud-local-tag">⚡ 100% LOCAL-FIRST (ZERO SERVER LATENCY)</span>
            <span className="hud-live-tag">LIVE SQL ENGINE</span>
          </div>
        </div>

        {/* Dedicated Dashboard Tabs */}
        <div className="dashboard-pages-tablist multi-dashboards-grid" role="tablist" aria-label="Surveillance Dashboards">
          {/* Tab 1: Executive Overview */}
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "executive"}
            className={`page-tab-btn ${activeTab === "executive" ? "active" : ""}`}
            onClick={() => setActiveTab("executive")}
          >
            <span className="mono tab-num">DASHBOARD 01</span>
            <strong className="tab-title">Executive Portfolio</strong>
            <span className="mono tab-desc">Macro KPIs, Trends &amp; Maps</span>
          </button>

          {/* Tab 2: ATM Terminal */}
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "atm"}
            className={`page-tab-btn ${activeTab === "atm" ? "active" : ""}`}
            onClick={() => setActiveTab("atm")}
          >
            <span className="mono tab-num">DASHBOARD 02</span>
            <strong className="tab-title">ATM Terminals</strong>
            <span className="mono tab-desc">Cash Out &amp; Rapid Swipes</span>
          </button>

          {/* Tab 3: Branch Banking */}
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "branch"}
            className={`page-tab-btn ${activeTab === "branch" ? "active" : ""}`}
            onClick={() => setActiveTab("branch")}
          >
            <span className="mono tab-num">DASHBOARD 03</span>
            <strong className="tab-title">Bank Branches</strong>
            <span className="mono tab-desc">Counter Surges &amp; Overrides</span>
          </button>

          {/* Tab 4: Online Digital */}
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "online"}
            className={`page-tab-btn ${activeTab === "online" ? "active" : ""}`}
            onClick={() => setActiveTab("online")}
          >
            <span className="mono tab-num">DASHBOARD 04</span>
            <strong className="tab-title">Online &amp; Digital</strong>
            <span className="mono tab-desc">Cyber, ATO &amp; Bot Defense</span>
          </button>

          {/* Tab 5: Card Types */}
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "cards"}
            className={`page-tab-btn ${activeTab === "cards" ? "active" : ""}`}
            onClick={() => setActiveTab("cards")}
          >
            <span className="mono tab-num">DASHBOARD 05</span>
            <strong className="tab-title">Card Types</strong>
            <span className="mono tab-desc">Debit vs Credit Exposure</span>
          </button>

          {/* Tab 6: Behavioral & AML */}
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "behavioral"}
            className={`page-tab-btn ${activeTab === "behavioral" ? "active" : ""}`}
            onClick={() => setActiveTab("behavioral")}
          >
            <span className="mono tab-num">DASHBOARD 06</span>
            <strong className="tab-title">Behavioral &amp; AML</strong>
            <span className="mono tab-desc">Age, Drain &amp; Target Queue</span>
          </button>

          {/* Tab 7: Forensic Audit */}
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "audit"}
            className={`page-tab-btn ${activeTab === "audit" ? "active" : ""}`}
            onClick={() => setActiveTab("audit")}
          >
            <span className="mono tab-num">DASHBOARD 07</span>
            <strong className="tab-title">Forensic Audit</strong>
            <span className="mono tab-desc">12-Col Table &amp; Account History</span>
          </button>
        </div>
      </div>

      {/* Global Filter Slicer Bar */}
      <GlobalFilterBar
        filters={filters}
        onFilterChange={setFilters}
        onResetFilters={handleResetFilters}
        filteredCount={filteredDataset.length}
        totalCount={masterDataset.length}
      />

      {/* Active Dashboard Rendering */}
      <div className="dashboard-content-area">
        {activeTab === "executive" && (
          <ExecutiveSummaryView
            totalTransactions={aggregates.totalTransactions}
            totalVolume={aggregates.totalVolume}
            flaggedCount={aggregates.flaggedCount}
            fraudRate={aggregates.fraudRate}
            potentialLoss={aggregates.potentialLoss}
            riskCounts={aggregates.riskCounts}
            topFlagReasons={aggregates.topFlagReasons}
            monthlyTrends={aggregates.monthlyTrends}
            cityGeographics={aggregates.cityGeographics}
          />
        )}

        {activeTab === "atm" && (
          <AtmChannelDashboard transactions={filteredDataset} />
        )}

        {activeTab === "branch" && (
          <BranchChannelDashboard transactions={filteredDataset} />
        )}

        {activeTab === "online" && (
          <OnlineChannelDashboard
            transactions={filteredDataset}
            topMerchants={aggregates.topMerchants}
          />
        )}

        {activeTab === "cards" && (
          <CardTypeAnalysisDashboard
            transactions={filteredDataset}
            channelRiskMatrix={aggregates.channelRiskMatrix}
          />
        )}

        {activeTab === "behavioral" && (
          <CustomerProfileView
            ageBinMetrics={aggregates.ageBinMetrics}
            occupationMetrics={aggregates.occupationMetrics}
            loginAttemptsDistribution={aggregates.loginAttemptsDistribution}
            topRiskAccounts={aggregates.topRiskAccounts}
          />
        )}

        {activeTab === "audit" && (
          <DrillDownInvestigationView
            transactions={filteredDataset}
            allTransactions={masterDataset}
          />
        )}
      </div>
    </div>
  );
}
