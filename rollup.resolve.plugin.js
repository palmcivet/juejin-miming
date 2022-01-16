import { readFileSync } from "fs";

/**
 * Resolve import of plain resource to real plain resource path
 * @returns {import('rollup').Plugin}
 */
export default function createPlainPlugin(replaceMap) {
  return {
    name: "plain",

    transform(code, id) {
      if (!id.endsWith("main.js")) {
        return;
      }

      Object.entries(replaceMap).forEach(([key, value]) => {
        const raw = `\`${readFileSync(value).toString()}\``;
        code = code.replace(key, raw);
      });

      return {
        code,
        map: null,
      };
    },
  };
}
