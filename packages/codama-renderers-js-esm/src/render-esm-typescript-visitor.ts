import { mapRenderMapContent, writeRenderMap } from "@codama/renderers-core";
import { getRenderMapVisitor } from "@codama/renderers-js";
import type { InstructionNode, ProgramNode, RootNode } from "codama";
import { rootNodeVisitor, visit } from "codama";
import { makeSyntaxErasable } from "./erasable-syntax.ts";

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
  const programs: ProgramNode[] = [
    root.program,
    ...(root.additionalPrograms ?? []),
  ];
  return programs.flatMap((program) => program.instructions ?? []);
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
        // `@codama/renderers-js` >= 2.4.0 appends an explicit extension to
        // every relative import and barrel re-export. Emit `.ts` so the
        // generated sources run as-is under Node's type stripping, which
        // resolves specifiers literally. `rewriteRelativeImportExtensions`
        // rewrites them back to `.js` for the published `dist` build.
        importExtension: "ts",
      }),
    );

    // Instruction-level docs are dropped by the upstream renderer; re-inject.
    const instructions = getAllInstructions(root);

    renderMap = mapRenderMapContent(renderMap, (code) => {
      // The upstream renderer emits `enum` declarations and an angle-bracket
      // assertion on the program plugin, neither of which survives
      // `erasableSyntaxOnly` or Node.js type stripping.
      return makeSyntaxErasable(injectInstructionDocs(code, instructions));
    });

    writeRenderMap(renderMap, path);
  });
}
