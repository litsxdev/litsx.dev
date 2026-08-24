import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { cleanDir, writeFile } from "./shared/fs-utils.mjs";
import { docsRepoRoot, litsxSourceRoot } from "./shared/source-roots.mjs";
import { fence } from "./shared/markdown-utils.mjs";

const outputDir = path.join(docsRepoRoot, "website/docs/framework/generated");
const indexDtsPath = path.join(litsxSourceRoot, "packages/core/src/index.d.ts");
const jsxRuntimeDtsPath = path.join(litsxSourceRoot, "packages/core/src/jsx-runtime.d.ts");

const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

function readSource(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  return ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
}

function getJsDocSummary(node) {
  const docs = ts.getJSDocCommentsAndTags(node).filter((entry) => ts.isJSDoc(entry));
  const doc = docs[0];
  if (!doc?.comment) return "";
  return String(doc.comment).trim();
}

function printNode(node, sourceFile) {
  return printer.printNode(ts.EmitHint.Unspecified, node, sourceFile).trim();
}

function hasExportModifier(node) {
  return Boolean(node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword));
}

function collectNamedDeclarations(sourceFile) {
  const declarations = new Map();

  for (const statement of sourceFile.statements) {
    if (!("name" in statement) || !statement.name?.text) continue;
    if (!hasExportModifier(statement)) continue;

    const name = statement.name.text;
    declarations.set(name, {
      name,
      summary: getJsDocSummary(statement),
      declaration: printNode(statement, sourceFile),
    });
  }

  return declarations;
}

function getItems(declarations, names) {
  return names
    .map((name) => declarations.get(name))
    .filter(Boolean);
}

function getDetailedReferenceLink(name) {
  const detailedReferenceNames = new Set([
    "ErrorBoundary",
    "SuspenseBoundary",
    "SuspenseList",
    "useAfterUpdate",
    "useOnCommit",
    "useOnConnect",
    "useEvent",
    "useEmit",
    "useState",
    "useReducedState",
    "useControlledState",
    "useAsyncState",
    "useOptimistic",
    "useTransition",
    "startTransition",
    "useDeferredValue",
    "useMemoValue",
    "usePrevious",
    "useHost",
    "useHostTypeId",
    "useHostContent",
    "useTextContent",
    "useSlot",
    "useRef",
    "useId",
    "useStableId",
    "useCallbackRef",
    "useExpose",
    "useStableCallback",
    "useExternalStore",
    "useStyle",
    "useSsrResourceSnapshot",
  ]);

  if (!detailedReferenceNames.has(name)) return null;
  return `../../reference/generated/${name.toLowerCase()}.md`;
}

function section(title, intro, items) {
  const lines = [`## ${title}`, ""];

  if (intro) {
    lines.push(intro, "");
  }

  for (const item of items) {
    lines.push(`### \`${item.name}\``, "");
    if (item.summary) {
      lines.push(item.summary, "");
    }
    const detailedReferenceLink = getDetailedReferenceLink(item.name);
    if (detailedReferenceLink) {
      lines.push(`Detailed reference: [\`${item.name}\`](${detailedReferenceLink})`, "");
    }
    lines.push(fence(item.declaration, "ts"), "");
  }

  return lines;
}

const indexSource = readSource(indexDtsPath);
const jsxRuntimeSource = readSource(jsxRuntimeDtsPath);

const indexDeclarations = collectNamedDeclarations(indexSource);
const jsxRuntimeDeclarations = collectNamedDeclarations(jsxRuntimeSource);

const categories = [
  {
    title: "Core Types",
    intro: "These types describe the public authored language of Lit<sup>sx</sup>: JSX nodes, renderable values, refs, and component signatures.",
    declarations: indexDeclarations,
    names: [
      "LitsxHook",
      "LitsxComponentStatic",
      "LitsxHydratableComponentStatic",
      "LitsxHostTypeIdStatic",
      "LitsxStyleSourceRegistry",
      "LitsxAuthoringStyle",
      "LitsxStyleInfo",
      "LitsxJsxNode",
      "LitsxRenderable",
      "LitsxRef",
      "LitsxComponent",
      "isLitsxHook",
      "isLitsxComponentClass",
    ],
  },
  {
    title: "JSX Surface Types",
    intro: "These types define how Lit<sup>sx</sup> models intrinsic elements, authored attributes, and the JSX-visible host element shape.",
    declarations: indexDeclarations,
    names: [
      "LitsxBaseAttributes",
      "LitsxEventMetadata",
      "LitsxEventDeclaration",
      "LitsxEventHandler",
      "LitsxEventListener",
      "LitsxStandardDomEventAttributes",
      "LitsxExplicitDomEventAttributes",
      "LitsxExplicitCustomEventAttributes",
      "LitsxStandardCustomEventAttributes",
      "LitsxTypedCustomEventAttributes",
      "LitsxDomAttributes",
      "LitsxHostElementProps",
      "LitsxNativeAttributeAliases",
      "LitsxElementProps",
      "LitsxErrorBoundaryElementProps",
      "LitsxSuspenseBoundaryElementProps",
      "LitsxIntrinsicElements",
    ],
  },
  {
    title: "SSR And Execution Context",
    intro: "These APIs let framework and library integrations carry request-local state and serializable resource snapshots across server rendering and hydration.",
    declarations: indexDeclarations,
    names: [
      "ExecutionContextKey",
      "LitsxExecutionContext",
      "JsonSerializable",
      "SsrResourceSnapshotOptions",
      "createExecutionContextKey",
      "getCurrentExecutionContext",
      "useSsrResourceSnapshot",
    ],
  },
  {
    title: "Primitives",
    intro: "These are the native primitives that define asynchronous UI coordination and recoverable rendering failures in Lit<sup>sx</sup>.",
    declarations: indexDeclarations,
    names: [
      "ErrorBoundary",
      "SuspenseBoundary",
      "SuspenseList",
      "lazy",
      "renderWithHooks",
      "renderWithSoftSuspense",
      "collectSoftSuspenseThenables",
    ],
  },
  {
    title: "Primitive Props",
    intro: "These interfaces describe the public authored props of the native primitives.",
    declarations: indexDeclarations,
    names: [
      "ErrorBoundaryProps",
      "SuspenseBoundaryProps",
      "SuspenseListProps",
    ],
  },
  {
    title: "Lifecycle And Events",
    intro: "These hooks connect authored components to lifecycle timing, stable event callbacks, and DOM event emission.",
    declarations: indexDeclarations,
    names: [
      "useAfterUpdate",
      "useOnCommit",
      "useOnConnect",
      "useEvent",
      "useEmit",
    ],
  },
  {
    title: "State And Concurrency",
    intro: "These hooks own local state, controlled state, async state, optimistic overlays, and deferred rendering work.",
    declarations: indexDeclarations,
    names: [
      "useState",
      "useReducedState",
      "useControlledState",
      "useAsyncState",
      "useOptimistic",
      "useTransition",
      "startTransition",
      "useDeferredValue",
      "useMemoValue",
      "usePrevious",
    ],
  },
  {
    title: "Refs And Imperative APIs",
    intro: "These hooks model host access, mutable refs, callback refs, slot content, projected content, and imperative handles.",
    declarations: indexDeclarations,
    names: [
      "LitsxHostContent",
      "useHost",
      "useHostTypeId",
      "useHostContent",
      "useTextContent",
      "useSlot",
      "useRef",
      "useId",
      "useStableId",
      "useCallbackRef",
      "useExpose",
      "useStableCallback",
    ],
  },
  {
    title: "External Integration",
    intro: "These APIs bridge Lit<sup>sx</sup> components to external state and dynamic host styling.",
    declarations: indexDeclarations,
    names: [
      "useExternalStore",
      "useStyle",
      "replaceStyles",
      "resolveStyle",
    ],
  },
  {
    title: "Structural Hooks And Host Capabilities",
    intro: "Structural hooks request ordinary class mixins for capabilities that must exist on the generated custom-element host.",
    declarations: indexDeclarations,
    names: [
      "LitsxStructuralMixin",
      "LitsxStructuralMixinDefinition",
      "LitsxStructuralDefinition",
      "LitsxStructuralHook",
      "defineHook",
      "isStructuralHook",
      "readStructuralHook",
      "applyStructuralHooks",
    ],
  },
  {
    title: "Forms And Element Internals",
    intro: "These types cover form-associated custom element primitives, validity snapshots, and the internal handles exposed by the form hooks surface.",
    declarations: indexDeclarations,
    names: [
      "LitsxFormSubmitValue",
      "LitsxElementInternalsHandle",
      "LitsxFormValue",
      "LitsxValiditySnapshot",
      "LitsxFormValidity",
      "LitsxEmitOptions",
      "LitsxEmit",
      "LitsxTypedEmit",
    ],
  },
  {
    title: "JSX Runtime",
    intro: "The JSX runtime is what lets editors, TypeScript, and compilers treat Lit<sup>sx</sup> as a first-class JSX framework.",
    declarations: jsxRuntimeDeclarations,
    names: [
      "Fragment",
      "LITSX_JSX_TYPE",
      "jsx",
      "jsxs",
      "JSX",
      "LitsxComponentProps",
    ],
  },
];

const includedNames = new Set(
  categories.flatMap((category) => category.names)
);

const explicitlyExcludedNames = new Set([
  "ErrorBoundaryElement",
  "SuspenseBoundaryElement",
  "SuspenseListElement",
  "ensureLazyElement",
  "LitsxCustomElementProps",
  "LitsxReservedIntrinsicElementName",
  "LitsxCustomIntrinsicElements",
  "SsrEffectsController",
  "runWithHookHost",
  "prepareEffects",
  "jsxSpreadElement",
  "__litsxNoscript",
  "__getLitsxNoscriptFactory",
]);

for (const name of explicitlyExcludedNames) {
  includedNames.add(name);
}

const uncategorizedIndexDeclarations = [...indexDeclarations.keys()].filter(
  (name) => !includedNames.has(name)
);
const uncategorizedJsxRuntimeDeclarations = [...jsxRuntimeDeclarations.keys()].filter(
  (name) => !includedNames.has(name)
);

if (uncategorizedIndexDeclarations.length > 0 || uncategorizedJsxRuntimeDeclarations.length > 0) {
  throw new Error(
    [
      "Framework docs generator has uncategorized public declarations.",
      uncategorizedIndexDeclarations.length > 0
        ? `index.d.ts: ${uncategorizedIndexDeclarations.join(", ")}`
        : null,
      uncategorizedJsxRuntimeDeclarations.length > 0
        ? `jsx-runtime.d.ts: ${uncategorizedJsxRuntimeDeclarations.join(", ")}`
        : null,
    ].filter(Boolean).join("\n")
  );
}

cleanDir(outputDir);

const frameworkLines = [
  "# Framework Reference",
  "",
  "This reference is generated from the public Lit<sup>sx</sup> type surface in `packages/core/src/*.d.ts`.",
  "",
  "It documents the framework API that authors write against. Internal helpers and transform-only support APIs are intentionally left out.",
  "",
  "## Language Model",
  "",
  "Lit<sup>sx</sup> is a compiler and runtime for writing Lit-based web components with standard JSX and TSX.",
  "",
  "- JSX is the authored language",
  "- Lit is the rendering foundation",
  "- web components are the deployed unit",
  "- React compatibility is optional and exists only for legacy migration",
  "",
  "## JSX Surface",
  "",
  "Lit<sup>sx</sup> source uses standard JSX/TSX syntax:",
  "",
  "- authors write ordinary prop and attribute names; the compiler selects Lit binding kinds from the destination contract",
  "- event listeners use the explicit `on:event` channel",
  "- component metadata uses top-level assignments such as `ActionButton.styles = css` and `ActionButton.properties = {...}`",
  "- `.jsx` and `.tsx` work with the standard TypeScript, editor, lint, and formatting ecosystem",
  "",
];

for (const category of categories) {
  frameworkLines.push(
    ...section(
      category.title,
      category.intro,
      getItems(category.declarations, category.names)
    )
  );
}

writeFile(path.join(outputDir, "index.md"), frameworkLines.join("\n"));
