# Optional UnoCSS Integration

UnoCSS is optional. Lit<sup>sx</sup> does not require a utility-CSS engine: the standard styling path is Lit's `css` tagged template assigned to `Component.styles`, and projects may integrate other CSS solutions.

`@litsx/unocss` is the Lit<sup>sx</sup>-provided integration for teams that choose UnoCSS. It generates component-owned utility CSS for both Shadow DOM and Light DOM. The root package is build-tool neutral; `@litsx/unocss/vite` adapts it to Vite.

Use this package when UnoCSS matches the project's styling strategy. Otherwise, continue with [`Component.styles = css\`...\``](./styling.md) or another compiler/build integration.

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

The adapter compiles Lit<sup>sx</sup>, extracts utilities per module, preserves authored `Component.styles`, and shares the project preflight without embedding an independent reset in every production module.

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

Shadow-DOM components always keep their generated utility sheet locally. Import `virtual:uno.css` once in the browser entry when ordinary document markup also needs the global utilities and preflight. React compatibility selects the global route because migrated React trees expect document-level CSS.

## Static utility maps

Attach an imported, statically enumerable utility map to `Component.styles` to make ownership explicit:

```tsx
import { css } from "@litsx/core";
import { BUTTON_SIZE_CLASSES } from "./button.styles";

export function Button({ size = "md" }) {
  return <button class={BUTTON_SIZE_CLASSES[size]}>Save</button>;
}

Button.styles = [
  BUTTON_SIZE_CLASSES,
  css`:host { display: inline-block; }`,
];
```

The integration resolves that exact export and its static dependencies without executing application modules, generates the owned CSS, and removes the utility map from the runtime Lit styles value. Dynamic class names still need a finite static source or project safelist.

## Other build tools

Rollup, webpack, esbuild, and framework adapters can compose `createUnoCssIntegration(...)` with the compiler's generic `authoringPlugins` and `outputPlugins` hooks. Vite-specific imports are optional peers and are only required for `@litsx/unocss/vite`.
