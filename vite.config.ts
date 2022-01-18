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
// @description  这是一个针对 海底掘金活动 编写的油猴脚本，实现了用户信息的自动获取和掘进方式的高效的选择，不用手动拼接代码。
// @author       ${pkg.author}
// @match        https://juejin.cn/game/haidijuejin/*
// @require      https://unpkg.com/alpinejs@3.8/dist/cdn.min.js
// @updateURL    ${pkg.homepage}/index.js
// @grant        none
// ==/UserScript==`,
  },
  build: {
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
