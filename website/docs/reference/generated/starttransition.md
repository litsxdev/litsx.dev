# startTransition

Schedule non-urgent updates using the same transition machinery as useTransition.

- Kind: `Hook`

## Reference

```ts
import { startTransition } from "@litsx/core";
```

```ts
startTransition<T>(callback: () => T): T
```

## Usage

Call `startTransition` in authored Lit<sup>sx</sup> code when you want this behavior in a component.

## Parameters

### `callback`

Type: `() => T`

## Returns

Type: `T`

## Related

- [useTransition](./usetransition.md)
- [useDeferredValue](./usedeferredvalue.md)