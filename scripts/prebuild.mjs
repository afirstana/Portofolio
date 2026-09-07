import { writeFile } from "node:fs/promises";

try {
  await writeFile(".next/export/500.html", "<!DOCTYPE html><html><body>500 Internal Server Error</body></html>", { flag: "a" });
} catch {
  // ignore
}
