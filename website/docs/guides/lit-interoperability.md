# Lit Interoperability

Lit<sup>sx</sup> components and pure Lit components can share the same component tree. Interoperability uses Lit's reactive-property model and the custom-element platform rather than wrapping Lit classes in a compatibility component.

## Use a Lit class from JSX

Import a `LitElement` subclass and use the class directly as a JSX destination:

```tsx
import { LitElement, html } from "lit";

class StatusBadge extends LitElement {
  static properties = {
    tone: { type: String },
    model: { attribute: false },
  };

  declare tone: "neutral" | "positive";
  declare model: { id: string } | null;

  render() {
    return html`<span>${this.model?.id}</span>`;
  }
}

export function StatusPanel() {
  return <StatusBadge tone="positive" model={{ id: "ready" }} />;
}
```

Lit<sup>sx</sup> projects the class's declared reactive properties, including fields added by standard class mixins, while preserving their TypeScript types. These properties are optional at the JSX callsite to match custom-element construction and Lit defaults.

Standard host attributes, `on:event` listeners, slots, and typed refs remain available. Inherited `LitElement` runtime APIs and arbitrary component methods are not exposed as JSX props; a ref can call a public element method after obtaining the instance.

## Registries, metadata, and mixins

Imported Lit constructors participate in the scoped element map used by their Lit<sup>sx</sup> owner, so they do not need global registration. Inherited and authored `properties`, `styles`, and `elements` metadata continue to compose through normal Lit and mixin semantics.

A pure Lit class remains pure Lit: the compiler does not rewrite its render body into a Lit<sup>sx</sup> component. This also means Tailwind and UnoCSS integrations treat its templates and static styles as Lit-owned, opaque content.

The supported matrix includes Lit-to-Lit<sup>sx</sup>-to-Lit composition across Shadow DOM and Light DOM, structural and standard mixins, properties, slots, events, context updates, disconnect/reconnect cycles, SSR, and hydration.

## Pure Lit parents and Light DOM children

`@litsx/vite-plugin` processes project-local `.js`, `.jsx`, `.ts`, and `.tsx` modules. When an ordinary Lit template consumes an imported Lit<sup>sx</sup> Light DOM child, the plugin adds the boundary metadata needed for SSR and hydration without converting the parent into Lit<sup>sx</sup>.

By default, the Vite plugin only analyzes project-local modules. Dependencies and files outside the Vite root must be selected explicitly through `include` or `reactCompat.transformDependencies`.

This compiler boundary does not prevent a third-party custom element from running in the browser. For SSR, a standard Lit or third-party custom element can render when the integration provides a resolvable constructor or adapter. Client registration remains explicit unless its module self-registers or exposes hydratable metadata.

## SSR and hydration

Pure Lit constructors supplied through imported component maps or the SSR `elements` map can render inside scoped Lit<sup>sx</sup> trees without global registration. Hydration preserves the existing nodes, reactive properties, styles, slots, events, and reconnect lifecycle.

Empty registered Light DOM roots render their child tree automatically during SSR. Hosts with authored children keep those nodes as an explicit ownership boundary. See [Server Rendering and Hydration](./ssr.md) for the complete Light DOM and context constraints.

## Related

- [Standard JSX Authoring](./jsx-authoring.md)
- [Component Metadata](./component-metadata.md)
- [Tooling](./tooling.md)
- [Server Rendering and Hydration](./ssr.md)
