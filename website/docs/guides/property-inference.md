# Property and Binding Inference

Lit<sup>sx</sup> derives a component's reactive property surface from TypeScript props and uses that same surface to choose bindings at JSX callsites.

## Start with props

```tsx
type ProfileCardProps = {
  title: string;
  active?: boolean;
  tags: string[];
  createdAt: Date;
  onSelect: (id: string) => void;
};

export function ProfileCard(props: ProfileCardProps) {
  return <article>{props.title}</article>;
}
```

The compiler can derive metadata equivalent to:

```js
{
  title: { type: String },
  active: { type: Boolean },
  tags: { type: Array },
  createdAt: { type: Date },
  onSelect: { type: Object, attribute: false },
}
```

Strings, numbers, booleans, dates, arrays, tuples, and object-like values map to the corresponding Lit constructors. Functions do not use attributes. When a TypeScript shape cannot map safely to one constructor, Lit<sup>sx</sup> prefers `Object` over a wrong guess.

## Refine Lit behavior

Add ordinary static metadata after the component declaration when inference needs Lit-specific options:

```tsx
export function ProfileCard(props: ProfileCardProps) {
  return <article data-active={props.active}>{props.title}</article>;
}

ProfileCard.properties = {
  active: { reflect: true },
  tags: { attribute: false },
  createdAt: { attribute: false },
  onSelect: { attribute: false },
};
```

TypeScript remains the base source of truth. `Component.properties` layers `reflect`, `attribute`, `converter`, `hasChanged`, and other Lit options on top.

## How JSX bindings are chosen

Authors always use ordinary JSX names:

```tsx
<ProfileCard
  title="Ada"
  active={true}
  tags={["compiler", "web components"]}
  createdAt={new Date()}
  onSelect={(id) => select(id)}
/>
```

The compiler resolves the destination constructor before lowering bindings:

- Boolean component props and camelCase public props use properties.
- Objects, arrays, functions, `unknown`, and `{ attribute: false }` use properties.
- A declared lowercase scalar attribute with the same public name uses an attribute.
- A declared Boolean attribute alias uses Boolean-presence semantics.
- `data-*`, `aria-*`, and ordinary native HTML attributes stay attributes.
- native `value` on `input`, `textarea`, and `select` uses a property.

Spreads apply the same rules after their sources have been merged in authored order.

## Weaker JavaScript fallback

Untyped `props.foo` access can still produce usable metadata, but the compiler cannot prove the runtime type and may fall back to `String`. Transform metadata records a `LITSX_PROP_FALLBACK_STRING` warning so tooling can recommend a prop type, destructuring, or explicit metadata.

Prefer typed props for public components. Treat opaque untyped member access as a recovery path.

## Related

- [Standard JSX authoring](./jsx-authoring.md)
- [Component metadata](./component-metadata.md)
- [Tooling](./tooling.md)
