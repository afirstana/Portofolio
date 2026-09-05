"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  getAntiFraudGraphData,
  Graph3DNode,
  Graph3DEdge,
  SyndicateRing,
  get1HopNeighbors,
  get2HopNeighbors
} from "@/lib/anti-fraud-graph";
import { formatCurrency } from "@/lib/anti-fraud";

export function BankingFraud3DGraph() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Graph Data
  const graphData = useMemo(() => getAntiFraudGraphData(), []);

  // Camera & Interaction State
  const [camera, setCamera] = useState({
    yaw: -0.45,
    pitch: 0.22,
    dist: 580,
    targetX: 0,
    targetY: 0,
    targetZ: 0
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("ACC-1042"); // Default to Ring Alpha core mule
  const [selectedSyndicateId, setSelectedSyndicateId] = useState<"all" | "alpha" | "beta" | "gamma">("alpha");
  const [riskFilter, setRiskFilter] = useState<"ALL" | "HIGH" | "FLAGGED">("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showLaserParticles, setShowLaserParticles] = useState<boolean>(true);
  const [subgraphHopMode, setSubgraphHopMode] = useState<1 | 2>(2);

  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);
  const particleTimeRef = useRef(0);

  // Selected node entity
  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return graphData.nodeIndex.get(selectedNodeId) || null;
  }, [selectedNodeId, graphData]);

  // Active highlighted neighbor set
  const activeNeighborSet = useMemo(() => {
    if (!selectedNodeId) return null;
    if (subgraphHopMode === 1) {
      return get1HopNeighbors(graphData, selectedNodeId);
    }
    return get2HopNeighbors(graphData, selectedNodeId);
  }, [selectedNodeId, subgraphHopMode, graphData]);

  // Selected syndicate details
  const selectedSyndicate = useMemo(() => {
    if (selectedSyndicateId === "all") return null;
    return graphData.syndicates.find(s => s.id === selectedSyndicateId) || null;
  }, [selectedSyndicateId, graphData]);

  // Camera Preset Transitions
  const handleSyndicateSelect = useCallback((synId: "all" | "alpha" | "beta" | "gamma") => {
    setSelectedSyndicateId(synId);
    if (synId === "all") {
      setCamera({ yaw: -0.45, pitch: 0.25, dist: 580, targetX: 0, targetY: 0, targetZ: 0 });
      setSelectedNodeId(null);
    } else {
      const syn = graphData.syndicates.find(s => s.id === synId);
      if (syn) {
        setCamera({
          yaw: syn.targetFocus.yaw,
          pitch: syn.targetFocus.pitch,
          dist: syn.targetFocus.dist,
          targetX: syn.targetFocus.centerX,
          targetY: syn.targetFocus.centerY,
          targetZ: syn.targetFocus.centerZ
        });
        setSelectedNodeId(syn.coreNodeId);
      }
    }
  }, [graphData]);

  // Mouse / Touch Event Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    setCamera(prev => ({
      ...prev,
      yaw: prev.yaw + dx * 0.007,
      pitch: Math.max(-1.4, Math.min(1.4, prev.pitch + dy * 0.007))
    }));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setCamera(prev => ({
      ...prev,
      dist: Math.max(180, Math.min(1100, prev.dist + e.deltaY * 0.4))
    }));
  };

  // Canvas Click Detection (Raycasting 2D Projected Distance)
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const f = 720;
    const dCam = camera.dist;
    const cosY = Math.cos(camera.yaw);
    const sinY = Math.sin(camera.yaw);
    const cosP = Math.cos(camera.pitch);
    const sinP = Math.sin(camera.pitch);
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    let closestNode: Graph3DNode | null = null;
    let minDistance = 16; // Hit radius tolerance in pixels

    for (const node of graphData.nodes) {
      // Relative coordinates
      const relX = node.x - camera.targetX;
      const relY = node.y - camera.targetY;
      const relZ = node.z - camera.targetZ;

      // Rotation
      const x1 = relX * cosY - relZ * sinY;
      const z1 = relX * sinY + relZ * cosY;
      const y2 = relY * cosP - z1 * sinP;
      const z2 = relY * sinP + z1 * cosP;

      const depth = dCam + z2;
      if (depth <= 40) continue;

      const scale = f / depth;
      const screenX = centerX + x1 * scale;
      const screenY = centerY - y2 * scale;

      const dist = Math.hypot(clickX - screenX, clickY - screenY);
      if (dist < minDistance) {
        minDistance = dist;
        closestNode = node;
      }
    }

    if (closestNode) {
      setSelectedNodeId(closestNode.id);
      if (closestNode.syndicateId) {
        setSelectedSyndicateId(closestNode.syndicateId);
      }
    }
  };

  // Main 3D Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isSubscribed = true;

    const render = () => {
      if (!isSubscribed) return;

      // Resize canvas handling high DPI
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

      // Clear Canvas with sleek Cyberpunk deep space background
      ctx.fillStyle = "#050609";
      ctx.fillRect(0, 0, width, height);

      // Draw subtle orbital space grid
      ctx.strokeStyle = "rgba(0, 240, 255, 0.035)";
      ctx.lineWidth = 1;
      const gridStep = 40;
      for (let x = 0; x < width; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Camera projection constants
      const f = 720;
      const dCam = camera.dist;
      const cosY = Math.cos(camera.yaw);
      const sinY = Math.sin(camera.yaw);
      const cosP = Math.cos(camera.pitch);
      const sinP = Math.sin(camera.pitch);

      particleTimeRef.current += 0.018;
      const pTime = particleTimeRef.current;

      // Project all nodes
      interface ProjectedNode {
        node: Graph3DNode;
        screenX: number;
        screenY: number;
        scale: number;
        depth: number;
        visible: boolean;
        isDimmed: boolean;
      }

      const projectedMap = new Map<string, ProjectedNode>();

      for (const node of graphData.nodes) {
        // Filter criteria
        let matchesFilter = true;
        if (riskFilter === "HIGH" && node.riskLevel !== "High") matchesFilter = false;
        if (riskFilter === "FLAGGED" && node.riskScore < 2) matchesFilter = false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          if (!node.id.toLowerCase().includes(q) && !(node.location || "").toLowerCase().includes(q)) {
            matchesFilter = false;
          }
        }

        const isDimmed = activeNeighborSet ? !activeNeighborSet.has(node.id) : !matchesFilter;

        // Relative coordinates
        const relX = node.x - camera.targetX;
        const relY = node.y - camera.targetY;
        const relZ = node.z - camera.targetZ;

        // Yaw then Pitch
        const x1 = relX * cosY - relZ * sinY;
        const z1 = relX * sinY + relZ * cosY;
        const y2 = relY * cosP - z1 * sinP;
        const z2 = relY * sinP + z1 * cosP;

        const depth = dCam + z2;
        if (depth <= 40) {
          projectedMap.set(node.id, { node, screenX: 0, screenY: 0, scale: 0, depth, visible: false, isDimmed });
          continue;
        }

        const scale = f / depth;
        const screenX = centerX + x1 * scale;
        const screenY = centerY - y2 * scale;

        projectedMap.set(node.id, {
          node,
          screenX,
          screenY,
          scale,
          depth,
          visible: screenX >= -50 && screenX <= width + 50 && screenY >= -50 && screenY <= height + 50,
          isDimmed
        });
      }

      // Draw Edges with depth sorting
      interface ProjectedEdge {
        edge: Graph3DEdge;
        srcX: number;
        srcY: number;
        tgtX: number;
        tgtY: number;
        avgDepth: number;
        isDimmed: boolean;
      }

      const projectedEdges: ProjectedEdge[] = [];

      for (const edge of graphData.edges) {
        const pSrc = projectedMap.get(edge.source);
        const pTgt = projectedMap.get(edge.target);
        if (!pSrc || !pTgt || !pSrc.visible || !pTgt.visible) continue;

        const isDimmed = activeNeighborSet
          ? (!activeNeighborSet.has(edge.source) || !activeNeighborSet.has(edge.target))
          : (pSrc.isDimmed && pTgt.isDimmed);

        projectedEdges.push({
          edge,
          srcX: pSrc.screenX,
          srcY: pSrc.screenY,
          tgtX: pTgt.screenX,
          tgtY: pTgt.screenY,
          avgDepth: (pSrc.depth + pTgt.depth) / 2,
          isDimmed
        });
      }

      // Sort edges back-to-front
      projectedEdges.sort((a, b) => b.avgDepth - a.avgDepth);

      for (const pe of projectedEdges) {
        const { edge, srcX, srcY, tgtX, tgtY, isDimmed } = pe;

        let strokeColor = "rgba(0, 240, 255, 0.12)";
        let lineWidth = 0.8;

        if (edge.isFlagged) {
          strokeColor = isDimmed ? "rgba(244, 63, 94, 0.08)" : "rgba(244, 63, 94, 0.45)";
          lineWidth = isDimmed ? 0.6 : 1.5;
        } else if (isDimmed) {
          strokeColor = "rgba(255, 255, 255, 0.02)";
          lineWidth = 0.4;
        }

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(srcX, srcY);
        ctx.lineTo(tgtX, tgtY);
        ctx.stroke();

        // Animate Laser Pulse Particle along Edge
        if (showLaserParticles && !isDimmed && (edge.isFlagged || edge.amount > 3000)) {
          const t = (pTime * 0.8 + edge.particleProgress) % 1.0;
          const px = srcX + (tgtX - srcX) * t;
          const py = srcY + (tgtY - srcY) * t;

          ctx.fillStyle = edge.isFlagged ? "#f43f5e" : "#00f0ff";
          ctx.beginPath();
          ctx.arc(px, py, edge.isFlagged ? 2.4 : 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw Nodes sorted back-to-front
      const sortedNodes = Array.from(projectedMap.values())
        .filter(pn => pn.visible)
        .sort((a, b) => b.depth - a.depth);

      for (const pn of sortedNodes) {
        const { node, screenX, screenY, scale, isDimmed } = pn;
        const isSelected = selectedNodeId === node.id;
        const nodeRadius = Math.max(2.5, node.radius * scale * 0.42);

        let fillColor = "#38bdf8"; // default account
        let glowColor = "rgba(56, 189, 248, 0.25)";

        if (node.type === "device") {
          fillColor = "#a855f7";
          glowColor = "rgba(168, 85, 247, 0.35)";
        } else if (node.type === "atm") {
          fillColor = "#10b981";
          glowColor = "rgba(16, 185, 129, 0.35)";
        } else if (node.riskLevel === "High") {
          fillColor = "#f43f5e";
          glowColor = "rgba(244, 63, 94, 0.55)";
        } else if (node.riskLevel === "Medium") {
          fillColor = "#f59e0b";
          glowColor = "rgba(245, 158, 11, 0.4)";
        }

        ctx.globalAlpha = isDimmed ? 0.08 : 1.0;

        // Halo / Pulsing glow for High Risk or Selected
        if (!isDimmed && (isSelected || node.riskLevel === "High")) {
          ctx.strokeStyle = glowColor;
          ctx.lineWidth = isSelected ? 2.5 : 1.5;
          ctx.beginPath();
          const pulseR = nodeRadius + (isSelected ? 6 + Math.sin(pTime * 4) * 2 : 4);
          ctx.arc(screenX, screenY, pulseR, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Main Node Body
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        if (node.type === "device") {
          // Render device as 3D cube / diamond
          ctx.rect(screenX - nodeRadius, screenY - nodeRadius, nodeRadius * 2, nodeRadius * 2);
        } else {
          ctx.arc(screenX, screenY, nodeRadius, 0, Math.PI * 2);
        }
        ctx.fill();

        // Node Label (for selected or syndicate cores)
        if (!isDimmed && (isSelected || node.syndicateId || scale > 1.2)) {
          ctx.fillStyle = isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.75)";
          ctx.font = isSelected ? "bold 11px monospace" : "9px monospace";
          ctx.textAlign = "center";
          ctx.fillText(node.label, screenX, screenY - nodeRadius - 5);
        }

        ctx.globalAlpha = 1.0;
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isSubscribed = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [camera, graphData, activeNeighborSet, riskFilter, searchQuery, showLaserParticles, selectedNodeId]);

  return (
    <div className="banking-3d-studio-wrapper" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Top Telemetry & Syndicate Selector Controls */}
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
          borderRadius: 6
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span className="mono" style={{ fontSize: 10, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.08em" }}>
            SYNDICATE FOCUS:
          </span>
          {(["all", "alpha", "beta", "gamma"] as const).map(synId => (
            <button
              key={synId}
              onClick={() => handleSyndicateSelect(synId)}
              className="mono"
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "5px 10px",
                borderRadius: 3,
                cursor: "pointer",
                transition: "all 0.15s ease",
                backgroundColor: selectedSyndicateId === synId ? "rgba(0, 240, 255, 0.15)" : "rgba(255, 255, 255, 0.03)",
                color: selectedSyndicateId === synId ? "#00f0ff" : "var(--dim)",
                border: `1px solid ${selectedSyndicateId === synId ? "#00f0ff" : "var(--line)"}`
              }}
            >
              {synId === "all" ? "🌌 ALL ENTITIES" : synId === "alpha" ? "🔴 RING ALPHA" : synId === "beta" ? "🟣 RING BETA" : "🟡 RING GAMMA"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className="mono" style={{ fontSize: 9.5, color: "var(--dim)" }}>SUBGRAPH HOP:</span>
            <button
              onClick={() => setSubgraphHopMode(1)}
              className="mono"
              style={{
                fontSize: 9,
                padding: "3px 7px",
                borderRadius: 2,
                cursor: "pointer",
                backgroundColor: subgraphHopMode === 1 ? "var(--accent)" : "rgba(255, 255, 255, 0.04)",
                color: subgraphHopMode === 1 ? "#000000" : "var(--dim)",
                border: "1px solid var(--line)",
                fontWeight: 700
              }}
            >
              1-HOP
            </button>
            <button
              onClick={() => setSubgraphHopMode(2)}
              className="mono"
              style={{
                fontSize: 9,
                padding: "3px 7px",
                borderRadius: 2,
                cursor: "pointer",
                backgroundColor: subgraphHopMode === 2 ? "var(--accent)" : "rgba(255, 255, 255, 0.04)",
                color: subgraphHopMode === 2 ? "#000000" : "var(--dim)",
                border: "1px solid var(--line)",
                fontWeight: 700
              }}
            >
              2-HOP
            </button>
          </div>

          <label style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 10, color: "var(--muted)" }}>
            <input
              type="checkbox"
              checked={showLaserParticles}
              onChange={e => setShowLaserParticles(e.target.checked)}
              style={{ accentColor: "#00f0ff" }}
            />
            <span className="mono">LASER FUND FLOW</span>
          </label>
        </div>
      </div>

      {/* Main Interactive 3D Canvas Area with Absolute HUD Controls */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "640px",
          borderRadius: 6,
          overflow: "hidden",
          border: "1px solid rgba(0, 240, 255, 0.25)",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.5), inset 0 0 40px rgba(0, 0, 0, 0.8)"
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

        {/* HUD Top-Left: Telemetry Overview Badge */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 16,
            padding: "10px 14px",
            backgroundColor: "rgba(10, 12, 18, 0.85)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(0, 240, 255, 0.2)",
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            pointerEvents: "none"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className="pulse-dot" style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", backgroundColor: "#00f0ff", boxShadow: "0 0 6px #00f0ff" }} />
            <span className="mono" style={{ fontSize: 9.5, fontWeight: 700, color: "#00f0ff", letterSpacing: "0.06em" }}>
              HOLOGRAPHIC SURVEILLANCE ENGINE
            </span>
          </div>
          <span className="mono" style={{ fontSize: 11, color: "#ffffff", fontWeight: 700 }}>
            {graphData.metrics.accountNodes} Accounts • {graphData.metrics.totalEdges} Edges • {graphData.metrics.syndicateRingsCount} Syndicates
          </span>
          <span style={{ fontSize: 9.5, color: "var(--dim)" }}>
            Drag to Orbit 360° • Scroll to Zoom • Click Node to Isolate
          </span>
        </div>

        {/* HUD Top-Right: Quick Camera Presets */}
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 16,
            display: "flex",
            gap: 6
          }}
        >
          <button
            onClick={() => setCamera({ yaw: -0.45, pitch: 0.25, dist: 580, targetX: 0, targetY: 0, targetZ: 0 })}
            className="mono"
            style={{
              fontSize: 9.5,
              fontWeight: 700,
              padding: "6px 10px",
              backgroundColor: "rgba(10, 12, 18, 0.85)",
              color: "var(--ink)",
              border: "1px solid var(--line)",
              borderRadius: 3,
              cursor: "pointer"
            }}
          >
            RESET ORBIT
          </button>
          <button
            onClick={() => setCamera(prev => ({ ...prev, pitch: 1.45, dist: 560 }))}
            className="mono"
            style={{
              fontSize: 9.5,
              fontWeight: 700,
              padding: "6px 10px",
              backgroundColor: "rgba(10, 12, 18, 0.85)",
              color: "var(--ink)",
              border: "1px solid var(--line)",
              borderRadius: 3,
              cursor: "pointer"
            }}
          >
            TOP VIEW
          </button>
        </div>

        {/* HUD Bottom-Left: Syndicate Ring Dossier (if selected) */}
        {selectedSyndicate && (
          <div
            style={{
              position: "absolute",
              bottom: 14,
              left: 16,
              maxWidth: 380,
              padding: "14px 16px",
              backgroundColor: "rgba(10, 12, 18, 0.9)",
              backdropFilter: "blur(10px)",
              border: `1px solid ${selectedSyndicate.color}`,
              borderLeft: `4px solid ${selectedSyndicate.color}`,
              borderRadius: 4,
              display: "flex",
              flexDirection: "column",
              gap: 6
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="mono" style={{ fontSize: 9, fontWeight: 700, color: selectedSyndicate.color, letterSpacing: "0.06em" }}>
                {selectedSyndicate.tag.toUpperCase()}
              </span>
              <span className="mono" style={{ fontSize: 9, color: "var(--dim)" }}>
                EXPOSURE: {formatCurrency(selectedSyndicate.estimatedStolenVolume)}
              </span>
            </div>
            <strong style={{ fontSize: 12.5, color: "#ffffff", lineHeight: 1.3 }}>
              {selectedSyndicate.name}
            </strong>
            <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, lineHeight: 1.45 }}>
              {selectedSyndicate.description}
            </p>
            <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
              <span className="mono" style={{ fontSize: 9, padding: "2px 6px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 2, color: "var(--dim)" }}>
                Typology: {selectedSyndicate.typology}
              </span>
            </div>
          </div>
        )}

        {/* HUD Bottom-Right: Selected Node Forensics Inspector */}
        {selectedNode && (
          <div
            style={{
              position: "absolute",
              bottom: 14,
              right: 16,
              width: 320,
              padding: "14px 16px",
              backgroundColor: "rgba(10, 12, 18, 0.92)",
              backdropFilter: "blur(10px)",
              border: `1px solid ${selectedNode.riskLevel === "High" ? "#f43f5e" : "#00f0ff"}`,
              borderRadius: 4,
              display: "flex",
              flexDirection: "column",
              gap: 8
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="mono" style={{ fontSize: 10, fontWeight: 800, color: "#ffffff" }}>
                {selectedNode.label}
              </span>
              <span
                className="mono"
                style={{
                  fontSize: 8.5,
                  fontWeight: 800,
                  padding: "2px 6px",
                  borderRadius: 2,
                  backgroundColor: selectedNode.riskLevel === "High" ? "rgba(244, 63, 94, 0.2)" : "rgba(0, 240, 255, 0.2)",
                  color: selectedNode.riskLevel === "High" ? "#f43f5e" : "#00f0ff",
                  border: `1px solid ${selectedNode.riskLevel === "High" ? "#f43f5e" : "#00f0ff"}`
                }}
              >
                {selectedNode.riskLevel.toUpperCase()} RISK ({selectedNode.riskScore}/6)
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              <div style={{ backgroundColor: "rgba(255,255,255,0.02)", padding: "6px 8px", borderRadius: 3 }}>
                <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>TOTAL OUTFLOW</span>
                <strong className="mono" style={{ fontSize: 12, color: "#f43f5e" }}>{formatCurrency(selectedNode.totalOutflow)}</strong>
              </div>
              <div style={{ backgroundColor: "rgba(255,255,255,0.02)", padding: "6px 8px", borderRadius: 3 }}>
                <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>TOTAL INFLOW</span>
                <strong className="mono" style={{ fontSize: 12, color: "#10b981" }}>{formatCurrency(selectedNode.totalInflow)}</strong>
              </div>
            </div>

            {selectedNode.occupation && (
              <div style={{ fontSize: 10.5, color: "var(--muted)" }}>
                Profile: <strong style={{ color: "var(--ink)" }}>{selectedNode.occupation}</strong> ({selectedNode.age} yo) • {selectedNode.location}
              </div>
            )}

            {selectedNode.flags.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)" }}>TRIGGERED ANOMALY FLAGS:</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {selectedNode.flags.map((flag, fIdx) => (
                    <span
                      key={fIdx}
                      className="mono"
                      style={{
                        fontSize: 8,
                        padding: "2px 5px",
                        borderRadius: 2,
                        backgroundColor: "rgba(244, 63, 94, 0.12)",
                        color: "#f43f5e",
                        border: "1px solid rgba(244, 63, 94, 0.25)"
                      }}
                    >
                      {flag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
