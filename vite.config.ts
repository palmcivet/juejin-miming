import { resolve } from "path";
import { defineConfig } from "vite";
import resolvePlain from "./rollup.resolve.plugin";
import pkg from "./package.json";

export default defineConfig({
  esbuild: {
    banner: `/* eslint-disable */
// ==UserScript==
// @name         掘金挖矿脚本
// @namespace    ${pkg.repository}
// @version      ${pkg.version}
// @description  参考：
// @description  1. https://juejin.cn/post/7047688281693585415
// @description  2. https://juejin.cn/post/7019704757556084750
// @author       ${pkg.author}
// @match        https://juejin.cn/game/haidijuejin/*
// @icon         https://juejin.cn/game/haidijuejin/favicon.8a39f.ico
// @require      https://unpkg.com/alpinejs@3.8/dist/cdn.min.js
// @grant        none
// ==/UserScript==`,
  },
  build: {
    minify: false,
    polyfillModulePreload: false,
  },
  plugins: [
    resolvePlain({
      __STYLE_TEXT: resolve(__dirname, "src/style.css"),
      __TEMPLATE_TEXT: resolve(__dirname, "src/template.html"),
    }),
  ],
});
