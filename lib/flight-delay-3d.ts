/**
 * 3D Aviation Airspace Network — Topological & Rotational Ripple Utilities
 * Bureau of Transportation Statistics (BTS) TranStats 2024 Data Pipeline
 */

export interface Airport3DHub {
  code: string;
  name: string;
  metro: string;
  state: string;
  lat: number;
  lon: number;
  departures: number;
  delayRatePct: number;
  meanTaxiOut: number;
  meanDepDelay: number;
  lateAircraftPct: number;
  isSurfaceBottleneck: boolean;
  isHighRipple: boolean;
}

export interface FlightCorridor3D {
  id: string;
  from: string;
  to: string;
  dailyFlights: number;
  distanceMiles: number;
  rippleRiskPct: number;
  meanDelayMin: number;
  isHighRisk: boolean;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface ProjectedHubPoint {
  screenX: number;
  screenY: number;
  depth: number;
  scale: number;
  hub: Airport3DHub;
  pillarTopScreenY: number;
}

export const TOP_30_AIRPORTS_3D: Airport3DHub[] = [
  { code: "ATL", name: "Hartsfield-Jackson Atlanta", metro: "Atlanta", state: "GA", lat: 33.6407, lon: -84.4277, departures: 341910, delayRatePct: 19.61, meanTaxiOut: 16.48, meanDepDelay: 11.10, lateAircraftPct: 38.2, isSurfaceBottleneck: false, isHighRipple: false },
  { code: "DFW", name: "Dallas/Fort Worth International", metro: "Dallas", state: "TX", lat: 32.8998, lon: -97.0403, departures: 313582, delayRatePct: 26.52, meanTaxiOut: 19.89, meanDepDelay: 18.93, lateAircraftPct: 49.1, isSurfaceBottleneck: false, isHighRipple: true },
  { code: "DEN", name: "Denver International", metro: "Denver", state: "CO", lat: 39.8561, lon: -104.6737, departures: 308645, delayRatePct: 22.45, meanTaxiOut: 18.40, meanDepDelay: 13.26, lateAircraftPct: 44.8, isSurfaceBottleneck: false, isHighRipple: false },
  { code: "ORD", name: "Chicago O'Hare International", metro: "Chicago", state: "IL", lat: 41.9742, lon: -87.9073, departures: 280052, delayRatePct: 23.31, meanTaxiOut: 23.79, meanDepDelay: 15.24, lateAircraftPct: 42.6, isSurfaceBottleneck: true, isHighRipple: false },
  { code: "CLT", name: "Charlotte Douglas International", metro: "Charlotte", state: "NC", lat: 35.2144, lon: -80.9473, departures: 217574, delayRatePct: 26.61, meanTaxiOut: 21.69, meanDepDelay: 18.43, lateAircraftPct: 48.7, isSurfaceBottleneck: true, isHighRipple: true },
  { code: "LAX", name: "Los Angeles International", metro: "Los Angeles", state: "CA", lat: 33.9416, lon: -118.4085, departures: 201840, delayRatePct: 19.82, meanTaxiOut: 17.65, meanDepDelay: 11.45, lateAircraftPct: 39.4, isSurfaceBottleneck: false, isHighRipple: false },
  { code: "PHX", name: "Phoenix Sky Harbor International", metro: "Phoenix", state: "AZ", lat: 33.4373, lon: -112.0078, departures: 192450, delayRatePct: 21.15, meanTaxiOut: 16.80, meanDepDelay: 12.10, lateAircraftPct: 45.2, isSurfaceBottleneck: false, isHighRipple: false },
  { code: "LAS", name: "Harry Reid International", metro: "Las Vegas", state: "NV", lat: 36.0840, lon: -115.1537, departures: 188320, delayRatePct: 23.40, meanTaxiOut: 17.20, meanDepDelay: 14.30, lateAircraftPct: 48.0, isSurfaceBottleneck: false, isHighRipple: false },
  { code: "SEA", name: "Seattle-Tacoma International", metro: "Seattle", state: "WA", lat: 47.4502, lon: -122.3088, departures: 163725, delayRatePct: 21.21, meanTaxiOut: 21.24, meanDepDelay: 9.54, lateAircraftPct: 41.2, isSurfaceBottleneck: true, isHighRipple: false },
  { code: "LGA", name: "LaGuardia Airport", metro: "New York", state: "NY", lat: 40.7769, lon: -73.8740, departures: 162432, delayRatePct: 17.63, meanTaxiOut: 23.46, meanDepDelay: 10.68, lateAircraftPct: 34.5, isSurfaceBottleneck: true, isHighRipple: false },
  { code: "MCO", name: "Orlando International", metro: "Orlando", state: "FL", lat: 28.4312, lon: -81.3081, departures: 158940, delayRatePct: 25.80, meanTaxiOut: 17.50, meanDepDelay: 17.60, lateAircraftPct: 46.5, isSurfaceBottleneck: false, isHighRipple: true },
  { code: "BOS", name: "Boston Logan International", metro: "Boston", state: "MA", lat: 42.3656, lon: -71.0096, departures: 143490, delayRatePct: 20.04, meanTaxiOut: 20.59, meanDepDelay: 12.01, lateAircraftPct: 39.8, isSurfaceBottleneck: false, isHighRipple: false },
  { code: "DCA", name: "Ronald Reagan Washington National", metro: "Washington", state: "DC", lat: 38.8512, lon: -77.0402, departures: 140016, delayRatePct: 19.69, meanTaxiOut: 20.93, meanDepDelay: 12.15, lateAircraftPct: 38.7, isSurfaceBottleneck: false, isHighRipple: false },
  { code: "SFO", name: "San Francisco International", metro: "San Francisco", state: "CA", lat: 37.6213, lon: -122.3790, departures: 138650, delayRatePct: 22.80, meanTaxiOut: 19.40, meanDepDelay: 14.80, lateAircraftPct: 43.1, isSurfaceBottleneck: false, isHighRipple: false },
  { code: "DTW", name: "Detroit Metropolitan", metro: "Detroit", state: "MI", lat: 42.2162, lon: -83.3554, departures: 135200, delayRatePct: 17.40, meanTaxiOut: 18.10, meanDepDelay: 9.80, lateAircraftPct: 33.2, isSurfaceBottleneck: false, isHighRipple: false },
  { code: "EWR", name: "Newark Liberty International", metro: "New York/Newark", state: "NJ", lat: 40.6895, lon: -74.1745, departures: 134100, delayRatePct: 24.90, meanTaxiOut: 22.80, meanDepDelay: 17.20, lateAircraftPct: 44.0, isSurfaceBottleneck: true, isHighRipple: false },
  { code: "MSP", name: "Minneapolis-Saint Paul", metro: "Minneapolis", state: "MN", lat: 44.8848, lon: -93.2223, departures: 132400, delayRatePct: 16.80, meanTaxiOut: 17.90, meanDepDelay: 8.90, lateAircraftPct: 32.5, isSurfaceBottleneck: false, isHighRipple: false },
  { code: "JFK", name: "John F. Kennedy International", metro: "New York", state: "NY", lat: 40.6413, lon: -73.7781, departures: 128900, delayRatePct: 21.50, meanTaxiOut: 24.10, meanDepDelay: 14.20, lateAircraftPct: 36.8, isSurfaceBottleneck: true, isHighRipple: false },
  { code: "IAH", name: "George Bush Intercontinental", metro: "Houston", state: "TX", lat: 29.9902, lon: -95.3368, departures: 124500, delayRatePct: 23.10, meanTaxiOut: 19.30, meanDepDelay: 14.60, lateAircraftPct: 43.5, isSurfaceBottleneck: false, isHighRipple: false },
  { code: "SLC", name: "Salt Lake City International", metro: "Salt Lake City", state: "UT", lat: 40.7899, lon: -111.9791, departures: 113247, delayRatePct: 17.17, meanTaxiOut: 18.21, meanDepDelay: 9.23, lateAircraftPct: 34.0, isSurfaceBottleneck: false, isHighRipple: false },
  { code: "MIA", name: "Miami International", metro: "Miami", state: "FL", lat: 25.7959, lon: -80.2870, departures: 109944, delayRatePct: 27.27, meanTaxiOut: 20.85, meanDepDelay: 19.61, lateAircraftPct: 50.2, isSurfaceBottleneck: false, isHighRipple: true },
  { code: "PHL", name: "Philadelphia International", metro: "Philadelphia", state: "PA", lat: 39.8729, lon: -75.2437, departures: 104500, delayRatePct: 21.80, meanTaxiOut: 20.10, meanDepDelay: 13.90, lateAircraftPct: 42.0, isSurfaceBottleneck: false, isHighRipple: false },
  { code: "BNA", name: "Nashville International", metro: "Nashville", state: "TN", lat: 36.1263, lon: -86.6774, departures: 98400, delayRatePct: 23.60, meanTaxiOut: 17.40, meanDepDelay: 15.10, lateAircraftPct: 47.3, isSurfaceBottleneck: false, isHighRipple: false },
  { code: "BWI", name: "Baltimore/Washington International", metro: "Baltimore", state: "MD", lat: 39.1774, lon: -76.6684, departures: 96800, delayRatePct: 22.40, meanTaxiOut: 16.90, meanDepDelay: 13.80, lateAircraftPct: 46.1, isSurfaceBottleneck: false, isHighRipple: false },
  { code: "SAN", name: "San Diego International", metro: "San Diego", state: "CA", lat: 32.7338, lon: -117.1933, departures: 92400, delayRatePct: 20.90, meanTaxiOut: 16.20, meanDepDelay: 11.80, lateAircraftPct: 43.8, isSurfaceBottleneck: false, isHighRipple: false },
  { code: "FLL", name: "Fort Lauderdale-Hollywood", metro: "Fort Lauderdale", state: "FL", lat: 26.0742, lon: -80.1506, departures: 89500, delayRatePct: 26.80, meanTaxiOut: 17.80, meanDepDelay: 18.50, lateAircraftPct: 48.9, isSurfaceBottleneck: false, isHighRipple: true },
  { code: "AUS", name: "Austin-Bergstrom International", metro: "Austin", state: "TX", lat: 30.1975, lon: -97.6664, departures: 86700, delayRatePct: 22.10, meanTaxiOut: 16.50, meanDepDelay: 13.20, lateAircraftPct: 45.0, isSurfaceBottleneck: false, isHighRipple: false },
  { code: "MDW", name: "Chicago Midway International", metro: "Chicago", state: "IL", lat: 41.7868, lon: -87.7522, departures: 84200, delayRatePct: 24.10, meanTaxiOut: 16.80, meanDepDelay: 15.70, lateAircraftPct: 51.5, isSurfaceBottleneck: false, isHighRipple: true },
  { code: "TPA", name: "Tampa International", metro: "Tampa", state: "FL", lat: 27.9755, lon: -82.5332, departures: 81900, delayRatePct: 24.50, meanTaxiOut: 16.40, meanDepDelay: 15.90, lateAircraftPct: 46.8, isSurfaceBottleneck: false, isHighRipple: false },
  { code: "DAL", name: "Dallas Love Field", metro: "Dallas", state: "TX", lat: 32.8471, lon: -96.8518, departures: 78500, delayRatePct: 23.80, meanTaxiOut: 15.90, meanDepDelay: 15.20, lateAircraftPct: 52.1, isSurfaceBottleneck: false, isHighRipple: true },
];

export const TOP_72_CORRIDORS_3D: FlightCorridor3D[] = [
  // High-Density Hub Trunk Routes
  { id: "ATL-ORD", from: "ATL", to: "ORD", dailyFlights: 42, distanceMiles: 606, rippleRiskPct: 44.5, meanDelayMin: 14.8, isHighRisk: false },
  { id: "ORD-LGA", from: "ORD", to: "LGA", dailyFlights: 38, distanceMiles: 733, rippleRiskPct: 46.8, meanDelayMin: 18.2, isHighRisk: true },
  { id: "DFW-LAX", from: "DFW", to: "LAX", dailyFlights: 36, distanceMiles: 1235, rippleRiskPct: 48.2, meanDelayMin: 17.5, isHighRisk: true },
  { id: "DEN-PHX", from: "DEN", to: "PHX", dailyFlights: 35, distanceMiles: 602, rippleRiskPct: 43.1, meanDelayMin: 12.6, isHighRisk: false },
  { id: "LAX-SFO", from: "LAX", to: "SFO", dailyFlights: 48, distanceMiles: 337, rippleRiskPct: 39.5, meanDelayMin: 11.2, isHighRisk: false },
  { id: "ATL-MCO", from: "ATL", to: "MCO", dailyFlights: 34, distanceMiles: 404, rippleRiskPct: 47.9, meanDelayMin: 16.9, isHighRisk: true },
  { id: "CLT-MCO", from: "CLT", to: "MCO", dailyFlights: 28, distanceMiles: 468, rippleRiskPct: 49.5, meanDelayMin: 19.4, isHighRisk: true },
  { id: "JFK-LAX", from: "JFK", to: "LAX", dailyFlights: 32, distanceMiles: 2475, rippleRiskPct: 38.4, meanDelayMin: 13.9, isHighRisk: false },
  { id: "BOS-DCA", from: "BOS", to: "DCA", dailyFlights: 30, distanceMiles: 399, rippleRiskPct: 37.8, meanDelayMin: 11.5, isHighRisk: false },
  { id: "SEA-SFO", from: "SEA", to: "SFO", dailyFlights: 32, distanceMiles: 679, rippleRiskPct: 42.0, meanDelayMin: 12.3, isHighRisk: false },

  // Midwest & Northeast Corridors
  { id: "ORD-BOS", from: "ORD", to: "BOS", dailyFlights: 26, distanceMiles: 867, rippleRiskPct: 41.2, meanDelayMin: 14.1, isHighRisk: false },
  { id: "ORD-DCA", from: "ORD", to: "DCA", dailyFlights: 28, distanceMiles: 612, rippleRiskPct: 40.5, meanDelayMin: 13.7, isHighRisk: false },
  { id: "ORD-DFW", from: "ORD", to: "DFW", dailyFlights: 34, distanceMiles: 802, rippleRiskPct: 47.2, meanDelayMin: 17.8, isHighRisk: true },
  { id: "ORD-DEN", from: "ORD", to: "DEN", dailyFlights: 30, distanceMiles: 888, rippleRiskPct: 43.6, meanDelayMin: 14.9, isHighRisk: false },
  { id: "DTW-ATL", from: "DTW", to: "ATL", dailyFlights: 24, distanceMiles: 594, rippleRiskPct: 36.5, meanDelayMin: 10.8, isHighRisk: false },
  { id: "DTW-ORD", from: "DTW", to: "ORD", dailyFlights: 22, distanceMiles: 235, rippleRiskPct: 38.1, meanDelayMin: 11.9, isHighRisk: false },
  { id: "MSP-ORD", from: "MSP", to: "ORD", dailyFlights: 28, distanceMiles: 334, rippleRiskPct: 37.2, meanDelayMin: 11.4, isHighRisk: false },
  { id: "MSP-DEN", from: "MSP", to: "DEN", dailyFlights: 20, distanceMiles: 680, rippleRiskPct: 39.0, meanDelayMin: 12.1, isHighRisk: false },
  { id: "PHL-ORD", from: "PHL", to: "ORD", dailyFlights: 22, distanceMiles: 678, rippleRiskPct: 43.8, meanDelayMin: 15.2, isHighRisk: false },
  { id: "EWR-ORD", from: "EWR", to: "ORD", dailyFlights: 28, distanceMiles: 719, rippleRiskPct: 45.9, meanDelayMin: 17.6, isHighRisk: true },

  // Florida & Southeast Flow
  { id: "MIA-ATL", from: "MIA", to: "ATL", dailyFlights: 32, distanceMiles: 594, rippleRiskPct: 51.4, meanDelayMin: 20.3, isHighRisk: true },
  { id: "MIA-JFK", from: "MIA", to: "JFK", dailyFlights: 26, distanceMiles: 1089, rippleRiskPct: 48.7, meanDelayMin: 18.9, isHighRisk: true },
  { id: "MIA-DFW", from: "MIA", to: "DFW", dailyFlights: 24, distanceMiles: 1121, rippleRiskPct: 50.8, meanDelayMin: 21.1, isHighRisk: true },
  { id: "FLL-ATL", from: "FLL", to: "ATL", dailyFlights: 26, distanceMiles: 581, rippleRiskPct: 49.8, meanDelayMin: 19.5, isHighRisk: true },
  { id: "FLL-EWR", from: "FLL", to: "EWR", dailyFlights: 22, distanceMiles: 1065, rippleRiskPct: 49.2, meanDelayMin: 19.8, isHighRisk: true },
  { id: "MCO-EWR", from: "MCO", to: "EWR", dailyFlights: 24, distanceMiles: 937, rippleRiskPct: 48.1, meanDelayMin: 18.7, isHighRisk: true },
  { id: "TPA-ATL", from: "TPA", to: "ATL", dailyFlights: 24, distanceMiles: 406, rippleRiskPct: 45.4, meanDelayMin: 16.2, isHighRisk: true },
  { id: "CLT-ATL", from: "CLT", to: "ATL", dailyFlights: 22, distanceMiles: 226, rippleRiskPct: 46.1, meanDelayMin: 16.5, isHighRisk: true },
  { id: "BNA-ATL", from: "BNA", to: "ATL", dailyFlights: 20, distanceMiles: 214, rippleRiskPct: 44.2, meanDelayMin: 14.8, isHighRisk: false },
  { id: "BWI-MCO", from: "BWI", to: "MCO", dailyFlights: 22, distanceMiles: 787, rippleRiskPct: 47.5, meanDelayMin: 17.3, isHighRisk: true },

  // Texas & Southern Hubs
  { id: "DFW-ATL", from: "DFW", to: "ATL", dailyFlights: 30, distanceMiles: 731, rippleRiskPct: 47.9, meanDelayMin: 18.1, isHighRisk: true },
  { id: "DFW-DEN", from: "DFW", to: "DEN", dailyFlights: 28, distanceMiles: 641, rippleRiskPct: 46.2, meanDelayMin: 16.9, isHighRisk: true },
  { id: "DFW-PHX", from: "DFW", to: "PHX", dailyFlights: 26, distanceMiles: 868, rippleRiskPct: 48.6, meanDelayMin: 18.4, isHighRisk: true },
  { id: "DFW-LAS", from: "DFW", to: "LAS", dailyFlights: 24, distanceMiles: 1055, rippleRiskPct: 49.1, meanDelayMin: 19.0, isHighRisk: true },
  { id: "IAH-ORD", from: "IAH", to: "ORD", dailyFlights: 24, distanceMiles: 925, rippleRiskPct: 44.8, meanDelayMin: 15.6, isHighRisk: false },
  { id: "IAH-DEN", from: "IAH", to: "DEN", dailyFlights: 22, distanceMiles: 862, rippleRiskPct: 43.9, meanDelayMin: 14.8, isHighRisk: false },
  { id: "AUS-DFW", from: "AUS", to: "DFW", dailyFlights: 26, distanceMiles: 190, rippleRiskPct: 44.7, meanDelayMin: 15.1, isHighRisk: false },
  { id: "DAL-MDW", from: "DAL", to: "MDW", dailyFlights: 22, distanceMiles: 793, rippleRiskPct: 53.4, meanDelayMin: 22.4, isHighRisk: true },
  { id: "DAL-HOU", from: "DAL", to: "IAH", dailyFlights: 24, distanceMiles: 239, rippleRiskPct: 51.2, meanDelayMin: 19.8, isHighRisk: true },
  { id: "MDW-ATL", from: "MDW", to: "ATL", dailyFlights: 20, distanceMiles: 591, rippleRiskPct: 50.9, meanDelayMin: 20.6, isHighRisk: true },

  // Mountain & West Coast
  { id: "DEN-LAS", from: "DEN", to: "LAS", dailyFlights: 28, distanceMiles: 628, rippleRiskPct: 46.7, meanDelayMin: 17.2, isHighRisk: true },
  { id: "DEN-LAX", from: "DEN", to: "LAX", dailyFlights: 30, distanceMiles: 862, rippleRiskPct: 43.8, meanDelayMin: 14.5, isHighRisk: false },
  { id: "DEN-SFO", from: "DEN", to: "SFO", dailyFlights: 26, distanceMiles: 967, rippleRiskPct: 44.5, meanDelayMin: 15.3, isHighRisk: false },
  { id: "DEN-SEA", from: "DEN", to: "SEA", dailyFlights: 24, distanceMiles: 1024, rippleRiskPct: 42.7, meanDelayMin: 13.9, isHighRisk: false },
  { id: "SLC-DEN", from: "SLC", to: "DEN", dailyFlights: 24, distanceMiles: 391, rippleRiskPct: 36.8, meanDelayMin: 10.4, isHighRisk: false },
  { id: "SLC-LAX", from: "SLC", to: "LAX", dailyFlights: 22, distanceMiles: 590, rippleRiskPct: 37.4, meanDelayMin: 11.1, isHighRisk: false },
  { id: "PHX-LAX", from: "PHX", to: "LAX", dailyFlights: 32, distanceMiles: 370, rippleRiskPct: 43.6, meanDelayMin: 13.4, isHighRisk: false },
  { id: "LAS-LAX", from: "LAS", to: "LAX", dailyFlights: 34, distanceMiles: 236, rippleRiskPct: 47.8, meanDelayMin: 16.8, isHighRisk: true },
  { id: "SAN-SFO", from: "SAN", to: "SFO", dailyFlights: 24, distanceMiles: 447, rippleRiskPct: 41.5, meanDelayMin: 12.8, isHighRisk: false },
  { id: "SEA-LAX", from: "SEA", to: "LAX", dailyFlights: 28, distanceMiles: 954, rippleRiskPct: 42.1, meanDelayMin: 13.2, isHighRisk: false },

  // Transcontinental & Long Haul
  { id: "BOS-SFO", from: "BOS", to: "SFO", dailyFlights: 18, distanceMiles: 2704, rippleRiskPct: 41.0, meanDelayMin: 14.5, isHighRisk: false },
  { id: "BOS-LAX", from: "BOS", to: "LAX", dailyFlights: 18, distanceMiles: 2611, rippleRiskPct: 40.2, meanDelayMin: 13.9, isHighRisk: false },
  { id: "JFK-SFO", from: "JFK", to: "SFO", dailyFlights: 26, distanceMiles: 2586, rippleRiskPct: 42.4, meanDelayMin: 15.0, isHighRisk: false },
  { id: "EWR-SFO", from: "EWR", to: "SFO", dailyFlights: 22, distanceMiles: 2565, rippleRiskPct: 44.8, meanDelayMin: 16.8, isHighRisk: false },
  { id: "EWR-LAX", from: "EWR", to: "LAX", dailyFlights: 24, distanceMiles: 2454, rippleRiskPct: 43.9, meanDelayMin: 16.1, isHighRisk: false },
  { id: "SEA-ORD", from: "SEA", to: "ORD", dailyFlights: 22, distanceMiles: 1721, rippleRiskPct: 43.5, meanDelayMin: 15.4, isHighRisk: false },
  { id: "SFO-ORD", from: "SFO", to: "ORD", dailyFlights: 26, distanceMiles: 1846, rippleRiskPct: 44.1, meanDelayMin: 15.8, isHighRisk: false },
  { id: "LAX-ORD", from: "LAX", to: "ORD", dailyFlights: 28, distanceMiles: 1744, rippleRiskPct: 45.2, meanDelayMin: 16.7, isHighRisk: true },
  { id: "PHX-ORD", from: "PHX", to: "ORD", dailyFlights: 24, distanceMiles: 1440, rippleRiskPct: 44.0, meanDelayMin: 15.2, isHighRisk: false },
  { id: "LAS-ORD", from: "LAS", to: "ORD", dailyFlights: 22, distanceMiles: 1514, rippleRiskPct: 46.9, meanDelayMin: 17.6, isHighRisk: true },

  // Secondary Corridors
  { id: "ATL-BOS", from: "ATL", to: "BOS", dailyFlights: 20, distanceMiles: 946, rippleRiskPct: 39.8, meanDelayMin: 12.9, isHighRisk: false },
  { id: "ATL-DCA", from: "ATL", to: "DCA", dailyFlights: 22, distanceMiles: 547, rippleRiskPct: 38.6, meanDelayMin: 11.8, isHighRisk: false },
  { id: "CLT-BOS", from: "CLT", to: "BOS", dailyFlights: 18, distanceMiles: 728, rippleRiskPct: 45.1, meanDelayMin: 16.0, isHighRisk: true },
  { id: "CLT-DFW", from: "CLT", to: "DFW", dailyFlights: 20, distanceMiles: 936, rippleRiskPct: 47.4, meanDelayMin: 17.8, isHighRisk: true },
  { id: "DFW-SEA", from: "DFW", to: "SEA", dailyFlights: 18, distanceMiles: 1660, rippleRiskPct: 45.8, meanDelayMin: 16.5, isHighRisk: true },
  { id: "DEN-BOS", from: "DEN", to: "BOS", dailyFlights: 16, distanceMiles: 1754, rippleRiskPct: 42.0, meanDelayMin: 14.2, isHighRisk: false },
  { id: "SLC-SEA", from: "SLC", to: "SEA", dailyFlights: 18, distanceMiles: 689, rippleRiskPct: 36.2, meanDelayMin: 9.8, isHighRisk: false },
  { id: "LAS-PHX", from: "LAS", to: "PHX", dailyFlights: 22, distanceMiles: 255, rippleRiskPct: 46.4, meanDelayMin: 16.1, isHighRisk: true },
  { id: "BWI-ATL", from: "BWI", to: "ATL", dailyFlights: 20, distanceMiles: 577, rippleRiskPct: 43.1, meanDelayMin: 14.2, isHighRisk: false },
  { id: "BNA-ORD", from: "BNA", to: "ORD", dailyFlights: 18, distanceMiles: 409, rippleRiskPct: 45.8, meanDelayMin: 16.6, isHighRisk: true },
  { id: "MCO-ORD", from: "MCO", to: "ORD", dailyFlights: 22, distanceMiles: 1005, rippleRiskPct: 47.1, meanDelayMin: 17.5, isHighRisk: true },
  { id: "FLL-ORD", from: "FLL", to: "ORD", dailyFlights: 18, distanceMiles: 1182, rippleRiskPct: 48.6, meanDelayMin: 18.9, isHighRisk: true },
];

/**
 * Converts Geographic Latitude and Longitude to 3D Cartesian Coordinates
 * Normalized around the continental United States center: ~38.5°N, -97.0°W
 */
export function geoTo3DCartesian(
  lat: number,
  lon: number,
  altitude: number = 0,
  scale: number = 520
): Point3D {
  const centerLat = 38.5;
  const centerLon = -97.0;

  const dLat = (lat - centerLat) * (Math.PI / 180);
  const dLon = (lon - centerLon) * (Math.PI / 180);

  // X axis: Longitude (West -> East)
  const x = dLon * Math.cos(centerLat * (Math.PI / 180)) * scale * 1.25;

  // Z axis: Latitude (North -> South)
  const z = -dLat * scale * 1.25;

  // Y axis: Altitude / Elevation (Up)
  const y = altitude;

  return { x, y, z };
}

/**
 * Projects a 3D point onto a 2D screen coordinate using Yaw and Pitch camera angles.
 */
export function project3DToScreen(
  p: Point3D,
  yaw: number,
  pitch: number,
  cameraDist: number,
  viewportWidth: number,
  viewportHeight: number
): { screenX: number; screenY: number; depth: number; scale: number } {
  // 1. Rotate around Y axis (Yaw)
  const cosYaw = Math.cos(yaw);
  const sinYaw = Math.sin(yaw);
  const x1 = p.x * cosYaw - p.z * sinYaw;
  const z1 = p.x * sinYaw + p.z * cosYaw;
  const y1 = p.y;

  // 2. Rotate around X axis (Pitch)
  const cosPitch = Math.cos(pitch);
  const sinPitch = Math.sin(pitch);
  const y2 = y1 * cosPitch - z1 * sinPitch;
  const z2 = y1 * sinPitch + z1 * cosPitch;
  const x2 = x1;

  // 3. Perspective Projection
  const fov = 750;
  const depth = z2 + cameraDist;
  const scale = depth > 10 ? fov / depth : 1;

  const screenX = viewportWidth / 2 + x2 * scale;
  const screenY = viewportHeight / 2 - y2 * scale;

  return { screenX, screenY, depth, scale };
}

/**
 * Computes great-circle distance in statute miles between two points using the Haversine formula.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3958.8; // Earth radius in miles
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const dPhi = ((lat2 - lat1) * Math.PI) / 180;
  const dLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dPhi / 2) * Math.sin(dPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) * Math.sin(dLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Computes a 3D parabolic bezier curve point between two 3D coordinates.
 */
export function computeParabolicArcPoint(
  p1: Point3D,
  p2: Point3D,
  t: number,
  apexHeight: number
): Point3D {
  const x = p1.x + (p2.x - p1.x) * t;
  const z = p1.z + (p2.z - p1.z) * t;

  const arcY = 4 * apexHeight * t * (1 - t);
  const baseY = p1.y + (p2.y - p1.y) * t;
  const y = baseY + arcY;

  return { x, y, z };
}
