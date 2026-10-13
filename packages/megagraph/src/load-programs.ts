import type {
  ExternalProgramDefinition,
  ProgramDefinition,
  ProtocolDefinition,
} from "./define-program.ts";
import type {
  MegagraphConfig,
  ProgramPackageConfig,
  ProtocolRelease,
} from "./define-release.ts";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

/**
 * Directory of the program inputs relative to the repository root: the
 * `src/` of the `programs` workspace package. Holds `megagraph.config.ts`,
 * one directory per protocol and, in it, one per program.
 */
export const PROGRAMS_DIR = "programs/src";

/** Conventional file name of a program's IDL inside its directory. */
export const IDL_FILE = "idl.json";

/** Conventional file name of a program's definition inside its directory. */
export const PROGRAM_CONFIG_FILE = "program.config.ts";

/** Conventional file name of a protocol's definition inside its directory. */
export const PROTOCOL_CONFIG_FILE = "protocol.config.ts";

/** Conventional file name of a program's or protocol's release metadata. */
export const RELEASE_CONFIG_FILE = "release.config.ts";

/** File name of the megagraph config inside the programs directory. */
export const MEGAGRAPH_CONFIG_FILE = "megagraph.config.ts";

/** Default npm scope of generated packages. */
export const PACKAGE_SCOPE = "@solana-programs";

/**
 * A protocol of the megagraph, at `programs/src/<protocol>/`.
 */
export interface ProtocolSource {
  /** The protocol's name, also its directory, e.g. `quarry`. */
  protocol: string;
  /** Absolute path of the protocol directory. */
  dir: string;
  definition: ProtocolDefinition;
  /** Release metadata (keywords, umbrella), if any. */
  release?: ProtocolRelease;
}

/**
 * An external program of the megagraph: a vendored Codama IDL for a program
 * whose client is published elsewhere.
 */
export interface ExternalProgramSource {
  protocol: string;
  program: string;
  slug: string;
  /** Absolute path of the program directory (holds `npm-peers.json`). */
  dir: string;
  definition: ExternalProgramDefinition;
}

/**
 * A program of the megagraph, at `programs/src/<protocol>/<program>/`.
 */
export interface ProgramSource {
  /** Protocol name, e.g. `quarry`. */
  protocol: string;
  /** Program name within the protocol, e.g. `merge-mine`. */
  program: string;
  /** `<protocol>/<program>`, also the package path in the generated tree. */
  slug: string;
  /**
   * Absolute path of the program directory, which holds the optional
   * `README.md` and `CHANGELOG.md` seeds of its package.
   */
  dir: string;
  definition: ProgramDefinition;
  /** The npm package generated for the program. */
  package: ProgramPackageConfig;
  /** npm package name, explicit or `@solana-programs/<protocol>-<program>`. */
  packageName: string;
}

/** The programs and protocols of a megagraph config, validated. */
export interface MegagraphSources {
  protocols: ProtocolSource[];
  programs: ProgramSource[];
  externals: ExternalProgramSource[];
}

function compareCodeUnits(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

const KEBAB_CASE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function assertName(kind: string, name: string): void {
  if (!KEBAB_CASE.test(name)) {
    throw new Error(`${kind} name must be kebab-case: "${name}"`);
  }
}

/**
 * Resolves the programs and protocols a megagraph config lists to their
 * directories under `programsDir` and validates them: names are kebab-case
 * and unique, every program's directory exists (it holds the README and
 * CHANGELOG seeds and is linked from generated READMEs), and every protocol
 * release belongs to a protocol of a listed program. Sorted by path.
 */
export function resolvePrograms(
  config: Pick<MegagraphConfig, "programs" | "externals" | "protocols">,
  programsDir: string,
): MegagraphSources {
  const protocolsByName = new Map<string, ProtocolDefinition>();
  const addProtocol = (definition: ProtocolDefinition): void => {
    assertName("Protocol", definition.name);
    const existing = protocolsByName.get(definition.name);
    if (existing !== undefined && existing !== definition) {
      throw new Error(
        `Two different protocol definitions are named "${definition.name}"`,
      );
    }
    protocolsByName.set(definition.name, definition);
  };

  const slugs = new Set<string>();
  const locate = (definition: {
    protocol: ProtocolDefinition;
    name: string;
  }): { protocol: string; program: string; slug: string; dir: string } => {
    addProtocol(definition.protocol);
    assertName("Program", definition.name);
    const slug = `${definition.protocol.name}/${definition.name}`;
    if (slugs.has(slug)) {
      throw new Error(`Program ${slug} is listed more than once`);
    }
    slugs.add(slug);
    const dir = join(programsDir, slug);
    if (!existsSync(dir)) {
      throw new Error(
        `${PROGRAMS_DIR}/${slug}: missing directory for program ${slug}`,
      );
    }
    return {
      protocol: definition.protocol.name,
      program: definition.name,
      slug,
      dir,
    };
  };

  // Sorted like the paths of their directories (by UTF-16 code units).
  const bySlug = (a: { slug: string }, b: { slug: string }): number =>
    compareCodeUnits(`${a.slug}/`, `${b.slug}/`);

  const programs: ProgramSource[] = config.programs
    .map((release) => ({
      ...locate(release.program),
      definition: release.program,
      package: release.package,
      packageName:
        release.package.name ??
        `${PACKAGE_SCOPE}/${release.program.protocol.name}-${release.program.name}`,
    }))
    .toSorted(bySlug);
  const externals: ExternalProgramSource[] = config.externals
    .map((definition) => ({ ...locate(definition), definition }))
    .toSorted(bySlug);

  const releases = new Map<string, ProtocolRelease>();
  for (const release of config.protocols) {
    const name = release.protocol.name;
    if (protocolsByName.get(name) !== release.protocol) {
      throw new Error(
        `The release of protocol "${name}" does not belong to the protocol of any listed program`,
      );
    }
    if (releases.has(name)) {
      throw new Error(`Protocol "${name}" has more than one release`);
    }
    releases.set(name, release);
  }

  const protocols: ProtocolSource[] = [...protocolsByName.values()]
    .map((definition) => {
      const source: ProtocolSource = {
        protocol: definition.name,
        dir: join(programsDir, definition.name),
        definition,
      };
      const release = releases.get(definition.name);
      if (release !== undefined) {
        source.release = release;
      }
      return source;
    })
    .toSorted((a, b) => compareCodeUnits(`${a.protocol}/`, `${b.protocol}/`));

  return { protocols, programs, externals };
}

/** Path of a program's generated package relative to the generated tree. */
export function getProgramPackagePath(source: { slug: string }): string {
  return join("packages", source.slug);
}

/** Path of a protocol's umbrella package relative to the generated tree. */
export function getUmbrellaPackagePath(protocol: string): string {
  return join("packages", protocol);
}

/**
 * Loads `<programsDir>/megagraph.config.ts`.
 */
export async function loadMegagraphConfig(
  programsDir: string,
): Promise<MegagraphConfig> {
  const configModule = (await import(
    pathToFileURL(join(programsDir, MEGAGRAPH_CONFIG_FILE)).href
  )) as { default: MegagraphConfig };
  return configModule.default;
}

/**
 * Loads `<programsDir>/megagraph.config.ts` and resolves the programs it
 * lists (see {@link resolvePrograms}).
 */
export async function loadPrograms(
  programsDir: string,
): Promise<MegagraphSources> {
  return resolvePrograms(await loadMegagraphConfig(programsDir), programsDir);
}
