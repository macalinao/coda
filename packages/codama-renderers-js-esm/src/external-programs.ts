import type { GetRenderMapOptions } from "@codama/renderers-js";
import type { ProgramNode, RootNode } from "codama";
import {
  camelCase,
  getAllInstructionsWithSubs,
  getAllPrograms,
  rootNode,
} from "codama";

/** The `linkOverrides` option of `@codama/renderers-js`. */
export type LinkOverrides = NonNullable<GetRenderMapOptions["linkOverrides"]>;

type LinkOverrideKind = Exclude<keyof LinkOverrides, "resolvers">;

/** Maps a link node kind to the `linkOverrides` bucket that resolves it. */
const LINK_KIND_TO_OVERRIDE_KIND: Record<string, LinkOverrideKind> = {
  accountLinkNode: "accounts",
  definedTypeLinkNode: "definedTypes",
  instructionLinkNode: "instructions",
  pdaLinkNode: "pdas",
  programLinkNode: "programs",
};

interface LinkLike {
  kind: string;
  name: string;
  program?: { name: string };
}

function isLinkLike(value: unknown): value is LinkLike {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const { kind, name } = value as { kind?: unknown; name?: unknown };
  return (
    typeof kind === "string" &&
    kind in LINK_KIND_TO_OVERRIDE_KIND &&
    typeof name === "string"
  );
}

/**
 * Collects every link node nested anywhere under `node`. Link nodes can sit
 * deep inside type, value and seed nodes, so this walks the plain object tree
 * rather than enumerating the node kinds that may hold them.
 */
function collectLinks(node: unknown, links: LinkLike[] = []): LinkLike[] {
  if (Array.isArray(node)) {
    for (const item of node) {
      collectLinks(item, links);
    }
    return links;
  }
  if (typeof node !== "object" || node === null) {
    return links;
  }
  if (isLinkLike(node)) {
    links.push(node);
  }
  for (const value of Object.values(node)) {
    collectLinks(value, links);
  }
  return links;
}

/** Returns the program a link node points into, or `undefined` if unqualified. */
function getLinkedProgramName(link: LinkLike): string | undefined {
  return link.kind === "programLinkNode" ? link.name : link.program?.name;
}

/**
 * Reads a node list that the types declare as required but that nodes parsed
 * from older or hand-written JSON can omit.
 */
function list<T>(items: readonly T[] | undefined): readonly T[] {
  return items ?? [];
}

/** The names each program exposes, bucketed like `linkOverrides`. */
function getExportedNames(
  program: ProgramNode,
): Record<LinkOverrideKind, Set<string>> {
  return {
    accounts: new Set(list(program.accounts).map((node) => node.name)),
    definedTypes: new Set(list(program.definedTypes).map((node) => node.name)),
    instructions: new Set(
      getAllInstructionsWithSubs(program).map((node) => node.name),
    ),
    pdas: new Set(list(program.pdas).map((node) => node.name)),
    programs: new Set([program.name]),
  };
}

/**
 * Builds the `linkOverrides` that make the local programs import the nodes
 * they link to in external programs from the package owning them.
 *
 * `linkOverrides` is keyed by node name only, so an override applies to every
 * link of that kind and name, local or not. The function therefore throws when
 * a linked external name is also declared locally, or is linked from two
 * external programs owned by different packages, since the generated imports
 * would silently resolve to the wrong module.
 */
export function getExternalLinkOverrides(
  localPrograms: ProgramNode[],
  externalPrograms: Record<string, string>,
): LinkOverrides {
  const overrides: Record<LinkOverrideKind, Record<string, string>> = {
    accounts: {},
    definedTypes: {},
    instructions: {},
    pdas: {},
    programs: {},
  };
  const origins: Record<string, string> = {};

  const localNames = localPrograms.map(getExportedNames);
  const isLocal = (kind: LinkOverrideKind, name: string) =>
    localNames.some((names) => names[kind].has(name));

  for (const link of collectLinks(localPrograms)) {
    const programName = getLinkedProgramName(link);
    if (programName === undefined) {
      continue;
    }
    const importFrom = Object.hasOwn(externalPrograms, programName)
      ? externalPrograms[programName]
      : undefined;
    if (importFrom === undefined) {
      continue;
    }
    const kind = LINK_KIND_TO_OVERRIDE_KIND[link.kind];
    if (kind === undefined) {
      continue;
    }
    const description = `${kind} "${link.name}" of program "${programName}"`;
    if (isLocal(kind, link.name)) {
      throw new Error(
        `Cannot import ${description} from "${importFrom}": a local node of the same kind is also named "${link.name}", and linkOverrides are keyed by name only. Rename one of them.`,
      );
    }
    const existing = overrides[kind][link.name];
    if (existing !== undefined && existing !== importFrom) {
      throw new Error(
        `Cannot import ${description} from "${importFrom}": ${origins[`${kind}:${link.name}`] ?? "another node"} is already imported from "${existing}" under the same name. Rename one of them.`,
      );
    }
    overrides[kind][link.name] = importFrom;
    origins[`${kind}:${link.name}`] = description;
  }

  return overrides;
}

/** The render map paths `@codama/renderers-js` emits for a program. */
export function getProgramRenderPaths(program: ProgramNode): Set<string> {
  const name = camelCase(program.name);
  return new Set([
    `programs/${name}.ts`,
    `errors/${name}.ts`,
    `constants/${name}.ts`,
    ...list(program.pdas).map((node) => `pdas/${camelCase(node.name)}.ts`),
    ...list(program.accounts).map(
      (node) => `accounts/${camelCase(node.name)}.ts`,
    ),
    ...list(program.events).map((node) => `events/${camelCase(node.name)}.ts`),
    ...list(program.definedTypes).map(
      (node) => `types/${camelCase(node.name)}.ts`,
    ),
    ...getAllInstructionsWithSubs(program).map(
      (node) => `instructions/${camelCase(node.name)}.ts`,
    ),
  ]);
}

/**
 * Reorders the root so the external programs come first. The renderer merges
 * the per-program render maps in program order with later entries winning, so
 * this keeps a local file intact when an external program happens to declare
 * a node with the same name (e.g. two programs both defining `Creator`).
 */
export function orderExternalProgramsFirst(
  root: RootNode,
  isExternal: (program: ProgramNode) => boolean,
): RootNode {
  const programs = getAllPrograms(root);
  const ordered = [
    ...programs.filter(isExternal),
    ...programs.filter((program) => !isExternal(program)),
  ];
  const [first, ...rest] = ordered;
  if (first === undefined) {
    return root;
  }
  return rootNode(first, rest);
}

const EXPORT_ALL_LINE = /^export \* from (["'])\.\/(?<target>[^"']+)\1;$/;

/**
 * Removes the `export *` lines of a barrel whose target was dropped from the
 * render map, deduplicating lines that two programs contributed.
 *
 * @returns The filtered barrel, or `null` when it no longer exports anything.
 */
export function filterBarrel(
  code: string,
  keep: (target: string) => boolean,
): string | null {
  const seen = new Set<string>();
  let exportCount = 0;
  const lines = code.split("\n").filter((line) => {
    const target = EXPORT_ALL_LINE.exec(line)?.groups?.target;
    if (target === undefined) {
      return true;
    }
    if (!keep(target) || seen.has(target)) {
      return false;
    }
    seen.add(target);
    exportCount++;
    return true;
  });
  return exportCount === 0 ? null : lines.join("\n");
}
