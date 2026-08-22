import cssLanguage from "shiki/langs/css.mjs";
import jsxLanguage from "shiki/langs/jsx.mjs";
import tsxLanguage from "shiki/langs/tsx.mjs";

function cloneRegistration(registration) {
  return JSON.parse(JSON.stringify(registration));
}

function rewriteRepositoryIncludes(value, prefix) {
  if (Array.isArray(value)) {
    return value.map((entry) => rewriteRepositoryIncludes(entry, prefix));
  }

  if (!value || typeof value !== "object") return value;

  const rewritten = {};
  for (const [key, child] of Object.entries(value)) {
    rewritten[key] = key === "include" && typeof child === "string" && child.startsWith("#")
      ? `#${prefix}${child.slice(1)}`
      : rewriteRepositoryIncludes(child, prefix);
  }
  return rewritten;
}

function addCssInterpolationIncludes(value) {
  if (Array.isArray(value)) {
    return value.map(addCssInterpolationIncludes);
  }

  if (!value || typeof value !== "object") return value;

  const rewritten = {};
  for (const [key, child] of Object.entries(value)) {
    rewritten[key] = addCssInterpolationIncludes(child);
  }
  if (Array.isArray(rewritten.patterns)) {
    rewritten.patterns = [
      { include: "#litsx-css-interpolation" },
      ...rewritten.patterns,
    ];
  }
  return rewritten;
}

function createPrefixedCssRepository(prefix) {
  const css = cloneRegistration(cssLanguage[0]);
  const repository = {};

  for (const [key, value] of Object.entries(css.repository || {})) {
    repository[`${prefix}${key}`] = addCssInterpolationIncludes(
      rewriteRepositoryIncludes(value, prefix),
    );
  }

  repository[`${prefix}root`] = {
    patterns: rewriteRepositoryIncludes(css.patterns || [], prefix),
  };

  return repository;
}

function createCssInterpolationRule(registration) {
  const languageSuffix = registration.name === "tsx" ? "ts" : "js";

  return {
    begin: "(\\$\\{)",
    beginCaptures: {
      1: { name: `punctuation.section.embedded.begin.${languageSuffix}` },
    },
    end: "(\\})",
    endCaptures: {
      1: { name: `punctuation.section.embedded.end.${languageSuffix}` },
    },
    contentName: `meta.embedded.expression.${languageSuffix}`,
    patterns: [{ include: "#expression" }],
  };
}

function createCssTaggedTemplateRule(registration) {
  const languageSuffix = registration.name === "tsx" ? "ts" : "js";

  return {
    begin: "\\b(css)(\\s*)(`)",
    beginCaptures: {
      1: { name: "support.function.tagged-template.css.litsx" },
      3: {
        name: `string.template.${languageSuffix} punctuation.definition.string.begin.${languageSuffix}`,
      },
    },
    end: "(`)",
    endCaptures: {
      1: {
        name: `string.template.${languageSuffix} punctuation.definition.string.end.${languageSuffix}`,
      },
    },
    contentName: "meta.embedded.block.css",
    patterns: [
      { include: "#litsx-css-interpolation" },
      { include: "#litsx-css-root" },
    ],
  };
}

function prependPattern(repositoryEntry, pattern) {
  if (!Array.isArray(repositoryEntry?.patterns)) return;
  repositoryEntry.patterns = [pattern, ...repositoryEntry.patterns];
}

function createLitsxCodeLanguage(registration) {
  const grammar = cloneRegistration(registration);
  const cssRepository = createPrefixedCssRepository("litsx-css-");
  const taggedTemplateInclude = { include: "#litsx-css-tagged-template" };

  grammar.patterns = [taggedTemplateInclude, ...(grammar.patterns || [])];
  grammar.repository = {
    ...(grammar.repository || {}),
    ...cssRepository,
    "litsx-css-interpolation": createCssInterpolationRule(registration),
    "litsx-css-tagged-template": createCssTaggedTemplateRule(registration),
  };

  prependPattern(grammar.repository.expression, taggedTemplateInclude);
  prependPattern(grammar.repository.expressionWithoutIdentifiers, taggedTemplateInclude);

  return grammar;
}

export const litsxTsxLanguage = createLitsxCodeLanguage(tsxLanguage[0]);
export const litsxJsxLanguage = createLitsxCodeLanguage(jsxLanguage[0]);

export function litsxCodeLanguages() {
  return [litsxTsxLanguage, litsxJsxLanguage];
}
