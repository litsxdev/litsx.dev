# useId

Generate a stable id for the current component instance. Note: this currently guarantees client-side stability only. SSR/hydration compatibility will require a deterministic prefixing strategy shared across server and client renders.

- Kind: `Hook`

## Reference

```ts
import { useId } from "@litsx/core";
```

```ts
useId(): string
```

## Usage

Use useId when a component needs a unique per-instance id for authored DOM relationships such as `for`, `aria-labelledby`, or `aria-describedby`.

Prefer useStableId when identity should follow one authored hook callsite across SSR and hydration, and useHostTypeId when identity should follow the component type itself.

## Behavior

- Returns one stable id for the lifetime of the current host instance.
- Different instances of the same component receive different values.

## Mental Model

useId gives each mounted component instance its own local id namespace for DOM wiring.

## Examples

```ts
const inputId = useId();

return (
  <>
    <label for={inputId}>Email</label>
    <input id={inputId} type="email" />
  </>
);
```

## Pitfalls

- Do not use this for cache keys, preload identity, or SSR-stable structural resources. Its contract is instance-scoped, not callsite-scoped.

## Returns

Type: `string`

## Related

- [Primitives](../../guides/primitives.md)
- [Framework Reference](../../framework/generated/)