// @vitest-environment jsdom

import assert from "assert";
import { syntaxTree } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { describe, expect, it, vi } from "vitest";
import {
  createEmittedEditorState,
  createSourceEditorState,
  setEditorDocument,
} from "../packages/litsx-playground/src/litsx-playground-editors.js";

describe("@litsx/playground editors", () => {
  it("notifies source editor changes only when the document changes", () => {
    const onChange = vi.fn();
    const view = new EditorView({
      state: createSourceEditorState("export const Demo = () => <button />;", onChange),
      parent: document.body.appendChild(document.createElement("div")),
    });

    try {
      view.dispatch({
        selection: { anchor: 0 },
      });
      expect(onChange).not.toHaveBeenCalled();

      view.dispatch({
        changes: {
          from: 0,
          to: 0,
          insert: "const ready = true;\n",
        },
      });
      expect(onChange).toHaveBeenCalledWith(
        "const ready = true;\nexport const Demo = () => <button />;",
      );
    } finally {
      view.destroy();
    }
  });

  it("parses source as standard TypeScript and JSX", () => {
    const state = createSourceEditorState(
      "const label: string = 'Save'; export const Card = () => <button on:click={save}>{label}</button>;",
      vi.fn(),
    );
    const tree = syntaxTree(state);
    let hasError = false;

    tree.iterate({
      enter(node) {
        hasError ||= node.type.isError;
      },
    });

    expect(hasError).toBe(false);
    expect(tree.toString()).toContain("JSXElement");
  });

  it("renders standard component metadata in the source editor", () => {
    const view = new EditorView({
      state: createSourceEditorState(
        "export const Card = () => <button />; Card.styles = css`:host { display: block; color: red; }`;",
        vi.fn(),
      ),
      parent: document.body.appendChild(document.createElement("div")),
    });

    try {
      expect(view.dom.textContent).toContain("Card.styles");
      expect(view.dom.textContent).toContain("css`");
    } finally {
      view.destroy();
    }
  });

  it("parses css tagged templates with the embedded CSS language", () => {
    const source = "Card.styles = css`:host { display: block; color: ${tone}; }`;";
    const tree = syntaxTree(createSourceEditorState(source, vi.fn()));

    const displayNode = tree.resolveInner(source.indexOf("display") + 1, -1);
    const blockNode = tree.resolveInner(source.indexOf("block") + 1, -1);
    const toneNode = tree.resolveInner(source.indexOf("tone") + 1, -1);

    expect(displayNode.name).toBe("PropertyName");
    expect(displayNode.parent?.name).toBe("Declaration");
    expect(blockNode.name).toBe("ValueName");
    expect(toneNode.name).toBe("VariableName");
    expect(toneNode.parent?.name).toBe("Interpolation");
  });

  it("does not parse ordinary template strings as CSS", () => {
    const source = "const text = `:host { display: block; }`;";
    const tree = syntaxTree(createSourceEditorState(source, vi.fn()));
    const displayNode = tree.resolveInner(source.indexOf("display") + 1, -1);

    expect(displayNode.name).toBe("TemplateString");
  });

  it("keeps source editor views mountable with standard metadata", () => {
    const view = new EditorView({
      state: createSourceEditorState(
        "export const Card = () => <button />; Card.styles = css`:host { display: block; color: red; }`;",
        vi.fn(),
      ),
      parent: document.body.appendChild(document.createElement("div")),
    });

    try {
      expect(view.dom.textContent).toContain("Card.styles");
    } finally {
      view.destroy();
    }
  });

  it("updates emitted editor documents only when content changes", () => {
    const state = createEmittedEditorState("export const current = true;");
    const view = {
      state,
      dispatch: vi.fn(),
    };

    setEditorDocument(view, "export const current = true;");
    expect(view.dispatch).not.toHaveBeenCalled();

    setEditorDocument(view, "export const current = false;");
    expect(view.dispatch).toHaveBeenCalledWith({
      changes: {
        from: 0,
        to: "export const current = true;".length,
        insert: "export const current = false;",
      },
    });

    assert.strictEqual(state.facet(EditorState.readOnly), true);
  });
});
