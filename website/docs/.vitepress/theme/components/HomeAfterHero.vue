<script setup>
import { jsxAuthoringExampleSource } from "./playground-example-source.js";
</script>

<template>
  <section class="litsx-home-body">
    <div class="litsx-home-body__container">
      <div class="litsx-home-body__grid">
        <aside class="litsx-home-body__playground">
          <div class="litsx-home-body__playground-shell">
            <div class="litsx-home-body__eyebrow">Live playground</div>
            <h2 class="litsx-home-body__playground-title">Write standard TSX. Ship Lit.</h2>
            <p class="litsx-home-body__playground-copy">
              Edit the component, inspect the generated Lit output, and preview the custom
              element without leaving this page.
            </p>
            <litsx-playground
              exportname="Composer"
              previewtagname="docs-home-composer-preview"
              filename="/playground/HomeComposer.tsx"
              panelmaxheight="32rem"
            >{{ jsxAuthoringExampleSource }}</litsx-playground>
          </div>
        </aside>

        <div class="litsx-home-body__content vp-doc">
          <section>
            <h2>What is Lit<sup>sx</sup>?</h2>
            <p>
              Lit<sup>sx</sup> is a compiler and runtime for authoring Lit-based web components
              with standard JSX and TSX. Lit remains the rendering engine and custom elements
              remain the runtime boundary.
            </p>
            <ul>
              <li>ordinary JSX prop names with compiler-driven Lit binding inference</li>
              <li><code>on:event</code> listeners and typed custom events</li>
              <li>state, refs, effects, suspense, transitions, and error boundaries</li>
              <li>component metadata through normal top-level assignments</li>
            </ul>
          </section>

          <section>
            <h2>Built for the whole component lifecycle</h2>
            <ul>
              <li>Vite compilation and standard TypeScript tooling</li>
              <li>document SSR, scoped rendering, resource snapshots, and hydration</li>
              <li>Lit CSS templates plus optional integrations such as UnoCSS</li>
              <li>Storybook helpers for standard TSX stories</li>
              <li>an optional React compatibility pipeline for staged migrations</li>
            </ul>
          </section>

          <section>
            <h2>Start with the 1.0 model</h2>
            <ul>
              <li><a href="/getting-started">Create a project</a></li>
              <li><a href="/guides/jsx-authoring">Learn standard JSX authoring</a></li>
              <li><a href="/guides/ssr">Render and hydrate on the server</a></li>
              <li><a href="/guides/styling">Choose a styling approach</a></li>
              <li><a href="/guides/migrating-to-1">Migrate pre-1.0 source</a></li>
              <li><a href="/reference/">Browse the API reference</a></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  </section>
</template>
