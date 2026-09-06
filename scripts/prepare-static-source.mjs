import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "out");
const sourceDirectory = join(output, "source");
const sourceEntries = ["app", "components", "content", "lib", "scripts", "analysis", "public", "package.json", "package-lock.json", "next.config.ts", "postcss.config.mjs", "tsconfig.json", "vitest.config.ts", "README.md", ".gitignore"];

await rm(sourceDirectory, { recursive: true, force: true });
await mkdir(sourceDirectory, { recursive: true });

for (const entry of sourceEntries) {
  await cp(join(root, entry), join(sourceDirectory, entry), { recursive: true, force: true });
}

const manifest = {
  format: "static-source-bundle/v1",
  generatedBy: "npm run build",
  includes: sourceEntries,
  editContentIn: "source/content",
  installAndBuild: "npm install && npm run build",
  note: "This folder contains the complete editable Next.js source alongside the static export.",
};

await writeFile(join(output, "SOURCE_MANIFEST.json"), `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile(join(output, "SOURCE_EXPORT_README.md"), "# Editable source included\n\nThe complete Next.js source is bundled in `./source/`. Edit Markdown files under `./source/content/`, then run `pnpm install && pnpm build` from the source folder.\n");
