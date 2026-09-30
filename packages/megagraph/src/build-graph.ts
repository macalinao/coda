import type { ProgramNode, RootNode } from "codama";
import type {
  ExternalProgramSource,
  ProgramSource,
  ProtocolSource,
} from "./load-programs.ts";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { processConfig } from "@macalinao/coda";
import { createFromJson, programNode, rootNode } from "codama";
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
  /** Protocol directory name, e.g. `quarry`. */
  protocol: string;
  /** `<protocol>/<program>` directory under `programs/`. */
  slug: string;
  /** npm package name. */
  packageName: string;
  /** Version of the package's first release (from its config). */
  version: string;
  /** Names of the programs this program links into. */
  dependencies: string[];
  /** Changelog lines for the package's first release. */
  releaseNotes?: string[];
}

/**
 * Metadata of one protocol, as recorded in `graph/packages.json`.
 */
export interface ProtocolEntry {
  /** Directory name under `programs/`. */
  protocol: string;
  displayName: string;
  description: string;
  homepage?: string;
  repository?: string;
  /** Codama names of the protocol's programs, sorted. */
  programs: string[];
}

/**
 * Package metadata of one umbrella package, as recorded in
 * `graph/packages.json`.
 */
export interface UmbrellaPackage {
  /** Protocol directory name; the umbrella is generated at packages/<protocol>/. */
  protocol: string;
  /** npm package name. */
  packageName: string;
  /** Version of the package's first release (from its config). */
  version: string;
  /** Codama names of the member programs, in precedence order. */
  programs: string[];
  /** Changelog lines for the package's first release. */
  releaseNotes?: string[];
}

/**
 * A program whose client is published elsewhere, as recorded in
 * `graph/packages.json`. Links into it import from `packageName`.
 */
export interface ExternalProgramEntry {
  /** Codama program name. */
  program: string;
  protocol: string;
  /** `<protocol>/<program>` directory under `programs/` holding the IDL. */
  slug: string;
  /** npm package exporting the program's client. */
  packageName: string;
  /** Peer dependency range of that package. */
  peerRange: string;
}

/**
 * The merged program graph.
 */
export interface Megagraph {
  /** Every program, sorted by name, merged into one root. */
  root: RootNode;
  /** One entry per protocol, sorted by directory name. */
  protocols: ProtocolEntry[];
  /** One entry per program, sorted by program name. */
  packages: ProgramPackage[];
  /** One entry per umbrella package, sorted by protocol. */
  umbrellas: UmbrellaPackage[];
  /** One entry per external program, sorted by program name. */
  externals: ExternalProgramEntry[];
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
  linkPrograms: string[],
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
    { baseDir: source.dir, contextPrograms, linkPrograms, quiet: true },
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

/**
 * Loads an external program's vendored Codama IDL and asserts that the
 * handles its config declares match the IDL exactly.
 */
async function loadExternalPrograms(
  source: ExternalProgramSource,
): Promise<ProgramNode[]> {
  const json = await readFile(join(source.dir, IDL_FILE), "utf-8");
  const root = createFromJson(json).getRoot();
  const programs: ProgramNode[] = [
    root.program,
    ...(root.additionalPrograms ?? []),
  ];
  const where = `programs/${source.slug}`;
  for (const handle of source.external.handles.programs ?? []) {
    if (!programs.some((program) => program.name === handle.name)) {
      throw new Error(
        `${where}: program handle "${handle.name}" does not match any program of the IDL (${programs.map((program) => program.name).join(", ")})`,
      );
    }
  }
  for (const handle of source.external.handles.pdas ?? []) {
    const program = programs.find(
      (candidate) => candidate.name === handle.program,
    );
    const pda = (program?.pdas ?? []).find(
      (candidate) => candidate.name === handle.name,
    );
    if (pda === undefined) {
      throw new Error(
        `${where}: PDA handle ${handle.program}.${handle.name} does not match any PDA of the IDL`,
      );
    }
    if (JSON.stringify(pda) !== JSON.stringify(handle.node)) {
      throw new Error(
        `${where}: PDA handle ${handle.program}.${handle.name} drifted from the IDL.\n  handle: ${JSON.stringify(handle.node)}\n  IDL:    ${JSON.stringify(pda)}`,
      );
    }
  }
  return programs;
}

function assertUniqueProgramNames(
  entries: { slug: string; program: ProgramNode }[],
): void {
  const owners = new Map<string, string>();
  for (const { slug, program } of entries) {
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
  programs: ProgramSource[],
  protocols: ProtocolSource[],
): void {
  const owners = new Map<string, string>();
  const entries = [
    ...programs.map((source) => ({
      name: source.packageName,
      owner: `programs/${source.slug}`,
    })),
    ...protocols.flatMap((source) =>
      source.config.umbrella === undefined
        ? []
        : [
            {
              name: source.config.umbrella.name,
              owner: `the umbrella of programs/${source.protocol}`,
            },
          ],
    ),
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
 * Resolves each protocol's umbrella members to program names, ordered by the
 * umbrella's `precedence` and then alphabetically.
 */
function resolveUmbrellas(
  protocols: ProtocolSource[],
  entries: { source: ProgramSource; program: ProgramNode }[],
): UmbrellaPackage[] {
  return protocols.flatMap(({ protocol, config }) => {
    const umbrella = config.umbrella;
    if (umbrella === undefined) {
      return [];
    }
    const members = entries
      .filter((entry) => entry.source.protocol === protocol)
      .toSorted((a, b) => a.source.program.localeCompare(b.source.program));
    if (members.length === 0) {
      throw new Error(`programs/${protocol}: the umbrella has no programs`);
    }
    const precedence = umbrella.precedence ?? [];
    for (const program of precedence) {
      if (!members.some((member) => member.source.program === program)) {
        throw new Error(
          `programs/${protocol}: umbrella precedence lists "${program}", which is not a program of the protocol`,
        );
      }
    }
    const rank = (program: string) => {
      const index = precedence.indexOf(program);
      return index === -1 ? precedence.length : index;
    };
    const ordered = members.toSorted(
      (a, b) => rank(a.source.program) - rank(b.source.program),
    );
    return [
      {
        protocol,
        packageName: umbrella.name,
        version: umbrella.version,
        programs: ordered.map((member) => member.program.name),
        ...(umbrella.releaseNotes && { releaseNotes: umbrella.releaseNotes }),
      },
    ];
  });
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
export async function buildMegagraph(input: {
  protocols: ProtocolSource[];
  programs: ProgramSource[];
  externals?: ExternalProgramSource[];
}): Promise<Megagraph> {
  const { protocols, programs: sources } = input;
  const externalSources = input.externals ?? [];
  const externalEntries = (
    await Promise.all(
      externalSources.map(async (source) =>
        (await loadExternalPrograms(source)).map((program) => ({
          source,
          program,
        })),
      ),
    )
  ).flat();
  const externalPrograms = externalEntries.map((entry) => entry.program);
  const linkPrograms = externalPrograms.map(
    (program) => program.name as string,
  );
  if (sources.length === 0) {
    throw new Error("No programs found under programs/");
  }
  assertUniquePackageNames(sources, protocols);

  const externalContext = externalPrograms.map(toContextProgram);
  const firstPass = await Promise.all(
    sources.map((source) =>
      processProgram(source, externalContext, linkPrograms),
    ),
  );
  assertUniqueProgramNames([
    ...sources.map((source, index) => ({
      slug: source.slug,
      program: firstPass[index] ?? programNode({ name: "?", publicKey: "?" }),
    })),
    ...externalEntries.map((entry) => ({
      slug: entry.source.slug,
      program: entry.program,
    })),
  ]);

  const context = firstPass.map(toContextProgram);
  const programs = await Promise.all(
    sources.map((source, index) =>
      processProgram(
        source,
        [...context.filter((_, other) => other !== index), ...externalContext],
        linkPrograms,
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

  const [first, ...rest] = [
    ...sorted.map((entry) => entry.program),
    ...externalPrograms,
  ].toSorted((a, b) => a.name.localeCompare(b.name));
  if (first === undefined) {
    throw new Error("No programs were produced");
  }
  const root = rootNode(first, rest);

  const packageNames = new Map([
    ...sorted.map(
      ({ source, program }) =>
        [program.name as string, source.packageName] as const,
    ),
    ...externalEntries.map(
      ({ source, program }) =>
        [program.name as string, source.external.npm.package] as const,
    ),
  ]);
  const unresolved = findUnresolvedLinks(root);
  if (unresolved.length > 0) {
    const lines = unresolved.map((link) => {
      const owner =
        (link.owner === undefined ? undefined : packageNames.get(link.owner)) ??
        link.owner ??
        "?";
      const target =
        link.kind === "programLinkNode"
          ? link.name
          : `${link.program ?? "(unqualified)"}.${link.name}`;
      const where = link.location === "" ? "" : ` (at ${link.location})`;
      return `  - ${owner}: unresolved ${link.kind.replace(/Node$/, "")} ${target}${where}`;
    });
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
    protocols: protocols.map(({ protocol, config }) => ({
      protocol,
      displayName: config.displayName,
      description: config.description,
      ...(config.homepage !== undefined && { homepage: config.homepage }),
      ...(config.repository !== undefined && {
        repository: config.repository,
      }),
      programs: [...sorted, ...externalEntries]
        .filter((entry) => entry.source.protocol === protocol)
        .map((entry) => entry.program.name as string)
        .toSorted(),
    })),
    packages: sorted.map(({ source, program }) => ({
      program: program.name,
      protocol: source.protocol,
      slug: source.slug,
      packageName: source.packageName,
      version: source.config.package.version,
      dependencies: dependencies.get(program.name) ?? [],
      ...(source.config.package.releaseNotes && {
        releaseNotes: source.config.package.releaseNotes,
      }),
    })),
    umbrellas: resolveUmbrellas(protocols, sorted),
    externals: externalEntries
      .map(({ source, program }) => ({
        program: program.name as string,
        protocol: source.protocol,
        slug: source.slug,
        packageName: source.external.npm.package,
        peerRange: source.external.npm.range,
      }))
      .toSorted((a, b) => a.program.localeCompare(b.program)),
  };
}
