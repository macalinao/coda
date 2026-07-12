import {
  addToRenderMap,
  mapFragmentContent,
  mapRenderMapContent,
  writeRenderMap,
} from "@codama/renderers-core";
import { getRenderMapVisitor } from "@codama/renderers-js";
import type { InstructionNode, ProgramNode, RootNode } from "codama";
import { rootNodeVisitor, visit } from "codama";
import { ESM_DEPENDENCY_MAP } from "./constants.js";

/**
 * Renders an instruction's `docs` as a top-level JSDoc block. Returns an empty
 * string when the instruction has no docs.
 */
function renderInstructionDocblock(docs: readonly string[]): string {
  if (docs.length === 0) {
    return "";
  }
  const body = docs.map((line) => ` *${line ? ` ${line}` : ""}`).join("\n");
  return `/**\n${body}\n */\n`;
}

/**
 * The upstream `@codama/renderers-js` templates render docs for accounts,
 * arguments and types, but drop the `docs` set on instruction nodes. This walks
 * the tree and injects those docs as JSDoc blocks above the generated
 * `get<Name>Instruction` / `get<Name>InstructionAsync` builder functions so that
 * instruction-level documentation surfaces on hover.
 */
function injectInstructionDocs(code: string, instructions: InstructionNode[]) {
  let updated = code;
  for (const instruction of instructions) {
    const docs = instruction.docs ?? [];
    if (docs.length === 0) {
      continue;
    }
    const pascalName =
      instruction.name.charAt(0).toUpperCase() + instruction.name.slice(1);
    const base = `get${pascalName}Instruction`;
    const docblock = renderInstructionDocblock(docs);
    // Async builder: `export async function get<Name>InstructionAsync`.
    updated = updated.replace(
      new RegExp(`(^|\\n)(export async function ${base}Async)`),
      `$1${docblock}$2`,
    );
    // Sync builder: `export function get<Name>Instruction` (not the *Async one,
    // which is declared with `async function`).
    updated = updated.replace(
      new RegExp(`(^|\\n)(export function ${base})(?=[<(])`),
      `$1${docblock}$2`,
    );
  }
  return updated;
}

/**
 * Collects every instruction node reachable from the root, across the main
 * program and any additional programs.
 */
function getAllInstructions(root: RootNode): InstructionNode[] {
  const programs: ProgramNode[] = [root.program, ...root.additionalPrograms];
  return programs.flatMap((program) => program.instructions);
}

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
      }),
    );

    // Instruction-level docs are dropped by the upstream renderer; re-inject.
    const instructions = getAllInstructions(root);

    const index = renderMap.get("index.ts");
    if (!index) {
      throw new Error("Index file not found");
    }
    renderMap = addToRenderMap(
      renderMap,
      "index.ts",
      mapFragmentContent(index, (content) =>
        content.replace(
          /(export\s+\*\s+from\s+['"])(\.\/[^'"]+)(['"])/g,
          (_: string, prefix: string, importPath: string, quote: string) =>
            `${prefix}${importPath}/index.js${quote}`,
        ),
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
          (_: string, prefix: string, importPath: string) =>
            `${prefix}${importPath}.js'`,
        )
        .replace(/from\s+['"]\.['"]/g, 'from "./index.js"')
        // Newer `@codama/renderers-js` merges the type-only `<Name>Seeds`
        // import from the PDA module into the value import of `find<Name>Pda`
        // (e.g. `import { findTreeConfigPda, TreeConfigSeeds }`), which fails
        // to build under `verbatimModuleSyntax`. Re-add the inline `type`
        // modifier on any `*Seeds` specifier imported from a `pdas` module.
        .replace(
          /import\s+\{([^}]*)\}\s+from\s+(['"][^'"]*pdas\/index\.js['"])/g,
          (_: string, specifiers: string, source: string) => {
            const fixed = specifiers
              .split(",")
              .map((specifier) => {
                const trimmed = specifier.trim();
                return trimmed.endsWith("Seeds") && !trimmed.startsWith("type ")
                  ? ` type ${trimmed}`
                  : specifier;
              })
              .join(",");
            return `import {${fixed}} from ${source}`;
          },
        );

      return injectInstructionDocs(updated, instructions);
    });

    writeRenderMap(renderMap, path);
  });
}
