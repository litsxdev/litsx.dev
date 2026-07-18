# useExpose

Publish a small imperative method surface either on the host instance or through a forwarded ref. Think of useExpose as the place where a component declares the public commands it supports.

- Kind: `Hook`

## Reference

```ts
import { useExpose } from "@litsx/core";
```

```ts
useExpose<T extends Record<string, (...args: any[]) => unknown>>(ref: { current: T | null; } | ((value: T | null) => void), createHandle: () => T, deps?: unknown[]): void
```

## Usage

Use useExpose when a component should publish imperative methods such as focus(), open(), reset(), or reportValidity().

Keep the exposed surface method-only. Read/write properties such as value, name, disabled, or readonly state such as validity belong on the normal host API.

Call useExpose(createHandle, deps) to install those methods on the current component instance.

Call useExpose(ref, createHandle, deps) when a wrapper or forwarded-ref component should expose methods through an explicit ref channel instead of the local host instance.

## Behavior

- The host-targeted signature installs the returned methods on the host instance itself.
- The ref-targeted signature assigns the returned method surface to the provided ref during the host lifecycle and clears that ref on disconnect.
- Recompute the exposed method implementations only when one of the listed dependencies changes.
- When several useExpose calls publish the same method on the same target, the last publisher wins until it disappears.

## Mental Model

useExpose draws a boundary between the component's full internal implementation and the few imperative commands it chooses to make public.

## Examples

```ts
useExpose(() => ({
  focus() {
    inputRef.current?.focus();
  },
  clear() {
    setValue("");
  },
}), [inputRef, setValue]);

useExpose(forwardedRef, () => ({
  focus() {
    innerRef.current?.focus();
  },
}), [forwardedRef, innerRef]);
```

## Pitfalls

- useExpose only supports methods. Expose properties through the normal component surface instead of returning them here.
- Keep the public command surface narrow and intention-revealing. A small set of named commands is easier to maintain than a grab-bag of internals.

## Parameters

### `ref`

Type: `{ current: T | null } | ((value: T | null) => void)`

Either the target ref that should receive the exposed methods, or the handle factory when targeting the host instance directly.

### `createHandle`

Type: `() => T`

Handle factory for the ref-targeted signature, or dependency list for the host-targeted signature.

### `deps`

Type: `unknown[]`

Reactive values that control when the exposed method implementations should be refreshed.

## Related

- [useRef](./useref.md)
- [Primitives](../../guides/primitives.md)