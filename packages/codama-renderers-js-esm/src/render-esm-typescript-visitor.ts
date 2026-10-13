import type { BaseFragment, RenderMap } from "@codama/renderers-core";
import type { InstructionNode, ProgramNode } from "codama";
import type { LinkOverrides } from "./external-programs.ts";
import {
  addToRenderMap,
  getFromRenderMap,
  mapRenderMapContent,
  removeFromRenderMap,
  writeRenderMap,
} from "@codama/renderers-core";
import { getRenderMapVisitor } from "@codama/renderers-js";
import { getAllPrograms, rootNodeVisitor, visit } from "codama";
import { makeSyntaxErasable } from "./erasable-syntax.ts";
import {
  filterBarrel,
  getExternalLinkOverrides,
  getProgramRenderPaths,
  orderExternalProgramsFirst,
} from "./external-programs.ts";

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
 * Options for {@link renderESMTypeScriptVisitor}.
 */
export interface RenderESMTypeScriptOptions {
  /**
   * Programs in the root that are owned by other packages, keyed by program
   * name, with the module their generated code is imported from (usually the
   * owning package's name).
   *
   * These programs must be present in the root so that the links pointing
   * into them resolve (a PDA default value needs the PDA's seeds, a struct
   * needs the size of a linked type), but none of their files are written:
   * every link from a local program into one of them is imported from its
   * module instead, and the barrels only export the local programs.
   */
  externalPrograms?: Record<string, string>;
  /**
   * Extra `linkOverrides` passed through to `@codama/renderers-js`. They take
   * precedence over the overrides derived from {@link externalPrograms}.
   */
  linkOverrides?: LinkOverrides;
}

/**
 * Drops the files of the external programs from the render map and prunes
 * the barrels that re-exported them.
 */
function dropExternalPrograms<TFragment extends BaseFragment>(
  renderMap: RenderMap<TFragment>,
  localPrograms: ProgramNode[],
  externalPrograms: ProgramNode[],
): RenderMap<TFragment> {
  const localPaths = new Set(
    localPrograms.flatMap((program) => [...getProgramRenderPaths(program)]),
  );
  let result = renderMap;
  for (const program of externalPrograms) {
    for (const path of getProgramRenderPaths(program)) {
      if (!localPaths.has(path)) {
        result = removeFromRenderMap(result, path);
      }
    }
  }

  // Directory barrels first, so the root barrel can drop emptied directories.
  const barrels = [...result.keys()].filter(
    (path) => path !== "index.ts" && path.endsWith("/index.ts"),
  );
  for (const barrel of barrels) {
    const directory = barrel.slice(0, -"index.ts".length);
    const fragment = getFromRenderMap(result, barrel);
    const filtered = filterBarrel(fragment.content, (target) =>
      result.has(`${directory}${target}`),
    );
    result =
      filtered === null
        ? removeFromRenderMap(result, barrel)
        : addToRenderMap(result, barrel, { ...fragment, content: filtered });
  }
  if (result.has("index.ts")) {
    const fragment = getFromRenderMap(result, "index.ts");
    const filtered = filterBarrel(fragment.content, (target) =>
      result.has(target),
    );
    result = addToRenderMap(result, "index.ts", {
      ...fragment,
      content: filtered ?? "export default {};",
    });
  }
  return result;
}

/**
 * Codama visitor for rendering the code to be TypeScript compatible.
 * @param path - Directory the generated files are written to.
 * @param options - See {@link RenderESMTypeScriptOptions}.
 * @returns
 */
export function renderESMTypeScriptVisitor(
  path: string,
  options: RenderESMTypeScriptOptions = {},
): ReturnType<typeof rootNodeVisitor> {
  const externalProgramModules = options.externalPrograms ?? {};
  const isExternal = (program: ProgramNode) =>
    Object.hasOwn(externalProgramModules, program.name);

  return rootNodeVisitor((inputRoot) => {
    const programs = getAllPrograms(inputRoot);
    const localPrograms = programs.filter((program) => !isExternal(program));
    const externalPrograms = programs.filter(isExternal);
    if (localPrograms.length === 0) {
      throw new Error("Every program in the root is marked as external");
    }

    const derivedOverrides = getExternalLinkOverrides(
      localPrograms,
      externalProgramModules,
    );
    const linkOverrides: LinkOverrides = { ...derivedOverrides };
    for (const [kind, entries] of Object.entries(options.linkOverrides ?? {})) {
      const key = kind as keyof LinkOverrides;
      linkOverrides[key] = { ...linkOverrides[key], ...entries };
    }

    const root =
      externalPrograms.length > 0
        ? orderExternalProgramsFirst(inputRoot, isExternal)
        : inputRoot;

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
        linkOverrides,
      }),
    );

    if (externalPrograms.length > 0) {
      renderMap = dropExternalPrograms(
        renderMap,
        localPrograms,
        externalPrograms,
      );
    }

    // Instruction-level docs are dropped by the upstream renderer; re-inject.
    const instructions = localPrograms.flatMap(
      (program) => program.instructions ?? [],
    );

    renderMap = mapRenderMapContent(renderMap, (code) => {
      // The upstream renderer emits `enum` declarations and an angle-bracket
      // assertion on the program plugin, neither of which survives
      // `erasableSyntaxOnly` or Node.js type stripping.
      return makeSyntaxErasable(injectInstructionDocs(code, instructions));
    });

    writeRenderMap(renderMap, path);
  });
}
