# `litsx.dev`

VitePress documentation site for LitSX.

## Source contract

This repo generates API and transform docs from the LitSX source repository.

The canonical local and CI layout is:

- docs repo root: `litsx.dev/`
- LitSX source checkout: `litsx.dev/vendor/litsx`

If `LITSX_SOURCE_DIR` is not set, the docs scripts default to `vendor/litsx`.

Local setup:

```sh
mkdir -p vendor
git clone https://github.com/litsxdev/litsx.git vendor/litsx
corepack yarn install
corepack yarn docs:build
```

You can still override the source location explicitly when needed:

```sh
LITSX_SOURCE_DIR=/absolute/path/to/litsx corepack yarn docs:build
```
