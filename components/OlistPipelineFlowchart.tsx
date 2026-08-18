"use client";

import React from "react";

export function OlistPipelineFlowchart() {
  const steps = [
    {
      step: "01",
      title: "Raw Transaction Schema Grain",
      tag: "INPUT & AGGREGATION LAYER",
      color: "var(--accent)",
      inputs: ["olist_order_payments.csv (103,886 rows)"],
      operations: [
        "Group by order_id: SUM(payment_value) → Order Total GMV",
        "Compute MAX(payment_installments) → Order Tenor Depth",
        "Assign Dominant Method via argmax(payment_value)",
      ],
      output: "Resolves multi-payment splits (e.g. Voucher + Credit Card co-payments)",
    },
    {
      step: "02",
      title: "Order-Level Analytical Entity",
      tag: "CORE ANALYTICAL GRAIN",
      color: "#38bdf8",
      inputs: ["orders + payments merged (99,440 delivered orders)"],
      operations: [
        "Filter on order_status = 'delivered' (R$ 16.01M total marketplace GMV)",
        "Isolate Credit Card dominant cohort: 74,975 orders (78.4% GMV)",
        "Segment cash & alternative rails: 19.2k Boleto, 3.8k Voucher, 1.5k Debit",
      ],
      output: "Clean 1-row-per-order analytical dataset with financial & installment attributes",
    },
    {
      step: "03",
      title: "First-Item Category & Econometric Attribution",
      tag: "TAXONOMY & SENSITIVITY MAPPING",
      color: "#10b981",
      inputs: ["order_items (min order_item_id) + product_category_name_translation"],
      operations: [
        "Attribute primary basket category via min(order_item_id)",
        "Map 71 Portuguese catalog taxonomy keys to English classifications",
        "Tag High-Ticket Durables vs Fast-Moving Consumables cohorts",
      ],
      output: "Complete econometric modeling dataset for installment elasticity & category sensitivity",
    },
  ];

  return (
    <div
      style={{
        margin: "24px 0 32px",
        backgroundColor: "var(--panel)",
        border: "1px solid var(--line)",
        borderRadius: 4,
        padding: "24px 20px",
      }}
      role="region"
      aria-label="Data Ingestion & Transformation Flowchart"
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, borderBottom: "1px solid var(--line)", paddingBottom: 12 }}>
        <div>
          <span className="mono" style={{ color: "var(--accent)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em" }}>
            PIPELINE ARCHITECTURE • 3-STAGE RELATIONAL FLOW
          </span>
          <h4 style={{ fontSize: 18, color: "var(--ink-heading)", margin: "4px 0 0", fontWeight: 700 }}>
            Ingestion, Aggregation & Category Attribution Flowchart
          </h4>
        </div>
        <span className="mono" style={{ fontSize: 9.5, color: "var(--dim)", border: "1px solid var(--line)", padding: "3px 8px", borderRadius: 2 }}>
          103,886 ROWS ➔ 99,440 ORDERS
        </span>
      </div>

      {/* Flowchart Container (Vertical Connected Nodes) */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, position: "relative" }}>
        {steps.map((item, idx) => (
          <React.Fragment key={item.step}>
            {/* Step Card Node */}
            <div
              style={{
                width: "100%",
                backgroundColor: "var(--surface-secondary)",
                border: `1px solid var(--line)`,
                borderLeft: `4px solid ${item.color}`,
                borderRadius: 4,
                padding: "16px 20px",
                transition: "all 0.15s ease",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              {/* Card Top: Stage Badge & Title */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: 11,
                      fontWeight: 800,
                      color: "#000",
                      backgroundColor: item.color,
                      padding: "2px 7px",
                      borderRadius: 3,
                    }}
                  >
                    STAGE {item.step}
                  </span>
                  <strong style={{ fontSize: 16, color: "var(--ink-heading)" }}>{item.title}</strong>
                </div>
                <span className="mono" style={{ fontSize: 9, color: item.color, border: `1px solid ${item.color}`, padding: "2px 6px", borderRadius: 2 }}>
                  {item.tag}
                </span>
              </div>

              {/* Card Body: 2-Column Inputs & Operations */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 16, alignItems: "start" }}>
                {/* Left: Data Source & Target Output */}
                <div>
                  <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)", display: "block", marginBottom: 3 }}>
                    INPUT REPOSITORIES:
                  </span>
                  {item.inputs.map((inp, iIdx) => (
                    <span
                      key={iIdx}
                      className="mono"
                      style={{
                        display: "inline-block",
                        fontSize: 10.5,
                        color: "var(--ink-heading)",
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                        padding: "3px 7px",
                        borderRadius: 2,
                        border: "1px solid var(--line)",
                        marginBottom: 6,
                      }}
                    >
                      {inp}
                    </span>
                  ))}

                  <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)", display: "block", marginTop: 6, marginBottom: 2 }}>
                    STAGE DELIVERABLE:
                  </span>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--muted)", lineHeight: 1.45 }}>
                    {item.output}
                  </p>
                </div>

                {/* Right: Transformation Logic Rules */}
                <div style={{ backgroundColor: "var(--panel)", padding: "10px 12px", borderRadius: 3, border: "1px solid var(--line)" }}>
                  <span className="mono" style={{ fontSize: 8.5, color: item.color, display: "block", marginBottom: 6, fontWeight: 700 }}>
                    TRANSFORMATION & NORMALIZATION LOGIC:
                  </span>
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11.5, color: "var(--ink)", lineHeight: 1.55 }}>
                    {item.operations.map((op, oIdx) => (
                      <li key={oIdx} style={{ marginBottom: 3 }}>
                        {op}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Downward Connecting Connector Arrow (Only between cards) */}
            {idx < steps.length - 1 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "36px",
                  position: "relative",
                }}
                aria-hidden="true"
              >
                {/* Vertical Line */}
                <div style={{ width: "2px", height: "18px", backgroundColor: "var(--accent)", opacity: 0.6 }} />
                {/* Arrowhead */}
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderTop: "7px solid var(--accent)",
                  }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
