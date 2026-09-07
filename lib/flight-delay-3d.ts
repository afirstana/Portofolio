export interface Airport3D {
  code: string;
  city: string;
  state: string;
  lat: number;
  lon: number;
  departures: number;
  meanTaxiOut: number;
  delayRatePct: number;
  isSurfaceBottleneck: boolean;
}

export interface Corridor3D {
  from: string;
  to: string;
  distanceMiles: number;
  dailyFlights: number;
  rippleRiskPct: number;
  isCriticalRipple: boolean;
}

export const TOP_30_AIRPORTS_3D: Airport3D[] = [
  { code: "ATL", city: "Atlanta", state: "GA", lat: 33.6407, lon: -84.4277, departures: 341910, meanTaxiOut: 16.48, delayRatePct: 19.61, isSurfaceBottleneck: false },
  { code: "DFW", city: "Dallas/Fort Worth", state: "TX", lat: 32.8998, lon: -97.0403, departures: 313582, meanTaxiOut: 19.89, delayRatePct: 26.52, isSurfaceBottleneck: false },
  { code: "DEN", city: "Denver", state: "CO", lat: 39.8561, lon: -104.6737, departures: 295840, meanTaxiOut: 18.72, delayRatePct: 24.11, isSurfaceBottleneck: false },
  { code: "ORD", city: "Chicago", state: "IL", lat: 41.9742, lon: -87.9073, departures: 280052, meanTaxiOut: 23.79, delayRatePct: 23.31, isSurfaceBottleneck: true },
  { code: "CLT", city: "Charlotte", state: "NC", lat: 35.2140, lon: -80.9431, departures: 217574, meanTaxiOut: 21.69, delayRatePct: 26.61, isSurfaceBottleneck: false },
  { code: "LAX", city: "Los Angeles", state: "CA", lat: 33.9416, lon: -118.4085, departures: 198740, meanTaxiOut: 18.91, delayRatePct: 19.14, isSurfaceBottleneck: false },
  { code: "PHX", city: "Phoenix", state: "AZ", lat: 33.4352, lon: -112.0101, departures: 185620, meanTaxiOut: 17.15, delayRatePct: 20.88, isSurfaceBottleneck: false },
  { code: "LAS", city: "Las Vegas", state: "NV", lat: 36.0840, lon: -115.1537, departures: 174310, meanTaxiOut: 16.82, delayRatePct: 22.45, isSurfaceBottleneck: false },
  { code: "SEA", city: "Seattle", state: "WA", lat: 47.4502, lon: -122.3088, departures: 163725, meanTaxiOut: 21.24, delayRatePct: 21.21, isSurfaceBottleneck: false },
  { code: "LGA", city: "New York", state: "NY", lat: 40.7769, lon: -73.8740, departures: 162432, meanTaxiOut: 23.46, delayRatePct: 17.63, isSurfaceBottleneck: true },
  { code: "MCO", city: "Orlando", state: "FL", lat: 28.4312, lon: -81.3081, departures: 158920, meanTaxiOut: 18.34, delayRatePct: 25.10, isSurfaceBottleneck: false },
  { code: "BOS", city: "Boston", state: "MA", lat: 42.3656, lon: -71.0096, departures: 143490, meanTaxiOut: 20.59, delayRatePct: 20.04, isSurfaceBottleneck: false },
  { code: "DCA", city: "Washington", state: "DC", lat: 38.8512, lon: -77.0402, departures: 140016, meanTaxiOut: 20.93, delayRatePct: 19.69, isSurfaceBottleneck: false },
  { code: "SFO", city: "San Francisco", state: "CA", lat: 37.6213, lon: -122.3790, departures: 138940, meanTaxiOut: 19.45, delayRatePct: 21.80, isSurfaceBottleneck: false },
  { code: "DTW", city: "Detroit", state: "MI", lat: 42.2162, lon: -83.3554, departures: 135400, meanTaxiOut: 17.60, delayRatePct: 18.42, isSurfaceBottleneck: false },
  { code: "JFK", city: "New York", state: "NY", lat: 40.6413, lon: -73.7781, departures: 132100, meanTaxiOut: 26.31, delayRatePct: 21.50, isSurfaceBottleneck: true },
  { code: "MSP", city: "Minneapolis", state: "MN", lat: 44.8848, lon: -93.2223, departures: 128900, meanTaxiOut: 16.90, delayRatePct: 17.80, isSurfaceBottleneck: false },
  { code: "EWR", city: "Newark", state: "NJ", lat: 40.6895, lon: -74.1745, departures: 125400, meanTaxiOut: 24.29, delayRatePct: 24.10, isSurfaceBottleneck: true },
  { code: "PHL", city: "Philadelphia", state: "PA", lat: 39.8744, lon: -75.2424, departures: 119800, meanTaxiOut: 19.80, delayRatePct: 21.20, isSurfaceBottleneck: false },
  { code: "SLC", city: "Salt Lake City", state: "UT", lat: 40.7899, lon: -111.9791, departures: 113247, meanTaxiOut: 18.21, delayRatePct: 17.17, isSurfaceBottleneck: false },
  { code: "MIA", city: "Miami", state: "FL", lat: 25.7959, lon: -80.2870, departures: 109944, meanTaxiOut: 20.85, delayRatePct: 27.27, isSurfaceBottleneck: false },
  { code: "BWI", city: "Baltimore", state: "MD", lat: 39.1774, lon: -76.6684, departures: 106500, meanTaxiOut: 16.30, delayRatePct: 21.40, isSurfaceBottleneck: false },
  { code: "SAN", city: "San Diego", state: "CA", lat: 32.7338, lon: -117.1933, departures: 101200, meanTaxiOut: 16.10, delayRatePct: 19.50, isSurfaceBottleneck: false },
  { code: "TPA", city: "Tampa", state: "FL", lat: 27.9772, lon: -82.5311, departures: 98400, meanTaxiOut: 16.70, delayRatePct: 23.20, isSurfaceBottleneck: false },
  { code: "MDW", city: "Chicago", state: "IL", lat: 41.7868, lon: -87.7522, departures: 95300, meanTaxiOut: 16.50, delayRatePct: 22.90, isSurfaceBottleneck: false },
  { code: "IAD", city: "Washington", state: "VA", lat: 38.9531, lon: -77.4565, departures: 92100, meanTaxiOut: 19.30, delayRatePct: 20.10, isSurfaceBottleneck: false },
  { code: "BNA", city: "Nashville", state: "TN", lat: 36.1263, lon: -86.6774, departures: 89400, meanTaxiOut: 17.20, delayRatePct: 22.80, isSurfaceBottleneck: false },
  { code: "AUS", city: "Austin", state: "TX", lat: 30.1975, lon: -97.6664, departures: 85200, meanTaxiOut: 17.80, delayRatePct: 21.70, isSurfaceBottleneck: false },
  { code: "DAL", city: "Dallas", state: "TX", lat: 32.8471, lon: -96.8518, departures: 81600, meanTaxiOut: 15.90, delayRatePct: 22.10, isSurfaceBottleneck: false },
  { code: "STL", city: "St. Louis", state: "MO", lat: 38.7472, lon: -90.3599, departures: 78900, meanTaxiOut: 15.40, delayRatePct: 20.90, isSurfaceBottleneck: false },
];

export const TOP_50_CORRIDORS_3D: Corridor3D[] = [
  { from: "ORD", to: "LGA", distanceMiles: 733, dailyFlights: 42, rippleRiskPct: 53.4, isCriticalRipple: true },
  { from: "LGA", to: "ORD", distanceMiles: 733, dailyFlights: 42, rippleRiskPct: 52.8, isCriticalRipple: true },
  { from: "ATL", to: "MCO", distanceMiles: 404, dailyFlights: 38, rippleRiskPct: 41.2, isCriticalRipple: false },
  { from: "MCO", to: "ATL", distanceMiles: 404, dailyFlights: 38, rippleRiskPct: 42.5, isCriticalRipple: false },
  { from: "LAX", to: "SFO", distanceMiles: 337, dailyFlights: 46, rippleRiskPct: 46.8, isCriticalRipple: true },
  { from: "SFO", to: "LAX", distanceMiles: 337, dailyFlights: 46, rippleRiskPct: 48.2, isCriticalRipple: true },
  { from: "JFK", to: "LAX", distanceMiles: 2475, dailyFlights: 32, rippleRiskPct: 49.1, isCriticalRipple: true },
  { from: "LAX", to: "JFK", distanceMiles: 2475, dailyFlights: 32, rippleRiskPct: 47.9, isCriticalRipple: true },
  { from: "ORD", to: "DFW", distanceMiles: 802, dailyFlights: 36, rippleRiskPct: 48.7, isCriticalRipple: true },
  { from: "DFW", to: "ORD", distanceMiles: 802, dailyFlights: 36, rippleRiskPct: 49.3, isCriticalRipple: true },
  { from: "ATL", to: "LGA", distanceMiles: 762, dailyFlights: 34, rippleRiskPct: 46.5, isCriticalRipple: true },
  { from: "LGA", to: "ATL", distanceMiles: 762, dailyFlights: 34, rippleRiskPct: 45.9, isCriticalRipple: true },
  { from: "DEN", to: "PHX", distanceMiles: 602, dailyFlights: 30, rippleRiskPct: 38.4, isCriticalRipple: false },
  { from: "PHX", to: "DEN", distanceMiles: 602, dailyFlights: 30, rippleRiskPct: 39.1, isCriticalRipple: false },
  { from: "ORD", to: "BOS", distanceMiles: 867, dailyFlights: 28, rippleRiskPct: 47.6, isCriticalRipple: true },
  { from: "BOS", to: "ORD", distanceMiles: 867, dailyFlights: 28, rippleRiskPct: 48.1, isCriticalRipple: true },
  { from: "DFW", to: "LAX", distanceMiles: 1235, dailyFlights: 28, rippleRiskPct: 42.1, isCriticalRipple: false },
  { from: "LAX", to: "DFW", distanceMiles: 1235, dailyFlights: 28, rippleRiskPct: 43.4, isCriticalRipple: false },
  { from: "SEA", to: "SFO", distanceMiles: 679, dailyFlights: 26, rippleRiskPct: 44.0, isCriticalRipple: false },
  { from: "SFO", to: "SEA", distanceMiles: 679, dailyFlights: 26, rippleRiskPct: 45.2, isCriticalRipple: true },
  { from: "ATL", to: "CLT", distanceMiles: 226, dailyFlights: 26, rippleRiskPct: 39.8, isCriticalRipple: false },
  { from: "CLT", to: "ATL", distanceMiles: 226, dailyFlights: 26, rippleRiskPct: 41.0, isCriticalRipple: false },
  { from: "ORD", to: "DEN", distanceMiles: 888, dailyFlights: 32, rippleRiskPct: 46.2, isCriticalRipple: true },
  { from: "DEN", to: "ORD", distanceMiles: 888, dailyFlights: 32, rippleRiskPct: 47.0, isCriticalRipple: true },
  { from: "LAS", to: "LAX", distanceMiles: 236, dailyFlights: 34, rippleRiskPct: 41.5, isCriticalRipple: false },
  { from: "LAX", to: "LAS", distanceMiles: 236, dailyFlights: 34, rippleRiskPct: 42.8, isCriticalRipple: false },
  { from: "EWR", to: "ORD", distanceMiles: 719, dailyFlights: 30, rippleRiskPct: 52.1, isCriticalRipple: true },
  { from: "ORD", to: "EWR", distanceMiles: 719, dailyFlights: 30, rippleRiskPct: 51.7, isCriticalRipple: true },
  { from: "BOS", to: "DCA", distanceMiles: 399, dailyFlights: 28, rippleRiskPct: 37.9, isCriticalRipple: false },
  { from: "DCA", to: "BOS", distanceMiles: 399, dailyFlights: 28, rippleRiskPct: 38.6, isCriticalRipple: false },
  { from: "LGA", to: "BOS", distanceMiles: 184, dailyFlights: 32, rippleRiskPct: 43.1, isCriticalRipple: false },
  { from: "BOS", to: "LGA", distanceMiles: 184, dailyFlights: 32, rippleRiskPct: 44.0, isCriticalRipple: false },
  { from: "DEN", to: "LAX", distanceMiles: 862, dailyFlights: 26, rippleRiskPct: 40.2, isCriticalRipple: false },
  { from: "LAX", to: "DEN", distanceMiles: 862, dailyFlights: 26, rippleRiskPct: 41.6, isCriticalRipple: false },
  { from: "ORD", to: "LAX", distanceMiles: 1744, dailyFlights: 26, rippleRiskPct: 46.9, isCriticalRipple: true },
  { from: "LAX", to: "ORD", distanceMiles: 1744, dailyFlights: 26, rippleRiskPct: 47.5, isCriticalRipple: true },
  { from: "ATL", to: "BOS", distanceMiles: 946, dailyFlights: 24, rippleRiskPct: 42.7, isCriticalRipple: false },
  { from: "BOS", to: "ATL", distanceMiles: 946, dailyFlights: 24, rippleRiskPct: 43.5, isCriticalRipple: false },
  { from: "DFW", to: "DEN", distanceMiles: 641, dailyFlights: 26, rippleRiskPct: 42.0, isCriticalRipple: false },
  { from: "DEN", to: "DFW", distanceMiles: 641, dailyFlights: 26, rippleRiskPct: 43.2, isCriticalRipple: false },
  { from: "PHX", to: "LAX", distanceMiles: 370, dailyFlights: 30, rippleRiskPct: 36.8, isCriticalRipple: false },
  { from: "LAX", to: "PHX", distanceMiles: 370, dailyFlights: 30, rippleRiskPct: 37.5, isCriticalRipple: false },
  { from: "MIA", to: "LGA", distanceMiles: 1096, dailyFlights: 26, rippleRiskPct: 49.5, isCriticalRipple: true },
  { from: "LGA", to: "MIA", distanceMiles: 1096, dailyFlights: 26, rippleRiskPct: 50.2, isCriticalRipple: true },
  { from: "DTW", to: "ORD", distanceMiles: 235, dailyFlights: 24, rippleRiskPct: 44.2, isCriticalRipple: false },
  { from: "ORD", to: "DTW", distanceMiles: 235, dailyFlights: 24, rippleRiskPct: 45.1, isCriticalRipple: true },
  { from: "CLT", to: "LGA", distanceMiles: 544, dailyFlights: 24, rippleRiskPct: 47.8, isCriticalRipple: true },
  { from: "LGA", to: "CLT", distanceMiles: 544, dailyFlights: 24, rippleRiskPct: 48.4, isCriticalRipple: true },
  { from: "SEA", to: "ORD", distanceMiles: 1721, dailyFlights: 22, rippleRiskPct: 46.1, isCriticalRipple: true },
  { from: "ORD", to: "SEA", distanceMiles: 1721, dailyFlights: 22, rippleRiskPct: 47.3, isCriticalRipple: true },
];

/**
 * 111-Point High-Fidelity Continental United States (CONUS) Boundary
 * Ordered clockwise starting from Cape Flattery, WA.
 */
export const US_CONTINENTAL_BOUNDARY: [number, number][] = [
  [48.38, -124.7], [47.0, -124.1], [46.2, -124.0], [45.5, -123.9], [44.0, -124.1],
  [42.0, -124.2], [41.0, -124.1], [39.0, -123.7], [38.0, -123.0], [37.5, -122.5],
  [36.5, -121.9], [35.0, -120.6], [34.0, -119.0], [33.7, -118.3], [32.53, -117.12],
  [32.7, -114.7], [31.33, -111.0], [31.33, -109.05], [31.78, -108.2], [31.78, -106.5],
  [30.5, -104.8], [29.2, -103.5], [29.8, -101.4], [27.5, -99.5], [26.0, -97.15],
  [27.8, -97.4], [28.9, -95.3], [29.3, -94.8], [29.7, -93.8], [29.6, -92.5],
  [29.2, -89.4], [30.2, -89.6], [30.3, -88.8], [30.2, -88.0], [30.3, -87.2],
  [30.1, -85.7], [29.8, -84.4], [28.8, -82.7], [27.8, -82.8], [26.1, -81.8],
  [25.1, -81.1], [24.55, -81.78], [25.77, -80.19], [26.7, -80.0], [28.4, -80.6],
  [30.3, -81.4], [31.5, -81.2], [32.0, -80.9], [32.7, -79.9], [33.7, -78.9],
  [34.2, -77.9], [35.2, -75.5], [36.5, -75.9], [36.9, -76.0], [37.9, -75.4],
  [38.7, -75.1], [39.0, -74.9], [39.3, -74.4], [40.5, -74.2], [40.6, -73.7],
  [41.0, -71.9], [41.3, -72.1], [41.5, -70.5], [42.0, -70.2], [42.4, -70.9],
  [43.1, -70.7], [43.6, -70.2], [44.3, -69.0], [44.9, -67.0], [47.4, -69.2],
  [46.0, -70.5], [45.3, -71.1], [45.0, -71.5], [45.0, -73.3], [45.0, -74.7],
  [44.3, -76.0], [43.6, -76.3], [43.3, -78.0], [42.9, -78.9], [42.1, -80.1],
  [41.5, -81.7], [41.7, -83.5], [42.3, -83.0], [43.0, -82.4], [44.0, -82.9],
  [45.4, -83.8], [45.8, -84.7], [45.0, -85.5], [43.2, -86.3], [41.8, -86.8],
  [41.6, -87.2], [41.9, -87.6], [43.0, -87.9], [44.5, -87.9], [45.8, -87.1],
  [46.0, -84.6], [46.5, -86.0], [47.4, -88.0], [46.8, -90.8], [46.7, -92.1],
  [48.0, -89.6], [48.4, -91.5], [48.6, -93.4], [49.4, -95.1], [49.0, -97.2],
  [49.0, -104.0], [49.0, -111.0], [49.0, -116.0], [49.0, -117.0], [49.0, -122.75],
  [48.38, -124.7]
];

/**
 * Great Lakes Shoreline Loops (Michigan, Superior, Erie)
 */
export const US_GREAT_LAKES_OUTLINES: [number, number][][] = [
  // Lake Michigan
  [
    [41.6, -87.2], [41.9, -87.6], [43.0, -87.9], [44.5, -87.9], [45.8, -86.5],
    [45.8, -84.8], [44.8, -86.0], [43.0, -86.3], [41.8, -86.8], [41.6, -87.2]
  ],
  // Lake Superior
  [
    [46.5, -92.0], [47.5, -91.0], [48.0, -89.5], [48.8, -87.5], [47.5, -85.0],
    [46.5, -84.6], [46.5, -87.0], [46.8, -90.5], [46.5, -92.0]
  ],
  // Lake Erie
  [
    [41.7, -83.5], [41.5, -82.5], [41.5, -81.7], [42.1, -80.1], [42.8, -78.9],
    [42.9, -79.3], [42.5, -81.2], [42.0, -83.1], [41.7, -83.5]
  ]
];

export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3958.8; // Earth radius in statute miles
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Maps continental US coordinates (Lat ~24..50, Lon ~-125..-66) into a 3D plane.
 * Centered around Kansas (lat: 38.5, lon: -97.0).
 * Output space: X in [-14, 14], Z in [-9, 9], Y = 0 (ground level).
 */
export function geoToContinentalPlane(
  lat: number,
  lon: number,
  scaleX = 0.45,
  scaleZ = 0.55
): [number, number, number] {
  const centerLat = 38.5;
  const centerLon = -97.0;

  const x = (lon - centerLon) * scaleX;
  const z = -(lat - centerLat) * scaleZ;
  return [x, 0, z];
}

/**
 * Generates an array of 3D points forming a parabolic arc between two endpoints.
 */
export function computeParabolicArcPoints(
  start: [number, number, number],
  end: [number, number, number],
  peakAltitude: number,
  segments = 32
): [number, number, number][] {
  const points: [number, number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = start[0] + (end[0] - start[0]) * t;
    const z = start[2] + (end[2] - start[2]) * t;
    // Parabolic height: 4 * h * t * (1 - t)
    const y = 4 * peakAltitude * t * (1 - t);
    points.push([x, y, z]);
  }
  return points;
}
