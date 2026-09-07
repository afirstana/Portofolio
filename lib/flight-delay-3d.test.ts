import { describe, it, expect } from "vitest";
import {
  TOP_30_AIRPORTS_3D,
  TOP_50_CORRIDORS_3D,
  geoToContinentalPlane,
  calculateHaversineDistance,
  computeParabolicArcPoints,
  US_CONTINENTAL_BOUNDARY,
  US_GREAT_LAKES_OUTLINES,
} from "./flight-delay-3d";
import { getProjectBySlug } from "./content";
import fs from "node:fs";
import path from "node:path";

describe("Part 2: 3D Aviation Airspace Network Data & Geometry", () => {
  // =========================================================================
  // 1. TOP 30 MEGA HUBS INTEGRITY
  // =========================================================================
  describe("01. Top 30 National Mega Hubs Data Quality", () => {
    it("contains exactly 30 top U.S. mega hubs with valid geographic bounds", () => {
      expect(TOP_30_AIRPORTS_3D).toHaveLength(30);

      for (const hub of TOP_30_AIRPORTS_3D) {
        expect(hub.code).toHaveLength(3);
        expect(hub.city.length).toBeGreaterThan(1);
        expect(hub.state).toHaveLength(2);
        expect(hub.lat).toBeGreaterThan(24.0);
        expect(hub.lat).toBeLessThan(50.0);
        expect(hub.lon).toBeGreaterThan(-130.0);
        expect(hub.lon).toBeLessThan(-65.0);
        expect(hub.departures).toBeGreaterThan(70000);
        expect(hub.meanTaxiOut).toBeGreaterThan(13.0);
        expect(hub.delayRatePct).toBeGreaterThan(10.0);
      }
    });

    it("correctly flags severe surface bottlenecks at ORD, LGA, JFK, and EWR", () => {
      const ord = TOP_30_AIRPORTS_3D.find((h) => h.code === "ORD");
      const lga = TOP_30_AIRPORTS_3D.find((h) => h.code === "LGA");
      const jfk = TOP_30_AIRPORTS_3D.find((h) => h.code === "JFK");
      const ewr = TOP_30_AIRPORTS_3D.find((h) => h.code === "EWR");
      const atl = TOP_30_AIRPORTS_3D.find((h) => h.code === "ATL");

      expect(ord?.isSurfaceBottleneck).toBe(true);
      expect(ord?.meanTaxiOut).toBeGreaterThan(23.5);

      expect(lga?.isSurfaceBottleneck).toBe(true);
      expect(lga?.meanTaxiOut).toBeGreaterThan(23.0);

      expect(jfk?.isSurfaceBottleneck).toBe(true);
      expect(jfk?.meanTaxiOut).toBeGreaterThan(25.0);

      expect(ewr?.isSurfaceBottleneck).toBe(true);
      expect(ewr?.meanTaxiOut).toBeGreaterThan(24.0);

      expect(atl?.isSurfaceBottleneck).toBe(false);
      expect(atl?.meanTaxiOut).toBeLessThan(17.0);
    });
  });

  // =========================================================================
  // 2. TOP 50 FLIGHT CORRIDORS INTEGRITY
  // =========================================================================
  describe("02. Top 50 Strategic Flight Corridors", () => {
    it("contains exactly 50 strategic corridors with valid endpoint references", () => {
      expect(TOP_50_CORRIDORS_3D).toHaveLength(50);
      const hubCodes = new Set(TOP_30_AIRPORTS_3D.map((h) => h.code));

      for (const corridor of TOP_50_CORRIDORS_3D) {
        expect(hubCodes.has(corridor.from)).toBe(true);
        expect(hubCodes.has(corridor.to)).toBe(true);
        expect(corridor.distanceMiles).toBeGreaterThan(100);
        expect(corridor.dailyFlights).toBeGreaterThan(15);
        expect(corridor.rippleRiskPct).toBeGreaterThan(30);

        if (corridor.rippleRiskPct > 45) {
          expect(corridor.isCriticalRipple).toBe(true);
        } else {
          expect(corridor.isCriticalRipple).toBe(false);
        }
      }
    });

    it("verifies severe ripple risk on ORD-LGA and EWR-ORD corridors (>50%)", () => {
      const ordLga = TOP_50_CORRIDORS_3D.find((c) => c.from === "ORD" && c.to === "LGA");
      const ewrOrd = TOP_50_CORRIDORS_3D.find((c) => c.from === "EWR" && c.to === "ORD");

      expect(ordLga).toBeDefined();
      expect(ordLga?.rippleRiskPct).toBeGreaterThan(50.0);
      expect(ordLga?.isCriticalRipple).toBe(true);

      expect(ewrOrd).toBeDefined();
      expect(ewrOrd?.rippleRiskPct).toBeGreaterThan(50.0);
      expect(ewrOrd?.isCriticalRipple).toBe(true);
    });
  });

  // =========================================================================
  // 3. GEODESIC HAVERSINE & 3D PROJECTION MATHEMATICS
  // =========================================================================
  describe("03. Geodesic & Parabolic Arc Mathematics", () => {
    it("calculates accurate great-circle distances using Haversine formula", () => {
      // JFK [40.6413, -73.7781] to LAX [33.9416, -118.4085] ~ 2475 miles
      const jfkToLax = calculateHaversineDistance(40.6413, -73.7781, 33.9416, -118.4085);
      expect(jfkToLax).toBeGreaterThan(2450);
      expect(jfkToLax).toBeLessThan(2500);

      // ORD [41.9742, -87.9073] to LGA [40.7769, -73.8740] ~ 733 miles
      const ordToLga = calculateHaversineDistance(41.9742, -87.9073, 40.7769, -73.8740);
      expect(ordToLga).toBeGreaterThan(720);
      expect(ordToLga).toBeLessThan(750);
    });

    it("projects terrestrial coordinates onto centered 3D continental plane", () => {
      // Geographic center of continental US (~38.5N, -97.0W) maps to origin (0, 0, 0)
      const center = geoToContinentalPlane(38.5, -97.0);
      expect(center[0]).toBeCloseTo(0, 1);
      expect(center[1]).toBe(0);
      expect(center[2]).toBeCloseTo(0, 1);

      // Los Angeles (West) should have negative X
      const laxPos = geoToContinentalPlane(33.9416, -118.4085);
      expect(laxPos[0]).toBeLessThan(-5);

      // New York (East) should have positive X
      const jfkPos = geoToContinentalPlane(40.6413, -73.7781);
      expect(jfkPos[0]).toBeGreaterThan(5);
    });

    it("generates smooth parabolic arc points with correct apogee", () => {
      const start: [number, number, number] = [-5, 0, 2];
      const end: [number, number, number] = [5, 0, -2];
      const peak = 3.5;
      const points = computeParabolicArcPoints(start, end, peak, 32);

      expect(points).toHaveLength(33);
      // Start point
      expect(points[0][0]).toBe(start[0]);
      expect(points[0][1]).toBe(0);
      expect(points[0][2]).toBe(start[2]);

      // End point
      expect(points[32][0]).toBe(end[0]);
      expect(points[32][1]).toBe(0);
      expect(points[32][2]).toBe(end[2]);

      // Midpoint apogee (t = 0.5, 4 * peak * 0.5 * 0.5 = peak)
      expect(points[16][1]).toBeCloseTo(peak, 2);
    });

    it("validates continental US and Great Lakes boundary polygons", () => {
      // Continental boundary: closed polygon covering contiguous US
      expect(US_CONTINENTAL_BOUNDARY.length).toBeGreaterThan(100);
      const first = US_CONTINENTAL_BOUNDARY[0];
      const last = US_CONTINENTAL_BOUNDARY[US_CONTINENTAL_BOUNDARY.length - 1];
      expect(first[0]).toBe(last[0]);
      expect(first[1]).toBe(last[1]);

      for (const [lat, lon] of US_CONTINENTAL_BOUNDARY) {
        expect(lat).toBeGreaterThanOrEqual(24.0);
        expect(lat).toBeLessThanOrEqual(50.0);
        expect(lon).toBeGreaterThanOrEqual(-126.0);
        expect(lon).toBeLessThanOrEqual(-66.0);
      }

      // Great Lakes outlines: 3 distinct closed shoreline loops
      expect(US_GREAT_LAKES_OUTLINES).toHaveLength(3);
      for (const loop of US_GREAT_LAKES_OUTLINES) {
        expect(loop.length).toBeGreaterThan(5);
        const lFirst = loop[0];
        const lLast = loop[loop.length - 1];
        expect(lFirst[0]).toBe(lLast[0]);
        expect(lFirst[1]).toBe(lLast[1]);
      }
    });
  });

  // =========================================================================
  // 4. CASE STUDY & NAVIGATION INTEGRITY
  // =========================================================================
  describe("04. Document Standards, TOC & Standalone Isolation", () => {
    const slug = "flight-delay-2024-3d-airspace-network";
    const project = getProjectBySlug(slug);

    it("loads the Part 2 case study markdown document", () => {
      expect(project).toBeDefined();
      expect(project?.slug).toBe(slug);
      expect(project?.category).toBe("Data Systems & Aviation Analytics");
    });

    it("enforces Executive Callout (> [!NOTE]) at the top of the narrative", () => {
      const firstNonEmptyLine = project?.body
        ?.split("\n")
        .map((l) => l.trim())
        .find((l) => l.length > 0);
      expect(firstNonEmptyLine?.startsWith("> [!NOTE]")).toBe(true);
    });

    it("verifies 1-to-1 mapping of all 8 TOC anchors across Page & Markdown", () => {
      // 1. Check page.tsx contains 3d-airspace
      const pagePath = path.resolve(__dirname, "../app/projects/flight-delay-2024-3d-airspace-network/page.tsx");
      const pageSrc = fs.readFileSync(pagePath, "utf-8");
      expect(pageSrc).toContain('id="3d-airspace"');

      // 2. Check markdown contains section anchors
      const mdPath = path.resolve(__dirname, "../content/projects/flight-delay-2024-3d-airspace-network.md");
      const mdSrc = fs.readFileSync(mdPath, "utf-8");
      expect(mdSrc).toContain("{#geodesic-math}");
      expect(mdSrc).toContain("{#surface-elevation}");
      expect(mdSrc).toContain("{#ripple-propagation}");
      expect(mdSrc).toContain("{#hub-scorecard}");
      expect(mdSrc).toContain("{#webgl-engine}");
      expect(mdSrc).toContain("{#methodology}");

      // 3. Check takeaways anchor in lessons
      const lessonsPath = path.resolve(__dirname, "../components/FlightOperationalLessons.tsx");
      const lessonsSrc = fs.readFileSync(lessonsPath, "utf-8");
      expect(lessonsSrc).toContain('id="takeaways"');

      // 4. Verify no suite banner exists in Part 2 page
      expect(pageSrc).not.toContain("Flight Delay 2024 Suite");
      expect(pageSrc).not.toContain("Part 2 of 3");
    });
  });
});
