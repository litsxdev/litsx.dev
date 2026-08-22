# Structural Hooks

Structural hooks let a function-authored component request a capability that must exist on its generated custom-element class. A standard class mixin installs the capability; the hook reads it during render.

Use them for library features such as form association, localization controllers, framework adapters, or host APIs that cannot be implemented as render-local state alone.

## Define a capability

```ts
import { defineHook } from "@litsx/core";

const I18nMixin = (Base) =>
  class extends Base {
    #i18n = createI18nController(this);

    get i18n() {
      return this.#i18n;
    }
  };

export const useI18n = defineHook({
  mixin: I18nMixin,
  use(host, namespace = "app") {
    return host.i18n.scope(namespace);
  },
});
```

Consumers call it like an ordinary hook:

```tsx
export function SaveButton() {
  const i18n = useI18n("checkout");
  return <button>{i18n.t("save")}</button>;
}
```

The call requires Lit<sup>sx</sup> compilation. The compiler installs the mixin on the generated class and replaces the call with a host-aware read.

## Composition and deduplication

`applyStructuralHooks(...)` deduplicates by mixin identity and preserves the order in which distinct capabilities first appear. Two hooks can share one mixin; repeated calls do not add another layer to the class hierarchy.

Custom hooks propagate requirements transitively:

```ts
export function useTranslatedLabel(key) {
  return useI18n().t(key);
}
```

A component that only calls `useTranslatedLabel(...)` still receives `I18nMixin`. This compiler metadata is generated output, not authored syntax.

## Use normal class semantics

Capabilities are ordinary mixins. Put properties, accessors, controllers, private state, static fields, and lifecycle behavior on the class:

```js
const FormAssociatedMixin = (Base) =>
  class extends Base {
    static formAssociated = true;

    formResetCallback() {
      this.formControl.reset();
      return super.formResetCallback?.();
    }
  };
```

Lifecycle overrides should delegate to `super` so distinct capabilities compose correctly.

## The 1.0 contract

`defineHook(...)` accepts only:

- `mixin`, optional, to install one host capability
- `use(host, ...args)`, required, to read it

The earlier experimental `static`, `setup`, `props`, `accessors`, and `middlewares` fields have been removed. Move that work into the mixin class. Runtime helpers such as `readStructuralHook(...)` and `applyStructuralHooks(...)` are public for compiler and framework integration, but normal component authors do not call them.

For ordinary state, effects, refs, events, and derived values, use the regular [primitives](./primitives.md).
