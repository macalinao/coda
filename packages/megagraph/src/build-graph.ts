import type { ProgramNode, RootNode } from "codama";
import type { BundleConfig } from "./define-program.ts";
import type { ProgramSource } from "./load-programs.ts";
import { processConfig } from "@macalinao/coda";
import { programNode, rootNode } from "codama";
import { IDL_FILE } from "./load-programs.ts";
import {
  findCycles,
  findUnresolvedLinks,
  getProgramDependencies,
} from "./package-graph.ts";

/**
 * Package metadata of one program, as recorded in `graph/packages.json`.
 */
export interface ProgramPackage {
  /** Codama program name. */
  program: string;
  /** Directory name under `programs/` and `clients/`. */
  slug: string;
  /** npm package name. */
  packageName: string;
  /** Names of the programs this program links into. */
  dependencies: string[];
}

/**
 * Package metadata of one umbrella package, as recorded in
 * `graph/packages.json`.
 */
export interface BundlePackage {
  /** Directory name under `clients/`. */
  slug: string;
  /** npm package name. */
  packageName: string;
  /** Codama names of the bundled programs, in priority order. */
  programs: string[];
}

/**
 * The merged program graph.
 */
export interface Megagraph {
  /** Every program, sorted by name, merged into one root. */
  root: RootNode;
  /** One entry per program, sorted by program name. */
  packages: ProgramPackage[];
  /** One entry per umbrella package, sorted by slug. */
  bundles: BundlePackage[];
}

/**
 * Parses a program's IDL and runs its config.
 *
 * The program is processed on its own root, so the config's bare selectors
 * cannot touch another program's nodes. `contextPrograms` are added to that
 * root only so that program-qualified links resolve while the visitors run;
 * only the program itself is kept.
 */
async function processProgram(
  source: ProgramSource,
  contextPrograms: ProgramNode[],
): Promise<ProgramNode> {
  const { codama } = await processConfig(
    {
      idlPath: `./${IDL_FILE}`,
      ...(source.config.instructionAccountDefaultValues && {
        instructionAccountDefaultValues:
          source.config.instructionAccountDefaultValues,
      }),
      ...(source.config.visitors && { visitors: source.config.visitors }),
    },
    { baseDir: source.dir, contextPrograms, quiet: true },
  );
  return codama.getRoot().program;
}

/**
 * Strips a program down to its identity and PDAs for use as context.
 *
 * Configs select nodes by bare name (`updateInstructionsVisitor({ burn: ... })`),
 * and those selectors match nodes of every program in the root. A same-named
 * instruction of a context program can make such a visitor throw, so context
 * programs only carry what config-time link resolution actually needs: the
 * PDAs whose seeds a PDA default value is filled from. Every other link kind
 * is resolved later, when the merged graph is validated and rendered.
 */
function toContextProgram(program: ProgramNode): ProgramNode {
  return programNode({
    name: program.name,
    publicKey: program.publicKey,
    version: program.version,
    pdas: program.pdas,
  });
}

function assertUniqueProgramNames(
  sources: ProgramSource[],
  programs: ProgramNode[],
): void {
  const owners = new Map<string, string>();
  for (const [index, program] of programs.entries()) {
    const slug = sources[index]?.slug ?? "?";
    const owner = owners.get(program.name);
    if (owner !== undefined) {
      throw new Error(
        `Program name "${program.name}" is declared by both programs/${owner} and programs/${slug}`,
      );
    }
    owners.set(program.name, slug);
  }
}

function assertUniquePackageNames(
  sources: ProgramSource[],
  bundles: BundleConfig[],
): void {
  const owners = new Map<string, string>();
  const entries = [
    ...sources.map((source) => ({
      name: source.config.package.name,
      owner: `programs/${source.slug}`,
    })),
    ...bundles.map((bundle) => ({
      name: bundle.package.name,
      owner: `bundle "${bundle.slug}"`,
    })),
  ];
  for (const { name, owner } of entries) {
    const existing = owners.get(name);
    if (existing !== undefined) {
      throw new Error(
        `Package name "${name}" is used by both ${existing} and ${owner}`,
      );
    }
    owners.set(name, owner);
  }
}

/**
 * Checks that bundles have unique slugs that do not clash with a program's
 * package directory, and that they only bundle registered programs.
 */
function resolveBundles(
  bundles: BundleConfig[],
  sources: ProgramSource[],
  programs: ProgramNode[],
): BundlePackage[] {
  const programNameBySlug = new Map(
    sources.map((source, index) => [source.slug, programs[index]?.name]),
  );
  const slugs = new Set<string>();
  const resolved = bundles.map((bundle) => {
    if (programNameBySlug.has(bundle.slug) || slugs.has(bundle.slug)) {
      throw new Error(
        `Bundle slug "${bundle.slug}" clashes with another package directory under clients/`,
      );
    }
    slugs.add(bundle.slug);
    if (bundle.programs.length === 0) {
      throw new Error(`Bundle "${bundle.slug}" does not bundle any program`);
    }
    if (new Set(bundle.programs).size !== bundle.programs.length) {
      throw new Error(`Bundle "${bundle.slug}" lists a program twice`);
    }
    return {
      slug: bundle.slug,
      packageName: bundle.package.name,
      programs: bundle.programs.map((slug) => {
        const name = programNameBySlug.get(slug);
        if (name === undefined) {
          throw new Error(
            `Bundle "${bundle.slug}" references unknown program "${slug}" (expected a directory under programs/)`,
          );
        }
        return name;
      }),
    };
  });
  return resolved.toSorted((a, b) => a.slug.localeCompare(b.slug));
}

/**
 * Builds and validates the megagraph from every program source.
 *
 * Programs are processed twice. The first pass runs each config on its own
 * program, which yields every program's own nodes (e.g. the PDAs its config
 * adds). The second pass runs each config again with every other program's
 * first-pass PDAs as context, so a PDA default value linking into another
 * program resolves while the visitors run —
 * `setInstructionAccountDefaultValuesVisitor`, for one, silently drops a PDA
 * default whose seeds it cannot look up. Two passes suffice as long as a
 * config only links to PDAs another config declares, not to nodes another
 * config derives from links of its own.
 */
export async function buildMegagraph(
  sources: ProgramSource[],
  bundleConfigs: BundleConfig[] = [],
): Promise<Megagraph> {
  if (sources.length === 0) {
    throw new Error("No programs found under programs/");
  }
  assertUniquePackageNames(sources, bundleConfigs);

  const firstPass = await Promise.all(
    sources.map((source) => processProgram(source, [])),
  );
  assertUniqueProgramNames(sources, firstPass);
  const bundles = resolveBundles(bundleConfigs, sources, firstPass);

  const context = firstPass.map(toContextProgram);
  const programs = await Promise.all(
    sources.map((source, index) =>
      processProgram(
        source,
        context.filter((_, other) => other !== index),
      ),
    ),
  );

  const sorted = sources
    .map((source, index) => ({ source, program: programs[index] }))
    .filter(
      (entry): entry is { source: ProgramSource; program: ProgramNode } =>
        entry.program !== undefined,
    )
    .toSorted((a, b) => a.program.name.localeCompare(b.program.name));

  const [first, ...rest] = sorted.map((entry) => entry.program);
  if (first === undefined) {
    throw new Error("No programs were produced");
  }
  const root = rootNode(first, rest);

  const unresolved = findUnresolvedLinks(root);
  if (unresolved.length > 0) {
    const lines = unresolved.map(
      (link) =>
        `  - ${link.kind} "${link.name}"${link.program === undefined ? "" : ` (program "${link.program}")`} at ${link.path}`,
    );
    throw new Error(
      `${unresolved.length.toString()} link(s) do not resolve:\n${lines.join("\n")}`,
    );
  }

  const dependencies = getProgramDependencies(sorted.map((e) => e.program));
  const cycles = findCycles(dependencies);
  if (cycles.length > 0) {
    throw new Error(
      `Package dependency cycle(s):\n${cycles.map((cycle) => `  - ${cycle.join(" -> ")}`).join("\n")}`,
    );
  }

  return {
    root,
    packages: sorted.map(({ source, program }) => ({
      program: program.name,
      slug: source.slug,
      packageName: source.config.package.name,
      dependencies: dependencies.get(program.name) ?? [],
    })),
    bundles,
  };
}
