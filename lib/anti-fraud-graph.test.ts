import { describe, it, expect } from "vitest";
import { getAntiFraudGraphData, get1HopNeighbors, get2HopNeighbors } from "./anti-fraud-graph";

describe("Anti-Fraud 3D Knowledge Graph Engine", () => {
  it("extracts valid 3D graph nodes and edges matching the Kaggle dataset profile", () => {
    const graph = getAntiFraudGraphData();
    expect(graph.nodes.length).toBeGreaterThan(495);
    expect(graph.edges.length).toBeGreaterThan(2512);
    expect(graph.metrics.accountNodes).toBe(495);
    expect(graph.metrics.syndicateRingsCount).toBe(3);
    expect(graph.metrics.totalMonitoredVolume).toBeGreaterThan(0);
  });

  it("assigns spatial 3D coordinates (x, y, z) and valid bounding envelopes", () => {
    const graph = getAntiFraudGraphData();
    for (const node of graph.nodes) {
      expect(Number.isFinite(node.x)).toBe(true);
      expect(Number.isFinite(node.y)).toBe(true);
      expect(Number.isFinite(node.z)).toBe(true);
      expect(node.radius).toBeGreaterThan(0);
      expect(["account", "device", "atm", "merchant"]).toContain(node.type);
    }
  });

  it("isolates 3 distinct ground-truth criminal syndicates", () => {
    const graph = getAntiFraudGraphData();
    expect(graph.syndicates).toHaveLength(3);

    const [alpha, beta, gamma] = graph.syndicates;
    expect(alpha.id).toBe("alpha");
    expect(alpha.memberNodeIds.length).toBeGreaterThanOrEqual(5);

    expect(beta.id).toBe("beta");
    expect(beta.coreNodeId).toBe("DEV-HIJACK-99");

    expect(gamma.id).toBe("gamma");
    expect(gamma.memberNodeIds).toContain("ATM-CGK-01");
  });

  it("computes accurate 1-hop and 2-hop topological neighbor subgraphs", () => {
    const graph = getAntiFraudGraphData();
    const alphaMule = "ACC-1042";

    const oneHop = get1HopNeighbors(graph, alphaMule);
    expect(oneHop.has(alphaMule)).toBe(true);
    expect(oneHop.size).toBeGreaterThan(1);

    const twoHop = get2HopNeighbors(graph, alphaMule);
    expect(twoHop.size).toBeGreaterThanOrEqual(oneHop.size);
  });
});
