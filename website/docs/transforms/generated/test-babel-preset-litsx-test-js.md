# @litsx/babel-preset-litsx

Source: `test/babel-preset-litsx.test.js`

Generated from transform tests.

## Pipeline

- `@litsx/babel-preset-litsx`

## Covered Cases

### Defaults to final html template lowering

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
export const Greeting = ({ label }) => {
  return <button>{label}</button>;
};
```

#### Generated Output

```js
import { useCallbackRef, prepareEffects, renderWithSoftSuspense } from "@litsx/core";
import { LitElement, html } from "lit";
export class Greeting extends LitElement {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-1cebz10";
  static [Symbol.for("litsx.component")] = true;
  static properties = {
    label: {
      type: String
    }
  };
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      return html`<button>${this.label}</button>`;
    });
  }
}
```

### Matches the direct preset plugin factory

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import FancyButton from './FancyButton.js';
export const Greeting = ({ label = 'Save' }) => {
  return <FancyButton .label={label} @click={save} />;
};
```

#### Generated Output

```js
import { ShadowDomMixin } from "@litsx/core/elements";
import { useCallbackRef, prepareEffects, renderWithSoftSuspense } from "@litsx/core";
import { LitElement, html } from "lit";
import FancyButton from './FancyButton.js';
export class Greeting extends ShadowDomMixin(LitElement) {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-ki5u8t";
  static [Symbol.for("litsx.component")] = true;
  static properties = {
    label: {
      type: String
    }
  };
  static elements = {
    "fancy-button": FancyButton
  };
  constructor() {
    super();
    this.label ??= 'Save';
  }
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      return html`<fancy-button .label=${this.label} @click=${save}></fancy-button>`;
    });
  }
}
```

### Injects stable callsite metadata for useStableId in render and custom hooks

#### Interpretation

This case documents code that is synthesized by the transform, not written directly by the user.

#### Authored Input

```jsx
import { useStableId } from "@litsx/core";
function useResourceKey() {
  return useStableId();
}
export function StableIds() {
  const first = useStableId();
  const second = useResourceKey();
  return <div>{first}:{second}</div>;
}
```

#### Generated Output

```js
import { LitElement, html } from "lit";
import { useStableId, useCallbackRef, prepareEffects, renderWithSoftSuspense } from "@litsx/core";
function useResourceKey(_host) {
  return useStableId(_host, "litsx-stable-maxopf");
}
useResourceKey[Symbol.for("litsx.hook")] = true;
export class StableIds extends LitElement {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-1qzrx2i";
  static [Symbol.for("litsx.component")] = true;
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      const first = useStableId(this, "litsx-stable-1vs318a");
      const second = useResourceKey(this);
      return html`<div>${first}:${second}</div>`;
    });
  }
}
```

### Injects stable class metadata for generated component classes

#### Interpretation

This case documents code that is synthesized by the transform, not written directly by the user.

#### Authored Input

```jsx
export function PrimaryCard() {
  return <div>one</div>;
}
export function SecondaryCard() {
  return <div>two</div>;
}
```

#### Generated Output

```js
import { useCallbackRef, prepareEffects, renderWithSoftSuspense } from "@litsx/core";
import { LitElement, html } from "lit";
export class PrimaryCard extends LitElement {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-ou5qcw";
  static [Symbol.for("litsx.component")] = true;
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      return html`<div>one</div>`;
    });
  }
}
export class SecondaryCard extends LitElement {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-asrmxq";
  static [Symbol.for("litsx.component")] = true;
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      return html`<div>two</div>`;
    });
  }
}
```

### Compiles local structural hooks to host middleware reads

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { defineHook } from "@litsx/core";
const useLocale = defineHook({
  use(_host, _state, args) {
    return args[0];
  },
});
export function Greeting() {
  const locale = useLocale('en');
  return <div>{locale}</div>;
}
```

#### Generated Output

```js
import { LitElement, html } from "lit";
import { defineHook, useCallbackRef, prepareEffects, resolveStructuralEntry, HostMiddlewareMixin, renderWithSoftSuspense, resolveStructuralProps } from "@litsx/core";
const useLocale = defineHook({
  use(_host, _state, args) {
    return args[0];
  }
});
export class Greeting extends HostMiddlewareMixin(LitElement) {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-13v90bn";
  static [Symbol.for("litsx.component")] = true;
  static structuralEntries = [{
    id: "litsx-structural-16pzbwf",
    callsiteId: "litsx-structural-16pzbwf",
    callsiteIndex: 0,
    callsitePath: ["litsx-structural-16pzbwf"],
    definition: useLocale,
    args: [],
    meta: {
      callsitePath: ["litsx-structural-16pzbwf"]
    }
  }];
  static get properties() {
    return resolveStructuralProps(this);
  }
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      const locale = resolveStructuralEntry(this, 0, "litsx-structural-16pzbwf", useLocale, ['en'], {
        callsitePath: ["litsx-structural-16pzbwf"]
      });
      return html`<div>${locale}</div>`;
    });
  }
}
```

### Compiles static-only structural hooks without host lifecycle wrapping

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { defineHook } from "@litsx/core";
const useStaticResource = defineHook({
  static(name, meta) {
    return { key: name, path: meta.callsitePath };
  },
  use(_owner, state, _args, meta) {
    return `${state.static.key}:${meta.callsitePath.length}`;
  },
});
export function StaticCard() {
  static styles = `:host { display: block; }`;
  const value = useStaticResource('catalog');
  return <div>{value}</div>;
}
```

#### Generated Output

```js
import { LitsxStaticHoistsMixin } from "@litsx/core/elements";
import { LitElement, css, html } from "lit";
const _litsx_static_styles = Symbol("litsx.static.styles");
import { defineHook, useCallbackRef, prepareEffects, resolveStructuralStaticEntry, renderWithSoftSuspense, resolveStructuralProps } from "@litsx/core";
const useStaticResource = defineHook({
  static(name, meta) {
    return {
      key: name,
      path: meta.callsitePath
    };
  },
  use(_host, _owner, state, _args, meta) {
    return `${state.static.key}:${meta.callsitePath.length}`;
  }
});
export class StaticCard extends LitsxStaticHoistsMixin(LitElement) {
  static get styles() {
    return this.__litsxStatic(_litsx_static_styles, () => this.__litsxResolveStaticValue(css`:host { display: block; }`));
  }
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-yupqk";
  static [Symbol.for("litsx.component")] = true;
  static structuralStaticEntries = [{
    id: "litsx-structural-hfz8dc",
    callsiteId: "litsx-structural-hfz8dc",
    callsiteIndex: 0,
    callsitePath: ["litsx-structural-hfz8dc"],
    definition: useStaticResource,
    args: ['catalog'],
    meta: {
      callsitePath: ["litsx-structural-hfz8dc"]
    }
  }];
  static get properties() {
    return resolveStructuralProps(this);
  }
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      const value = resolveStructuralStaticEntry(this.constructor, 0, "litsx-structural-hfz8dc", useStaticResource, ['catalog'], {
        callsitePath: ["litsx-structural-hfz8dc"]
      });
      return html`<div>${value}</div>`;
    });
  }
}
```

### Compiles mixed structural hooks through the instance middleware path

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { defineHook } from "@litsx/core";
const useMixedResource = defineHook({
  static(name) { return { key: name }; },
  setup(_host, args, staticState) {
    const [name] = args;
    return { label: `${staticState.key}:${name}` };
  },
  middlewares: {
    connectedCallback(_host, state, next) {
      state.instance.connected = true;
      return next();
    },
  },
  use(_host, state, args) {
    const [name] = args;
    return `${state.static.key}:${state.instance.label}:${name}`;
  },
});
export function MixedCard() {
  const value = useMixedResource('catalog');
  return <div>{value}</div>;
}
```

#### Generated Output

```js
import { LitElement, html } from "lit";
import { defineHook, useCallbackRef, prepareEffects, resolveStructuralEntry, HostMiddlewareMixin, renderWithSoftSuspense, resolveStructuralProps } from "@litsx/core";
const useMixedResource = defineHook({
  static(name) {
    return {
      key: name
    };
  },
  setup(_host, args, staticState) {
    const [name] = args;
    return {
      label: `${staticState.key}:${name}`
    };
  },
  middlewares: {
    connectedCallback(_host, state, next) {
      state.instance.connected = true;
      return next();
    }
  },
  use(_host, state, args) {
    const [name] = args;
    return `${state.static.key}:${state.instance.label}:${name}`;
  }
});
export class MixedCard extends HostMiddlewareMixin(LitElement) {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-1vnhmm9";
  static [Symbol.for("litsx.component")] = true;
  static structuralEntries = [{
    id: "litsx-structural-dj0vtd",
    callsiteId: "litsx-structural-dj0vtd",
    callsiteIndex: 0,
    callsitePath: ["litsx-structural-dj0vtd"],
    definition: useMixedResource,
    args: [],
    meta: {
      callsitePath: ["litsx-structural-dj0vtd"]
    }
  }];
  static get properties() {
    return resolveStructuralProps(this);
  }
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      const value = resolveStructuralEntry(this, 0, "litsx-structural-dj0vtd", useMixedResource, ['catalog'], {
        callsitePath: ["litsx-structural-dj0vtd"]
      });
      return html`<div>${value}</div>`;
    });
  }
}
```

### Compiles structural hooks used transitively through local custom hooks

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { defineHook } from "@litsx/core";
const useResource = defineHook({
  use(_host, _state, args) {
    return args[0];
  },
});
function useMessage(name) {
  return useResource(name);
}
export function Greeting() {
  const message = useMessage('hello');
  return <div>{message}</div>;
}
```

#### Generated Output

```js
import { LitElement, html } from "lit";
import { defineHook, useCallbackRef, prepareEffects, resolveStructuralEntry, HostMiddlewareMixin, renderWithSoftSuspense, resolveStructuralProps } from "@litsx/core";
const useResource = defineHook({
  use(_host, _state, args) {
    return args[0];
  }
});
function useMessage(_host, name) {
  return resolveStructuralEntry(_host, 0, "litsx-structural-gbbfhd", useResource, [name], {
    callsitePath: ["useMessage", "litsx-structural-gbbfhd"]
  });
}
useMessage[Symbol.for("litsx.hook")] = true;
useMessage[Symbol.for("litsx.structuralHookEntries")] = [{
  id: "litsx-structural-gbbfhd",
  callsiteId: "litsx-structural-gbbfhd",
  callsiteIndex: 0,
  callsitePath: ["useMessage", "litsx-structural-gbbfhd"],
  definition: useResource,
  args: [],
  meta: {
    callsitePath: ["useMessage", "litsx-structural-gbbfhd"]
  }
}];
export class Greeting extends HostMiddlewareMixin(LitElement) {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-wrgzkj";
  static [Symbol.for("litsx.component")] = true;
  static structuralEntries = [{
    id: "litsx-structural-gbbfhd",
    callsiteId: "litsx-structural-gbbfhd",
    callsiteIndex: 0,
    callsitePath: ["useMessage", "litsx-structural-gbbfhd"],
    definition: useResource,
    args: [],
    meta: {
      callsitePath: ["useMessage", "litsx-structural-gbbfhd"]
    }
  }];
  static get properties() {
    return resolveStructuralProps(this);
  }
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      const message = useMessage(this, 'hello');
      return html`<div>${message}</div>`;
    });
  }
}
```

### Compiles imported structural hooks discovered from authored modules

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { useLocale } from "./hooks.litsx";
export function Greeting() {
  const locale = useLocale('en');
  return <div>{locale}</div>;
}
```

#### Generated Error

```txt
unknown file: Unable to resolve imported custom hook "useLocale" from "./hooks.litsx". LitSX must resolve imported custom hooks to determine whether the active host must be passed.
  1 | import { useLocale } from "./hooks.litsx";
  2 | export function Greeting() {
> 3 |   const locale = useLocale('en');
    |                  ^^^^^^^^^
  4 |   return <div>{locale}</div>;
  5 | }
```

#### Hooks Source

```jsx
import { defineHook } from "@litsx/core";
export const useLocale = defineHook({
  use(_host, _state, args) {
    return args[0];
  },
});
```

#### Generated Output

```js
import { defineHook } from "@litsx/core";
export const useLocale = defineHook({
  use(_host, _state, args) {
    return args[0];
  }
});
```

### Merges imported structural hook props into generated static properties

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { useMessages } from "./i18n-hooks.litsx";
export function Greeting({ title }: { title: string }) {
  useMessages();
  return <div>{title}</div>;
}
```

#### Generated Error

```txt
unknown file: Unable to resolve imported custom hook "useMessages" from "./i18n-hooks.litsx". LitSX must resolve imported custom hooks to determine whether the active host must be passed.
  1 | import { useMessages } from "./i18n-hooks.litsx";
  2 | export function Greeting({ title }: { title: string }) {
> 3 |   useMessages();
    |   ^^^^^^^^^^^
  4 |   return <div>{title}</div>;
  5 | }
```

#### Hooks Source

```jsx
import { defineHook } from "@litsx/core";
export const useMessages = defineHook({
  props(_host, _state, next) {
    return {
      ...next(),
      messages: { type: Object, attribute: false },
    };
  },
  setup() {
    return { runtimeMessages: null };
  },
  accessors(_host, state, next) {
    return {
      ...next(),
      runtimeMessages: {
        get: () => state.instance.runtimeMessages,
        set: (value) => { state.instance.runtimeMessages = value; },
      },
    };
  },
  use() {
    return null;
  },
});
```

#### Generated Output

```js
import { defineHook } from "@litsx/core";
export const useMessages = defineHook({
  props(_host, _state, next) {
    return {
      ...next(),
      messages: {
        type: Object,
        attribute: false
      }
    };
  },
  setup() {
    return {
      runtimeMessages: null
    };
  },
  accessors(_host, state, next) {
    return {
      ...next(),
      runtimeMessages: {
        get: () => state.instance.runtimeMessages,
        set: value => {
          state.instance.runtimeMessages = value;
        }
      }
    };
  },
  use(_host) {
    return null;
  }
});
```

### Compiles structural hooks imported from @litsx/core

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { useElementInternals, useFormValidity, useFormValue } from "@litsx/core";
export function FormField() {
  static formAssociated = true;
  const internals = useElementInternals();
  const control = useFormValue('draft');
  const validity = useFormValidity();
  return <div>{internals.supported ? control.value : validity.validationMessage}</div>;
}
```

#### Generated Output

```js
import { LitsxStaticHoistsMixin } from "@litsx/core/elements";
import { LitElement, html } from "lit";
const _litsx_static_formAssociated = Symbol("litsx.static.formAssociated");
import { useElementInternals, useFormValidity, useFormValue, useCallbackRef, prepareEffects, renderWithSoftSuspense } from "@litsx/core";
export class FormField extends LitsxStaticHoistsMixin(LitElement) {
  static get formAssociated() {
    return this.__litsxStatic(_litsx_static_formAssociated, () => this.__litsxResolveStaticValue(true));
  }
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-l0v4pz";
  static [Symbol.for("litsx.component")] = true;
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      const internals = useElementInternals(this);
      const control = useFormValue(this, 'draft');
      const validity = useFormValidity(this);
      return html`<div>${internals.supported ? control.value : validity.validationMessage}</div>`;
    });
  }
}
```

### Merges structural hook props into generated static properties and authored static properties

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

- No inline source fixture extracted for this case.

### Lets later structural hooks override earlier props for the same key

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { defineHook } from "@litsx/core";
const useBaseMessages = defineHook({
  props(_host, _state, next) {
    return {
      ...next(),
      messages: { type: Object, attribute: false },
    };
  },
  use() {
    return null;
  },
});
const usePriorityMessages = defineHook({
  props(_host, _state, next) {
    return {
      ...next(),
      messages: { reflect: true },
    };
  },
  use() {
    return null;
  },
});
export function ProductCard() {
  useBaseMessages();
  usePriorityMessages();
  return <div />;
}
```

#### Generated Output

```js
import { LitElement, html } from "lit";
import { defineHook, useCallbackRef, prepareEffects, resolveStructuralStaticEntry, renderWithSoftSuspense, resolveStructuralProps } from "@litsx/core";
const useBaseMessages = defineHook({
  props(_host, _state, next) {
    return {
      ...next(),
      messages: {
        type: Object,
        attribute: false
      }
    };
  },
  use(_host) {
    return null;
  }
});
const usePriorityMessages = defineHook({
  props(_host, _state, next) {
    return {
      ...next(),
      messages: {
        reflect: true
      }
    };
  },
  use(_host) {
    return null;
  }
});
export class ProductCard extends LitElement {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-13a6iqr";
  static [Symbol.for("litsx.component")] = true;
  static structuralStaticEntries = [{
    id: "litsx-structural-15fd0cr",
    callsiteId: "litsx-structural-15fd0cr",
    callsiteIndex: 0,
    callsitePath: ["litsx-structural-15fd0cr"],
    definition: useBaseMessages,
    args: [],
    meta: {
      callsitePath: ["litsx-structural-15fd0cr"]
    }
  }, {
    id: "litsx-structural-1ordvw",
    callsiteId: "litsx-structural-1ordvw",
    callsiteIndex: 1,
    callsitePath: ["litsx-structural-1ordvw"],
    definition: usePriorityMessages,
    args: [],
    meta: {
      callsitePath: ["litsx-structural-1ordvw"]
    }
  }];
  static get properties() {
    return resolveStructuralProps(this);
  }
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      resolveStructuralStaticEntry(this.constructor, 0, "litsx-structural-15fd0cr", useBaseMessages, [], {
        callsitePath: ["litsx-structural-15fd0cr"]
      });
      resolveStructuralStaticEntry(this.constructor, 1, "litsx-structural-1ordvw", usePriorityMessages, [], {
        callsitePath: ["litsx-structural-1ordvw"]
      });
      return html`<div></div>`;
    });
  }
}
```

### Emits tooling warnings when later structural hooks override earlier props keys

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { defineHook } from "@litsx/core";
const useBaseMessages = defineHook({
  props(_host, _state, next) {
    return {
      ...next(),
      messages: { type: Object, attribute: false },
    };
  },
  use() {
    return null;
  },
});
const usePriorityMessages = defineHook({
  props(_host, _state, next) {
    return {
      ...next(),
      messages: { reflect: true },
    };
  },
  use() {
    return null;
  },
});
export function ProductCard() {
  useBaseMessages();
  usePriorityMessages();
  return <div />;
}
```

#### Generated Output

```js
import { LitElement, html } from "lit";
import { defineHook, useCallbackRef, prepareEffects, resolveStructuralStaticEntry, renderWithSoftSuspense, resolveStructuralProps } from "@litsx/core";
const useBaseMessages = defineHook({
  props(_host, _state, next) {
    return {
      ...next(),
      messages: {
        type: Object,
        attribute: false
      }
    };
  },
  use(_host) {
    return null;
  }
});
const usePriorityMessages = defineHook({
  props(_host, _state, next) {
    return {
      ...next(),
      messages: {
        reflect: true
      }
    };
  },
  use(_host) {
    return null;
  }
});
export class ProductCard extends LitElement {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-13a6iqr";
  static [Symbol.for("litsx.component")] = true;
  static structuralStaticEntries = [{
    id: "litsx-structural-15fd0cr",
    callsiteId: "litsx-structural-15fd0cr",
    callsiteIndex: 0,
    callsitePath: ["litsx-structural-15fd0cr"],
    definition: useBaseMessages,
    args: [],
    meta: {
      callsitePath: ["litsx-structural-15fd0cr"]
    }
  }, {
    id: "litsx-structural-1ordvw",
    callsiteId: "litsx-structural-1ordvw",
    callsiteIndex: 1,
    callsitePath: ["litsx-structural-1ordvw"],
    definition: usePriorityMessages,
    args: [],
    meta: {
      callsitePath: ["litsx-structural-1ordvw"]
    }
  }];
  static get properties() {
    return resolveStructuralProps(this);
  }
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      resolveStructuralStaticEntry(this.constructor, 0, "litsx-structural-15fd0cr", useBaseMessages, [], {
        callsitePath: ["litsx-structural-15fd0cr"]
      });
      resolveStructuralStaticEntry(this.constructor, 1, "litsx-structural-1ordvw", usePriorityMessages, [], {
        callsitePath: ["litsx-structural-1ordvw"]
      });
      return html`<div></div>`;
    });
  }
}
```

### Emits tooling warnings when later structural hooks override earlier accessors keys

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { defineHook } from "@litsx/core";
const useBaseAccessor = defineHook({
  accessors(_host, _state, next) {
    return {
      ...next(),
      current: {
        get: () => 'first',
      },
    };
  },
  use() {
    return null;
  },
});
const useOverrideAccessor = defineHook({
  accessors(_host, _state, next) {
    return {
      ...next(),
      current: {
        get: () => 'second',
      },
    };
  },
  use() {
    return null;
  },
});
export function ProductCard() {
  useBaseAccessor();
  useOverrideAccessor();
  return <div />;
}
```

#### Generated Output

```js
import { LitElement, html } from "lit";
import { defineHook, useCallbackRef, prepareEffects, resolveStructuralEntry, HostMiddlewareMixin, renderWithSoftSuspense, resolveStructuralProps } from "@litsx/core";
const useBaseAccessor = defineHook({
  accessors(_host, _state, next) {
    return {
      ...next(),
      current: {
        get: () => 'first'
      }
    };
  },
  use(_host) {
    return null;
  }
});
const useOverrideAccessor = defineHook({
  accessors(_host, _state, next) {
    return {
      ...next(),
      current: {
        get: () => 'second'
      }
    };
  },
  use(_host) {
    return null;
  }
});
export class ProductCard extends HostMiddlewareMixin(LitElement) {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-vvf01y";
  static [Symbol.for("litsx.component")] = true;
  static structuralEntries = [{
    id: "litsx-structural-amn6c6",
    callsiteId: "litsx-structural-amn6c6",
    callsiteIndex: 0,
    callsitePath: ["litsx-structural-amn6c6"],
    definition: useBaseAccessor,
    args: [],
    meta: {
      callsitePath: ["litsx-structural-amn6c6"]
    }
  }, {
    id: "litsx-structural-o1mint",
    callsiteId: "litsx-structural-o1mint",
    callsiteIndex: 1,
    callsitePath: ["litsx-structural-o1mint"],
    definition: useOverrideAccessor,
    args: [],
    meta: {
      callsitePath: ["litsx-structural-o1mint"]
    }
  }];
  static get properties() {
    return resolveStructuralProps(this);
  }
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      resolveStructuralEntry(this, 0, "litsx-structural-amn6c6", useBaseAccessor, [], {
        callsitePath: ["litsx-structural-amn6c6"]
      });
      resolveStructuralEntry(this, 1, "litsx-structural-o1mint", useOverrideAccessor, [], {
        callsitePath: ["litsx-structural-o1mint"]
      });
      return html`<div></div>`;
    });
  }
}
```

### Compiles structural hooks imported through @litsx/core namespace imports

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import * as core from "@litsx/core";
export function FormField() {
  static formAssociated = true;
  const internals = core.useElementInternals();
  const control = core.useFormValue('draft');
  const validity = core.useFormValidity();
  return <div>{internals.supported ? control.value : validity.validationMessage}</div>;
}
```

#### Generated Output

```js
import * as core from "@litsx/core";
import { useCallbackRef, prepareEffects, useElementInternals, useFormValue, useFormValidity, renderWithSoftSuspense } from "@litsx/core";
import { LitsxStaticHoistsMixin } from "@litsx/core/elements";
import { LitElement, html } from "lit";
const _litsx_static_formAssociated = Symbol("litsx.static.formAssociated");
export class FormField extends LitsxStaticHoistsMixin(LitElement) {
  static get formAssociated() {
    return this.__litsxStatic(_litsx_static_formAssociated, () => this.__litsxResolveStaticValue(true));
  }
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-1gwf6ak";
  static [Symbol.for("litsx.component")] = true;
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      const internals = core.useElementInternals(this);
      const control = core.useFormValue(this, 'draft');
      const validity = core.useFormValidity(this);
      return html`<div>${internals.supported ? control.value : validity.validationMessage}</div>`;
    });
  }
}
```

### Compiles imported static-only structural hooks without host lifecycle wrapping

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { useStaticLocale } from "./hooks.litsx";
export function Greeting() {
  const locale = useStaticLocale('en');
  return <div>{locale}</div>;
}
```

#### Generated Error

```txt
unknown file: Unable to resolve imported custom hook "useStaticLocale" from "./hooks.litsx". LitSX must resolve imported custom hooks to determine whether the active host must be passed.
  1 | import { useStaticLocale } from "./hooks.litsx";
  2 | export function Greeting() {
> 3 |   const locale = useStaticLocale('en');
    |                  ^^^^^^^^^^^^^^^
  4 |   return <div>{locale}</div>;
  5 | }
```

#### Hooks Source

```jsx
import { defineHook } from "@litsx/core";
export const useStaticLocale = defineHook({
  static(locale) {
    return { locale };
  },
  use(_owner, state, args) {
    const [locale] = args;
    return `${state.static.locale}:${locale}`;
  },
});
```

#### Generated Output

```js
import { defineHook } from "@litsx/core";
export const useStaticLocale = defineHook({
  static(locale) {
    return {
      locale
    };
  },
  use(_host, _owner, state, args) {
    const [locale] = args;
    return `${state.static.locale}:${locale}`;
  }
});
```

### Treats structural hooks with accessors as instance-phase hooks

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { defineHook } from "@litsx/core";
const useControl = defineHook({
  static(label) {
    return { label: label.toUpperCase() };
  },
  accessors(_host, state, next) {
    return {
      ...next(),
      value: {
        get: () => state.static.label,
      },
    };
  },
  use(label, state) {
    return `${state.static.label}:${label}`;
  },
});
export function Field() {
  const value = useControl('draft');
  return <div>{value}</div>;
}
```

#### Generated Output

```js
import { LitElement, html } from "lit";
import { defineHook, useCallbackRef, prepareEffects, resolveStructuralEntry, HostMiddlewareMixin, renderWithSoftSuspense, resolveStructuralProps } from "@litsx/core";
const useControl = defineHook({
  static(label) {
    return {
      label: label.toUpperCase()
    };
  },
  accessors(_host, state, next) {
    return {
      ...next(),
      value: {
        get: () => state.static.label
      }
    };
  },
  use(_host, label, state) {
    return `${state.static.label}:${label}`;
  }
});
export class Field extends HostMiddlewareMixin(LitElement) {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-1jt92vo";
  static [Symbol.for("litsx.component")] = true;
  static structuralEntries = [{
    id: "litsx-structural-134gujm",
    callsiteId: "litsx-structural-134gujm",
    callsiteIndex: 0,
    callsitePath: ["litsx-structural-134gujm"],
    definition: useControl,
    args: [],
    meta: {
      callsitePath: ["litsx-structural-134gujm"]
    }
  }];
  static get properties() {
    return resolveStructuralProps(this);
  }
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      const value = resolveStructuralEntry(this, 0, "litsx-structural-134gujm", useControl, ['draft'], {
        callsitePath: ["litsx-structural-134gujm"]
      });
      return html`<div>${value}</div>`;
    });
  }
}
```

### Rejects structural hooks that declare the same key in props and accessors

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { defineHook } from "@litsx/core";
const useMessages = defineHook({
  props(_host, _state, next) {
    return {
      ...next(),
      messages: { type: Object, attribute: false },
    };
  },
  setup() {
    return { messages: null };
  },
  accessors(_host, state, next) {
    return {
      ...next(),
      messages: {
        get: () => state.instance.messages,
      },
    };
  },
  use() {
    return null;
  },
});
export function Field() {
  useMessages();
  return <div />;
}
```

#### Generated Error

```txt
unknown file: Structural hook "useMessages" declares "messages" in both props and accessors. Overrides within props() or within accessors() are allowed, but the same key cannot be declared across both channels. Public component properties must be declared only through props(); accessors() is reserved for non-public runtime host capabilities.
  10 |     return { messages: null };
  11 |   },
> 12 |   accessors(_host, state, next) {
     |   ^
  13 |     return {
  14 |       ...next(),
  15 |       messages: {
```

### Compiles namespace imported structural hooks discovered from authored modules

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import * as hooks from "./hooks.litsx";
export function Greeting() {
  const locale = hooks.useLocale('en');
  return <div>{locale}</div>;
}
```

#### Generated Error

```txt
unknown file: Unable to resolve imported custom hook "useLocale" from "./hooks.litsx". LitSX must resolve imported custom hooks to determine whether the active host must be passed.
  1 | import * as hooks from "./hooks.litsx";
  2 | export function Greeting() {
> 3 |   const locale = hooks.useLocale('en');
    |                        ^^^^^^^^^
  4 |   return <div>{locale}</div>;
  5 | }
```

#### Hooks Source

```jsx
import { defineHook } from "@litsx/core";
const useLocale = defineHook({
  use(_host, _state, args) {
    return args[0];
  },
});
export { useLocale };
```

#### Generated Output

```js
import { defineHook } from "@litsx/core";
const useLocale = defineHook({
  use(_host, _state, args) {
    return args[0];
  }
});
export { useLocale };
```

### Resolves imported structural hooks through TypeScript path aliases

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { useLocale } from "@/hooks.litsx";
export function Greeting() {
  const locale = useLocale('en');
  return <div>{locale}</div>;
}
```

#### Generated Error

```txt
unknown file: Unable to resolve imported custom hook "useLocale" from "@/hooks.litsx". LitSX must resolve imported custom hooks to determine whether the active host must be passed.
  1 | import { useLocale } from "@/hooks.litsx";
  2 | export function Greeting() {
> 3 |   const locale = useLocale('en');
    |                  ^^^^^^^^^
  4 |   return <div>{locale}</div>;
  5 | }
```

#### Hooks Source

```jsx
import { defineHook } from "@litsx/core";
export const useLocale = defineHook({
  use(_host, _state, args) {
    return args[0];
  },
});
```

#### Generated Output

```js
import { defineHook } from "@litsx/core";
export const useLocale = defineHook({
  use(_host, _state, args) {
    return args[0];
  }
});
```

### Wraps hosts that call imported custom hooks containing structural hooks

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { useMessage } from "./hooks.litsx";
export function Greeting() {
  const message = useMessage('hello');
  return <div>{message}</div>;
}
```

#### Generated Error

```txt
unknown file: Unable to resolve imported custom hook "useMessage" from "./hooks.litsx". LitSX must resolve imported custom hooks to determine whether the active host must be passed.
  1 | import { useMessage } from "./hooks.litsx";
  2 | export function Greeting() {
> 3 |   const message = useMessage('hello');
    |                   ^^^^^^^^^^
  4 |   return <div>{message}</div>;
  5 | }
```

#### Hooks Source

```jsx
import { defineHook } from "@litsx/core";
const useResource = defineHook({
  use(_host, _state, args) {
    return args[0];
  },
});
export function useMessage(name) {
  return useResource(name);
}
```

#### Generated Output

```js
import { defineHook, resolveStructuralEntry, HostMiddlewareMixin } from "@litsx/core";
const useResource = defineHook({
  use(_host, _state, args) {
    return args[0];
  }
});
export function useMessage(_host, name) {
  return resolveStructuralEntry(_host, 0, "litsx-structural-glb16c", useResource, [name], {
    callsitePath: ["useMessage", "litsx-structural-glb16c"]
  });
}
useMessage[Symbol.for("litsx.hook")] = true;
useMessage[Symbol.for("litsx.structuralHookEntries")] = [{
  id: "litsx-structural-glb16c",
  callsiteId: "litsx-structural-glb16c",
  callsiteIndex: 0,
  callsitePath: ["useMessage", "litsx-structural-glb16c"],
  definition: useResource,
  args: [],
  meta: {
    callsitePath: ["useMessage", "litsx-structural-glb16c"]
  }
}];
```

### Attaches structural metadata to custom hooks that contain structural hooks

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { defineHook } from "@litsx/core";
const useResource = defineHook({
  use(_host, _state, args) {
    return args[0];
  },
});
export function useMessage(name) {
  return useResource(name);
}
```

#### Generated Output

```js
import { defineHook, resolveStructuralEntry, HostMiddlewareMixin } from "@litsx/core";
const useResource = defineHook({
  use(_host, _state, args) {
    return args[0];
  }
});
export function useMessage(_host, name) {
  return resolveStructuralEntry(_host, 0, "litsx-structural-glb16c", useResource, [name], {
    callsitePath: ["useMessage", "litsx-structural-glb16c"]
  });
}
useMessage[Symbol.for("litsx.hook")] = true;
useMessage[Symbol.for("litsx.structuralHookEntries")] = [{
  id: "litsx-structural-glb16c",
  callsiteId: "litsx-structural-glb16c",
  callsiteIndex: 0,
  callsitePath: ["useMessage", "litsx-structural-glb16c"],
  definition: useResource,
  args: [],
  meta: {
    callsitePath: ["useMessage", "litsx-structural-glb16c"]
  }
}];
```

### Keeps structural callsite identity stable across repeated transforms

#### Interpretation

This case highlights syntax that should survive the transform unchanged or be preserved semantically.

#### Authored Input

```jsx
import { defineHook } from "@litsx/core";
const useResource = defineHook({
  use(_host, _state, args) {
    return args[0];
  },
});
export function Greeting() {
  const first = useResource('a');
  const second = useResource('b');
  return <div>{first}{second}</div>;
}
```

#### Generated Output

```js
import { LitElement, html } from "lit";
import { defineHook, useCallbackRef, prepareEffects, resolveStructuralEntry, HostMiddlewareMixin, renderWithSoftSuspense, resolveStructuralProps } from "@litsx/core";
const useResource = defineHook({
  use(_host, _state, args) {
    return args[0];
  }
});
export class Greeting extends HostMiddlewareMixin(LitElement) {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-17r6lj8";
  static [Symbol.for("litsx.component")] = true;
  static structuralEntries = [{
    id: "litsx-structural-j4u63p",
    callsiteId: "litsx-structural-j4u63p",
    callsiteIndex: 0,
    callsitePath: ["litsx-structural-j4u63p"],
    definition: useResource,
    args: [],
    meta: {
      callsitePath: ["litsx-structural-j4u63p"]
    }
  }, {
    id: "litsx-structural-19vr2ih",
    callsiteId: "litsx-structural-19vr2ih",
    callsiteIndex: 1,
    callsitePath: ["litsx-structural-19vr2ih"],
    definition: useResource,
    args: [],
    meta: {
      callsitePath: ["litsx-structural-19vr2ih"]
    }
  }];
  static get properties() {
    return resolveStructuralProps(this);
  }
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      const first = resolveStructuralEntry(this, 0, "litsx-structural-j4u63p", useResource, ['a'], {
        callsitePath: ["litsx-structural-j4u63p"]
      });
      const second = resolveStructuralEntry(this, 1, "litsx-structural-19vr2ih", useResource, ['b'], {
        callsitePath: ["litsx-structural-19vr2ih"]
      });
      return html`<div>${first}${second}</div>`;
    });
  }
}
```

### Keeps structural callsite identity and paths consistent for SSR and client transforms

#### Interpretation

This case highlights syntax that should survive the transform unchanged or be preserved semantically.

#### Authored Input

```jsx
import { defineHook } from "@litsx/core";
const useResource = defineHook({
  use(_host, _state, args) {
    return args[0];
  },
});
const useScoped = defineHook({
  use(_host, _state, args) {
    return useResource(`scope:${args[0]}`);
  },
});
export function Panel({ name = 'checkout' }) {
  const value = useScoped(name);
  return <div>{value}</div>;
}
```

#### Generated Output

```js
import { LitElement, html } from "lit";
import { defineHook, useCallbackRef, prepareEffects, resolveStructuralEntry, HostMiddlewareMixin, renderWithSoftSuspense, resolveStructuralProps } from "@litsx/core";
const useResource = defineHook({
  use(_host, _state, args) {
    return args[0];
  }
});
const useScoped = defineHook({
  use(_host, _state, args) {
    return resolveStructuralEntry(_host, 0, "litsx-structural-1kb4jw3", useResource, [`scope:${args[0]}`], {
      callsitePath: ["useScoped", "use", "litsx-structural-1kb4jw3"]
    });
  }
});
useScoped[Symbol.for("litsx.structuralHookEntries")] = [{
  id: "litsx-structural-1kb4jw3",
  callsiteId: "litsx-structural-1kb4jw3",
  callsiteIndex: 0,
  callsitePath: ["useScoped", "use", "litsx-structural-1kb4jw3"],
  definition: useResource,
  args: [],
  meta: {
    callsitePath: ["useScoped", "use", "litsx-structural-1kb4jw3"]
  }
}];
export class Panel extends HostMiddlewareMixin(LitElement) {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-dwka15";
  static [Symbol.for("litsx.component")] = true;
  static get properties() {
    return resolveStructuralProps(this, {
      name: {
        type: String
      }
    });
  }
  static structuralEntries = [{
    id: "litsx-structural-1kb4jw3",
    callsiteId: "litsx-structural-1kb4jw3",
    callsiteIndex: 0,
    callsitePath: ["useScoped", "use", "litsx-structural-1kb4jw3"],
    definition: useResource,
    args: [],
    meta: {
      callsitePath: ["useScoped", "use", "litsx-structural-1kb4jw3"]
    }
  }, {
    id: "litsx-structural-1wlny5r",
    callsiteId: "litsx-structural-1wlny5r",
    callsiteIndex: 1,
    callsitePath: ["litsx-structural-1wlny5r"],
    definition: useScoped,
    args: [],
    meta: {
      callsitePath: ["litsx-structural-1wlny5r"]
    }
  }];
  constructor() {
    super();
    this.name ??= 'checkout';
  }
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      const value = resolveStructuralEntry(this, 1, "litsx-structural-1wlny5r", useScoped, [this.name], {
        callsitePath: ["litsx-structural-1wlny5r"]
      });
      return html`<div>${value}</div>`;
    });
  }
}
```

### Compiles structural hooks nested inside defineHook use readers

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { defineHook } from "@litsx/core";
const useInner = defineHook({
  use(_host, _state, args) {
    return args[0];
  },
});
const useOuter = defineHook({
  use(host, _state, args) {
    return useInner(args[0]);
  },
});
export function Greeting() {
  const value = useOuter('ok');
  return <div>{value}</div>;
}
```

#### Generated Output

```js
import { LitElement, html } from "lit";
import { defineHook, useCallbackRef, prepareEffects, resolveStructuralEntry, HostMiddlewareMixin, renderWithSoftSuspense, resolveStructuralProps } from "@litsx/core";
const useInner = defineHook({
  use(_host, _state, args) {
    return args[0];
  }
});
const useOuter = defineHook({
  use(host, _state, args) {
    return resolveStructuralEntry(host, 0, "litsx-structural-g7zokg", useInner, [args[0]], {
      callsitePath: ["useOuter", "use", "litsx-structural-g7zokg"]
    });
  }
});
useOuter[Symbol.for("litsx.structuralHookEntries")] = [{
  id: "litsx-structural-g7zokg",
  callsiteId: "litsx-structural-g7zokg",
  callsiteIndex: 0,
  callsitePath: ["useOuter", "use", "litsx-structural-g7zokg"],
  definition: useInner,
  args: [],
  meta: {
    callsitePath: ["useOuter", "use", "litsx-structural-g7zokg"]
  }
}];
export class Greeting extends HostMiddlewareMixin(LitElement) {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-1etmcaa";
  static [Symbol.for("litsx.component")] = true;
  static structuralEntries = [{
    id: "litsx-structural-g7zokg",
    callsiteId: "litsx-structural-g7zokg",
    callsiteIndex: 0,
    callsitePath: ["useOuter", "use", "litsx-structural-g7zokg"],
    definition: useInner,
    args: [],
    meta: {
      callsitePath: ["useOuter", "use", "litsx-structural-g7zokg"]
    }
  }, {
    id: "litsx-structural-nv3squ",
    callsiteId: "litsx-structural-nv3squ",
    callsiteIndex: 1,
    callsitePath: ["litsx-structural-nv3squ"],
    definition: useOuter,
    args: [],
    meta: {
      callsitePath: ["litsx-structural-nv3squ"]
    }
  }];
  static get properties() {
    return resolveStructuralProps(this);
  }
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      const value = resolveStructuralEntry(this, 1, "litsx-structural-nv3squ", useOuter, ['ok'], {
        callsitePath: ["litsx-structural-nv3squ"]
      });
      return html`<div>${value}</div>`;
    });
  }
}
```

### Compiles the structural hooks authoring fixture end-to-end

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

- No inline source fixture extracted for this case.

### Rejects structural hook aliases so callsites stay static

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { defineHook } from "@litsx/core";
const useLocale = defineHook({
  use(_host) { return 'en'; },
});
const useAlias = useLocale;
export function Greeting() {
  return <div>{useAlias()}</div>;
}
```

#### Generated Error

```txt
unknown file: Structural hook "useAlias" cannot be created through an alias. Call the structural hook directly so LitSX can assign stable callsite identity.
  3 |   use(_host) { return 'en'; },
  4 | });
> 5 | const useAlias = useLocale;
    |       ^^^^^^^^^^^^^^^^^^^^
  6 | export function Greeting() {
  7 |   return <div>{useAlias()}</div>;
  8 | }
```

### Rejects dynamic structural hook selection so callsites stay static

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { defineHook } from "@litsx/core";
const useLocale = defineHook({ use(_host) { return 'en'; } });
const useTheme = defineHook({ use(_host) { return 'dark'; } });
const useSelected = ready ? useLocale : useTheme;
export function Greeting() {
  return <div>{useSelected()}</div>;
}
```

#### Generated Error

```txt
unknown file: Structural hook "useSelected" cannot be created through an alias. Call the structural hook directly so LitSX can assign stable callsite identity.
  2 | const useLocale = defineHook({ use(_host) { return 'en'; } });
  3 | const useTheme = defineHook({ use(_host) { return 'dark'; } });
> 4 | const useSelected = ready ? useLocale : useTheme;
    |       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  5 | export function Greeting() {
  6 |   return <div>{useSelected()}</div>;
  7 | }
```

### Rejects structural hooks stored in containers

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Object Source

```jsx
import { defineHook } from "@litsx/core";
const useLocale = defineHook({ use(_host) { return 'en'; } });
const hooks = { useLocale };
export function Greeting() { return <div />; }
```

#### Generated Error

```txt
unknown file: Structural hooks cannot be stored in object or array containers. Call the structural hook directly so LitSX can assign stable callsite identity.
  1 | import { defineHook } from "@litsx/core";
  2 | const useLocale = defineHook({ use(_host) { return 'en'; } });
> 3 | const hooks = { useLocale };
    |               ^^^^^^^^^^^^^
  4 | export function Greeting() { return <div />; }
```

#### Array Source

```jsx
import { defineHook } from "@litsx/core";
const useLocale = defineHook({ use(_host) { return 'en'; } });
const hooks = [useLocale];
export function Greeting() { return <div />; }
```

#### Generated Error

```txt
unknown file: Structural hooks cannot be stored in object or array containers. Call the structural hook directly so LitSX can assign stable callsite identity.
  1 | import { defineHook } from "@litsx/core";
  2 | const useLocale = defineHook({ use(_host) { return 'en'; } });
> 3 | const hooks = [useLocale];
    |               ^^^^^^^^^^^
  4 | export function Greeting() { return <div />; }
```

### Rejects computed namespace access for imported structural hooks

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import * as hooks from "./hooks.litsx";
const name = 'useLocale';
export function Greeting() {
  return <div>{hooks[name]('en')}</div>;
}
```

#### Generated Error

```txt
unknown file: Structural hooks imported through a namespace must be accessed with a static property, for example hooks.useThing(). Computed structural hook access cannot provide stable callsite identity.
  2 | const name = 'useLocale';
  3 | export function Greeting() {
> 4 |   return <div>{hooks[name]('en')}</div>;
    |                ^^^^^^^^^^^
  5 | }
```

#### Hooks Source

```jsx
import { defineHook } from "@litsx/core";
export const useLocale = defineHook({ use(_host, _state, args) { return args[0]; } });
```

#### Generated Output

```js
import { defineHook } from "@litsx/core";
export const useLocale = defineHook({
  use(_host, _state, args) {
    return args[0];
  }
});
```

### Detects source features so the compiler can skip unnecessary native plugin passes

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Plain Source

```jsx
export const Greeting = ({ label }) => {
  return <button>{label}</button>;
};
```

#### Generated Output

```js
import { useCallbackRef, prepareEffects, renderWithSoftSuspense } from "@litsx/core";
import { LitElement, html } from "lit";
export class Greeting extends LitElement {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-1cebz10";
  static [Symbol.for("litsx.component")] = true;
  static properties = {
    label: {
      type: String
    }
  };
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      return html`<button>${this.label}</button>`;
    });
  }
}
```

#### Feature Source

```jsx
import FancyButton from './FancyButton.js';
import { useRef, useState } from '@litsx/core';
export function Greeting({ label }) {
  const ref = useRef(null);
  const [count] = useState(0);
  return <FancyButton ref={ref}>{label}{count}</FancyButton>;
}
```

#### Generated Output

```js
import { ShadowDomMixin } from "@litsx/core/elements";
import { LitElement, html } from "lit";
import FancyButton from './FancyButton.js';
import { useRef, useState, useCallbackRef, prepareEffects, renderWithSoftSuspense } from '@litsx/core';
export class Greeting extends ShadowDomMixin(LitElement) {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-1a1ogxb";
  static [Symbol.for("litsx.component")] = true;
  static properties = {
    label: {
      type: String
    }
  };
  static elements = {
    "fancy-button": FancyButton
  };
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      const ref = useRef(this, null);
      const [count] = useState(this, 0);
      return html`<fancy-button .ref=${ref}>${this.label}${count}</fancy-button>`;
    });
  }
}
```

### Keeps authored runtime hook detection aligned with @litsx/core naming

#### Interpretation

This case highlights syntax that should survive the transform unchanged or be preserved semantically.

- No inline source fixture extracted for this case.

### Can disable final template lowering

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
export const Greeting = ({ label }) => {
  return <button @click={save}>{label}</button>;
};
```

#### Generated Output

```js
import { useCallbackRef, prepareEffects, renderWithSoftSuspense } from "@litsx/core";
import { LitElement, html } from "lit";
export class Greeting extends LitElement {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-1cebz10";
  static [Symbol.for("litsx.component")] = true;
  static properties = {
    label: {
      type: String
    }
  };
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      return html`<button @click=${save}>${this.label}</button>`;
    });
  }
}
```

### Keeps top-level lowercase helpers as plain functions and only lowers their JSX

#### Interpretation

This case highlights syntax that should survive the transform unchanged or be preserved semantically.

#### Authored Input

```jsx
function renderHelperWithArgs(alpha, beta, gamma) {
  return <p>{alpha}{beta}{gamma}</p>;
}
export const Demo = () => {
  return <section>{renderHelperWithArgs('a', 'b', 'c')}</section>;
};
```

#### Generated Output

```js
import { useCallbackRef, prepareEffects, renderWithSoftSuspense } from "@litsx/core";
import { LitElement, html } from "lit";
function renderHelperWithArgs(alpha, beta, gamma) {
  return html`<p>${alpha}${beta}${gamma}</p>`;
}
export class Demo extends LitElement {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-b5tsuz";
  static [Symbol.for("litsx.component")] = true;
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      return html`<section>${renderHelperWithArgs('a', 'b', 'c')}</section>`;
    });
  }
}
```

### Does not promote named lowercase exports to authored components

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
export function renderHelper() {
  return <p>ok</p>;
}
```

#### Generated Output

```js
import { html } from "lit";
export function renderHelper() {
  return html`<p>ok</p>`;
}
```

### Can be consumed through createLitsxPresetPlugins directly

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
export const Greeting = ({ label }) => {
  return <button @click={save}>{label}</button>;
};
```

#### Generated Output

```js
import { useCallbackRef, prepareEffects, renderWithSoftSuspense } from "@litsx/core";
import { LitElement, html } from "lit";
export class Greeting extends LitElement {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-1cebz10";
  static [Symbol.for("litsx.component")] = true;
  static properties = {
    label: {
      type: String
    }
  };
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      return html`<button @click=${save}>${this.label}</button>`;
    });
  }
}
```

### Covers typed props, scoped elements, and final template lowering through the preset

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import FancyButton from './FancyButton.js';
type Props = { label: string; count: number };
export const TypedForm = ({ label, count }: Props) => {
  return <FancyButton .label={label}>{count}</FancyButton>;
};
```

#### Generated Output

```js
import { ShadowDomMixin } from "@litsx/core/elements";
import { useCallbackRef, prepareEffects, renderWithSoftSuspense } from "@litsx/core";
import { LitElement, html } from "lit";
import FancyButton from './FancyButton.js';
type Props = {
  label: string;
  count: number;
};
export class TypedForm extends ShadowDomMixin(LitElement) {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-1x7xm13";
  static [Symbol.for("litsx.component")] = true;
  static properties = {
    label: {
      type: String
    },
    count: {
      type: Number
    }
  };
  static elements = {
    "fancy-button": FancyButton
  };
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      return html`<fancy-button .label=${this.label}>${this.count}</fancy-button>`;
    });
  }
}
```

### Does not lower React-only wrappers in the native preset

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { forwardRef, memo } from 'react';
export const Card = memo(
  forwardRef(function Card({ title }, ref) {
    return <label ref={ref}>{title}</label>;
  })
);
```

#### Generated Output

```js
import { html } from "lit";
import { forwardRef, memo } from 'react';
export const Card = memo(forwardRef(function Card({
  title
}, ref) {
  return html`<label ref="${ref}">${title}</label>`;
}));
```

### Does not lower React propTypes in the native preset anymore

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import PropTypes from 'prop-types';
export function Card(props) {
  return <article>{props.title}</article>;
}
Card.propTypes = {
  title: PropTypes.string,
};
```

#### Generated Output

```js
import { useCallbackRef, prepareEffects, renderWithSoftSuspense } from "@litsx/core";
import { LitElement, html } from "lit";
import PropTypes from 'prop-types';
export class Card extends LitElement {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-1gmfkll";
  static [Symbol.for("litsx.component")] = true;
  static properties = {
    title: {
      type: String
    }
  };
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      return html`<article>${this.title}</article>`;
    });
  }
}
Card.propTypes = {
  title: PropTypes.string
};
```

### Covers a combined native preset path with static hoists, handlers, refs, and scoped elements

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import FancyButton from './FancyButton.js';
import { useRef, useState } from '@litsx/core';
type Props = { label: string; active: boolean };
export function ActionCard({ label, active }: Props) {
  const buttonRef = useRef(null);
  const [count, setCount] = useState(0);
  static styles = `:host { display: block; }`;
  static properties = { active: { reflect: true } };
  return <FancyButton ref={buttonRef} .label={label} @click={() => setCount(count + 1)}>{active ? count : 0}</FancyButton>;
}
```

#### Generated Output

```js
import { LitsxStaticHoistsMixin, ShadowDomMixin } from "@litsx/core/elements";
import { LitElement, css, html } from "lit";
const _litsx_static_styles = Symbol("litsx.static.styles");
const _litsx_static_properties = Symbol("litsx.static.properties");
import FancyButton from './FancyButton.js';
import { useRef, useState, useCallbackRef, prepareEffects, renderWithSoftSuspense } from '@litsx/core';
type Props = {
  label: string;
  active: boolean;
};
export class ActionCard extends ShadowDomMixin(LitsxStaticHoistsMixin(LitElement)) {
  static get styles() {
    return this.__litsxStatic(_litsx_static_styles, () => this.__litsxResolveStaticValue(css`:host { display: block; }`));
  }
  static get properties() {
    return this.__litsxStatic(_litsx_static_properties, () => this.__litsxMergeProperties({
      label: {
        type: String
      },
      active: {
        type: Boolean
      }
    }, this.__litsxResolveStaticValue({
      active: {
        reflect: true
      }
    })));
  }
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-1hesru5";
  static [Symbol.for("litsx.component")] = true;
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      const buttonRef = useRef(this, null);
      const [count, setCount] = useState(this, 0);
      return html`<fancy-button .ref=${buttonRef} .label=${this.label} @click=${() => setCount(count + 1)}>${this.active ? count : 0}</fancy-button>`;
    });
  }
  static elements = {
    "fancy-button": FancyButton
  };
}
```

### Supports in-memory playground type resolution through the preset

#### Interpretation

This case captures supported authored syntax and the emitted code path used to preserve that behavior.

#### Authored Input

```jsx
type BaseProps = {
        title: string;
        active: boolean;
        payload: Record<string, unknown>;
      };

      type CardProps = Pick<BaseProps, "title" | "active"> & {
        payload: BaseProps["payload"];
      };

      function Card(props: CardProps) {
        return <article>{props.title}</article>;
      }
```

#### Generated Output

```js
import { useCallbackRef, prepareEffects, renderWithSoftSuspense } from "@litsx/core";
import { LitElement, html } from "lit";
type BaseProps = {
  title: string;
  active: boolean;
  payload: Record<string, unknown>;
};
type CardProps = Pick<BaseProps, "title" | "active"> & {
  payload: BaseProps["payload"];
};
class Card extends LitElement {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-v6ye1x";
  static [Symbol.for("litsx.component")] = true;
  static properties = {
    title: {
      type: String
    },
    active: {
      type: Boolean
    },
    payload: {
      type: Object
    }
  };
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      return html`<article>${this.title}</article>`;
    });
  }
}
```

### Lowers native useState through the canonical preset

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { useState } from '@litsx/core';
export function Counter() {
  const [count, setCount] = useState(1);
  return <button @click={() => setCount(count + 1)}>{count}</button>;
}
```

#### Generated Output

```js
import { LitElement, html } from "lit";
import { useState, useCallbackRef, prepareEffects, renderWithSoftSuspense } from '@litsx/core';
export class Counter extends LitElement {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-1hqdzdh";
  static [Symbol.for("litsx.component")] = true;
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      const [count, setCount] = useState(this, 1);
      return html`<button @click=${() => setCount(count + 1)}>${count}</button>`;
    });
  }
}
```

### Preserves sibling declarators around native useState through the preset

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { useState } from '@litsx/core';
export function Counter() {
  const label = 'ok', [count, setCount] = useState(0);
  setCount(count + 1);
  return <div>{label}: {count}</div>;
}
```

#### Generated Output

```js
import { LitElement, html } from "lit";
import { useState, useCallbackRef, prepareEffects, renderWithSoftSuspense } from '@litsx/core';
export class Counter extends LitElement {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-1hqdzdh";
  static [Symbol.for("litsx.component")] = true;
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      const label = 'ok',
        [count, setCount] = useState(this, 0);
      setCount(count + 1);
      return html`<div>${label}: ${count}</div>`;
    });
  }
}
```

### Threads host through local custom hooks that call native useState

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { useState } from '@litsx/core';
function useCounter(initial) {
  const [value, setValue] = useState(initial);
  return [value, setValue];
}
export function Counter() {
  const [value, setValue] = useCounter(0);
  return <button @click={() => setValue(value + 1)}>{value}</button>;
}
```

#### Generated Output

```js
import { LitElement, html } from "lit";
import { useState, useCallbackRef, prepareEffects, renderWithSoftSuspense } from '@litsx/core';
function useCounter(_host, initial) {
  const [value, setValue] = useState(_host, initial);
  return [value, setValue];
}
useCounter[Symbol.for("litsx.hook")] = true;
export class Counter extends LitElement {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-1aeckbx";
  static [Symbol.for("litsx.component")] = true;
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      const [value, setValue] = useCounter(this, 0);
      return html`<button @click=${() => setValue(value + 1)}>${value}</button>`;
    });
  }
}
```

### Injects prepareEffects and host args for native effect hooks through the preset

#### Interpretation

This case documents code that is synthesized by the transform, not written directly by the user.

#### Authored Input

```jsx
import { useAfterUpdate } from '@litsx/core';
export function Counter() {
  useAfterUpdate(() => {
    this.flag = true;
  }, []);
  return <p>{this.flag}</p>;
}
```

#### Generated Output

```js
import { LitElement, html } from "lit";
import { useAfterUpdate, useCallbackRef, prepareEffects, renderWithSoftSuspense } from '@litsx/core';
export class Counter extends LitElement {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-1gmiq3k";
  static [Symbol.for("litsx.component")] = true;
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      useAfterUpdate(this, () => {
        this.flag = true;
      }, []);
      return html`<p>${this.flag}</p>`;
    });
  }
}
```

### Threads host through native custom hooks in the preset

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { useStableCallback, useAfterUpdate } from '@litsx/core';
function useCustom(flag) {
  const callback = useStableCallback(() => flag, [flag]);
  useAfterUpdate(() => flag && callback(), [flag, callback]);
  return callback;
}
export function Counter() {
  const value = useCustom(this.flag);
  return <button>{String(value && value())}</button>;
}
```

#### Generated Output

```js
import { LitElement, html } from "lit";
import { useStableCallback, useAfterUpdate, useCallbackRef, prepareEffects, renderWithSoftSuspense } from '@litsx/core';
function useCustom(_host, flag) {
  const callback = useStableCallback(_host, () => flag, [flag]);
  useAfterUpdate(_host, () => flag && callback(), [flag, callback]);
  return callback;
}
useCustom[Symbol.for("litsx.hook")] = true;
export class Counter extends LitElement {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-1oc8hmt";
  static [Symbol.for("litsx.component")] = true;
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      const value = useCustom(this, this.flag);
      return html`<button>${String(value && value())}</button>`;
    });
  }
}
```

### Injects host for native useEmit through the preset

#### Interpretation

This case documents code that is synthesized by the transform, not written directly by the user.

#### Authored Input

```jsx
import { useEmit } from '@litsx/core';
export function Counter() {
  const emit = useEmit();
  emit('change', this.value, { cancelable: true });
  return <div>{this.value}</div>;
}
```

#### Generated Output

```js
import { LitElement, html } from "lit";
import { useEmit, useCallbackRef, prepareEffects, renderWithSoftSuspense } from '@litsx/core';
export class Counter extends LitElement {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-1hgedoi";
  static [Symbol.for("litsx.component")] = true;
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      const emit = useEmit(this);
      emit('change', this.value, {
        cancelable: true
      });
      return html`<div>${this.value}</div>`;
    });
  }
}
```

### Lowers native useRef DOM bindings through the canonical preset

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { useRef } from '@litsx/core';
export function Counter() {
  const buttonRef = useRef(null);
  return <button ref={buttonRef}>Click</button>;
}
```

#### Generated Output

```js
import { LitElement, html } from "lit";
import { useCallbackRef, prepareEffects, renderWithSoftSuspense, useRef } from '@litsx/core';
export class Counter extends LitElement {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-1h6erzj";
  static [Symbol.for("litsx.component")] = true;
  get _buttonRefElement() {
    return this.renderRoot?.querySelector("[data-ref=\"_buttonRefElement\"]") ?? this.querySelector("[data-ref=\"_buttonRefElement\"]");
  }
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      const buttonRef = useRef(this, null);
      useCallbackRef(this, () => this._buttonRefElement, node => buttonRef.current = node);
      return html`<button data-ref="_buttonRefElement">Click</button>`;
    });
  }
}
```

### Keeps non-DOM native useRef bindings as mutable refs through the preset

#### Interpretation

This case highlights syntax that should survive the transform unchanged or be preserved semantically.

#### Authored Input

```jsx
import { useRef } from '@litsx/core';
export function Counter() {
  const workerRef = useRef(null);
  workerRef.current = 'ok';
  return <div>{workerRef.current}</div>;
}
```

#### Generated Output

```js
import { LitElement, html } from "lit";
import { useRef, useCallbackRef, prepareEffects, renderWithSoftSuspense } from '@litsx/core';
export class Counter extends LitElement {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-1h6erzj";
  static [Symbol.for("litsx.component")] = true;
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      const workerRef = useRef(this, null);
      workerRef.current = 'ok';
      return html`<div>${workerRef.current}</div>`;
    });
  }
}
```

### Does not follow external playground imports when using in-memory mode

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import type { CardProps } from './types';
function Card({ title, active }: CardProps) {
  return <article>{title} {active ? 'on' : 'off'}</article>;
}
```

#### Generated Output

```js
import { useCallbackRef, prepareEffects, renderWithSoftSuspense } from "@litsx/core";
import { LitElement, html } from "lit";
import type { CardProps } from './types';
class Card extends LitElement {
  static [Symbol.for("litsx.hostTypeId")] = "litsx-host-type-k7sjqx";
  static [Symbol.for("litsx.component")] = true;
  static properties = {
    title: {
      type: String
    },
    active: {
      type: String
    }
  };
  render() {
    return renderWithSoftSuspense(this, () => {
      prepareEffects(this);
      useCallbackRef(this, () => this, node => {
        const componentRef = this.ref;
        if (typeof componentRef === "function") {
          componentRef(node);
        } else if (componentRef && typeof componentRef === "object") {
          componentRef.current = node;
        }
      }, [this.ref]);
      return html`<article>${this.title} ${this.active ? 'on' : 'off'}</article>`;
    });
  }
}
```
