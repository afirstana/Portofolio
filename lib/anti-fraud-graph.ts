/**
 * Banking Anti-Fraud 3D Force-Directed Knowledge Graph & Syndicate Intelligence Engine
 * Language Standard: 100% Professional English
 */

import { generateSyntheticAntiFraudDataset, FlaggedTransaction } from "./anti-fraud";

export interface Graph3DNode {
  id: string;
  label: string;
  type: "account" | "device" | "atm" | "merchant";
  riskScore: number; // 0 to 6
  riskLevel: "Low" | "Medium" | "High";
  degree: number;
  totalInflow: number;
  totalOutflow: number;
  syndicateId: "alpha" | "beta" | "gamma" | null;
  occupation?: string;
  age?: number;
  balance?: number;
  location?: string;
  flags: string[];
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
}

export interface Graph3DEdge {
  id: string;
  source: string;
  target: string;
  amount: number;
  channel: "ATM" | "Branch" | "Online";
  isFlagged: boolean;
  riskLevel: "Low" | "Medium" | "High";
  timestamp: string;
  flags: string[];
  particleProgress: number; // 0.0 to 1.0 for flow animation
}

export interface SyndicateRing {
  id: "alpha" | "beta" | "gamma";
  name: string;
  tag: string;
  color: string;
  coreNodeId: string;
  memberNodeIds: string[];
  description: string;
  typology: string;
  estimatedStolenVolume: number;
  attackVector: string;
  targetFocus: { yaw: number; pitch: number; dist: number; centerX: number; centerY: number; centerZ: number };
}

export interface GraphMetrics {
  totalNodes: number;
  totalEdges: number;
  accountNodes: number;
  deviceNodes: number;
  merchantNodes: number;
  highRiskNodes: number;
  syndicateRingsCount: number;
  totalMonitoredVolume: number;
  flaggedVolume: number;
}

export interface AntiFraudGraphData {
  nodes: Graph3DNode[];
  edges: Graph3DEdge[];
  syndicates: SyndicateRing[];
  metrics: GraphMetrics;
  nodeIndex: Map<string, Graph3DNode>;
  adjacencyList: Map<string, Set<string>>;
}

let cachedGraphData: AntiFraudGraphData | null = null;

export function getAntiFraudGraphData(): AntiFraudGraphData {
  if (cachedGraphData) return cachedGraphData;

  const rawTxns = generateSyntheticAntiFraudDataset();

  const nodeMap = new Map<string, Graph3DNode>();
  const adjacencyList = new Map<string, Set<string>>();
  const edges: Graph3DEdge[] = [];

  // Helper to ensure node exists in adjacency list
  const ensureAdj = (id: string) => {
    if (!adjacencyList.has(id)) adjacencyList.set(id, new Set());
  };

  // Helper to get or create node
  const getOrCreateNode = (
    id: string,
    label: string,
    type: "account" | "device" | "atm" | "merchant",
    initialRisk: number = 0,
    riskLevel: "Low" | "Medium" | "High" = "Low"
  ): Graph3DNode => {
    if (!nodeMap.has(id)) {
      ensureAdj(id);
      nodeMap.set(id, {
        id,
        label,
        type,
        riskScore: initialRisk,
        riskLevel,
        degree: 0,
        totalInflow: 0,
        totalOutflow: 0,
        syndicateId: null,
        flags: [],
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 250,
        z: (Math.random() - 0.5) * 400,
        vx: 0,
        vy: 0,
        vz: 0,
        radius: type === "account" ? 5 : type === "device" ? 7 : 6
      });
    }
    return nodeMap.get(id)!;
  };

  // 1. Ingest transactions and build account nodes
  for (const tx of rawTxns) {
    const accNode = getOrCreateNode(
      tx.accountId,
      tx.accountId,
      "account",
      tx.riskScore,
      tx.riskLevel
    );

    // Update account profile
    accNode.occupation = tx.customerOccupation;
    accNode.age = tx.customerAge;
    accNode.balance = tx.accountBalance;
    accNode.location = tx.location;
    if (tx.riskScore > accNode.riskScore) {
      accNode.riskScore = tx.riskScore;
      accNode.riskLevel = tx.riskLevel;
    }
    for (const f of tx.flagReasons) {
      if (!accNode.flags.includes(f)) accNode.flags.push(f);
    }

    if (tx.transactionType === "Debit") {
      accNode.totalOutflow += tx.transactionAmount;
    } else {
      accNode.totalInflow += tx.transactionAmount;
    }

    // Connect to Merchant / ATM destination
    let destNodeId = tx.merchantId;
    let destType: "merchant" | "atm" = "merchant";
    if (tx.channel === "ATM") {
      destNodeId = `ATM-${tx.location.toUpperCase().slice(0, 3)}-${(parseInt(tx.merchantId.replace(/\D/g, "") || "1", 10) % 5) + 1}`;
      destType = "atm";
    }

    const destNode = getOrCreateNode(
      destNodeId,
      destType === "atm" ? destNodeId : `Merchant ${tx.merchantId}`,
      destType,
      tx.riskScore > 3 ? 3 : 0,
      tx.riskLevel
    );
    destNode.totalInflow += tx.transactionAmount;

    // Create edge
    const edgeId = `edge-${tx.transactionId}`;
    edges.push({
      id: edgeId,
      source: tx.accountId,
      target: destNodeId,
      amount: tx.transactionAmount,
      channel: tx.channel,
      isFlagged: tx.isFlagged,
      riskLevel: tx.riskLevel,
      timestamp: tx.transactionDate,
      flags: tx.flagReasons,
      particleProgress: Math.random()
    });

    accNode.degree++;
    destNode.degree++;
    adjacencyList.get(tx.accountId)?.add(destNodeId);
    adjacencyList.get(destNodeId)?.add(tx.accountId);

    // If new device or flagged login, link to shared device
    if (tx.flagNewDeviceLocation || tx.flagLoginAttempts || tx.riskScore >= 3) {
      const devNode = getOrCreateNode(
        tx.deviceId,
        `Device ${tx.deviceId}`,
        "device",
        tx.riskScore,
        tx.riskLevel
      );
      devNode.degree++;
      accNode.degree++;
      adjacencyList.get(tx.accountId)?.add(tx.deviceId);
      adjacencyList.get(tx.deviceId)?.add(tx.accountId);

      edges.push({
        id: `dev-link-${tx.transactionId}`,
        source: tx.accountId,
        target: tx.deviceId,
        amount: 0,
        channel: tx.channel,
        isFlagged: tx.isFlagged,
        riskLevel: tx.riskLevel,
        timestamp: tx.transactionDate,
        flags: ["Device Association", ...tx.flagReasons],
        particleProgress: Math.random()
      });
    }
  }

  // 2. Synthesize Ground-Truth Criminal Syndicate Rings
  // Syndicate Ring Alpha: High-Velocity Rapid Balance Drain Ring
  const alphaMuleId = "ACC-1042";
  const alphaVictims = ["ACC-1015", "ACC-1029", "ACC-1064", "ACC-1102", "ACC-1147"];
  const alphaMembers = [alphaMuleId, ...alphaVictims];
  for (const vic of alphaVictims) {
    const vNode = nodeMap.get(vic);
    const mNode = nodeMap.get(alphaMuleId);
    if (vNode && mNode) {
      vNode.syndicateId = "alpha";
      mNode.syndicateId = "alpha";
      vNode.riskScore = Math.max(vNode.riskScore, 5);
      mNode.riskScore = 6;
      vNode.riskLevel = "High";
      mNode.riskLevel = "High";
      vNode.flags.push("Balance Drain (>70%)", "Rapid Succession (<5m)");
      mNode.flags.push("Mule Accumulator Node", "Rapid Inflow Funnel");

      edges.push({
        id: `mule-transfer-${vic}-${alphaMuleId}`,
        source: vic,
        target: alphaMuleId,
        amount: 2850 + Math.floor(Math.random() * 1200),
        channel: "Online",
        isFlagged: true,
        riskLevel: "High",
        timestamp: "2023-11-14T03:22:15Z",
        flags: ["Mule Inflow Transfer", "Rapid Balance Drain"],
        particleProgress: Math.random()
      });
      adjacencyList.get(vic)?.add(alphaMuleId);
      adjacencyList.get(alphaMuleId)?.add(vic);
    }
  }

  // Syndicate Ring Beta: Credential Stuffing & Shared Device Hijack Ring
  const betaDeviceId = "DEV-HIJACK-99";
  const betaDevNode = getOrCreateNode(betaDeviceId, "Bot Farm (DEV-HIJACK-99)", "device", 6, "High");
  betaDevNode.syndicateId = "beta";
  const betaVictims = ["ACC-1205", "ACC-1234", "ACC-1249", "ACC-1280", "ACC-1315"];
  const betaMembers = [betaDeviceId, ...betaVictims];
  for (const bVic of betaVictims) {
    const bvNode = nodeMap.get(bVic);
    if (bvNode) {
      bvNode.syndicateId = "beta";
      bvNode.riskScore = Math.max(bvNode.riskScore, 4);
      bvNode.riskLevel = "High";
      bvNode.flags.push("Credential Stuffing (>=3 Logins)", "Odd Hour (00-04 UTC)");

      edges.push({
        id: `hijack-link-${bVic}-${betaDeviceId}`,
        source: bVic,
        target: betaDeviceId,
        amount: 0,
        channel: "Online",
        isFlagged: true,
        riskLevel: "High",
        timestamp: "2023-08-22T02:14:09Z",
        flags: ["Automated Bot Hijack", "Credential Stuffing"],
        particleProgress: Math.random()
      });
      adjacencyList.get(bVic)?.add(betaDeviceId);
      adjacencyList.get(betaDeviceId)?.add(bVic);
    }
  }

  // Syndicate Ring Gamma: Multi-Metropolitan ATM Funnel Ring
  const gammaAtm1 = "ATM-CGK-01";
  const gammaAtm2 = "ATM-SUB-04";
  const gammaMembers = ["ACC-1310", "ACC-1345", "ACC-1388", "ACC-1420", gammaAtm1, gammaAtm2];
  for (const gId of ["ACC-1310", "ACC-1345", "ACC-1388", "ACC-1420"]) {
    const gNode = nodeMap.get(gId);
    if (gNode) {
      gNode.syndicateId = "gamma";
      gNode.riskScore = Math.max(gNode.riskScore, 5);
      gNode.riskLevel = "High";
      gNode.flags.push("High Amount (>3x Avg)", "Impossible Velocity");

      const targetAtm = Math.random() > 0.5 ? gammaAtm1 : gammaAtm2;
      edges.push({
        id: `atm-funnel-${gId}-${targetAtm}`,
        source: gId,
        target: targetAtm,
        amount: 3500 + Math.floor(Math.random() * 1500),
        channel: "ATM",
        isFlagged: true,
        riskLevel: "High",
        timestamp: "2023-10-05T01:48:30Z",
        flags: ["Coordinated Cash-Out", "Rapid ATM Depletion"],
        particleProgress: Math.random()
      });
      adjacencyList.get(gId)?.add(targetAtm);
      adjacencyList.get(targetAtm)?.add(gId);
    }
  }

  // 3. Pre-compute Equilibrium 3D Force-Directed Layout
  const allNodes = Array.from(nodeMap.values());

  const CLUSTER_ANCHORS = {
    alpha: { cx: 140, cy: -40, cz: 80 },
    beta: { cx: -150, cy: 60, cz: -60 },
    gamma: { cx: 30, cy: 120, cz: -110 }
  };

  for (const node of allNodes) {
    if (node.syndicateId === "alpha") {
      const a = CLUSTER_ANCHORS.alpha;
      node.x = a.cx + (Math.random() - 0.5) * 60;
      node.y = a.cy + (Math.random() - 0.5) * 50;
      node.z = a.cz + (Math.random() - 0.5) * 60;
      node.radius = node.id === alphaMuleId ? 11 : 7.5;
    } else if (node.syndicateId === "beta") {
      const b = CLUSTER_ANCHORS.beta;
      node.x = b.cx + (Math.random() - 0.5) * 65;
      node.y = b.cy + (Math.random() - 0.5) * 55;
      node.z = b.cz + (Math.random() - 0.5) * 65;
      node.radius = node.id === betaDeviceId ? 12 : 7.5;
    } else if (node.syndicateId === "gamma") {
      const c = CLUSTER_ANCHORS.gamma;
      node.x = c.cx + (Math.random() - 0.5) * 65;
      node.y = c.cy + (Math.random() - 0.5) * 50;
      node.z = c.cz + (Math.random() - 0.5) * 65;
      node.radius = node.type === "atm" ? 10 : 7.5;
    } else {
      const u = Math.random();
      const radius = 100 + Math.sqrt(u) * 220;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.75;

      node.x = radius * Math.cos(phi) * Math.cos(theta);
      node.y = (Math.random() - 0.5) * 160;
      node.z = radius * Math.cos(phi) * Math.sin(theta);
      node.radius = node.type === "device" ? 6 : node.type === "merchant" ? 5.5 : 4.5;
    }
  }

  // 35 fast physics relaxation iterations for organic spring equilibrium
  const kSpring = 0.008;
  const restLength = 50;
  const dt = 0.4;

  for (let iter = 0; iter < 35; iter++) {
    for (const e of edges) {
      const src = nodeMap.get(e.source);
      const tgt = nodeMap.get(e.target);
      if (!src || !tgt) continue;

      const dx = tgt.x - src.x;
      const dy = tgt.y - src.y;
      const dz = tgt.z - src.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
      const force = (dist - restLength) * kSpring;

      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      const fz = (dz / dist) * force;

      src.vx += fx * dt;
      src.vy += fy * dt;
      src.vz += fz * dt;

      tgt.vx -= fx * dt;
      tgt.vy -= fy * dt;
      tgt.vz -= fz * dt;
    }

    for (const node of allNodes) {
      if (node.syndicateId) {
        const anchor = CLUSTER_ANCHORS[node.syndicateId];
        node.vx += (anchor.cx - node.x) * 0.015;
        node.vy += (anchor.cy - node.y) * 0.015;
        node.vz += (anchor.cz - node.z) * 0.015;
      } else {
        node.vx -= node.x * 0.002;
        node.vy -= node.y * 0.003;
        node.vz -= node.z * 0.002;
      }

      node.x += node.vx * dt;
      node.y += node.vy * dt;
      node.z += node.vz * dt;

      node.vx *= 0.75;
      node.vy *= 0.75;
      node.vz *= 0.75;
    }
  }

  const syndicates: SyndicateRing[] = [
    {
      id: "alpha",
      name: "Ring Alpha: Rapid Balance Drain Mule Funnel",
      tag: "Mule Accumulator",
      color: "#f43f5e",
      coreNodeId: alphaMuleId,
      memberNodeIds: alphaMembers,
      description: "A coordinated 5-victim balance drain attack where compromised accounts were drained >70% of funds within 3.5 minutes, funneled directly into accumulator mule account ACC-1042.",
      typology: "Multi-Source Fan-In Money Laundering",
      estimatedStolenVolume: 14820,
      attackVector: "Credential phishing followed by simultaneous high-velocity domestic wire transfers.",
      targetFocus: { yaw: -0.65, pitch: 0.28, dist: 380, centerX: 140, centerY: -40, centerZ: 80 }
    },
    {
      id: "beta",
      name: "Ring Beta: Bot Farm & Shared Device Hijack",
      tag: "Device Farm Hijack",
      color: "#a855f7",
      coreNodeId: betaDeviceId,
      memberNodeIds: betaMembers,
      description: "An automated credential stuffing attack executing from a centralized automated device farm (DEV-HIJACK-99) targeting 5 victim accounts during odd hours (01:00–03:00 UTC).",
      typology: "Distributed Account Takeover (ATO)",
      estimatedStolenVolume: 9450,
      attackVector: "Brute-force credential spraying with >=3 failed logins preceding unauthorized debit authorizations.",
      targetFocus: { yaw: 2.1, pitch: -0.22, dist: 390, centerX: -150, centerY: 60, centerZ: -60 }
    },
    {
      id: "gamma",
      name: "Ring Gamma: Coordinated Metropolitan ATM Funnel",
      tag: "Cash-Out Funnel",
      color: "#f59e0b",
      coreNodeId: gammaAtm1,
      memberNodeIds: gammaMembers,
      description: "A synchronized cash-out funnel where skimming clones across 4 accounts initiated simultaneous physical ATM withdrawals in Jakarta and Surabaya within an impossible 24-minute travel window.",
      typology: "Geographically Distributed Skimming Cash-Out",
      estimatedStolenVolume: 18200,
      attackVector: "Physical magnetic stripe cloning executed concurrently across disparate island metropolitan terminals.",
      targetFocus: { yaw: 0.25, pitch: 0.45, dist: 380, centerX: 30, centerY: 120, centerZ: -110 }
    }
  ];

  const totalVol = rawTxns.reduce((acc, t) => acc + t.transactionAmount, 0);
  const flaggedVol = rawTxns.filter(t => t.isFlagged).reduce((acc, t) => acc + t.transactionAmount, 0);

  const metrics: GraphMetrics = {
    totalNodes: allNodes.length,
    totalEdges: edges.length,
    accountNodes: allNodes.filter(n => n.type === "account").length,
    deviceNodes: allNodes.filter(n => n.type === "device").length,
    merchantNodes: allNodes.filter(n => n.type === "merchant" || n.type === "atm").length,
    highRiskNodes: allNodes.filter(n => n.riskLevel === "High").length,
    syndicateRingsCount: syndicates.length,
    totalMonitoredVolume: totalVol,
    flaggedVolume: flaggedVol
  };

  cachedGraphData = {
    nodes: allNodes,
    edges,
    syndicates,
    metrics,
    nodeIndex: nodeMap,
    adjacencyList
  };

  return cachedGraphData;
}

export function get1HopNeighbors(graph: AntiFraudGraphData, nodeId: string): Set<string> {
  const neighbors = new Set<string>();
  neighbors.add(nodeId);
  const direct = graph.adjacencyList.get(nodeId);
  if (direct) {
    for (const id of direct) neighbors.add(id);
  }
  return neighbors;
}

export function get2HopNeighbors(graph: AntiFraudGraphData, nodeId: string): Set<string> {
  const neighbors = get1HopNeighbors(graph, nodeId);
  const oneHop = Array.from(neighbors);
  for (const id of oneHop) {
    const second = graph.adjacencyList.get(id);
    if (second) {
      for (const sId of second) neighbors.add(sId);
    }
  }
  return neighbors;
}
