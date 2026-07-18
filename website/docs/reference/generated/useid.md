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

Call `useId` in authored Lit<sup>sx</sup> code when you want this behavior in a component.

## Returns

Type: `string`

## Related

- [Primitives](../../guides/primitives.md)
- [Framework Reference](../../framework/generated/)