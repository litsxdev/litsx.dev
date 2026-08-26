# Server Rendering and Hydration

`@litsx/ssr` renders Lit<sup>sx</sup> component trees to HTML with Declarative Shadow DOM, scoped-element metadata, suspense stabilization, and a matching hydration payload.

## Start with the SSR template

```sh
npm create litsx-app@next my-ssr-app -- --template ssr
```

The scaffold includes the server document renderer, a browser registration entry, and local development wiring.

To add SSR to an existing Lit<sup>sx</sup> project on the 1.0 prerelease line:

```sh
npm install @litsx/ssr@next
```

## DOM initialization and `html`

The main `@litsx/ssr` entry initializes Lit's server DOM environment before evaluating its Lit-dependent runtime. It also re-exports Lit's `html` tag, so lower-level framework code can obtain both from the same safe entry:

```js
import { html, renderToString } from "@litsx/ssr";

const result = await renderToString(html`<app-root></app-root>`);
```

This is sufficient when `@litsx/ssr` loads before application components. A framework that may evaluate Lit, `LitElement`, or compiled components first must establish the DOM identity at its earliest server entry:

```js
import "@litsx/ssr/install-dom-shim";

const { startServer } = await import("./server.js");
await startServer();
```

The bootstrap import is synchronous and idempotent, preserves an existing DOM environment, and is a browser no-op. Keep component loading behind that import boundary: class hierarchies created against a different `HTMLElement` identity cannot be repaired afterwards. Do not import Lit's internal DOM-shim subpath directly.

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

The `html` argument passed to `render(...)` is the same initialized tag exposed by the package entry; authored entries do not need a separate `lit` import.

## Light DOM ownership and hydration

An empty registered Light DOM host in an authored entry is rendered automatically on the server:

```js
elements(loader) {
  return {
    "app-root": async () => (await loader("./src/App.tsx")).AppRoot,
  };
},
render({ html }) {
  return html`<app-root></app-root>`;
}
```

This gives hydration existing child nodes to adopt instead of creating the Light DOM tree during the first browser update. An explicit `renderLight()` remains valid and is not duplicated. A host with authored children is left alone because those nodes may be intentional projected content.

The Vite plugin also infers nested Light DOM boundaries when a project-local pure Lit template consumes an imported Lit<sup>sx</sup> child. Server and browser output share the same child-owned Lit part, preserving descendant node identity, event bindings, and later updates through hydration.

There is one context boundary to keep explicit: a context provider authored inside an uncompiled pure Lit `LightDomMixin` template does not enter the Lit<sup>sx</sup> SSR provider stack for its initial value. Provider updates after hydration use the normal composed `@lit/context` protocol.

## Request state and resource snapshots

`createExecutionContextKey(...)` and `getCurrentExecutionContext()` provide request-local state shared by nested server components and stable across suspense retries.

Library runtimes with a global resource cache can use `useSsrResourceSnapshot({ key, capture, restore })`. The server captures serializable state after the final render pass; hydration restores it before component registration can trigger the first client render. This API is for infrastructure libraries, not manual application bootstrap code.

## Scope

The supported interoperability path covers registered pure Lit and Lit<sup>sx</sup> trees whose constructors and boundaries are visible to the compiler or SSR `elements` map. Arbitrary opaque third-party Lit components with unrelated light/shadow DOM and hydration behavior do not automatically acquire Lit<sup>sx</sup> SSR semantics.
