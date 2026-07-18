# useHostTypeId

Return the stable LitSX host-type identity for the current component definition. Use this when resource identity should follow the authored component type rather than the current host instance or an individual hook callsite.

- Kind: `Hook`

## Reference

```ts
import { useHostTypeId } from "@litsx/core";
```

```ts
useHostTypeId(): string
```

## Usage

Call useHostTypeId inside a Lit<sup>sx</sup> component or custom hook during render when caches, SSR records, or hydration metadata must be keyed to the component type.

Prefer useStableId when identity should follow one authored hook callsite, and useId when identity should be unique per host instance.

## Behavior

- Returns the same value for every instance of the same Lit<sup>sx</sup>-compiled component type.
- Throws when the current host does not expose Lit<sup>sx</sup> host-type metadata, because a weak fallback would break SSR/cache semantics.

## Mental Model

useHostTypeId reads the stable identity of the component definition currently rendering, not the identity of this specific mounted element.

## Examples

```ts
const hostTypeId = useHostTypeId();
const resourceKey = `${hostTypeId}:${locale}`;
```

## Pitfalls

- Do not use this for unique DOM ids. All instances of the same component type intentionally share the same value.

## Returns

Type: `string`

## Related

- [Primitives](../../guides/primitives.md)
- [Framework Reference](../../framework/generated/)