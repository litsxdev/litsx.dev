# @litsx/babel-plugin-transform-litsx-scoped-elements

Source: `test/babel-plugin-transform-litsx-scoped-elements.test.js`

Generated from transform tests.

## Pipeline

- `@litsx/babel-plugin-transform-litsx-scoped-elements`

## Covered Cases

### Wraps LitElement with ShadowDomMixin and registers tags

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { LitElement, html } from 'lit';
      import FancyButton from './FancyButton.js';

      class MyElement extends LitElement {
        render() {
          return <FancyButton>Click me</FancyButton>;
        }
      }
```

#### Generated Error

```txt
Missing semicolon. (6:35)
```

### Merges detected tags after inherited and before authored elements

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { LitElement } from 'lit';
      import FancyButton from './FancyButton.js';
      class OwnButton extends HTMLElement {}

      class MyElement extends LitElement {
        static elements = { "own-button": OwnButton };
        render() {
          return <FancyButton />;
        }
      }
```

#### Generated Error

```txt
Unexpected token, expected "," (8:30)
```

### Handles React-style function components with useRef

#### Interpretation

This case captures supported authored syntax and the emitted code path used to preserve that behavior.

#### Authored Input

```jsx
import { useRef, useEffect } from 'react';
      import PropTypes from 'prop-types';
      import FancyButton from './FancyButton.js';

      const FancyForm = (props) => {
        const buttonRef = useRef(null);

        useEffect(() => {
          buttonRef.current.focus();
        }, []);

        return (
          <div>
            <FancyButton ref={buttonRef} .label={props.label} />
          </div>
        );
      };

      FancyForm.propTypes = {
        label: PropTypes.string,
      };

      export const TestAlert = (message) => {
        const lower = message.toLowerCase();
        return <p>{lower}</p>;
      };
```

#### Generated Error

```txt
Unexpected token, expected "</>/<=/>=" (14:25)
```

### Detects scoped usage inside html tagged templates

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { LitElement, html } from 'lit';
      import FancyButton from './FancyButton.js';

      class TemplateElement extends LitElement {
        render() {
          return html\`<section><FancyButton></FancyButton></section>\
```

#### Generated Error

```txt
Expecting Unicode escape sequence \uXXXX. (6:22)
```

### Emits symmetric light-DOM boundaries for server and client templates

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { PlainLitContextBridge } from "./matrix-lit-elements.ts";

      export function LightBoundaryParent() {
        return <PlainLitContextBridge />;
      }
```

#### Generated Error

```txt
Unexpected token, expected "," (4:38)
```

### Infers a light-DOM boundary from an independently compiled LitSX class

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { LitElement, html } from "lit";
      import { CompiledLightChild } from "./compiled-light-child.js";

      export class CompiledLightParent extends LitElement {
        static elements = { "compiled-light-child": CompiledLightChild };
        render() {
          return html\`<compiled-light-child></compiled-light-child>\
```

#### Generated Error

```txt
Expecting Unicode escape sequence \uXXXX. (7:22)
```

### Leaves react-compat light-DOM ownership to its compatibility runtime

#### Interpretation

This case highlights syntax that should survive the transform unchanged or be preserved semantically.

#### Authored Input

```jsx
function NestedValue() {
        return <span>value</span>;
      }

      export function CompatRoot() {
        return <NestedValue />;
      }
```

#### Generated Error

```txt
Unterminated regular expression. (2:28)
```

### Registers scoped element aliases created from namespace imports cast as any

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import * as VdsIcon from './icons.js';

      const MyComponent = (VdsIcon as any).VdsIcon;

      function IconButton() {
        return <MyComponent size="sm" />;
      }
```

#### Generated Error

```txt
Unexpected token, expected "," (6:28)
```

### Inserts elements after existing properties

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { LitElement, html } from 'lit';
      import FancyButton from './FancyButton.js';

      class WithProperties extends LitElement {
        static properties = {
          label: { type: String }
        };

        render() {
          return <FancyButton label={this.label} />;
        }
      }
```

#### Generated Error

```txt
Unexpected token, expected "," (10:30)
```

### Leaves classes without scoped usage untouched

#### Interpretation

This case highlights syntax that should survive the transform unchanged or be preserved semantically.

#### Authored Input

```jsx
import { LitElement, html } from 'lit';

      class PlainElement extends LitElement {
        render() {
          return html\`<div>No scoped elements here</div>\
```

#### Generated Error

```txt
Expecting Unicode escape sequence \uXXXX. (5:22)
```

### Registers scoped elements in light DOM components

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import FancyButton from './FancyButton.js';

      function LightScreen() {
        return <FancyButton />;
      }

      LightScreen.lightDom = true;
```

#### Generated Error

```txt
Unexpected token, expected "," (4:28)
```

### Uses LightDomMixin for light DOM components without element dependencies

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
function LightCard() {
        return <div>ready</div>;
      }

      LightCard.lightDom = true;
```

#### Generated Error

```txt
Unterminated regular expression. (2:27)
```

### Reuses an existing ShadowDomMixin import

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { LitElement } from 'lit';
      import { ShadowDomMixin } from '@litsx/core/elements';
      import FancyButton from './FancyButton.js';

      class ReadyElement extends LitElement {
        render() {
          return <FancyButton />;
        }
      }
```

#### Generated Error

```txt
Unexpected token, expected "," (7:30)
```

### Supports classes extending mixins around LitElement

#### Interpretation

This case captures supported authored syntax and the emitted code path used to preserve that behavior.

#### Authored Input

```jsx
import FancyButton from './FancyButton.js';

      class MixedElement extends withTheme(LitElement) {
        render() {
          return <FancyButton></FancyButton>;
        }
      }
```

#### Generated Error

```txt
Unexpected token (5:31)
```

### Does not duplicate ShadowDomMixin when it is nested inside another mixin

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { ShadowDomMixin } from '@litsx/core/elements';
      import FancyButton from './FancyButton.js';

      class MixedElement extends withTheme(ShadowDomMixin(LitElement)) {
        render() {
          return <FancyButton />;
        }
      }
```

#### Generated Error

```txt
Unexpected token, expected "," (6:30)
```

### Does not duplicate LightDomMixin when it is nested inside another mixin

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { LightDomMixin } from '@litsx/core/elements';

      class MixedLightCard extends withTheme(LightDomMixin(LitElement)) {
        render() {
          return <div>ready</div>;
        }
      }
```

#### Generated Error

```txt
Unterminated regular expression. (5:29)
```

### Consumes early static IR for element candidates and light DOM

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { LitElement } from 'lit';
      import { ChildCard } from './child-card.tsx';

      class HostCard extends LitElement {
        render() {
          return <ChildCard />;
        }
      }
```

#### Generated Error

```txt
Unexpected token, expected "," (6:28)
```

### Rewrites JSX opening tags with attributes to kebab-case consistently

#### Interpretation

This case shows the authored JSX/API surface and the normalized output produced by the compatibility transform.

#### Authored Input

```jsx
import { LitElement } from 'lit';
      import FancyButton from './FancyButton.js';

      class AttributedElement extends LitElement {
        render() {
          return <FancyButton label={this.label}>Click</FancyButton>;
        }
      }
```

#### Generated Error

```txt
Unexpected token, expected "," (6:30)
```

### Registers locally defined sibling components used in JSX

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { LitElement } from 'lit';

      export class ProfileChip extends LitElement {
        render() {
          return <article>chip</article>;
        }
      }

      export class ProfileScreen extends LitElement {
        render() {
          return <ProfileChip />;
        }
      }
```

#### Generated Error

```txt
Unterminated regular expression. (5:32)
```

### Registers the current class when it is used recursively as a JSX tag

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { LitElement } from 'lit';

      export class TreeNode extends LitElement {
        render() {
          return (
            <section>
              <TreeNode />
            </section>
          );
        }
      }
```

#### Generated Error

```txt
Unexpected token, expected "</>/<=/>=" (7:24)
```

### Emits the same base tag for light DOM components from different sources

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

- No inline source fixture extracted for this case.

### Supports repeated light DOM components that require scoped elements from the same source

#### Interpretation

This case captures supported authored syntax and the emitted code path used to preserve that behavior.

#### Authored Input

```jsx
import ProfileChip from './profile/ProfileChip.js';

      export function FirstScreen() {
        return <ProfileChip />;
      }

      export function SecondScreen() {
        return <ProfileChip />;
      }

      FirstScreen.lightDom = true;
      SecondScreen.lightDom = true;
```

#### Generated Error

```txt
Unexpected token, expected "," (4:28)
```

### Still rewrites scoped tags when candidates were precomputed by transform-litsx

#### Interpretation

This case shows the authored JSX/API surface and the normalized output produced by the compatibility transform.

#### Authored Input

```jsx
import { SuspenseBoundary } from '@litsx\/core';

      export function TestScreen() {
        return (
          <section>
            <SuspenseBoundary fallback={<span>loading</span>}>
              <span>ready</span>
            </SuspenseBoundary>
          </section>
        );
      }
```

#### Generated Error

```txt
Unexpected token, expected "</>/<=/>=" (6:30)
```

### Rewrites scoped tags nested inside keyed(...) expressions

#### Interpretation

This case shows the authored JSX/API surface and the normalized output produced by the compatibility transform.

#### Authored Input

```jsx
import { keyed } from 'lit/directives/keyed.js';
      import { SuspenseBoundary } from '@litsx\/core';

      export function TestScreen({ cycle }) {
        return (
          <section>
            {keyed(cycle, (
              <SuspenseBoundary fallback={<span>loading</span>}>
                <span>ready</span>
              </SuspenseBoundary>
            ))}
          </section>
        );
      }
```

#### Generated Error

```txt
Unexpected token (7:26)
```

### Rewrites scoped tags inside nested html templates under keyed(...) expressions

#### Interpretation

This case shows the authored JSX/API surface and the normalized output produced by the compatibility transform.

#### Authored Input

```jsx
import { LitElement, html } from 'lit';
      import { keyed } from 'lit/directives/keyed.js';
      import { SuspenseBoundary, SuspenseList } from '@litsx\/core';

      class TestScreen extends LitElement {
        render() {
          return html\`
            <SuspenseList reveal-order="forwards">
              \${keyed(this.cycle, html\`
                <SuspenseBoundary fallback=\${html\`<span>loading</span>\`}>
                  <span>ready</span>
                </SuspenseBoundary>
              \`)}
            </SuspenseList>
          \
```

#### Generated Error

```txt
Expecting Unicode escape sequence \uXXXX. (7:22)
```
