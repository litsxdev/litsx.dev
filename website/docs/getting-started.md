# Getting Started

Lit<sup>sx</sup> 1.0 uses ordinary `.tsx` and `.jsx`. The Lit<sup>sx</sup> compiler turns standard JSX into Lit templates and custom elements; TypeScript, ESLint, Prettier, and editors can work with the source directly.

## Create a project

```sh
npm create litsx-app@next my-app -- --template app
cd my-app
npm install
npm run dev
```

Choose a different starting point when needed:

```sh
npm create litsx-app@next my-components -- --template component
npm create litsx-app@next my-design-system -- --template design-system --visual-tests
npm create litsx-app@next my-ssr-app -- --template ssr
```

The generated project configures Vite, TypeScript, and the official ESLint rules. The `ssr` template also includes a document renderer and browser hydration entry.

## Your first component

```tsx
import { css, useState } from "@litsx/core";

type CounterProps = {
  initialCount?: number;
};

export function Counter({ initialCount = 0 }: CounterProps) {
  const [count, setCount] = useState(initialCount);

  return (
    <button on:click={() => setCount((value) => value + 1)}>
      Count: {count}
    </button>
  );
}

Counter.styles = css`
  button {
    padding: 0.65rem 1rem;
    border-radius: 999px;
  }
`;
```

The important 1.0 conventions are visible here:

- source files are normal `.tsx` or `.jsx`
- DOM and custom-element listeners use `on:event`
- ordinary JSX prop names are mapped to the right Lit binding by the compiler
- component metadata uses top-level assignments such as `Counter.styles = ...`; styles may be one `CSSResult` or an ordered array of reusable `CSSResult` values
- `css` is Lit's real tagged template, re-exported by `@litsx/core`

## Add Lit<sup>sx</sup> to an existing Vite project

```sh
npm install @litsx/core lit
npm install -D @litsx/vite-plugin @litsx/eslint-plugin
```

```js
// vite.config.js
import { defineConfig } from "vite";
import { litsx } from "@litsx/vite-plugin";

export default defineConfig({
  plugins: [litsx()],
});
```

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@litsx/core"
  }
}
```

The Vite plugin compiles `.jsx` and `.tsx` by default. Standard TypeScript and Prettier handle the source; there is no custom file extension or formatter to install.

## Where to go next

- [Standard JSX authoring](./guides/jsx-authoring.md)
- [Component metadata](./guides/component-metadata.md)
- [Property and binding inference](./guides/property-inference.md)
- [Server rendering and hydration](./guides/ssr.md)
- [Styling options](./guides/styling.md), including the optional [UnoCSS integration](./guides/unocss.md)
- [Tooling](./guides/tooling.md)
- [Migrating pre-1.0 source](./guides/migrating-to-1.md)
