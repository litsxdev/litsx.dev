import { Decoration, EditorView, ViewPlugin } from "@codemirror/view";
import { cssLanguage } from "@codemirror/lang-css";
import { javascript, javascriptLanguage } from "@codemirror/lang-javascript";
import {
  foldEffect,
  foldService,
  Language,
  LanguageSupport,
  syntaxTree,
} from "@codemirror/language";
import { linter } from "@codemirror/lint";
import { highlightTree, classHighlighter } from "@lezer/highlight";
import { Parser } from "@lezer/common";
import { createVirtualLitsxJsxSource } from "@litsx/authoring";

export const litsxSourceTheme = EditorView.theme({
  ".tok-keyword, .tok-keyword *": {
    color: "var(--litsx-editor-keyword)",
  },
  ".tok-atom, .tok-atom *": {
    color: "var(--litsx-editor-keyword)",
  },
  ".tok-bool, .tok-bool *": {
    color: "var(--litsx-editor-keyword)",
  },
  ".tok-propertyName, .tok-propertyName *": {
    color: "var(--litsx-editor-fg)",
  },
  ".tok-typeName, .tok-typeName *": {
    color: "var(--litsx-editor-type)",
  },
  ".tok-className, .tok-className *": {
    color: "var(--litsx-editor-type)",
  },
  ".tok-number, .tok-number *": {
    color: "var(--litsx-editor-number)",
  },
  ".tok-string, .tok-string *": {
    color: "var(--litsx-editor-string)",
  },
  ".tok-variableName, .tok-variableName *": {
    color: "var(--litsx-editor-fg)",
  },
  ".tok-operator, .tok-operator *": {
    color: "var(--litsx-editor-operator)",
  },
  ".tok-punctuation, .tok-punctuation *": {
    color: "var(--litsx-editor-operator)",
  },
  ".cm-litsx-lit-attr-prefix, .cm-litsx-lit-attr-prefix *, .tok-propertyName .cm-litsx-lit-attr-prefix, .tok-propertyName .cm-litsx-lit-attr-prefix *": {
    color: "var(--litsx-editor-keyword)",
    fontWeight: "600",
  },
  ".cm-litsx-lit-attr-name, .cm-litsx-lit-attr-name *, .tok-propertyName .cm-litsx-lit-attr-name, .tok-propertyName .cm-litsx-lit-attr-name *": {
    color: "var(--litsx-editor-fg)",
  },
  ".cm-litsx-static-hoist-name, .cm-litsx-static-hoist-name *": {
    color: "var(--litsx-editor-fg)",
  },
  ".cm-diagnostic.cm-diagnostic-error": {
    borderBottom: "2px wavy color-mix(in srgb, var(--vp-c-danger-1) 82%, transparent)",
  },
});

const javascriptTsxSupport = javascript({
  typescript: true,
  jsx: true,
});

class LitsxVirtualizedParser extends Parser {
  constructor(baseParser) {
    super();
    this.baseParser = baseParser;
  }

  createParse(input, fragments, ranges) {
    const source =
      typeof input === "string" ? input : input.read(0, input.length);
    const virtualSource = createVirtualLitsxJsxSource(source, {
      strategy: "editor",
    });

    return this.baseParser.startParse(virtualSource.code, fragments, ranges);
  }
}

const litsxEditorParser = new LitsxVirtualizedParser(
  javascriptTsxSupport.language.parser
);

const EMBEDDED_CSS_CALL_NAMES = new Set([
  "staticStyles",
  "__litsx_static_styles",
  "$styles",
]);

const STATIC_HOIST_ASSIGNMENT_NAME = "$styles";

const litsxSourceLanguage = new Language(
  javascriptLanguage.data,
  litsxEditorParser,
  [],
  "litsx-source"
);

function isWhitespace(char) {
  return char === " " || char === "\t" || char === "\n" || char === "\r";
}

function isStaticHoistLineStart(text) {
  return /^\s*static\s+[A-Za-z_$][\w$]*\s*=/.test(text);
}

function isHoistLineStart(text) {
  return isStaticHoistLineStart(text);
}

function scanQuotedString(sourceText, start, quote) {
  let index = start + 1;

  while (index < sourceText.length) {
    const char = sourceText[index];
    if (char === "\\") {
      index += 2;
      continue;
    }
    if (char === quote) {
      return index + 1;
    }
    index += 1;
  }

  return index;
}

function scanLineComment(sourceText, start) {
  let index = start + 2;
  while (index < sourceText.length && sourceText[index] !== "\n") {
    index += 1;
  }
  return index;
}

function scanBlockComment(sourceText, start) {
  let index = start + 2;
  while (index < sourceText.length) {
    if (sourceText[index] === "*" && sourceText[index + 1] === "/") {
      return index + 2;
    }
    index += 1;
  }
  return index;
}

function scanTemplateLiteral(sourceText, start) {
  let index = start + 1;

  while (index < sourceText.length) {
    const char = sourceText[index];
    if (char === "\\") {
      index += 2;
      continue;
    }
    if (char === "`") {
      return index + 1;
    }
    if (char === "$" && sourceText[index + 1] === "{") {
      index = scanBalancedBraces(sourceText, index + 1);
      continue;
    }
    index += 1;
  }

  return index;
}

function scanBalancedBraces(sourceText, start) {
  let depth = 0;
  let index = start;

  while (index < sourceText.length) {
    const char = sourceText[index];
    const next = sourceText[index + 1];

    if (char === "'" || char === "\"") {
      index = scanQuotedString(sourceText, index, char);
      continue;
    }

    if (char === "`") {
      index = scanTemplateLiteral(sourceText, index);
      continue;
    }

    if (char === "/" && next === "/") {
      index = scanLineComment(sourceText, index);
      continue;
    }

    if (char === "/" && next === "*") {
      index = scanBlockComment(sourceText, index);
      continue;
    }

    if (char === "{") {
      depth += 1;
      index += 1;
      continue;
    }

    if (char === "}") {
      depth -= 1;
      index += 1;
      if (depth <= 0) {
        return index;
      }
      continue;
    }

    index += 1;
  }

  return index;
}

function findHoistFoldRange(state, lineStart) {
  const line = state.doc.lineAt(lineStart);
  if (!isHoistLineStart(line.text)) {
    return null;
  }

  const docText = state.doc.toString();
  const equalsOffset = line.text.indexOf("=");
  if (equalsOffset < 0) {
    return null;
  }

  let from = line.from + equalsOffset + 1;
  while (from < docText.length && isWhitespace(docText[from])) {
    from += 1;
  }

  let index = from;
  let parenDepth = 0;
  let bracketDepth = 0;
  let braceDepth = 0;

  while (index < docText.length) {
    const char = docText[index];
    const next = docText[index + 1];

    if (char === "'" || char === "\"") {
      index = scanQuotedString(docText, index, char);
      continue;
    }

    if (char === "`") {
      index = scanTemplateLiteral(docText, index);
      continue;
    }

    if (char === "/" && next === "/") {
      index = scanLineComment(docText, index);
      continue;
    }

    if (char === "/" && next === "*") {
      index = scanBlockComment(docText, index);
      continue;
    }

    if (char === "(") {
      parenDepth += 1;
      index += 1;
      continue;
    }

    if (char === ")") {
      parenDepth = Math.max(0, parenDepth - 1);
      index += 1;
      continue;
    }

    if (char === "[") {
      bracketDepth += 1;
      index += 1;
      continue;
    }

    if (char === "]") {
      bracketDepth = Math.max(0, bracketDepth - 1);
      index += 1;
      continue;
    }

    if (char === "{") {
      braceDepth += 1;
      index += 1;
      continue;
    }

    if (char === "}") {
      if (parenDepth === 0 && bracketDepth === 0 && braceDepth === 0) {
        if (index <= from) {
          return null;
        }

        const startLine = state.doc.lineAt(from).number;
        const endLine = state.doc.lineAt(index).number;
        return endLine > startLine ? { from, to: index } : null;
      }
      braceDepth = Math.max(0, braceDepth - 1);
      index += 1;
      continue;
    }

    if (
      char === ";" &&
      parenDepth === 0 &&
      bracketDepth === 0 &&
      braceDepth === 0
    ) {
      if (index <= from) {
        return null;
      }

      const startLine = state.doc.lineAt(from).number;
      const endLine = state.doc.lineAt(index).number;
      return endLine > startLine ? { from, to: index } : null;
    }

    if (char === "\n") {
      index += 1;
      continue;
    }

    if (char === "\r") {
      index += 1;
      continue;
    }

    index += 1;
  }

  return null;
}

function createMark(from, to, className) {
  if (typeof className !== "string" || !className || to <= from) {
    return null;
  }

  return Decoration.mark({
    attributes: { class: className },
  }).range(from, to);
}

export function collectEmbeddedCssRanges(virtualSource) {
  const tree = litsxEditorParser.parse(virtualSource.code);
  const ranges = [];

  function pushTemplateSegments(templateNodeOrStart, templateEnd) {
    const templateStart = typeof templateNodeOrStart === "number"
      ? templateNodeOrStart
      : templateNodeOrStart.from;
    const end = typeof templateEnd === "number"
      ? templateEnd
      : templateNodeOrStart.to;
    let segmentStart = templateStart + 1;
    let index = templateStart + 1;

    while (index < end - 1) {
      const char = virtualSource.code[index];
      const next = virtualSource.code[index + 1];

      if (char === "\\") {
        index += 2;
        continue;
      }

      if (char === "$" && next === "{") {
        if (index > segmentStart) {
          ranges.push({ from: segmentStart, to: index });
        }
        index = scanBalancedBraces(virtualSource.code, index + 1);
        segmentStart = index;
        continue;
      }

      index += 1;
    }

    if (segmentStart < end - 1) {
      ranges.push({ from: segmentStart, to: end - 1 });
    }
  }

  function visit(node) {
    if (node.type.name === "TaggedTemplateExpression") {
      const tag = node.firstChild;
      const template = tag?.nextSibling;
      if (
        tag?.type.name === "VariableName" &&
        virtualSource.code.slice(tag.from, tag.to) === "css" &&
        template?.type.name === "TemplateString"
      ) {
        pushTemplateSegments(template);
      }
    }

    if (node.type.name === "CallExpression") {
      const callee = node.firstChild;
      const argList = callee?.nextSibling;
      const firstArg = argList?.firstChild?.nextSibling;

      const calleeName =
        callee?.type.name === "VariableName"
          ? virtualSource.code.slice(callee.from, callee.to)
          : null;

      if (
        EMBEDDED_CSS_CALL_NAMES.has(calleeName) &&
        firstArg?.type.name === "TemplateString"
      ) {
        pushTemplateSegments(firstArg);
      }
    }

    for (let child = node.firstChild; child; child = child.nextSibling) {
      visit(child);
    }
  }

  visit(tree.topNode);

  let index = 0;
  while (index < virtualSource.code.length) {
    const matchIndex = virtualSource.code.indexOf(STATIC_HOIST_ASSIGNMENT_NAME, index);
    if (matchIndex === -1) {
      break;
    }

    let cursor = matchIndex + STATIC_HOIST_ASSIGNMENT_NAME.length;
    while (isWhitespace(virtualSource.code[cursor])) {
      cursor += 1;
    }

    if (virtualSource.code[cursor] !== "=") {
      index = cursor;
      continue;
    }

    cursor += 1;
    while (isWhitespace(virtualSource.code[cursor])) {
      cursor += 1;
    }

    if (virtualSource.code[cursor] !== "`") {
      index = cursor;
      continue;
    }

    const templateEnd = scanTemplateLiteral(virtualSource.code, cursor);
    pushTemplateSegments(cursor, templateEnd);
    index = templateEnd;
  }

  return ranges;
}

function collectAuthoredEmbeddedCssRanges(sourceText) {
  const ranges = [];

  function pushTemplateSegments(templateStart, templateEnd) {
    let segmentStart = templateStart + 1;
    let index = templateStart + 1;

    while (index < templateEnd - 1) {
      const char = sourceText[index];
      const next = sourceText[index + 1];

      if (char === "\\") {
        index += 2;
        continue;
      }

      if (char === "$" && next === "{") {
        if (index > segmentStart) {
          ranges.push({ from: segmentStart, to: index });
        }
        index = scanBalancedBraces(sourceText, index + 1);
        segmentStart = index;
        continue;
      }

      index += 1;
    }

    if (segmentStart < templateEnd - 1) {
      ranges.push({ from: segmentStart, to: templateEnd - 1 });
    }
  }

  let index = 0;
  while (index < sourceText.length) {
    const matchIndex = sourceText.indexOf("static styles", index);
    if (matchIndex === -1) {
      break;
    }

    let cursor = matchIndex + "static styles".length;
    while (isWhitespace(sourceText[cursor])) {
      cursor += 1;
    }

    if (sourceText[cursor] !== "=") {
      index = cursor;
      continue;
    }

    cursor += 1;
    while (isWhitespace(sourceText[cursor])) {
      cursor += 1;
    }

    if (sourceText[cursor] !== "`") {
      index = cursor;
      continue;
    }

    const templateEnd = scanTemplateLiteral(sourceText, cursor);
    pushTemplateSegments(cursor, templateEnd);
    index = templateEnd;
  }

  return ranges;
}

function collectEmbeddedCssHighlightDecorations(sourceText, ranges) {
  const cssRanges = collectAuthoredEmbeddedCssRanges(sourceText);

  for (const range of cssRanges) {
    const cssText = sourceText.slice(range.from, range.to);
    if (!cssText.trim()) {
      continue;
    }

    const cssTree = cssLanguage.parser.parse(cssText);

    highlightTree(cssTree, classHighlighter, (from, to, classes) => {
      const decoration = createMark(range.from + from, range.from + to, classes);

      if (decoration) {
        ranges.push(decoration);
      }
    });
  }
}

export function buildLitsxSourceDecorations(view) {
  const source = view.state.doc.toString();
  const virtualSource = createVirtualLitsxJsxSource(source, {
    strategy: "editor",
  });
  const ranges = [];

  for (const replacement of virtualSource.replacements) {
    if (replacement.originalName.startsWith("static ")) {
      const keywordStart = replacement.start;
      const keywordEnd = keywordStart + "static".length;
      const nameStart = replacement.start + "static ".length;
      const nameEnd = replacement.start + replacement.originalName.length;

      ranges.push(
        Decoration.mark({
          attributes: { class: "tok-keyword" },
        }).range(keywordStart, keywordEnd)
      );

      ranges.push(
        Decoration.mark({
          attributes: { class: "cm-litsx-static-hoist-name" },
        }).range(nameStart, nameEnd)
      );

      continue;
    }

    const prefixLength = 1;
    const nameLength = replacement.originalName.length - prefixLength;

    ranges.push(
      Decoration.mark({
        attributes: { class: "cm-litsx-lit-attr-prefix" },
      }).range(replacement.start, replacement.start + prefixLength)
    );

    ranges.push(
      Decoration.mark({
        attributes: { class: "cm-litsx-lit-attr-name" },
      }).range(
        replacement.start + prefixLength,
        replacement.start + prefixLength + nameLength
      )
    );
  }

  collectEmbeddedCssHighlightDecorations(source, ranges);

  return Decoration.set(ranges, true);
}

export const litsxSourceHighlighting = ViewPlugin.fromClass(
  class {
    constructor(view) {
      this.decorations = buildLitsxSourceDecorations(view);
    }

    update(update) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = buildLitsxSourceDecorations(update.view);
      }
    }
  },
  {
    decorations: (value) => value.decorations,
  }
);

export const litsxSourceHoistFolding = foldService.of((state, lineStart) =>
  findHoistFoldRange(state, lineStart)
);

export function createDefaultHoistFoldEffects(state) {
  const effects = [];

  for (let lineNumber = 1; lineNumber <= state.doc.lines; lineNumber += 1) {
    const line = state.doc.line(lineNumber);
    const range = findHoistFoldRange(state, line.from);

    if (range) {
      effects.push(foldEffect.of(range));
    }
  }

  return effects;
}

export function buildLitsxSyntaxDiagnostics(view) {
  const diagnostics = [];
  const tree = syntaxTree(view.state);

  tree.cursor().iterate((node) => {
    if (!node.type.isError) {
      return;
    }

    const from = node.from;
    const to = Math.max(node.to, from + 1);
    const text = view.state.doc.sliceString(from, Math.min(to, from + 24)).trim();

    diagnostics.push({
      from,
      to,
      severity: "error",
      source: "litsx-source",
      message:
        text.length > 0
          ? `Unexpected syntax near "${text}".`
          : "Unexpected syntax.",
    });
  });

  return diagnostics;
}

export function litsxSourceSupport() {
  return new LanguageSupport(litsxSourceLanguage, [
    javascriptTsxSupport.support,
    litsxSourceHoistFolding,
    linter(buildLitsxSyntaxDiagnostics, {
      delay: 150,
    }),
  ]);
}
