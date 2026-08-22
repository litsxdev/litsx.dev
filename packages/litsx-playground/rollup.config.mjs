import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nativePreset from "@litsx/babel-preset-litsx";
import transformJsxHtmlTemplate from "@litsx/babel-plugin-transform-jsx-html-template";
import { PLAYGROUND_TYPE_FILES } from "./src/virtual-types.js";

const configDir = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(configDir, "dist");
const browserExternalPrefix = "\0browser-external:";
const scopedRegistryShimSourcePath = fileURLToPath(import.meta.resolve("@litsx/scoped-registry-shim"));
// We use Rollup here because the previous tsup/esbuild path emitted multiple `lit`
// import statements in the middle of the generated ESM file instead of hoisting
// them to the top-level, which is invalid module syntax.

fs.rmSync(distDir, { recursive: true, force: true });

function browserExternalBuiltins() {
  return {
    name: "browser-external-builtins",
    resolveId(source) {
      if (
        source === "module" ||
        source === "node:module" ||
        source === "path" ||
        source === "node:path" ||
        source === "fs" ||
        source === "node:fs"
      ) {
        const normalizedSource = source.startsWith("node:")
          ? source.slice("node:".length)
          : source;
        return `${browserExternalPrefix}${normalizedSource}`;
      }

      return null;
    },
    load(id) {
      if (id === `${browserExternalPrefix}module`) {
        return `
          export const findPnpApi = undefined;
          export function createRequire() {
            throw new Error("module.createRequire is not available in browser workers.");
          }
          export default {
            findPnpApi,
            createRequire,
          };
        `;
      }

      if (id === `${browserExternalPrefix}fs`) {
        return `
          export function existsSync() {
            return false;
          }
          export function statSync() {
            throw new Error("node:fs is not available in browser workers.");
          }
          export default {
            existsSync,
            statSync,
          };
        `;
      }

      if (id === `${browserExternalPrefix}path`) {
        return `
          function normalize(pathname) {
            const value = String(pathname || "").replace(/\\\\/g, "/");
            const isAbsolute = value.startsWith("/");
            const segments = value.split("/");
            const output = [];

            for (const segment of segments) {
              if (!segment || segment === ".") continue;
              if (segment === "..") {
                if (output.length && output[output.length - 1] !== "..") {
                  output.pop();
                } else if (!isAbsolute) {
                  output.push("..");
                }
                continue;
              }
              output.push(segment);
            }

            const joined = output.join("/");
            if (isAbsolute) return "/" + joined;
            return joined || ".";
          }

          function dirname(pathname) {
            const value = normalize(pathname);
            if (value === "/" || value === ".") return value;
            const segments = value.split("/");
            segments.pop();
            if (!segments.length) return value.startsWith("/") ? "/" : ".";
            if (segments.length === 1 && segments[0] === "") return "/";
            return segments.join("/") || ".";
          }

          function join(...parts) {
            return normalize(parts.filter(Boolean).join("/"));
          }

          function resolve(...parts) {
            const combined = join(...parts);
            return combined.startsWith("/") ? combined : "/" + combined.replace(/^\\.\\/?/, "");
          }

          function isAbsolute(pathname) {
            return String(pathname || "").startsWith("/");
          }

          function relative(from, to) {
            const fromPath = normalize(from).replace(/^\\/+/, "");
            const toPath = normalize(to).replace(/^\\/+/, "");
            const fromSegments = fromPath === "." ? [] : fromPath.split("/");
            const toSegments = toPath === "." ? [] : toPath.split("/");

            while (fromSegments.length && toSegments.length && fromSegments[0] === toSegments[0]) {
              fromSegments.shift();
              toSegments.shift();
            }

            const upward = fromSegments.map(() => "..");
            const result = [...upward, ...toSegments].join("/");
            return result || ".";
          }

          export { dirname, isAbsolute, join, relative, resolve };
          export default {
            dirname,
            isAbsolute,
            join,
            relative,
            resolve,
          };
        `;
      }

      return null;
    },
  };
}

function inlinePlaygroundRuntimeSource() {
  return {
    name: "inline-playground-runtime-source",
    writeBundle(outputOptions) {
      const outputDir = outputOptions.dir ?? path.dirname(outputOptions.file);
      const runtimePath = path.join(outputDir, "playground-runtime.js");

      if (!fs.existsSync(runtimePath)) {
        this.error(`Missing "${runtimePath}" while inlining runtime source.`);
      }

      const runtimeSource = JSON.stringify(fs.readFileSync(runtimePath, "utf8"));

      for (const outputPath of listOutputFiles(outputDir)) {
        if (!outputPath.endsWith(".js") && !outputPath.endsWith(".cjs")) continue;

        const code = fs.readFileSync(outputPath, "utf8");
        if (!code.includes("__PLAYGROUND_RUNTIME_SOURCE__")) continue;

        fs.writeFileSync(
          outputPath,
          code.replaceAll('"__PLAYGROUND_RUNTIME_SOURCE__"', runtimeSource),
        );
      }
    },
  };
}

function listOutputFiles(outputDir) {
  const entries = fs.readdirSync(outputDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const outputPath = path.join(outputDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listOutputFiles(outputPath));
    } else if (entry.isFile()) {
      files.push(outputPath);
    }
  }

  return files;
}

function copyPreviewRuntimeModules() {
  return {
    name: "copy-preview-runtime-modules",
    generateBundle(outputOptions) {
      const outputDir = outputOptions.dir ?? path.dirname(outputOptions.file);
      const previewRuntimeDir = path.join(configDir, "src/preview-runtime");
      const targetDir = path.join(outputDir, "preview-runtime");

      fs.mkdirSync(targetDir, { recursive: true });

      for (const entry of fs.readdirSync(previewRuntimeDir)) {
        const sourcePath = path.join(previewRuntimeDir, entry);
        const targetPath = path.join(targetDir, entry);
        fs.copyFileSync(sourcePath, targetPath);
      }

      // TODO: Stop vendoring this package file into preview-runtime once the
      // extracted playground has a cleaner strategy for browser-resolving
      // published LitSX runtime helper modules inside the preview iframe.
      fs.copyFileSync(
        scopedRegistryShimSourcePath,
        path.join(targetDir, "scoped-registry-shim.js"),
      );
    },
  };
}

function createSharedPlugins() {
  return [
    browserExternalBuiltins(),
    nodeResolve({
      browser: true,
      preferBuiltins: false,
      exportConditions: ["browser", "default", "import"],
      extensions: [".mjs", ".js", ".json", ".node", ".ts", ".tsx"],
    }),
    json(),
    commonjs(),
  ];
}

function createMinifyPlugin(module = true) {
  return terser({
    module,
    compress: {
      passes: 2,
    },
    format: {
      comments: /@vite-ignore/,
    },
  });
}

const runtimeConfig = {
  input: {
    "playground-runtime": path.join(configDir, "src/playground-runtime.js"),
  },
  output: [
    {
      dir: distDir,
      format: "es",
      entryFileNames: "[name].js",
      inlineDynamicImports: true,
    },
    {
      dir: distDir,
      format: "cjs",
      entryFileNames: "[name].cjs",
      inlineDynamicImports: true,
    },
  ],
  external: ["lit"],
  plugins: [
    ...createSharedPlugins(),
    createMinifyPlugin(),
  ],
};

const packageConfig = {
  input: {
    index: path.join(configDir, "src/index.js"),
    "litsx-playground.worker": path.join(configDir, "src/litsx-playground.worker.js"),
  },
  output: [
    {
      dir: distDir,
      format: "es",
      entryFileNames: "[name].js",
      chunkFileNames: "chunks/[name]-[hash].js",
    },
    {
      dir: distDir,
      format: "cjs",
      entryFileNames: "[name].cjs",
      chunkFileNames: "chunks/[name]-[hash].cjs",
    },
  ],
  external: ["lit"],
  plugins: [
    ...createSharedPlugins(),
    babel({
      babelHelpers: "bundled",
      babelrc: false,
      configFile: false,
      extensions: [".js", ".ts", ".tsx"],
      include: [new RegExp(`${configDir.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/src/.*\\.tsx$`)],
      parserOpts: {
        sourceType: "module",
        plugins: ["typescript", "jsx"],
      },
      presets: [[nativePreset, {
        jsxTemplate: false,
        typeResolutionMode: "in-memory",
        inMemoryFiles: PLAYGROUND_TYPE_FILES,
      }]],
      plugins: [
        transformJsxHtmlTemplate,
        [
          "@babel/plugin-transform-typescript",
          {
            isTSX: true,
            allowDeclareFields: true,
          },
        ],
      ],
    }),
    inlinePlaygroundRuntimeSource(),
    copyPreviewRuntimeModules(),
    createMinifyPlugin(false),
  ],
};

export default [runtimeConfig, packageConfig];
