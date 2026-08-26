# Standard JSX Authoring

Lit<sup>sx</sup> 1.0 source is ordinary JSX or TSX. You write familiar element and prop names; the compiler inspects the destination API and emits the correct Lit attribute, boolean-attribute, property, event, or ref part.

```tsx
export function CheckoutForm({ order, disabled = false }) {
  return (
    <checkout-button
      order={order}
      disabled={disabled}
      aria-label="Complete order"
      on:checkout={(event) => confirmOrder(event.detail)}
    />
  );
}
```

## Bindings

Do not author Lit's template prefixes in JSX. They are generated output.

| Authored source | Compiler decision |
| --- | --- |
| `disabled={value}` | Boolean attribute for a native Boolean attribute |
| `value={value}` on an input | Property binding |
| `aria-label={label}` | Attribute binding |
| `items={items}` on a typed component | Property binding for arrays/objects |
| `on:click={handler}` | Explicit event listener |
| `ref={buttonRef}` | Lit ref directive |

For component props, type information and declared `Component.properties` metadata determine the mapping. An explicit attribute alias remains an attribute; object, array, function, `unknown`, and `{ attribute: false }` values use properties.

## Events

Use `on:event` for DOM and custom-element listeners:

```tsx
<button on:click={save}>Save</button>
<search-field on:query-change={(event) => run(event.detail.query)} />
```

The event name after the colon is preserved. Public declarative component events should use lowercase kebab-case. `onClick` is an ordinary callback prop in native Lit<sup>sx</sup>; React-style conversion only happens in the optional React compatibility pipeline.

Listener objects can carry DOM options:

```tsx
<button on:click={{ handleEvent: save, once: true }}>Save once</button>
```

## Props, spreads, and children

JSX spreads preserve authored order, including overrides:

```tsx
<ProfileCard {...defaults} active={true} {...userOptions} />
```

The runtime resolves the final component constructor before choosing binding kinds. Object-rest component parameters can forward undeclared inputs without turning every forwarded field into a reactive property on the wrapper.

Use normal JSX children, arrays, conditions, and Lit directives:

```tsx
import { repeat } from "lit/directives/repeat.js";

return (
  <ul>
    {repeat(items, (item) => item.id, (item) => <li>{item.label}</li>)}
  </ul>
);
```

Lit directives remain first-class because the compiler ultimately emits Lit templates.

## Inline SVG

SVG is part of the native JSX contract. It can be nested directly inside HTML without importing Lit's `svg` template tag or augmenting `JSX.IntrinsicElements`:

```tsx
export function StatusIcon({ paths }) {
  return (
    <span class="status-icon">
      <svg viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
        {paths.map((path) => <path d={path.d} />)}
        <foreignObject x={0} y={0} width={24} height={8}>
          <div>HTML fallback</div>
        </foreignObject>
      </svg>
    </span>
  );
}
```

The compiler enters the SVG namespace at `<svg>` and returns to HTML for descendants of `<foreignObject>`. Dynamic children, conditional branches, spreads, SSR, and hydration preserve the same namespace transitions.

JSX-friendly presentation names such as `strokeWidth`, `strokeLinecap`, and `fillOpacity` are serialized as native dashed SVG attributes. SVG element names and their relevant attributes are typed without a permissive global index, so unknown attributes still produce TypeScript errors.

The low-level `jsxTemplateOptions.tag: "svg"` option is only for a source whose root template is deliberately an SVG fragment. Ordinary inline SVG does not need it.

## Components and metadata

Top-level PascalCase functions and function-valued declarations are component candidates. Attach static class metadata with normal assignments after the declaration:

```tsx
import { css } from "@litsx/core";

export function ContentPanel({ title }) {
  return <section><h2>{title}</h2></section>;
}

ContentPanel.styles = css`:host { display: block; }`;
ContentPanel.properties = { title: { reflect: true } };
ContentPanel.shadowRootOptions = { mode: "open", delegatesFocus: true };
```

See [Component Metadata](./component-metadata.md) for `styles`, `properties`, `elements`, `lightDom`, and exposed static methods.

## Refs and identity

Native refs follow Lit: object refs expose `.value` and clear to `undefined`.

```tsx
const input = useRef<HTMLInputElement>();
useOnCommit(() => input.value?.focus(), []);
return <input ref={input} />;
```

Keys preserve identity in lists, including through SSR and hydration. Use `useId()` for per-instance DOM relationships, `useStableId()` for a compile-time callsite identity, and `useHostTypeId()` for component-type identity.

## Removed pre-1.0 syntax

The unreleased `.litsx` extension, `@click`, `.value`, `?disabled`, in-function `static ...`, `staticProps(...)`, and `staticStyles(...)` experiments are not part of 1.0. See the [migration guide](./migrating-to-1.md).
