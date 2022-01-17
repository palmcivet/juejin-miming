import { resolve } from "path";
import { defineConfig } from "vite";
import resolvePlain from "./rollup.resolve.plugin";
import pkg from "./package.json";

export default defineConfig({
  esbuild: {
    banner: `/* eslint-disable */
// ==UserScript==
// @name         海底掘金
// @namespace    ${pkg.repository}
// @version      ${pkg.version}
// @license      ${pkg.license}
// @description  参考：
// @author       ${pkg.author}
// @match        https://juejin.cn/game/haidijuejin/*
// @require      https://unpkg.com/alpinejs@3.8/dist/cdn.min.js
// @updateURL    ${pkg.homepage}/index.js
// @grant        none
// ==/UserScript==`,
  },
  build: {
    outDir: "docs",
    minify: false,
    polyfillModulePreload: false,
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
      },
    },
  },
  plugins: [
    resolvePlain({
      __STYLE_TEXT: resolve(__dirname, "src/style.css"),
      __TEMPLATE_TEXT: resolve(__dirname, "src/template.html"),
    }),
  ],
});
