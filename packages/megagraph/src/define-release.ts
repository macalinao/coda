import type {
  ExternalProgramDefinition,
  ProgramDefinition,
  ProtocolDefinition,
} from "./define-program.ts";

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
 * How a program's client package is released: repository-internal metadata
 * that only the release pipeline reads, kept out of the program's definition.
 */
export interface ProgramRelease {
  /** The program the package is generated for. */
  program: ProgramDefinition;
  /** The npm package generated for the program. */
  package: ProgramPackageConfig;
}

/**
 * Defines how a program's client package is released, conventionally in
 * `programs/src/<protocol>/<program>/release.config.ts`.
 */
export function defineProgramRelease(release: ProgramRelease): ProgramRelease {
  return release;
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
   * Programs that take precedence, in order, when several member packages
   * export the same name. Members not listed follow alphabetically by name.
   */
  precedence?: ProgramDefinition[];
}

/**
 * How a protocol's packages are released: shared npm keywords and an
 * optional umbrella package.
 */
export interface ProtocolRelease {
  /** The protocol. */
  protocol: ProtocolDefinition;
  /** npm keywords shared by every package of the protocol. */
  keywords?: string[];
  /** Optional umbrella package re-exporting all of the protocol's programs. */
  umbrella?: UmbrellaConfig;
}

/**
 * Defines how a protocol's packages are released, conventionally in
 * `programs/src/<protocol>/release.config.ts`.
 */
export function defineProtocolRelease(
  release: ProtocolRelease,
): ProtocolRelease {
  return release;
}

/**
 * The megagraph, `programs/src/megagraph.config.ts`: every program it is
 * built from and the repository-wide settings.
 */
export interface MegagraphConfig {
  /** Every program a client package is generated for, with its release. */
  programs: ProgramRelease[];
  /** Programs whose clients are published elsewhere; linked to, never generated. */
  externals: ExternalProgramDefinition[];
  /**
   * Release metadata of protocols. A protocol of a listed program without
   * one has no shared keywords and no umbrella.
   */
  protocols: ProtocolRelease[];
  /** Peer dependencies every generated package declares. */
  peerDependencies: Record<string, string>;
  /** The generated workspace (`clients/`), also the published mirror. */
  workspace: {
    /** Root package name. */
    name: string;
    /** GitHub repository the workspace is published to, e.g. `org/repo`. */
    repository: string;
    /** Default branch of that repository; READMEs link to it. */
    defaultBranch: string;
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
 * Defines the megagraph in `programs/src/megagraph.config.ts`.
 */
export function defineMegagraph(config: MegagraphConfig): MegagraphConfig {
  return config;
}
