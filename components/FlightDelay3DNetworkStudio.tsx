"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  Airport3D,
  TOP_30_AIRPORTS_3D,
  TOP_50_CORRIDORS_3D,
  US_CONTINENTAL_BOUNDARY,
  US_GREAT_LAKES_OUTLINES,
  geoToContinentalPlane,
} from "@/lib/flight-delay-3d";

interface FlightDelay3DNetworkStudioProps {
  initialBottleneckOnly?: boolean;
}

export function FlightDelay3DNetworkStudio({
  initialBottleneckOnly = false,
}: FlightDelay3DNetworkStudioProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [bottleneckOnly, setBottleneckOnly] = useState<boolean>(initialBottleneckOnly);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [hoveredHub, setHoveredHub] = useState<Airport3D | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);

  // Group references for dynamic toggles
  const normalCorridorsGroupRef = useRef<THREE.Group | null>(null);
  const criticalCorridorsGroupRef = useRef<THREE.Group | null>(null);
  const normalHubsGroupRef = useRef<THREE.Group | null>(null);
  const criticalHubsGroupRef = useRef<THREE.Group | null>(null);
  const labelsMasterGroupRef = useRef<THREE.Group | null>(null);
  const normalLabelsGroupRef = useRef<THREE.Group | null>(null);
  const criticalLabelsGroupRef = useRef<THREE.Group | null>(null);
  const raycastMeshesRef = useRef<{ mesh: THREE.Mesh; hub: Airport3D }[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Compute hub position map
  const hubPositionMap = useMemo(() => {
    const map = new Map<string, [number, number, number]>();
    for (const hub of TOP_30_AIRPORTS_3D) {
      map.set(hub.code, geoToContinentalPlane(hub.lat, hub.lon));
    }
    return map;
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!isClient || !containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight || 560;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.015);
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 16, 20);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    // 4. OrbitControls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 6;
    controls.maxDistance = 38;
    controls.maxPolarAngle = Math.PI / 2.05; // Prevent camera under ground plane
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(10, 25, 15);
    scene.add(dirLight);

    // 6. Ground Base Grid & Geographic Continental Frame
    const gridHelper = new THREE.GridHelper(32, 32, 0x222222, 0x141414);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // Subtle Continental Bounding Frame Box
    const boundaryGeo = new THREE.BufferGeometry();
    const boundaryPts = [
      new THREE.Vector3(-14, 0, -8),
      new THREE.Vector3(14, 0, -8),
      new THREE.Vector3(14, 0, 8),
      new THREE.Vector3(-14, 0, 8),
      new THREE.Vector3(-14, 0, -8),
    ];
    boundaryGeo.setFromPoints(boundaryPts);
    const boundaryMat = new THREE.LineBasicMaterial({ color: 0x222222, transparent: true, opacity: 0.6 });
    const boundaryLine = new THREE.Line(boundaryGeo, boundaryMat);
    scene.add(boundaryLine);

    // Continental US Coastline & Border Vector Path
    const usBorderPts = US_CONTINENTAL_BOUNDARY.map(([lat, lon]) => {
      const [x, , z] = geoToContinentalPlane(lat, lon);
      return new THREE.Vector3(x, 0.015, z);
    });
    const usBorderGeo = new THREE.BufferGeometry().setFromPoints(usBorderPts);
    const usBorderMat = new THREE.LineBasicMaterial({
      color: 0x484848,
      transparent: true,
      opacity: 0.9,
    });
    const usBorderLine = new THREE.Line(usBorderGeo, usBorderMat);
    scene.add(usBorderLine);

    // US Great Lakes Shorelines
    US_GREAT_LAKES_OUTLINES.forEach((lakeLoop) => {
      const lakePts = lakeLoop.map(([lat, lon]) => {
        const [x, , z] = geoToContinentalPlane(lat, lon);
        return new THREE.Vector3(x, 0.015, z);
      });
      const lakeGeo = new THREE.BufferGeometry().setFromPoints(lakePts);
      const lakeMat = new THREE.LineBasicMaterial({
        color: 0x333333,
        transparent: true,
        opacity: 0.8,
      });
      const lakeLine = new THREE.Line(lakeGeo, lakeMat);
      scene.add(lakeLine);
    });

    // 7. Groups for Hubs, Corridors, and Labels
    const normalHubsGroup = new THREE.Group();
    const criticalHubsGroup = new THREE.Group();
    const normalCorridorsGroup = new THREE.Group();
    const criticalCorridorsGroup = new THREE.Group();
    const labelsMasterGroup = new THREE.Group();
    const normalLabelsGroup = new THREE.Group();
    const criticalLabelsGroup = new THREE.Group();

    labelsMasterGroup.add(normalLabelsGroup);
    labelsMasterGroup.add(criticalLabelsGroup);

    normalHubsGroupRef.current = normalHubsGroup;
    criticalHubsGroupRef.current = criticalHubsGroup;
    normalCorridorsGroupRef.current = normalCorridorsGroup;
    criticalCorridorsGroupRef.current = criticalCorridorsGroup;
    labelsMasterGroupRef.current = labelsMasterGroup;
    normalLabelsGroupRef.current = normalLabelsGroup;
    criticalLabelsGroupRef.current = criticalLabelsGroup;

    scene.add(normalHubsGroup);
    scene.add(criticalHubsGroup);
    scene.add(normalCorridorsGroup);
    scene.add(criticalCorridorsGroup);
    scene.add(labelsMasterGroup);

    // Materials for Hubs & Corridors
    const normalHubMat = new THREE.MeshStandardMaterial({
      color: 0x4a4a4a,
      roughness: 0.6,
      metalness: 0.3,
    });
    const criticalHubMat = new THREE.MeshStandardMaterial({
      color: 0xff4d1c,
      emissive: 0xff4d1c,
      emissiveIntensity: 0.45,
      roughness: 0.3,
      metalness: 0.5,
    });

    const normalArcMat = new THREE.LineBasicMaterial({
      color: 0x383838,
      transparent: true,
      opacity: 0.45,
    });
    const criticalArcMat = new THREE.LineBasicMaterial({
      color: 0xff4d1c,
      transparent: true,
      opacity: 0.9,
    });

    // Materials & Geometries for Ground Radar Rings & Pinpoints
    const ringGeo = new THREE.RingGeometry(0.24, 0.35, 24);
    ringGeo.rotateX(-Math.PI / 2);

    const centerDotGeo = new THREE.CircleGeometry(0.08, 16);
    centerDotGeo.rotateX(-Math.PI / 2);

    const normalRingMat = new THREE.MeshBasicMaterial({
      color: 0x3d3d3d,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    });
    const criticalRingMat = new THREE.MeshBasicMaterial({
      color: 0xff4d1c,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });

    const normalDotMat = new THREE.MeshBasicMaterial({
      color: 0x666666,
      side: THREE.DoubleSide,
    });
    const criticalDotMat = new THREE.MeshBasicMaterial({
      color: 0xff4d1c,
      side: THREE.DoubleSide,
    });

    // Helper to generate camera-facing billboard IATA labels
    const createAirportLabelSprite = (code: string, isCritical: boolean): THREE.Sprite => {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, 128, 64);

        // Pill badge background
        const x = 12, y = 12, w = 104, h = 40, r = 6;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();

        ctx.fillStyle = isCritical ? "rgba(22, 16, 14, 0.94)" : "rgba(14, 14, 14, 0.85)";
        ctx.fill();

        ctx.strokeStyle = isCritical ? "#ff4d1c" : "#444444";
        ctx.lineWidth = isCritical ? 2.5 : 1.5;
        ctx.stroke();

        // Monospace IATA text
        ctx.fillStyle = isCritical ? "#ff4d1c" : "#e5e5e5";
        ctx.font = "bold 22px 'JetBrains Mono', monospace, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(code, 64, 33);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(1.4, 0.7, 1);
      return sprite;
    };

    raycastMeshesRef.current = [];

    // 8. Build 30 Airport Hub Pillars, Radar Target Rings & Billboard Labels
    TOP_30_AIRPORTS_3D.forEach((hub) => {
      const pos = hubPositionMap.get(hub.code);
      if (!pos) return;

      // Height proportional to Mean Taxi-Out duration (ORD 23.79m & LGA 23.46m stand tall)
      const pillarHeight = Math.max(0.4, (hub.meanTaxiOut - 13.0) * 0.28);
      const isCritical = hub.isSurfaceBottleneck;

      const cylinderGeo = new THREE.CylinderGeometry(0.18, 0.22, pillarHeight, 16);
      cylinderGeo.translate(0, pillarHeight / 2, 0);

      const mat = isCritical ? criticalHubMat : normalHubMat;
      const mesh = new THREE.Mesh(cylinderGeo, mat);
      mesh.position.set(pos[0], 0, pos[2]);

      // Beacon sphere at top of pillar
      const beaconGeo = new THREE.SphereGeometry(isCritical ? 0.24 : 0.16, 12, 12);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: isCritical ? 0xff4d1c : 0x737373,
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(pos[0], pillarHeight, pos[2]);

      // Ground Radar Ring (Titik Lokasi)
      const ringMesh = new THREE.Mesh(ringGeo, isCritical ? criticalRingMat : normalRingMat);
      ringMesh.position.set(pos[0], 0.012, pos[2]);

      // Ground Center Pinpoint Dot
      const dotMesh = new THREE.Mesh(centerDotGeo, isCritical ? criticalDotMat : normalDotMat);
      dotMesh.position.set(pos[0], 0.013, pos[2]);

      const hubGroup = new THREE.Group();
      hubGroup.add(mesh);
      hubGroup.add(beacon);
      hubGroup.add(ringMesh);
      hubGroup.add(dotMesh);

      if (isCritical) {
        criticalHubsGroup.add(hubGroup);
      } else {
        normalHubsGroup.add(hubGroup);
      }

      // Billboard IATA Code Sprite
      const sprite = createAirportLabelSprite(hub.code, isCritical);
      sprite.position.set(pos[0], pillarHeight + 0.52, pos[2]);

      if (isCritical) {
        criticalLabelsGroup.add(sprite);
      } else {
        normalLabelsGroup.add(sprite);
      }

      // Register for raycast hit-testing
      raycastMeshesRef.current.push({ mesh, hub });
    });

    // 9. Build 50 Flight Corridors (3D Parabolic Great-Circle Arcs)
    const curveList: { curve: THREE.CatmullRomCurve3; isCritical: boolean }[] = [];

    TOP_50_CORRIDORS_3D.forEach((corridor) => {
      const startPos = hubPositionMap.get(corridor.from);
      const endPos = hubPositionMap.get(corridor.to);
      if (!startPos || !endPos) return;

      // Peak arc altitude scaled by distance
      const distance = corridor.distanceMiles;
      const peakHeight = Math.min(5.2, 0.9 + (distance / 1000) * 1.6);

      const midX = (startPos[0] + endPos[0]) / 2;
      const midZ = (startPos[2] + endPos[2]) / 2;
      const midY = peakHeight;

      const p0 = new THREE.Vector3(startPos[0], 0.2, startPos[2]);
      const p1 = new THREE.Vector3(midX, midY, midZ);
      const p2 = new THREE.Vector3(endPos[0], 0.2, endPos[2]);

      const curve = new THREE.CatmullRomCurve3([p0, p1, p2]);
      curveList.push({ curve, isCritical: corridor.isCriticalRipple });

      const points = curve.getPoints(36);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = corridor.isCriticalRipple ? criticalArcMat : normalArcMat;
      const arcLine = new THREE.Line(arcGeo, mat);

      if (corridor.isCriticalRipple) {
        criticalCorridorsGroup.add(arcLine);
      } else {
        normalCorridorsGroup.add(arcLine);
      }
    });

    // 10. Flow Particles along flight corridors
    const particleCount = 90;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    // Initial state for particles
    const particleTracks = Array.from({ length: particleCount }, (_, idx) => {
      const curveEntry = curveList[idx % curveList.length];
      return {
        curve: curveEntry.curve,
        progress: Math.random(),
        speed: 0.0025 + Math.random() * 0.0035,
        isCritical: curveEntry.isCritical,
      };
    });

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 11. Raycasting for Hover Tooltip
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);

    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        raycastMeshesRef.current.map((r) => r.mesh)
      );

      if (intersects.length > 0) {
        const hit = raycastMeshesRef.current.find((r) => r.mesh === intersects[0].object);
        if (hit) {
          setHoveredHub(hit.hub);
          setTooltipPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
          canvas.style.cursor = "pointer";
          return;
        }
      }
      setHoveredHub(null);
      setTooltipPos(null);
      canvas.style.cursor = "default";
    };

    canvas.addEventListener("mousemove", handlePointerMove);

    // 12. IntersectionObserver to pause loop when out of viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // 13. Window Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      width = container.clientWidth;
      height = container.clientHeight || 560;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // 14. Animation Loop
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      controls.update();

      // Update particle positions
      const positions = particleGeo.attributes.position.array as Float32Array;
      const colors = particleGeo.attributes.color.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const track = particleTracks[i];
        track.progress = (track.progress + track.speed) % 1.0;
        const pt = track.curve.getPoint(track.progress);

        positions[i * 3] = pt.x;
        positions[i * 3 + 1] = pt.y;
        positions[i * 3 + 2] = pt.z;

        if (track.isCritical) {
          colors[i * 3] = 1.0; // R
          colors[i * 3 + 1] = 0.3; // G
          colors[i * 3 + 2] = 0.11; // B
        } else {
          colors[i * 3] = 0.65;
          colors[i * 3 + 1] = 0.65;
          colors[i * 3 + 2] = 0.65;
        }
      }

      particleGeo.attributes.position.needsUpdate = true;
      particleGeo.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 15. Cleanup on unmount
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handlePointerMove);
      observer.disconnect();

      controls.dispose();
      renderer.dispose();
      scene.clear();
    };
  }, [isClient, hubPositionMap]);

  // Handle Bottleneck-Only toggle effect
  useEffect(() => {
    if (!normalCorridorsGroupRef.current || !normalHubsGroupRef.current) return;

    if (bottleneckOnly) {
      normalCorridorsGroupRef.current.visible = false;
      normalHubsGroupRef.current.visible = false;
      if (normalLabelsGroupRef.current) normalLabelsGroupRef.current.visible = false;
    } else {
      normalCorridorsGroupRef.current.visible = true;
      normalHubsGroupRef.current.visible = true;
      if (normalLabelsGroupRef.current) normalLabelsGroupRef.current.visible = true;
    }
  }, [bottleneckOnly]);

  // Handle Show Labels toggle effect
  useEffect(() => {
    if (!labelsMasterGroupRef.current) return;
    labelsMasterGroupRef.current.visible = showLabels;
  }, [showLabels]);

  // Reset Camera View
  const handleResetCamera = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(0, 16, 20);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: 600,
        backgroundColor: "var(--panel)",
        border: "1px solid var(--line)",
        borderRadius: 4,
        overflow: "hidden",
        margin: "24px 0 32px",
      }}
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />

      {/* Top HUD Toolbar — Minimalist & Problem Focused */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: 14,
          right: 14,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
          pointerEvents: "none",
        }}
      >
        <div
          className="mono"
          style={{
            backgroundColor: "rgba(10, 10, 10, 0.85)",
            backdropFilter: "blur(6px)",
            border: "1px solid var(--line)",
            borderRadius: 3,
            padding: "6px 12px",
            fontSize: 11,
            color: "var(--dim)",
            letterSpacing: "0.06em",
          }}
        >
          <span>3D WEBGL AIRSPACE</span> •{" "}
          <span style={{ color: "var(--ink-heading)" }}>US CONTINENTAL MAP</span> •{" "}
          <span>TOP 30 HUBS</span> •{" "}
          <span>50 CORRIDORS</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            pointerEvents: "auto",
          }}
        >
          {/* Toggle Labels */}
          <button
            type="button"
            onClick={() => setShowLabels(!showLabels)}
            className="mono"
            style={{
              backgroundColor: showLabels ? "rgba(32, 32, 32, 0.9)" : "rgba(10, 10, 10, 0.85)",
              color: showLabels ? "var(--ink-heading)" : "var(--dim)",
              border: `1px solid ${showLabels ? "var(--ink-heading)" : "var(--line)"}`,
              borderRadius: 3,
              padding: "6px 12px",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {showLabels ? "● LABELS: ON" : "○ LABELS: OFF"}
          </button>

          {/* Toggle Bottleneck Only */}
          <button
            type="button"
            onClick={() => setBottleneckOnly(!bottleneckOnly)}
            className="mono"
            style={{
              backgroundColor: bottleneckOnly ? "var(--accent)" : "rgba(10, 10, 10, 0.85)",
              color: bottleneckOnly ? "#ffffff" : "var(--ink)",
              border: `1px solid ${bottleneckOnly ? "var(--accent)" : "var(--line)"}`,
              borderRadius: 3,
              padding: "6px 12px",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {bottleneckOnly ? "● BOTTLENECKS ONLY (ACTIVE)" : "FILTER: BOTTLENECKS ONLY"}
          </button>

          {/* Reset Camera */}
          <button
            type="button"
            onClick={handleResetCamera}
            className="mono"
            style={{
              backgroundColor: "rgba(10, 10, 10, 0.85)",
              color: "var(--muted)",
              border: "1px solid var(--line)",
              borderRadius: 3,
              padding: "6px 12px",
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            RESET CAMERA
          </button>
        </div>
      </div>

      {/* Bottom Legend Telemetry Strip */}
      <div
        className="mono"
        style={{
          position: "absolute",
          bottom: 12,
          left: 14,
          right: 14,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          backgroundColor: "rgba(10, 10, 10, 0.85)",
          backdropFilter: "blur(6px)",
          border: "1px solid var(--line)",
          borderRadius: 3,
          padding: "6px 12px",
          fontSize: 10.5,
          color: "var(--muted)",
          pointerEvents: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "var(--accent)",
                display: "inline-block",
              }}
            />
            <strong style={{ color: "var(--accent)" }}>CRITICAL BOTTLENECK:</strong> Taxi &gt;22m (ORD, LGA, JFK, EWR) / Ripple &gt;45%
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#555555",
                display: "inline-block",
              }}
            />
            <span>STANDARD HUB / CORRIDOR</span>
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--dim)" }}>
            <span>RADAR PINPOINTS &amp; CONTINENTAL BOUNDARY ACTIVE</span>
          </span>
        </div>
        <span>ORBIT: DRAG TO ROTATE • SCROLL TO ZOOM</span>
      </div>

      {/* Raycast Hover Tooltip Card */}
      {hoveredHub && tooltipPos && (
        <div
          style={{
            position: "absolute",
            left: Math.min(tooltipPos.x + 15, (containerRef.current?.clientWidth || 800) - 240),
            top: Math.max(15, tooltipPos.y - 120),
            backgroundColor: "rgba(20, 20, 20, 0.95)",
            backdropFilter: "blur(8px)",
            border: `1px solid ${hoveredHub.isSurfaceBottleneck ? "var(--accent)" : "var(--line)"}`,
            borderRadius: 4,
            padding: "12px 14px",
            minWidth: 210,
            pointerEvents: "none",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
            zIndex: 30,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span
              className="mono"
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: hoveredHub.isSurfaceBottleneck ? "var(--accent)" : "var(--ink-heading)",
              }}
            >
              {hoveredHub.code}
            </span>
            <span className="mono" style={{ fontSize: 10, color: "var(--dim)" }}>
              {hoveredHub.city}, {hoveredHub.state}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11.5 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--muted)" }}>Departures:</span>
              <strong className="mono" style={{ color: "var(--ink)" }}>
                {hoveredHub.departures.toLocaleString()}
              </strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--muted)" }}>Delay Rate (≥15m):</span>
              <strong
                className="mono"
                style={{
                  color: hoveredHub.delayRatePct > 22 ? "var(--accent)" : "var(--ink)",
                }}
              >
                {hoveredHub.delayRatePct.toFixed(1)}%
              </strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: 4,
                borderTop: "1px solid var(--line)",
                marginTop: 2,
              }}
            >
              <span style={{ color: "var(--muted)" }}>Mean Taxi-Out:</span>
              <strong
                className="mono"
                style={{
                  color: hoveredHub.isSurfaceBottleneck ? "var(--accent)" : "var(--ink)",
                }}
              >
                {hoveredHub.meanTaxiOut.toFixed(1)} min
              </strong>
            </div>

            {hoveredHub.isSurfaceBottleneck && (
              <div
                className="mono"
                style={{
                  marginTop: 6,
                  padding: "3px 6px",
                  borderRadius: 2,
                  backgroundColor: "rgba(255, 77, 28, 0.15)",
                  color: "var(--accent)",
                  fontSize: 9.5,
                  fontWeight: 700,
                  textAlign: "center",
                  letterSpacing: "0.05em",
                }}
              >
                SEVERE SURFACE BOTTLENECK
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
