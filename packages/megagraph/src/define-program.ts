import type { CodaConfig } from "@macalinao/coda";

/**
 * npm metadata of the package generated for a program.
 */
export interface ProgramPackageConfig {
  /** npm package name, e.g. `@solana-programs/quarry-mine`. */
  name: string;
  /** One-line package description. */
  description: string;
  /** npm keywords. `coda`, `solana`, `client` and `typescript` are always added. */
  keywords?: string[];
  /**
   * Version written the first time the package is generated. Afterwards the
   * version in the generated `package.json` is preserved, since changesets owns
   * it from then on.
   * @default "0.0.0"
   */
  initialVersion?: string;
}

/**
 * Configuration of a single program under `programs/<slug>/`.
 *
 * The program's IDL is always `programs/<slug>/idl.json` and its package is
 * always generated into `clients/<slug>/`. The visitors run on a root whose
 * main program is this program, so bare selectors and links (e.g.
 * `pdaLinkNode("miner")`) refer to this program. Every other program in the
 * repository is also present in that root (PDAs only), which is what lets a
 * program-qualified link such as `pdaLinkNode("metadata", "tokenMetadata")`
 * resolve; changes the visitors make to those other programs are discarded.
 */
export interface ProgramConfig extends Pick<
  CodaConfig,
  "instructionAccountDefaultValues" | "visitors"
> {
  package: ProgramPackageConfig;
}

/**
 * Define the configuration of a program in `programs/<slug>/program.config.ts`.
 */
export function defineProgram(config: ProgramConfig): ProgramConfig {
  return config;
}

/**
 * An umbrella package that re-exports several program packages, e.g. the
 * historical `@solana-programs/quarry` bundling the six Quarry programs.
 *
 * A bundle contains no rendered code: its generated `package.json` depends
 * on the bundled program packages and its `src/index.ts` re-exports them.
 */
export interface BundleConfig {
  /** Package directory under `clients/`. Must not clash with a program slug. */
  slug: string;
  package: ProgramPackageConfig;
  /**
   * Slugs of the bundled programs (directories under `programs/`), in
   * priority order: when two bundled packages export the same name, the
   * bundle re-exports the one from the program listed first.
   */
  programs: string[];
}

/**
 * Define the umbrella packages in `programs/bundles.ts`.
 */
export function defineBundles(bundles: BundleConfig[]): BundleConfig[] {
  return bundles;
}
