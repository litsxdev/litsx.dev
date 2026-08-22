# Migrating to 1.0

Lit<sup>sx</sup> 1.0 deliberately removes the experimental custom source syntax. Migration moves components onto standard JSX/TSX and ordinary module-level metadata.

## Syntax map

| Before 1.0 | 1.0 |
| --- | --- |
| `Component.litsx` | `Component.tsx` or `Component.jsx` |
| `@click={handler}` | `on:click={handler}` |
| `.value={value}` | `value={value}` |
| `?disabled={disabled}` | `disabled={disabled}` |
| in-function `static styles = ...` | `Component.styles = css\`...\`` after the function |
| in-function `static properties = ...` | `Component.properties = {...}` after the function |
| `staticStyles(...)`, `staticProps(...)` | ordinary component assignments |
| LitSX TypeScript/Prettier syntax plugins | standard TypeScript and Prettier TSX support |

The compiler now chooses the generated Lit binding from the destination element or component contract. Keep explicit `on:event` because event identity cannot be inferred from an ordinary prop name without conflating callbacks and DOM listeners.

## Structural hooks

The pre-1.0 structural lifecycle object has been replaced by standard class mixins:

```ts
const I18nMixin = (Base) => class extends Base {
  #i18n = createI18nController(this);
  get i18n() { return this.#i18n; }
};

export const useI18n = defineHook({
  mixin: I18nMixin,
  use(host) {
    return host.i18n;
  },
});
```

Move `setup`, `props`, `accessors`, `middlewares`, and structural `static` work into the mixin class. Use normal lifecycle overrides and delegate to `super`.

## Tooling changes

- Vite compilation comes from `@litsx/vite-plugin`.
- `tsc` type-checks `.tsx` directly with `jsxImportSource: "@litsx/core"`.
- `@litsx/eslint-plugin` exposes standard flat config rules; it no longer virtualizes custom syntax.
- standard Prettier JSX/TSX support replaces the removed LitSX Prettier plugin.

## New 1.0 surfaces

After migrating syntax, consider the features added on the 1.0 line:

- document SSR, streaming transport, scoped rendering, and hydration through `@litsx/ssr`
- an SSR scaffold via `create-litsx-app --template ssr`
- request execution contexts and library-owned resource snapshots
- typed custom events inferred from `useEmit(...)`
- optional build-tool-neutral UnoCSS integration and generic light-DOM style routing for CSS integrations
- official Storybook helpers for standard TSX stories
