"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { generateSyntheticAntiFraudDataset, FlaggedTransaction, formatCurrency } from "@/lib/anti-fraud";

interface Point3D {
  x: number;
  y: number;
  z: number;
  tx: FlaggedTransaction;
  decisionScore: number;
  isOddHour: boolean;
  hour: number;
}

interface ProjectedPoint {
  screenX: number;
  screenY: number;
  depth: number;
  scale: number;
  p: Point3D;
}

export function BankingFraud3DAnomalyManifold() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Ingest all 2,512 transactions
  const transactions = useMemo(() => generateSyntheticAntiFraudDataset(), []);

  // Compute 3D feature coordinates and decision score for each transaction
  const points3D = useMemo<Point3D[]>(() => {
    // Normalization bounds:
    // Amount: $20 to $1900 -> log scale ~1.30 to ~3.28
    const minLog = Math.log10(20);
    const maxLog = Math.log10(1920);

    return transactions.map((tx) => {
      const date = new Date(tx.transactionDate);
      const hour = date.getUTCHours() + date.getUTCMinutes() / 60;
      const isOddHour = hour >= 1 && hour <= 4;

      // X: Amount Log Scale mapped to [-240, 240]
      const logAmt = Math.log10(Math.max(20, tx.transactionAmount));
      const normAmt = (logAmt - minLog) / (maxLog - minLog);
      const x = (normAmt - 0.5) * 480;

      // Y: Diurnal Hour mapped to [-200, 200]
      const normHour = hour / 24;
      const y = (normHour - 0.5) * 400;

      // Z: Risk Score mapped to [-130, 130]
      const normRisk = tx.riskScore / 6;
      const z = (normRisk - 0.5) * 260;

      // Composite continuous decision score in [0.0, 1.0]
      const decisionScore = Math.min(
        1.0,
        Math.max(
          0.0,
          0.45 * normRisk + 0.35 * normAmt + (isOddHour ? 0.2 : 0.0)
        )
      );

      return {
        x,
        y,
        z,
        tx,
        decisionScore,
        isOddHour,
        hour,
      };
    });
  }, [transactions]);

  // Interactive State
  const [camera, setCamera] = useState({
    yaw: -0.72,
    pitch: 0.38,
    dist: 640,
  });

  const [threshold, setThreshold] = useState<number>(0.38);
  const [filterMode, setFilterMode] = useState<"ALL" | "FLAGGED" | "ODD_HOURS" | "HIGH_AMOUNT" | "DRAIN">("ALL");
  const [selectedPoint, setSelectedPoint] = useState<Point3D | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<Point3D | null>(null);
  const [showHyperplane, setShowHyperplane] = useState<boolean>(true);
  const [showDensityGrid, setShowDensityGrid] = useState<boolean>(true);

  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  // Real-time Confusion Matrix & Telemetry
  const telemetry = useMemo(() => {
    let tp = 0; // True Positives: Ground-truth flagged and decisionScore >= threshold
    let fp = 0; // False Positives: Ground-truth clean but decisionScore >= threshold
    let tn = 0; // True Negatives: Ground-truth clean and decisionScore < threshold
    let fn = 0; // False Negatives: Ground-truth flagged but decisionScore < threshold
    let totalValueBlocked = 0;

    for (const pt of points3D) {
      const isActualFraud = pt.tx.isFlagged;
      const isPredictedFraud = pt.decisionScore >= threshold;

      if (isPredictedFraud) {
        totalValueBlocked += pt.tx.transactionAmount;
        if (isActualFraud) tp++;
        else fp++;
      } else {
        if (isActualFraud) fn++;
        else tn++;
      }
    }

    const precision = tp + fp > 0 ? (tp / (tp + fp)) * 100 : 100;
    const recall = tp + fn > 0 ? (tp / (tp + fn)) * 100 : 0;
    const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
    const fpr = fp + tn > 0 ? (fp / (fp + tn)) * 100 : 0;

    return {
      tp,
      fp,
      tn,
      fn,
      precision: precision.toFixed(1),
      recall: recall.toFixed(1),
      f1: f1.toFixed(1),
      fpr: fpr.toFixed(2),
      totalValueBlocked,
      blockedCount: tp + fp,
      approvedCount: tn + fn,
    };
  }, [points3D, threshold]);

  // Zoom Handlers
  const handleZoomIn = () => {
    setCamera((prev) => ({
      ...prev,
      dist: Math.max(200, prev.dist - 80),
    }));
  };

  const handleZoomOut = () => {
    setCamera((prev) => ({
      ...prev,
      dist: Math.min(1200, prev.dist + 80),
    }));
  };

  // Mouse / Touch Interaction
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDraggingRef.current) {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };

      setCamera((prev) => ({
        ...prev,
        yaw: prev.yaw + dx * 0.008,
        pitch: Math.max(-1.45, Math.min(1.45, prev.pitch + dy * 0.008)),
      }));
    } else {
      // Raycasting hover detection
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const f = 680;
      const dCam = camera.dist;
      const cosY = Math.cos(camera.yaw);
      const sinY = Math.sin(camera.yaw);
      const cosP = Math.cos(camera.pitch);
      const sinP = Math.sin(camera.pitch);
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      let closest: Point3D | null = null;
      let minDistance = 14;

      for (const pt of points3D) {
        if (filterMode === "FLAGGED" && !pt.tx.isFlagged) continue;
        if (filterMode === "ODD_HOURS" && !pt.isOddHour) continue;
        if (filterMode === "HIGH_AMOUNT" && !pt.tx.flagHighAmount) continue;
        if (filterMode === "DRAIN" && !pt.tx.flagBalanceDrain) continue;

        const x1 = pt.x * cosY - pt.y * sinY;
        const y1 = pt.x * sinY + pt.y * cosY;
        const z2 = pt.z * cosP - y1 * sinP;
        const y2 = pt.z * sinP + y1 * cosP;

        const depth = dCam + y2;
        if (depth <= 40) continue;

        const scale = f / depth;
        const screenX = centerX + x1 * scale;
        const screenY = centerY - z2 * scale;

        const dist = Math.hypot(mouseX - screenX, mouseY - screenY);
        if (dist < minDistance) {
          minDistance = dist;
          closest = pt;
        }
      }

      setHoveredPoint(closest);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setCamera((prev) => ({
      ...prev,
      dist: Math.max(200, Math.min(1200, prev.dist + e.deltaY * 0.45)),
    }));
  };

  const handleCanvasClick = () => {
    if (hoveredPoint) {
      setSelectedPoint(hoveredPoint);
    }
  };

  // Camera Presets
  const setPreset = (preset: "isometric" | "diurnal" | "topdown") => {
    if (preset === "isometric") {
      setCamera({ yaw: -0.72, pitch: 0.38, dist: 640 });
    } else if (preset === "diurnal") {
      setCamera({ yaw: 0, pitch: 0.08, dist: 600 });
    } else if (preset === "topdown") {
      setCamera({ yaw: 0, pitch: 1.52, dist: 620 });
    }
  };

  // 3D Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isSubscribed = true;

    const render = () => {
      if (!isSubscribed) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const targetWidth = Math.floor(rect.width * dpr);
      const targetHeight = Math.floor(rect.height * dpr);

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;

      // Deep space canvas background
      ctx.fillStyle = "#05070c";
      ctx.fillRect(0, 0, width, height);

      // Camera parameters
      const f = 680;
      const dCam = camera.dist;
      const cosY = Math.cos(camera.yaw);
      const sinY = Math.sin(camera.yaw);
      const cosP = Math.cos(camera.pitch);
      const sinP = Math.sin(camera.pitch);

      // 3D coordinate projection helper
      const project3D = (x: number, y: number, z: number) => {
        const x1 = x * cosY - y * sinY;
        const y1 = x * sinY + y * cosY;
        const z2 = z * cosP - y1 * sinP;
        const y2 = z * sinP + y1 * cosP;

        const depth = dCam + y2;
        if (depth <= 40) return null;

        const scale = f / depth;
        return {
          screenX: centerX + x1 * scale,
          screenY: centerY - z2 * scale,
          depth,
          scale,
        };
      };

      // 1. Draw 3D Volumetric Bounding Box & Coordinate Grid
      const bx = 240;
      const by = 200;
      const bz = 130;

      // Draw Floor Grid (Z = -bz)
      if (showDensityGrid) {
        ctx.strokeStyle = "rgba(0, 240, 255, 0.08)";
        ctx.lineWidth = 1;
        const xSteps = 6;
        for (let i = 0; i <= xSteps; i++) {
          const xVal = -bx + (i / xSteps) * (bx * 2);
          const pStart = project3D(xVal, -by, -bz);
          const pEnd = project3D(xVal, by, -bz);
          if (pStart && pEnd) {
            ctx.beginPath();
            ctx.moveTo(pStart.screenX, pStart.screenY);
            ctx.lineTo(pEnd.screenX, pEnd.screenY);
            ctx.stroke();
          }
        }

        const ySteps = 6;
        for (let j = 0; j <= ySteps; j++) {
          const yVal = -by + (j / ySteps) * (by * 2);
          const pStart = project3D(-bx, yVal, -bz);
          const pEnd = project3D(bx, yVal, -bz);
          if (pStart && pEnd) {
            ctx.beginPath();
            ctx.moveTo(pStart.screenX, pStart.screenY);
            ctx.lineTo(pEnd.screenX, pEnd.screenY);
            ctx.stroke();
          }
        }

        // Odd-Hour Twilight Anomaly Band (01:00 - 04:00 UTC) highlighted on floor
        const yOddStart = -by + (1 / 24) * (by * 2);
        const yOddEnd = -by + (4 / 24) * (by * 2);
        const p1 = project3D(-bx, yOddStart, -bz);
        const p2 = project3D(bx, yOddStart, -bz);
        const p3 = project3D(bx, yOddEnd, -bz);
        const p4 = project3D(-bx, yOddEnd, -bz);

        if (p1 && p2 && p3 && p4) {
          ctx.fillStyle = "rgba(244, 63, 94, 0.12)";
          ctx.beginPath();
          ctx.moveTo(p1.screenX, p1.screenY);
          ctx.lineTo(p2.screenX, p2.screenY);
          ctx.lineTo(p3.screenX, p3.screenY);
          ctx.lineTo(p4.screenX, p4.screenY);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = "rgba(244, 63, 94, 0.35)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Draw Bounding Box Wireframe Edges
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 1;
      const corners = [
        [-bx, -by, -bz],
        [bx, -by, -bz],
        [bx, by, -bz],
        [-bx, by, -bz],
        [-bx, -by, bz],
        [bx, -by, bz],
        [bx, by, bz],
        [-bx, by, bz],
      ];

      const projectedCorners = corners.map((c) => project3D(c[0], c[1], c[2]));
      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0], // Bottom
        [4, 5], [5, 6], [6, 7], [7, 4], // Top
        [0, 4], [1, 5], [2, 6], [3, 7], // Vertical Pillars
      ];

      for (const [s, e] of edges) {
        const pS = projectedCorners[s];
        const pE = projectedCorners[e];
        if (pS && pE) {
          ctx.beginPath();
          ctx.moveTo(pS.screenX, pS.screenY);
          ctx.lineTo(pE.screenX, pE.screenY);
          ctx.stroke();
        }
      }

      // Axis Labels in 3D
      ctx.font = 'bold 9.5px "Courier New", monospace';
      ctx.fillStyle = "rgba(0, 240, 255, 0.75)";
      const pAmtLabel = project3D(0, -by - 25, -bz);
      if (pAmtLabel) {
        ctx.textAlign = "center";
        ctx.fillText("X: TRANSACTION AMOUNT ($20 ➔ $1.9k)", pAmtLabel.screenX, pAmtLabel.screenY);
      }

      ctx.fillStyle = "rgba(245, 158, 11, 0.75)";
      const pHourLabel = project3D(bx + 35, 0, -bz);
      if (pHourLabel) {
        ctx.textAlign = "left";
        ctx.fillText("Y: DIURNAL TIME (00:00 ➔ 24:00 UTC)", pHourLabel.screenX, pHourLabel.screenY);
      }

      ctx.fillStyle = "rgba(244, 63, 94, 0.85)";
      const pRiskLabel = project3D(-bx - 15, -by, 0);
      if (pRiskLabel) {
        ctx.textAlign = "right";
        ctx.fillText("Z: ANOMALY SEVERITY", pRiskLabel.screenX, pRiskLabel.screenY);
      }

      // 2. Render 3D Decision Hyperplane (Translucent Neon Slicing Sheet)
      if (showHyperplane) {
        const planeZ = (threshold - 0.5) * 260;
        const hp1 = project3D(-bx, -by, planeZ);
        const hp2 = project3D(bx, -by, planeZ);
        const hp3 = project3D(bx, by, planeZ);
        const hp4 = project3D(-bx, by, planeZ);

        if (hp1 && hp2 && hp3 && hp4) {
          const grad = ctx.createLinearGradient(hp1.screenX, hp1.screenY, hp3.screenX, hp3.screenY);
          grad.addColorStop(0, "rgba(244, 63, 94, 0.22)");
          grad.addColorStop(0.5, "rgba(244, 63, 94, 0.12)");
          grad.addColorStop(1, "rgba(0, 240, 255, 0.18)");

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(hp1.screenX, hp1.screenY);
          ctx.lineTo(hp2.screenX, hp2.screenY);
          ctx.lineTo(hp3.screenX, hp3.screenY);
          ctx.lineTo(hp4.screenX, hp4.screenY);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = "rgba(244, 63, 94, 0.8)";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.font = 'bold 9px "Courier New", monospace';
          ctx.fillStyle = "#f43f5e";
          ctx.textAlign = "left";
          ctx.fillText(`DECISION HYPERPLANE τ = ${threshold.toFixed(2)}`, hp2.screenX + 8, hp2.screenY);
        }
      }

      // 3. Project and Depth-Sort All 2,512 Transaction Particles
      const projectedList: ProjectedPoint[] = [];

      for (const pt of points3D) {
        if (filterMode === "FLAGGED" && !pt.tx.isFlagged) continue;
        if (filterMode === "ODD_HOURS" && !pt.isOddHour) continue;
        if (filterMode === "HIGH_AMOUNT" && !pt.tx.flagHighAmount) continue;
        if (filterMode === "DRAIN" && !pt.tx.flagBalanceDrain) continue;

        const proj = project3D(pt.x, pt.y, pt.z);
        if (proj) {
          projectedList.push({
            screenX: proj.screenX,
            screenY: proj.screenY,
            depth: proj.depth,
            scale: proj.scale,
            p: pt,
          });
        }
      }

      // Sort by depth (farthest first for painters algorithm)
      projectedList.sort((a, b) => b.depth - a.depth);

      // Render Particles
      for (const item of projectedList) {
        const { screenX, screenY, scale, p } = item;
        const isHovered = hoveredPoint?.tx.transactionId === p.tx.transactionId;
        const isSelected = selectedPoint?.tx.transactionId === p.tx.transactionId;
        const isBlocked = p.decisionScore >= threshold;

        const radius = Math.max(1.8, Math.min(8.5, (isBlocked ? 3.6 : 2.2) * scale * 1.5));

        ctx.beginPath();
        ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);

        if (isSelected) {
          ctx.fillStyle = "#ffffff";
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#00f0ff";
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(screenX, screenY, radius + 5, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(0, 240, 255, 0.7)";
          ctx.lineWidth = 1;
          ctx.stroke();
        } else if (isHovered) {
          ctx.fillStyle = "#00f0ff";
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#ffffff";
          ctx.stroke();
        } else if (isBlocked) {
          ctx.fillStyle = p.tx.isFlagged ? "rgba(244, 63, 94, 0.9)" : "rgba(245, 158, 11, 0.8)";
          ctx.fill();
        } else {
          ctx.fillStyle = p.isOddHour ? "rgba(168, 85, 247, 0.55)" : "rgba(56, 189, 248, 0.45)";
          ctx.fill();
        }
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isSubscribed = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [
    camera,
    points3D,
    threshold,
    filterMode,
    hoveredPoint,
    selectedPoint,
    showHyperplane,
    showDensityGrid,
  ]);

  return (
    <div
      className="banking-anomaly-manifold-wrapper"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        margin: "24px 0 40px",
      }}
    >
      {/* Top Filter & Control Ribbon */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          padding: "14px 18px",
          backgroundColor: "var(--panel)",
          border: "1px solid var(--line)",
          borderRadius: 6,
        }}
      >
        {/* Category Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span className="mono" style={{ fontSize: 10, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.08em" }}>
            SLICE MANIFOLD:
          </span>
          {[
            { id: "ALL", label: "ALL 2,512 TXNS" },
            { id: "FLAGGED", label: "🚨 FLAGGED ONLY" },
            { id: "ODD_HOURS", label: "🌙 ODD-HOURS (01-04 UTC)" },
            { id: "HIGH_AMOUNT", label: "💎 HIGH AMOUNT (>3x)" },
            { id: "DRAIN", label: "⚡ BALANCE DRAIN" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterMode(tab.id as typeof filterMode)}
              className="mono"
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "5px 10px",
                borderRadius: 3,
                cursor: "pointer",
                transition: "all 0.15s ease",
                backgroundColor: filterMode === tab.id ? "rgba(0, 240, 255, 0.15)" : "rgba(255, 255, 255, 0.03)",
                color: filterMode === tab.id ? "#00f0ff" : "var(--dim)",
                border: filterMode === tab.id ? "1px solid #00f0ff" : "1px solid var(--line)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Toggles */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 10, color: "var(--muted)" }}>
            <input
              type="checkbox"
              checked={showHyperplane}
              onChange={(e) => setShowHyperplane(e.target.checked)}
              style={{ accentColor: "#f43f5e" }}
            />
            <span className="mono">DECISION HYPERPLANE</span>
          </label>

          <label style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 10, color: "var(--muted)" }}>
            <input
              type="checkbox"
              checked={showDensityGrid}
              onChange={(e) => setShowDensityGrid(e.target.checked)}
              style={{ accentColor: "#00f0ff" }}
            />
            <span className="mono">FLOOR GRID</span>
          </label>
        </div>
      </div>

      {/* Threshold Slider Bar with Live Confusion Matrix Readouts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 2fr",
          gap: 16,
          padding: "14px 18px",
          backgroundColor: "rgba(10, 12, 18, 0.95)",
          border: "1px solid rgba(244, 63, 94, 0.3)",
          borderRadius: 6,
          alignItems: "center",
        }}
      >
        {/* Slider Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="mono" style={{ fontSize: 10, fontWeight: 700, color: "#f43f5e", letterSpacing: "0.06em" }}>
              3D DECISION BOUNDARY THRESHOLD (τ):
            </span>
            <strong className="mono" style={{ fontSize: 14, color: "#ffffff", fontWeight: 800 }}>
              {threshold.toFixed(2)}
            </strong>
          </div>
          <input
            type="range"
            min="0.10"
            max="0.85"
            step="0.01"
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            style={{ width: "100%", accentColor: "#f43f5e", cursor: "ew-resize" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "var(--dim)" }} className="mono">
            <span>Aggressive (High Recall)</span>
            <span>Balanced (τ = 0.38)</span>
            <span>Conservative (High Precision)</span>
          </div>
        </div>

        {/* Real-time Telemetry Metrics Strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 8,
          }}
        >
          <div style={{ backgroundColor: "rgba(255, 255, 255, 0.02)", padding: "8px 10px", borderRadius: 4, border: "1px solid var(--line)" }}>
            <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)", display: "block" }}>PRECISION</span>
            <strong className="mono" style={{ fontSize: 16, color: "#10b981", display: "block", marginTop: 2 }}>{telemetry.precision}%</strong>
            <span style={{ fontSize: 8.5, color: "var(--muted)" }}>TP / (TP + FP)</span>
          </div>
          <div style={{ backgroundColor: "rgba(255, 255, 255, 0.02)", padding: "8px 10px", borderRadius: 4, border: "1px solid var(--line)" }}>
            <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)", display: "block" }}>RECALL</span>
            <strong className="mono" style={{ fontSize: 16, color: "#00f0ff", display: "block", marginTop: 2 }}>{telemetry.recall}%</strong>
            <span style={{ fontSize: 8.5, color: "var(--muted)" }}>Captured Fraud</span>
          </div>
          <div style={{ backgroundColor: "rgba(255, 255, 255, 0.02)", padding: "8px 10px", borderRadius: 4, border: "1px solid var(--line)" }}>
            <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)", display: "block" }}>F1-SCORE</span>
            <strong className="mono" style={{ fontSize: 16, color: "#f59e0b", display: "block", marginTop: 2 }}>{telemetry.f1}%</strong>
            <span style={{ fontSize: 8.5, color: "var(--muted)" }}>Harmonic Mean</span>
          </div>
          <div style={{ backgroundColor: "rgba(255, 255, 255, 0.02)", padding: "8px 10px", borderRadius: 4, border: "1px solid var(--line)" }}>
            <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)", display: "block" }}>BLOCKED CAPITAL</span>
            <strong className="mono" style={{ fontSize: 16, color: "#f43f5e", display: "block", marginTop: 2 }}>{formatCurrency(telemetry.totalValueBlocked)}</strong>
            <span style={{ fontSize: 8.5, color: "var(--muted)" }}>{telemetry.blockedCount} Txns Intercepted</span>
          </div>
        </div>
      </div>

      {/* Main Interactive 3D Canvas Area */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "600px",
          borderRadius: 6,
          overflow: "hidden",
          border: "1px solid rgba(244, 63, 94, 0.25)",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.5), inset 0 0 40px rgba(0, 0, 0, 0.8)",
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onClick={handleCanvasClick}
          style={{ width: "100%", height: "100%", cursor: "grab", display: "block" }}
        />

        {/* HUD Top-Left: Manifold Header */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 16,
            padding: "10px 14px",
            backgroundColor: "rgba(10, 12, 18, 0.85)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(244, 63, 94, 0.2)",
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            pointerEvents: "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className="pulse-dot" style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", backgroundColor: "#f43f5e", boxShadow: "0 0 6px #f43f5e" }} />
            <span className="mono" style={{ fontSize: 9.5, fontWeight: 700, color: "#f43f5e", letterSpacing: "0.06em" }}>
              3D TRANSACTION ANOMALY MANIFOLD
            </span>
          </div>
          <span className="mono" style={{ fontSize: 11, color: "#ffffff", fontWeight: 700 }}>
            {points3D.length} Transactions Projected in 3D Feature Space
          </span>
          <span style={{ fontSize: 9.5, color: "var(--dim)" }}>
            Orbit 360° • Zoom • Hover/Click Points to Inspect Anomaly Vectors
          </span>
        </div>

        {/* HUD Top-Right: Camera Presets & Zoom Buttons */}
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 16,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 6,
            zIndex: 10,
          }}
        >
          {/* Zoom In / Out Pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "rgba(10, 12, 18, 0.9)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(0, 240, 255, 0.25)",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={handleZoomIn}
              className="mono"
              title="Zoom In (+)"
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "6px 10px",
                backgroundColor: "transparent",
                color: "#00f0ff",
                border: "none",
                borderRight: "1px solid rgba(0, 240, 255, 0.2)",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span>+</span>
              <span style={{ fontSize: 9.5 }}>ZOOM IN</span>
            </button>
            <span
              className="mono"
              style={{
                fontSize: 9.5,
                fontWeight: 700,
                color: "var(--dim)",
                padding: "0 8px",
                userSelect: "none",
              }}
            >
              {Math.round((640 / camera.dist) * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomOut}
              className="mono"
              title="Zoom Out (−)"
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "6px 10px",
                backgroundColor: "transparent",
                color: "#00f0ff",
                border: "none",
                borderLeft: "1px solid rgba(0, 240, 255, 0.2)",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span>−</span>
              <span style={{ fontSize: 9.5 }}>ZOOM OUT</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setPreset("isometric")}
            className="mono"
            style={{
              fontSize: 9.5,
              fontWeight: 700,
              padding: "6px 10px",
              backgroundColor: "rgba(10, 12, 18, 0.85)",
              color: "var(--ink)",
              border: "1px solid var(--line)",
              borderRadius: 3,
              cursor: "pointer",
            }}
          >
            3D ISOMETRIC
          </button>
          <button
            type="button"
            onClick={() => setPreset("diurnal")}
            className="mono"
            style={{
              fontSize: 9.5,
              fontWeight: 700,
              padding: "6px 10px",
              backgroundColor: "rgba(10, 12, 18, 0.85)",
              color: "var(--ink)",
              border: "1px solid var(--line)",
              borderRadius: 3,
              cursor: "pointer",
            }}
          >
            DIURNAL TIME (SIDE)
          </button>
          <button
            type="button"
            onClick={() => setPreset("topdown")}
            className="mono"
            style={{
              fontSize: 9.5,
              fontWeight: 700,
              padding: "6px 10px",
              backgroundColor: "rgba(10, 12, 18, 0.85)",
              color: "var(--ink)",
              border: "1px solid var(--line)",
              borderRadius: 3,
              cursor: "pointer",
            }}
          >
            AMOUNT VS TIME (TOP)
          </button>
        </div>

        {/* Floating Vertical Quick Zoom Widget */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: 16,
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            zIndex: 10,
            backgroundColor: "rgba(10, 12, 18, 0.85)",
            backdropFilter: "blur(8px)",
            padding: 4,
            borderRadius: 4,
            border: "1px solid rgba(0, 240, 255, 0.2)",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.5)",
          }}
        >
          <button
            type="button"
            onClick={handleZoomIn}
            className="mono"
            title="Zoom In (+)"
            aria-label="Zoom In"
            style={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 700,
              color: "#00f0ff",
              backgroundColor: "rgba(0, 240, 255, 0.06)",
              border: "1px solid rgba(0, 240, 255, 0.2)",
              borderRadius: 3,
              cursor: "pointer",
            }}
          >
            +
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="mono"
            title="Zoom Out (−)"
            aria-label="Zoom Out"
            style={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 700,
              color: "#00f0ff",
              backgroundColor: "rgba(0, 240, 255, 0.06)",
              border: "1px solid rgba(0, 240, 255, 0.2)",
              borderRadius: 3,
              cursor: "pointer",
            }}
          >
            −
          </button>
        </div>

        {/* HUD Bottom-Left: Color Legend */}
        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: 16,
            padding: "10px 14px",
            backgroundColor: "rgba(10, 12, 18, 0.9)",
            backdropFilter: "blur(8px)",
            border: "1px solid var(--line)",
            borderRadius: 4,
            display: "flex",
            gap: 16,
            fontSize: 9.5,
            pointerEvents: "none",
          }}
          className="mono"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#f43f5e" }} />
            <span style={{ color: "#f43f5e", fontWeight: 700 }}>BLOCKED ANOMALY (&gt;= τ)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#38bdf8" }} />
            <span style={{ color: "#38bdf8" }}>APPROVED NORMAL (&lt; τ)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#a855f7" }} />
            <span style={{ color: "#a855f7" }}>ODD-HOUR TWILIGHT (01-04 UTC)</span>
          </div>
        </div>

        {/* HUD Bottom-Right: Selected / Hovered Transaction Dossier */}
        {(selectedPoint || hoveredPoint) && (
          <div
            style={{
              position: "absolute",
              bottom: 14,
              right: 16,
              width: 320,
              padding: "14px 16px",
              backgroundColor: "rgba(10, 12, 18, 0.94)",
              backdropFilter: "blur(10px)",
              border: `1px solid ${(selectedPoint || hoveredPoint)!.decisionScore >= threshold ? "#f43f5e" : "#00f0ff"}`,
              borderRadius: 4,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.6)",
            }}
          >
            {(() => {
              const pt = selectedPoint || hoveredPoint!;
              const isBlocked = pt.decisionScore >= threshold;
              return (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="mono" style={{ fontSize: 10, fontWeight: 800, color: "#ffffff" }}>
                      {pt.tx.transactionId} • {pt.tx.accountId}
                    </span>
                    <span
                      className="mono"
                      style={{
                        fontSize: 8.5,
                        fontWeight: 800,
                        padding: "2px 6px",
                        borderRadius: 2,
                        backgroundColor: isBlocked ? "rgba(244, 63, 94, 0.2)" : "rgba(16, 185, 129, 0.2)",
                        color: isBlocked ? "#f43f5e" : "#10b981",
                        border: `1px solid ${isBlocked ? "#f43f5e" : "#10b981"}`,
                      }}
                    >
                      {isBlocked ? "BLOCKED BY HYPERPLANE" : "APPROVED"}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    <div style={{ backgroundColor: "rgba(255,255,255,0.02)", padding: "6px 8px", borderRadius: 3 }}>
                      <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>AMOUNT</span>
                      <strong className="mono" style={{ fontSize: 13, color: isBlocked ? "#f43f5e" : "#00f0ff" }}>
                        {formatCurrency(pt.tx.transactionAmount)}
                      </strong>
                    </div>
                    <div style={{ backgroundColor: "rgba(255,255,255,0.02)", padding: "6px 8px", borderRadius: 3 }}>
                      <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>DECISION SCORE</span>
                      <strong className="mono" style={{ fontSize: 13, color: isBlocked ? "#f43f5e" : "#10b981" }}>
                        {pt.decisionScore.toFixed(3)}
                      </strong>
                    </div>
                  </div>

                  <div style={{ fontSize: 10.5, color: "var(--muted)" }}>
                    Time: <strong style={{ color: "var(--ink)" }}>{new Date(pt.tx.transactionDate).toUTCString().slice(17, 22)} UTC</strong> • Channel: <strong style={{ color: "var(--ink)" }}>{pt.tx.channel}</strong> • City: <strong style={{ color: "var(--ink)" }}>{pt.tx.location}</strong>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)" }}>
                      TRIGGERED ANOMALY FLAGS ({pt.tx.riskScore}/6):
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {pt.tx.flagReasons.length > 0 ? (
                        pt.tx.flagReasons.map((f, i) => (
                          <span
                            key={i}
                            className="mono"
                            style={{
                              fontSize: 8,
                              padding: "2px 5px",
                              borderRadius: 2,
                              backgroundColor: "rgba(244, 63, 94, 0.12)",
                              color: "#f43f5e",
                              border: "1px solid rgba(244, 63, 94, 0.25)",
                            }}
                          >
                            {f}
                          </span>
                        ))
                      ) : (
                        <span className="mono" style={{ fontSize: 8, color: "var(--dim)" }}>
                          None (Clean Transaction)
                        </span>
                      )}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
