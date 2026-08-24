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
export const TestGreeting = ({ label }) => {
  return <button>{label}</button>;
};
```

#### Generated Error

```txt
Unterminated regular expression. (2:26)
```

### Routes ordinary JSX props into local component rest bags

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
const TestAction = ({ label, ...props }) => { return <button {...props}>{label}</button>; };
export const TestScreen = () => { return <TestAction label="Save" aria-label="Save action" />; };
```

#### Generated Error

```txt
Unexpected token, expected "," (1:61)
```

### Matches the direct preset plugin factory

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import FancyButton from './FancyButton.js';
export const TestGreeting = ({ label = 'Save' }) => {
  return <FancyButton .label={label} @click={save} />;
};
```

#### Generated Error

```txt
Unexpected token, expected "," (3:22)
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

#### Generated Error

```txt
Missing semicolon. (8:21)
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

#### Generated Error

```txt
Unterminated regular expression. (2:19)
```

### Compiles structural hooks as deduplicated host capabilities

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { defineHook, useHost } from "@litsx/core";
const CapabilityMixin = Base => class extends Base { get capability() { return 'ready'; } };
const useCapability = defineHook({
  mixin: CapabilityMixin,
  use(suffix = '') { return useHost().capability + suffix; },
});
export function TestPanel() {
  const first = useCapability(':first');
  const second = useCapability(':second');
  return <div>{first}{second}</div>;
}
```

#### Generated Error

```txt
Missing semicolon. (10:21)
```

### Compiles installation-only structural hooks without an implicit host result

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { defineHook } from "@litsx/core";
const FocusMixin = Base => class extends Base { static delegatesFocus = true; };
const useFocusCapability = defineHook({ mixin: FocusMixin });
export function TestPanel() {
  useFocusCapability();
  return <div>Ready</div>;
}
```

#### Generated Error

```txt
Unterminated regular expression. (6:21)
```

### Propagates structural hook requirements through custom hooks

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { defineHook, useHost } from "@litsx/core";
const I18nMixin = Base => class extends Base {};
const useI18n = defineHook({ mixin: I18nMixin, use: () => useHost().i18n });
export function useTranslatedLabel(key) {
  return useI18n().t(key);
}
export function useToolbarLabel(key) {
  return useTranslatedLabel(key);
}
export function TestButton() {
  return <button>{useToolbarLabel('save')}</button>;
}
```

#### Generated Error

```txt
Unexpected token (11:34)
```

### Rejects the removed structural middleware contract at compile time

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { defineHook } from "@litsx/core";
const useLegacy = defineHook({
  setup() {},
  props: { value: {} },
  use(host) { return host.value; },
});
```

#### Generated Error

```txt
unknown file: defineHook() no longer accepts structural fields setup, props. Implement host behavior in mixin and retain only { mixin, use }.
  1 | import { defineHook } from "@litsx/core";
> 2 | const useLegacy = defineHook({
    |                              ^
  3 |   setup() {},
  4 |   props: { value: {} },
  5 |   use(host) { return host.value; },
```

### Detects source features so the compiler can skip unnecessary native plugin passes

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Plain Source

```jsx
export const TestGreeting = ({ label }) => {
  return <button>{label}</button>;
};
```

#### Generated Error

```txt
Unterminated regular expression. (2:26)
```

#### Feature Source

```jsx
import FancyButton from './FancyButton.js';
import { useRef, useState } from '@litsx/core';
export function TestGreeting({ label }) {
  const ref = useRef(null);
  const [count] = useState(0);
  return <FancyButton ref={ref}>{label}{count}</FancyButton>;
}
```

#### Generated Error

```txt
Unexpected token, expected "," (6:22)
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
export const TestGreeting = ({ label }) => {
  return <button @click={save}>{label}</button>;
};
```

#### Generated Error

```txt
Unexpected token, expected "," (2:17)
```

### Keeps top-level lowercase helpers as plain functions and only lowers their JSX

#### Interpretation

This case highlights syntax that should survive the transform unchanged or be preserved semantically.

#### Authored Input

```jsx
function renderHelperWithArgs(alpha, beta, gamma) {
  return <p>{alpha}{beta}{gamma}</p>;
}
export const TestDemo = () => {
  return <section>{renderHelperWithArgs('a', 'b', 'c')}</section>;
};
```

#### Generated Error

```txt
Missing semicolon. (2:19)
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

#### Generated Error

```txt
Unterminated regular expression. (2:16)
```

### Can be consumed through createLitsxPresetPlugins directly

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
export const TestGreeting = ({ label }) => {
  return <button @click={save}>{label}</button>;
};
```

#### Generated Error

```txt
Unexpected token, expected "," (2:17)
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

#### Generated Error

```txt
Unexpected token, expected "," (4:22)
```

### Rewrites renderToString roots into scoped templates

#### Interpretation

This case shows the authored JSX/API surface and the normalized output produced by the compatibility transform.

#### Authored Input

```jsx
import { renderToString } from '@litsx/ssr';
import ProductCard from './ProductCard.js';
export async function renderProduct(product) {
  return renderToString(<ProductCard .product={product} />);
}
```

#### Generated Error

```txt
Unexpected token, expected "," (4:37)
```

### Rewrites renderToStream roots into scoped templates

#### Interpretation

This case shows the authored JSX/API surface and the normalized output produced by the compatibility transform.

#### Authored Input

```jsx
import { renderToStream } from '@litsx/ssr';
import ProductCard from './ProductCard.js';
export async function renderProduct(product) {
  return renderToStream(<ProductCard .product={product} />);
}
```

#### Generated Error

```txt
Unexpected token, expected "," (4:37)
```

### Keeps default async PascalCase exports out of the LitElement lowering path

#### Interpretation

This case highlights syntax that should survive the transform unchanged or be preserved semantically.

#### Authored Input

```jsx
export default async function ProductPage({ slug }) {
  return <main>{slug}</main>;
}
```

#### Generated Error

```txt
Unterminated regular expression. (2:23)
```

### Keeps default exports that resolve to async PascalCase bindings out of LitElement lowering

#### Interpretation

This case highlights syntax that should survive the transform unchanged or be preserved semantically.

#### Authored Input

```jsx
const ProductPage = async ({ slug }) => {
  return <main>{slug}</main>;
};
export default ProductPage;
```

#### Generated Error

```txt
Unterminated regular expression. (2:23)
```

### Does not treat named async exports as server-side components

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
export async function ProductPage({ slug }) {
  return <main>{slug}</main>;
}
```

#### Generated Error

```txt
Unterminated regular expression. (2:23)
```

### Fails when an async PascalCase binding is used as an SSR root without being the default export

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { renderToString } from '@litsx/ssr';
async function ProductPage({ slug }) {
  return <main>{slug}</main>;
}
export async function renderPage(slug) {
  return renderToString(<ProductPage .slug={slug} />);
}
```

#### Generated Error

```txt
Unterminated regular expression. (3:23)
```

### Fails when a server component module is imported through a non-default binding

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { renderToString } from '@litsx/ssr';
import { ProductPage } from './ProductPage.js';
export async function renderPage(slug) {
  return renderToString(<ProductPage .slug={slug} />);
}
```

#### Generated Error

```txt
Unexpected token, expected "," (4:37)
```

### Does not treat default async PascalCase exports without a renderable return as server-side components

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
export default async function ProductPage({ slug }) {
  return slug.length;
}
```

#### Generated Output

```js
export default async function ProductPage({
  slug
}) {
  return slug.length;
}
```

### Lowers default async PascalCase exports with scoped JSX returns into server-side components

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import ProductCard from './ProductCard.js';
export default async function ProductPage({ product }) {
  return <main><ProductCard .product={product} /></main>;
}
```

#### Generated Error

```txt
Unexpected token, expected "</>/<=/>=" (3:36)
```

### Uses Component.elements for html template returns in default async server components

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import ProductCard from './ProductCard.js';
export default async function ProductPage({ product }) {
  return html`<main><product-card .product=${product}></product-card></main>`;
}
ProductPage.elements = {
  'product-card': ProductCard,
};
```

#### Generated Output

```js
import { __litsxScopedTemplate, annotateHydratableCustomElement, LITSX_SERVER_COMPONENT } from "@litsx/core/elements";
import ProductCard from './ProductCard.js';
export default async function ProductPage({
  product
}) {
  return __litsxScopedTemplate(html`<main><product-card .product=${product}></product-card></main>`, {
    "product-card": annotateHydratableCustomElement(ProductCard, {
      tagName: "product-card",
      moduleId: "./ProductCard.js"
    })
  });
}
ProductPage.elements = {
  'product-card': ProductCard
};
ProductPage[LITSX_SERVER_COMPONENT] = true;
```

### Resolves stable const aliases inside Component.elements

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import ProductCard from './ProductCard.js';
const TestCard = ProductCard;
export default async function ProductPage({ product }) {
  return html`<main><product-card .product=${product}></product-card></main>`;
}
ProductPage.elements = {
  'product-card': TestCard,
};
```

#### Generated Output

```js
import { __litsxScopedTemplate, annotateHydratableCustomElement, LITSX_SERVER_COMPONENT } from "@litsx/core/elements";
import ProductCard from './ProductCard.js';
const TestCard = ProductCard;
export default async function ProductPage({
  product
}) {
  return __litsxScopedTemplate(html`<main><product-card .product=${product}></product-card></main>`, {
    "product-card": annotateHydratableCustomElement(ProductCard, {
      tagName: "product-card",
      moduleId: "./ProductCard.js"
    })
  });
}
ProductPage.elements = {
  'product-card': TestCard
};
ProductPage[LITSX_SERVER_COMPONENT] = true;
```

### Resolves stable object member entries inside Component.elements

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import ProductCard from './ProductCard.js';
const controls = { ProductCard };
export default async function ProductPage({ product }) {
  return html`<main><product-card .product=${product}></product-card></main>`;
}
ProductPage.elements = {
  'product-card': controls.ProductCard,
};
```

#### Generated Output

```js
import { __litsxScopedTemplate, annotateHydratableCustomElement, LITSX_SERVER_COMPONENT } from "@litsx/core/elements";
import ProductCard from './ProductCard.js';
const controls = {
  ProductCard
};
export default async function ProductPage({
  product
}) {
  return __litsxScopedTemplate(html`<main><product-card .product=${product}></product-card></main>`, {
    "product-card": annotateHydratableCustomElement(ProductCard, {
      tagName: "product-card",
      moduleId: "./ProductCard.js"
    })
  });
}
ProductPage.elements = {
  'product-card': controls.ProductCard
};
ProductPage[LITSX_SERVER_COMPONENT] = true;
```

### Rejects Component.elements entries that do not resolve to a single stable constructor

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import ProductCard from './ProductCard.js';
import FallbackCard from './FallbackCard.js';
export default async function ProductPage({ product }) {
  return html`<main><product-card .product=${product}></product-card></main>`;
}
ProductPage.elements = {
  'product-card': flag ? ProductCard : FallbackCard,
};
```

#### Generated Error

```txt
unknown file: LitSX could not resolve Component.elements["product-card"] to a single stable custom element constructor. Use a stable binding, wrap the constructor with annotateHydratableCustomElement(...), or delegate SSR/hydration through an adapter.
  5 | }
  6 | ProductPage.elements = {
> 7 |   'product-card': flag ? ProductCard : FallbackCard,
    |                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  8 | };
```

### Rejects dynamic Component.elements entries without explicit metadata

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import ProductCard from './ProductCard.js';
const resolveCard = () => ProductCard;
export default async function ProductPage({ product }) {
  return html`<main><product-card .product=${product}></product-card></main>`;
}
ProductPage.elements = {
  'product-card': resolveCard(),
};
```

#### Generated Error

```txt
unknown file: LitSX could not resolve Component.elements["product-card"] to a single stable custom element constructor. Use a stable binding, wrap the constructor with annotateHydratableCustomElement(...), or delegate SSR/hydration through an adapter.
  5 | }
  6 | ProductPage.elements = {
> 7 |   'product-card': resolveCard(),
    |                   ^^^^^^^^^^^^^
  8 | };
```

### Rewrites renderToString server-component roots into awaited function calls

#### Interpretation

This case shows the authored JSX/API surface and the normalized output produced by the compatibility transform.

#### Authored Input

```jsx
import { renderToString } from '@litsx/ssr';
export default async function ProductPage({ slug }) {
  return <main>{slug}</main>;
}
export async function renderPage(slug) {
  return renderToString(<ProductPage .slug={slug} />);
}
```

#### Generated Error

```txt
Unterminated regular expression. (3:23)
```

### Rewrites imported server-component roots into runtime call markers

#### Interpretation

This case shows the authored JSX/API surface and the normalized output produced by the compatibility transform.

#### Authored Input

```jsx
import { renderToString } from '@litsx/ssr';
import ProductPage from './ProductPage.js';
export async function renderPage(slug) {
  return renderToString(<ProductPage .slug={slug} />);
}
```

#### Generated Error

```txt
Unexpected token, expected "," (4:37)
```

### Rewrites aliased imported server-component roots through shared import resolution

#### Interpretation

This case shows the authored JSX/API surface and the normalized output produced by the compatibility transform.

#### Authored Input

```jsx
import { renderToString } from '@litsx/ssr';
import ProductPage from "@/pages/ProductPage.js";
export async function renderPage(slug) {
  return renderToString(<ProductPage slug={slug} />);
}
```

#### Generated Error

```txt
Unexpected token, expected "," (4:37)
```

### Dedupes scoped entries across fragment SSR roots

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { renderToString } from '@litsx/ssr';
import ProductCard from './ProductCard.js';
export async function renderProducts(a, b) {
  return renderToString(<>
    <main><ProductCard .product={a} /></main>
    <ProductCard .product={b} />
  </>);
}
```

#### Generated Error

```txt
Type parameter list cannot be empty. (4:24)
```

### Lowers nested imported server components inside server-side component returns

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import ProductSection from './ProductSection.js';
export default async function ProductPage({ product }) {
  return <main><ProductSection .product={product} /></main>;
}
```

#### Generated Error

```txt
Unexpected token, expected "</>/<=/>=" (3:39)
```

### Allows nested async PascalCase bindings inside a default-export server component

#### Interpretation

This case captures supported authored syntax and the emitted code path used to preserve that behavior.

#### Authored Input

```jsx
async function ProductSection({ product }) {
  return <section>{product.name}</section>;
}
export default async function ProductPage({ product }) {
  return <main><ProductSection .product={product} /></main>;
}
```

#### Generated Error

```txt
Unexpected token, expected "," (2:26)
```

### Lowers nested async PascalCase bindings inside fragment returns for default-export server components

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
async function ProductSection({ product }) {
  return <section>{product.name}</section>;
}
export default async function ProductPage({ product }) {
  return <>
    <ProductSection .product={product} />
    <footer>done</footer>
  </>;
}
```

#### Generated Error

```txt
Unexpected token, expected "," (2:26)
```

### Keeps nested server-component projection inside Lit component light-dom children

#### Interpretation

This case highlights syntax that should survive the transform unchanged or be preserved semantically.

#### Authored Input

```jsx
import ProductCard from './ProductCard.js';
import ProductActions from './ProductActions.js';
export default async function ProductPage({ product }) {
  return <ProductCard .product={product}><ProductActions .product={product} /></ProductCard>;
}
```

#### Generated Error

```txt
Unexpected token, expected "," (4:22)
```

### Lowers an async server component's forwarded ref parameter to a Lit property binding

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import ContextBar from './ContextBar.js';
export default async function Page({ params }, ref) {
  return <ContextBar ref={ref} .params={params} />;
}
```

#### Generated Error

```txt
Unexpected token, expected "," (3:21)
```

### Keeps a layout's children.ref as an SSR composition binding

#### Interpretation

This case highlights syntax that should survive the transform unchanged or be preserved semantically.

#### Authored Input

```jsx
export default async function Layout({ children }) {
  return <vds-navbar-top .contextRef={children.ref}>{children}</vds-navbar-top>;
}
```

#### Generated Error

```txt
Unexpected token, expected "," (2:13)
```

### Injects SSR light DOM rendering for authored light DOM components

#### Interpretation

This case documents code that is synthesized by the transform, not written directly by the user.

#### Authored Input

```jsx
export function LightChild() {
  return <span>child</span>;
}
LightChild.lightDom = true;
export function TestParent() {
  return <LightChild />;
}
```

#### Generated Error

```txt
Unterminated regular expression. (2:22)
```

### Injects SSR light DOM rendering for imported authored light DOM components

#### Interpretation

This case documents code that is synthesized by the transform, not written directly by the user.

#### Authored Input

```jsx
import { LightChild } from "./LightChild.tsx";
export function TestParent() {
  return <LightChild />;
}
```

#### Generated Error

```txt
Unexpected token, expected "," (3:21)
```

### Injects SSR light DOM rendering for core suspense boundaries

#### Interpretation

This case documents code that is synthesized by the transform, not written directly by the user.

#### Authored Input

```jsx
import { SuspenseBoundary } from "@litsx/core";
export function TestParent() {
  return <SuspenseBoundary fallback={<span>loading</span>}><article>ready</article></SuspenseBoundary>;
}
```

#### Generated Error

```txt
Unexpected token, expected "," (3:27)
```

### Does not lower React-only wrappers in the native preset

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { forwardRef, memo } from 'react';
export const TestCard = memo(
  forwardRef(function TestCard({ title }, ref) {
    return <label ref={ref}>{title}</label>;
  })
);
```

#### Generated Error

```txt
Unexpected token, expected "," (4:18)
```

### Does not lower React propTypes in the native preset anymore

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import PropTypes from 'prop-types';
export function TestCard(props) {
  return <article>{props.title}</article>;
}
TestCard.propTypes = {
  title: PropTypes.string,
};
```

#### Generated Error

```txt
Unexpected token, expected "," (3:24)
```

### Covers a combined native preset path with standard metadata, handlers, refs, and scoped elements

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import FancyButton from './FancyButton.js';
import { css, useRef, useState } from '@litsx/core';
type Props = { label: string; active: boolean };
export function ActionCard({ label, active }: Props) {
  const buttonRef = useRef(null);
  const [count, setCount] = useState(0);
  return <FancyButton ref={buttonRef} label={label} on:click={() => setCount(count + 1)}>{active ? count : 0}</FancyButton>;
}
ActionCard.styles = css`:host { display: block; }`;
ActionCard.properties = { active: { reflect: true } };
```

#### Generated Error

```txt
Unexpected token, expected "," (7:22)
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

      function TestCard(props: CardProps) {
        return <article>{props.title}</article>;
      }
```

#### Generated Error

```txt
Unexpected token, expected "," (12:30)
```

### Lowers native useState through the canonical preset

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { useState } from '@litsx/core';
export function TestCounter() {
  const [count, setCount] = useState(1);
  return <button @click={() => setCount(count + 1)}>{count}</button>;
}
```

#### Generated Error

```txt
Unexpected token, expected "," (4:17)
```

### Preserves sibling declarators around native useState through the preset

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { useState } from '@litsx/core';
export function TestCounter() {
  const label = 'ok', [count, setCount] = useState(0);
  setCount(count + 1);
  return <div>{label}: {count}</div>;
}
```

#### Generated Error

```txt
Missing semicolon. (5:21)
```

### Preserves local custom hook signatures that call native useState

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { useState } from '@litsx/core';
function useCounter(initial) {
  const [value, setValue] = useState(initial);
  return [value, setValue];
}
export function TestCounter() {
  const [value, setValue] = useCounter(0);
  return <button @click={() => setValue(value + 1)}>{value}</button>;
}
```

#### Generated Error

```txt
Unexpected token, expected "," (8:17)
```

### Runs native effect hooks inside the generated render boundary

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { useAfterUpdate } from '@litsx/core';
export function TestCounter() {
  useAfterUpdate(() => {
    this.flag = true;
  }, []);
  return <p>{this.flag}</p>;
}
```

#### Generated Error

```txt
Unexpected keyword 'this'. (6:13)
```

### Preserves native custom hook signatures in the preset

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
export function TestCounter() {
  const value = useCustom(this.flag);
  return <button>{String(value && value())}</button>;
}
```

#### Generated Error

```txt
Unexpected token, expected "," (9:31)
```

### Resolves native useEmit from the render context

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { useEmit } from '@litsx/core';
export function TestCounter() {
  const emit = useEmit();
  emit('change', this.value, { cancelable: true });
  return <div>{this.value}</div>;
}
```

#### Generated Error

```txt
Unexpected keyword 'this'. (5:15)
```

### Discovers events through aliased and namespace useEmit imports

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { useEmit as createEmitter } from '@litsx/core';
import * as core from '@litsx/core';
export function TestAliased() {
  const emit = createEmitter();
  emit('primary-action');
  return <button />;
}
export function TestNamespaced() {
  const emit = core.useEmit();
  emit('url-change');
  return <button />;
}
```

#### Generated Error

```txt
Unexpected token, expected "," (6:17)
```

### Preserves explicit public event metadata as the component contract

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { useEmit } from '@litsx/core';
export function TestCounter() {
  const emit = useEmit();
  emit(this.eventName);
  return <button />;
}
TestCounter.events = { events: ['primary-action'], complete: true };
```

#### Generated Error

```txt
Unexpected token, expected "," (5:17)
```

### Lowers native useRef DOM bindings through the canonical preset

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { useRef } from '@litsx/core';
export function TestCounter() {
  const buttonRef = useRef(null);
  return <button ref={buttonRef}>Click</button>;
}
```

#### Generated Error

```txt
Unexpected token, expected "," (4:17)
```

### Keeps non-DOM native useRef bindings as mutable refs through the preset

#### Interpretation

This case highlights syntax that should survive the transform unchanged or be preserved semantically.

#### Authored Input

```jsx
import { useRef } from '@litsx/core';
export function TestCounter() {
  const workerRef = useRef(null);
  workerRef.value = 'ok';
  return <div>{workerRef.value}</div>;
}
```

#### Generated Error

```txt
Unexpected token, expected "," (5:24)
```

### Does not follow external playground imports when using in-memory mode

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import type { CardProps } from './types';
function TestCard({ title, active }: CardProps) {
  return <article>{title} {active ? 'on' : 'off'}</article>;
}
```

#### Generated Error

```txt
Missing semicolon. (3:25)
```
