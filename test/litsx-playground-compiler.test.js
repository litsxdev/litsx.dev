import assert from "assert";
import { beforeAll, describe, expect, it, vi } from "vitest";
import {
  controlledStateExampleSource,
  counterExampleSource,
  errorBoundaryExampleSource,
  jsxAuthoringExampleSource,
  nativeRefResolutionExampleSource,
  primitivesExampleSource,
  propertyInferenceExampleSource,
  reactContextExampleSource,
  reactForwardRefExampleSource,
  reactMigrationExampleSource,
  suspenseExampleSource,
  stylingExampleSource,
  useAsyncStateExampleSource,
  useEmitExampleSource,
  useOptimisticExampleSource,
} from "../website/docs/.vitepress/theme/components/playground-example-source.js";

let compileLitsxPlayground;

beforeAll(async () => {
  const mod = await import("../packages/litsx-playground/src/litsx-playground-compiler.js");
  const BabelStandaloneModule = await import("@babel/standalone");
  const typescriptModule = await import("typescript");
  mod.setLitsxPlaygroundCompilerRuntime({
    Babel: BabelStandaloneModule.default ?? BabelStandaloneModule,
    typescript: typescriptModule,
  });
  compileLitsxPlayground = mod.compileLitsxPlayground;
});

async function importCompilerWithMockedRuntime({ transformFromAst, transform } = {}) {
  vi.resetModules();
  const mod = await import("../packages/litsx-playground/src/litsx-playground-compiler.js");
  const BabelStandaloneModule = await import("@babel/standalone");
  const typescriptModule = await import("typescript");
  const actualBabel = BabelStandaloneModule.default ?? BabelStandaloneModule;
  const parserPluginCalls = [];
  const Babel = {
    packages: {
      ...actualBabel.packages,
      parser: {
        ...actualBabel.packages.parser,
        parse(code, options) {
          parserPluginCalls.push(options?.plugins || []);
          return actualBabel.packages.parser.parse(code, options);
        },
      },
    },
    registerPreset: vi.fn(),
    registerPlugin: vi.fn(),
    transformFromAst: transformFromAst || vi.fn(() => ({ ast: { type: "File" }, code: "const output = 1;" })),
    transform: transform || vi.fn((code) => ({ code })),
  };
  mod.setLitsxPlaygroundCompilerRuntime({ Babel, typescript: typescriptModule });
  return { mod, Babel, parserPluginCalls };
}

describe("@litsx/playground compiler", () => {
  it("reuses cached results for the same standard TSX source and options", async () => {
    const { mod, Babel } = await importCompilerWithMockedRuntime();
    const options = { filename: "/playground/Cached.tsx", outputPlugins: [() => ({ visitor: {} })] };
    const source = "export function Demo() { return <p>Hello</p>; }";
    const first = await mod.compileLitsxPlayground(source, options);
    const second = await mod.compileLitsxPlayground(source, options);
    assert.strictEqual(first, second);
    expect(Babel.transformFromAst).toHaveBeenCalledTimes(3);
  });

  it("supports output plugins and optional JSX-template lowering", async () => {
    const transformFromAst = vi.fn()
      .mockReturnValueOnce({ ast: { type: "File" }, code: "const phaseOne = true;", metadata: {} })
      .mockReturnValueOnce({ ast: { type: "File" }, code: "const phaseTwo = true;" });
    const { mod, Babel } = await importCompilerWithMockedRuntime({ transformFromAst });
    const outputPlugin = ["custom-output", { loose: true }];
    const result = await mod.compileLitsxPlayground(
      "export function Demo() { return <p>Hello</p>; }",
      { filename: "/playground/Output.tsx", jsxTemplate: false, outputPlugins: [outputPlugin] },
    );
    expect(Babel.transformFromAst.mock.calls[1][2].plugins).toEqual([outputPlugin]);
    assert.match(result.code, /phaseTwo/);
  });

  it("preloads an injected compiler runtime", async () => {
    const { mod } = await importCompilerWithMockedRuntime();
    const runtime = await mod.preloadLitsxPlaygroundCompiler();
    assert.ok(runtime.Babel);
    assert.ok(runtime.parser);
  });

  it("compiles typed props and module-level component metadata", async () => {
    const source = `
      import { css } from "@litsx/core";
      type CardProps = { title: string; active: boolean };
      export function Card(props: CardProps) { return <article>{props.title}</article>; }
      Card.properties = { active: { reflect: true } };
      Card.styles = css\`:host { display: block; }\`;
    `;
    const { code } = await compileLitsxPlayground(source, { filename: "/playground/Card.tsx" });
    assert.match(code, /export class Card extends LitElement/);
    assert.match(code, /title: \{\s*type: String\s*\}/);
    assert.match(code, /active: \{[\s\S]*type: Boolean[\s\S]*reflect: true/);
    assert.match(code, /static styles =/);
    assert.match(code, /html`<article>/);
  });

  it("lowers standard on:event listeners and native Lit refs", async () => {
    const source = `
      import { useRef, useState } from "@litsx/core";
      export function Counter() {
        const button = useRef<HTMLButtonElement>();
        const [count, setCount] = useState(0);
        return <button ref={button} on:click={() => setCount(count + 1)}>{count}</button>;
      }
    `;
    const { code } = await compileLitsxPlayground(source, { filename: "/playground/Counter.tsx" });
    assert.match(code, /const button = useRef\(\)/);
    assert.match(code, /const \[count, setCount\] = useState\(0\)/);
    assert.match(code, /@click=\$\{\(\) => setCount\(count \+ 1\)\}/);
    assert.match(code, /\$\{ref\(button\)\}/);
  });

  it("rejects the removed custom authoring syntax", async () => {
    await assert.rejects(
      () => compileLitsxPlayground("export function Demo() { static styles = `:host {}`; return <p />; }", { filename: "/playground/Demo.tsx" }),
      /Unexpected reserved word 'static'/,
    );
    await assert.rejects(
      () => compileLitsxPlayground("export function Demo() { return <button @click={save} />; }", { filename: "/playground/Demo.tsx" }),
      /Unexpected token/,
    );
  });

  it("compiles every native documentation playground with the 1.0 pipeline", async () => {
    const examples = [
      ["Counter", counterExampleSource],
      ["ProfileCard", propertyInferenceExampleSource],
      ["Composer", jsxAuthoringExampleSource],
      ["RuntimeCard", primitivesExampleSource],
      ["Disclosure", controlledStateExampleSource],
      ["BoundaryDemo", errorBoundaryExampleSource],
      ["AsyncShowcase", suspenseExampleSource],
      ["StyleCompositionDemo", stylingExampleSource],
      ["NativeRefResolutionDemo", nativeRefResolutionExampleSource],
      ["UseEmitDemo", useEmitExampleSource],
      ["UseAsyncStateDemo", useAsyncStateExampleSource],
      ["UseOptimisticDemo", useOptimisticExampleSource],
    ];
    for (const [name, source] of examples) {
      const { code } = await compileLitsxPlayground(source, { filename: `/playground/${name}.tsx` });
      assert.match(code, new RegExp(`export class ${name}\\b`), name);
      assert.match(code, /html`/, name);
      assert.match(code, /static styles =/, `${name} styles`);
    }
  }, 30000);

  it("publishes typed custom-event metadata from useEmit", async () => {
    const { code } = await compileLitsxPlayground(useEmitExampleSource, { filename: "/playground/UseEmitDemo.tsx" });
    assert.match(code, /static events = \{[\s\S]*"color-change"/);
    assert.match(code, /const emit = useEmit\(\)/);
    assert.match(code, /@color-change=/);
  });

  it("preserves nested CSSResult composition in Component.styles", async () => {
    const { code } = await compileLitsxPlayground(stylingExampleSource, {
      filename: "/playground/StyleCompositionDemo.tsx",
    });
    assert.match(code, /static styles = \[super\.styles \?\? \[\], foundationStyles, themeStyles\]/);
    assert.match(code, /style=\$\{resolveStyle\(\{\s*color: accents\[index\]\s*\}\)\}/);
  });

  it("keeps the async reveal demo genuinely suspendable and binds revealOrder as a property", async () => {
    const { code } = await compileLitsxPlayground(suspenseExampleSource, {
      filename: "/playground/AsyncShowcase.tsx",
    });
    assert.match(code, /throw promise/);
    assert.match(code, /<suspense-list \.revealOrder=\$\{"forwards"\} tail="hidden">/);
    assert.match(code, /\.content=\$\{\(\) =>/);
  });

  it("compiles the React compatibility examples through the separate mode", async () => {
    for (const [name, source] of [
      ["ReactMigrationDemo", reactMigrationExampleSource],
      ["ReactForwardRefDemo", reactForwardRefExampleSource],
      ["ReactContextDemo", reactContextExampleSource],
    ]) {
      const { code } = await compileLitsxPlayground(source, {
        filename: `/playground/${name}.tsx`,
        mode: "react-compat",
      });
      assert.match(code, new RegExp(`export class ${name}\\b`), name);
      assert.match(code, /html`/, name);
      assert.match(code, /static styles =/, `${name} styles`);
    }
  }, 30000);

  it("normalizes unknown modes and does not duplicate the JSX parser plugin", async () => {
    const { mod, parserPluginCalls } = await importCompilerWithMockedRuntime();
    await mod.compileLitsxPlayground("export function Demo() { return <p />; }", {
      filename: "/playground/Demo.tsx",
      mode: "unknown",
      parserPlugins: ["typescript", "jsx"],
    });
    assert.strictEqual(parserPluginCalls[0].filter((plugin) => plugin === "jsx").length, 1);
  });
});
