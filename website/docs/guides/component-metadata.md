# Component Metadata

Static component behavior is authored with ordinary top-level assignments. Lit<sup>sx</sup> carries these assignments onto the generated custom-element class.

```tsx
import { css } from "@litsx/core";

export function Dialog({ open = false }) {
  return <dialog open={open}><slot /></dialog>;
}

Dialog.styles = css`:host { display: contents; }`;
Dialog.properties = { open: { type: Boolean, reflect: true } };
Dialog.shadowRootOptions = { mode: "open", delegatesFocus: true };
```

## Supported metadata

- `Component.styles` owns static Lit styles. It accepts a `CSSResult` or a nested array of `CSSResult` values, applied in order. Import `css` from `@litsx/core`; see [Styling](./styling.md#composing-styles) for composition and inherited-style behavior.
- `Component.properties` refines inferred Lit property descriptors.
- `Component.shadowRootOptions` configures the shadow root.
- `Component.elements` supplies scoped custom-element constructors.
- `Component.lightDom = true` renders the component into its host.
- other ordinary static assignments are retained when the generated class or an integration consumes them.

Assignments must be at module scope after the component is declared. Because this is standard JavaScript/TypeScript, editor navigation, formatting, and static analysis need no custom parser.

## Light DOM

```tsx
export function PageSection({ children }) {
  return <section>{children}</section>;
}

PageSection.lightDom = true;
PageSection.styles = css`section { container-type: inline-size; }`;
```

CSS integrations that generate Light DOM styles can use `lightDomStyles: "scoped" | "global" | "none"` to select their routing strategy. In integrations that use the default `scoped` route, each component receives a stable boundary. This option does not select a CSS engine and does not replace authored `Component.styles`.

## Scoped elements

```tsx
import { CompactAvatar } from "./compact-avatar.tsx";

export function UserCard({ user }) {
  return <CompactAvatar user={user} />;
}

UserCard.elements = { CompactAvatar };
```

The compiler normally generates scoped-element metadata for imported component use. Explicit `elements` metadata is useful when a library or advanced composition pattern owns the registry mapping.

## Static methods

Expose class-level behavior with ordinary assignments:

```tsx
export function Badge({ tone }) {
  return <span data-tone={tone}><slot /></span>;
}

Badge.canHandle = (tone) => tone === "success" || tone === "warning";
```

This is separate from `useExpose(...)`, which publishes an instance-level imperative handle through a ref.
