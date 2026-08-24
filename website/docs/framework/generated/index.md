# Framework Reference

This reference is generated from the public Lit<sup>sx</sup> type surface in `packages/core/src/*.d.ts`.

It documents the framework API that authors write against. Internal helpers and transform-only support APIs are intentionally left out.

## Language Model

Lit<sup>sx</sup> is a compiler and runtime for writing Lit-based web components with standard JSX and TSX.

- JSX is the authored language
- Lit is the rendering foundation
- web components are the deployed unit
- React compatibility is optional and exists only for legacy migration

## JSX Surface

Lit<sup>sx</sup> source uses standard JSX/TSX syntax:

- authors write ordinary prop and attribute names; the compiler selects Lit binding kinds from the destination contract
- event listeners use the explicit `on:event` channel
- component metadata uses top-level assignments such as `ActionButton.styles = css` and `ActionButton.properties = {...}`
- `.jsx` and `.tsx` work with the standard TypeScript, editor, lint, and formatting ecosystem

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
export interface LitsxComponentStatic<Events extends Record<string, unknown> = Record<string, unknown>> {
    readonly [LITSX_COMPONENT]: true;
    readonly [LITSX_EVENTS]?: LitsxEventDeclaration<Events, boolean>;
    readonly events?: LitsxEventDeclaration<Events, boolean>;
}
```

### `LitsxHydratableComponentStatic`

```ts
export interface LitsxHydratableComponentStatic extends LitsxComponentStatic {
    readonly [LITSX_HYDRATABLE_TAG]: string;
}
```

### `LitsxHostTypeIdStatic`

```ts
export interface LitsxHostTypeIdStatic extends LitsxComponentStatic {
    readonly [LITSX_HOST_TYPE_ID]: string;
    readonly [LITSX_LIGHT_DOM_STYLE_SCOPE]?: string;
}
```

### `LitsxStyleSourceRegistry`

Extension point for compile-time-only Component.styles sources. Packages
augment this registry without widening Lit's runtime CSSResultGroup.

```ts
/**
 * Extension point for compile-time-only Component.styles sources. Packages
 * augment this registry without widening Lit's runtime CSSResultGroup.
 */
export interface LitsxStyleSourceRegistry {
}
```

### `LitsxAuthoringStyle`

```ts
export type LitsxAuthoringStyle = CSSResultGroup | LitsxStyleSourceRegistry[keyof LitsxStyleSourceRegistry] | readonly LitsxAuthoringStyle[];
```

### `LitsxStyleInfo`

Property map accepted by Lit's styleMap directive in JSX style bindings.

```ts
/** Property map accepted by Lit's styleMap directive in JSX style bindings. */
export type LitsxStyleInfo = Readonly<Record<string, string | number | null | undefined>>;
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
export type LitsxRenderable = LitsxJsxNode | TemplateResult | DirectiveResult | string | number | boolean | null | undefined | Iterable<unknown>;
```

### `LitsxRef`

A Lit-native ref. Assignment uses `.value`; cleanup publishes `undefined`.

```ts
/** A Lit-native ref. Assignment uses `.value`; cleanup publishes `undefined`. */
export type LitsxRef<T> = {
    value: T | undefined;
} | {
    bivarianceHack(value: T | undefined): void;
}["bivarianceHack"];
```

### `LitsxComponent`

```ts
export type LitsxComponent<Props = Record<string, unknown>, Events extends Record<string, unknown> = Record<string, unknown>> = ((props: Props) => LitsxRenderable) & {
    readonly events?: LitsxEventDeclaration<Events, boolean>;
    styles?: LitsxAuthoringStyle;
};
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
    id?: string;
    slot?: string;
    class?: string;
    accesskey?: string;
    autocapitalize?: string;
    autofocus?: boolean;
    contenteditable?: boolean | "true" | "false" | "plaintext-only";
    dir?: "ltr" | "rtl" | "auto";
    draggable?: boolean;
    enterkeyhint?: string;
    hidden?: boolean | "until-found";
    inert?: boolean;
    inputmode?: string;
    is?: string;
    itemid?: string;
    itemprop?: string;
    itemref?: string;
    itemscope?: boolean;
    itemtype?: string;
    lang?: string;
    nonce?: string;
    popover?: boolean | "" | "auto" | "manual" | "hint";
    role?: string;
    tabindex?: string | number;
    title?: string;
    translate?: boolean | "yes" | "no";
    virtualkeyboardpolicy?: "auto" | "manual";
    writingsuggestions?: boolean | "true" | "false";
    autoFocus?: boolean;
    spellCheck?: boolean;
    spellcheck?: boolean;
    part?: string;
    exportparts?: string;
    /** Inline CSS text or a property map applied through Lit's styleMap directive. */
    style?: string | LitsxStyleInfo | null;
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

### `LitsxEventMetadata`

```ts
export interface LitsxEventMetadata {
    readonly events: readonly string[];
    readonly complete: boolean;
}
```

### `LitsxEventDeclaration`

```ts
export interface LitsxEventDeclaration<Events extends Record<string, unknown>, Complete extends boolean = boolean> extends LitsxEventMetadata {
    readonly complete: Complete;
    readonly __types?: Events;
}
```

### `LitsxEventHandler`

```ts
export type LitsxEventHandler<TEvent extends Event = Event> = {
    bivarianceHack(event: TEvent): unknown;
}["bivarianceHack"];
```

### `LitsxEventListener`

```ts
export type LitsxEventListener<TEvent extends Event = Event> = LitsxEventHandler<TEvent> | {
    handleEvent: LitsxEventHandler<TEvent>;
    capture?: boolean;
    once?: boolean;
    passive?: boolean;
};
```

### `LitsxStandardDomEventAttributes`

React-style DOM event props used by the optional compatibility surface.

```ts
/** React-style DOM event props used by the optional compatibility surface. */
export type LitsxStandardDomEventAttributes<Target = EventTarget> = {
    [EventName in keyof GlobalEventHandlersEventMap as `on${Capitalize<EventName & string>}`]?: LitsxEventHandler<GlobalEventHandlersEventMap[EventName] & {
        currentTarget: Target;
    }>;
} & {
    [EventName in keyof GlobalEventHandlersEventMap as `on${Capitalize<EventName & string>}Capture`]?: LitsxEventHandler<GlobalEventHandlersEventMap[EventName] & {
        currentTarget: Target;
    }>;
} & {
    onDoubleClick?: LitsxEventHandler<MouseEvent & {
        currentTarget: Target;
    }>;
    onDoubleClickCapture?: LitsxEventHandler<MouseEvent & {
        currentTarget: Target;
    }>;
    onMouseDown?: LitsxEventHandler<MouseEvent & {
        currentTarget: Target;
    }>;
    onMouseDownCapture?: LitsxEventHandler<MouseEvent & {
        currentTarget: Target;
    }>;
    onMouseUp?: LitsxEventHandler<MouseEvent & {
        currentTarget: Target;
    }>;
    onMouseUpCapture?: LitsxEventHandler<MouseEvent & {
        currentTarget: Target;
    }>;
    onMouseMove?: LitsxEventHandler<MouseEvent & {
        currentTarget: Target;
    }>;
    onMouseMoveCapture?: LitsxEventHandler<MouseEvent & {
        currentTarget: Target;
    }>;
    onMouseEnter?: LitsxEventHandler<MouseEvent & {
        currentTarget: Target;
    }>;
    onMouseLeave?: LitsxEventHandler<MouseEvent & {
        currentTarget: Target;
    }>;
    onPointerDown?: LitsxEventHandler<PointerEvent & {
        currentTarget: Target;
    }>;
    onPointerDownCapture?: LitsxEventHandler<PointerEvent & {
        currentTarget: Target;
    }>;
    onPointerUp?: LitsxEventHandler<PointerEvent & {
        currentTarget: Target;
    }>;
    onPointerUpCapture?: LitsxEventHandler<PointerEvent & {
        currentTarget: Target;
    }>;
    onPointerMove?: LitsxEventHandler<PointerEvent & {
        currentTarget: Target;
    }>;
    onPointerMoveCapture?: LitsxEventHandler<PointerEvent & {
        currentTarget: Target;
    }>;
    onPointerEnter?: LitsxEventHandler<PointerEvent & {
        currentTarget: Target;
    }>;
    onPointerLeave?: LitsxEventHandler<PointerEvent & {
        currentTarget: Target;
    }>;
    onPointerCancel?: LitsxEventHandler<PointerEvent & {
        currentTarget: Target;
    }>;
    onKeyDown?: LitsxEventHandler<KeyboardEvent & {
        currentTarget: Target;
    }>;
    onKeyDownCapture?: LitsxEventHandler<KeyboardEvent & {
        currentTarget: Target;
    }>;
    onKeyUp?: LitsxEventHandler<KeyboardEvent & {
        currentTarget: Target;
    }>;
    onKeyUpCapture?: LitsxEventHandler<KeyboardEvent & {
        currentTarget: Target;
    }>;
    onTouchStart?: LitsxEventHandler<TouchEvent & {
        currentTarget: Target;
    }>;
    onTouchStartCapture?: LitsxEventHandler<TouchEvent & {
        currentTarget: Target;
    }>;
    onTouchMove?: LitsxEventHandler<TouchEvent & {
        currentTarget: Target;
    }>;
    onTouchMoveCapture?: LitsxEventHandler<TouchEvent & {
        currentTarget: Target;
    }>;
    onTouchEnd?: LitsxEventHandler<TouchEvent & {
        currentTarget: Target;
    }>;
    onTouchEndCapture?: LitsxEventHandler<TouchEvent & {
        currentTarget: Target;
    }>;
    onDragStart?: LitsxEventHandler<DragEvent & {
        currentTarget: Target;
    }>;
    onDragEnd?: LitsxEventHandler<DragEvent & {
        currentTarget: Target;
    }>;
    onDragEnter?: LitsxEventHandler<DragEvent & {
        currentTarget: Target;
    }>;
    onDragLeave?: LitsxEventHandler<DragEvent & {
        currentTarget: Target;
    }>;
    onDragOver?: LitsxEventHandler<DragEvent & {
        currentTarget: Target;
    }>;
    onAnimationStart?: LitsxEventHandler<AnimationEvent & {
        currentTarget: Target;
    }>;
    onAnimationEnd?: LitsxEventHandler<AnimationEvent & {
        currentTarget: Target;
    }>;
    onAnimationIteration?: LitsxEventHandler<AnimationEvent & {
        currentTarget: Target;
    }>;
    onTransitionEnd?: LitsxEventHandler<TransitionEvent & {
        currentTarget: Target;
    }>;
};
```

### `LitsxExplicitDomEventAttributes`

```ts
export type LitsxExplicitDomEventAttributes<Target = EventTarget> = {
    [EventName in keyof GlobalEventHandlersEventMap as `on:${EventName & string}`]?: LitsxEventListener<GlobalEventHandlersEventMap[EventName] & {
        currentTarget: Target;
    }>;
};
```

### `LitsxExplicitCustomEventAttributes`

Explicit JSX event channel for custom-element events.

```ts
/** Explicit JSX event channel for custom-element events. */
export type LitsxExplicitCustomEventAttributes = {
    [Name in `on:${string}`]?: LitsxEventListener<any>;
};
```

### `LitsxStandardCustomEventAttributes`

```ts
/** @deprecated Use LitsxExplicitCustomEventAttributes. */
export type LitsxStandardCustomEventAttributes<Props = {}> = LitsxExplicitCustomEventAttributes;
```

### `LitsxTypedCustomEventAttributes`

```ts
export type LitsxTypedCustomEventAttributes<Events extends Record<string, unknown>, Target = EventTarget> = {
    [Name in Extract<keyof Events, string> as LitsxStandardRepresentableEventName<Name> extends never ? never : `on:${Name}`]?: LitsxEventListener<CustomEvent<Events[Name]> & {
        currentTarget: Target;
    }>;
};
```

### `LitsxDomAttributes`

```ts
export type LitsxDomAttributes<Target = EventTarget> = LitsxExplicitDomEventAttributes<Target> & {
    _currentTarget?: Target | undefined;
};
```

### `LitsxHostElementProps`

```ts
export type LitsxHostElementProps<TElement> = Omit<Partial<TElement>, "children" | "style" | "part" | "slot" | "className" | "htmlFor">;
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
} & LitsxCustomIntrinsicElements;
```

## SSR And Execution Context

These APIs let framework and library integrations carry request-local state and serializable resource snapshots across server rendering and hydration.

### `ExecutionContextKey`

```ts
export interface ExecutionContextKey<T> {
    readonly __brand?: T;
}
```

### `LitsxExecutionContext`

```ts
export interface LitsxExecutionContext {
    get<T>(key: ExecutionContextKey<T>): T | undefined;
    set<T>(key: ExecutionContextKey<T>, value: T): void;
    has<T>(key: ExecutionContextKey<T>): boolean;
}
```

### `JsonSerializable`

```ts
export type JsonSerializable = null | boolean | number | string | JsonSerializable[] | {
    [key: string]: JsonSerializable;
};
```

### `SsrResourceSnapshotOptions`

```ts
export interface SsrResourceSnapshotOptions {
    /** Stable library-owned identity for the global resource cache. */
    key: string;
    /** Read the completed cache after the final SSR render pass. */
    capture: () => JsonSerializable;
    /** Restore the cache synchronously before hydration modules render. */
    restore: (snapshot: JsonSerializable) => void;
}
```

### `createExecutionContextKey`

```ts
export declare function createExecutionContextKey<T>(description?: string): ExecutionContextKey<T>;
```

### `getCurrentExecutionContext`

```ts
export declare function getCurrentExecutionContext(): LitsxExecutionContext | null;
```

### `useSsrResourceSnapshot`

Register or restore a library-owned global SSR resource cache.

This hook is inert outside an active LitSX SSR render or hydration payload.
Library runtimes should expose higher-level hooks rather than asking
applications to call this API or install hydration bootstrap code.

Detailed reference: [`useSsrResourceSnapshot`](../../reference/generated/usessrresourcesnapshot.md)

```ts
/**
 * Register or restore a library-owned global SSR resource cache.
 *
 * This hook is inert outside an active LitSX SSR render or hydration payload.
 * Library runtimes should expose higher-level hooks rather than asking
 * applications to call this API or install hydration bootstrap code.
 */
export declare function useSsrResourceSnapshot(options: SsrResourceSnapshotOptions): void;
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

### `lazy`

Declare a lazily imported LitSX component. The compiler lowers usages to a
scoped ensureLazyElement registration and preserves the component's props.

```ts
/**
 * Declare a lazily imported LitSX component. The compiler lowers usages to a
 * scoped ensureLazyElement registration and preserves the component's props.
 */
export declare function lazy<TComponent extends (...args: any[]) => unknown>(loader: () => Promise<TComponent | {
    default: TComponent;
}>): TComponent;
```

### `renderWithHooks`

```ts
export declare function renderWithHooks<T>(host: object, render: () => T): T;
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

Detailed reference: [`useEmit`](../../reference/generated/useemit.md)

```ts
export declare function useEmit<Events extends Record<string, unknown> | undefined = undefined>(): Events extends Record<string, unknown> ? LitsxTypedEmit<Events> : LitsxEmit;
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

Detailed reference: [`useHostTypeId`](../../reference/generated/usehosttypeid.md)

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

Store a Lit-native mutable value across renders without causing updates.
The returned object exposes `.value`; an attached JSX ref is cleared with
`undefined` when its target disconnects.

Detailed reference: [`useRef`](../../reference/generated/useref.md)

```ts
/**
 * Store a Lit-native mutable value across renders without causing updates.
 * The returned object exposes `.value`; an attached JSX ref is cleared with
 * `undefined` when its target disconnects.
 */
export declare function useRef<T>(initialValue?: T): {
    value: T | undefined;
};
```

### `useId`

Generate a stable id for the current component instance.

Detailed reference: [`useId`](../../reference/generated/useid.md)

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

Detailed reference: [`useStableId`](../../reference/generated/usestableid.md)

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
export declare function useCallbackRef(getTarget: () => Element | undefined, callback: (node: Element | undefined) => void, deps?: unknown[]): void;
```

### `useExpose`

Detailed reference: [`useExpose`](../../reference/generated/useexpose.md)

```ts
export declare function useExpose<T extends Record<string, (...args: any[]) => unknown>>(ref: {
    value: T | undefined;
} | ((value: T | undefined) => void), createHandle: () => T, deps?: unknown[]): void;
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

### `replaceStyles`

Return a CSSResultGroup that replaces, rather than extends, inherited styles.

```ts
/** Return a CSSResultGroup that replaces, rather than extends, inherited styles. */
export declare function replaceStyles(styles: CSSResultGroup): CSSResultGroup;
```

### `resolveStyle`

```ts
export declare function resolveStyle(value: DirectiveResult): DirectiveResult;
```

## Structural Hooks And Host Capabilities

Structural hooks request ordinary class mixins for capabilities that must exist on the generated custom-element host.

### `LitsxStructuralMixin`

```ts
export type LitsxStructuralMixin<THost extends object = object> = (Base: any) => abstract new (...args: any[]) => THost;
```

### `LitsxStructuralMixinDefinition`

```ts
export interface LitsxStructuralMixinDefinition<THost extends object = object> {
    /** Host capability installed once per distinct mixin. */
    mixin: LitsxStructuralMixin<THost>;
    /** Omit the reader for an installation-only structural hook. */
    use?: never;
}
```

### `LitsxStructuralDefinition`

```ts
export interface LitsxStructuralDefinition<THost extends object = object, TArgs extends unknown[] = unknown[], TResult = unknown> {
    /** Host capability installed once per distinct mixin. */
    mixin?: LitsxStructuralMixin<THost>;
    /** Render-time reader. Call useHost() when the capability needs its host. */
    use(...args: TArgs): TResult;
}
```

### `LitsxStructuralHook`

```ts
export type LitsxStructuralHook<TArgs extends unknown[] = unknown[], TResult = unknown> = (...args: TArgs) => TResult;
```

### `defineHook`

Define a hook that requests and reads a host capability.

```ts
/** Define a hook that requests and reads a host capability. */
export declare function defineHook<THost extends object = object, TArgs extends unknown[] = unknown[], TResult = unknown>(definition: LitsxStructuralDefinition<THost, TArgs, TResult>): LitsxStructuralHook<TArgs, TResult>;
```

### `readStructuralHook`

```ts
export declare function readStructuralHook<TArgs extends unknown[], TResult>(hook: LitsxStructuralHook<TArgs, TResult>, args?: TArgs): TResult;
```

### `applyStructuralHooks`

```ts
export declare function applyStructuralHooks<TBase extends abstract new (...args: any[]) => object>(Base: TBase, hooks?: readonly LitsxStructuralHook[]): TBase;
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

### `LitsxEmitOptions`

Emit a CustomEvent from the current host.

```ts
/**
 * Emit a CustomEvent from the current host.
 */
export type LitsxEmitOptions = {
    bubbles?: boolean;
    composed?: boolean;
    cancelable?: boolean;
};
```

### `LitsxEmit`

```ts
export type LitsxEmit = <T = undefined>(type: string, detail?: T, options?: LitsxEmitOptions) => boolean;
```

### `LitsxTypedEmit`

```ts
export type LitsxTypedEmit<Events extends Record<string, unknown>> = <Name extends Extract<keyof Events, string>>(type: Name, ...args: undefined extends Events[Name] ? [
    detail?: Events[Name],
    options?: LitsxEmitOptions
] : [
    detail: Events[Name],
    options?: LitsxEmitOptions
]) => boolean;
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
    type LitsxComponentEventMap<Component> = Component extends {
        readonly events: LitsxEventDeclaration<infer Events, infer Complete>;
    } ? Complete extends true ? Events : {} : {};
    type LitsxComponentAuthoredAttributes<TProps, TEvents extends Record<string, unknown>> = LitsxBaseAttributes & (keyof TEvents extends never ? LitsxExplicitCustomEventAttributes : Omit<LitsxDomAttributes<EventTarget>, `on:${Extract<keyof TEvents, string>}`> & LitsxTypedCustomEventAttributes<TEvents>);
    type LitsxNormalizeManagedProps<TProps> = 0 extends (1 & TProps) ? {} : TProps;
    type LitsxComponentElementProps<TProps, TEvents extends Record<string, unknown> = {}> = LitsxNormalizeManagedProps<TProps> & LitsxComponentAuthoredAttributes<LitsxNormalizeManagedProps<TProps>, TEvents>;
    type LibraryManagedAttributes<Component, Props> = Component extends typeof ErrorBoundary ? LitsxErrorBoundaryElementProps : Component extends typeof SuspenseBoundary ? LitsxSuspenseBoundaryElementProps : Component extends typeof SuspenseList ? LitsxBoundaryElementProps<SuspenseList, SuspenseListProps> : LitsxComponentElementProps<Props, LitsxComponentEventMap<Component>>;
}
```

### `LitsxComponentProps`

```ts
export type LitsxComponentProps<T> = T extends typeof ErrorBoundary ? LitsxErrorBoundaryElementProps : T extends typeof SuspenseBoundary ? LitsxSuspenseBoundaryElementProps : T extends typeof SuspenseList ? JSX.LitsxBoundaryElementProps<SuspenseList, SuspenseListProps> : Record<string, unknown>;
```
