import type { ProgramConfig, ProtocolConfig } from "./define-program.ts";
import { dirname, join, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { glob } from "glob";

/** File name of a program's IDL inside its directory. */
export const IDL_FILE = "idl.json";

/** File name of a program's config inside its directory. */
export const PROGRAM_CONFIG_FILE = "program.config.ts";

/** File name of a protocol's config inside its directory. */
export const PROTOCOL_CONFIG_FILE = "protocol.config.ts";

/** Default npm scope of generated packages. */
export const PACKAGE_SCOPE = "@solana-programs";

/**
 * A protocol directory, `programs/<protocol>/`, with its loaded config.
 */
export interface ProtocolSource {
  /** Directory name, e.g. `quarry`. */
  protocol: string;
  /** Absolute path of the protocol directory. */
  dir: string;
  config: ProtocolConfig;
}

/**
 * A program directory, `programs/<protocol>/<program>/`, with its loaded
 * config.
 */
export interface ProgramSource {
  /** Protocol directory name, e.g. `quarry`. */
  protocol: string;
  /** Program directory name, e.g. `merge-mine`. */
  program: string;
  /** `<protocol>/<program>`, also the package path in the generated tree. */
  slug: string;
  /** Absolute path of the program directory. */
  dir: string;
  config: ProgramConfig;
  /** npm package name, explicit or `@solana-programs/<protocol>-<program>`. */
  packageName: string;
}

async function importDefault<T>(path: string): Promise<T> {
  const configModule = (await import(pathToFileURL(path).href)) as {
    default: T;
  };
  return configModule.default;
}

/**
 * Loads every protocol and program config under `programsDir`, sorted by
 * path. Every program directory must sit in a protocol directory that has a
 * `protocol.config.ts`.
 */
export async function loadPrograms(programsDir: string): Promise<{
  protocols: ProtocolSource[];
  programs: ProgramSource[];
}> {
  const protocolPaths = (
    await glob(`*/${PROTOCOL_CONFIG_FILE}`, {
      cwd: programsDir,
      absolute: true,
    })
  ).toSorted();
  const protocols: ProtocolSource[] = [];
  for (const path of protocolPaths) {
    const dir = dirname(path);
    protocols.push({
      protocol: relative(programsDir, dir),
      dir,
      config: await importDefault<ProtocolConfig>(path),
    });
  }
  const protocolNames = new Set(protocols.map((source) => source.protocol));

  const programPaths = (
    await glob(`**/${PROGRAM_CONFIG_FILE}`, {
      cwd: programsDir,
      absolute: true,
      ignore: ["**/node_modules/**"],
    })
  ).toSorted();
  const programs: ProgramSource[] = [];
  for (const path of programPaths) {
    const dir = dirname(path);
    const segments = relative(programsDir, dir).split(sep);
    const [protocol, program] = segments;
    if (
      segments.length !== 2 ||
      protocol === undefined ||
      program === undefined
    ) {
      throw new Error(
        `${relative(programsDir, path)}: programs must live in programs/<protocol>/<program>/`,
      );
    }
    if (!protocolNames.has(protocol)) {
      throw new Error(
        `programs/${protocol}/${program}: missing programs/${protocol}/${PROTOCOL_CONFIG_FILE}`,
      );
    }
    const config = await importDefault<ProgramConfig>(path);
    programs.push({
      protocol,
      program,
      slug: `${protocol}/${program}`,
      dir,
      config,
      packageName:
        config.package.name ?? `${PACKAGE_SCOPE}/${protocol}-${program}`,
    });
  }
  return { protocols, programs };
}

/** Path of a program's generated package relative to the generated tree. */
export function getProgramPackagePath(source: { slug: string }): string {
  return join("packages", source.slug);
}

/** Path of a protocol's umbrella package relative to the generated tree. */
export function getUmbrellaPackagePath(protocol: string): string {
  return join("packages", protocol);
}
