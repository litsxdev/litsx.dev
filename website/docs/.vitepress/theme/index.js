import { h } from "vue";
import DefaultTheme from "vitepress/theme-without-fonts";
import DocsVersionBanner from "@litsx/vitepress/theme/DocsVersionBanner";
import { defaultDocsVersions } from "@litsx/vitepress/versions";
import "@litsx/vitepress/styles.css";
import "./custom.css";
import "./components/LitsxPlayground.tsx";
import { registerSiteAnalytics } from "./analytics.js";
import HomeAfterHero from "./components/HomeAfterHero.vue";
import HomeHeroPills from "./components/HomeHeroPills.js";
import NavExtrasFlyout from "./components/NavExtrasFlyout.vue";
import NavTitleIcon from "./components/NavTitleIcon.js";

const versions = defaultDocsVersions;

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      "nav-bar-title-before": () => h(NavTitleIcon),
      "nav-bar-content-after": () => h(NavExtrasFlyout, { versions }),
      "page-top": () => h(DocsVersionBanner, { versions }),
      "home-hero-actions-after": () => h(HomeHeroPills),
      "home-features-after": () => h(HomeAfterHero),
    });
  },
  enhanceApp({ app, router }) {
    DefaultTheme.enhanceApp?.({ app, router });
    registerSiteAnalytics(router);
  },
};
