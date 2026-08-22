# useCallbackRef

Run a callback ref through the component lifecycle.

- Kind: `Hook`

## Reference

```ts
import { useCallbackRef } from "@litsx/core";
```

```ts
useCallbackRef(getTarget: () => Element | undefined, callback: (node: Element | undefined) => void, deps?: unknown[]): void
```

## Usage

Call `useCallbackRef` in authored Lit<sup>sx</sup> code when you want this behavior in a component.

## Parameters

### `getTarget`

Type: `() => Element | undefined`

### `callback`

Type: `(node: Element | undefined) => void`

### `deps`

Type: `unknown[]`

## Related

- [Primitives](../../guides/primitives.md)
- [Framework Reference](../../framework/generated/)