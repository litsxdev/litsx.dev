# `litsx.dev`

[![Validate Docs](https://github.com/litsxdev/litsx.dev/actions/workflows/validate-docs.yml/badge.svg)](https://github.com/litsxdev/litsx.dev/actions/workflows/validate-docs.yml)
[![Deploy Docs](https://github.com/litsxdev/litsx.dev/actions/workflows/deploy-docs.yml/badge.svg)](https://github.com/litsxdev/litsx.dev/actions/workflows/deploy-docs.yml)
[![Docs](https://img.shields.io/badge/docs-litsx.dev-0a7ea4)](https://litsx.dev/)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

VitePress documentation site for LitSX.

This repository owns:
- the documentation site content in `website/docs`
- the internal docs theme package in `packages/vitepress`
- the docs playground in `packages/litsx-playground`

## Source Contract

This repo generates API and transform docs from the LitSX source repository.

Canonical layout for both local development and CI:
- docs repo root: `litsx.dev/`
- LitSX source checkout: `litsx.dev/vendor/litsx`

If `LITSX_SOURCE_DIR` is not set, docs generation defaults to `vendor/litsx`.

## Local Setup

```sh
mkdir -p vendor
git clone https://github.com/litsxdev/litsx.git vendor/litsx
corepack yarn install --immutable
corepack yarn docs:build-content
corepack yarn docs:build
```

To run the local dev server:

```sh
corepack yarn docs:dev
```

## Override Source Location

If you need to point docs generation at another LitSX checkout:

```sh
LITSX_SOURCE_DIR=/absolute/path/to/litsx corepack yarn docs:build
```

## Pipelines

This repo currently includes:
- `Validate Docs`: installs, regenerates docs content, and builds the site
- `Deploy Docs`: builds and deploys GitHub Pages from `main`

Both workflows expect a second checkout of the `litsx` source repo at `vendor/litsx`.
