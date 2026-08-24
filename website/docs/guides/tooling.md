# Tooling

Lit<sup>sx</sup> 1.0 is designed around the standard JSX/TSX toolchain. The compiler remains required, but editors, TypeScript, ESLint, Prettier, and Storybook no longer need to parse a custom source language.

## Vite

```js
import { defineConfig } from "vite";
import { litsx } from "@litsx/vite-plugin";

export default defineConfig({
  plugins: [litsx()],
});
```

The plugin transforms `.jsx` and `.tsx`, runs the supported Lit<sup>sx</sup> pipeline, and preserves authored sourcemaps. Important options include:

- `defaultDomMode: "shadow" | "light"`
- `lightDomStyles: "scoped" | "global" | "none"`
- `reactCompat: true | { domMode, reactKeys, transformDependencies }`
- generic `authoringPlugins` and `outputPlugins` extension points

Use `@litsx/compiler` directly only for a custom build integration or programmatic compilation. Build tools that transform many modules can reuse analysis and compiler caches through `createLitsxCompilationSession(...)`:

```js
import { createLitsxCompilationSession } from "@litsx/compiler";

const session = createLitsxCompilationSession({
  projectPath: process.cwd(),
  transformOptions: { sourceMaps: true },
});

const result = await session.transform(source, { filename });
session.invalidate([filename]);
session.dispose();
```

Call `invalidate(...)` for changed watched files and `dispose()` when the build or development server stops. The session also provides `transformSync(...)`.

## TypeScript

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@litsx/core"
  }
}
```

Run ordinary `tsc --noEmit`. The `@litsx/core/jsx-runtime` types cover intrinsic elements, component props, refs, and typed custom events. `.tsx` is the recommended source format; `.jsx` is the JavaScript equivalent.

## ESLint and formatting

```js
import litsx from "@litsx/eslint-plugin";

export default [litsx.configs["recommended-flat"]];
```

The recommended preset enables `no-native-classname`, `valid-component-name`, and `rules-of-hooks`. Component names must derive directly to valid custom-element tags, and hooks must keep a stable order: conditions, early-return tails, loops, `try` blocks, handlers, deferred actions, async render functions, and nested hook declarations are rejected with stable `LITSX_*` diagnostic codes.

The plugin uses normal JSX/TypeScript parsing and does not ship a custom processor. React migration semantics remain owned by the optional compatibility compiler. Format source with standard Prettier TSX support.

## Storybook

```js
import { createLitsxStorybookConfig } from "@litsx/storybook";

export default createLitsxStorybookConfig();
```

The helper builds on `@storybook/web-components-vite`, indexes ordinary `.stories.jsx` and `.stories.tsx`, and registers story elements from compiler metadata. Integrations can place Vite plugins explicitly in `beforeLitsx` or `afterLitsx` phases.

## Optional CSS integrations

Lit<sup>sx</sup> does not require a utility-CSS engine. Component styles can use Lit's `css` template directly, and other CSS systems can compose with the generic `authoringPlugins` and `outputPlugins` phases.

The official Vite adapters compose Lit<sup>sx</sup> compilation with their CSS engine in the correct order:

- [`@litsx/tailwind/vite`](./tailwind.md) for Tailwind CSS v4
- [`@litsx/unocss/vite`](./unocss.md) for UnoCSS

Integration authors can use the shared finite-class analysis exposed by `@litsx/compiler/utility-css`. Applications should use one of the adapters instead of calling those low-level helpers directly.

## Server rendering

`@litsx/vite-plugin` exports `createLitsxViteAssetResolver(...)` for resolving browser module URLs from SSR output. Pair it with `@litsx/ssr`; the plugin itself does not render HTML. See [Server Rendering and Hydration](./ssr.md).

## React compatibility

Enable `reactCompat` in the Vite plugin for staged migration. Selected dependency packages can be allowlisted through `transformDependencies`; unsupported React-hook boundaries are reported instead of leaving a React dispatcher call in the output. New native code should use the standard Lit<sup>sx</sup> authoring model.
