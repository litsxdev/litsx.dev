# Tooling

Lit<sup>sx</sup> has its own tooling stack for authoring JSX that targets Lit and web components:

- `@litsx/vite-plugin`
- `@litsx/compiler`
- `@litsx/core/jsx-runtime` and `@litsx/core/jsx-dev-runtime`
- `vscode-litsx`
- `@litsx/typescript`
- `create-litsx-app`

## Tooling Setup

The baseline setup for a project is:

- `@litsx/core` runtime
- `@litsx/vite-plugin` for Vite-based compilation
- `vscode-litsx` for editor highlighting and workspace defaults
- `@litsx/typescript`
- `jsxImportSource: "@litsx/core"`
- `litsx-tsc` for CLI type-checking of authored Lit<sup>sx</sup> syntax
- the scaffold from `create-litsx-app`

The official authored source extensions are:

- `*.litsx`
- `*.litsx.jsx`

This is not just branding. VS Code's built-in JSX grammars still treat Lit<sup>sx</sup>
authored attributes such as `@click`, `.value`, and `?disabled` as illegal tokens,
so the official editor path uses dedicated Lit<sup>sx</sup> language modes instead of
trying to patch `typescriptreact` or `javascriptreact`.

That stack is enough to treat Lit<sup>sx</sup> as its own framework in the editor and build pipeline.

For editor DX, the stack is split intentionally:

- `vscode-litsx` for syntax highlighting and VS Code defaults
- `@litsx/typescript` for hover, completions, diagnostics, and rename

For `tsx` and `jsx` files, `vscode-litsx` does not hijack the standard VS Code
language mode globally. Instead, it allows the LitSX language modes to be
selected manually and can suggest switching when Lit<sup>sx</sup>-authored
syntax is detected in a `typescriptreact` or `javascriptreact` document.

For app builds on Vite, the public compilation surface is `@litsx/vite-plugin`.

For lower-level programmatic compilation outside Vite, the public facade is `@litsx/compiler`.

Packages such as `@litsx/authoring/parser` and the individual Babel transforms are still available, but they belong to advanced integrations and infrastructure work rather than to the normal baseline setup for applications.

For CLI type-checking, use the virtualized entrypoint instead of plain `tsc` when the codebase includes Lit<sup>sx</sup>-specific authored syntax such as:

- `@event`
- `.prop`
- `?attr`
- `static name = ...`

Typical scaffolded usage:

```sh
litsx-tsc -p jsconfig.json --noEmit
```

That is why the scaffolding exposes:

- `npm run typecheck`

Plain `tsc --noEmit` is still fine for standard TS/JSX, but it will not parse Lit<sup>sx</sup>-specific authored syntax by itself, including files such as `*.litsx`.

`litsx-tsc` and the editor session understand authored `.litsx` modules directly. Named exports from files such as `./button.litsx` are resolved without a project-level `declare module "*.litsx"` shim, so authored components can import each other from `.litsx`, `.ts`, `.tsx`, stories, and tests while preserving the exported names.

That split is deliberate:

- editor DX comes from `@litsx/typescript`
- CLI type-checking for authored Lit<sup>sx</sup> syntax comes from `litsx-tsc`
- Vite compilation comes from `@litsx/vite-plugin`
- lower-level compilation comes from `@litsx/compiler`

The important thing is that tooling is not just parsing JSX. It also understands the authored contract of the framework:

- prop types drive generated Lit property descriptors
- `static properties = ...` refines those descriptors
- `static styles = ...` is treated as static component CSS
- `static name = ...` hoists are validated as top-level-only component statements
- `useStyle(...)` stays in the dynamic runtime surface
- structural hooks declared with `defineHook({ static, setup, middlewares, use })` are discovered through the hook graph and wired into static or instance structural plans automatically

Type declarations also carry the native styling helpers, so editor tooling can distinguish:

- `useStyle("--panel-gap", value)`
- `useStyle("--panel-gap", () => value, [deps])`

That means the editor can catch the computed form when the dependency array is missing.

The TypeScript-aware transform also uses prop types as the source of truth for generated Lit property descriptors. That is what lets Lit<sup>sx</sup> infer class property metadata from authored props and then merge `static properties = ...` on top when needed.

When the compiler has to recover property metadata from opaque member access like `props.title`, it still emits a usable descriptor, but it also records a warning in transform metadata (`metadata.litsxWarnings`) so tooling can surface that the fallback inference was weaker than a typed or destructured signature.

In other words, the build pipeline is responsible for preserving the Lit<sup>sx</sup> programming model, not just for emitting valid JavaScript.

## Linting And Formatting

Lit<sup>sx</sup> ships an official ESLint integration:

- `@litsx/eslint-plugin`

The current shape is intentionally processor-first:

- authored Lit<sup>sx</sup> source is virtualized before ESLint parses it
- findings are remapped back to the original source positions
- Lit<sup>sx</sup>-specific semantic rules run with normal ESLint rule ids

The recommended linting baseline is:

- `vscode-litsx` for syntax highlighting and workspace defaults
- `@litsx/typescript` for editor understanding
- `litsx-tsc` for authored type-checking
- `@litsx/vite-plugin` for compilation
- `@litsx/eslint-plugin` for linting

The plugin covers authored forms such as:

- `@event`
- `.prop`
- `?attr`
- `static name = ...`

and includes rules such as:

- `@litsx/no-native-classname`
- `@litsx/no-invalid-binding-value`
- `@litsx/no-unknown-binding`
- `@litsx/static-hoists-top-level`
- `@litsx/no-react-memo`
- `@litsx/no-duplicate-static-hoist`

The plugin also ships multiple presets:

- `plugin:@litsx/recommended`
- `plugin:@litsx/recommended-react-migration`
- `plugin:@litsx/strict`

and flat-config equivalents:

- `configs["recommended-flat"]`
- `configs["recommended-lint-flat"]`
- `configs["recommended-react-migration-flat"]`
- `configs["strict-flat"]`

The intended split is:

- `recommended`
  - editor-friendly baseline
  - avoids duplicating inline feedback already provided by `@litsx/typescript`
- `recommended-lint`
  - enables Lit<sup>sx</sup> semantic lint rules directly in ESLint
  - useful for CI or teams that want the same checks enforced by lint

## What Comes From Where

- Syntax highlighting and VS Code defaults: `vscode-litsx`
- Hover, completion, diagnostics, rename, definition: `@litsx/typescript`
- Lint and policy enforcement: `@litsx/eslint-plugin`
- Authored CLI type-checking: `litsx-tsc`
- Compilation: `@litsx/vite-plugin`

Formatting has an official starting point:

- `prettier-plugin-litsx`

The v1 surface is intentionally narrow:

- `*.litsx`
- `*.litsx.jsx`

It preserves Lit<sup>sx</sup>-authored syntax directly and formats static
`static styles = \`...\`;` templates as CSS. Plain `tsx/jsx` compatibility formatting remains
intentionally out of scope in this first pass.

So the authoritative story today is:

- use the ESLint plugin for linting
- use `litsx-tsc` and the compiler toolchain for authored correctness
- use `prettier-plugin-litsx` for official authored-source formatting

## Public Surfaces

Most users only need these public entrypoints:

- `@litsx/vite-plugin` for Vite and Storybook-with-Vite setups
- `@litsx/compiler` for custom programmatic compilation
- `@litsx/typescript` for editor support
- `create-litsx-app` for the recommended starting point

Treat parser internals and individual transform packages as advanced building blocks, not as the default setup to wire by hand.

## Legacy Compatibility

If you are migrating an existing React codebase, you can add the React compatibility transforms on top of the native Lit<sup>sx</sup> tooling.

The canonical Babel entrypoint for that layer is:

- `@litsx/babel-preset-react-compat`

That preset handles the React-shaped migration surface and lowers it into native Lit<sup>sx</sup> JSX/runtime primitives.
Most React lowering stages are internal to the preset. The supported React migration surface is the preset itself.

That does not change the execution model:

- components still compile to Lit-compatible output
- the runtime target is still web components
- React stays as an authored compatibility layer, not as the runtime

For component libraries and design systems, the scaffold can also wire:

- Storybook
- MDX docs
- Playwright-based visual testing in a containerized flow

Storybook projects generated by `create-litsx-app` include a Vite pretransform for `*.stories.litsx`. It scans named imports from `.litsx` files and local authored story hosts such as `const DrawerStory = (...) => ...`, then registers the corresponding custom elements before the Lit<sup>sx</sup> transform runs. That lets stories render authored hosts naturally:

```tsx
export const Playground = {
  render: (args) => (
    <DrawerStory
      defaultOpen={args.defaultOpen}
      heading={args.heading}
    />
  ),
};
```

The generated Storybook setup avoids manual `customElements.define(...)` calls, manual kebab-case host tags, and `html\`...\`` workarounds for local story wrappers. Prefixed bindings such as `.prop`, `?attr`, and `@event` still keep their Lit semantics.

## Documentation Generation

This documentation site is intentionally mixed:

- guides are handwritten
- API pages are generated from package metadata and public entry files
- example walkthroughs are curated under `website/docs/examples/`
- transform pages are derived from the transform test suites

That keeps the docs close to the code and reduces duplication.

## Next

- [Getting Started](../getting-started.md)
- [Property Inference](./property-inference.md)
- [Examples](../examples/)
