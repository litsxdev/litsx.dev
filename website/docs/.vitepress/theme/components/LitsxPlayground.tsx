import { LitsxPlayground } from "@litsx/playground";

if (typeof customElements !== "undefined" && !customElements.get("litsx-playground")) {
  customElements.define(
    "litsx-playground",
    LitsxPlayground as unknown as CustomElementConstructor
  );
}
