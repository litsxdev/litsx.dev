/** @vitest-environment jsdom */

import assert from "assert";
import Babel from "@babel/standalone";
import * as typescript from "typescript";
import { beforeAll, describe, it } from "vitest";
import {
  compileLitsxPlayground,
  setLitsxPlaygroundCompilerRuntime,
} from "../packages/litsx-playground/src/litsx-playground-compiler.js";
import {
  reactContextExampleSource,
  reactMigrationExampleSource,
} from "../website/docs/.vitepress/theme/components/playground-example-source.js";

const runtimeSpecifiers = [
  "lit",
  "@litsx/core",
  "@litsx/core/context",
  "@litsx/core/elements",
  "@litsx/core/rendering",
  "@litsx/core/react-compat",
];

function makeNodeImportable(code) {
  return runtimeSpecifiers.reduce(
    (output, specifier) =>
      output.replaceAll(
        `"${specifier}"`,
        JSON.stringify(import.meta.resolve(specifier)),
      ),
    code,
  );
}

async function importCompiledExample(code) {
  const source = makeNodeImportable(code);
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
});
