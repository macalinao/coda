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
