# Framework Reference

This reference is generated from the public Lit<sup>sx</sup> type surface in `packages/core/src/*.d.ts`.

It documents the framework API that authors write against. Internal helpers and transform-only support APIs are intentionally left out.

## Language Model

Lit<sup>sx</sup> is a framework for writing Lit-based web components with JSX.

- JSX is the authored language
- Lit is the rendering foundation
- web components are the deployed unit
- React compatibility is optional and exists only for legacy migration

## JSX Surface

Lit<sup>sx</sup> authoring is Lit-flavored:

- event listeners use `@event`
- property bindings use `.prop`
- boolean attributes use `?attr`
- component trees are authored in JSX rather than in tagged template literals

## Core Types

These types describe the public authored language of Lit<sup>sx</sup>: JSX nodes, renderable values, refs, and component signatures.

### `LitsxHook`

```ts
export interface LitsxHook {
    readonly [LITSX_HOOK]: true;
}
```

### `LitsxComponentStatic`

```ts
export interface LitsxComponentStatic {
    readonly [LITSX_COMPONENT]: true;
}
```

### `LitsxHostTypeIdStatic`

```ts
export interface LitsxHostTypeIdStatic extends LitsxComponentStatic {
    readonly [LITSX_HOST_TYPE_ID]: string;
}
```

### `LitsxJsxNode`

```ts
export interface LitsxJsxNode {
    $$typeof: symbol;
    type: unknown;
    key: string | number | null;
    props: Record<string, unknown>;
    __source?: unknown;
    __self?: unknown;
}
```

### `LitsxRenderable`

```ts
export type LitsxRenderable = LitsxJsxNode | string | number | boolean | null | undefined | Iterable<unknown>;
```

### `LitsxRef`

```ts
export type LitsxRef<T> = T | ((value: T | null) => void) | null;
```

### `LitsxComponent`

```ts
export type LitsxComponent<Props = Record<string, unknown>> = (props: Props) => LitsxRenderable;
```

### `isLitsxHook`

```ts
export declare function isLitsxHook(value: unknown): value is LitsxHook;
```

### `isLitsxComponentClass`

```ts
export declare function isLitsxComponentClass(value: unknown): value is LitsxComponentStatic;
```

## JSX Surface Types

These types define how Lit<sup>sx</sup> models intrinsic elements, authored attributes, and the JSX-visible host element shape.

### `LitsxBaseAttributes`

```ts
export interface LitsxBaseAttributes {
    key?: string | number;
    slot?: string;
    class?: string;
    part?: string;
    style?: string | Partial<CSSStyleDeclaration>;
    /**
     * Authored child content passed between component tags.
     * LitSX treats this as projected content for the default slot.
     * In authored component bodies, implicit `children` projection is only supported as
     * a single direct JSX child expression such as `{children}` or `{props.children}`.
     * For named slots, repeated distribution, or other composition patterns, use explicit
     * `<slot>` markup or host-content hooks instead of treating `children` as ordinary data.
     */
    children?: LitsxRenderable;
    ref?: LitsxRef<unknown>;
    [attributeName: `data-${string}`]: unknown;
    [attributeName: `aria-${string}`]: string | number | boolean | undefined;
}
```

### `LitsxEventHandler`

```ts
export type LitsxEventHandler<TEvent extends Event = Event> = {
    bivarianceHack(event: TEvent): unknown;
}["bivarianceHack"];
```

### `LitsxKnownDomEventAttributes`

```ts
export type LitsxKnownDomEventAttributes<Target = EventTarget> = {
    [EventName in keyof GlobalEventHandlersEventMap as `__litsx_event_${EventName & string}`]?: LitsxEventHandler<GlobalEventHandlersEventMap[EventName] & CustomEvent<any> & {
        currentTarget: Target;
    }>;
};
```

### `LitsxFormEventAttributes`

```ts
export type LitsxFormEventAttributes<Target = EventTarget> = Target extends HTMLFormElement ? {
    __litsx_event_reset?: LitsxEventHandler<Event & {
        currentTarget: Target;
    }>;
    __litsx_event_formdata?: LitsxEventHandler<FormDataEvent & {
        currentTarget: Target;
    }>;
} : {};
```

### `LitsxCustomEventAttributes`

```ts
export type LitsxCustomEventAttributes = {
    [attributeName: `__litsx_event_${string}-${string}`]: LitsxEventHandler<CustomEvent<any>> | undefined;
};
```

### `LitsxAnyEventAttributes`

```ts
export type LitsxAnyEventAttributes = {
    /**
     * Last-resort fallback for authored event names that do not have a reliable DOM event map entry.
     * All authored events also accept CustomEvent handlers; this escape stays intentionally
     * broad so the catch-all index does not over-constrain known DOM or custom events when
     * intersected with narrower maps.
     */
    [attributeName: `__litsx_event_${string}`]: LitsxEventHandler<any> | undefined;
};
```

### `LitsxDomAttributes`

```ts
export type LitsxDomAttributes<Target = EventTarget> = LitsxKnownDomEventAttributes<Target> & LitsxFormEventAttributes<Target> & LitsxCustomEventAttributes & LitsxAnyEventAttributes & {
    /**
     * Reserved for future JSX-authored event typing.
     * LitSX currently treats Lit listener syntax (`@event`) as a parser-level feature,
     * so the public JSX type surface intentionally avoids React-style `onClick` props.
     */
    _currentTarget?: Target | undefined;
    /**
     * Tooling virtualizes authored `.prop` bindings to `__litsx_prop_*` attributes
     * while preserving the original source spans for editor features.
     */
    [attributeName: `__litsx_prop_${string}`]: unknown;
    /**
     * Tooling virtualizes authored `?attr` bindings to `__litsx_bool_*` attributes
     * while preserving the original source spans for editor features.
     */
    [attributeName: `__litsx_bool_${string}`]: boolean | undefined;
};
```

### `LitsxHostElementProps`

```ts
export type LitsxHostElementProps<TElement> = Omit<Partial<TElement>, "children" | "style" | "part" | "slot" | "className">;
```

### `LitsxNativeAttributeAliases`

```ts
export type LitsxNativeAttributeAliases<TElement> = TElement extends HTMLLabelElement | HTMLOutputElement ? {
    /**
     * Native `for` attribute spelling for intrinsic `<label>` and `<output>` elements.
     * LitSX prefers native DOM-aligned attribute names in authored JSX even when the
     * corresponding DOM property is exposed as `htmlFor`.
     */
    for?: string;
} : {};
```

### `LitsxElementProps`

```ts
export type LitsxElementProps<TElement = HTMLElement> = LitsxBaseAttributes & LitsxDomAttributes<TElement> & LitsxNativeAttributeAliases<TElement> & LitsxHostElementProps<TElement>;
```

### `LitsxErrorBoundaryElementProps`

```ts
export type LitsxErrorBoundaryElementProps = LitsxBaseAttributes & LitsxDomAttributes<ErrorBoundary> & Omit<LitsxHostElementProps<ErrorBoundary>, "fallback" | "content"> & ErrorBoundaryProps;
```

### `LitsxSuspenseBoundaryElementProps`

```ts
export type LitsxSuspenseBoundaryElementProps = LitsxBaseAttributes & LitsxDomAttributes<SuspenseBoundary> & Omit<LitsxHostElementProps<SuspenseBoundary>, "fallback" | "content"> & SuspenseBoundaryProps;
```

### `LitsxIntrinsicElements`

```ts
export type LitsxIntrinsicElements = {
    [TagName in keyof HTMLElementTagNameMap]: LitsxElementProps<HTMLElementTagNameMap[TagName]>;
} & LitsxCustomIntrinsicElements & {
    "error-boundary": LitsxErrorBoundaryElementProps;
    "suspense-boundary": LitsxSuspenseBoundaryElementProps;
    "suspense-list": LitsxElementProps<SuspenseList> & SuspenseListProps;
};
```

## Primitives

These are the native primitives that define asynchronous UI coordination and recoverable rendering failures in Lit<sup>sx</sup>.

### `ErrorBoundary`

Show fallback UI when a subtree throws during render.

Detailed reference: [`ErrorBoundary`](../../reference/generated/errorboundary.md)

```ts
/**
 * Show fallback UI when a subtree throws during render.
 */
export declare class ErrorBoundary extends LitElement {
    static readonly [LITSX_COMPONENT]: true;
    failed: boolean;
    error: unknown;
    onError: ((error: unknown) => void) | null;
    /**
     * Internal renderer generated from the authored fallback prop.
     */
    fallback: ((error: unknown) => unknown) | null;
    /**
     * Internal renderer generated from authored children.
     */
    content: (() => unknown) | null;
}
```

### `SuspenseBoundary`

Show fallback UI while a suspense region is waiting to reveal.

Detailed reference: [`SuspenseBoundary`](../../reference/generated/suspenseboundary.md)

```ts
/**
 * Show fallback UI while a suspense region is waiting to reveal.
 */
export declare class SuspenseBoundary extends LitElement {
    static readonly [LITSX_COMPONENT]: true;
    pending: boolean;
    resolved: boolean;
    showing: string;
    phase: string;
    /**
     * Internal renderer generated from the authored fallback prop.
     */
    fallback: (() => unknown) | null;
    /**
     * Internal renderer generated from authored children.
     */
    content: (() => unknown) | null;
}
```

### `SuspenseList`

Coordinate reveal order across sibling suspense boundaries.

Detailed reference: [`SuspenseList`](../../reference/generated/suspenselist.md)

```ts
/**
 * Coordinate reveal order across sibling suspense boundaries.
 */
export declare class SuspenseList extends ReactiveElement {
    static readonly [LITSX_COMPONENT]: true;
    revealOrder: "forwards" | "backwards" | "together";
    tail: "collapsed" | "hidden";
}
```

### `renderWithSoftSuspense`

```ts
export declare function renderWithSoftSuspense<T>(host: object, render: () => T): T;
```

### `collectSoftSuspenseThenables`

```ts
export declare function collectSoftSuspenseThenables<T>(collector: {
    add(thenable: Promise<unknown>): void;
}, render: () => T): T;
```

## Primitive Props

These interfaces describe the public authored props of the native primitives.

### `ErrorBoundaryProps`

```ts
export interface ErrorBoundaryProps {
    /**
     * Content projected into the boundary while no error has been captured.
     */
    children?: LitsxRenderable;
    /**
     * Fallback UI rendered after the boundary captures an error.
     */
    fallback?: LitsxRenderable | ((error: unknown) => LitsxRenderable);
    /**
     * Optional callback invoked when the boundary captures an error.
     */
    onError?: (error: unknown) => void;
}
```

### `SuspenseBoundaryProps`

```ts
export interface SuspenseBoundaryProps {
    /**
     * Content projected into the boundary when it is ready to reveal.
     */
    children?: LitsxRenderable;
    /**
     * Fallback UI rendered while the boundary is waiting for its content.
     */
    fallback?: LitsxRenderable;
}
```

### `SuspenseListProps`

```ts
export interface SuspenseListProps {
    /**
     * Suspense boundary content coordinated by the list.
     */
    children?: LitsxRenderable;
    /**
     * Order in which sibling boundaries are allowed to reveal.
     */
    revealOrder?: "forwards" | "backwards" | "together";
    /**
     * Strategy used for boundaries that are still pending behind the current reveal point.
     */
    tail?: "collapsed" | "hidden";
}
```

## Lifecycle And Events

These hooks connect authored components to lifecycle timing, stable event callbacks, and DOM event emission.

### `useAfterUpdate`

Run an effect after the component finishes updating.

Detailed reference: [`useAfterUpdate`](../../reference/generated/useafterupdate.md)

```ts
/**
 * Run an effect after the component finishes updating.
 */
export declare function useAfterUpdate(callback: () => void | (() => void), deps?: unknown[]): void;
```

### `useOnCommit`

Run an effect during commit, before the next frame paints.

Detailed reference: [`useOnCommit`](../../reference/generated/useoncommit.md)

```ts
/**
 * Run an effect during commit, before the next frame paints.
 */
export declare function useOnCommit(callback: () => void | (() => void), deps?: unknown[]): void;
```

### `useOnConnect`

Set up work that stays active while the component remains connected.

Detailed reference: [`useOnConnect`](../../reference/generated/useonconnect.md)

```ts
/**
 * Set up work that stays active while the component remains connected.
 */
export declare function useOnConnect(callback: () => void | (() => void), deps?: unknown[]): void;
```

### `useEvent`

Keep an event callback identity stable while always calling the latest logic.

Detailed reference: [`useEvent`](../../reference/generated/useevent.md)

```ts
/**
 * Keep an event callback identity stable while always calling the latest logic.
 */
export declare function useEvent<T extends (...args: never[]) => unknown>(callback: T): T;
```

### `useEmit`

Emit a CustomEvent from the current host.

Detailed reference: [`useEmit`](../../reference/generated/useemit.md)

```ts
/**
 * Emit a CustomEvent from the current host.
 */
export declare function useEmit(): <T = undefined>(type: string, detail?: T, options?: {
    bubbles?: boolean;
    composed?: boolean;
    cancelable?: boolean;
}) => boolean;
```

## State And Concurrency

These hooks own local state, controlled state, async state, optimistic overlays, and deferred rendering work.

### `useState`

Store local component state.

Detailed reference: [`useState`](../../reference/generated/usestate.md)

```ts
/**
 * Store local component state.
 */
export declare function useState<T>(initial: T | (() => T)): [
    T,
    (next: T | ((value: T) => T)) => void
];
```

### `useReducedState`

Manage local state with a reducer.

Detailed reference: [`useReducedState`](../../reference/generated/usereducedstate.md)

```ts
/**
 * Manage local state with a reducer.
 */
export declare function useReducedState<TState, TAction, TInitArg = TState>(reducer: (state: TState, action: TAction) => TState, initialArg: TInitArg, init?: (arg: TInitArg) => TState): [
    TState,
    (action: TAction | ((value: TState) => TState)) => void
];
```

### `useControlledState`

Manage a value that can be controlled from props or owned locally by the component.

Detailed reference: [`useControlledState`](../../reference/generated/usecontrolledstate.md)

```ts
/**
 * Manage a value that can be controlled from props or owned locally by the component.
 */
export declare function useControlledState<T>(options: {
    value?: T;
    defaultValue?: T | (() => T);
    onChange?: (value: T) => void;
}): [
    T | undefined,
    (next: T | ((value: T | undefined) => T)) => void
];
```

### `useAsyncState`

Manage async state transitions behind a single run function.

Detailed reference: [`useAsyncState`](../../reference/generated/useasyncstate.md)

```ts
/**
 * Manage async state transitions behind a single run function.
 */
export declare function useAsyncState<TState, TArgs extends unknown[] = [
]>(initialState: TState | (() => TState), action: (state: TState, ...args: TArgs) => TState | Promise<TState>): [
    TState,
    (...args: TArgs) => Promise<TState>,
    {
        pending: boolean;
        error: unknown | null;
        reset: () => void;
    }
];
```

### `useOptimistic`

Detailed reference: [`useOptimistic`](../../reference/generated/useoptimistic.md)

```ts
export declare function useOptimistic<TState, TInput>(state: TState, updateFn: (currentState: TState, optimisticValue: TInput) => TState): [
    TState,
    (value: TInput) => void,
    () => void
];
```

### `useTransition`

Schedule non-urgent updates and track whether they are pending.

Detailed reference: [`useTransition`](../../reference/generated/usetransition.md)

```ts
/**
 * Schedule non-urgent updates and track whether they are pending.
 */
export declare function useTransition(): [
    boolean,
    <T>(callback: () => T) => T
];
```

### `startTransition`

Schedule non-urgent updates using the same transition machinery as useTransition.

Detailed reference: [`startTransition`](../../reference/generated/starttransition.md)

```ts
/**
 * Schedule non-urgent updates using the same transition machinery as useTransition.
 */
export declare function startTransition<T>(callback: () => T): T;
```

### `useDeferredValue`

Let expensive consumers lag behind a fast-changing value.

Detailed reference: [`useDeferredValue`](../../reference/generated/usedeferredvalue.md)

```ts
/**
 * Let expensive consumers lag behind a fast-changing value.
 */
export declare function useDeferredValue<T>(value: T, options?: {
    timeout?: number;
}): T;
```

### `useMemoValue`

Memoize a derived value until its dependencies change.

Detailed reference: [`useMemoValue`](../../reference/generated/usememovalue.md)

```ts
/**
 * Memoize a derived value until its dependencies change.
 */
export declare function useMemoValue<T>(factory: () => T, deps?: unknown[]): T;
```

### `usePrevious`

Read the value from the previous render.

Detailed reference: [`usePrevious`](../../reference/generated/useprevious.md)

```ts
/**
 * Read the value from the previous render.
 */
export declare function usePrevious<T>(value: T, initialValue?: T): T | undefined;
```

## Refs And Imperative APIs

These hooks model host access, mutable refs, callback refs, slot content, projected content, and imperative handles.

### `LitsxHostContent`

```ts
export interface LitsxHostContent {
    text: string;
    nodes: Node[];
    hasContent: boolean;
    slots: Record<string, Node[]> & {
        default: Node[];
    };
}
```

### `useHost`

Return the current component instance.

Detailed reference: [`useHost`](../../reference/generated/usehost.md)

```ts
/**
 * Return the current component instance.
 */
export declare function useHost<THost extends object = object>(): THost;
```

### `useHostTypeId`

Return a stable identifier for the current LitSX component type.

All instances of the same compiled component share this value. Use it for
cache keys, SSR resource identity, or hydration metadata that should follow
the component definition rather than the instance or a single hook callsite.

```ts
/**
 * Return a stable identifier for the current LitSX component type.
 *
 * All instances of the same compiled component share this value. Use it for
 * cache keys, SSR resource identity, or hydration metadata that should follow
 * the component definition rather than the instance or a single hook callsite.
 */
export declare function useHostTypeId(): string;
```

### `useHostContent`

Read reactive light DOM content from the current component.

Detailed reference: [`useHostContent`](../../reference/generated/usehostcontent.md)

```ts
/**
 * Read reactive light DOM content from the current component.
 */
export declare function useHostContent(options?: {
    trim?: boolean;
}): LitsxHostContent;
```

### `useTextContent`

Read reactive text content projected into the current component.

Detailed reference: [`useTextContent`](../../reference/generated/usetextcontent.md)

```ts
/**
 * Read reactive text content projected into the current component.
 */
export declare function useTextContent(options?: {
    trim?: boolean;
}): string;
```

### `useSlot`

Read reactive projected nodes for one slot.

Detailed reference: [`useSlot`](../../reference/generated/useslot.md)

```ts
/**
 * Read reactive projected nodes for one slot.
 */
export declare function useSlot(slotName?: string): Node[];
```

### `useRef`

Store a mutable value across renders without causing updates.

Detailed reference: [`useRef`](../../reference/generated/useref.md)

```ts
/**
 * Store a mutable value across renders without causing updates.
 */
export declare function useRef<T>(initialValue?: T): {
    current: T | undefined;
};
```

### `useId`

Generate a stable id for the current component instance.

```ts
/**
 * Generate a stable id for the current component instance.
 */
export declare function useId(): string;
```

### `useStableId`

Return a stable identifier for this authored callsite.

LitSX tooling injects callsite metadata so this value is stable across SSR
and client hydration and does not depend on render order or instance order.
Use it for callsite-scoped resource/preload identity, not for unique DOM ids.
When cache identity should follow the component definition, prefer
`useHostTypeId()`.

```ts
/**
 * Return a stable identifier for this authored callsite.
 *
 * LitSX tooling injects callsite metadata so this value is stable across SSR
 * and client hydration and does not depend on render order or instance order.
 * Use it for callsite-scoped resource/preload identity, not for unique DOM ids.
 * When cache identity should follow the component definition, prefer
 * `useHostTypeId()`.
 */
export declare function useStableId(): string;
```

### `useCallbackRef`

Run a callback ref through the component lifecycle.

Detailed reference: [`useCallbackRef`](../../reference/generated/usecallbackref.md)

```ts
/**
 * Run a callback ref through the component lifecycle.
 */
export declare function useCallbackRef(getTarget: () => Element | null, callback: (node: Element | null) => void, deps?: unknown[]): void;
```

### `useExpose`

Detailed reference: [`useExpose`](../../reference/generated/useexpose.md)

```ts
export declare function useExpose<T extends Record<string, (...args: any[]) => unknown>>(ref: {
    current: T | null;
} | ((value: T | null) => void), createHandle: () => T, deps?: unknown[]): void;
```

### `useStableCallback`

Keep a callback stable until its dependencies change.

Detailed reference: [`useStableCallback`](../../reference/generated/usestablecallback.md)

```ts
/**
 * Keep a callback stable until its dependencies change.
 */
export declare function useStableCallback<T extends (...args: never[]) => unknown>(callback: T, deps?: unknown[]): T;
```

## External Integration

These APIs bridge Lit<sup>sx</sup> components to external state and dynamic host styling.

### `useExternalStore`

Subscribe to external state and read its current snapshot.

Detailed reference: [`useExternalStore`](../../reference/generated/useexternalstore.md)

```ts
/**
 * Subscribe to external state and read its current snapshot.
 */
export declare function useExternalStore<T>(subscribe: (listener: () => void) => () => void, getSnapshot: () => T, getServerSnapshot?: () => T): T;
```

### `useStyle`

Apply a dynamic style property to the current component host.

Detailed reference: [`useStyle`](../../reference/generated/usestyle.md)

```ts
/**
 * Apply a dynamic style property to the current component host.
 */
export declare function useStyle(propertyName: string, ...args: [
    value: LitsxStyleValue
] | [
    compute: LitsxStyleFactory
] | [
    compute: LitsxStyleFactory,
    deps: unknown[]
]): void;
```

## Structural Hooks And Host Middleware

These APIs define the public structural-hook authoring contract and the host middleware runtime surface used by compiled structural entries.

### `LitsxHostMiddlewareLifecycleMethod`

```ts
export type LitsxHostMiddlewareLifecycleMethod = "connectedCallback" | "disconnectedCallback" | "attributeChangedCallback" | "formAssociatedCallback" | "formDisabledCallback" | "formResetCallback" | "formStateRestoreCallback" | "scheduleUpdate" | "shouldUpdate" | "willUpdate" | "update" | "updated" | "firstUpdated" | "getUpdateComplete";
```

### `LitsxHostMiddlewareNext`

```ts
export type LitsxHostMiddlewareNext<TResult = unknown> = () => TResult;
```

### `LitsxStructuralMeta`

Compiler-provided metadata for one authored structural-hook callsite.

`callsitePath` is the stable public field. It can be used for resource
identity, diagnostics, SSR records, and debug tooling. Other fields are
informational unless documented by LitSX.

```ts
/**
 * Compiler-provided metadata for one authored structural-hook callsite.
 *
 * `callsitePath` is the stable public field. It can be used for resource
 * identity, diagnostics, SSR records, and debug tooling. Other fields are
 * informational unless documented by LitSX.
 */
export interface LitsxStructuralMeta {
    /**
     * Stable authored expansion path for this structural callsite.
     */
    callsitePath: string[];
    [key: string]: unknown;
}
```

### `LitsxStructuralState`

Lifecycle middleware for a structural hook.

Middleware wraps the host lifecycle method in structural entry order.
`next()` invokes the next middleware and eventually the host base
implementation. Middleware may run logic before `next()`, after `next()`,
or both. Calling `next()` more than once is an error.

```ts
/**
 * Lifecycle middleware for a structural hook.
 *
 * Middleware wraps the host lifecycle method in structural entry order.
 * `next()` invokes the next middleware and eventually the host base
 * implementation. Middleware may run logic before `next()`, after `next()`,
 * or both. Calling `next()` more than once is an error.
 */
export interface LitsxStructuralState<TStaticState = undefined, TInstanceState = undefined> {
    /**
     * Class/type-phase state produced by `static(...)`.
     */
    static: TStaticState;
    /**
     * Per-host-instance state produced by `setup(...)`.
     */
    instance: TInstanceState;
}
```

### `LitsxHostAccessorDescriptor`

```ts
export interface LitsxHostAccessorDescriptor<TValue = unknown> {
    get?: () => TValue;
    set?: {
        bivarianceHack(value: TValue): void;
    }["bivarianceHack"];
}
```

### `LitsxHostAccessorMap`

```ts
export type LitsxHostAccessorMap = Record<string, LitsxHostAccessorDescriptor<unknown>>;
```

### `LitsxStructuralPropMap`

```ts
export type LitsxStructuralPropMap = Record<string, unknown>;
```

### `LitsxStructuralPropsNext`

```ts
export type LitsxStructuralPropsNext = () => LitsxStructuralPropMap | null | undefined;
```

### `LitsxStructuralAccessorsNext`

```ts
export type LitsxStructuralAccessorsNext = () => LitsxHostAccessorMap | null | undefined;
```

### `LitsxHostMiddleware`

```ts
export type LitsxHostMiddleware<TResult = unknown, TStaticState = undefined, TInstanceState = undefined> = (host: unknown, state: LitsxStructuralState<TStaticState, TInstanceState>, next: LitsxHostMiddlewareNext<TResult>, args: unknown[], meta: LitsxStructuralMeta, entry: LitsxStructuralEntry) => TResult;
```

### `LitsxHostMiddlewareMap`

```ts
export type LitsxHostMiddlewareMap<TStaticState = undefined, TInstanceState = undefined> = Partial<Record<LitsxHostMiddlewareLifecycleMethod, LitsxHostMiddleware<unknown, TStaticState, TInstanceState>>>;
```

### `LitsxStructuralDefinition`

Public structural-hook definition.

Structural hooks are consumed like ordinary hooks:

```tsx
const value = useSomething(args);
```

The LitSX compiler rewrites that authored callsite to the host middleware
runtime. Component authors do not manually register structural entries.

`setup(host, args, staticState, meta, entry)` creates persistent mutable
instance state for one structural callsite in one host instance. The state
is retained across updates and is exposed as `state.instance` to `use`,
accessors, and lifecycle middleware. Use it for cached resources,
host-linked handles, lifecycle coordination, or derived persistent data.

`use(host, state, args, meta, entry)` is the render-time hook reader. It may call normal hooks and
structural hooks transitively, subject to the same static hook-order rules as
ordinary hooks. Dynamic structural-hook lookup is not supported: aliases,
object/array containers, runtime selection, and computed namespace access are
build-time errors.

`middlewares` wraps host lifecycle methods through `next()`. The host
middleware runtime intentionally does not deduplicate entries: every authored
callsite gets its own state and middleware entry. Resource dedupe belongs in
hook-specific runtimes.

`props(host, state, next)` publishes structural host
property metadata into the component's merged `static properties` surface as
a composition middleware.

`accessors(host, state, next)` publishes host instance
accessors such as readonly platform-facing getters or low-level
form/control properties as a composition middleware. These accessors are
installed on the host instance itself as part of the structural runtime,
not through the imperative `useExpose()` method surface.

```ts
/**
 * Public structural-hook definition.
 *
 * Structural hooks are consumed like ordinary hooks:
 *
 * ```tsx
 * const value = useSomething(args);
 * ```
 *
 * The LitSX compiler rewrites that authored callsite to the host middleware
 * runtime. Component authors do not manually register structural entries.
 *
 * `setup(host, args, staticState, meta, entry)` creates persistent mutable
 * instance state for one structural callsite in one host instance. The state
 * is retained across updates and is exposed as `state.instance` to `use`,
 * accessors, and lifecycle middleware. Use it for cached resources,
 * host-linked handles, lifecycle coordination, or derived persistent data.
 *
 * `use(host, state, args, meta, entry)` is the render-time hook reader. It may call normal hooks and
 * structural hooks transitively, subject to the same static hook-order rules as
 * ordinary hooks. Dynamic structural-hook lookup is not supported: aliases,
 * object/array containers, runtime selection, and computed namespace access are
 * build-time errors.
 *
 * `middlewares` wraps host lifecycle methods through `next()`. The host
 * middleware runtime intentionally does not deduplicate entries: every authored
 * callsite gets its own state and middleware entry. Resource dedupe belongs in
 * hook-specific runtimes.
 *
 * `props(host, state, next)` publishes structural host
 * property metadata into the component's merged `static properties` surface as
 * a composition middleware.
 *
 * `accessors(host, state, next)` publishes host instance
 * accessors such as readonly platform-facing getters or low-level
 * form/control properties as a composition middleware. These accessors are
 * installed on the host instance itself as part of the structural runtime,
 * not through the imperative `useExpose()` method surface.
 */
export interface LitsxStructuralDefinition<TArgs extends unknown[] = unknown[], TResult = unknown, TStaticState = undefined, TInstanceState = undefined> {
    /**
     * Class/type structural phase. It does not participate in host instance
     * lifecycle and is not wired through lifecycle middleware.
     */
    static?: (...argsAndMeta: [
        ...TArgs,
        meta: LitsxStructuralMeta,
        entry: LitsxStructuralEntry
    ]) => TStaticState;
    props?: LitsxStructuralPropMap | ((host: unknown, state: LitsxStructuralState<TStaticState, TInstanceState>, next: LitsxStructuralPropsNext) => LitsxStructuralPropMap | null | undefined);
    use?: (host: unknown, state: LitsxStructuralState<TStaticState, TInstanceState>, args: TArgs, meta: LitsxStructuralMeta, entry: LitsxStructuralEntry) => TResult;
    createState?: (host: unknown, args: TArgs, staticState: TStaticState, meta: LitsxStructuralMeta, entry: LitsxStructuralEntry) => TInstanceState;
    setup?: (host: unknown, args: TArgs, staticState: TStaticState, meta: LitsxStructuralMeta, entry: LitsxStructuralEntry) => TInstanceState;
    middlewares?: LitsxHostMiddlewareMap<TStaticState, TInstanceState>;
    accessors?: (host: unknown, state: LitsxStructuralState<TStaticState, TInstanceState>, next: LitsxStructuralAccessorsNext) => LitsxHostAccessorMap;
}
```

### `LitsxStructuralHook`

Callable hook value returned by `defineHook`.

The value is a normal callable hook from the author's point of view. LitSX
attaches hidden compiler/runtime metadata to the function; that metadata is
not public API. Calling this function without the LitSX transform is an error
because structural hooks require compiled host wiring.

```ts
/**
 * Callable hook value returned by `defineHook`.
 *
 * The value is a normal callable hook from the author's point of view. LitSX
 * attaches hidden compiler/runtime metadata to the function; that metadata is
 * not public API. Calling this function without the LitSX transform is an error
 * because structural hooks require compiled host wiring.
 */
export type LitsxStructuralHook<TArgs extends unknown[] = unknown[], TResult = unknown> = (...args: TArgs) => TResult;
```

### `LitsxStructuralEntry`

```ts
export interface LitsxStructuralEntry {
    /**
     * Backwards-compatible stable identifier for this authored callsite.
     * Prefer `callsiteId` in newly generated code.
     */
    id: string;
    /**
     * Stable local index for runtime reads such as `runtime.read(index)`.
     */
    callsiteIndex: number;
    /**
     * Stable serializable identifier for diagnostics, SSR metadata, or hook-level
     * resource runtimes. Entries are not deduplicated by this id.
     */
    callsiteId: string;
    /**
     * Stable authored expansion path for nested structural hook usage.
     */
    callsitePath: string[];
    definition: LitsxStructuralDefinition | unknown;
    args: unknown[];
    meta: LitsxStructuralMeta;
    state: unknown;
    staticState?: unknown;
    middlewares?: LitsxHostMiddlewareMap | null;
}
```

### `LitsxStructuralEntryInput`

```ts
export interface LitsxStructuralEntryInput {
    id?: string;
    callsiteIndex?: number;
    callsiteId?: string;
    callsitePath?: string[];
    path?: string[];
    definition?: LitsxStructuralDefinition | unknown;
    args?: unknown[];
    meta?: Record<string, unknown>;
    state?: unknown;
    staticState?: unknown;
    middlewares?: LitsxHostMiddlewareMap | null;
}
```

### `HostMiddlewareRuntime`

```ts
export declare class HostMiddlewareRuntime {
    constructor(host: unknown, entries?: LitsxStructuralEntryInput[] | ((host: unknown) => LitsxStructuralEntryInput[]));
    readonly host: unknown;
    readonly entries: LitsxStructuralEntry[];
    getEntry(index: number): LitsxStructuralEntry | null;
    ensureEntry(index: number, entry: LitsxStructuralEntryInput): LitsxStructuralEntry;
    read(index: number, args?: unknown[] | null, meta?: Record<string, unknown> | null): unknown;
    run(methodName: LitsxHostMiddlewareLifecycleMethod, base: () => unknown): unknown;
    run(methodName: LitsxHostMiddlewareLifecycleMethod, args: unknown[], base: () => unknown): unknown;
    connectedCallback(base: () => unknown): unknown;
    connectedCallback(args: unknown[], base: () => unknown): unknown;
    disconnectedCallback(base: () => unknown): unknown;
    disconnectedCallback(args: unknown[], base: () => unknown): unknown;
    attributeChangedCallback(args: unknown[], base: () => unknown): unknown;
    formAssociatedCallback(args: unknown[], base: () => unknown): unknown;
    formDisabledCallback(args: unknown[], base: () => unknown): unknown;
    formResetCallback(base: () => unknown): unknown;
    formResetCallback(args: unknown[], base: () => unknown): unknown;
    formStateRestoreCallback(args: unknown[], base: () => unknown): unknown;
    scheduleUpdate(base: () => unknown): unknown;
    scheduleUpdate(args: unknown[], base: () => unknown): unknown;
    shouldUpdate(args: unknown[], base: () => unknown): unknown;
    willUpdate(args: unknown[], base: () => unknown): unknown;
    update(args: unknown[], base: () => unknown): unknown;
    updated(args: unknown[], base: () => unknown): unknown;
    firstUpdated(args: unknown[], base: () => unknown): unknown;
    getUpdateComplete(base: () => unknown): unknown;
    getUpdateComplete(args: unknown[], base: () => unknown): unknown;
}
```

### `LitsxStructuralHostConstructor`

```ts
export type LitsxStructuralHostConstructor<TInstance = object> = abstract new (...args: any[]) => TInstance;
```

### `LitsxStructuralHostInstance`

```ts
export interface LitsxStructuralHostInstance {
    __litsxHostMiddlewareRuntime: HostMiddlewareRuntime;
    __litsxReadStructuralEntry(index: number, args?: unknown[] | null, meta?: Record<string, unknown> | null): unknown;
}
```

### `defineHook`

Define a structural hook.

The locked public authoring surface is `defineHook({ static, setup,
middlewares, accessors, use })`. The returned value remains callable like a
normal hook, while the compiler/runtime metadata bridge is carried
internally on the function.

```ts
/**
 * Define a structural hook.
 *
 * The locked public authoring surface is `defineHook({ static, setup,
 * middlewares, accessors, use })`. The returned value remains callable like a
 * normal hook, while the compiler/runtime metadata bridge is carried
 * internally on the function.
 */
export declare function defineHook<TArgs extends unknown[] = unknown[], TResult = unknown, TStaticState = undefined, TInstanceState = undefined>(definition: LitsxStructuralDefinition<TArgs, TResult, TStaticState, TInstanceState>): LitsxStructuralHook<TArgs, TResult>;
```

### `isStructuralHook`

```ts
export declare function isStructuralHook(value: unknown): value is LitsxStructuralHook;
```

### `resolveStructuralProps`

```ts
export declare function resolveStructuralProps(owner: unknown, base?: Record<PropertyKey, unknown> | null): Record<PropertyKey, unknown>;
```

### `resolveStructuralEntry`

```ts
export declare function resolveStructuralEntry(host: unknown, callsiteIndex: number, callsiteId: string, definition: unknown, args?: unknown[], meta?: Record<string, unknown>): unknown;
```

### `resolveStructuralStaticEntry`

```ts
export declare function resolveStructuralStaticEntry(owner: unknown, callsiteIndex: number, callsiteId: string, definition: unknown, args?: unknown[], meta?: Record<string, unknown>): unknown;
```

### `HostMiddlewareMixin`

```ts
export declare function HostMiddlewareMixin<TBase extends LitsxStructuralHostConstructor>(Base: TBase): LitsxStructuralHostConstructor<InstanceType<TBase> & LitsxStructuralHostInstance>;
```

### `createHostMiddlewareRuntime`

```ts
export declare function createHostMiddlewareRuntime(host: unknown, entries?: LitsxStructuralEntryInput[] | ((host: unknown) => LitsxStructuralEntryInput[])): HostMiddlewareRuntime;
```

## Forms And Element Internals

These types cover form-associated custom element primitives, validity snapshots, and the internal handles exposed by the form hooks surface.

### `LitsxFormSubmitValue`

```ts
export type LitsxFormSubmitValue = string | File | FormData | null;
```

### `LitsxElementInternalsHandle`

```ts
export interface LitsxElementInternalsHandle {
    supported: boolean;
    internals: ElementInternals | null;
}
```

### `LitsxFormValue`

```ts
export interface LitsxFormValue<TValue = LitsxFormSubmitValue> {
    form: HTMLFormElement | null;
    disabled: boolean;
    value: TValue;
    defaultValue: TValue;
    restoreState: TValue | null;
    restoreMode: string | null;
    setValue(next: TValue | ((value: TValue) => TValue)): TValue;
    setDefaultValue(next: TValue | ((value: TValue) => TValue)): TValue;
    setFormValue(value: LitsxFormSubmitValue, restoreState?: TValue): void;
}
```

### `LitsxValiditySnapshot`

```ts
export interface LitsxValiditySnapshot {
    badInput: boolean;
    customError: boolean;
    patternMismatch: boolean;
    rangeOverflow: boolean;
    rangeUnderflow: boolean;
    stepMismatch: boolean;
    tooLong: boolean;
    tooShort: boolean;
    typeMismatch: boolean;
    valid: boolean;
    valueMissing: boolean;
}
```

### `LitsxFormValidity`

```ts
export interface LitsxFormValidity {
    supported: boolean;
    willValidate: boolean;
    validity: LitsxValiditySnapshot;
    validationMessage: string;
    setValidity(flags?: ValidityStateFlags | null, message?: string, anchor?: HTMLElement | null): void;
    checkValidity(): boolean;
    reportValidity(): boolean;
}
```

## JSX Runtime

The JSX runtime is what lets editors, TypeScript, and compilers treat Lit<sup>sx</sup> as a first-class JSX framework.

### `jsx`

JSX factory for single-child LitSX nodes.

```ts
/**
 * JSX factory for single-child LitSX nodes.
 */
export declare function jsx(type: unknown, props: Record<string, unknown> | null, key?: string): LitsxJsxNode;
```

### `jsxs`

JSX factory for multi-child LitSX nodes.

```ts
/**
 * JSX factory for multi-child LitSX nodes.
 */
export declare function jsxs(type: unknown, props: Record<string, unknown> | null, key?: string): LitsxJsxNode;
```

### `JSX`

```ts
export namespace JSX {
    interface Element extends LitsxJsxNode {
    }
    interface ElementClass {
    }
    interface ElementChildrenAttribute {
        children: {};
    }
    interface IntrinsicAttributes {
        key?: string | number;
    }
    type IntrinsicElements = LitsxIntrinsicElements;
    interface IntrinsicClassAttributes<T> {
        ref?: LitsxRef<T>;
    }
    type LitsxBoundaryElementProps<TElement, TProps> = LitsxElementProps<TElement> & TProps;
    type LitsxComponentAuthoredAttributes = LitsxBaseAttributes & LitsxDomAttributes<EventTarget>;
    type LitsxComponentElementProps<TProps> = TProps & LitsxComponentAuthoredAttributes;
    type LibraryManagedAttributes<Component, Props> = Component extends typeof ErrorBoundary ? LitsxErrorBoundaryElementProps : Component extends typeof SuspenseBoundary ? LitsxSuspenseBoundaryElementProps : Component extends typeof SuspenseList ? LitsxBoundaryElementProps<SuspenseList, SuspenseListProps> : Component extends LitsxComponent<infer InferredProps> ? LitsxComponentElementProps<InferredProps> : LitsxComponentElementProps<Props>;
}
```

### `LitsxComponentProps`

```ts
export type LitsxComponentProps<T> = T extends typeof ErrorBoundary ? LitsxErrorBoundaryElementProps : T extends typeof SuspenseBoundary ? LitsxSuspenseBoundaryElementProps : T extends typeof SuspenseList ? JSX.LitsxBoundaryElementProps<SuspenseList, SuspenseListProps> : Record<string, unknown>;
```
