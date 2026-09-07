import { describe, it, expect } from "vitest";
import {
  TOP_30_AIRPORTS_3D,
  TOP_72_CORRIDORS_3D,
  geoTo3DCartesian,
  project3DToScreen,
  calculateHaversineDistance,
  computeParabolicArcPoint,
} from "./flight-delay-3d";

describe("3D Aviation Airspace Network Data & Geometry", () => {
  it("contains exactly 30 top U.S. mega hubs with valid geographic bounds", () => {
    expect(TOP_30_AIRPORTS_3D).toHaveLength(30);

    for (const hub of TOP_30_AIRPORTS_3D) {
      expect(hub.code).toHaveLength(3);
      expect(hub.lat).toBeGreaterThan(24.0);
      expect(hub.lat).toBeLessThan(50.0);
      expect(hub.lon).toBeGreaterThan(-130.0);
      expect(hub.lon).toBeLessThan(-65.0);
      expect(hub.departures).toBeGreaterThan(70000);
      expect(hub.meanTaxiOut).toBeGreaterThan(14.0);
      expect(hub.delayRatePct).toBeGreaterThan(10.0);
    }
  });

  it("correctly flags severe surface bottlenecks at ORD, LGA, and CLT", () => {
    const ord = TOP_30_AIRPORTS_3D.find((h) => h.code === "ORD");
    const lga = TOP_30_AIRPORTS_3D.find((h) => h.code === "LGA");
    const clt = TOP_30_AIRPORTS_3D.find((h) => h.code === "CLT");
    const atl = TOP_30_AIRPORTS_3D.find((h) => h.code === "ATL");

    expect(ord?.isSurfaceBottleneck).toBe(true);
    expect(ord?.meanTaxiOut).toBeGreaterThan(23.0);

    expect(lga?.isSurfaceBottleneck).toBe(true);
    expect(lga?.meanTaxiOut).toBeGreaterThan(23.0);

    expect(clt?.isSurfaceBottleneck).toBe(true);
    expect(atl?.isSurfaceBottleneck).toBe(false);
  });

  it("contains 72 major flight corridors with valid hub endpoint references", () => {
    expect(TOP_72_CORRIDORS_3D).toHaveLength(72);
    const codes = new Set(TOP_30_AIRPORTS_3D.map((h) => h.code));

    for (const corridor of TOP_72_CORRIDORS_3D) {
      expect(codes.has(corridor.from)).toBe(true);
      expect(codes.has(corridor.to)).toBe(true);
      expect(corridor.distanceMiles).toBeGreaterThan(100);
      expect(corridor.dailyFlights).toBeGreaterThan(10);
      expect(corridor.rippleRiskPct).toBeGreaterThan(30);
    }
  });

  it("calculates accurate great-circle distances using Haversine formula", () => {
    // JFK [40.6413, -73.7781] to LAX [33.9416, -118.4085] ~ 2475 miles
    const jfkToLax = calculateHaversineDistance(40.6413, -73.7781, 33.9416, -118.4085);
    expect(jfkToLax).toBeGreaterThan(2450);
    expect(jfkToLax).toBeLessThan(2500);

    // ORD [41.9742, -87.9073] to LGA [40.7769, -73.8740] ~ 733 miles
    const ordToLga = calculateHaversineDistance(41.9742, -87.9073, 40.7769, -73.8740);
    expect(ordToLga).toBeGreaterThan(710);
    expect(ordToLga).toBeLessThan(750);
  });

  it("projects geographic coordinates into finite 3D Euclidean coordinates", () => {
    const pt = geoTo3DCartesian(33.6407, -84.4277, 25);
    expect(Number.isFinite(pt.x)).toBe(true);
    expect(Number.isFinite(pt.y)).toBe(true);
    expect(Number.isFinite(pt.z)).toBe(true);
    expect(pt.y).toBe(25);
  });

  it("projects 3D coordinates onto screen space with depth perspective", () => {
    const p3d = { x: 50, y: 30, z: -40 };
    const screen = project3DToScreen(p3d, 0.5, 0.4, 600, 800, 600);

    expect(Number.isFinite(screen.screenX)).toBe(true);
    expect(Number.isFinite(screen.screenY)).toBe(true);
    expect(screen.depth).toBeGreaterThan(0);
    expect(screen.scale).toBeGreaterThan(0);
  });

  it("interpolates parabolic 3D arcs with correct apex geometry", () => {
    const p1 = { x: 0, y: 0, z: 0 };
    const p2 = { x: 100, y: 0, z: 100 };
    const apex = 60;

    const start = computeParabolicArcPoint(p1, p2, 0, apex);
    const mid = computeParabolicArcPoint(p1, p2, 0.5, apex);
    const end = computeParabolicArcPoint(p1, p2, 1, apex);

    expect(start.x).toBe(0);
    expect(start.y).toBe(0);

    expect(end.x).toBe(100);
    expect(end.y).toBe(0);

    // Midpoint apex elevation: 4 * 60 * 0.5 * 0.5 = 60
    expect(mid.x).toBe(50);
    expect(mid.y).toBeCloseTo(60, 1);
    expect(mid.z).toBe(50);
  });
});
