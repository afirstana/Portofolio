"use client";

import React from "react";
import { FilterState } from "@/lib/anti-fraud";

interface GlobalFilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  filteredCount: number;
  totalCount: number;
}

export function GlobalFilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  filteredCount,
  totalCount
}: GlobalFilterBarProps) {
  return (
    <div className="fraud-filter-bar" role="region" aria-label="Global Surveillance Slicer Controls">
      <div className="filter-bar-header mono">
        <div className="filter-header-left">
          <span className="pulse-dot" />
          <strong>GLOBAL SLICER CONTROLS</strong>
          <span className="filter-scope-pill">
            Showing {filteredCount.toLocaleString()} of {totalCount.toLocaleString()} Transactions
          </span>
        </div>
        <button
          type="button"
          className="filter-reset-btn mono"
          onClick={onResetFilters}
          title="Reset all global slicers to default"
        >
          ↺ Reset Slicers
        </button>
      </div>

      <div className="filter-controls-grid">
        {/* Date Quarter Slicer */}
        <div className="filter-group">
          <label className="filter-label mono">DATE TIMELINE (2023)</label>
          <select
            className="filter-select mono"
            value={filters.dateRange}
            onChange={(e) => onFilterChange({ ...filters, dateRange: e.target.value as any })}
          >
            <option value="ALL">Full Year (Jan – Dec 2023)</option>
            <option value="Q1">Q1 (Jan – Mar 2023)</option>
            <option value="Q2">Q2 (Apr – Jun 2023)</option>
            <option value="Q3">Q3 (Jul – Sep 2023)</option>
            <option value="Q4">Q4 (Oct – Dec 2023)</option>
          </select>
        </div>

        {/* Channel Slicer */}
        <div className="filter-group">
          <label className="filter-label mono">TRANSACTION CHANNEL</label>
          <select
            className="filter-select mono"
            value={filters.channel}
            onChange={(e) => onFilterChange({ ...filters, channel: e.target.value as any })}
          >
            <option value="ALL">All Channels (ATM / Branch / Online)</option>
            <option value="ATM">ATM Terminal</option>
            <option value="Branch">Bank Branch</option>
            <option value="Online">Online / Digital Banking</option>
          </select>
        </div>

        {/* Transaction Type */}
        <div className="filter-group">
          <label className="filter-label mono">PAYMENT INSTRUMENT</label>
          <select
            className="filter-select mono"
            value={filters.transactionType}
            onChange={(e) => onFilterChange({ ...filters, transactionType: e.target.value as any })}
          >
            <option value="ALL">All Instruments (Debit &amp; Credit)</option>
            <option value="Debit">Debit Card</option>
            <option value="Credit">Credit Card</option>
          </select>
        </div>

        {/* Customer Occupation */}
        <div className="filter-group">
          <label className="filter-label mono">CUSTOMER OCCUPATION</label>
          <select
            className="filter-select mono"
            value={filters.occupation}
            onChange={(e) => onFilterChange({ ...filters, occupation: e.target.value as any })}
          >
            <option value="ALL">All Occupations</option>
            <option value="Doctor">Doctor</option>
            <option value="Engineer">Engineer</option>
            <option value="Retired">Retired</option>
            <option value="Student">Student</option>
          </select>
        </div>

        {/* Risk Level Slicer */}
        <div className="filter-group">
          <label className="filter-label mono">RISK SEVERITY TIER</label>
          <select
            className="filter-select mono"
            value={filters.riskLevel}
            onChange={(e) => onFilterChange({ ...filters, riskLevel: e.target.value as any })}
          >
            <option value="ALL">All Risk Tiers (0–6 Flags)</option>
            <option value="High">High Risk (&gt;= 4 Flags)</option>
            <option value="Medium">Medium Risk (2–3 Flags)</option>
            <option value="Low">Low Risk / Normal (0–1 Flags)</option>
          </select>
        </div>

        {/* Search Box */}
        <div className="filter-group search-group">
          <label className="filter-label mono">SEARCH ACCOUNT / TXN / CITY</label>
          <input
            type="text"
            className="filter-input mono"
            placeholder="e.g. ACC-1012, TXN-1002, Jakarta..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
