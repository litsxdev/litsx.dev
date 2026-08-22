# useSsrResourceSnapshot

Register or restore a library-owned global SSR resource cache. This hook is inert outside an active LitSX SSR render or hydration payload. Library runtimes should expose higher-level hooks rather than asking applications to call this API or install hydration bootstrap code.

- Kind: `Hook`

## Reference

```ts
import { useSsrResourceSnapshot } from "@litsx/core";
```

```ts
useSsrResourceSnapshot(options: SsrResourceSnapshotOptions): void
```

## Usage

Call `useSsrResourceSnapshot` in authored Lit<sup>sx</sup> code when you want this behavior in a component.

## Parameters

### `options`

Type: `SsrResourceSnapshotOptions`

## Related

- [Primitives](../../guides/primitives.md)
- [Framework Reference](../../framework/generated/)