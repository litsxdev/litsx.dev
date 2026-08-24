/** @vitest-environment jsdom */

import assert from "assert";
import path from "node:path";
import { pathToFileURL } from "node:url";
import Babel from "@babel/standalone";
import * as typescript from "typescript";
import { beforeAll, describe, it } from "vitest";
import {
  compileLitsxPlayground,
  setLitsxPlaygroundCompilerRuntime,
} from "../packages/litsx-playground/src/litsx-playground-compiler.js";
import {
  errorBoundaryExampleSource,
  reactContextExampleSource,
  reactMigrationExampleSource,
  useOptimisticExampleSource,
} from "../website/docs/.vitepress/theme/components/playground-example-source.js";

const runtimeSpecifiers = [
  "lit",
  "@litsx/core",
  "@litsx/core/context",
  "@litsx/core/elements",
  "@litsx/core/rendering",
  "@litsx/core/react-compat",
];

function makeNodeImportable(code, overrides = {}) {
  return runtimeSpecifiers.reduce(
    (output, specifier) =>
      output.replaceAll(
        `"${specifier}"`,
        JSON.stringify(overrides[specifier] ?? import.meta.resolve(specifier)),
      ),
    code,
  );
}

async function importCompiledExample(code, overrides) {
  const source = makeNodeImportable(code, overrides);
  return import(
    `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
  );
}

async function settle(element) {
  await element.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 0));
  await element.updateComplete;
}

beforeAll(() => {
  setLitsxPlaygroundCompilerRuntime({ Babel, typescript });
});

describe("LitSX next regressions", () => {
  it("shows the ErrorBoundary fallback when the demo render fails", async () => {
    const { code } = await compileLitsxPlayground(errorBoundaryExampleSource, {
      filename: "/playground/BoundaryDemo.tsx",
    });
    const previewRuntimeUrl = pathToFileURL(path.join(
      process.cwd(),
      "packages/litsx-playground/dist/playground-runtime.js",
    )).href;
    const { BoundaryDemo } = await importCompiledExample(code, {
      "@litsx/core": previewRuntimeUrl,
    });
    const tagName = "test-error-boundary-next";
    customElements.define(tagName, BoundaryDemo);
    const element = document.createElement(tagName);
    document.body.append(element);

    await settle(element);
    const root = element.shadowRoot;
    assert.ok(root);
    root.querySelector("button").click();
    await settle(element);
    const boundary = root.querySelector("error-boundary");
    assert.ok(boundary);
    await settle(boundary);
    assert.match(boundary.textContent, /Recovered: Demo render failed/);

    element.remove();
  });

  it("updates a React compatibility context consumer when its provider changes", async () => {
    const { code } = await compileLitsxPlayground(reactContextExampleSource, {
      filename: "/playground/ReactContextDemo.tsx",
      mode: "react-compat",
    });
    const { ReactContextDemo } = await importCompiledExample(code);
    const tagName = "test-react-context-next";
    customElements.define(tagName, ReactContextDemo);
    const element = document.createElement(tagName);
    document.body.append(element);

    await settle(element);
    assert.match(element.textContent, /Theme: violet/);
    const card = element.querySelector(".card");
    assert.strictEqual(card.style.getPropertyValue("--theme-border"), "#6d28d9");

    element.querySelector("button").click();
    await settle(element);
    assert.match(element.textContent, /Theme: coral/);
    assert.strictEqual(card.style.getPropertyValue("--theme-border"), "#c2410c");
    assert.strictEqual(
      element.querySelector("theme-swatch p").style.getPropertyValue("--swatch-color"),
      "#fed7aa",
    );

    element.remove();
  });

  it("does not register a lazy loader as a scoped custom-element constructor", async () => {
    const { code } = await compileLitsxPlayground(reactMigrationExampleSource, {
      filename: "/playground/ReactMigrationDemo.tsx",
      mode: "react-compat",
    });

    assert.match(code, /ensureLazyElement\(this, "results-panel", ResultsPanel\)/);
    assert.doesNotMatch(code, /"results-panel": ResultsPanel/);
  });

  it("discards the optimistic demo overlay when reset is clicked", async () => {
    const { code } = await compileLitsxPlayground(useOptimisticExampleSource, {
      filename: "/playground/UseOptimisticDemo.tsx",
    });
    const previewRuntimeUrl = pathToFileURL(path.join(
      process.cwd(),
      "packages/litsx-playground/dist/playground-runtime.js",
    )).href;
    const { UseOptimisticDemo } = await importCompiledExample(code, {
      "@litsx/core": previewRuntimeUrl,
    });
    const tagName = "test-use-optimistic-next";
    customElements.define(tagName, UseOptimisticDemo);
    const element = document.createElement(tagName);
    document.body.append(element);

    await settle(element);
    const root = element.shadowRoot;
    assert.ok(root);
    const authoritativeList = root.querySelector('[data-state="authoritative"]');
    const optimisticList = root.querySelector('[data-state="optimistic"]');
    const addOptimisticButton = root.querySelector('[data-action="add-optimistic"]');
    const resetOverlayButton = root.querySelector('[data-action="reset-overlay"]');
    assert.ok(authoritativeList);
    assert.ok(optimisticList);
    assert.ok(addOptimisticButton);
    assert.ok(resetOverlayButton);
    assert.strictEqual(resetOverlayButton.disabled, true);

    addOptimisticButton.click();
    await settle(element);
    assert.doesNotMatch(authoritativeList.textContent, /Draft #2/);
    assert.match(optimisticList.textContent, /Draft #2/);
    assert.strictEqual(resetOverlayButton.disabled, false);

    resetOverlayButton.click();
    await settle(element);
    assert.doesNotMatch(optimisticList.textContent, /Draft #2/);
    assert.match(optimisticList.textContent, /Review 1\.0 docs/);
    assert.strictEqual(resetOverlayButton.disabled, true);

    element.remove();
  });
});
