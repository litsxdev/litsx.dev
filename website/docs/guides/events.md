# Events

Lit<sup>sx</sup> events use the platform model end to end: listen with `on:event`, keep external callbacks fresh with `useEvent(...)`, and publish typed `CustomEvent`s with `useEmit(...)`.

## Listening in JSX

```tsx
<button on:click={save}>Save</button>
<input on:input={(event) => setQuery(event.currentTarget.value)} />
<user-picker on:user-selected={(event) => select(event.detail.id)} />
```

The colon marks the explicit event channel and preserves the event name. Native `onClick` is not an event alias; it remains an ordinary prop. The React compatibility pipeline translates React event conventions separately.

## Typed component events

Pass an event map to `useEmit` so emission and consumers share one contract:

```tsx
type PickerEvents = {
  "user-selected": { id: string };
  close: undefined;
};

export function UserPicker() {
  const emit = useEmit<PickerEvents>();
  return (
    <button on:click={() => emit("user-selected", { id: "ada" })}>
      Select Ada
    </button>
  );
}

const picker = (
  <UserPicker on:user-selected={(event) => event.detail.id} />
);
```

Literal event names let the compiler publish a complete event contract on the component. Use lowercase kebab-case for public declarative events. Names outside the JSX channel, such as `menu:open`, remain available through `addEventListener()`.

`useEmit(...)` defaults to `{ bubbles: true, composed: true, cancelable: false }`; pass options when a component needs a different public event contract.

## External listeners

`useEvent(...)` returns a stable callback that always sees current props and state. Pair it with `useOnConnect(...)` for listeners or resources registered against `window`, `document`, observers, or timers.

```tsx
const onResize = useEvent(() => measure(layout));

useOnConnect(() => {
  window.addEventListener("resize", onResize);
  return () => window.removeEventListener("resize", onResize);
}, []);
```

## Related

- [useEmit](../reference/generated/useemit.md)
- [useEvent](../reference/generated/useevent.md)
- [JSX authoring](./jsx-authoring.md)
