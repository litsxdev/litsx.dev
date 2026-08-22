# @litsx/babel-preset-react-compat suspense boundaries

Source: `test/babel-preset-react-compat-suspense.test.js`

Generated from transform tests.

## Pipeline

- `@litsx/babel-preset-react-compat`

## Covered Cases

### Rewrites Suspense to a suspense-boundary utility component

#### Interpretation

This case shows the authored JSX/API surface and the normalized output produced by the compatibility transform.

#### Authored Input

```jsx
import { Suspense } from 'react';

export const Screen = () => {
  return (
    <Suspense fallback={<span>loading</span>}>
      <div>ready</div>
    </Suspense>
  );
};
```

#### Generated Error

```txt
Unexpected token, expected "," (5:14)
```

### Rewrites SuspenseList to a suspense-list utility component

#### Interpretation

This case shows the authored JSX/API surface and the normalized output produced by the compatibility transform.

#### Authored Input

```jsx
import React, { Suspense, SuspenseList } from 'react';

export const Screen = () => {
  return (
    <SuspenseList revealOrder='forwards'>
      <Suspense fallback={<span>One</span>}>
        <div>alpha</div>
      </Suspense>
      <Suspense fallback={<span>Two</span>}>
        <div>beta</div>
      </Suspense>
    </SuspenseList>
  );
};
```

#### Generated Error

```txt
Unexpected token, expected "," (5:18)
```

### Keeps lazy registration inside the content renderer of suspense-boundary

#### Interpretation

This case highlights syntax that should survive the transform unchanged or be preserved semantically.

#### Authored Input

```jsx
import { lazy, Suspense } from 'react';

const FancyButton = lazy(() => import('./FancyButton.js'));

export const Screen = () => {
  return (
    <Suspense fallback={<span>loading</span>}>
      <FancyButton />
    </Suspense>
  );
};
```

#### Generated Error

```txt
Unexpected token, expected "," (7:14)
```

### Keeps each lazy registration inside its own suspense-boundary when using SuspenseList

#### Interpretation

This case highlights syntax that should survive the transform unchanged or be preserved semantically.

#### Authored Input

```jsx
import { lazy, Suspense, SuspenseList } from 'react';

const AlphaPanel = lazy(() => import('./AlphaPanel.js'));
const BetaPanel = lazy(() => import('./BetaPanel.js'));

export const Screen = () => {
  return (
    <SuspenseList revealOrder='forwards'>
      <Suspense fallback={<span>One</span>}>
        <AlphaPanel />
      </Suspense>
      <Suspense fallback={<span>Two</span>}>
        <BetaPanel />
      </Suspense>
    </SuspenseList>
  );
};
```

#### Generated Error

```txt
Unexpected token, expected "," (8:18)
```

### Handles namespace React.Suspense and React.SuspenseList forms

#### Interpretation

This case captures supported authored syntax and the emitted code path used to preserve that behavior.

#### Authored Input

```jsx
import * as React from 'react';

export const Screen = () => {
  return (
    <React.SuspenseList revealOrder='forwards'>
      <React.Suspense fallback={<span>loading</span>}>
        <div>ready</div>
      </React.Suspense>
    </React.SuspenseList>
  );
};
```

#### Generated Error

```txt
Unexpected token, expected "," (5:10)
```

### Keeps native @litsx/core SuspenseList props as property bindings in react-compat

#### Interpretation

This case highlights syntax that should survive the transform unchanged or be preserved semantically.

- No inline source fixture extracted for this case.

### Emits null renderers when suspense has no fallback or content

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { Suspense } from 'react';

export const Screen = () => {
  return <Suspense />;
};
```

#### Generated Error

```txt
Unexpected token, expected "," (4:19)
```

### Preserves fragment children inside the suspense content renderer

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { Suspense } from 'react';

export const Screen = () => {
  return (
    <Suspense fallback={<span>loading</span>}>
      <>
        <div>alpha</div>
        <div>beta</div>
      </>
    </Suspense>
  );
};
```

#### Generated Error

```txt
Unexpected token, expected "," (5:14)
```

### Supports boolean fallbacks and single expression children

#### Interpretation

This case captures supported authored syntax and the emitted code path used to preserve that behavior.

#### Authored Input

```jsx
import { Suspense as Wait } from 'react';

export const Screen = ({ readyView }) => {
  return <Wait fallback>{readyView}</Wait>;
};
```

#### Generated Error

```txt
Unexpected token, expected "," (4:15)
```

### Supports string fallbacks and plain text children

#### Interpretation

This case captures supported authored syntax and the emitted code path used to preserve that behavior.

#### Authored Input

```jsx
import { Suspense } from 'react';

export const Screen = () => {
  return <Suspense fallback="loading">ready</Suspense>;
};
```

#### Generated Error

```txt
Unexpected token, expected "," (4:19)
```

### Treats empty fallback expressions as boolean true instead of crashing

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { Suspense } from 'react';

export const Screen = () => {
  return <Suspense fallback={true}><div>ready</div></Suspense>;
};
```

#### Generated Error

```txt
Unexpected token, expected "," (4:19)
```

### Registers non-React namespace suspense components without treating them as boundaries

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import * as UI from 'ui-kit';

export const Screen = () => {
  return <UI.Suspense fallback="loading"><div>ready</div></UI.Suspense>;
};
```

#### Generated Error

```txt
Unexpected token, expected "," (4:12)
```

### Drops key attributes from suspense lists imported under aliases

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { Suspense as Wait, SuspenseList as Queue } from 'react';

export const Screen = () => {
  return (
    <Queue key="outer" revealOrder="forwards">
      <Wait fallback={<span>One</span>}>
        <div>alpha</div>
      </Wait>
    </Queue>
  );
};
```

#### Generated Error

```txt
Unexpected token, expected "," (5:11)
```

### Renders numeric fallbacks and null content when suspense children are empty comments

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { Suspense } from 'react';

export const Screen = () => {
  return <Suspense fallback={404}>{/* empty */}</Suspense>;
};
```

#### Generated Error

```txt
Unexpected token, expected "," (4:19)
```

### Does not move manual ensureLazyElement calls into suspense content renderers

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { ensureLazyElement } from '@litsx/core';
import { Suspense } from 'react';

const AlphaPanel = () => null;
const BetaPanel = () => null;

export const Screen = () => {
  ensureLazyElement(this, 'alpha-panel', AlphaPanel);
  ensureLazyElement(this, 'beta-panel', BetaPanel);
  return (
    <section>
      <Suspense fallback={<span>loading</span>}>
        <alpha-panel />
      </Suspense>
    </section>
  );
};
```

#### Generated Error

```txt
Unexpected token, expected "</>/<=/>=" (12:16)
```

### Does not introduce boundary-key or list-key attributes in the component model

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { Suspense, SuspenseList } from 'react';

export const Screen = () => {
  return (
    <SuspenseList revealOrder='forwards'>
      <Suspense fallback={<span>One</span>}>
        <div>alpha</div>
      </Suspense>
    </SuspenseList>
  );
};
```

#### Generated Error

```txt
Unexpected token, expected "," (5:18)
```

### Uses light-dom utility components rather than runtime helper functions

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { Suspense } from 'react';

export const Screen = () => {
  return (
    <Suspense fallback={<span>loading</span>}>
      <div>ready</div>
    </Suspense>
  );
};
```

#### Generated Error

```txt
Unexpected token, expected "," (5:14)
```

### Emits final html output after lowering Suspense before the template pass

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { Suspense } from 'react';

export const Screen = () => {
  return (
    <Suspense fallback={<span>loading</span>}>
      <div>ready</div>
    </Suspense>
  );
};
```

#### Generated Error

```txt
Unexpected token, expected "," (5:14)
```

### Lowers nested error and suspense structures through multiple recursion levels

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { ErrorBoundary } from 'react-error-boundary';
import { lazy, Suspense, SuspenseList } from 'react';

const AlphaPanel = lazy(() => import('./AlphaPanel.js'));

export const Screen = () => {
  return (
    <ErrorBoundary fallback={<p>outer-fallback</p>}>
      <section>
        <SuspenseList revealOrder='forwards'>
          <Suspense fallback={<span>alpha-loading</span>}>
            <AlphaPanel />
          </Suspense>
          <Suspense fallback={<span>beta-loading</span>}>
            <article><strong>beta-ready</strong></article>
          </Suspense>
        </SuspenseList>
      </section>
    </ErrorBoundary>
  );
};
```

#### Generated Error

```txt
Unexpected token, expected "," (8:19)
```
