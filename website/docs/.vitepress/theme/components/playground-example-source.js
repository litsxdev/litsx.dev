export const counterExampleSource = `
import { css, useState, useStyle } from "@litsx/core";

type CounterProps = { title?: string; count?: number };

export function CounterCard({ title = "Counter", count: initial = 3 }: CounterProps) {
  const [count, setCount] = useState(initial);
  const accent = count >= 8 ? "#0f766e" : count >= 4 ? "#b45309" : "#c2410c";
  useStyle("--accent", accent);

  return (
    <article class="card">
      <span class="eyebrow">{title}</span>
      <strong>{count}</strong>
      <button on:click={() => setCount((value) => value + 1)}>Increment</button>
    </article>
  );
}

CounterCard.styles = css\`
  :host { display: block; color: #e5e7eb; font-family: "IBM Plex Sans", "Segoe UI", sans-serif; }
  * { box-sizing: border-box; }
  .card {
    display: grid; gap: .9rem; width: min(100%, 20rem); padding: 1.15rem;
    border: 1px solid rgba(148, 163, 184, .2); border-radius: 1.15rem;
    background: radial-gradient(circle at top right, color-mix(in srgb, var(--accent) 28%, transparent), transparent 46%), linear-gradient(155deg, #111827, #0f172a);
    box-shadow: 0 18px 42px rgba(15, 23, 42, .24);
  }
  .eyebrow { color: #94a3b8; text-transform: uppercase; letter-spacing: .11em; font-size: .72rem; }
  strong { font-size: 2.75rem; line-height: 1; }
  button {
    justify-self: start; border: 0; border-radius: 999px; padding: .62rem 1rem;
    background: var(--accent); color: white; cursor: pointer; font: 700 .9rem/1 system-ui;
    box-shadow: 0 .5rem 1.3rem color-mix(in srgb, var(--accent) 25%, transparent);
  }
\`;
`.trim();

export const propertyInferenceExampleSource = `
import { css } from "@litsx/core";

type ProfileCardProps = {
  title?: string;
  active?: boolean;
  tags?: string[];
  createdAt?: Date;
  onSelect?: (id: string) => void;
};

export function ProfileCard({
  title = "Ada Lovelace",
  active = true,
  tags = ["typed props", "standard TSX"],
  createdAt = new Date("1843-07-01"),
  onSelect = (id) => alert(\`Selected: \${id}\`),
}: ProfileCardProps) {
  return (
    <article class="card" data-active={active}>
      <span>{active ? "Active" : "Idle"}</span>
      <h2>{title}</h2>
      <p>{createdAt.toISOString().slice(0, 10)}</p>
      <p>{tags.join(" · ")}</p>
      <button on:click={() => onSelect(title)}>Select</button>
    </article>
  );
}

ProfileCard.properties = {
  active: { reflect: true },
  tags: { attribute: false },
  createdAt: { attribute: false },
  onSelect: { attribute: false },
};
ProfileCard.styles = css\`
  :host { display: block; color: #e2e8f0; font-family: "IBM Plex Sans", "Segoe UI", sans-serif; }
  * { box-sizing: border-box; }
  .card {
    display: grid; gap: .7rem; width: min(100%, 24rem); padding: 1.1rem;
    border: 1px solid #334155; border-radius: 1.15rem;
    background: radial-gradient(circle at top left, rgba(249, 115, 22, .16), transparent 42%), #0f172a;
    box-shadow: 0 18px 42px rgba(15, 23, 42, .24);
  }
  .card > span { justify-self: start; padding: .28rem .58rem; border-radius: 999px; background: #3f1d12; color: #fdba74; font-size: .76rem; font-weight: 700; }
  .card[data-active="true"] > span { background: #113426; color: #86efac; }
  h2 { margin: .1rem 0; color: white; font-size: 1.35rem; }
  p { margin: 0; color: #94a3b8; line-height: 1.45; }
  button { justify-self: end; padding: .58rem .9rem; border: 0; border-radius: 999px; background: #f97316; color: white; cursor: pointer; font-weight: 700; }
\`;
`.trim();

export const jsxAuthoringExampleSource = `
import { css, useState } from "@litsx/core";

export function MessageComposer() {
  const [count, setCount] = useState(1);
  return (
    <article class="composer">
      <span>Standard TSX → Lit template</span>
      <h2>Compose once. Click {count} times.</h2>
      <button on:click={() => setCount((value) => value + 1)}>Add a layer</button>
    </article>
  );
}

MessageComposer.styles = css\`
  :host { display: block; color: white; font-family: "IBM Plex Sans", "Segoe UI", sans-serif; }
  .composer { width: min(100%, 24rem); padding: 1.25rem; border-radius: 1.15rem; background: radial-gradient(circle at top left, rgba(255,255,255,.12), transparent 42%), linear-gradient(145deg, #111827, #312e81); box-shadow: 0 18px 42px rgba(49, 46, 129, .25); }
  span { color: #c4b5fd; font-size: .72rem; text-transform: uppercase; letter-spacing: .11em; }
  h2 { margin: .55rem 0 1.1rem; line-height: 1.15; font-size: 1.55rem; }
  button { border: 0; border-radius: 999px; padding: .65rem 1rem; background: #fb7185; color: #111827; font-weight: 700; cursor: pointer; box-shadow: 0 .55rem 1.4rem rgba(251,113,133,.24); }
\`;
`.trim();

export const primitivesExampleSource = `
import { css, useMemoValue, usePrevious, useRef, useState } from "@litsx/core";

export function RuntimeCard() {
  const [count, setCount] = useState(2);
  const previous = usePrevious(count, count);
  const doubled = useMemoValue(() => count * 2, [count]);
  const button = useRef<HTMLButtonElement>();
  return (
    <article>
      <p>Previous: {previous} · Current: {count} · Doubled: {doubled}</p>
      <button ref={button} on:click={() => setCount((value) => value + 1)}>Update</button>
    </article>
  );
}
RuntimeCard.styles = css\`
  :host { display: block; color: #e2e8f0; font-family: "IBM Plex Sans", "Segoe UI", sans-serif; }
  article { width: min(100%, 25rem); padding: 1.1rem; border-radius: 1.1rem; background: radial-gradient(circle at top left, rgba(56,189,248,.12), transparent 44%), linear-gradient(160deg, #0f172a, #1e293b); box-shadow: 0 18px 40px rgba(15,23,42,.24); }
  p { margin: 0 0 1rem; padding: .7rem .8rem; border-radius: .85rem; background: rgba(255,255,255,.07); line-height: 1.45; }
  button { border: 0; border-radius: 999px; padding: .58rem .95rem; background: #38bdf8; color: #082f49; cursor: pointer; font-weight: 700; }
\`;
`.trim();

export const controlledStateExampleSource = `
import { css, useControlledState } from "@litsx/core";

type DisclosureProps = { open?: boolean; defaultOpen?: boolean; onChange?: (open: boolean) => void };
export function DisclosurePanel({ open, defaultOpen = false, onChange }: DisclosureProps) {
  const [isOpen, setIsOpen] = useControlledState({ value: open, defaultValue: defaultOpen, onChange });
  return (
    <section>
      <button on:click={() => setIsOpen((value) => !value)}>{isOpen ? "Hide" : "Show"} details</button>
      {isOpen ? <p>The component can be controlled or self-managed.</p> : null}
    </section>
  );
}
DisclosurePanel.styles = css\`
  :host { display: block; color: #e2e8f0; font-family: "IBM Plex Sans", "Segoe UI", sans-serif; }
  section { display: grid; gap: .8rem; width: min(100%, 25rem); padding: 1rem; border: 1px solid #1d4ed8; border-radius: 1rem; background: linear-gradient(155deg, #102033, #0f172a); box-shadow: 0 18px 38px rgba(15,23,42,.22); }
  button { justify-self: start; border: 0; border-radius: 999px; padding: .58rem .92rem; background: #38bdf8; color: #082f49; cursor: pointer; font-weight: 700; }
  p { margin: 0; padding: .85rem .95rem; border: 1px solid #1e3a8a; border-radius: .9rem; background: #0f172a; color: #bfdbfe; line-height: 1.45; }
\`;
`.trim();

export const useAsyncStateExampleSource = `
import { css, useAsyncState } from "@litsx/core";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export function UseAsyncStateDemo() {
  const [count, save, meta] = useAsyncState(0, async (_current, next: number) => {
    await wait(500);
    return next;
  });
  return (
    <article>
      <strong>Saved count: {count}</strong>
      <button disabled={meta.pending} on:click={() => save(count + 1)}>{meta.pending ? "Saving…" : "Save next"}</button>
      <button on:click={() => meta.reset()}>Reset</button>
    </article>
  );
}
UseAsyncStateDemo.styles = css\`
  :host { display: block; color: #e5e7eb; font-family: "IBM Plex Sans", "Segoe UI", sans-serif; }
  article { display: flex; gap: .7rem; align-items: center; flex-wrap: wrap; width: min(100%, 27rem); padding: 1rem; border: 1px solid #1f2937; border-radius: 1rem; background: linear-gradient(155deg, #111827, #0f172a); box-shadow: 0 18px 38px rgba(15,23,42,.22); }
  strong { flex-basis: 100%; padding: .75rem .85rem; border-radius: .8rem; background: rgba(255,255,255,.06); }
  button { padding: .62rem .88rem; border: 0; border-radius: 999px; background: #0f766e; color: white; cursor: pointer; font: 700 .86rem/1 system-ui; }
  button:last-child { background: #334155; }
  button:disabled { cursor: wait; opacity: .6; }
\`;
`.trim();

export const useOptimisticExampleSource = `
import { css, useOptimistic, useState } from "@litsx/core";

export function UseOptimisticDemo() {
  const [todos, setTodos] = useState(["Review 1.0 docs"]);
  const [visible, addOptimistic, reset] = useOptimistic(todos, (items, title: string) => [...items, title]);
  const hasOverlay = visible !== todos;
  return (
    <article>
      <div class="state-grid">
        <section>
          <span>Authoritative</span>
          <ul data-state="authoritative">{todos.map((todo) => <li>{todo}</li>)}</ul>
        </section>
        <section>
          <span>Rendered overlay</span>
          <ul data-state="optimistic">{visible.map((todo) => <li>{todo}</li>)}</ul>
        </section>
      </div>
      <div class="actions">
        <button data-action="add-optimistic" on:click={() => addOptimistic(\`Draft #\${visible.length + 1}\`)}>Add optimistic</button>
        <button on:click={() => setTodos([...todos, \`Server item #\${todos.length + 1}\`])}>Commit server item</button>
        <button data-action="reset-overlay" disabled={!hasOverlay} on:click={() => reset()}>Reset overlay</button>
      </div>
      <p role="status">{hasOverlay ? "Optimistic overlay active" : "No optimistic overlay"}</p>
    </article>
  );
}
UseOptimisticDemo.styles = css\`
  :host { display: block; color: #e5e7eb; font-family: "IBM Plex Sans", "Segoe UI", sans-serif; }
  article { display: grid; gap: .8rem; width: min(100%, 34rem); padding: 1rem; border: 1px solid #4338ca; border-radius: 1rem; background: radial-gradient(circle at top right, rgba(124,58,237,.2), transparent 44%), #111827; box-shadow: 0 18px 40px rgba(49,46,129,.2); }
  .state-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .7rem; }
  section { display: grid; align-content: start; gap: .5rem; padding: .7rem; border: 1px solid rgba(129,140,248,.22); border-radius: .85rem; background: rgba(15,23,42,.7); }
  section > span { color: #c4b5fd; font-size: .7rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
  ul { display: grid; gap: .45rem; margin: 0; padding: 0; list-style: none; }
  li { padding: .68rem .8rem; border: 1px solid #312e81; border-radius: .8rem; background: #0f172a; }
  .actions { display: flex; gap: .55rem; flex-wrap: wrap; }
  button { padding: .58rem .82rem; border: 0; border-radius: 999px; background: #6d28d9; color: #f5f3ff; cursor: pointer; font-weight: 650; }
  button:last-child { background: #334155; }
  button:disabled { cursor: not-allowed; opacity: .45; }
  [role="status"] { margin: 0; color: #cbd5e1; font-size: .8rem; }
  @media (max-width: 34rem) { .state-grid { grid-template-columns: 1fr; } }
\`;
`.trim();

export const errorBoundaryExampleSource = `
import { css, ErrorBoundary, useState } from "@litsx/core";

function renderBrokenPanel() {
  throw new Error("Demo render failed");
  return <p>This branch is intentionally unreachable.</p>;
}
export function BoundaryDemo() {
  const [broken, setBroken] = useState(false);
  return (
    <ErrorBoundary fallback={(error) => <p role="alert">Recovered: {String(error.message ?? error)}</p>}>
      {broken ? renderBrokenPanel() : <button on:click={() => setBroken(true)}>Trigger failure</button>}
    </ErrorBoundary>
  );
}
BoundaryDemo.styles = css\`
  :host { display: block; width: min(100%, 26rem); padding: 1rem; border-radius: 1rem; background: radial-gradient(circle at top left, rgba(251,113,133,.16), transparent 42%), linear-gradient(155deg, #102033, #0f172a); color: #e2e8f0; font-family: "IBM Plex Sans", "Segoe UI", sans-serif; box-shadow: 0 18px 40px rgba(15,23,42,.24); }
  button { border: 0; border-radius: 999px; padding: .62rem .95rem; background: #fb7185; color: white; cursor: pointer; font-weight: 700; }
  [role="alert"] { margin: 0; padding: .9rem 1rem; border-left: 4px solid #fb7185; border-radius: .85rem; background: rgba(251,113,133,.12); color: #fecdd3; }
\`;
`.trim();

export const suspenseExampleSource = `
import { css, SuspenseBoundary, SuspenseList, useRef, useState } from "@litsx/core";

function createProfileResource(name, detail, delay, tone) {
  let status = "pending";
  let value = null;

  const promise = new Promise((resolve) => {
    setTimeout(() => {
      status = "resolved";
      value = { name, detail, tone };
      resolve(value);
    }, delay);
  });

  return {
    read() {
      if (status === "pending") throw promise;
      return value;
    },
  };
}

function createResources() {
  return {
    profile: createProfileResource("Profile", "Account data ready", 1400, "#38bdf8"),
    activity: createProfileResource("Activity", "Recent events ready", 650, "#f97316"),
  };
}

export function AsyncShowcase() {
  const [cycle, setCycle] = useState(0);
  const resources = useRef(null);

  if (resources.value == null || resources.value.cycle !== cycle) {
    resources.value = { cycle, items: createResources() };
  }

  const items = resources.value.items;

  return (
    <section class="card">
      <header>
        <span class="eyebrow">SuspenseList · forwards</span>
        <h2>Coordinated reveal order</h2>
        <p class="intro">Activity resolves first, but waits for the profile ahead of it.</p>
      </header>

      <div class="list">
        <SuspenseList revealOrder="forwards" tail="hidden">
          <SuspenseBoundary fallback={<article class="panel pending">Loading profile…</article>}>
            {(() => {
              const profile = items.profile.read();
              return <article class="panel" style={\`--panel-tone: \${profile.tone}\`}><strong>{profile.name}</strong><span>{profile.detail}</span></article>;
            })()}
          </SuspenseBoundary>
          <SuspenseBoundary fallback={<article class="panel pending">Loading activity…</article>}>
            {(() => {
              const activity = items.activity.read();
              return <article class="panel" style={\`--panel-tone: \${activity.tone}\`}><strong>{activity.name}</strong><span>{activity.detail}</span></article>;
            })()}
          </SuspenseBoundary>
        </SuspenseList>
      </div>

      <button on:click={() => setCycle((value) => value + 1)}>Replay loading</button>
    </section>
  );
}
AsyncShowcase.styles = css\`
  :host { display: block; color: #e2e8f0; font-family: "IBM Plex Sans", "Segoe UI", sans-serif; }
  * { box-sizing: border-box; }
  .card { display: grid; gap: 1rem; width: min(100%, 28rem); padding: 1.1rem; border: 1px solid #334155; border-radius: 1.15rem; background: radial-gradient(circle at top left, rgba(56,189,248,.12), transparent 42%), linear-gradient(155deg,#111827,#1e293b); box-shadow: 0 18px 40px rgba(15,23,42,.24); }
  .eyebrow { color: #7dd3fc; font-size: .7rem; letter-spacing: .11em; text-transform: uppercase; }
  h2 { margin: .35rem 0 0; font-size: 1.35rem; }
  .intro { margin: .55rem 0 0; color: #94a3b8; line-height: 1.45; }
  .list, suspense-list { display: grid; gap: .7rem; }
  .panel { display: grid; gap: .3rem; padding: .85rem .95rem; border-left: 4px solid var(--panel-tone); border-radius: .9rem; background: rgba(255,255,255,.07); }
  .panel span { color: #cbd5e1; font-size: .9rem; }
  .pending { border-left-color: #64748b; color: #cbd5e1; }
  button { justify-self: end; border: 0; border-radius: 999px; padding: .6rem .95rem; background: #f97316; color: white; cursor: pointer; font-weight: 700; }
\`;
`.trim();

export const nativeRefResolutionExampleSource = `
import { css, useOnCommit, useRef, useState } from "@litsx/core";

export function NativeRefResolutionDemo() {
  const input = useRef<HTMLInputElement>();
  const [value, setValue] = useState("");
  useOnCommit(() => input.value?.focus(), []);
  return (
    <label>
      Native Lit ref value
      <input ref={input} value={value} on:input={(event) => setValue(event.currentTarget.value)} />
      <span>{value || "Start typing…"}</span>
    </label>
  );
}
NativeRefResolutionDemo.styles = css\`
  :host { display: block; color: #f8fafc; font-family: "IBM Plex Sans", "Segoe UI", sans-serif; }
  label { display: grid; gap: .65rem; width: min(100%, 24rem); padding: 1rem; border: 1px solid #263346; border-radius: 1rem; background: linear-gradient(155deg, #182234, #0f172a); box-shadow: 0 18px 38px rgba(15,23,42,.22); font-weight: 700; }
  input { box-sizing: border-box; width: 100%; padding: .7rem .8rem; border: 1px solid #334155; border-radius: .75rem; outline: none; background: #020617; color: #f8fafc; font: inherit; }
  input:focus { border-color: #38bdf8; box-shadow: 0 0 0 .22rem rgba(56,189,248,.16); }
  span { padding: .65rem .75rem; border-radius: .7rem; background: rgba(56,189,248,.1); color: #bae6fd; font-weight: 500; }
\`;
`.trim();

export const useEmitExampleSource = `
import { css, useEmit } from "@litsx/core";

type PickerEvents = { "color-change": { color: string } };
function ColorPicker() {
  const emit = useEmit<PickerEvents>();
  return <button on:click={() => emit("color-change", { color: "coral" })}><span></span>Choose coral</button>;
}
ColorPicker.styles = css\`
  :host { display: block; }
  button { display: inline-flex; align-items: center; gap: .55rem; padding: .68rem .9rem; border: 0; border-radius: 999px; background: rgba(15,23,42,.72); color: #f8fafc; cursor: pointer; font: 700 .9rem/1 system-ui; box-shadow: inset 0 0 0 1px rgba(148,163,184,.25); }
  span { width: .58rem; height: .58rem; border-radius: 50%; background: coral; box-shadow: 0 0 0 .24rem rgba(255,127,80,.16); }
\`;
export function UseEmitDemo() {
  return <ColorPicker on:color-change={(event) => alert(event.detail.color)} />;
}
UseEmitDemo.styles = css\`
  :host { display: block; width: min(100%, 24rem); padding: 1rem; border: 1px solid rgba(56,189,248,.22); border-radius: 1rem; background: linear-gradient(160deg, #0e1724, #213650); color: #f4efe8; font-family: "IBM Plex Sans", "Segoe UI", sans-serif; box-shadow: 0 18px 38px rgba(15,23,42,.22); }
  color-picker { display: block; }
\`;
`.trim();

export const reactMigrationExampleSource = `
import React, { lazy, useState } from "react";
import { css } from "@litsx/core";

const resultsPanelModuleSource = [
  'import { LitElement, css, html } from "lit";',
  "export default class ResultsPanel extends LitElement {",
  "  static properties = { query: { type: String } };",
  "  static styles = css\`:host { display:block } p { margin:0; padding:.75rem; border:1px solid #475569; border-radius:.7rem; background:rgba(148,163,184,.12); color:#e2e8f0; font:500 .92rem/1.4 system-ui }\`;",
  "  render() {",
  "    return html\`<p>Results for \\\${this.query}</p>\`;",
  "  }",
  "}",
].join("\\n");
const resultsPanelModuleUrl =
  "data:text/javascript;charset=utf-8," + encodeURIComponent(resultsPanelModuleSource);
const ResultsPanel = lazy(() => import(resultsPanelModuleUrl).then((module) => module.default));
export function ReactMigrationDemo() {
  const [query, setQuery] = useState("LitSX");
  return (
    <main className="card">
      <label>Search <input value={query} onChange={(event) => setQuery(event.target.value)} /></label>
      <React.Suspense fallback={<p className="status">Loading…</p>}><ResultsPanel query={query} /></React.Suspense>
    </main>
  );
}
ReactMigrationDemo.styles = css\`
  :host { display:block; font-family:system-ui; color:#e2e8f0 }
  .card { display:grid; gap:1rem; width:min(100%,24rem); padding:1rem; border:1px solid #334155; border-radius:1rem; background:linear-gradient(145deg,#0f172a,#1e293b) }
  label { display:grid; gap:.45rem; color:#cbd5e1; font-weight:600 }
  input { box-sizing:border-box; width:100%; padding:.65rem .75rem; border:1px solid #475569; border-radius:.65rem; background:#020617; color:white; font:inherit }
  p { margin:0; padding:.75rem; border-radius:.65rem; background:rgba(148,163,184,.12) }
  .status { color:#fbbf24 }
\`;
`.trim();

export const reactForwardRefExampleSource = `
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { css } from "@litsx/core";

const SearchInput = forwardRef(function SearchInputComponent(_props, ref) {
  const input = useRef(null);
  useImperativeHandle(ref, () => ({ focus: () => input.current?.focus() }), []);
  return <input ref={input} placeholder="Search" />;
});
SearchInput.styles = css\`
  :host { display: block; min-width: 0; }
  input { box-sizing: border-box; width: 100%; padding: .68rem .78rem; border: 1px solid #475569; border-radius: .72rem; outline: none; background: #020617; color: white; font: inherit; }
  input:focus { border-color: #fb923c; box-shadow: 0 0 0 .22rem rgba(249,115,22,.16); }
  input::placeholder { color: #64748b; }
\`;
export function ReactForwardRefDemo() {
  const search = useRef(null);
  return <section className="card"><SearchInput ref={search} /><button onClick={() => search.current?.focus()}>Focus input</button></section>;
}
ReactForwardRefDemo.styles = css\`
  :host { display:block; font-family:"IBM Plex Sans", "Segoe UI", sans-serif; }
  .card { display:flex; align-items:center; gap:.7rem; width:min(100%,25rem); padding:1rem; border:1px solid #334155; border-radius:1rem; background:radial-gradient(circle at top left,rgba(249,115,22,.14),transparent 44%),#0f172a; box-shadow:0 18px 38px rgba(15,23,42,.22); }
  search-input { flex:1; min-width:0; }
  button { border:0; border-radius:999px; padding:.65rem .95rem; background:#f97316; color:white; font:700 .88rem/1 system-ui; cursor:pointer; }
\`;
`.trim();

export const reactContextExampleSource = `
import React, { createContext, useContext, useState } from "react";
import { css } from "@litsx/core";

const Theme = createContext("violet");
function ThemeSwatch() {
  const tone = useContext(Theme);
  const coral = tone === "coral";
  return (
    <p style={{
      "--swatch-border": coral ? "rgba(253,186,116,.42)" : "rgba(196,181,253,.32)",
      "--swatch-bg": coral ? "rgba(249,115,22,.16)" : "rgba(167,139,250,.14)",
      "--swatch-color": coral ? "#fed7aa" : "#ddd6fe",
    }}>Theme: {tone}</p>
  );
}
ThemeSwatch.styles = css\`
  :host { display: block; }
  p { margin: 0; padding: .52rem .72rem; border: 1px solid var(--swatch-border); border-radius: 999px; background: var(--swatch-bg); color: var(--swatch-color); font: 650 .86rem/1 system-ui; transition: border-color .2s, background .2s, color .2s; }
\`;
export function ReactContextDemo() {
  const [tone, setTone] = useState("violet");
  const coral = tone === "coral";
  return (
    <Theme.Provider value={tone}>
      <section className="card" style={{
        "--theme-border": coral ? "#c2410c" : "#6d28d9",
        "--theme-glow": coral ? "rgba(249,115,22,.22)" : "rgba(167,139,250,.2)",
        "--theme-surface": coral ? "#431407" : "#1e1b4b",
        "--theme-text": coral ? "#ffedd5" : "#ede9fe",
        "--theme-action": coral ? "#fb923c" : "#a78bfa",
        "--theme-action-text": coral ? "#431407" : "#1e1b4b",
      }}>
        <ThemeSwatch />
        <button onClick={() => setTone(coral ? "violet" : "coral")}>Toggle theme</button>
      </section>
    </Theme.Provider>
  );
}
ReactContextDemo.styles = css\`
  :host { display:block; font-family:"IBM Plex Sans", "Segoe UI", sans-serif; }
  .card { display:flex; align-items:center; justify-content:space-between; gap:1rem; width:min(100%,23rem); padding:1rem; border:1px solid var(--theme-border); border-radius:1rem; background:radial-gradient(circle at top right,var(--theme-glow),transparent 46%),var(--theme-surface); color:var(--theme-text); box-shadow:0 18px 38px color-mix(in srgb,var(--theme-border) 24%,transparent); transition:border-color .2s, background .2s, color .2s; }
  button { border:0; border-radius:999px; padding:.62rem .92rem; background:var(--theme-action); color:var(--theme-action-text); font-weight:700; cursor:pointer; transition:background .2s, color .2s; }
\`;
`.trim();

export const stylingExampleSource = `
import { css, useState, useStyle } from "@litsx/core";

const foundationStyles = css\`
  :host {
    display: block;
    color: #e2e8f0;
    font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
  }

  * { box-sizing: border-box; }

  .card {
    display: grid;
    gap: 1rem;
    width: min(100%, 26rem);
    padding: 1.1rem;
    border: 1px solid rgba(148, 163, 184, 0.22);
    border-left: 6px solid var(--accent);
    border-radius: 1.1rem;
    background: linear-gradient(155deg, #111827, #1e293b);
  }
\`;

const typographyStyles = css\`
  .eyebrow {
    color: #94a3b8;
    font-size: 0.72rem;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }

  h2 { margin: 0.35rem 0 0; font-size: 1.4rem; }
  p { margin: 0; color: #cbd5e1; line-height: 1.5; }
\`;

const controlStyles = css\`
  button {
    justify-self: start;
    border: 0;
    border-radius: 999px;
    padding: 0.62rem 0.95rem;
    background: var(--accent);
    color: white;
    cursor: pointer;
    font-weight: 700;
  }
\`;

const themeStyles = [typographyStyles, controlStyles];

export function StyleCompositionDemo() {
  const accents = ["#f97316", "#0ea5e9", "#8b5cf6"];
  const [index, setIndex] = useState(0);
  useStyle("--accent", accents[index]);

  return (
    <article class="card">
      <header>
        <span class="eyebrow" style={{ color: accents[index] }}>CSSResult composition</span>
        <h2>Three reusable style layers</h2>
      </header>
      <p>Foundation, typography, and controls keep their own CSSResult identity.</p>
      <button on:click={() => setIndex((index + 1) % accents.length)}>
        Change dynamic accent
      </button>
    </article>
  );
}

StyleCompositionDemo.styles = [foundationStyles, themeStyles];
`.trim();

// Kept as named examples for older deep links; all use the 1.0 source model.
export const litDirectivesExampleSource = jsxAuthoringExampleSource;
export const staticExposeExampleSource = jsxAuthoringExampleSource;
export const lightDomExampleSource = jsxAuthoringExampleSource;
export const lightDomStylingExampleSource = jsxAuthoringExampleSource;
export const scopedElementsBaselineExampleSource = jsxAuthoringExampleSource;
