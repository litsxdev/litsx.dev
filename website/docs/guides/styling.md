# Styling

Lit<sup>sx</sup> separates static component CSS from render-time values. Use `Component.styles` for the stylesheet and `useStyle(...)` or ordinary JSX attributes for dynamic state.

## Component-owned CSS

```tsx
import { css, useStyle } from "@litsx/core";

export function StatusCard({ tone = "#0f766e", active = false }) {
  useStyle("--status-tone", tone);
  return <article data-active={active}><slot /></article>;
}

StatusCard.styles = css`
  :host { display: block; }
  article { border-color: var(--status-tone); }
  article[data-active="true"] { background: color-mix(in srgb, var(--status-tone) 12%, white); }
`;
```

`css` is Lit's real tag, re-exported from `@litsx/core`, so editors understand the template and Lit receives a `CSSResult`.

## Composing styles

`Component.styles` accepts either one Lit `CSSResult` or an array of style results. Use an array to share foundations, tokens, states, or theme layers without concatenating CSS strings:

```tsx
import { css } from "@litsx/core";

const interactiveStyles = css`
  :host { display: inline-block; }
  button:focus-visible { outline: 3px solid var(--focus-ring, #38bdf8); }
`;

const buttonStyles = css`
  button {
    border: 0;
    border-radius: 999px;
    padding: 0.65rem 1rem;
  }
`;

export function PrimaryButton() {
  return <button><slot /></button>;
}

PrimaryButton.styles = [
  interactiveStyles,
  buttonStyles,
  css`button { background: #f97316; color: white; }`,
];
```

Arrays may be nested, which makes it possible for a shared style module to expose a complete group:

```tsx
const controlFoundation = [interactiveStyles, buttonStyles];

PrimaryButton.styles = [
  controlFoundation,
  css`button { background: #f97316; }`,
];
```

Lit applies the results in array order, so later rules can override earlier layers through the normal CSS cascade. Every runtime entry must remain a valid Lit `CSSResult` or nested `CSSResult` array; plain strings are not component styles.

This composition is static component metadata. It is different from `useStyle(...)`, which updates one dynamic property on a component instance.

<script setup>
import { stylingExampleSource } from "../.vitepress/theme/components/playground-example-source.js";
</script>

<ClientOnly>
  <litsx-playground
    exportname="StyleCompositionDemo"
    previewtagname="docs-style-composition-preview"
    filename="/playground/StyleCompositionDemo.tsx"
    panelmaxheight="38rem"
  >{{ stylingExampleSource }}</litsx-playground>
</ClientOnly>

## Inherited styles and replacement

Lit<sup>sx</sup> preserves styles contributed by a generated base class or structural mixin. A normal assignment extends that chain: inherited styles come first, followed by the component's `CSSResult` or composed array.

Use `replaceStyles(...)` only when a component intentionally needs to discard inherited styles:

```tsx
import { css, replaceStyles } from "@litsx/core";

export function IsolatedPanel() {
  return <section><slot /></section>;
}

IsolatedPanel.styles = replaceStyles([
  css`:host { display: block; }`,
  css`section { padding: 1rem; }`,
]);
```

`replaceStyles(...)` marks the authored group for the compiler; it does not introduce a second styling runtime. Prefer ordinary array composition unless cutting the inherited style chain is deliberate.

## Inline style values

Native Lit<sup>sx</sup> accepts both CSS text and property maps in JSX `style` bindings. Object values are lowered through Lit's official `styleMap` directive, so no directive import or manual wrapper is necessary:

```tsx
export function StatusBadge({ tone, compact }) {
  return (
    <span
      style={{
        backgroundColor: tone,
        paddingInline: compact ? "0.5rem" : "0.8rem",
        "--badge-ring": `${tone}66`,
      }}
    >
      Ready
    </span>
  );
}
```

Use camelCase for ordinary multi-word properties and quoted kebab-case names for CSS custom properties. Values may be strings, numbers, `null`, or `undefined`; nullish values remove the property. A string such as `style="color: coral"` keeps its normal inline-CSS meaning.

The compiler emits `resolveStyle(value)` at the binding boundary. This helper preserves strings and existing Lit directives, and delegates object values to `styleMap`. It is public for lower-level integrations, but application JSX normally should not call it directly.

Use `useStyle(name, value)` when the target is the component host rather than an element returned by JSX.

## Shadow DOM and Light DOM

Components render to Shadow DOM by default. Opt into Light DOM with module-level metadata:

```tsx
export function PageSection({ children }) {
  return <section>{children}</section>;
}

PageSection.lightDom = true;
PageSection.styles = css`section { container-type: inline-size; }`;
```

The compiler option `lightDomStyles` controls generated integration styles:

- `scoped` (default) adds a stable component boundary
- `global` routes generated rules to an integration-owned document sheet
- `none` disables automatic generated Light DOM styles

Authored `Component.styles` remain active. Shadow DOM styles always remain component-local.

## Choosing a styling solution

No utility-CSS engine is required. The built-in path is Lit's `css` tagged template through `Component.styles`, including arrays of reusable `CSSResult` values, and it is sufficient for component-owned Shadow DOM or Light DOM styles.

Projects can also use another CSS pipeline through the compiler's generic authoring and output integration points. [`@litsx/unocss`](./unocss.md) is one optional integration for teams that already want UnoCSS; it is not part of the core authoring contract or the default styling requirement.

## Related

- [Component metadata](./component-metadata.md)
- [Property and binding inference](./property-inference.md)
- [Optional UnoCSS integration](./unocss.md)
