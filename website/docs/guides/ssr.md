# Server Rendering and Hydration

`@litsx/ssr` renders Lit<sup>sx</sup> component trees to HTML with Declarative Shadow DOM, scoped-element metadata, suspense stabilization, and a matching hydration payload.

## Start with the SSR template

```sh
npm create litsx-app@next my-ssr-app -- --template ssr
```

The scaffold includes the server document renderer, a browser registration entry, and local development wiring.

## Render a document

```tsx
import { renderDocument } from "@litsx/ssr";
import { ProductCard } from "./ProductCard.tsx";

const result = await renderDocument(
  <ProductCard product={product} />,
  {
    title: "Product page",
    clientEntry: "/src/main.js",
  },
);

return new Response(result.document, {
  headers: { "content-type": "text/html; charset=utf-8" },
});
```

The matching browser entry registers the compiled elements:

```js
const { defineProductElements } = await import("./ProductCard.tsx");
defineProductElements();
```

When `clientEntry` is present, `renderDocument(...)` emits the standard hydration bootstrap. It also returns the rendered fragment, module preloads, hydration data, and normalized document-shell fields for framework adapters.

## Lower-level rendering

Use `renderToString(...)` when your framework owns the document shell. Use `renderToStream(...)` when the response must be exposed as a Web `ReadableStream<string>`.

Streaming in 1.0 is a transport shape over the stabilized SSR result: Lit<sup>sx</sup> waits for suspense retries to settle before emitting chunks. It is not progressive Suspense streaming.

## Authored entries

Build scripts can render from an authored entry without importing a constructor first:

```js
import { createEntry, renderDocument } from "@litsx/ssr";

const result = await renderDocument(createEntry({
  root: process.cwd(),
  clientEntry: "./src/main.js",
  elements(loader) {
    return {
      "app-root": async () => (await loader("./src/App.tsx")).App,
    };
  },
  render({ html }) {
    return html`<app-root></app-root>`;
  },
}));
```

## Request state and resource snapshots

`createExecutionContextKey(...)` and `getCurrentExecutionContext()` provide request-local state shared by nested server components and stable across suspense retries.

Library runtimes with a global resource cache can use `useSsrResourceSnapshot({ key, capture, restore })`. The server captures serializable state after the final render pass; hydration restores it before component registration can trigger the first client render. This API is for infrastructure libraries, not manual application bootstrap code.

## Scope

The documented 1.0 guarantees cover Lit<sup>sx</sup>-authored component trees. Arbitrary third-party Lit components with unrelated light/shadow DOM and hydration behavior are outside that guarantee.
