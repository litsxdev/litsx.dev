# Component Metadata in 1.0

The experimental in-function `static name = ...` syntax has been removed. Lit<sup>sx</sup> 1.0 uses ordinary top-level component assignments:

```tsx
import { css } from "@litsx/core";

export function StatusCard({ active = false }) {
  return <article data-active={active}><slot /></article>;
}

StatusCard.styles = css`:host { display: block; }`;
StatusCard.properties = { active: { type: Boolean, reflect: true } };
StatusCard.shadowRootOptions = { mode: "open", delegatesFocus: true };
```

Continue with [Component Metadata](./component-metadata.md), or see [Migrating to 1.0](./migrating-to-1.md) for the complete syntax map.
