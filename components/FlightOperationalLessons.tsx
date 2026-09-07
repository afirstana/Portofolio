import React from "react";

interface PillarItem {
  number: string;
  tag: string;
  isProblem: boolean;
  title: string;
  body: string;
  metricLabel: string;
  metricValue: string;
}

const COCKPIT_PILLARS: PillarItem[] = [
  {
    number: "01",
    tag: "ROTATION TURNAROUND RIPPLE",
    isProblem: true,
    title: "Late Aircraft Ripple Dominates National Delay",
    body: "Over 40.4% of all delayed minutes stem from upstream flight legs, demonstrating that aircraft rotation turnaround buffers are the primary determinant of network stability.",
    metricLabel: "PRIMARY ATTRIBUTION",
    metricValue: "40.44% of National Delay Minutes (41.97M min)",
  },
  {
    number: "02",
    tag: "DIURNAL COMPOUNDING DYNAMICS",
    isProblem: true,
    title: "Diurnal Compounding Multiplies Risk by 3.3×",
    body: "Flights departing after 18:00 face a 29.8% delay risk compared to 8.9% for morning departures, validating buffer depletion across multiple daily rotations.",
    metricLabel: "PEAK DISRUPTION ESCALATION",
    metricValue: "3.3× Risk Multiplier (8.9% ➔ 29.8% Peak)",
  },
  {
    number: "03",
    tag: "SCHEDULE BUFFERING PARADOX",
    isProblem: false,
    title: "Scheduled Buffer Paradox",
    body: "Over 61.8% of flights arrive early due to an average +5.5 minutes of schedule padding engineered into CRS elapsed block times.",
    metricLabel: "OPERATIONAL BASELINE",
    metricValue: "+5.5 min CRS Padding (61.85% Early Arrivals)",
  },
  {
    number: "04",
    tag: "SURFACE TAXI QUEUING BOTTLENECK",
    isProblem: true,
    title: "Ground Surface Bottlenecks Burn Fuel at Hubs",
    body: "Chicago O'Hare (ORD) and New York LaGuardia (LGA) average over 23 minutes in taxi-out queuing, isolating airport surface management as a primary lever for emission reductions.",
    metricLabel: "RUNWAY CONGESTION SPIKE",
    metricValue: "23.8m (ORD) & 23.5m (LGA) Taxi-Out Duration",
  },
];

const AIRSPACE_PILLARS: PillarItem[] = [
  {
    number: "01",
    tag: "SPATIAL VULNERABILITY MAPPING",
    isProblem: true,
    title: "Spatial Geography Shapes Bottleneck Exposure",
    body: "High-density Northeast and Florida corridors operate at over 48% ripple vulnerability due to constrained airspace slots and perimeter gate congestion.",
    metricLabel: "CORRIDOR CONGESTION VULNERABILITY",
    metricValue: "48.2% Ripple Exposure (JFK, LGA, MCO, MIA)",
  },
  {
    number: "02",
    tag: "TAXI-OUT EXTRUSION PREDICTION",
    isProblem: true,
    title: "Taxi-Out Height Predicts Turn Instability",
    body: "Hubs where ground taxi duration exceeds 21.0 minutes (ORD, LGA, CLT, JFK) suffer severe gate pushback hold delays that deplete subsequent schedule buffers.",
    metricLabel: "SURFACE TAXI INSTABILITY THRESHOLD",
    metricValue: "> 21.0 min Tarmac Pushback Hold Window",
  },
  {
    number: "03",
    tag: "ORTHODROMIC ARC GEOMETRY",
    isProblem: false,
    title: "Great-Circle Geometry Reveals True Route Length",
    body: "Orthodromic parabolic flight arcs demonstrate that transcontinental flights (JFK-LAX 2,475 mi) absorb en-route tailwinds to maintain higher on-time arrival despite longer absolute flight times.",
    metricLabel: "TRANSCONTINENTAL AIR ROUTING",
    metricValue: "2,475 mi Orthodromic Great-Circle Trajectory",
  },
  {
    number: "04",
    tag: "COGNITIVE ERGONOMICS & MINIMALISM",
    isProblem: false,
    title: "Monochrome Focus Eliminates Visual Clutter",
    body: "Restricting high-intensity accent colors exclusively to operational bottlenecks enables dispatchers to identify airspace failures within 200 milliseconds.",
    metricLabel: "DISPATCHER TRIAGE LATENCY",
    metricValue: "< 200ms Cognitive Visual Attention Triage",
  },
];

interface FlightOperationalLessonsProps {
  sectionNumber: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  impact?: string;
  projectType: "cockpit" | "3d-airspace";
}

export function FlightOperationalLessons({
  sectionNumber,
  eyebrow,
  title,
  subtitle,
  impact,
  projectType,
}: FlightOperationalLessonsProps) {
  const pillars = projectType === "cockpit" ? COCKPIT_PILLARS : AIRSPACE_PILLARS;

  return (
    <section id="takeaways" aria-label="Engineering Takeaways and Operational Lessons" style={{ marginTop: 40, marginBottom: 40 }}>
      {/* Clean Portfolio Section Header - 100% Monochrome, No Red Header */}
      <div style={{ marginBottom: 24, borderBottom: "1px solid var(--line)", paddingBottom: 16 }}>
        <div
          className="mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.08em",
            color: "var(--dim)",
            textTransform: "uppercase",
            marginBottom: 6,
            fontWeight: 600,
          }}
        >
          {sectionNumber}. {eyebrow}
        </div>
        <h2
          style={{
            fontSize: "clamp(20px, 2.2vw, 26px)",
            fontWeight: 700,
            color: "var(--ink-heading)",
            letterSpacing: "-0.03em",
            margin: "0 0 8px",
          }}
        >
          {title}
        </h2>
        <p style={{ fontSize: 14, color: "var(--muted)", margin: 0, lineHeight: 1.6 }}>
          {subtitle}
        </p>
      </div>

      {/* Structured 2-Column Responsive Card Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 16,
          marginBottom: impact ? 24 : 0,
        }}
      >
        {pillars.map((pillar) => (
          <div
            key={pillar.number}
            style={{
              background: "var(--panel)",
              border: `1px solid ${pillar.isProblem ? "rgba(255, 77, 28, 0.25)" : "var(--line)"}`,
              borderRadius: 6,
              padding: "20px 22px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 14,
              transition: "border-color 0.15s ease",
            }}
          >
            <div>
              {/* Card Header Tag Strip */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
                <span
                  className="mono"
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: pillar.isProblem ? "var(--accent)" : "var(--dim)",
                    letterSpacing: "0.06em",
                  }}
                >
                  PILLAR {pillar.number} • {pillar.tag}
                </span>
                {pillar.isProblem && (
                  <span
                    className="mono"
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: 3,
                      background: "rgba(255, 77, 28, 0.12)",
                      color: "var(--accent)",
                      border: "1px solid rgba(255, 77, 28, 0.3)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    PROBLEM FOCUS
                  </span>
                )}
              </div>

              {/* Bold Title */}
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "var(--ink-heading)",
                  margin: "0 0 8px",
                  lineHeight: 1.4,
                  letterSpacing: "-0.01em",
                }}
              >
                {pillar.title}
              </h3>

              {/* Narrative Description */}
              <p
                style={{
                  fontSize: 13.5,
                  color: "var(--muted)",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {pillar.body}
              </p>
            </div>

            {/* Bottom Empirical Metric Chip */}
            <div
              style={{
                marginTop: 4,
                padding: "8px 12px",
                background: "var(--surface)",
                border: "1px solid var(--line)",
                borderRadius: 4,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <span
                className="mono"
                style={{
                  fontSize: 10,
                  color: "var(--dim)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                {pillar.metricLabel}
              </span>
              <strong
                className="mono"
                style={{
                  fontSize: 12.5,
                  color: pillar.isProblem ? "var(--accent)" : "var(--ink-heading)",
                  fontWeight: 700,
                }}
              >
                {pillar.metricValue}
              </strong>
            </div>
          </div>
        ))}
      </div>

      {/* Validated Operational Impact Banner */}
      {impact && (
        <div
          style={{
            background: "var(--panel)",
            border: "1px solid var(--line)",
            borderLeft: "3px solid var(--accent)",
            borderRadius: 6,
            padding: "16px 20px",
            marginTop: 16,
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: "var(--dim)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 6,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>BTS &amp; FAA EMPIRICAL VALIDATION IMPACT</span>
          </div>
          <p
            style={{
              fontSize: 13.5,
              color: "var(--muted)",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            {impact}
          </p>
        </div>
      )}
    </section>
  );
}
