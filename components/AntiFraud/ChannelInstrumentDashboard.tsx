"use client";

import React, { useState, useMemo } from "react";
import {
  computeDashboardAggregates,
  generateSyntheticAntiFraudDataset
} from "@/lib/anti-fraud";
import { AtmChannelDashboard } from "./AtmChannelDashboard";
import { OnlineChannelDashboard } from "./OnlineChannelDashboard";
import { CardTypeAnalysisDashboard } from "./CardTypeAnalysisDashboard";

export function ChannelInstrumentDashboard() {
  const masterDataset = useMemo(() => generateSyntheticAntiFraudDataset(), []);
  const aggregates = useMemo(() => computeDashboardAggregates(masterDataset), [masterDataset]);
  const [activeChannelView, setActiveChannelView] = useState<"atm" | "online" | "cards">("atm");

  return (
    <div className="anti-fraud-dashboard-root standalone-dashboard" id="channel-instruments" aria-label="Channel & Payment Instruments Console">
      {/* Standalone Dashboard Header */}
      <div className="fraud-dashboard-header">
        <div className="fraud-header-top mono">
          <div className="hud-badge">
            <span className="pulse-dot" />
            <strong>02. CHANNEL TOPOLOGY &amp; PAYMENT INSTRUMENT SURVEILLANCE</strong>
          </div>
          <div className="hud-right-tags">
            <span className="hud-local-tag">⚡ 100% LOCAL-FIRST</span>
            <span className="hud-live-tag">ATM • ONLINE • CARD RAILS</span>
          </div>
        </div>

        <div className="standalone-header-bar">
          <p className="standalone-header-sub">
            Dedicated multi-channel surveillance isolating physical ATM dispensers, online/digital banking API endpoints, and payment instrument vulnerability (Debit vs Credit Card rails).
          </p>

          {/* Sub-navigation buttons for the 3 sub-dashboards */}
          <div className="channel-subnav-buttons mono" role="tablist" aria-label="Channel Sub-Dashboards">
            <button
              type="button"
              role="tab"
              aria-selected={activeChannelView === "atm"}
              className={`subnav-btn ${activeChannelView === "atm" ? "active" : ""}`}
              onClick={() => setActiveChannelView("atm")}
            >
              🏧 ATM Terminals
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeChannelView === "online"}
              className={`subnav-btn ${activeChannelView === "online" ? "active" : ""}`}
              onClick={() => setActiveChannelView("online")}
            >
              💻 Online &amp; Digital Banking
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeChannelView === "cards"}
              className={`subnav-btn ${activeChannelView === "cards" ? "active" : ""}`}
              onClick={() => setActiveChannelView("cards")}
            >
              💳 Card Instruments (Debit vs Credit)
            </button>
          </div>
        </div>
      </div>

      {/* Render Active Sub-Dashboard */}
      <div className="channel-subdashboard-content">
        {activeChannelView === "atm" && (
          <AtmChannelDashboard transactions={masterDataset} />
        )}

        {activeChannelView === "online" && (
          <OnlineChannelDashboard
            transactions={masterDataset}
            topMerchants={aggregates.topMerchants}
          />
        )}

        {activeChannelView === "cards" && (
          <CardTypeAnalysisDashboard
            transactions={masterDataset}
            channelRiskMatrix={aggregates.channelRiskMatrix}
          />
        )}
      </div>
    </div>
  );
}
