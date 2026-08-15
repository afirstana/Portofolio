import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const readJson = <T>(relativePath: string) => JSON.parse(readFileSync(join(root, relativePath), "utf8")) as T;

describe("Amazon static data artifacts", () => {
  it("keeps dashboard counts and distributions aligned with the analysis summary", () => {
    const summary = readJson<{ dataset: { sourceRows: number; cleanRows: number; uniqueProducts: number; uniqueCategories: number; topLevelCategories: number }; quality: { exactDuplicateRowsRemoved: number; missingByField: Record<string, number> } }>("analysis/amazon/analysis-summary.json");
    const dashboard = readJson<{ dataset: typeof summary.dataset; quality: typeof summary.quality; distributions: { rating: { count: number }[]; discount: { count: number }[] }; categoryStats: { productCount: number }[]; productRecords: unknown[] }>("public/data/amazon/amazon-dashboard.json");
    expect(dashboard.dataset).toMatchObject(summary.dataset);
    expect(dashboard.quality).toMatchObject(summary.quality);
    expect(dashboard.distributions.rating.reduce((sum, bin) => sum + bin.count, 0)).toBe(summary.dataset.cleanRows - summary.quality.missingByField.rating);
    expect(dashboard.distributions.discount.reduce((sum, bin) => sum + bin.count, 0)).toBe(summary.dataset.cleanRows);
    expect(dashboard.categoryStats.reduce((sum, stat) => sum + stat.productCount, 0)).toBe(summary.dataset.cleanRows);
    expect(dashboard.productRecords).toHaveLength(summary.dataset.cleanRows - summary.quality.missingByField.rating);
  });

  it("keeps displayed model evaluation metrics aligned with the evaluated artifact", () => {
    const summary = readJson<{ model: { bestModel: string; threshold: number; confusionMatrix: { truePositive: number; falseNegative: number; falsePositive: number; trueNegative: number }; models: { name: string; accuracy: number; f1: number; rocAuc: number | null }[] } }>("analysis/amazon/analysis-summary.json");
    const model = readJson<{ evaluation: typeof summary.model }>("public/data/amazon/amazon-model.json");
    expect(model.evaluation.bestModel).toBe(summary.model.bestModel);
    expect(model.evaluation.threshold).toBe(summary.model.threshold);
    expect(model.evaluation.confusionMatrix).toMatchObject(summary.model.confusionMatrix);
    expect(model.evaluation.models.map(({ name, accuracy, f1, rocAuc }) => ({ name, accuracy, f1, rocAuc }))).toEqual(summary.model.models.map(({ name, accuracy, f1, rocAuc }) => ({ name, accuracy, f1, rocAuc })));
  });
});
