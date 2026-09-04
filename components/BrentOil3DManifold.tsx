"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import rawData from "@/content/data/brent_oil_analysis.json";

export interface CrisisPin {
  id: string;
  year: number;
  date: string;
  name: string;
  tag: string;
  price: number;
  pctImpact: number;
  description: string;
  returnShock: number; // approximate daily shock %
  volatilitySpike: number; // normalized elevation
}

export const HISTORICAL_CRISIS_PINS: CrisisPin[] = [
  {
    id: "gulf-war",
    year: 1990,
    date: "1990-08-02",
    name: "Gulf War (Kuwait Invasion)",
    tag: "Supply Shock",
    price: 22.25,
    pctImpact: 59.7,
    description: "Iraqi invasion triggered immediate oil supply shock and Middle Eastern geopolitical panic, price surged by +59.7% in 30 days.",
    returnShock: 8.5,
    volatilitySpike: 8.8,
  },
  {
    id: "asian-crisis",
    year: 1998,
    date: "1998-12-10",
    name: "Asian Financial Crisis & Oil Glut",
    tag: "Demand Shock",
    price: 9.55,
    pctImpact: -38.4,
    description: "Severe Asian economic contraction collapsed demand while OPEC delayed cuts, driving prices to historic lows below $9.60/bbl.",
    returnShock: -6.8,
    volatilitySpike: 6.2,
  },
  {
    id: "supercycle-ath",
    year: 2008,
    date: "2008-07-03",
    name: "Commodity Supercycle All-Time High",
    tag: "Price Spike ($143.95)",
    price: 143.95,
    pctImpact: 112.5,
    description: "Peak industrialization in China and emerging markets drove Brent to $143.95/bbl before the Lehman collapse plunged it to $33.73.",
    returnShock: 10.4,
    volatilitySpike: 9.9,
  },
  {
    id: "arab-spring",
    year: 2011,
    date: "2011-04-11",
    name: "Arab Spring & Libyan War",
    tag: "Geopolitical Shock",
    price: 126.65,
    pctImpact: 35.2,
    description: "Revolutions in North Africa and Libyan civil war took 1.5M bpd offline, keeping oil sustainably above $100 for 3.5 years.",
    returnShock: 5.8,
    volatilitySpike: 6.5,
  },
  {
    id: "shale-war",
    year: 2014,
    date: "2014-11-27",
    name: "US Shale Boom & OPEC Price War",
    tag: "Structural Oversupply",
    price: 114.55,
    pctImpact: -58.2,
    description: "Unprecedented US horizontal fracking oversupply met OPEC refusal to cut production, triggering a multi-year price rout to $27/bbl.",
    returnShock: -7.5,
    volatilitySpike: 7.4,
  },
  {
    id: "covid-nadir",
    year: 2020,
    date: "2020-04-21",
    name: "COVID-19 Demand Crash & Market Nadir",
    tag: "Demand Collapse ($9.10)",
    price: 9.10,
    pctImpact: -68.4,
    description: "Global transport lockdowns erased 30% of global oil demand while storage filled to capacity, driving physical spot down to $9.10/bbl.",
    returnShock: -14.2,
    volatilitySpike: 10.0,
  },
  {
    id: "russia-ukraine",
    year: 2022,
    date: "2022-03-08",
    name: "Russia-Ukraine War & Sanctions",
    tag: "Supply Dislocation",
    price: 133.18,
    pctImpact: 46.8,
    description: "Invasion of Ukraine and European energy embargo fears spiked prompt prices to $139/bbl with historic backwardation curves.",
    returnShock: 9.8,
    volatilitySpike: 8.9,
  },
];

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface ProjectedPoint {
  x: number;
  y: number;
  zDepth: number;
  world: Point3D;
}

interface Quad3D {
  p1: ProjectedPoint;
  p2: ProjectedPoint;
  p3: ProjectedPoint;
  p4: ProjectedPoint;
  avgDepth: number;
  avgElevation: number;
}

export function BrentOil3DManifold() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [yaw, setYaw] = useState<number>(-0.75);
  const [pitch, setPitch] = useState<number>(0.52);
  const [zoom, setZoom] = useState<number>(1.05);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [renderMode, setRenderMode] = useState<"wireframe" | "shaded" | "hybrid">("hybrid");
  const [selectedCrisis, setSelectedCrisis] = useState<CrisisPin | null>(HISTORICAL_CRISIS_PINS[5]);

  const isDragging = useRef<boolean>(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameId = useRef<number>(0);
  const targetCam = useRef<{ yaw: number; pitch: number; zoom: number } | null>(null);

  const { gridPoints, years, shocks, yearIndexMap } = useMemo(() => {
    const startYear = 1987;
    const endYear = 2024;
    const yearList: number[] = [];
    for (let y = startYear; y <= endYear; y++) yearList.push(y);

    const shockList: number[] = [];
    for (let s = -14; s <= 14; s += 1.55) {
      shockList.push(Math.round(s * 10) / 10);
    }

    const map = new Map<number, number>();
    yearList.forEach((y, i) => map.set(y, i));

    const matrix: Point3D[][] = [];

    yearList.forEach((year, xi) => {
      matrix[xi] = [];
      const crisis = HISTORICAL_CRISIS_PINS.find((c) => c.year === year);

      let eraVol = 1.8;
      if (year >= 1990 && year <= 1991) eraVol = 4.2;
      else if (year >= 1997 && year <= 1999) eraVol = 3.4;
      else if (year >= 2007 && year <= 2009) eraVol = 4.8;
      else if (year >= 2014 && year <= 2016) eraVol = 3.7;
      else if (year >= 2020 && year <= 2022) eraVol = 5.2;

      shockList.forEach((shock, yi) => {
        const normDist = Math.exp(-0.5 * Math.pow(shock / eraVol, 2));
        let elevation = normDist * 5.5;

        if (crisis) {
          const distToShock = Math.abs(shock - crisis.returnShock);
          const fatTailSpike = Math.exp(-0.5 * Math.pow(distToShock / 1.8, 2)) * crisis.volatilitySpike;
          elevation = Math.max(elevation, fatTailSpike);
        }

        elevation += Math.sin(xi * 0.4 + yi * 0.3) * 0.15;
        if (elevation < 0.05) elevation = 0.05;

        matrix[xi][yi] = {
          x: (xi / (yearList.length - 1) - 0.5) * 380,
          y: (yi / (shockList.length - 1) - 0.5) * 260,
          z: (elevation / 10) * 160,
        };
      });
    });

    return { gridPoints: matrix, years: yearList, shocks: shockList, yearIndexMap: map };
  }, []);

  const setPreset = useCallback((preset: "isometric" | "topdown" | "fattail") => {
    setIsAutoRotate(false);
    if (preset === "isometric") {
      targetCam.current = { yaw: -0.75, pitch: 0.52, zoom: 1.05 };
    } else if (preset === "topdown") {
      targetCam.current = { yaw: 0, pitch: 1.54, zoom: 1.15 };
    } else if (preset === "fattail") {
      targetCam.current = { yaw: 0, pitch: 0.08, zoom: 1.25 };
    }
  }, []);

  const selectCrisis = useCallback(
    (pin: CrisisPin) => {
      setSelectedCrisis(pin);
      setIsAutoRotate(false);
      const xi = yearIndexMap.get(pin.year) ?? 15;
      const normalizedX = xi / (years.length - 1) - 0.5;
      targetCam.current = {
        yaw: -0.65 - normalizedX * 0.4,
        pitch: 0.48,
        zoom: 1.18,
      };
    },
    [yearIndexMap, years.length]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let localYaw = yaw;
    let localPitch = pitch;
    let localZoom = zoom;

    const render = () => {
      if (isAutoRotate && !isDragging.current) {
        localYaw += 0.003;
        setYaw(localYaw);
      }

      if (targetCam.current) {
        localYaw += (targetCam.current.yaw - localYaw) * 0.1;
        localPitch += (targetCam.current.pitch - localPitch) * 0.1;
        localZoom += (targetCam.current.zoom - localZoom) * 0.1;

        if (
          Math.abs(targetCam.current.yaw - localYaw) < 0.001 &&
          Math.abs(targetCam.current.pitch - localPitch) < 0.001 &&
          Math.abs(targetCam.current.zoom - localZoom) < 0.001
        ) {
          targetCam.current = null;
        }
        setYaw(localYaw);
        setPitch(localPitch);
        setZoom(localZoom);
      }

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width * 0.7);
      bgGrad.addColorStop(0, "#0e131d");
      bgGrad.addColorStop(0.6, "#080c14");
      bgGrad.addColorStop(1, "#03060a");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2 + 35;
      const focalLength = 550 * localZoom;
      const camDist = 600;

      const project = (p: Point3D): ProjectedPoint => {
        const cosY = Math.cos(localYaw);
        const sinY = Math.sin(localYaw);
        const x1 = p.x * cosY - p.y * sinY;
        const y1 = p.x * sinY + p.y * cosY;

        const cosP = Math.cos(localPitch);
        const sinP = Math.sin(localPitch);
        const y2 = y1 * cosP - p.z * sinP;
        const z2 = y1 * sinP + p.z * cosP;

        const distance = camDist + z2;
        const f = focalLength / Math.max(distance, 50);

        return {
          x: cx + x1 * f,
          y: cy - y2 * f,
          zDepth: distance,
          world: p,
        };
      };

      const projectedGrid: ProjectedPoint[][] = [];
      for (let i = 0; i < gridPoints.length; i++) {
        projectedGrid[i] = [];
        for (let j = 0; j < gridPoints[i].length; j++) {
          projectedGrid[i][j] = project(gridPoints[i][j]);
        }
      }

      const quads: Quad3D[] = [];
      for (let i = 0; i < gridPoints.length - 1; i++) {
        for (let j = 0; j < gridPoints[i].length - 1; j++) {
          const p1 = projectedGrid[i][j];
          const p2 = projectedGrid[i + 1][j];
          const p3 = projectedGrid[i + 1][j + 1];
          const p4 = projectedGrid[i][j + 1];

          const avgDepth = (p1.zDepth + p2.zDepth + p3.zDepth + p4.zDepth) / 4;
          const avgElevation = (p1.world.z + p2.world.z + p3.world.z + p4.world.z) / 4;

          quads.push({ p1, p2, p3, p4, avgDepth, avgElevation });
        }
      }

      quads.sort((a, b) => b.avgDepth - a.avgDepth);

      quads.forEach((quad) => {
        ctx.beginPath();
        ctx.moveTo(quad.p1.x, quad.p1.y);
        ctx.lineTo(quad.p2.x, quad.p2.y);
        ctx.lineTo(quad.p3.x, quad.p3.y);
        ctx.lineTo(quad.p4.x, quad.p4.y);
        ctx.closePath();

        const normZ = Math.min(Math.max(quad.avgElevation / 140, 0), 1);

        if (renderMode === "shaded" || renderMode === "hybrid") {
          let r = 0;
          let g = 240;
          let b = 255;
          let alpha = 0.22 + normZ * 0.55;

          if (normZ < 0.4) {
            const t = normZ / 0.4;
            r = Math.round(0 + t * 40);
            g = Math.round(220 + t * 20);
            b = Math.round(255 - t * 50);
          } else if (normZ < 0.75) {
            const t = (normZ - 0.4) / 0.35;
            r = Math.round(40 + t * 205);
            g = Math.round(240 - t * 85);
            b = Math.round(205 - t * 190);
          } else {
            const t = (normZ - 0.75) / 0.25;
            r = Math.round(245 + t * 10);
            g = Math.round(155 - t * 105);
            b = Math.round(15 + t * 55);
          }

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.fill();
        }

        if (renderMode === "wireframe" || renderMode === "hybrid") {
          ctx.lineWidth = 0.8;
          ctx.strokeStyle =
            normZ > 0.65
              ? `rgba(244, 63, 94, ${0.45 + normZ * 0.4})`
              : normZ > 0.3
              ? `rgba(245, 158, 11, ${0.35 + normZ * 0.3})`
              : "rgba(0, 240, 255, 0.22)";
          ctx.stroke();
        }
      });

      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";

      const tStart = projectedGrid[0][0];
      const tEnd = projectedGrid[gridPoints.length - 1][0];
      ctx.beginPath();
      ctx.moveTo(tStart.x, tStart.y);
      ctx.lineTo(tEnd.x, tEnd.y);
      ctx.stroke();

      ctx.font = '10px "Courier New", monospace';
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.textAlign = "center";
      [1987, 1995, 2003, 2011, 2019, 2024].forEach((yr) => {
        const idx = yearIndexMap.get(yr);
        if (idx !== undefined) {
          const pt = projectedGrid[idx][0];
          ctx.fillText(String(yr), pt.x, pt.y + 16);
        }
      });

      ctx.textAlign = "right";
      const midYearIdx = Math.floor(gridPoints.length / 2);
      [-10, 0, 10].forEach((s) => {
        const shockIdx = shocks.findIndex((val) => Math.abs(val - s) < 1);
        if (shockIdx !== -1) {
          const pt = projectedGrid[midYearIdx][shockIdx];
          ctx.fillText(`${s > 0 ? "+" : ""}${s}%`, pt.x - 12, pt.y + 4);
        }
      });

      HISTORICAL_CRISIS_PINS.forEach((pin) => {
        const xi = yearIndexMap.get(pin.year);
        if (xi === undefined) return;

        let closestYIdx = 0;
        let minDist = 999;
        shocks.forEach((sh, yIdx) => {
          const d = Math.abs(sh - pin.returnShock);
          if (d < minDist) {
            minDist = d;
            closestYIdx = yIdx;
          }
        });

        const terrainPt = projectedGrid[xi][closestYIdx];
        const beaconHeight = terrainPt.world.z + 45;
        const beaconWorld: Point3D = {
          x: terrainPt.world.x,
          y: terrainPt.world.y,
          z: beaconHeight,
        };
        const beaconPt = project(beaconWorld);

        const isSelected = selectedCrisis?.id === pin.id;

        ctx.beginPath();
        ctx.setLineDash([2, 2]);
        ctx.lineWidth = isSelected ? 1.5 : 1;
        ctx.strokeStyle = isSelected ? "#f43f5e" : "rgba(245, 158, 11, 0.6)";
        ctx.moveTo(terrainPt.x, terrainPt.y);
        ctx.lineTo(beaconPt.x, beaconPt.y);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(terrainPt.x, terrainPt.y, isSelected ? 4 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? "#f43f5e" : "#f59e0b";
        ctx.fill();

        const size = isSelected ? 7 : 5;
        ctx.save();
        ctx.translate(beaconPt.x, beaconPt.y);
        ctx.rotate(Math.PI / 4);

        if (isSelected) {
          ctx.beginPath();
          ctx.rect(-size * 1.5, -size * 1.5, size * 3, size * 3);
          ctx.strokeStyle = "rgba(244, 63, 94, 0.4)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.fillStyle = isSelected ? "#f43f5e" : "#00f0ff";
        ctx.fillRect(-size, -size, size * 2, size * 2);
        ctx.restore();

        ctx.font = `bold ${isSelected ? "10.5px" : "9px"} "Courier New", monospace`;
        ctx.fillStyle = isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.75)";
        ctx.textAlign = "center";
        ctx.fillText(`${pin.year}`, beaconPt.x, beaconPt.y - 12);
      });

      ctx.restore();
      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameId.current);
  }, [yaw, pitch, zoom, isAutoRotate, renderMode, selectedCrisis, gridPoints, shocks, yearIndexMap, years]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsAutoRotate(false);
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    setYaw((prev) => prev + dx * 0.008);
    setPitch((prev) => Math.max(0.05, Math.min(1.55, prev + dy * 0.008)));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsAutoRotate(false);
    setZoom((prev) => Math.max(0.6, Math.min(2.5, prev - e.deltaY * 0.001)));
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      setIsAutoRotate(false);
      isDragging.current = true;
      lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - lastMousePos.current.x;
    const dy = e.touches[0].clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    setYaw((prev) => prev + dx * 0.008);
    setPitch((prev) => Math.max(0.05, Math.min(1.55, prev + dy * 0.008)));
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  return (
    <div
      ref={containerRef}
      style={{
        border: "1px solid var(--line)",
        backgroundColor: "#05080e",
        borderRadius: 4,
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.45)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 18px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          backgroundColor: "rgba(10, 15, 25, 0.85)",
          backdropFilter: "blur(12px)",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              backgroundColor: "#00f0ff",
              borderRadius: "50%",
              boxShadow: "0 0 10px #00f0ff",
            }}
          />
          <strong className="mono" style={{ fontSize: 11.5, letterSpacing: "0.08em", color: "var(--ink-heading)" }}>
            3D VOLATILITY & CRISIS MANIFOLD (TERRAIN SURFACE)
          </strong>
          <span className="mono" style={{ fontSize: 10, color: "var(--dim)" }}>
            [1987 — 2024 • 9,011 TRADING DAYS]
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            className="mono"
            onClick={() => setPreset("isometric")}
            style={{
              padding: "4px 10px",
              fontSize: 10,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              color: "var(--ink)",
              border: "1px solid var(--line)",
              borderRadius: 2,
              cursor: "pointer",
            }}
          >
            3D Orbit
          </button>
          <button
            type="button"
            className="mono"
            onClick={() => setPreset("topdown")}
            style={{
              padding: "4px 10px",
              fontSize: 10,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              color: "var(--ink)",
              border: "1px solid var(--line)",
              borderRadius: 2,
              cursor: "pointer",
            }}
          >
            Top-Down Heatmap
          </button>
          <button
            type="button"
            className="mono"
            onClick={() => setPreset("fattail")}
            style={{
              padding: "4px 10px",
              fontSize: 10,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              color: "var(--ink)",
              border: "1px solid var(--line)",
              borderRadius: 2,
              cursor: "pointer",
            }}
          >
            Fat-Tail Profile
          </button>
          <button
            type="button"
            className="mono"
            onClick={() => setIsAutoRotate((v) => !v)}
            style={{
              padding: "4px 10px",
              fontSize: 10,
              backgroundColor: isAutoRotate ? "rgba(0, 240, 255, 0.15)" : "rgba(255, 255, 255, 0.05)",
              color: isAutoRotate ? "#00f0ff" : "var(--dim)",
              border: isAutoRotate ? "1px solid #00f0ff" : "1px solid var(--line)",
              borderRadius: 2,
              cursor: "pointer",
            }}
          >
            {isAutoRotate ? "Auto-Spin: ON" : "Auto-Spin: OFF"}
          </button>
          <button
            type="button"
            className="mono"
            onClick={() => setRenderMode((m) => (m === "hybrid" ? "wireframe" : m === "wireframe" ? "shaded" : "hybrid"))}
            style={{
              padding: "4px 10px",
              fontSize: 10,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              color: "var(--ink)",
              border: "1px solid var(--line)",
              borderRadius: 2,
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            Mode: {renderMode}
          </button>
        </div>
      </div>

      <div style={{ position: "relative", height: 500, width: "100%", cursor: isDragging.current ? "grabbing" : "grab" }}>
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ width: "100%", height: "100%", display: "block" }}
        />

        <div
          className="mono"
          style={{
            position: "absolute",
            bottom: 16,
            left: 18,
            pointerEvents: "none",
            fontSize: 10,
            color: "rgba(255, 255, 255, 0.4)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <span>X: Time (1987 – 2024 Epochs)</span>
          <span>Y: Daily Return Shock (-14% to +14%)</span>
          <span>Z: Empirical Kurtosis Elevation (45.43)</span>
          <span style={{ marginTop: 4, color: "var(--accent)" }}>Tip: Drag mouse/touch to orbit 360° • Scroll to zoom</span>
        </div>

        <div
          className="mono"
          style={{
            position: "absolute",
            bottom: 16,
            right: 18,
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 5,
            fontSize: 9.5,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "#f43f5e", fontWeight: 700 }}>CRISIS PEAK (&gt;8% SHOCK)</span>
            <span style={{ width: 12, height: 12, backgroundColor: "#f43f5e", borderRadius: 2 }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "#f59e0b" }}>ELEVATED VOLATILITY (3-7%)</span>
            <span style={{ width: 12, height: 12, backgroundColor: "#f59e0b", borderRadius: 2 }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "#00f0ff" }}>CALM EQUILIBRIUM (0-2%)</span>
            <span style={{ width: 12, height: 12, backgroundColor: "#00f0ff", borderRadius: 2 }} />
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "12px 18px",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          backgroundColor: "rgba(10, 15, 25, 0.95)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          overflowX: "auto",
          whiteSpace: "nowrap",
          scrollbarWidth: "none",
        }}
      >
        <span className="mono" style={{ fontSize: 10, color: "var(--dim)", marginRight: 6 }}>
          SELECT CRISIS PIN:
        </span>
        {HISTORICAL_CRISIS_PINS.map((pin) => {
          const isSelected = selectedCrisis?.id === pin.id;
          return (
            <button
              type="button"
              key={pin.id}
              onClick={() => selectCrisis(pin)}
              className="mono"
              style={{
                padding: "6px 12px",
                fontSize: 10,
                backgroundColor: isSelected ? "rgba(244, 63, 94, 0.18)" : "rgba(255, 255, 255, 0.04)",
                color: isSelected ? "#f43f5e" : "var(--ink)",
                border: isSelected ? "1px solid #f43f5e" : "1px solid var(--line)",
                borderRadius: 2,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <strong>{pin.year}</strong> — {pin.name.split(" (")[0]}
            </button>
          );
        })}
      </div>

      {selectedCrisis && (
        <div
          style={{
            padding: "18px 24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            backgroundColor: "rgba(15, 22, 36, 0.98)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span
                className="mono"
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  backgroundColor: "#f43f5e",
                  color: "#ffffff",
                  padding: "2px 6px",
                  borderRadius: 2,
                }}
              >
                {selectedCrisis.tag}
              </span>
              <span className="mono" style={{ fontSize: 11, color: "var(--dim)" }}>
                {selectedCrisis.date}
              </span>
            </div>
            <h3 style={{ margin: "4px 0 6px", fontSize: 18, color: "var(--ink-heading)", letterSpacing: "-0.03em" }}>
              {selectedCrisis.name}
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
              {selectedCrisis.description}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              backgroundColor: "rgba(0, 0, 0, 0.35)",
              padding: "14px 18px",
              borderRadius: 4,
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <div>
              <span className="mono" style={{ fontSize: 9.5, color: "var(--dim)", display: "block" }}>
                SPOT PRICE
              </span>
              <strong className="mono" style={{ fontSize: 18, color: "var(--ink-heading)" }}>
                ${selectedCrisis.price.toFixed(2)}
              </strong>
            </div>
            <div>
              <span className="mono" style={{ fontSize: 9.5, color: "var(--dim)", display: "block" }}>
                30D SHOCK %
              </span>
              <strong
                className="mono"
                style={{
                  fontSize: 18,
                  color: selectedCrisis.pctImpact >= 0 ? "#10b981" : "#f43f5e",
                }}
              >
                {selectedCrisis.pctImpact >= 0 ? "+" : ""}
                {selectedCrisis.pctImpact.toFixed(1)}%
              </strong>
            </div>
            <div>
              <span className="mono" style={{ fontSize: 9.5, color: "var(--dim)", display: "block" }}>
                FAT-TAIL SPIKE
              </span>
              <strong className="mono" style={{ fontSize: 18, color: "#f59e0b" }}>
                {selectedCrisis.volatilitySpike.toFixed(1)}x Vol
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
