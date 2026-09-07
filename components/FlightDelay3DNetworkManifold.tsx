"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  Airport3DHub,
  FlightCorridor3D,
  TOP_30_AIRPORTS_3D,
  TOP_72_CORRIDORS_3D,
  geoTo3DCartesian,
  project3DToScreen,
  computeParabolicArcPoint,
  Point3D,
  ProjectedHubPoint,
} from "@/lib/flight-delay-3d";

type ViewPreset = "NATIONAL" | "TAXI_ELEVATION" | "RIPPLE_NETWORK" | "TRANSCON";

export function FlightDelay3DNetworkManifold() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Camera State
  const [camera, setCamera] = useState({
    yaw: -0.45,
    pitch: 0.52,
    dist: 580,
  });

  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [activePreset, setActivePreset] = useState<ViewPreset>("NATIONAL");
  const [selectedHubCode, setSelectedHubCode] = useState<string | null>("ORD");
  const [hoveredHubCode, setHoveredHubCode] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<"ALL" | "BOTTLENECKS" | "RIPPLE">("ALL");
  const [animSpeed, setAnimSpeed] = useState<number>(1.0);

  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Precompute 3D base coordinates for all 30 hubs
  const hubs3D = useMemo(() => {
    return TOP_30_AIRPORTS_3D.map((hub) => {
      // Y elevation based on taxi out queue (12m baseline -> 0, 24m -> 84)
      const taxiElevation = Math.max(8, (hub.meanTaxiOut - 12) * 7);
      const basePos = geoTo3DCartesian(hub.lat, hub.lon, 0, 520);
      const topPos = geoTo3DCartesian(hub.lat, hub.lon, taxiElevation, 520);

      return {
        hub,
        basePos,
        topPos,
        taxiElevation,
      };
    });
  }, []);

  // Hub lookup map
  const hubLookup = useMemo(() => {
    const map = new Map<string, (typeof hubs3D)[0]>();
    for (const h of hubs3D) {
      map.set(h.hub.code, h);
    }
    return map;
  }, [hubs3D]);

  // Selected hub record
  const activeHub = useMemo(() => {
    const code = hoveredHubCode || selectedHubCode;
    return TOP_30_AIRPORTS_3D.find((h) => h.code === code) || TOP_30_AIRPORTS_3D[0];
  }, [hoveredHubCode, selectedHubCode]);

  // Corridors connected to selected hub
  const connectedCorridors = useMemo(() => {
    if (!selectedHubCode) return [];
    return TOP_72_CORRIDORS_3D.filter(
      (c) => c.from === selectedHubCode || c.to === selectedHubCode
    );
  }, [selectedHubCode]);

  // Apply View Presets
  const applyPreset = useCallback((preset: ViewPreset) => {
    setActivePreset(preset);
    if (preset === "NATIONAL") {
      setCamera({ yaw: -0.45, pitch: 0.52, dist: 580 });
      setFilterMode("ALL");
    } else if (preset === "TAXI_ELEVATION") {
      setCamera({ yaw: -0.15, pitch: 0.18, dist: 520 });
      setFilterMode("BOTTLENECKS");
      setSelectedHubCode("ORD");
    } else if (preset === "RIPPLE_NETWORK") {
      setCamera({ yaw: -0.75, pitch: 0.65, dist: 560 });
      setFilterMode("RIPPLE");
      setSelectedHubCode("DFW");
    } else if (preset === "TRANSCON") {
      setCamera({ yaw: -1.48, pitch: 0.32, dist: 640 });
      setFilterMode("ALL");
      setSelectedHubCode("JFK");
    }
  }, []);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;

    const render = () => {
      if (!running) return;

      timeRef.current += 0.008 * animSpeed;

      if (isAutoRotating && !isDraggingRef.current) {
        setCamera((prev) => ({
          ...prev,
          yaw: prev.yaw + 0.002,
        }));
      }

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = rect.width;
      const height = rect.height;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Deep Background Fill
      ctx.fillStyle = "#070709";
      ctx.fillRect(0, 0, width, height);

      // 1. Draw 3D Base Reference Grid (Continental US Plane)
      ctx.lineWidth = 1;
      const gridSteps = 8;
      const gridSize = 320;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";

      for (let i = -gridSteps; i <= gridSteps; i++) {
        const offset = (i / gridSteps) * gridSize;
        const p1x = geoTo3DCartesian(25, -125 + (i + gridSteps) * (60 / (gridSteps * 2)), 0);
        const p2x = geoTo3DCartesian(49, -125 + (i + gridSteps) * (60 / (gridSteps * 2)), 0);
        const s1 = project3DToScreen(p1x, camera.yaw, camera.pitch, camera.dist, width, height);
        const s2 = project3DToScreen(p2x, camera.yaw, camera.pitch, camera.dist, width, height);

        if (s1.depth > 0 && s2.depth > 0) {
          ctx.beginPath();
          ctx.moveTo(s1.screenX, s1.screenY);
          ctx.lineTo(s2.screenX, s2.screenY);
          ctx.stroke();
        }
      }

      // 2. Draw 3D Great-Circle Flight Corridors
      for (const corridor of TOP_72_CORRIDORS_3D) {
        const hFrom = hubLookup.get(corridor.from);
        const hTo = hubLookup.get(corridor.to);
        if (!hFrom || !hTo) continue;

        const isConnectedToSelected =
          selectedHubCode && (corridor.from === selectedHubCode || corridor.to === selectedHubCode);
        const isHovered =
          hoveredHubCode && (corridor.from === hoveredHubCode || corridor.to === hoveredHubCode);

        // Filter Logic
        if (filterMode === "BOTTLENECKS") {
          const involvesBottleneck =
            hFrom.hub.isSurfaceBottleneck || hTo.hub.isSurfaceBottleneck;
          if (!involvesBottleneck && !isConnectedToSelected) continue;
        } else if (filterMode === "RIPPLE") {
          if (!corridor.isHighRisk && !isConnectedToSelected) continue;
        }

        const apexHeight = Math.min(85, 24 + corridor.distanceMiles * 0.024 + corridor.rippleRiskPct * 0.35);

        // Segmented Arc Resolution
        const steps = 24;
        const arcPoints: { x: number; y: number; depth: number }[] = [];

        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const p3d = computeParabolicArcPoint(hFrom.topPos, hTo.topPos, t, apexHeight);
          const prj = project3DToScreen(p3d, camera.yaw, camera.pitch, camera.dist, width, height);
          arcPoints.push({ x: prj.screenX, y: prj.screenY, depth: prj.depth });
        }

        // Draw Arc Path
        ctx.beginPath();
        ctx.moveTo(arcPoints[0].x, arcPoints[0].y);
        for (let s = 1; s < arcPoints.length; s++) {
          ctx.lineTo(arcPoints[s].x, arcPoints[s].y);
        }

        if (corridor.isHighRisk || isConnectedToSelected) {
          ctx.strokeStyle = corridor.isHighRisk
            ? "rgba(255, 77, 28, 0.72)" // Accent Problem
            : "rgba(255, 255, 255, 0.65)";
          ctx.lineWidth = isConnectedToSelected ? 2.2 : 1.5;
        } else {
          ctx.strokeStyle = isHovered ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 255, 255, 0.11)";
          ctx.lineWidth = 1;
        }
        ctx.stroke();

        // Animated Flight Beacon Stream along Arc
        const pulseT = (timeRef.current + (corridor.distanceMiles % 100) * 0.01) % 1;
        const beacon3d = computeParabolicArcPoint(hFrom.topPos, hTo.topPos, pulseT, apexHeight);
        const beaconPrj = project3DToScreen(beacon3d, camera.yaw, camera.pitch, camera.dist, width, height);

        if (beaconPrj.depth > 0) {
          ctx.beginPath();
          ctx.arc(beaconPrj.screenX, beaconPrj.screenY, corridor.isHighRisk ? 2.5 : 1.8, 0, Math.PI * 2);
          ctx.fillStyle = corridor.isHighRisk ? "#ff4d1c" : "rgba(255, 255, 255, 0.9)";
          ctx.fill();
        }
      }

      // 3. Project and Sort All 30 Hub Pillars by Depth (Painter's Algorithm)
      const projectedHubs: ProjectedHubPoint[] = [];

      for (const h of hubs3D) {
        const basePrj = project3DToScreen(h.basePos, camera.yaw, camera.pitch, camera.dist, width, height);
        const topPrj = project3DToScreen(h.topPos, camera.yaw, camera.pitch, camera.dist, width, height);

        if (basePrj.depth > 10 && topPrj.depth > 10) {
          projectedHubs.push({
            screenX: topPrj.screenX,
            screenY: basePrj.screenY,
            depth: (basePrj.depth + topPrj.depth) / 2,
            scale: topPrj.scale,
            hub: h.hub,
            pillarTopScreenY: topPrj.screenY,
          });
        }
      }

      projectedHubs.sort((a, b) => b.depth - a.depth);

      // 4. Render Hub Pillars & Telemetry Nodes
      for (const p of projectedHubs) {
        const isSelected = selectedHubCode === p.hub.code;
        const isHovered = hoveredHubCode === p.hub.code;
        const isBottleneck = p.hub.isSurfaceBottleneck;
        const isHighRipple = p.hub.isHighRipple;

        const baseRadius = Math.max(3.5, Math.min(10, (p.hub.departures / 340000) * 8)) * p.scale;
        const pillarHeight = Math.max(6, p.screenY - p.pillarTopScreenY);

        // Ground Foundation Shadow / Base Disk
        ctx.beginPath();
        ctx.ellipse(p.screenX, p.screenY, baseRadius * 1.5, baseRadius * 0.7, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(p.screenX, p.screenY, baseRadius, baseRadius * 0.5, 0, 0, Math.PI * 2);
        ctx.strokeStyle = isBottleneck ? "rgba(255, 77, 28, 0.5)" : "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // 3D Extruded Vertical Pillar Column (Taxi-Out Elevation)
        const colGrad = ctx.createLinearGradient(p.screenX - baseRadius, 0, p.screenX + baseRadius, 0);
        if (isBottleneck) {
          colGrad.addColorStop(0, "rgba(255, 77, 28, 0.35)");
          colGrad.addColorStop(0.5, "rgba(255, 77, 28, 0.85)");
          colGrad.addColorStop(1, "rgba(255, 77, 28, 0.35)");
        } else if (isHighRipple) {
          colGrad.addColorStop(0, "rgba(255, 120, 80, 0.25)");
          colGrad.addColorStop(0.5, "rgba(255, 120, 80, 0.65)");
          colGrad.addColorStop(1, "rgba(255, 120, 80, 0.25)");
        } else {
          colGrad.addColorStop(0, "rgba(255, 255, 255, 0.12)");
          colGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.42)");
          colGrad.addColorStop(1, "rgba(255, 255, 255, 0.12)");
        }

        ctx.fillStyle = colGrad;
        ctx.fillRect(p.screenX - baseRadius * 0.65, p.pillarTopScreenY, baseRadius * 1.3, pillarHeight);

        // Top Disk (Platform)
        ctx.beginPath();
        ctx.ellipse(p.screenX, p.pillarTopScreenY, baseRadius * 0.9, baseRadius * 0.45, 0, 0, Math.PI * 2);
        ctx.fillStyle = isBottleneck
          ? "#ff4d1c"
          : isSelected
          ? "#ffffff"
          : isHighRipple
          ? "#ff7a50"
          : "rgba(255, 255, 255, 0.65)";
        ctx.fill();
        ctx.strokeStyle = isSelected ? "var(--ink-heading)" : "rgba(0, 0, 0, 0.6)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Interactive Selection Aura Ring
        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.ellipse(p.screenX, p.pillarTopScreenY, baseRadius * 2.2, baseRadius * 1.1, 0, 0, Math.PI * 2);
          ctx.strokeStyle = isBottleneck ? "rgba(255, 77, 28, 0.85)" : "rgba(255, 255, 255, 0.75)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // IATA Airport Code Text Label
        if (p.scale > 0.45 || isSelected || isBottleneck) {
          ctx.font = `700 ${Math.max(9, Math.round(11 * p.scale))}px 'Courier New', monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";

          // Label Background Pill
          const labelText = p.hub.code;
          const textWidth = ctx.measureText(labelText).width;
          const labelY = p.pillarTopScreenY - 4;

          ctx.fillStyle = "rgba(10, 10, 14, 0.85)";
          ctx.fillRect(p.screenX - textWidth / 2 - 3, labelY - 11, textWidth + 6, 13);
          ctx.strokeStyle = isBottleneck ? "rgba(255, 77, 28, 0.6)" : "rgba(255, 255, 255, 0.2)";
          ctx.strokeRect(p.screenX - textWidth / 2 - 3, labelY - 11, textWidth + 6, 13);

          ctx.fillStyle = isBottleneck ? "#ff4d1c" : isSelected ? "#ffffff" : "var(--ink)";
          ctx.fillText(labelText, p.screenX, labelY);
        }
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [camera, isAutoRotating, selectedHubCode, hoveredHubCode, filterMode, animSpeed, hubs3D, hubLookup]);

  // Mouse Interaction: Click & Drag Orbit
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
        yaw: prev.yaw + dx * 0.006,
        pitch: Math.max(0.08, Math.min(1.45, prev.pitch + dy * 0.006)),
      }));
      return;
    }

    // Hit Testing for Hover
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let closestHub: string | null = null;
    let minDist = 22;

    for (const h of hubs3D) {
      const topPrj = project3DToScreen(h.topPos, camera.yaw, camera.pitch, camera.dist, rect.width, rect.height);
      const d = Math.hypot(topPrj.screenX - mouseX, topPrj.screenY - mouseY);
      if (d < minDist) {
        minDist = d;
        closestHub = h.hub.code;
      }
    }

    setHoveredHubCode(closestHub);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    for (const h of hubs3D) {
      const topPrj = project3DToScreen(h.topPos, camera.yaw, camera.pitch, camera.dist, rect.width, rect.height);
      const d = Math.hypot(topPrj.screenX - mouseX, topPrj.screenY - mouseY);
      if (d < 24) {
        setSelectedHubCode(h.hub.code === selectedHubCode ? null : h.hub.code);
        return;
      }
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setCamera((prev) => ({
      ...prev,
      dist: Math.max(340, Math.min(960, prev.dist + e.deltaY * 0.6)),
    }));
  };

  return (
    <div
      className="flight-delay-3d-manifold"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        margin: "24px 0",
      }}
    >
      {/* 3D STUDIO TELEMETRY HEADER & VIEW PRESETS */}
      <header
        style={{
          backgroundColor: "var(--panel)",
          border: "1px solid var(--line)",
          borderRadius: 4,
          padding: "18px 22px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 14,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="mono" style={{ color: "var(--accent)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>
              BTS TRANSTATS 2024 • 3D AIRSPACE TOPOLOGY
            </span>
            <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--accent)", display: "inline-block" }} />
          </div>
          <strong style={{ fontSize: "clamp(17px, 2vw, 22px)", color: "var(--ink-heading)", display: "block", marginTop: 4 }}>
            3D National Airspace Delay Topology &amp; Rotational Ripple Manifold
          </strong>
          <p style={{ fontSize: 13, color: "var(--muted)", margin: "4px 0 0", maxWidth: 740 }}>
            Visualizing 30 national mega hubs and 72 major flight corridors. Pillar height tracks surface taxi-out duration (<strong>ORD 23.8m</strong> &amp; <strong>LGA 23.5m</strong>), while arc apex elevation isolates cascading late-turn propagation.
          </p>
        </div>

        {/* View Preset Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <button
            type="button"
            className="mono"
            onClick={() => applyPreset("NATIONAL")}
            style={{
              padding: "6px 12px",
              borderRadius: 3,
              fontSize: 11,
              cursor: "pointer",
              backgroundColor: activePreset === "NATIONAL" ? "var(--accent-subtle)" : "var(--surface)",
              border: activePreset === "NATIONAL" ? "1px solid var(--accent)" : "1px solid var(--line)",
              color: activePreset === "NATIONAL" ? "var(--accent)" : "var(--muted)",
              fontWeight: activePreset === "NATIONAL" ? 700 : 500,
            }}
          >
            National Overview
          </button>
          <button
            type="button"
            className="mono"
            onClick={() => applyPreset("TAXI_ELEVATION")}
            style={{
              padding: "6px 12px",
              borderRadius: 3,
              fontSize: 11,
              cursor: "pointer",
              backgroundColor: activePreset === "TAXI_ELEVATION" ? "var(--accent-subtle)" : "var(--surface)",
              border: activePreset === "TAXI_ELEVATION" ? "1px solid var(--accent)" : "1px solid var(--line)",
              color: activePreset === "TAXI_ELEVATION" ? "var(--accent)" : "var(--muted)",
              fontWeight: activePreset === "TAXI_ELEVATION" ? 700 : 500,
            }}
          >
            Taxi Bottlenecks (Elevation)
          </button>
          <button
            type="button"
            className="mono"
            onClick={() => applyPreset("RIPPLE_NETWORK")}
            style={{
              padding: "6px 12px",
              borderRadius: 3,
              fontSize: 11,
              cursor: "pointer",
              backgroundColor: activePreset === "RIPPLE_NETWORK" ? "var(--accent-subtle)" : "var(--surface)",
              border: activePreset === "RIPPLE_NETWORK" ? "1px solid var(--accent)" : "1px solid var(--line)",
              color: activePreset === "RIPPLE_NETWORK" ? "var(--accent)" : "var(--muted)",
              fontWeight: activePreset === "RIPPLE_NETWORK" ? 700 : 500,
            }}
          >
            Ripple Cascades
          </button>
          <button
            type="button"
            className="mono"
            onClick={() => applyPreset("TRANSCON")}
            style={{
              padding: "6px 12px",
              borderRadius: 3,
              fontSize: 11,
              cursor: "pointer",
              backgroundColor: activePreset === "TRANSCON" ? "var(--accent-subtle)" : "var(--surface)",
              border: activePreset === "TRANSCON" ? "1px solid var(--accent)" : "1px solid var(--line)",
              color: activePreset === "TRANSCON" ? "var(--accent)" : "var(--muted)",
              fontWeight: activePreset === "TRANSCON" ? 700 : 500,
            }}
          >
            Transcontinental
          </button>
        </div>
      </header>

      {/* 3D INTERACTIVE CANVAS & OVERLAY HUD */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 560,
          backgroundColor: "#070709",
          border: "1px solid var(--line)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={handleClick}
          onWheel={handleWheel}
          style={{
            width: "100%",
            height: "100%",
            cursor: isDraggingRef.current ? "grabbing" : "grab",
            display: "block",
          }}
        />

        {/* Top-Left Telemetry Overlay HUD */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            backgroundColor: "rgba(11, 11, 14, 0.88)",
            border: "1px solid var(--line)",
            backdropFilter: "blur(8px)",
            borderRadius: 3,
            padding: "10px 14px",
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
          className="mono"
        >
          <span style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.08em" }}>
            AIRSPACE METRICS (TOP 30 HUBS)
          </span>
          <div style={{ fontSize: 12, color: "var(--ink-heading)", fontWeight: 700 }}>
            30 HUBS • 72 MONITORED CORRIDORS
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>
            ROTATION YAW: {((camera.yaw * 180) / Math.PI).toFixed(0)}° • PITCH: {((camera.pitch * 180) / Math.PI).toFixed(0)}°
          </div>
        </div>

        {/* Top-Right Control Actions */}
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <button
            type="button"
            className="mono"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            style={{
              padding: "6px 10px",
              backgroundColor: "rgba(16, 16, 20, 0.85)",
              border: "1px solid var(--line)",
              color: isAutoRotating ? "var(--accent)" : "var(--muted)",
              fontSize: 10.5,
              borderRadius: 3,
              cursor: "pointer",
              backdropFilter: "blur(6px)",
            }}
          >
            {isAutoRotating ? "⏸ Pause Rotation" : "▶ Auto Rotate"}
          </button>
          <button
            type="button"
            className="mono"
            onClick={() => setAnimSpeed(animSpeed === 1 ? 2 : animSpeed === 2 ? 0.5 : 1)}
            style={{
              padding: "6px 10px",
              backgroundColor: "rgba(16, 16, 20, 0.85)",
              border: "1px solid var(--line)",
              color: "var(--ink)",
              fontSize: 10.5,
              borderRadius: 3,
              cursor: "pointer",
              backdropFilter: "blur(6px)",
            }}
          >
            Speed: {animSpeed}×
          </button>
          <button
            type="button"
            className="mono"
            onClick={() => setCamera({ yaw: -0.45, pitch: 0.52, dist: 580 })}
            style={{
              padding: "6px 10px",
              backgroundColor: "rgba(16, 16, 20, 0.85)",
              border: "1px solid var(--line)",
              color: "var(--muted)",
              fontSize: 10.5,
              borderRadius: 3,
              cursor: "pointer",
              backdropFilter: "blur(6px)",
            }}
          >
            Reset View
          </button>
        </div>

        {/* Bottom-Left Legend HUD */}
        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: 14,
            backgroundColor: "rgba(11, 11, 14, 0.88)",
            border: "1px solid var(--line)",
            backdropFilter: "blur(8px)",
            borderRadius: 3,
            padding: "8px 14px",
            display: "flex",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
            pointerEvents: "none",
          }}
          className="mono"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: "var(--accent)" }} />
            <span style={{ color: "var(--accent)", fontWeight: 700 }}>Surface Bottleneck (&gt;21m)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: "rgba(255, 255, 255, 0.45)" }} />
            <span style={{ color: "var(--muted)" }}>Standard Trunk Flow</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
            <span style={{ color: "var(--dim)" }}>↕ Pillar Height = Taxi-Out Queue</span>
          </div>
        </div>
      </div>

      {/* DETAILED INSPECTION DOCK (SELECTED HUB TELEMETRY) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 12,
        }}
      >
        {/* Selected Hub Profile Card */}
        <div
          style={{
            backgroundColor: "var(--panel)",
            border: activeHub.isSurfaceBottleneck ? "1px solid var(--accent)" : "1px solid var(--line)",
            borderLeft: activeHub.isSurfaceBottleneck ? "3px solid var(--accent)" : "1px solid var(--line)",
            borderRadius: 4,
            padding: "16px 20px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="mono" style={{ fontSize: 22, fontWeight: 800, color: activeHub.isSurfaceBottleneck ? "var(--accent)" : "var(--ink-heading)" }}>
                  {activeHub.code}
                </span>
                <span className="mono" style={{ fontSize: 11, padding: "2px 6px", borderRadius: 2, backgroundColor: "var(--surface)", border: "1px solid var(--line)", color: "var(--muted)" }}>
                  {activeHub.state}
                </span>
                {activeHub.isSurfaceBottleneck && (
                  <span className="mono" style={{ fontSize: 10, padding: "2px 6px", borderRadius: 2, backgroundColor: "var(--accent-subtle)", color: "var(--accent)", fontWeight: 700 }}>
                    #SURFACE_BOTTLENECK
                  </span>
                )}
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-heading)", marginTop: 2, fontWeight: 600 }}>
                {activeHub.name}
              </div>
            </div>
            <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>
              {activeHub.metro}
            </span>
          </div>

          <div
            className="mono"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 8,
              marginTop: 16,
              paddingTop: 12,
              borderTop: "1px solid var(--line)",
            }}
          >
            <div>
              <span style={{ fontSize: 10, color: "var(--muted)", display: "block" }}>DEPARTURES</span>
              <strong style={{ fontSize: 14, color: "var(--ink-heading)", display: "block", marginTop: 2 }}>
                {activeHub.departures.toLocaleString()}
              </strong>
            </div>
            <div>
              <span style={{ fontSize: 10, color: "var(--muted)", display: "block" }}>DELAY RATE</span>
              <strong style={{ fontSize: 14, color: activeHub.delayRatePct >= 25 ? "var(--accent)" : "var(--ink)", display: "block", marginTop: 2 }}>
                {activeHub.delayRatePct.toFixed(1)}%
              </strong>
            </div>
            <div>
              <span style={{ fontSize: 10, color: "var(--muted)", display: "block" }}>TAXI QUEUE</span>
              <strong style={{ fontSize: 14, color: activeHub.meanTaxiOut >= 21 ? "var(--accent)" : "var(--ink-heading)", display: "block", marginTop: 2 }}>
                {activeHub.meanTaxiOut.toFixed(1)}m
              </strong>
            </div>
            <div>
              <span style={{ fontSize: 10, color: "var(--muted)", display: "block" }}>LATE RIPPLE</span>
              <strong style={{ fontSize: 14, color: activeHub.lateAircraftPct >= 45 ? "var(--accent)" : "var(--ink)", display: "block", marginTop: 2 }}>
                {activeHub.lateAircraftPct.toFixed(1)}%
              </strong>
            </div>
          </div>
        </div>

        {/* Connected Flight Corridors Card */}
        <div
          style={{
            backgroundColor: "var(--panel)",
            border: "1px solid var(--line)",
            borderRadius: 4,
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span className="mono" style={{ fontSize: 10.5, color: "var(--muted)", letterSpacing: "0.06em", display: "block" }}>
              CONNECTED AIRSPACE CORRIDORS ({connectedCorridors.length} MONITORED ROUTES)
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
              {connectedCorridors.length > 0 ? (
                connectedCorridors.map((c) => {
                  const dest = c.from === activeHub.code ? c.to : c.from;
                  return (
                    <div
                      key={c.id}
                      className="mono"
                      style={{
                        padding: "4px 8px",
                        borderRadius: 3,
                        backgroundColor: c.isHighRisk ? "var(--accent-subtle)" : "var(--surface)",
                        border: c.isHighRisk ? "1px solid var(--accent)" : "1px solid var(--line)",
                        fontSize: 11,
                        color: c.isHighRisk ? "var(--accent)" : "var(--ink)",
                      }}
                      title={`${c.from} ➔ ${c.to} | ${c.dailyFlights} daily flights | ${c.distanceMiles} mi | Ripple Risk: ${c.rippleRiskPct}%`}
                    >
                      <span>{dest}</span>{" "}
                      <span style={{ color: "var(--muted)", fontSize: 10 }}>({c.dailyFlights}/d)</span>
                    </div>
                  );
                })
              ) : (
                <span style={{ fontSize: 12, color: "var(--muted)" }}>Click any hub node above to inspect connected routes.</span>
              )}
            </div>
          </div>

          <div className="mono" style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 12, paddingTop: 8, borderTop: "1px solid var(--line)" }}>
            Tip: Drag to orbit 3D camera • Scroll to zoom • Click hub node to inspect corridors
          </div>
        </div>
      </div>
    </div>
  );
}
