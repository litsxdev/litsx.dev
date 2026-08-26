# @litsx/babel-plugin-transform-jsx-html-template

Source: `test/babel-plugin-transform-jsx-html-template.test.js`

Generated from transform tests.

## Pipeline

- `@litsx/babel-plugin-transform-jsx-html-template`

## Covered Cases

### Emits lit-html templates

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
const view = <button .label={text}>{count}</button>;
```

#### Generated Error

```txt
Unexpected token, expected "," (1:21)
```

### Escapes template syntax in JSX text emitted inside Lit templates

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

- No inline source fixture extracted for this case.

### Lowers native JSX refs to Lit ref directives without DOM markers

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
const inputRef = createRef(); const view = <input ref={inputRef} />;
```

#### Generated Error

```txt
Unexpected token, expected "," (1:50)
```

### Adapts React refs at native, component, and spread boundaries

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
const view = <section>
        <input ref={inputRef} />
        <x-field ref={fieldRef} />
        <button {...props} />
      </section>;
```

#### Generated Error

```txt
Unexpected token, expected "</>/<=/>=" (2:15)
```

### Aliases the generated ref helpers when authoring bindings use their names

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
const ref = "local";
      const toLitRef = "local";
      const view = <input ref={inputRef} />;
```

#### Generated Error

```txt
Unexpected token, expected "," (3:26)
```

### Keeps Lit-style listener attributes intact

#### Interpretation

This case highlights syntax that should survive the transform unchanged or be preserved semantically.

#### Authored Input

```jsx
const view = <button @click={handleClick}></button>;
```

#### Generated Error

```txt
Unexpected token, expected "," (1:21)
```

### Keeps later lit-style attributes aligned in sourcemaps

#### Interpretation

This case highlights syntax that should survive the transform unchanged or be preserved semantically.

#### Authored Input

```jsx
const view = <button @click={save} .value={name} ?disabled={busy}></button>;
```

#### Generated Error

```txt
Unexpected token, expected "," (1:21)
```

### Leaves React-style listener syntax untouched

#### Interpretation

This case highlights syntax that should survive the transform unchanged or be preserved semantically.

#### Authored Input

```jsx
const view = <button onClick={handleClick}></button>;
```

#### Generated Error

```txt
Unexpected token, expected "," (1:21)
```

### Handles nested nodes and boolean attributes

#### Interpretation

This case captures supported authored syntax and the emitted code path used to preserve that behavior.

#### Authored Input

```jsx
const view = (
        <section class="dashboard">
          <button ?disabled={isDisabled} .label={label}>
            {greeting}
            {items.map((item) => (
              <span class="item" key={item.id}>
                <strong>{item.label}</strong>
              </span>
            ))}
          </button>
        </section>
      );
```

#### Generated Error

```txt
Unexpected token, expected "," (2:17)
```

### Renders capitalized components as HTML elements

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
const view = <FancyButton foo="bar" baz={value} />;
```

#### Generated Error

```txt
Unexpected token, expected "," (1:26)
```

### Supports bare boolean attributes without values

#### Interpretation

This case captures supported authored syntax and the emitted code path used to preserve that behavior.

#### Authored Input

```jsx
const view = <button disabled></button>;
```

#### Generated Error

```txt
Unexpected token, expected "," (1:21)
```

### Does not self-close non-void HTML elements

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
const view = <div class="host" />;
```

#### Generated Error

```txt
Unexpected token, expected "," (1:18)
```

### Does not self-close iframe elements

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
const view = <iframe srcdoc={doc} sandbox="allow-scripts" />;
```

#### Generated Error

```txt
Unexpected token, expected "," (1:21)
```

### Keeps opening and closing tags aligned for kebab-case custom elements with attributes

#### Interpretation

This case highlights syntax that should survive the transform unchanged or be preserved semantically.

#### Authored Input

```jsx
const view = (
        <suspense-boundary fallback={<span>loading</span>}>
          <span>ready</span>
        </suspense-boundary>
      );
```

#### Generated Error

```txt
Unexpected token, expected "," (2:17)
```

### Uses the normalized opening name for PascalCase component closing tags

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
const view = (
        <QuartzCard heading="Preset">
          <span>Demo</span>
        </QuartzCard>
      );
```

#### Generated Error

```txt
Unexpected token, expected "," (2:20)
```

### Keeps Lit-style prefixed attributes on kebab-case custom elements

#### Interpretation

This case highlights syntax that should survive the transform unchanged or be preserved semantically.

#### Authored Input

```jsx
const view = (
        <suspense-boundary .content={() => <span>ready</span>} @resolve={handleResolve} ?pending={isPending}>
          <span>fallback</span>
        </suspense-boundary>
      );
```

#### Generated Error

```txt
Unexpected token, expected "," (2:17)
```

### Trims whitespace around text nodes in templates

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
const view = <div>\n      hello\n    </div>;
```

#### Generated Error

```txt
Expecting Unicode escape sequence \uXXXX. (1:19)
```

### Transforms namespaced component tags

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
const view = <x:custom foo={value} />;
```

#### Generated Error

```txt
Unexpected token, expected "," (1:15)
```

### Ignores empty JSX expression containers

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
const view = <div>{}</div>;
```

#### Generated Error

```txt
Unterminated regular expression. (1:22)
```

### Transforms JSX in nested functions

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
const createFactory = () => {
        const render = () => {
          const inline = () => <span>{value}</span>;
          return inline;
        };
        return render();
      };
```

#### Generated Error

```txt
Unterminated regular expression. (3:46)
```

### Lowers spread attributes and surrounding explicit props in source order

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
const x = <div title="before" {...first} id="fixed" disabled={active} {...second} hidden></div>;
```

#### Generated Error

```txt
Unexpected token, expected "," (1:15)
```

### Marks SVG spread namespaces and returns to HTML inside foreignObject

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
const x = <svg><circle {...shape} /><foreignObject><div {...htmlProps} /></foreignObject></svg>;
```

#### Generated Error

```txt
Unexpected token, expected "</>/<=/>=" (1:23)
```

### Uses svg templates for JSX nested in SVG expressions and html inside foreignObject

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
const x = <main>
        <svg viewBox={viewBox}>
          {shapes.map((shape) => <path d={shape.d} />)}
          <foreignObject>{htmlNodes.map((node) => <div>{node.label}</div>)}</foreignObject>
        </svg>
      </main>;
```

#### Generated Error

```txt
Unexpected token, expected "</>/<=/>=" (2:13)
```

### Passes an authored component constructor for spread prop inference

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
const x = <ThirdPartyButton {...props}></ThirdPartyButton>;
```

#### Generated Error

```txt
Unexpected token, expected "," (1:28)
```

### Throws on spread children

#### Interpretation

This case documents an intentionally unsupported construct and the failure mode that callers should expect.

#### Authored Input

```jsx
const x = <div>{...items}</div>;
```

#### Generated Error

```txt
Unterminated regular expression. (1:27)
```

#### Expected Error

```txt
JSXSpreadChild is not supported
```

### Handles fragments without wrapping element

#### Interpretation

This case captures supported authored syntax and the emitted code path used to preserve that behavior.

#### Authored Input

```jsx
const view = <><span>one</span><span>two</span></>;
```

#### Generated Error

```txt
Type parameter list cannot be empty. (1:13)
```

### Creates bare template literals when tag is disabled

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

- No inline source fixture extracted for this case.

### Creates bare template literals when the plugin tag option is empty

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
const view = <div>{label}</div>;
```

#### Generated Error

```txt
Unterminated regular expression. (1:27)
```

### Adds a custom tagged import next to existing lit imports

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { LitElement } from "lit";
const view = <div>{label}</div>;
```

#### Generated Error

```txt
Unterminated regular expression. (2:27)
```

### Does not duplicate an existing custom tagged import from lit

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import { LitElement, svg } from "lit";
const view = <div>{label}</div>;
```

#### Generated Error

```txt
Unterminated regular expression. (2:27)
```

### Adds a separate tagged import when lit is imported as a namespace

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

#### Authored Input

```jsx
import * as lit from "lit";
const view = <div>{label}</div>;
```

#### Generated Error

```txt
Unterminated regular expression. (2:27)
```

### Ignores lit attribute sourcemap metadata whose generated needle is missing

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

- No inline source fixture extracted for this case.

### Creates component calls for namespaced components and spread props

#### Interpretation

This case records the authored input and the generated output as a living transform contract.

- No inline source fixture extracted for this case.
