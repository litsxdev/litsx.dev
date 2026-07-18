# Structural Hooks

Structural hooks are for library authors who need class/type structural work, host lifecycle work, or both while still exposing an ordinary hook call to consumers.

Component authors do not register anything manually:

```tsx
const value = useSomething(args);
```

The difference is in the hook declaration. A structural hook is declared with `defineHook({ static, setup, middlewares, use })`, and the Lit<sup>sx</sup> compiler wires the authored callsite into the right structural phase.

Use structural hooks when a reusable hook needs any of:

- class/type structural work that should not run per instance
- render-time reads through normal hook syntax
- host lifecycle work such as connection, disconnection, update scheduling, or middleware coordination

For ordinary component state, effects, refs, events, and derived values, use the normal primitives from [Primitives](./primitives.md).

## Authoring Contract

The public shape is:

```ts
import { defineHook } from "@litsx/core";

const useThing = defineHook({
  static(name, meta, entry) {
    return {
      key: name,
      path: meta.callsitePath,
    };
  },
  setup(name, staticState, meta, entry) {
    return {
      label: `${staticState.key}:${name}`,
      connected: false,
    };
  },
  middlewares: {
    connectedCallback(next, state, meta, entry) {
      state.instance.connected = true;
      return next();
    },
  },
  use(name, state, meta, entry) {
    return {
      key: state.static.key,
      label: state.instance.label,
      connected: state.instance.connected,
      name,
    };
  },
});
```

`defineHook(...)` returns a callable hook value. Consumers call that value like a normal hook:

```tsx
const thing = useThing("checkout");
```

The returned function carries hidden compiler/runtime metadata. That metadata is not public API; the authored API is the callable hook and the `static`, `setup`, `middlewares`, and `use` definition object.

Calling a structural hook without the Lit<sup>sx</sup> transform is an error because structural hooks require compiled host wiring.

## Static Phase

`static(...)` runs in the class/type structural phase:

```ts
const useStaticResource = defineHook({
  static(name, meta) {
    return {
      key: name,
      path: meta.callsitePath,
    };
  },
  use(name, state, meta) {
    return `${state.static.key}:${name}:${meta.callsitePath.length}`;
  },
});
```

Static phase work:

- produces `state.static`
- is class/type scoped
- does not participate in component instance lifecycle
- does not register lifecycle middleware
- does not require host instance materialization

A static-only hook lowers through `useStructuralStaticEntry(...)` and generated `static structuralStaticEntries`. It does not wrap the generated component with `HostMiddlewareMixin(...)`, so it avoids instance lifecycle overhead.

Static hoists such as `static styles`, `static properties`, `static shadowRootOptions`, `static elements`, and `static lightDom` are class/type-phase work as well. `static expose` still materializes as real static class methods; it is not reduced to a metadata blob.

## Setup And State

`setup(...)` creates persistent instance state for one structural callsite in one host instance:

```ts
const useConnectedResource = defineHook({
  static(name) {
    return {
      key: name,
    };
  },
  setup(name, staticState, meta) {
    return {
      key: staticState.key,
      connected: false,
    };
  },
  use(name, state, meta) {
    return {
      key: state.static.key,
      connected: state.instance.connected,
      id: meta.callsitePath.join("/"),
    };
  },
});
```

The public state shape passed to `use(...)` and middleware is:

```ts
state.static
state.instance
```

`state.instance` is:

- created once for the structural instance entry
- mutable
- retained across updates
- passed to `use(...)` and lifecycle middleware
- not shared with other authored callsites

Use it for cached resources, host-linked handles, middleware coordination, and derived persistent state. The host middleware runtime does not deduplicate entries; resource dedupe belongs inside the domain-specific hook or resource runtime.

## Meta

`meta` is compiler-provided structural metadata. The stable public field is:

```ts
meta.callsitePath
```

Use `callsitePath` for resource identity, diagnostics, debug tooling, or serialized records that need to line up with authored callsites. Other metadata fields should be treated as informational unless documented.

## Middleware

Middleware wraps host lifecycle methods. `next()` represents the next middleware in the chain and eventually the host base implementation:

```ts
const useConnectedResource = defineHook({
  static(name) {
    return {
      key: name,
    };
  },
  setup(_name, staticState) {
    return {
      key: staticState.key,
      connected: false,
    };
  },
  middlewares: {
    connectedCallback(next, state) {
      state.instance.connected = true;
      return next();
    },
    disconnectedCallback(next, state) {
      state.instance.connected = false;
      return next();
    },
  },
  use(name, state, meta) {
    return {
      key: state.static.key,
      connected: state.instance.connected,
      name,
      id: meta.callsitePath.join("/"),
    };
  },
});
```

Middleware can run before `next()`, after `next()`, or both. Calling `next()` more than once is an error.

Structural middleware is composed in structural entry order. The ordering comes from authored hook expansion order, including nested structural hooks.

## Public Props And Runtime Accessors

Structural hooks can also participate in the host property surface.

Use `props(...)` for public Lit property metadata that should become part of the component contract:

```ts
const useMessages = defineHook({
  props(_host, _state, next) {
    return {
      ...next(),
      messages: { attribute: false },
    };
  },
});
```

Use `accessors(...)` for runtime-only host capabilities that should not become part of the public component API:

```ts
const useFaceState = defineHook({
  accessors(_host, state, next) {
    return {
      ...next(),
      validity: {
        get() {
          return state.instance.validity;
        },
      },
    };
  },
});
```

The split is intentional:

- `props(...)` defines public component properties
- `accessors(...)` defines non-public runtime host accessors
- the same key cannot be declared across both channels
- overrides inside `props(...)` and inside `accessors(...)` are allowed and compose in structural entry order

That means a reusable system hook can publish a common public property once, and Lit<sup>sx</sup> tooling can surface it everywhere the hook participates.

For example, an i18n hook can publish a typed `messages` property through `props(...)`, let authored components read it through normal Lit property semantics, and still keep internal runtime-only accessors separate.

## Tooling And Surface Inference

Structural `props(...)` are part of the public authored surface, not just runtime wiring.

That affects:

- authored `.litsx` validation
- PascalCase component prop completions
- structural prop discovery through local and imported hook graphs
- generated docs/reference content based on the public type surface

By contrast, `accessors(...)` stays out of the authored public contract. It exists so structural hooks can install runtime host behavior without creating an implicit undocumented component API.

## Composition

Structural hooks can call other hooks from `use(...)`, including other structural hooks:

```ts
const useScopedResource = defineHook({
  use(name) {
    return useConnectedResource(`scope:${name}`);
  },
});
```

A component still consumes the composed hook normally:

```tsx
export function ProductPanel({ id }) {
  const resource = useScopedResource(id);
  return <section>{resource.key}</section>;
}
```

The topology must be static, using the same hook-order discipline as ordinary hooks.

Valid:

```ts
useResource("checkout");
hooks.useResource("checkout");
```

Invalid:

```ts
const selected = enabled ? useResource : useFallbackResource;
const registry = { useResource };
hooks[name]("checkout");
```

Those dynamic forms are build-time errors. Lit<sup>sx</sup> needs a direct authored callsite to assign stable structural identity.

## Tooling Model

The compiler discovers structural hooks through the hook graph:

- direct calls in components
- structural hooks called from custom hooks
- structural hooks called from another structural hook's `use(...)`
- named and namespace imports from authored `.litsx` modules

Generated code wires entries into the right runtime surface:

- static-only hooks produce `structuralStaticEntries`
- mixed and instance hooks produce `structuralEntries`
- only mixed and instance hooks wrap generated hosts with `HostMiddlewareMixin(...)`

Component code remains free of manual registration.

For CLI type-checking and editor diagnostics, use the normal Lit<sup>sx</sup> tooling stack from [Tooling](./tooling.md).

## When Not To Use Structural Hooks

Do not use structural hooks for ordinary component-local state or effects. Prefer:

- `useState(...)` for local state
- `useMemoValue(...)` for derived values
- `useOnConnect(...)` for connection-scoped component work
- `useEvent(...)` for stable callbacks in external listeners
- `useStableId(...)` for callsite-stable resource identity without lifecycle middleware

Structural hooks are for reusable framework or design-system primitives that need host lifecycle participation and render-time consumption through the same hook.

## Next

- [Primitives](./primitives.md)
- [Tooling](./tooling.md)
- [Reference](../reference/)
