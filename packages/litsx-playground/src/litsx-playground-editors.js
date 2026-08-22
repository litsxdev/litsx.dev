import { EditorState } from "@codemirror/state";
import { cssLanguage } from "@codemirror/lang-css";
import { HighlightStyle, LanguageSupport, syntaxHighlighting } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { parseMixed } from "@lezer/common";
import { tags as t } from "@lezer/highlight";
import { basicSetup } from "codemirror";

function getCssTemplateRanges(templateNode) {
  const ranges = [];
  let rangeStart = templateNode.from + 1;

  for (let child = templateNode.node.firstChild; child; child = child.nextSibling) {
    if (child.name !== "Interpolation") continue;
    if (rangeStart < child.from) {
      ranges.push({ from: rangeStart, to: child.from });
    }
    rangeStart = child.to;
  }

  const contentEnd = Math.max(templateNode.from + 1, templateNode.to - 1);
  if (rangeStart < contentEnd) {
    ranges.push({ from: rangeStart, to: contentEnd });
  }

  return ranges;
}

function createCssTemplateWrapper() {
  return parseMixed((node, input) => {
    if (node.name !== "TemplateString") return null;

    const parent = node.node.parent;
    if (parent?.name !== "TaggedTemplateExpression") return null;

    const tag = input.read(parent.from, node.from).trim();
    if (tag !== "css") return null;

    return {
      parser: cssLanguage.parser,
      overlay: getCssTemplateRanges(node),
    };
  });
}

function createLitsxJavascriptSupport(options) {
  const base = javascript(options);
  const language = base.language.configure({
    wrap: createCssTemplateWrapper(),
  }, options.typescript ? "litsx-tsx" : "litsx-jsx");
  return new LanguageSupport(language, base.support);
}

const sourceLanguageSupport = createLitsxJavascriptSupport({
  typescript: true,
  jsx: true,
});

const emittedLanguageSupport = createLitsxJavascriptSupport({
  jsx: true,
});

const editorSyntaxHighlighting = syntaxHighlighting(
  HighlightStyle.define([
    { tag: [t.keyword, t.atom, t.bool, t.modifier], color: "var(--litsx-editor-keyword)" },
    { tag: [t.typeName, t.className, t.namespace], color: "var(--litsx-editor-type)" },
    { tag: [t.number, t.integer, t.float], color: "var(--litsx-editor-number)" },
    { tag: [t.string, t.special(t.string), t.regexp], color: "var(--litsx-editor-string)" },
    { tag: [t.propertyName, t.variableName, t.labelName], color: "var(--litsx-editor-fg)" },
    { tag: [t.operator, t.punctuation, t.separator, t.bracket], color: "var(--litsx-editor-operator)" },
    { tag: [t.comment, t.lineComment, t.blockComment], color: "var(--litsx-editor-muted)" },
    { tag: [t.function(t.variableName), t.function(t.propertyName)], color: "var(--litsx-editor-fg)" },
  ])
);

const sourceEditorTheme = EditorView.theme({
  "&": {
    fontSize: "0.9rem",
    backgroundColor: "var(--litsx-editor-bg)",
    color: "var(--litsx-editor-fg)",
  },
  ".cm-scroller": {
    fontFamily: '"SFMono-Regular", "Menlo", "Monaco", monospace',
    lineHeight: "1.6",
    backgroundColor: "var(--litsx-editor-bg)",
  },
  ".cm-gutters": {
    border: "0",
    backgroundColor: "transparent",
    color: "var(--litsx-editor-muted)",
  },
  ".cm-foldGutter .cm-gutterElement": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "transparent",
  },
  ".cm-activeLine": {
    backgroundColor: "var(--litsx-editor-line)",
  },
  ".cm-focused": {
    outline: "none",
  },
  ".cm-content, .cm-line": {
    caretColor: "var(--litsx-editor-caret)",
  },
  ".cm-cursor, .cm-dropCursor": {
    borderLeftColor: "var(--litsx-editor-caret)",
  },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground, ::selection": {
    backgroundColor: "var(--litsx-editor-selection)",
  },
  ".cm-selectionMatch": {
    backgroundColor: "color-mix(in srgb, var(--litsx-editor-selection) 68%, transparent)",
  },
  ".cm-matchingBracket": {
    backgroundColor: "color-mix(in srgb, var(--litsx-editor-caret) 18%, transparent)",
    outline: "1px solid color-mix(in srgb, var(--litsx-editor-caret) 34%, transparent)",
  },
  ".cm-nonmatchingBracket": {
    backgroundColor: "color-mix(in srgb, var(--vp-c-danger-soft) 80%, transparent)",
    outline: "1px solid color-mix(in srgb, var(--vp-c-danger-1) 38%, transparent)",
  },
});

const emittedEditorTheme = EditorView.theme({
  "&": {
    fontSize: "0.9rem",
    backgroundColor: "var(--litsx-editor-bg)",
    color: "var(--litsx-editor-fg)",
  },
  ".cm-scroller": {
    fontFamily: '"SFMono-Regular", "Menlo", "Monaco", monospace',
    lineHeight: "1.6",
    backgroundColor: "var(--litsx-editor-bg)",
  },
  ".cm-gutters": {
    border: "0",
    backgroundColor: "transparent",
    color: "var(--litsx-editor-muted)",
  },
  ".cm-activeLine, .cm-activeLineGutter": {
    backgroundColor: "transparent",
  },
  ".cm-focused": {
    outline: "none",
  },
});

export function createSourceEditorState(doc, onChange) {
  return EditorState.create({
    doc,
    extensions: [
      basicSetup,
      sourceLanguageSupport,
      editorSyntaxHighlighting,
      sourceEditorTheme,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          onChange(update.state.doc.toString());
        }
      }),
    ],
  });
}

export function createEmittedEditorState(doc) {
  return EditorState.create({
    doc,
    extensions: [
      basicSetup,
      emittedLanguageSupport,
      editorSyntaxHighlighting,
      emittedEditorTheme,
      EditorState.readOnly.of(true),
      EditorView.editable.of(false),
    ],
  });
}

export function setEditorDocument(view, nextDoc) {
  if (!view) return;
  const currentDoc = view.state.doc.toString();
  if (currentDoc === nextDoc) return;

  view.dispatch({
    changes: {
      from: 0,
      to: currentDoc.length,
      insert: nextDoc,
    },
  });
}
