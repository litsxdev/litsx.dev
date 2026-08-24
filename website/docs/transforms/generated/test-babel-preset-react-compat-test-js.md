# @litsx/babel-preset-react-compat

Source: `test/babel-preset-react-compat.test.js`

Generated from transform tests.

## Pipeline

- `@litsx/babel-preset-react-compat`

## Covered Cases

### Lowers React createRef and namespace createRef to Lit-backed facades

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import React, { createRef as makeRef } from "react";
      const first = makeRef();
      const second = React.createRef();
      export function RefPair() {
        return <><input ref={first} /><button ref={second} /></>;
      }
```

#### Generated Error

```txt
Type parameter list cannot be empty. (5:15)
```

### Transforms a component using propTypes, useRef, and JSX

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

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
```

#### Generated Error

```txt
Unexpected token, expected "</>/<=/>=" (14:25)
```

### Normalizes React DOM and form semantics

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
export const FilterForm = ({ query, enabled, onQueryChange, onEnabledChange }) => {
        return (
          <label htmlFor="search">
            Search
            <input id="search" value={query} onChange={onQueryChange} />
            <input type="checkbox" checked={enabled} onChange={onEnabledChange} />
          </label>
        );
      };
```

#### Generated Error

```txt
Unexpected token, expected "," (3:17)
```

### Keeps onX component props distinct from React DOM events

#### Interpretation

This case highlights syntax that should survive the transform unchanged or be preserved semantically.

#### Authored Input

```jsx
const TestChild = ({ onAction }) => <button onClick={onAction}>Run</button>;
      export const TestParent = ({ onAction }) => <TestChild onAction={onAction} />;
```

#### Generated Error

```txt
Unexpected token, expected "," (1:44)
```

### Lowers JSX spreads with surrounding React props in source order

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
export const TestAction = ({ props, active, onClick }) => (
        <button {...props} className="action" disabled={active} onClick={onClick} />
      );
```

#### Generated Error

```txt
Unexpected token, expected "," (2:16)
```

### Lowers keyed React map expressions through Lit repeat

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
const TestRow = ({ item }) => <li>{item.label}</li>;
      export const TestList = ({ items }) => (
        <ul>{items.map((item, index) => <TestRow key={item.id} item={item} index={index} />)}</ul>
      );
```

#### Generated Error

```txt
Unexpected token, expected "," (1:39)
```

### Lowers standalone React keys through Lit keyed and can disable key compatibility

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
const TestPanel = ({ label }) => <section>{label}</section>;
      export const TestScreen = ({ selectedId, label }) => (
        <main><TestPanel key={selectedId} label={label} /></main>
      );
```

#### Generated Error

```txt
Unterminated regular expression. (1:51)
```

### Keeps typed object rest bindings in a compact reactive bag

#### Interpretation

This case highlights syntax that should survive the transform unchanged or be preserved semantically.

#### Authored Input

```jsx
export function TestAction(
        { disabled, ...props }: { disabled: boolean; title?: string }
      ) {
        return <button {...props} disabled={disabled} />;
      }
```

#### Generated Error

```txt
Unexpected token, expected "," (4:23)
```

### Routes explicit callsite props into a local component rest bag

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
function TestAction({ disabled, ...props }) {
        return <button {...props} disabled={disabled} />;
      }

      export function TestApp() {
        return <TestAction disabled aria-label="Save" data-track="primary" />;
      }
```

#### Generated Error

```txt
Unexpected token, expected "," (2:23)
```

### Quotes hyphenated typed component properties

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

- No inline source fixture extracted for this case.

### Preserves TypeScript type/value namespaces during component lowering

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

- No inline source fixture extracted for this case.

### Rejects declaration-only hooks from external packages

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { useTheme } from "theme-lib";
        export function ThemeLabel() {
          const { theme } = useTheme();
          return <span>{theme}</span>;
        }
```

#### Generated Error

```txt
Unterminated regular expression. (4:32)
```

### Accepts external hooks carrying LitSX compilation metadata

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { useTheme } from "theme-lib";
        export function ThemeLabel() {
          const theme = useTheme();
          return <span>{theme}</span>;
        }
```

#### Generated Error

```txt
Unterminated regular expression. (4:32)
```

### Rejects uncompiled external React hooks even when their source is available

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { useTheme } from "theme-lib";
        export function ThemeLabel() {
          const theme = useTheme();
          return <span>{theme}</span>;
        }
```

#### Generated Error

```txt
Unterminated regular expression. (4:32)
```

### Transforms allowlisted external custom hooks through their React hook graph

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Hook Source

```jsx
import { useResizeEffect } from "./resize-effect.js";
        const a = (listener) => {
          useResizeEffect(listener);
        };
        export { a as useWindowResize };
```

#### Generated Error

```txt
unknown file: Unable to resolve imported custom hook "useResizeEffect" from "./resize-effect.js". LitSX must resolve imported custom hooks to determine whether they require the LitSX render runtime.
  1 | import { useResizeEffect } from "./resize-effect.js";
  2 |         const a = (listener) => {
> 3 |           useResizeEffect(listener);
    |           ^^^^^^^^^^^^^^^
  4 |         };
  5 |         export { a as useWindowResize };
```

#### Inner Hook Source

```jsx
import { useEffect } from "react";
        export function useResizeEffect(listener) {
          useEffect(() => {
            window.addEventListener("resize", listener);
            return () => window.removeEventListener("resize", listener);
          }, [listener]);
        }
```

#### Generated Output

```js
import { useAfterUpdate, ErrorBoundary } from "@litsx/core";
export function useResizeEffect(listener) {
  useAfterUpdate(() => {
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [listener]);
}
useResizeEffect[Symbol.for("litsx.hook")] = true;
```

#### Consumer Source

```jsx
import { useWindowResize } from "resize-hooks";
        export function ResizePanel() {
          useWindowResize(() => {});
          return <section>Ready</section>;
        }
```

#### Generated Error

```txt
Unterminated regular expression. (4:33)
```

### Reports the unsupported React hook where dependency transformation stops

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { useInsertionEffect } from "react";
      export function useCssRuntime() {
        useInsertionEffect(() => {}, []);
      }
```

#### Generated Error

```txt
unknown file: Cannot transform React hook "useInsertionEffect" from "react" because react-compat has no LitSX equivalent. The dependency transformation stopped at this hook boundary.
> 1 | import { useInsertionEffect } from "react";
    |          ^^^^^^^^^^^^^^^^^^
  2 |       export function useCssRuntime() {
  3 |         useInsertionEffect(() => {}, []);
  4 |       }
```

### Reports private React internals as dependency transformation boundaries

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import React from "react";
      export function useDispatcherOwner() {
        return React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
      }
```

#### Generated Error

```txt
unknown file: Cannot transform access to React internal "__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE". The dependency transformation stopped at a private React runtime boundary.
  1 | import React from "react";
  2 |       export function useDispatcherOwner() {
> 3 |         return React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    |                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  4 |       }
```

### Normalizes static React.createElement calls before component lowering

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

- No inline source fixture extracted for this case.

### Recovers component hosts for hooks inside createElement-authored components

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

- No inline source fixture extracted for this case.

### Recovers namespace hooks in bundled internal createElement components

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

- No inline source fixture extracted for this case.

### Recognizes effect-only components that render null

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

- No inline source fixture extracted for this case.

### Recognizes internal components exported by a trailing specifier

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

- No inline source fixture extracted for this case.

### Expands statically bounded polymorphic component aliases

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

- No inline source fixture extracted for this case.

### Treats hooks from allowlisted ESM dependency exports as runtime hooks

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { useTheme } from "next-themes";
        export function ThemeLabel() {
          const theme = useTheme();
          return <span>{theme}</span>;
        }
```

#### Generated Error

```txt
Unterminated regular expression. (4:32)
```

### Normalizes jsx-runtime calls, fragments, keys, and nested children

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

- No inline source fixture extracted for this case.

### Normalizes named jsxDEV calls with referenced props

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

- No inline source fixture extracted for this case.

### Rejects dynamic createElement types, cloneElement, and portals

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

- No inline source fixture extracted for this case.

### Preserves React event alias behavior for focus, blur, and double click

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
export const AliasedEvents = ({ onFocus, onBlur, onDoubleClick }) => {
        return (
          <section>
            <input onFocus={onFocus} onBlur={onBlur} />
            <button onDoubleClick={onDoubleClick}>Open</button>
          </section>
        );
      };
```

#### Generated Error

```txt
Unexpected token, expected "</>/<=/>=" (4:19)
```

### Can stop before final template lowering when jsxTemplate is disabled

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
export const FilterForm = ({ query, onQueryChange }) => {
        return <input value={query} onChange={onQueryChange} />;
      };
```

#### Generated Error

```txt
Unexpected token, expected "," (2:22)
```

### Applies event aliases before final template lowering is skipped

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
export const AliasedEvents = ({ onFocus, onBlur, onDoubleClick }) => {
        return (
          <section>
            <input onFocus={onFocus} onBlur={onBlur} />
            <button onDoubleClick={onDoubleClick}>Open</button>
          </section>
        );
      };
```

#### Generated Error

```txt
Unexpected token, expected "</>/<=/>=" (4:19)
```

### Lowers createContext, Provider, and useContext through the compat preset

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import React, { createContext, useContext } from "react";

      const ThemeContext = createContext("light");

      export function TestToolbar() {
        const theme = useContext(ThemeContext);
        return <button className={theme}>{theme}</button>;
      }

      export function TestApp() {
        return (
          <ThemeContext.Provider value="dark">
            <TestToolbar />
          </ThemeContext.Provider>
        );
      }
```

#### Generated Error

```txt
Unexpected token, expected "," (7:23)
```

### Lowers Context.Consumer and preserves context helpers before final template lowering

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { createContext } from "react";

      const ThemeContext = createContext("light");

      export function TestApp() {
        return (
          <ThemeContext.Provider value="dark">
            <ThemeContext.Consumer>
              {(theme) => <span className={theme}>{theme}</span>}
            </ThemeContext.Consumer>
          </ThemeContext.Provider>
        );
      }
```

#### Generated Error

```txt
Unexpected token, expected "," (7:23)
```

### Preserves local custom hooks that call useContext

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { createContext, useContext } from "react";

      const ThemeContext = createContext("light");

      function useThemeLabel(prefix) {
        const theme = useContext(ThemeContext);
        return prefix + ":" + theme;
      }

      export function TestToolbar() {
        const label = useThemeLabel("theme");
        return <span>{label}</span>;
      }
```

#### Generated Error

```txt
Unterminated regular expression. (12:30)
```

### Lowers memo and forwardRef together through the preset

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import React, { forwardRef, memo } from "react";

      export const CardShell = memo(
        forwardRef(function CardShell({ title }, ref) {
          return <label ref={ref}>{title}</label>;
        })
      );
```

#### Generated Error

```txt
Unexpected token, expected "," (5:24)
```

### Uses contextual scoped elements in default light DOM react-compat output

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import FancyButton from './FancyButton.js';

      export const LightForm = ({ label }) => {
        return (
          <section>
            <FancyButton .label={label} />
          </section>
        );
      };
```

#### Generated Error

```txt
Unexpected token, expected "</>/<=/>=" (6:31)
```

### Rewrites ErrorBoundary and Suspense together to final Lit output

#### Interpretation

This case shows the authored JSX/API surface and the normalized output produced by the compatibility transform.

#### Authored Input

```jsx
import { ErrorBoundary } from "react-error-boundary";
      import { Suspense, lazy } from "react";

      const ResultsPanel = lazy(() => import("./ResultsPanel.js"));

      export function SearchCard() {
        return (
          <ErrorBoundary fallback={<p>Oops</p>}>
            <Suspense fallback={<p>Loading</p>}>
              <ResultsPanel value="ready" />
            </Suspense>
          </ErrorBoundary>
        );
      }
```

#### Generated Error

```txt
Unexpected token, expected "," (8:25)
```

### Drops React imports when fully lowered but preserves them when still referenced

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Fully Lowered Source

```jsx
import { useState } from "react";

      export function TestCounter() {
        const [count, setCount] = useState(0);
        return <button onClick={() => setCount(count + 1)}>{count}</button>;
      }
```

#### Generated Error

```txt
Unexpected token, expected "," (5:23)
```

#### Preserved Import Source

```jsx
import React, { useState } from "react";

      export function TestCounter() {
        const [count, setCount] = useState(0);
        return <button title={React.version} onClick={() => setCount(count + 1)}>{count}</button>;
      }
```

#### Generated Error

```txt
Unexpected token, expected "," (5:23)
```

### Errors on unsupported class contextType

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import React, { createContext } from "react";

      const ThemeContext = createContext("light");

      export class LegacyPanel extends React.Component {
        static contextType = ThemeContext;

        render() {
          return <div>{this.context}</div>;
        }
      }
```

#### Generated Error

```txt
Unexpected keyword 'this'. (9:23)
```

### Errors when Context.Consumer does not receive exactly one function child

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { createContext } from "react";

      const ThemeContext = createContext("light");

      export function BrokenConsumer() {
        return (
          <ThemeContext.Consumer>
            <span>broken</span>
          </ThemeContext.Consumer>
        );
      }
```

#### Generated Error

```txt
Unexpected token, expected "," (7:23)
```

### Preserves named-imported Context Provider and Consumer semantics before namespace element lowering

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { ThemeContext } from "./theme-context.js";

      export function ContextPanel({ theme }) {
        return (
          <ThemeContext.Provider value={theme}>
            <ThemeContext.Consumer>{value => <span>{value}</span>}</ThemeContext.Consumer>
          </ThemeContext.Provider>
        );
      }
```

#### Generated Error

```txt
Unexpected token, expected "," (5:23)
```

### Errors on truly undeclared PascalCase JSX

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
export function BrokenPanel() {
        return <MissingThing />;
      }
```

#### Generated Error

```txt
Unexpected token, expected "," (2:29)
```
