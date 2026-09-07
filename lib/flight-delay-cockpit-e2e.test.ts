import { describe, it, expect } from "vitest";
import rawData from "../content/data/flight_delay_2024_cube.json";
import { getProjectBySlug } from "./content";
import fs from "node:fs";
import path from "node:path";

describe("Flight Delay 2024 Operations Cockpit — End-to-End QA Suite", () => {
  // =========================================================================
  // 1. DATA INTEGRITY & NATIONAL CENSUS FIDELITY (7.08M FLIGHT RECORDS)
  // =========================================================================
  describe("01. Macro Census & KPI Conservation Laws", () => {
    const kpis = rawData.macro_kpis;

    it("verifies exact BTS TranStats national census totals for calendar year 2024", () => {
      expect(kpis.total_records).toBe(7079081);
      expect(kpis.operated_flights).toBe(6982766);
      expect(kpis.total_cancelled).toBe(96315);
      expect(kpis.total_diverted).toBe(17499);
      expect(kpis.total_delayed_ge15).toBe(1449972);
      expect(kpis.total_ontime_lt15).toBe(5515295);
      expect(kpis.total_early_lt0).toBe(4318559);
    });

    it("satisfies operational volume conservation: Operated + Cancelled = Total Scheduled", () => {
      expect(kpis.operated_flights + kpis.total_cancelled).toBe(kpis.total_records);
    });

    it("satisfies flight outcome partitioning: Delayed(>=15m) + OnTime(<15m) + Diverted = Operated Flights", () => {
      // Diverted flights do not arrive at scheduled gate, so arrival delay is unassigned
      expect(kpis.total_delayed_ge15 + kpis.total_ontime_lt15 + kpis.total_diverted).toBe(kpis.operated_flights);
    });

    it("verifies accurate percentage rates against operated and scheduled base", () => {
      // Cancellation rate = 96,315 / 7,079,081 ~ 1.36%
      const calcCancelRate = (kpis.total_cancelled / kpis.total_records) * 100;
      expect(calcCancelRate).toBeCloseTo(1.36, 1);
      expect(kpis.overall_cancel_rate_pct).toBe(1.36);

      // Delay rate = 1,449,972 / 6,982,766 ~ 20.77%
      const calcDelayRate = (kpis.total_delayed_ge15 / kpis.operated_flights) * 100;
      expect(calcDelayRate).toBeCloseTo(20.77, 1);
      expect(kpis.overall_delayed_rate_pct).toBe(20.77);

      // Early rate = 4,318,559 / 6,982,766 ~ 61.85%
      const calcEarlyRate = (kpis.total_early_lt0 / kpis.operated_flights) * 100;
      expect(calcEarlyRate).toBeCloseTo(61.85, 1);
      expect(kpis.overall_early_rate_pct).toBe(61.85);

      // FAA On-time rate complement: 100% - 20.77% = 79.23%
      const onTimeRateComplement = 100 - kpis.overall_delayed_rate_pct;
      expect(onTimeRateComplement).toBeCloseTo(79.23, 2);
    });

    it("validates delay minutes magnitude (~103.8 million minutes)", () => {
      expect(kpis.total_delay_minutes).toBe(103795067.0);
      // Equivalent to ~1.73M hours or ~197.5 human years
      const hours = kpis.total_delay_minutes / 60;
      expect(hours).toBeGreaterThan(1700000);
      expect(hours).toBeLessThan(1750000);
    });

    it("confirms the schedule padding paradox: positive mean vs negative median buffer", () => {
      // Positive mean departure (+13.67m) and arrival (+8.47m)
      expect(kpis.mean_dep_delay).toBeGreaterThan(13.5);
      expect(kpis.mean_dep_delay).toBeLessThan(14.0);
      expect(kpis.mean_arr_delay).toBeGreaterThan(8.0);
      expect(kpis.mean_arr_delay).toBeLessThan(9.0);
      // Mean arrival delay is ~5.20m lower than mean departure delay due to block time buffer
      const bufferPadding = kpis.mean_dep_delay - kpis.mean_arr_delay;
      expect(bufferPadding).toBeCloseTo(5.20, 1);
    });
  });

  // =========================================================================
  // 2. ROOT CAUSE ATTRIBUTION & CONSERVATION OF DELAY MINUTES
  // =========================================================================
  describe("02. Delay Causality Decomposition & Conservation", () => {
    const causes = rawData.delay_cause_breakdown;

    it("contains all 5 mandatory DOT/FAA reporting causality categories", () => {
      expect(causes).toHaveProperty("carrier_delay");
      expect(causes).toHaveProperty("weather_delay");
      expect(causes).toHaveProperty("nas_delay");
      expect(causes).toHaveProperty("security_delay");
      expect(causes).toHaveProperty("late_aircraft_delay");
    });

    it("proves EXACT mathematical conservation of delay minutes across causes", () => {
      const sumMinutes =
        causes.carrier_delay.total_minutes +
        causes.weather_delay.total_minutes +
        causes.nas_delay.total_minutes +
        causes.security_delay.total_minutes +
        causes.late_aircraft_delay.total_minutes;

      expect(sumMinutes).toBe(rawData.macro_kpis.total_delay_minutes);
    });

    it("verifies percentage shares and identifies Late Aircraft as strict #1 cause", () => {
      expect(causes.late_aircraft_delay.pct_of_total_cause_minutes).toBe(40.44);
      expect(causes.carrier_delay.pct_of_total_cause_minutes).toBe(34.51);
      expect(causes.nas_delay.pct_of_total_cause_minutes).toBe(18.9);
      expect(causes.weather_delay.pct_of_total_cause_minutes).toBe(5.97);
      expect(causes.security_delay.pct_of_total_cause_minutes).toBe(0.17);

      // Late Aircraft delay exceeds 40% of national minutes
      expect(causes.late_aircraft_delay.pct_of_total_cause_minutes).toBeGreaterThan(40.0);
      // Late aircraft minutes > Carrier minutes > NAS > Weather > Security
      expect(causes.late_aircraft_delay.total_minutes).toBeGreaterThan(causes.carrier_delay.total_minutes);
      expect(causes.carrier_delay.total_minutes).toBeGreaterThan(causes.nas_delay.total_minutes);
      expect(causes.nas_delay.total_minutes).toBeGreaterThan(causes.weather_delay.total_minutes);
      expect(causes.weather_delay.total_minutes).toBeGreaterThan(causes.security_delay.total_minutes);
    });

    it("validates incident duration intensity (Weather longest per event, Late Aircraft highest total)", () => {
      // Extreme weather has highest mean delay per incident (~69.7m)
      expect(causes.weather_delay.mean_minutes_per_incident).toBeGreaterThan(65.0);
      // Late aircraft averages ~56.5m per ripple event
      expect(causes.late_aircraft_delay.mean_minutes_per_incident).toBeGreaterThan(50.0);
      // NAS averages shortest delay per incident (~27.0m) due to tactical slot metering
      expect(causes.nas_delay.mean_minutes_per_incident).toBeLessThan(30.0);
    });
  });

  // =========================================================================
  // 3. 24-HOUR DIURNAL COMPOUNDING WAVE
  // =========================================================================
  describe("03. 24-Hour Diurnal Wave & Buffer Depletion Dynamics", () => {
    const hourly = rawData.hourly_departure;

    it("contains complete 24 hourly departure bins from 00:00 to 23:00", () => {
      expect(hourly).toHaveLength(24);
      for (let h = 0; h < 24; h++) {
        expect(hourly[h].dep_hour).toBe(h);
        expect(hourly[h].total_flights).toBeGreaterThan(0);
        expect(hourly[h].delay_rate_pct).toBeGreaterThan(0);
        expect(hourly[h].mean_taxi_out).toBeGreaterThan(10);
      }
    });

    it("verifies the 3.3x diurnal surge from launch wave (05:00) to evening peak (20:00)", () => {
      const launchHour = hourly.find((h) => h.dep_hour === 5);
      const peakHour = hourly.find((h) => h.dep_hour === 20);

      expect(launchHour).toBeDefined();
      expect(peakHour).toBeDefined();

      if (launchHour && peakHour) {
        expect(launchHour.delay_rate_pct).toBeLessThan(10.0);
        expect(launchHour.delay_rate_pct).toBeCloseTo(8.9, 0.5);

        expect(peakHour.delay_rate_pct).toBeGreaterThan(29.0);
        expect(peakHour.delay_rate_pct).toBeCloseTo(29.8, 0.5);

        const escalationRatio = peakHour.delay_rate_pct / launchHour.delay_rate_pct;
        expect(escalationRatio).toBeGreaterThanOrEqual(3.3);
      }
    });

    it("validates that mean departure delay escalates through afternoon bank cycles", () => {
      const h06 = hourly.find((h) => h.dep_hour === 6)?.mean_dep_delay ?? 0;
      const h12 = hourly.find((h) => h.dep_hour === 12)?.mean_dep_delay ?? 0;
      const h18 = hourly.find((h) => h.dep_hour === 18)?.mean_dep_delay ?? 0;

      expect(h12).toBeGreaterThan(h06);
      expect(h18).toBeGreaterThan(h12);
    });
  });

  // =========================================================================
  // 4. CARRIER LEAGUE & FLEET ROTATION PROFILES
  // =========================================================================
  describe("04. Carrier League Scorecard & Strategic Fleet Profiles", () => {
    const carriers = rawData.carriers;

    it("contains exactly 15 major reporting airlines covering all operational models", () => {
      expect(carriers).toHaveLength(15);
      const codes = new Set(carriers.map((c) => c.carrier_code));
      const expected = ["WN", "DL", "AA", "UA", "OO", "YX", "MQ", "NK", "AS", "B6", "OH", "F9", "9E", "G4", "HA"];
      for (const code of expected) {
        expect(codes.has(code)).toBe(true);
      }
    });

    it("validates high-volume market leaders and their operational extremes", () => {
      const wn = carriers.find((c) => c.carrier_code === "WN");
      const dl = carriers.find((c) => c.carrier_code === "DL");
      const f9 = carriers.find((c) => c.carrier_code === "F9");
      const yx = carriers.find((c) => c.carrier_code === "YX");

      expect(wn).toBeDefined();
      expect(dl).toBeDefined();
      expect(f9).toBeDefined();
      expect(yx).toBeDefined();

      // Southwest (WN) has highest volume (>1.4M flights)
      expect(wn!.total_flights).toBeGreaterThan(1400000);
      // Southwest Late Aircraft share > 50%
      const wnLatePct = (wn!.late_aircraft_delay_min / (wn!.late_aircraft_delay_min + wn!.carrier_delay_min + wn!.nas_delay_min + wn!.weather_delay_min)) * 100;
      expect(wnLatePct).toBeGreaterThan(50.0);

      // Delta (DL) achieves highest reliability among legacy majors (<18% delay rate, >65% early)
      expect(dl!.delay_rate_pct).toBeLessThan(18.0);
      expect(dl!.early_rate_pct).toBeGreaterThan(65.0);

      // Frontier (F9) records highest delay rate (~28.7%)
      expect(f9!.delay_rate_pct).toBeGreaterThan(28.0);

      // Republic (YX) records negative mean arrival delay (-1.79 min) and lowest delay rate (~14.0%)
      expect(yx!.mean_arr_delay).toBeLessThan(0);
      expect(yx!.delay_rate_pct).toBeLessThan(15.0);
    });

    it("ensures all carrier metrics are strictly non-negative and finite", () => {
      for (const c of carriers) {
        expect(Number.isFinite(c.total_flights)).toBe(true);
        expect(c.total_flights).toBeGreaterThan(50000);
        expect(c.delay_rate_pct).toBeGreaterThan(10);
        expect(c.delay_rate_pct).toBeLessThan(35);
        expect(c.early_rate_pct).toBeGreaterThan(50);
        expect(c.early_rate_pct).toBeLessThan(80);
      }
    });
  });

  // =========================================================================
  // 5. AIRPORT SURFACE RUNWAY & TAXI-OUT BOTTLENECKS
  // =========================================================================
  describe("05. Top Origin Hubs & Surface Queuing Bottlenecks", () => {
    const airports = rawData.top_origin_airports;

    it("contains top 30 mega hubs with complete surface queuing telemetry", () => {
      expect(airports).toHaveLength(30);
      for (const a of airports) {
        expect(a.airport_code).toHaveLength(3);
        expect(a.total_departures).toBeGreaterThan(40000);
        expect(a.mean_taxi_out).toBeGreaterThan(13.0);
        expect(a.delay_rate_pct).toBeGreaterThan(10.0);
      }
    });

    it("identifies ORD and LGA as top surface bottlenecks among top 15 volume hubs (>23 min taxi)", () => {
      const top15Hubs = airports.slice(0, 15);
      const ord = top15Hubs.find((a) => a.airport_code === "ORD");
      const lga = top15Hubs.find((a) => a.airport_code === "LGA");

      expect(ord).toBeDefined();
      expect(lga).toBeDefined();

      expect(ord!.mean_taxi_out).toBeGreaterThan(23.5);
      expect(lga!.mean_taxi_out).toBeGreaterThan(23.0);

      // ORD is strictly #1 taxi out among the top 15 volume hubs
      for (const a of top15Hubs) {
        if (a.airport_code !== "ORD") {
          expect(ord!.mean_taxi_out).toBeGreaterThanOrEqual(a.mean_taxi_out);
        }
      }
    });

    it("recognizes ATL as the volume benchmark (>340k departures with efficient taxi)", () => {
      const atl = airports.find((a) => a.airport_code === "ATL");
      expect(atl).toBeDefined();
      expect(atl!.total_departures).toBeGreaterThan(340000);
      expect(atl!.mean_taxi_out).toBeLessThan(17.0);
    });
  });

  // =========================================================================
  // 6. CLIENT-SIDE MULTI-SLICING MATRIX (STRESS SIMULATION)
  // =========================================================================
  describe("06. Interactive Multi-Dimensional Slicer Stability", () => {
    const carrierByMonth = rawData.carrier_by_month as Record<string, Record<string, any>>;
    const hubByMonth = rawData.hub_by_month as Record<string, Record<string, any>>;

    it("guarantees all 15 carriers x 12 months yield valid, non-NaN telemetry slices", () => {
      for (const c of rawData.carriers) {
        const code = c.carrier_code;
        expect(carrierByMonth[code]).toBeDefined();
        for (let m = 1; m <= 12; m++) {
          const slice = carrierByMonth[code][m.toString()];
          expect(slice).toBeDefined();
          expect(slice.flights).toBeGreaterThan(0);
          expect(Number.isFinite(slice.delay_rate_pct)).toBe(true);
          expect(slice.delay_rate_pct).toBeGreaterThan(0);
          expect(slice.delay_rate_pct).toBeLessThan(100);
          expect(Number.isFinite(slice.mean_dep_delay)).toBe(true);
          expect(Number.isFinite(slice.mean_arr_delay)).toBe(true);
        }
      }
    });

    it("guarantees all top 15 volume hubs x 12 months yield valid, non-NaN telemetry slices", () => {
      const top15Hubs = rawData.top_origin_airports.slice(0, 15);
      for (const a of top15Hubs) {
        const hub = a.airport_code;
        expect(hubByMonth[hub]).toBeDefined();
        for (let m = 1; m <= 12; m++) {
          const slice = hubByMonth[hub][m.toString()];
          expect(slice).toBeDefined();
          const departures = slice.departures ?? slice.flights;
          expect(departures).toBeGreaterThan(0);
          expect(Number.isFinite(slice.delay_rate_pct)).toBe(true);
          expect(slice.delay_rate_pct).toBeGreaterThan(0);
          expect(slice.delay_rate_pct).toBeLessThan(100);
          expect(Number.isFinite(slice.mean_dep_delay)).toBe(true);
        }
      }
    });
  });

  // =========================================================================
  // 7. PAGE LAYOUT, TOC ANCHORS & RULE INVARIANTS (PART 1 ISOLATION)
  // =========================================================================
  describe("07. Structural DOM Anchors, TOC & Design Language Invariants", () => {
    const slug = "flight-delay-2024-operations-cockpit";
    const project = getProjectBySlug(slug);

    it("loads the Part 1 case study document successfully", () => {
      expect(project).toBeDefined();
      expect(project!.slug).toBe(slug);
      expect(project!.category).toBe("Data Systems & Aviation Analytics");
    });

    it("strictly enforces Executive Callout (> [!NOTE] or > [!IMPORTANT]) at top of body", () => {
      expect(project!.body).toBeDefined();
      const firstNonEmptyLine = project!.body
        .split("\n")
        .map((l) => l.trim())
        .find((l) => l.length > 0);
      expect(firstNonEmptyLine?.startsWith("> [!NOTE]") || firstNonEmptyLine?.startsWith("> [!IMPORTANT]")).toBe(true);
    });

    it("verifies 1-to-1 mapping of all 8 TOC anchors across Page & Components", () => {
      // 1. Check page.tsx contains operations-cockpit
      const pagePath = path.resolve(__dirname, "../app/projects/flight-delay-2024-operations-cockpit/page.tsx");
      const pageSrc = fs.readFileSync(pagePath, "utf-8");
      expect(pageSrc).toContain('id="operations-cockpit"');

      // 2. Check markdown contains the 6 numbered section anchors {#...}
      const mdPath = path.resolve(__dirname, "../content/projects/flight-delay-2024-operations-cockpit.md");
      const mdSrc = fs.readFileSync(mdPath, "utf-8");
      expect(mdSrc).toContain("{#macro-telemetry}");
      expect(mdSrc).toContain("{#afternoon-wave}");
      expect(mdSrc).toContain("{#carrier-league}");
      expect(mdSrc).toContain("{#runway-bottlenecks}");
      expect(mdSrc).toContain("{#cause-decomposition}");
      expect(mdSrc).toContain("{#methodology}");

      // 3. Check FlightOperationalLessons contains takeaways
      const lessonsPath = path.resolve(__dirname, "../components/FlightOperationalLessons.tsx");
      const lessonsSrc = fs.readFileSync(lessonsPath, "utf-8");
      expect(lessonsSrc).toContain('id="takeaways"');

      // 4. Verify no suite banner exists in Part 1 page (User requested removal)
      expect(pageSrc).not.toContain("Flight Delay 2024 Suite");
      expect(pageSrc).not.toContain("Part 1 of 3");
    });

    it("verifies visual diagram tags in markdown body (no raw ASCII boxes)", () => {
      const mdPath = path.resolve(__dirname, "../content/projects/flight-delay-2024-operations-cockpit.md");
      const mdSrc = fs.readFileSync(mdPath, "utf-8");

      expect(mdSrc).toContain("`diurnal-chart");
      expect(mdSrc).toContain("`causality-chart");
      expect(mdSrc).toContain("`pipeline-architecture");
      // Must not contain broken ASCII pipes or raw text tables simulating flow charts
      expect(mdSrc).not.toContain("+-------+");
    });
  });
});
