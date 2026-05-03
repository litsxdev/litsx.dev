import path from "node:path";
import { fileURLToPath } from "node:url";

const docsScriptsDir = path.dirname(fileURLToPath(import.meta.url));
export const docsRepoRoot = path.resolve(docsScriptsDir, "..", "..", "..");
export const litsxSourceRoot = process.env.LITSX_SOURCE_DIR
  ? path.resolve(process.env.LITSX_SOURCE_DIR)
  : path.resolve(docsRepoRoot, "vendor", "litsx");
