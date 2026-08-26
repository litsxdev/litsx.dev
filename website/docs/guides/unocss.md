# Optional UnoCSS Integration

UnoCSS is optional. Lit<sup>sx</sup> does not require a utility-CSS engine: the standard styling path is Lit's `css` tagged template assigned to `Component.styles`, and projects may integrate other CSS solutions.

`@litsx/unocss` is the Lit<sup>sx</sup>-provided integration for teams that choose UnoCSS. It generates component-owned utility CSS for both Shadow DOM and Light DOM. The root package is build-tool neutral; `@litsx/unocss/vite` adapts it to Vite.

Use this package when UnoCSS matches the project's styling strategy. Otherwise, continue with [`Component.styles = css\`...\``](./styling.md) or another compiler/build integration.

```sh
npm install -D @litsx/unocss unocss
```

```js
import { presetWind3 } from "unocss";
import { defineConfig } from "vite";
import { litsxUnoCss } from "@litsx/unocss/vite";

export default defineConfig({
  plugins: [
    litsxUnoCss({
      unocss: { presets: [presetWind3()] },
    }),
  ],
});
```

The adapter compiles Lit<sup>sx</sup>, extracts utilities for each component, preserves authored `Component.styles`, and shares the project preflight without embedding an independent reset in every production module. In production it finalizes the global sheet after collecting the module graph; during Vite development it refreshes both component and global output when modules, tokens, or UnoCSS configuration change.

## Finite class bindings

Complete utility strings reachable from a component's `class` or `className` expressions are resolved automatically:

```tsx
const BASE_CLASSES = "inline-flex items-center";
const SIZE_CLASSES = {
  sm: "h-8 px-3 text-sm",
  lg: "h-12 px-6 text-lg",
} as const;

export function ActionButton({ size = "sm" }) {
  return (
    <button class={`${BASE_CLASSES} ${SIZE_CLASSES[size]}`}>
      Save
    </button>
  );
}
```

Local constants, finite maps, static template literals, constant composition, finite branches, and exact resolvable imports or re-exports are supported. Imported dependencies are watched for development updates. The binding establishes ownership, so unrelated strings and utilities owned by sibling components do not leak into this component's generated sheet.

This is the recommended form for variants: keep the runtime lookup and its finite utility inventory together. Do not repeat a resolvable map in `Component.styles`.

## Free Light DOM templates

A module can contain compiled Lit<sup>sx</sup> components and free Light DOM JSX, including Storybook `render` functions. The compiler records free-template candidates as a separate global contribution: their utilities reach `virtual:uno.css`, while utilities used only by a Shadow DOM component remain in that component's `CSSResult`.

Pure Lit class bodies remain opaque. Their Lit templates and static styles are not scanned as Lit<sup>sx</sup> components or reclassified as free document output.

## Light-DOM routing

```js
litsxUnoCss({
  litsx: {
    lightDomStyles: "scoped", // "scoped" | "global" | "none"
  },
});
```

- `scoped` is the default and isolates generated utility selectors to a stable light-DOM component boundary.
- `global` sends generated utilities to the integration-owned document sheet.
- `none` disables automatic generated styles for light-DOM components.

Shadow-DOM components always keep their generated utility sheet locally. The normal Vite integration emits the shared document sheet once for generated components. Import `virtual:uno.css` explicitly only from ordinary browser modules that are not compiled as Lit<sup>sx</sup> components and also need global utilities. React compatibility selects the global route because migrated React trees expect document-level CSS.

## Preflight destinations

By default, the UnoCSS `theme` preflight layer is routed to the document sheet and omitted from component shadow styles. Other layers remain available in shadow roots. This lets theme custom properties inherit through nested roots without repeating or resetting them in every component.

Override ownership by layer name when a preset uses a different structure:

```js
litsxUnoCss({
  integration: {
    preflightLayers: {
      component: ({ layer }) => layer !== "tokens",
      global: ["tokens"],
    },
  },
});
```

Set `integration.globalCssModule: false` only when the surrounding framework owns document CSS generation.

## Explicit guards for opaque classes

Use a statically enumerable `Component.styles` guard only when a class expression is opaque or cannot be resolved to a finite set. For example, a value received whole from outside the component has no static shape to follow:

```tsx
import { css } from "@litsx/core";
import { BUTTON_SIZE_CLASSES } from "./button.styles";

export function ActionButton({ className }) {
  return <button class={className}>Save</button>;
}

ActionButton.styles = [
  BUTTON_SIZE_CLASSES,
  css`:host { display: inline-block; }`,
];
```

The integration resolves that exact export and its statically reachable dependencies without executing application modules, generates a component-owned `CSSResult`, and removes the guard object from the runtime Lit styles value. Static strings, objects, arrays, tuples, nested structures, finite branches, and exact imports/re-exports are supported. A cycle, function call, or other non-finite guard produces a compile-time error.

Runtime-generated names such as `` `bg-${color}-600` `` also need an explicit finite guard or a project safelist. A safelist can be projected into a component only when the dynamic expression exposes a matching static pattern; a fully opaque `class={value}` should enumerate its allowed values through `Component.styles`.

If TypeScript checks component sources separately from the Vite config, activate the UnoCSS authoring augmentation explicitly:

```ts
import type {} from "@litsx/unocss";
```

## Other build tools

Rollup, webpack, esbuild, and framework adapters can compose `createUnoCssIntegration(...)` with the compiler's generic `authoringPlugins` and `outputPlugins` hooks. Vite-specific imports are optional peers and are only required for `@litsx/unocss/vite`.
