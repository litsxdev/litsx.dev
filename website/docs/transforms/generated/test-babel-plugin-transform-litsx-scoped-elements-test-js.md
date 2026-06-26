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

#### Generated Output

```js
import { ShadowDomMixin } from "@litsx/core/elements";
import { LitElement, html } from 'lit';
import FancyButton from './FancyButton.js';
class MyElement extends ShadowDomMixin(LitElement) {
  render() {
    return <fancy-button>Click me</fancy-button>;
  }
  static elements = {
    "fancy-button": FancyButton
  };
}
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

      export const Alert = (message) => {
        const lower = message.toLowerCase();
        return <p>{lower}</p>;
      };
```

#### Generated Output

```js
import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import FancyButton from './FancyButton.js';
const FancyForm = props => {
  const buttonRef = useRef(null);
  useEffect(() => {
    buttonRef.current.focus();
  }, []);
  return <div>
            <FancyButton ref={buttonRef} .label={props.label} />
          </div>;
};
FancyForm.propTypes = {
  label: PropTypes.string
};
export const Alert = message => {
  const lower = message.toLowerCase();
  return <p>{lower}</p>;
};
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

#### Generated Output

```js
import * as VdsIcon from './icons.js';
const MyComponent = (VdsIcon as any).VdsIcon;
function IconButton() {
  return <MyComponent size="sm" />;
}
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

#### Generated Output

```js
import { ShadowDomMixin } from "@litsx/core/elements";
import { LitElement, html } from 'lit';
import FancyButton from './FancyButton.js';
class WithProperties extends ShadowDomMixin(LitElement) {
  static properties = {
    label: {
      type: String
    }
  };
  static elements = {
    "fancy-button": FancyButton
  };
  render() {
    return <fancy-button label={this.label} />;
  }
}
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

### Uses LightDomMixin for light DOM dependencies

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import FancyButton from './FancyButton.js';

      function LightScreen() {
        static lightDom = true;
        return <FancyButton />;
      }
```

#### Generated Output

```js
import FancyButton from './FancyButton.js';
function LightScreen() {
  __litsx_static_lightDom(true);
  return <FancyButton />;
}
```

### Uses LightDomMixin for light DOM components without element dependencies

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
function LightCard() {
        static lightDom = true;
        return <div>ready</div>;
      }
```

#### Generated Output

```js
function LightCard() {
  __litsx_static_lightDom(true);
  return <div>ready</div>;
}
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

#### Generated Output

```js
import { LitElement } from 'lit';
import { ShadowDomMixin } from '@litsx/core/elements';
import FancyButton from './FancyButton.js';
class ReadyElement extends ShadowDomMixin(LitElement) {
  render() {
    return <fancy-button />;
  }
  static elements = {
    "fancy-button": FancyButton
  };
}
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

#### Generated Output

```js
import { ShadowDomMixin } from "@litsx/core/elements";
import FancyButton from './FancyButton.js';
class MixedElement extends ShadowDomMixin(withTheme(LitElement)) {
  render() {
    return <fancy-button></fancy-button>;
  }
  static elements = {
    "fancy-button": FancyButton
  };
}
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

#### Generated Output

```js
import { ShadowDomMixin } from '@litsx/core/elements';
import FancyButton from './FancyButton.js';
class MixedElement extends withTheme(ShadowDomMixin(LitElement)) {
  render() {
    return <fancy-button />;
  }
  static elements = {
    "fancy-button": FancyButton
  };
}
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

      MixedLightCard._litsxLightDom = true;
```

#### Generated Output

```js
import { LightDomMixin } from '@litsx/core/elements';
class MixedLightCard extends withTheme(LightDomMixin(LitElement)) {
  render() {
    return <div>ready</div>;
  }
}
MixedLightCard._litsxLightDom = true;
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

#### Generated Output

```js
import { ShadowDomMixin } from "@litsx/core/elements";
import { LitElement } from 'lit';
import FancyButton from './FancyButton.js';
class AttributedElement extends ShadowDomMixin(LitElement) {
  render() {
    return <fancy-button label={this.label}>Click</fancy-button>;
  }
  static elements = {
    "fancy-button": FancyButton
  };
}
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

#### Generated Output

```js
import { ShadowDomMixin } from "@litsx/core/elements";
import { LitElement } from 'lit';
export class ProfileChip extends LitElement {
  render() {
    return <article>chip</article>;
  }
}
export class ProfileScreen extends ShadowDomMixin(LitElement) {
  render() {
    return <profile-chip />;
  }
  static elements = {
    "profile-chip": ProfileChip
  };
}
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

#### Generated Output

```js
import { ShadowDomMixin } from "@litsx/core/elements";
import { LitElement } from 'lit';
export class TreeNode extends ShadowDomMixin(LitElement) {
  render() {
    return <section>
              <tree-node />
            </section>;
  }
  static elements = {
    "tree-node": TreeNode
  };
}
```

### Emits the same base tag for light DOM components from different sources

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

- No inline source fixture extracted for this case.

### Keeps the same light DOM tag for the same imported constructor source

#### Interpretation

This case highlights syntax that should survive the transform unchanged or be preserved semantically.

#### Authored Input

```jsx
import ProfileChip from './profile/ProfileChip.js';

      export function FirstScreen() {
        static lightDom = true;
        return <ProfileChip />;
      }

      export function SecondScreen() {
        static lightDom = true;
        return <ProfileChip />;
      }
```

#### Generated Output

```js
import ProfileChip from './profile/ProfileChip.js';
export function FirstScreen() {
  __litsx_static_lightDom(true);
  return <ProfileChip />;
}
export function SecondScreen() {
  __litsx_static_lightDom(true);
  return <ProfileChip />;
}
```

### Still rewrites scoped tags when candidates were precomputed by transform-litsx

#### Interpretation

This case shows the authored JSX/API surface and the normalized output produced by the compatibility transform.

#### Authored Input

```jsx
import { SuspenseBoundary } from '@litsx\/core';

      export function Screen() {
        return (
          <section>
            <SuspenseBoundary fallback={<span>loading</span>}>
              <span>ready</span>
            </SuspenseBoundary>
          </section>
        );
      }
```

#### Generated Output

```js
import { SuspenseBoundary } from '@litsx\/core';
export function Screen() {
  return <section>
            <SuspenseBoundary fallback={<span>loading</span>}>
              <span>ready</span>
            </SuspenseBoundary>
          </section>;
}
```

### Rewrites scoped tags nested inside keyed(...) expressions

#### Interpretation

This case shows the authored JSX/API surface and the normalized output produced by the compatibility transform.

#### Authored Input

```jsx
import { keyed } from 'lit/directives/keyed.js';
      import { SuspenseBoundary } from '@litsx\/core';

      export function Screen({ cycle }) {
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

#### Generated Output

```js
import { keyed } from 'lit/directives/keyed.js';
import { SuspenseBoundary } from '@litsx\/core';
export function Screen({
  cycle
}) {
  return <section>
            {keyed(cycle, <SuspenseBoundary fallback={<span>loading</span>}>
                <span>ready</span>
              </SuspenseBoundary>)}
          </section>;
}
```

### Rewrites scoped tags inside nested html templates under keyed(...) expressions

#### Interpretation

This case shows the authored JSX/API surface and the normalized output produced by the compatibility transform.

#### Authored Input

```jsx
import { LitElement, html } from 'lit';
      import { keyed } from 'lit/directives/keyed.js';
      import { SuspenseBoundary, SuspenseList } from '@litsx\/core';

      class Screen extends LitElement {
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
