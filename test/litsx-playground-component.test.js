import assert from "assert";
import fs from "fs";
import path from "path";
import * as babelCore from "@babel/core";
import * as babelParser from "@babel/parser";
import { ensureSyntaxTree, syntaxTree } from "@codemirror/language";
import { css, unsafeCSS } from "lit";
import { PLAYGROUND_TYPE_FILES } from "../packages/litsx-playground/src/virtual-types.js";
import { createSourceEditorState } from "../packages/litsx-playground/src/litsx-playground-editors.js";
import { createFallbackPreviewDocument } from "../packages/litsx-playground/src/litsx-playground-preview.js";
import { playgroundStyles } from "../packages/litsx-playground/src/litsx-playground-styles.js";
import {
  litDirectivesExampleSource,
  primitivesExampleSource,
  staticExposeExampleSource,
  useAsyncStateExampleSource,
  useEmitExampleSource,
  useOptimisticExampleSource,
} from "../website/docs/.vitepress/theme/components/playground-example-source.js";
import { beforeAll, describe, it } from "vitest";
const { transformFromAstSync } = babelCore;

const playgroundPath = path.join(
  process.cwd(),
  "packages/litsx-playground/src/LitsxPlayground.tsx"
);
const playgroundHooksPath = path.join(
  process.cwd(),
  "packages/litsx-playground/src/litsx-playground-hooks.tsx"
);
const playgroundPreviewPath = path.join(
  process.cwd(),
  "packages/litsx-playground/src/litsx-playground-preview.js"
);

let nativePreset;

beforeAll(async () => {
  nativePreset = (await import("@litsx/babel-preset-litsx")).default;
});

function transformDocsComponent(source, filename) {
  const ast = babelParser.parse(source, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  return transformFromAstSync(ast, source, {
    filename,
    configFile: false,
    babelrc: false,
    presets: [[nativePreset, {
      typeResolutionMode: "in-memory",
      inMemoryFiles: PLAYGROUND_TYPE_FILES,
    }]],
  }).code;
}

describe("LitsxPlayground docs component", () => {
  it("compiles the real playground shell through the docs pipeline", () => {
    const source = fs.readFileSync(playgroundPath, "utf8");
    const code = transformDocsComponent(source, playgroundPath);

    assert.match(code, /export class LitsxPlayground extends LitElement/);
    assert.match(code, /customElements\.define\(\s*"litsx-playground",\s*LitsxPlayground/);
    assert.match(code, /return renderWithHooks\(this, \(\) =>/);
    assert.match(code, /static styles =/);
    assert.match(code, /import \{[^}]*unsafeCSS[^}]*\} from "lit";/);
    assert.match(code, /css`\$\{unsafeCSS\(playgroundStyles\)\}`/);
    assert.match(code, /const hostContent = useHostContent\(\{\s*trim: true\s*\}\);/);
    assert.match(code, /const slottedSource = hostContent\.text;/);
    assert.match(code, /const \{[\s\S]*cancel: cancelScheduledCompile[\s\S]*schedule: scheduleCompile[\s\S]*\} = useDebouncedAction\(220\);/);
    assert.match(code, /\$\{ref\(sourceEditorElement\)\}/);
    assert.match(code, /\$\{ref\(emittedEditorElement\)\}/);
    assert.match(code, /\$\{ref\(previewFrame\)\}/);
    assert.match(code, /const \[activeEditorPanel, setActiveEditorPanel\] = useState<"source" \| "emitted">\("source"\);/);
    assert.match(code, /usePlaygroundEditorsAndWorker\(\{/);
    assert.match(code, /function createPreviewInstanceId\(\) \{/);
    assert.match(code, /const previewInstanceId = useRef\(createPreviewInstanceId\(\)\);/);
    assert.match(code, /const previousFullscreenRef = useRef<boolean \| null>\(null\);/);
    assert.match(code, /const previewId = `\$\{previewInstanceId\.value\}-preview-\$\{iframeVersion\}`;/);
    assert.match(code, /const isResetDisabled = source === initialSourceRef\.value;/);
    assert.doesNotMatch(code, /ensurePreviewRuntimeUrls\(\)/);
    assert.match(code, /buildPreviewDocument\(emittedCode, this\.exportName, this\.previewTagName, previewId\)/);
    assert.match(code, /usePlaygroundPreviewMessages\(previewFrame, previewId, setPreviewHeight, setPreviewWidth, setPreviewError\);/);
    assert.match(code, /usePlaygroundSourceSync\(\{/);
    assert.match(code, /const \[previewWidth, setPreviewWidth\] = useState\(420\);/);
    assert.match(code, /const \[isFullscreen, setIsFullscreen\] = useState\(false\);/);
    assert.match(code, /document\.startViewTransition/);
    assert.match(code, /useOnConnect\(\(\) => \{/);
    assert.match(code, /useAfterUpdate\(\(\) => \{/);
    assert.match(code, /if \(previousFullscreenRef\.value && !isFullscreen\) \{/);
    assert.match(code, /setPreviewHeight\(initialHeight\);/);
    assert.match(code, /setIframeVersion\(value => value \+ 1\);/);
    assert.match(code, /document\.addEventListener\("fullscreenchange", handleFullscreenChange\);/);
    assert.match(code, /document\.removeEventListener\("fullscreenchange", handleFullscreenChange\);/);
    assert.match(code, /useStyle\("--litsx-playground-preview-height",/);
    assert.match(code, /useStyle\("--litsx-playground-preview-width",/);
    assert.match(code, /workerRef\.value\.postMessage\(\{\s*id: compileRequestId\.value,\s*source: nextSource,\s*filename: this\.filename,\s*mode\s*\}\);/s);
    assert.match(code, /@click=\$\{handleReset\}/);
    assert.match(code, /data-role="fullscreen-button"/);
    assert.match(code, /aria-pressed="\$\{isFullscreen \? "true" : "false"\}"/);
    assert.match(code, /aria-label="\$\{isFullscreen \? "Exit fullscreen" : "Enter fullscreen"\}"/);
    assert.match(code, /title="\$\{isFullscreen \? "Exit fullscreen" : "Enter fullscreen"\}"/);
    assert.match(code, /data-role="reset-button"/);
    assert.match(code, /\?disabled=\$\{isResetDisabled\}/);
    assert.match(code, /class="litsx-playground__action litsx-playground__action--chrome"/);
    assert.match(code, /title="Reset source"/);
    assert.match(code, />Reset<\/button>/);
    assert.match(code, /@click=\$\{\(\) => setActiveEditorPanel\("source"\)\}/);
    assert.match(code, /@click=\$\{\(\) => setActiveEditorPanel\("emitted"\)\}/);
    assert.match(code, /data-role="source-editor"/);
    assert.match(code, /data-role="emitted-editor"/);
    assert.match(code, /class="litsx-playground__workspace"/);
    assert.doesNotMatch(code, /sandbox=/);
  }, 30000);

  it("constructs the package stylesheet as a valid Lit CSS result", () => {
    const styles = css`${unsafeCSS(playgroundStyles)}`;

    assert.match(styles.cssText, /\.litsx-playground__workspace/);
  });

  it("keeps projected source content as authored input instead of manual host reads", () => {
    const source = fs.readFileSync(playgroundPath, "utf8");
    const code = transformDocsComponent(source, playgroundPath);

    assert.doesNotMatch(code, /this\.textContent/);
    assert.doesNotMatch(code, /new MutationObserver/);
    assert.match(code, /const initialSource = \(this\.source \?\? slottedSource \?\? ""\)\.trim\(\);/);
    assert.match(code, /const resolvedPanelMaxHeight = normalizePanelMaxHeight\(this\.panelMaxHeight\);/);
    assert.match(code, /const mode = this\.mode === "react-compat" \? "react-compat" : "native";/);
    assert.match(code, /workerRef\.value\.postMessage\(\{\s*id: compileRequestId\.value,\s*source: nextSource,\s*filename: this\.filename,\s*mode\s*\}\);/s);
  });

  it("compiles the extracted playground hooks through the docs pipeline", () => {
    const source = fs.readFileSync(playgroundHooksPath, "utf8");
    const code = transformDocsComponent(source, playgroundHooksPath);

    assert.match(code, /function useDebouncedAction\(delay: number\)/);
    assert.match(code, /useOnConnect\(\(\) => cancel, \[delay\]\);/);
    assert.match(
      code,
      /function usePlaygroundPreviewMessages\(previewFrame(?:: [^,]+)?, previewId(?:: [^,]+)?, setPreviewHeight(?:: [^,]+)?, setPreviewWidth(?:: [^,]+)?, setPreviewError(?:: [^)]+)?\)/
    );
    assert.match(code, /window\.addEventListener\("message", handlePreviewMessage\);/);
    assert.match(code, /window\.removeEventListener\("message", handlePreviewMessage\);/);
    assert.match(code, /function usePlaygroundEditorsAndWorker\(\{/);
    assert.match(code, /const sourceEditorHost = sourceEditorElement\.value;/);
    assert.match(code, /const emittedEditorHost = emittedEditorElement\.value;/);
    assert.match(code, /const previewHost = previewFrame\.value;/);
    assert.match(code, /function usePlaygroundSourceSync\(\{/);
    assert.doesNotMatch(code, /new MutationObserver/);
  }, 15000);

  it("keeps preview height measurement inside the iframe runtime", () => {
    const source = fs.readFileSync(playgroundPreviewPath, "utf8");

    assert.match(source, /"@litsx\/core\/elements":/);
    assert.match(source, /"@litsx\/scoped-registry-shim":/);
    assert.match(source, /"lit\/directives\/keyed\.js":/);
    assert.match(source, /"lit\/directives\/repeat\.js":/);
    assert.match(source, /"lit\/directives\/when\.js":/);
    assert.match(source, /mountHeight = mount \? mount\.scrollHeight : 0/);
    assert.match(source, /observeHeight\(node\);/);
    assert.match(source, /node\.updateComplete && typeof node\.updateComplete\.then === "function"/);
    assert.match(source, /window\.__litsxPlaygroundReportError = \(message\) => \{/);
    assert.match(source, /type: "litsx-playground-preview-width"/);
    assert.match(source, /const reportWidth = \(\) => \{/);
    assert.match(
      source,
      /if \(Component\.scopedElements && typeof CustomElementRegistry !== "function"\)/
    );
  });

  it("renders compile fallback previews as a message-only document", () => {
    const doc = createFallbackPreviewDocument("Unexpected token (68:16)");

    assert.match(doc, /Unexpected token \(68:16\)/);
    assert.doesNotMatch(doc, /SyntaxError:/);
    assert.doesNotMatch(doc, /at file:/);
  });

  it("exposes the editor max height as a per-instance prop", () => {
    const source = fs.readFileSync(playgroundPath, "utf8");
    const code = transformDocsComponent(source, playgroundPath);

    assert.match(code, /panelMaxHeight:\s*\{\s*type:\s*String\s*\}/);
    assert.match(code, /mode:\s*\{\s*type:\s*String\s*\}/);
    assert.match(code, /function normalizePanelMaxHeight\(value\?: string\)/);
    assert.match(code, /return null;/);
    assert.match(
      code,
      /if \(resolvedPanelMaxHeight != null\) \{\s*useStyle\("--litsx-playground-editor-max-height", resolvedPanelMaxHeight\);\s*\}/s
    );
  });

  it("fully parses authored source examples that use module-level metadata", () => {
    const state = createSourceEditorState(primitivesExampleSource, () => {});
    const tree = ensureSyntaxTree(state, state.doc.length, 5000);
    const errors = [];

    (tree ?? syntaxTree(state)).cursor().iterate((node) => {
      if (node.type.isError) {
        errors.push({
          from: node.from,
          to: node.to,
          text: state.doc.sliceString(node.from, Math.min(state.doc.length, node.to + 32)),
        });
      }
    });

    assert.deepStrictEqual(errors, []);
  });

  it("fully parses the useEmit demo source example", () => {
    const state = createSourceEditorState(useEmitExampleSource, () => {});
    const tree = ensureSyntaxTree(state, state.doc.length, 5000);
    const errors = [];

    (tree ?? syntaxTree(state)).cursor().iterate((node) => {
      if (node.type.isError) {
        errors.push({
          from: node.from,
          to: node.to,
          text: state.doc.sliceString(node.from, Math.min(state.doc.length, node.to + 32)),
        });
      }
    });

    assert.deepStrictEqual(errors, []);
  });

  it("fully parses the useAsyncState demo source example", () => {
    const state = createSourceEditorState(useAsyncStateExampleSource, () => {});
    const tree = ensureSyntaxTree(state, state.doc.length, 5000);
    const errors = [];

    (tree ?? syntaxTree(state)).cursor().iterate((node) => {
      if (node.type.isError) {
        errors.push({
          from: node.from,
          to: node.to,
          text: state.doc.sliceString(node.from, Math.min(state.doc.length, node.to + 32)),
        });
      }
    });

    assert.deepStrictEqual(errors, []);
  });

  it("fully parses the useOptimistic demo source example", () => {
    const state = createSourceEditorState(useOptimisticExampleSource, () => {});
    const tree = ensureSyntaxTree(state, state.doc.length, 5000);
    const errors = [];

    (tree ?? syntaxTree(state)).cursor().iterate((node) => {
      if (node.type.isError) {
        errors.push({
          from: node.from,
          to: node.to,
          text: state.doc.sliceString(node.from, Math.min(state.doc.length, node.to + 32)),
        });
      }
    });

    assert.deepStrictEqual(errors, []);
  });

  it("fully parses the Lit directives demo source example", () => {
    const state = createSourceEditorState(litDirectivesExampleSource, () => {});
    const tree = ensureSyntaxTree(state, state.doc.length, 5000);
    const errors = [];

    (tree ?? syntaxTree(state)).cursor().iterate((node) => {
      if (node.type.isError) {
        errors.push({
          from: node.from,
          to: node.to,
          text: state.doc.sliceString(node.from, Math.min(state.doc.length, node.to + 32)),
        });
      }
    });

    assert.deepStrictEqual(errors, []);
  });

  it("keeps standard event syntax directly parseable in the useEmit demo", () => {
    assert.match(useEmitExampleSource, /on:click=\{\(\) => emit\(/);
    assert.match(useEmitExampleSource, /on:color-change=/);
    assert.doesNotMatch(useEmitExampleSource, /@click=/);
  });

  it("keeps standard event syntax directly parseable in the async demo", () => {
    assert.match(useAsyncStateExampleSource, /on:click=\{\(\) => save\(count \+ 1\)\}/);
    assert.match(useAsyncStateExampleSource, /disabled=\{meta\.pending\}/);
    assert.doesNotMatch(useAsyncStateExampleSource, /@click=/);
  });

  it("keeps module-level styles visible in the source editor", () => {
    const state = createSourceEditorState(primitivesExampleSource, () => {});
    assert.ok(primitivesExampleSource.includes("RuntimeCard.styles = css`"));
    assert.strictEqual(state.doc.toString(), primitivesExampleSource);
  });

  it("fully parses the static expose playground example in the source editor", () => {
    const state = createSourceEditorState(staticExposeExampleSource, () => {});
    const tree = ensureSyntaxTree(state, state.doc.length, 5000);
    const errors = [];

    (tree ?? syntaxTree(state)).cursor().iterate((node) => {
      if (node.type.isError) {
        errors.push({
          from: node.from,
          to: node.to,
          text: state.doc.sliceString(node.from, Math.min(state.doc.length, node.to + 32)),
        });
      }
    });

    assert.deepStrictEqual(errors, []);
  });
});
