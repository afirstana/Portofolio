import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { environment: "node", include: ["**/*.test.ts"], exclude: ["out/**", "node_modules/**"] },
});
