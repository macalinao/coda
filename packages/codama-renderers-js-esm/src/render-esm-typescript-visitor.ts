import type { RenderMap } from "@codama/renderers-core";
import type { Visitor } from "codama";
import {
  addToRenderMap,
  mapRenderMapContent,
  writeRenderMap,
} from "@codama/renderers-core";
import { getRenderMapVisitor } from "@codama/renderers-js";
import { rootNodeVisitor, visit } from "codama";
import { ESM_DEPENDENCY_MAP } from "./constants.js";

/**
 * Codama visitor for rendering the code to be TypeScript compatible.
 * @param path
 * @returns
 */
export function renderESMTypeScriptVisitor(
  path: string,
): ReturnType<typeof rootNodeVisitor> {
  return rootNodeVisitor((root) => {
    // Render the new files.
    let renderMap = visit(
      root,
      getRenderMapVisitor({
        dependencyMap: ESM_DEPENDENCY_MAP,
        // TOOD(igm): this is not typed correctly; breaking changes in patch versions
      }) as unknown as Visitor<
        RenderMap,
        | "definedTypeNode"
        | "accountNode"
        | "instructionNode"
        | "pdaNode"
        | "programNode"
        | "rootNode"
      >,
    );

    const index = renderMap.get("index.ts");
    if (!index) {
      throw new Error("Index file not found");
    }
    renderMap = addToRenderMap(
      renderMap,
      "index.ts",
      index.replace(
        /(export\s+\*\s+from\s+['"])(\.\/[^'"]+)(['"])/g,
        (_: string, prefix: string, path: string, quote: string) =>
          `${prefix}${path}/index.js${quote}`,
      ),
    );

    renderMap = mapRenderMapContent(renderMap, (code) => {
      const updated = code
        // .replace(/= 0x([\da-f]+), \/\//g, "= 0x$1; //")
        .replaceAll("process.env.NODE_ENV !== 'production'", "true")
        .replaceAll(";;", ";")
        // Add return type annotations for functions that return simple types
        .replace(
          /export const (\w+DISCRIMINATOR)\s*=\s*new Uint8Array\(/g,
          "export const $1: ReadonlyUint8Array = new Uint8Array(",
        )
        .replace(
          /export function (get\w+DiscriminatorBytes)\(\)\s*{/g,
          "export function $1(): ReadonlyUint8Array {",
        )
        .replace(
          /(export\s+\*\s+from\s+['"])(\.\/[^'"]+?)(?<!\.(js|ts|mjs|cjs|json))(['"])/g,
          (_: string, prefix: string, path: string) => `${prefix}${path}.js'`,
        )
        .replace(/from\s+['"]\.['"]/g, 'from "./index.js"');

      return updated;
    });

    writeRenderMap(renderMap, path);
  });
}
