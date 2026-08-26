# Optional Tailwind CSS Integration

Tailwind CSS is optional. The built-in Lit<sup>sx</sup> styling path remains Lit's `css` tagged template and `Component.styles`. Choose `@litsx/tailwind` when a project wants Tailwind CSS v4 utilities inside component-owned Shadow DOM or Light DOM output.

The root package is bundler-neutral. Its supported Vite adapter uses the official `@tailwindcss/vite` plugin rather than Tailwind's private compiler APIs.

## Install

```sh
npm install -D @litsx/tailwind @litsx/vite-plugin \
  @tailwindcss/vite tailwindcss vite
```

The Vite integration supports Tailwind CSS 4.3+, Vite 7.3 or 8, and Lit<sup>sx</sup> 1.x.

## Configure Vite

```js
// vite.config.js
import { defineConfig } from "vite";
import { litsxTailwind } from "@litsx/tailwind/vite";

export default defineConfig({
  plugins: litsxTailwind({
    integration: {
      entry: "./src/tailwind.css",
    },
  }),
});
```

Pass the complete array returned by `litsxTailwind(...)` directly to `plugins`. The adapter keeps Lit<sup>sx</sup> compilation, Tailwind materialization, virtual CSS, and cleanup in the required order.

Create the CSS entry referenced by `integration.entry`:

```css
/* src/tailwind.css */
@import "tailwindcss" source(none);

@theme {
  --color-brand: oklch(62% 0.18 255);
}
```

`source(none)` is recommended because Lit<sup>sx</sup> owns candidate routing. The entry still owns theme values, preflight, plugins, and authored global CSS.

## Component-owned utilities

Literal classes and finite values referenced from `class` or `className` belong only to the component that uses them:

```tsx
const SIZE_CLASSES = {
  sm: "h-8 px-3",
  lg: "h-12 px-6",
} as const;

export function ActionButton({ size = "sm" }) {
  return <button class={SIZE_CLASSES[size]}>Save</button>;
}
```

Constants, maps, finite branches, and exact imported values are resolved statically. A Shadow DOM component receives only its exact utilities as a component-owned `CSSResult`; a sibling component in the same module does not receive them.

JSX outside a Lit<sup>sx</sup> component class belongs to the document. This includes Storybook `render` functions and other free Light DOM templates. In a mixed module, their utilities enter the global sheet while component-only utilities remain attached to their owning Shadow or Light DOM component. A utility used by both destinations is generated in both so each output remains independently usable.

Pure Lit class bodies are opaque to the integration: their templates and static styles remain owned by Lit and are not treated as free document JSX.

`Component.styles` remains available as an explicit local guard for finite utilities that cannot be reached from markup. The integration consumes strings, arrays, objects, and imported constants at build time without passing them to Lit as invalid runtime styles:

```tsx
DynamicPanel.styles = [
  baseStyles,
  { red: "bg-red-600", green: "bg-green-600" },
];
```

## Dynamic class names

A runtime-generated class needs a finite integration safelist:

```tsx
export function ColorSwatch({ color }) {
  return <span class={`bg-${color}-600`} />;
}
```

```js
litsxTailwind({
  integration: {
    entry: "./src/tailwind.css",
    safelist: ["bg-red-600", "bg-green-600"],
  },
});
```

Only safelist entries matching that component's `bg-*-600` pattern enter its stylesheet. Unrelated safelist utilities are not copied into the shadow root. Fully opaque bindings should enumerate their allowed utilities through `Component.styles`.

## Shadow DOM and Light DOM

Shadow components receive the shared preflight, their exact component utility sheet, and inherited or authored `Component.styles` in normal Lit order. Theme and preflight are emitted once at document level.

Tailwind utilities such as `shadow-*`, `ring-*`, and `translate-*` rely on global `@property` declarations. The integration emits those through an inert infrastructure sheet so lazy components work without exposing their utility selectors globally.

Light DOM follows the ordinary compiler policy:

- `global` emits document-level utilities.
- `scoped` emits utilities inside `@scope (...) to (...)` and stops them at nested Lit<sup>sx</sup> roots.
- `none` disables automatic generated Light DOM styles.

Scoped Light DOM requires native CSS `@scope` support: Chrome and Edge 118+, Safari and iOS 17.4+, or Firefox 146+. Use `global` when older browsers, including Firefox ESR 140, are in scope. React compatibility selects `global` to preserve its document-level styling model.

## Sources and lazy components

```js
litsxTailwind({
  litsx: {},
  tailwind: {},
  integration: {
    entry: "./src/tailwind.css",
    sources: ["./src/**/*.{html,js,jsx,ts,tsx}"],
    safelist: [],
  },
});
```

- `litsx` forwards options to `@litsx/vite-plugin`.
- `tailwind` forwards options to the official `@tailwindcss/vite` plugin.
- `sources` contributes only shared infrastructure required before lazy modules load; it is not a fallback global utility scanner and does not leak component utility selectors globally.
- `safelist` provides finite candidates for non-finite component patterns.

The same routing covers development updates, production builds, SSR, hydration, and lazily imported components.

## Parallel and multi-entry builds

A single project context safely supports parallel component transforms. Each component and Vite entry retains only its own utility candidates, while client and SSR transforms of the same module reuse stable style metadata. Concurrently generated sheets therefore do not leak sibling classes between shadow roots or entry chunks.

The Vite adapter also preserves query suffixes on its virtual CSS modules, including `?inline` requests made during real builds. Create one context per project, rather than one per module, and reuse it across development, production, client, and SSR transforms.

## Custom build integrations

Framework adapters can compose `createTailwindContext(...)`, `createTailwindAuthoringPlugin(...)`, `createTailwindOutputPlugin(...)`, and `withTailwindCompiler(...)` from the bundler-neutral `@litsx/tailwind` entry. Create one context per project and reuse it across client, SSR, and watch transforms.

Vite-specific advanced integrations can use `withTailwindViteCompiler(...)`, `createTailwindVirtualPlugin(...)`, and `createTailwindPropertyCleanupPlugin(...)` when another framework owns plugin ordering. Ordinary Vite applications should prefer `litsxTailwind(...)`.

## Related

- [Styling](./styling.md)
- [Optional UnoCSS integration](./unocss.md)
- [Tooling](./tooling.md)
