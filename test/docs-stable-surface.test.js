import assert from "assert";
import fs from "fs";
import path from "path";
import { describe, it } from "vitest";

const docsRoot = path.join(process.cwd(), "website/docs");
const publicSourceExtensions = new Set([".js", ".md", ".mjs", ".ts", ".tsx", ".vue"]);

function listPublicSources(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "dist" || entry.name === "cache") {
        return [];
      }

      return listPublicSources(filePath);
    }

    return publicSourceExtensions.has(path.extname(entry.name)) ? [filePath] : [];
  });
}

describe("stable documentation surface", () => {
  it("does not publish pre-stable LitSX implementation history", () => {
    const forbiddenReferences = [
      /migrating-to-1/i,
      /static-hoists/i,
      /pre-1\.0/i,
      /before 1\.0/i,
      /custom source language/i,
      /staticProps\(/,
      /staticStyles\(/,
      /@click=\{/,
      /\?disabled=\{/,
      /\.value=\{/,
      /Transform Recipes/i,
    ];

    for (const filePath of listPublicSources(docsRoot)) {
      const source = fs.readFileSync(filePath, "utf8");

      for (const pattern of forbiddenReferences) {
        assert.doesNotMatch(
          source,
          pattern,
          `${path.relative(process.cwd(), filePath)} contains ${pattern}`,
        );
      }
    }
  });

  it("does not expose raw transform-test documentation", () => {
    assert.equal(fs.existsSync(path.join(docsRoot, "transforms")), false);
  });
});
