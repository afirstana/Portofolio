"use client";

import React, { useState, useMemo } from "react";
import { FlaggedTransaction, exportTransactionsToCsv } from "@/lib/anti-fraud";

interface DrillDownInvestigationViewProps {
  transactions: FlaggedTransaction[];
  allTransactions: FlaggedTransaction[];
}

export function DrillDownInvestigationView({
  transactions,
  allTransactions
}: DrillDownInvestigationViewProps) {
  const [selectedTx, setSelectedTx] = useState<FlaggedTransaction | null>(transactions[0] || null);
  const [minRiskSlider, setMinRiskSlider] = useState<number>(0);
  const [selectedFlagFilter, setSelectedFlagFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortField, setSortField] = useState<keyof FlaggedTransaction>("riskScore");
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [auditActionNotice, setAuditActionNotice] = useState<string | null>(null);

  // Filter with Page-Specific Slicers & Instant Search
  const pageFilteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (tx.riskScore < minRiskSlider) return false;
      if (selectedFlagFilter !== "ALL" && !tx.flagReasons.some(f => f.toLowerCase().includes(selectedFlagFilter.toLowerCase()))) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const mTx = tx.transactionId.toLowerCase().includes(q);
        const mAcc = tx.accountId.toLowerCase().includes(q);
        const mLoc = tx.location.toLowerCase().includes(q);
        const mDev = tx.deviceId.toLowerCase().includes(q);
        const mIp = tx.ipAddress.toLowerCase().includes(q);
        const mMch = tx.merchantId.toLowerCase().includes(q);
        if (!mTx && !mAcc && !mLoc && !mDev && !mIp && !mMch) return false;
      }
      return true;
    });
  }, [transactions, minRiskSlider, selectedFlagFilter, searchQuery]);

  // Sort logic
  const sortedTransactions = useMemo(() => {
    return [...pageFilteredTransactions].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === "number" && typeof valB === "number") {
        return sortAsc ? valA - valB : valB - valA;
      }
      if (typeof valA === "string" && typeof valB === "string") {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return 0;
    });
  }, [pageFilteredTransactions, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(sortedTransactions.length / pageSize) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (pageNumber - 1) * pageSize;
    return sortedTransactions.slice(start, start + pageSize);
  }, [sortedTransactions, pageNumber, pageSize]);

  // Historical 5 transactions for selected Account
  const accountHistory = useMemo(() => {
    if (!selectedTx) return [];
    return allTransactions
      .filter((t) => t.accountId === selectedTx.accountId)
      .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
      .slice(0, 5);
  }, [selectedTx, allTransactions]);

  const handleSort = (field: keyof FlaggedTransaction) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleDownloadCsv = () => {
    const csvContent = exportTransactionsToCsv(sortedTransactions);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `anti_fraud_audit_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCaseAction = (action: string) => {
    setAuditActionNotice(`Case Resolution: [${action}] recorded for Transaction ${selectedTx?.transactionId}`);
    setTimeout(() => setAuditActionNotice(null), 3500);
  };

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return `${d.toISOString().slice(0, 10)} ${d.toISOString().slice(11, 19)} UTC`;
  };

  return (
    <div className="drilldown-investigation-view" aria-label="Forensic Investigation &amp; Audit Console">
      {/* Investigation Controls Bar */}
      <div className="drilldown-slicers-bar mono">
        {/* Live Search Input */}
        <div className="slicer-group search-slicer">
          <label className="slicer-label">SEARCH ANY FIELD:</label>
          <input
            type="text"
            className="slicer-input"
            placeholder="TxnID, AccountID, City, Device, IP..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPageNumber(1);
            }}
          />
        </div>

        {/* Risk Score Slider */}
        <div className="slicer-group slider-group">
          <label className="slicer-label">
            MIN RISK SCORE: <strong>{minRiskSlider} / 6 FLAGS</strong>
          </label>
          <input
            type="range"
            min="0"
            max="6"
            step="1"
            value={minRiskSlider}
            onChange={(e) => {
              setMinRiskSlider(Number(e.target.value));
              setPageNumber(1);
            }}
            className="risk-slider"
          />
        </div>

        {/* Specific Flag Filter */}
        <div className="slicer-group">
          <label className="slicer-label">FILTER SPECIFIC FLAG:</label>
          <select
            className="slicer-select"
            value={selectedFlagFilter}
            onChange={(e) => {
              setSelectedFlagFilter(e.target.value);
              setPageNumber(1);
            }}
          >
            <option value="ALL">All Triggered Heuristics</option>
            <option value="High Amount">High Amount (&gt; 3x Avg)</option>
            <option value="Failed Logins">Failed Logins (&gt;= 3 Attempts)</option>
            <option value="Odd Hour">Odd Hour (00:00–04:00 UTC)</option>
            <option value="Rapid Succession">Rapid Succession (&lt; 5 mins)</option>
            <option value="New Device">New Device / Location Combo</option>
            <option value="Balance Drain">Balance Drain (&gt; 70% Ratio)</option>
          </select>
        </div>

        {/* Page Size Selector */}
        <div className="slicer-group">
          <label className="slicer-label">ROWS / PAGE</label>
          <select
            className="slicer-select"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPageNumber(1);
            }}
          >
            <option value="10">10 Rows (Compact)</option>
            <option value="25">25 Rows</option>
            <option value="50">50 Rows</option>
          </select>
        </div>

        {/* Export CSV Button */}
        <div className="slicer-group action-group">
          <button
            type="button"
            className="export-csv-btn mono"
            onClick={handleDownloadCsv}
            title="Export matching records to CSV"
          >
            📥 Export CSV ({sortedTransactions.length})
          </button>
        </div>
      </div>

      {/* Main 12-Column Master Table */}
      <div className="master-table-container">
        <div className="table-scroll-wrapper">
          <table className="master-investigation-table mono">
            <thead>
              <tr>
                <th onClick={() => handleSort("transactionId")}>
                  Txn ID {sortField === "transactionId" ? (sortAsc ? "↑" : "↓") : ""}
                </th>
                <th onClick={() => handleSort("accountId")}>
                  Account ID {sortField === "accountId" ? (sortAsc ? "↑" : "↓") : ""}
                </th>
                <th onClick={() => handleSort("transactionDate")}>
                  Timestamp (UTC) {sortField === "transactionDate" ? (sortAsc ? "↑" : "↓") : ""}
                </th>
                <th onClick={() => handleSort("transactionAmount")}>
                  Amount ($) {sortField === "transactionAmount" ? (sortAsc ? "↑" : "↓") : ""}
                </th>
                <th onClick={() => handleSort("channel")}>
                  Channel {sortField === "channel" ? (sortAsc ? "↑" : "↓") : ""}
                </th>
                <th onClick={() => handleSort("location")}>
                  Location {sortField === "location" ? (sortAsc ? "↑" : "↓") : ""}
                </th>
                <th onClick={() => handleSort("deviceId")}>
                  Device ID {sortField === "deviceId" ? (sortAsc ? "↑" : "↓") : ""}
                </th>
                <th onClick={() => handleSort("loginAttempts")}>
                  Logins {sortField === "loginAttempts" ? (sortAsc ? "↑" : "↓") : ""}
                </th>
                <th onClick={() => handleSort("accountBalance")}>
                  Balance ($) {sortField === "accountBalance" ? (sortAsc ? "↑" : "↓") : ""}
                </th>
                <th onClick={() => handleSort("riskLevel")}>
                  Risk Tier {sortField === "riskLevel" ? (sortAsc ? "↑" : "↓") : ""}
                </th>
                <th>Active Heuristic Reasons</th>
                <th onClick={() => handleSort("riskScore")}>
                  Score {sortField === "riskScore" ? (sortAsc ? "↑" : "↓") : ""}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((tx) => {
                const isSelected = selectedTx?.transactionId === tx.transactionId;
                return (
                  <tr
                    key={tx.transactionId}
                    className={`master-row interactive-master-row ${isSelected ? "selected-row" : ""} ${tx.riskLevel.toLowerCase()}-row`}
                    onClick={() => setSelectedTx(tx)}
                    title="Click row to inspect 5-transaction account history below"
                  >
                    <td><strong>{tx.transactionId} {isSelected ? "★" : ""}</strong></td>
                    <td>{tx.accountId}</td>
                    <td className="time-col">{formatDateTime(tx.transactionDate)}</td>
                    <td className="amount-col">${tx.transactionAmount.toFixed(2)}</td>
                    <td><span className="channel-tag">{tx.channel}</span></td>
                    <td>{tx.location}</td>
                    <td>{tx.deviceId}</td>
                    <td className={tx.loginAttempts >= 3 ? "red-highlight font-bold" : ""}>
                      {tx.loginAttempts}x
                    </td>
                    <td>${tx.accountBalance.toLocaleString()}</td>
                    <td>
                      <span className={`risk-badge-cell ${tx.riskLevel.toLowerCase()}`}>
                        {tx.riskLevel}
                      </span>
                    </td>
                    <td className="flag-reasons-cell">
                      {tx.flagReasons.length > 0 ? (
                        <span className="flag-reasons-text">{tx.flagReasonSummary}</span>
                      ) : (
                        <span className="normal-text">Clean Baseline</span>
                      )}
                    </td>
                    <td>
                      <strong className={`score-badge ${tx.riskScore >= 4 ? "high" : tx.riskScore >= 2 ? "med" : "low"}`}>
                        {tx.riskScore}/6
                      </strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="table-pagination-bar mono">
          <span>Showing {paginatedTransactions.length} of {sortedTransactions.length} matching transactions (Page {pageNumber} of {totalPages})</span>
          <div className="pagination-btns">
            <button
              type="button"
              className="page-btn"
              onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
              disabled={pageNumber === 1}
            >
              ← Previous
            </button>
            <button
              type="button"
              className="page-btn"
              onClick={() => setPageNumber((p) => Math.min(p + 1, totalPages))}
              disabled={pageNumber === totalPages}
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Context Sub-Panel (Last 5 Transactions History for selected Account) */}
      {selectedTx && (
        <div className="account-history-context-panel mono">
          <div className="context-header">
            <div className="context-header-left">
              <span className="pulse-dot" />
              <strong>INVESTIGATION CONTEXT: ACCOUNT {selectedTx.accountId}</strong>
              <span className="occ-tag">[{selectedTx.customerOccupation} • Age {selectedTx.customerAge}]</span>
            </div>
            <div className="context-action-buttons">
              <button
                type="button"
                className="context-btn confirm-btn"
                onClick={() => handleCaseAction("CONFIRMED_FRAUD_ESCALATED")}
              >
                🚨 Confirm Fraud
              </button>
              <button
                type="button"
                className="context-btn clear-btn"
                onClick={() => handleCaseAction("CLEARED_FALSE_POSITIVE")}
              >
                ✓ Clear as False Positive
              </button>
            </div>
          </div>

          {auditActionNotice && (
            <div className="action-notice-box">
              <span className="pulse-dot" />
              <span>{auditActionNotice}</span>
            </div>
          )}

          <div className="history-cards-grid">
            {accountHistory.map((hTx, idx) => (
              <div
                key={hTx.transactionId}
                className={`history-card ${hTx.transactionId === selectedTx.transactionId ? "active-target" : ""}`}
              >
                <div className="h-top">
                  <span className="h-step">#{idx + 1} {hTx.transactionId === selectedTx.transactionId ? "★ CURRENT TARGET" : ""}</span>
                  <span className={`h-risk ${hTx.riskLevel.toLowerCase()}`}>{hTx.riskLevel} ({hTx.riskScore}/6)</span>
                </div>
                <div className="h-details">
                  <div><strong>${hTx.transactionAmount.toFixed(2)}</strong> via {hTx.channel}</div>
                  <div className="h-sub-info">{formatDateTime(hTx.transactionDate)}</div>
                  <div className="h-sub-info">{hTx.location} • Logins: {hTx.loginAttempts}x</div>
                </div>
                <div className="h-reasons">
                  {hTx.flagReasons.length > 0 ? (
                    <span className="red-highlight">{hTx.flagReasonSummary}</span>
                  ) : (
                    <span className="green-text">Clean Baseline</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
