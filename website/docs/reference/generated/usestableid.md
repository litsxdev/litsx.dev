# useStableId

Return a stable identifier for the authored callsite. LitSX tooling injects callsite metadata so the returned value is stable across SSR and client hydration and does not depend on render order or instance order. Use this for callsite-scoped resource/preload identity, not for unique DOM ids. When cache identity should follow the component definition, prefer useHostTypeId().

- Kind: `Hook`

## Reference

```ts
import { useStableId } from "@litsx/core";
```

```ts
useStableId(): string
```

## Usage

Call `useStableId` in authored Lit<sup>sx</sup> code when you want this behavior in a component.

## Returns

Type: `string`

## Related

- [Primitives](../../guides/primitives.md)
- [Framework Reference](../../framework/generated/)