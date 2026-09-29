import type { CodaConfig } from "@macalinao/coda";

/**
 * npm metadata of the package generated for a program.
 */
export interface ProgramPackageConfig {
  /**
   * npm package name.
   * @default `@solana-programs/<protocol>-<program>`
   */
  name?: string;
  /** One-line package description. */
  description: string;
  /**
   * npm keywords, added to the protocol's keywords. `coda`, `solana`,
   * `client`, `esm` and `typescript` are always added.
   */
  keywords?: string[];
  /**
   * Version of the package's first release, used while the package does not
   * exist in the release state yet. Afterwards the release pipeline derives
   * versions from what changed.
   */
  version: string;
  /**
   * Changelog lines for the package's first release (e.g. what changed since
   * a version published before the megagraph).
   */
  releaseNotes?: string[];
}

/**
 * Configuration of a single program under `programs/<protocol>/<program>/`.
 *
 * The program's IDL is always `idl.json` next to the config. The visitors
 * run on a root whose main program is this program, so bare selectors (e.g.
 * `updateAccountsVisitor({ miner: ... })`) only match this program's nodes.
 * Links should always be created through program and PDA handles
 * (`programHandle`, `definePdas` from `@macalinao/coda`), which qualify them
 * with their program. Every other program's PDAs are also present in that
 * root, so a PDA default value linking into another program resolves.
 */
export interface ProgramConfig extends Pick<
  CodaConfig,
  "instructionAccountDefaultValues" | "visitors"
> {
  package: ProgramPackageConfig;
}

/**
 * Define the configuration of a program in
 * `programs/<protocol>/<program>/program.config.ts`.
 */
export function defineProgram(config: ProgramConfig): ProgramConfig {
  return config;
}

/**
 * An umbrella package re-exporting every program package of a protocol, e.g.
 * `@solana-programs/quarry`. It contains no rendered code of its own.
 */
export interface UmbrellaConfig {
  /** npm package name. */
  name: string;
  /** One-line package description. */
  description: string;
  /** npm keywords, added to the protocol's keywords. */
  keywords?: string[];
  /** Version of the package's first release; see {@link ProgramPackageConfig.version}. */
  version: string;
  /** Changelog lines for the package's first release. */
  releaseNotes?: string[];
  /**
   * Program directories that take precedence, in order, when several member
   * packages export the same name. Members not listed follow alphabetically.
   */
  precedence?: string[];
}

/**
 * Configuration of a protocol, `programs/<protocol>/protocol.config.ts`. A
 * protocol groups the programs in its directory.
 */
export interface ProtocolConfig {
  /** Human-readable name, e.g. `Quarry`. */
  displayName: string;
  /** Short description of the protocol, for docs and directories. */
  description: string;
  /** Protocol website. */
  homepage?: string;
  /** Source repository of the on-chain programs. */
  repository?: string;
  /** npm keywords shared by every package of the protocol. */
  keywords?: string[];
  /** Optional umbrella package re-exporting all of the protocol's programs. */
  umbrella?: UmbrellaConfig;
}

/**
 * Define a protocol in `programs/<protocol>/protocol.config.ts`.
 */
export function defineProtocol(config: ProtocolConfig): ProtocolConfig {
  return config;
}

/**
 * An external program: one whose client is published by someone else (e.g.
 * `@solana-program/token`). It is part of the graph so links into it resolve
 * and are validated, but it is never rendered and gets no package. Links into
 * it are imported from `package`, which the linking packages peer-depend on.
 */
export interface ExternalProgramConfig {
  /** npm package that exports the program's generated client. */
  package: string;
  /** Peer dependency range of that package for the packages linking to it. */
  peerRange: string;
  /** Where the vendored Codama IDL (`idl.json`) comes from. */
  source: {
    repository: string;
    /** Git tag of the release the IDL was taken from. */
    tag: string;
    commit: string;
    path: string;
  };
  /**
   * Typed handles the config exports for other configs to link against. The
   * graph build asserts each one matches the IDL exactly (name, seeds and
   * program), so a vendored IDL update cannot silently drift from them.
   */
  handles: {
    programs?: { name: string }[];
    pdas?: { program: string; name: string; node: unknown }[];
  };
}

/**
 * Configuration of an external program under
 * `programs/<protocol>/<program>/program.config.ts`. Its `idl.json` is a
 * Codama IDL (not an Anchor IDL) and may contain several programs.
 */
export interface ExternalProgramDefinition {
  external: ExternalProgramConfig;
}

/**
 * Define an external program in `programs/<protocol>/<program>/program.config.ts`.
 */
export function defineExternalProgram(
  config: ExternalProgramDefinition,
): ExternalProgramDefinition {
  return config;
}

/**
 * Repository-wide settings of the megagraph, `programs/megagraph.config.ts`.
 */
export interface MegagraphConfig {
  /** Peer dependencies every generated package declares. */
  peerDependencies: Record<string, string>;
  /** The generated workspace (`clients/`), also the published mirror. */
  workspace: {
    /** Root package name. */
    name: string;
    /** GitHub repository the workspace is published to, e.g. `org/repo`. */
    repository: string;
    /**
     * Catalog entries the generated manifests use (`catalog:`); versions are
     * read from the repository's root package.json catalog.
     */
    catalog: string[];
    /**
     * Root devDependencies of the workspace; versions are read from the
     * repository's root package.json (devDependencies, then catalog).
     */
    devDependencies: string[];
    /** Files copied from the repository root into the workspace root. */
    copyFiles: string[];
  };
  /** GitHub repository the packages are generated and published from. */
  sourceRepository: string;
}

/**
 * Define the repository-wide settings in `programs/megagraph.config.ts`.
 */
export function defineMegagraph(config: MegagraphConfig): MegagraphConfig {
  return config;
}
