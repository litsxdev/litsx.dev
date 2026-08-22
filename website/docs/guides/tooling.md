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

Use `@litsx/compiler` directly only for a custom build integration or programmatic compilation.

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

The recommended rules catch native `className` and React `memo` usage. The plugin uses normal JSX/TypeScript parsing and does not ship a custom processor. Format source with standard Prettier TSX support.

## Storybook

```js
import { createLitsxStorybookConfig } from "@litsx/storybook";

export default createLitsxStorybookConfig();
```

The helper builds on `@storybook/web-components-vite`, indexes ordinary `.stories.jsx` and `.stories.tsx`, and registers story elements from compiler metadata. Integrations can place Vite plugins explicitly in `beforeLitsx` or `afterLitsx` phases.

## Optional CSS integrations

Lit<sup>sx</sup> does not require UnoCSS. Component styles can use Lit's `css` template directly, and other CSS systems can compose with the generic `authoringPlugins` and `outputPlugins` phases.

If a project chooses UnoCSS, `@litsx/unocss/vite` composes Lit<sup>sx</sup> compilation and UnoCSS generation in the correct order. See the [optional UnoCSS integration](./unocss.md).

## Server rendering

`@litsx/vite-plugin` exports `createLitsxViteAssetResolver(...)` for resolving browser module URLs from SSR output. Pair it with `@litsx/ssr`; the plugin itself does not render HTML. See [Server Rendering and Hydration](./ssr.md).

## React compatibility

Enable `reactCompat` in the Vite plugin for staged migration. Selected dependency packages can be allowlisted through `transformDependencies`; unsupported React-hook boundaries are reported instead of leaving a React dispatcher call in the output. New native code should use the standard Lit<sup>sx</sup> authoring model.
