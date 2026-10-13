import type { AnchorIdl } from "@codama/nodes-from-anchor";
import type { CodaConfig, ProgramHandle, RootNode } from "@macalinao/coda";

/**
 * A file in a git repository at a release, e.g. where an IDL was taken from.
 */
export interface GitFileSource {
  /** Repository URL, e.g. `https://github.com/QuarryProtocol/quarry`. */
  repository: string;
  /** Git tag of the release the file was taken from. */
  tag?: string;
  /** Full (40-character) commit hash the file was taken from. */
  commit?: string;
  /** Path of the file in the repository. */
  path: string;
}

/** Clusters a program can be deployed to. */
export type ProgramCluster = "mainnet" | "devnet";

/** Lifecycle of an on-chain program. */
export type ProgramStatus = "active" | "deprecated";

/** A published security audit of a program. */
export interface ProgramAudit {
  /** Firm or person that performed the audit. */
  auditor: string;
  /** Link to the report. */
  url: string;
  /** Date of the report, `YYYY-MM` or `YYYY-MM-DD`. */
  date?: string;
}

/**
 * Descriptive metadata of an on-chain program. Every field is optional; the
 * graph build validates what it can check.
 */
export interface ProgramMetadataConfig {
  /** Human-readable name, e.g. `Quarry Mine`. */
  displayName?: string;
  /**
   * What the on-chain program does. Distinct from the description of the npm
   * package generated for it, which is release metadata.
   */
  description?: string;
  /** Source repository of the on-chain program. */
  repository?: string;
  /** Where the program's IDL comes from. */
  idlSource?: GitFileSource;
  /**
   * Program addresses per cluster. `mainnet` defaults to the IDL's address
   * and, when given, must equal it; `null` records that the program is not
   * deployed on mainnet.
   */
  addresses?: {
    mainnet?: string | null;
    devnet?: string;
  };
  /** Documentation of the program. */
  docs?: string;
  /** Published security audits. */
  audits?: ProgramAudit[];
  /** @default "active" */
  status?: ProgramStatus;
  /**
   * The program that replaces this one: its handle (preferred, imported from
   * its definition) or its Codama name (e.g. `whirlpool`). Only valid when
   * `status` is `"deprecated"`.
   */
  supersededBy?: string | Pick<ProgramHandle, "name">;
}

/**
 * A protocol: a group of programs maintained together, e.g. Quarry.
 */
export interface ProtocolDefinition {
  /**
   * Kebab-case identifier, e.g. `quarry`. Also the protocol's directory under
   * `programs/src/` and the prefix of its programs' default package names.
   */
  name: string;
  /** Human-readable name, e.g. `Quarry`. */
  displayName: string;
  /** Short description of the protocol, for docs and directories. */
  description: string;
  /** Protocol website. */
  homepage?: string;
  /** Source repository of the on-chain programs. */
  repository?: string;
}

/**
 * Defines a protocol, conventionally in
 * `programs/src/<protocol>/protocol.config.ts`.
 */
export function defineProtocol<T extends ProtocolDefinition>(definition: T): T {
  return definition;
}

/**
 * What a Solana program is, independent of how its client is released: its
 * IDL, typed handles to it and its PDAs, the Coda visitors that complete the
 * IDL, and descriptive metadata of the on-chain program.
 *
 * The visitors run on a root whose main program is this program, so bare
 * selectors (e.g. `updateAccountsVisitor({ miner: ... })`) only match this
 * program's nodes. Links should always be created through program and PDA
 * handles (`programHandle`, `definePdas` from `@macalinao/coda`), which
 * qualify them with their program; to link into another program, import its
 * definition's handles. Every other program's PDAs are also present in that
 * root, so a PDA default value linking into another program resolves.
 */
export interface ProgramDefinition extends Pick<
  CodaConfig,
  "instructionAccountDefaultValues" | "visitors"
> {
  /** The protocol the program belongs to. */
  protocol: ProtocolDefinition;
  /**
   * Kebab-case identifier within the protocol, e.g. `merge-mine`. Also the
   * program's directory under `programs/src/<protocol>/`.
   */
  name: string;
  /** Handle to the program; its name must be the IDL's program name. */
  program: ProgramHandle;
  /** The program's Anchor IDL. */
  idl: AnchorIdl;
  /**
   * Typed handles to the PDAs the definition declares (`definePdas`), for
   * other definitions and clients to link against.
   */
  pdas?: object;
  /** Descriptive metadata of the on-chain program. */
  metadata?: ProgramMetadataConfig;
}

/**
 * Defines a program, conventionally in
 * `programs/src/<protocol>/<program>/program.config.ts`.
 */
export function defineProgram<T extends ProgramDefinition>(definition: T): T {
  return definition;
}

/**
 * The npm package publishing an external program's client, and the versions
 * of it the generated packages support.
 */
export interface ExternalNpmPackage {
  /** Package that exports the program's generated client. */
  package: string;
  /**
   * Supported versions: the `peerDependencies` range of every generated
   * package whose code imports `package`. Must stay aligned with the shared
   * `@solana/kit` range (`megagraph peers` checks it).
   */
  range: string;
}

/**
 * A program whose client is published by someone else (e.g.
 * `@solana-program/token`). Its IDL is a vendored Codama IDL (not an Anchor
 * IDL) and may contain several programs. It is part of the graph so links
 * into it resolve and are validated, but it is never rendered and gets no
 * package; links into it are imported from `npm.package`, which the linking
 * packages peer-depend on.
 */
export interface ExternalProgramDefinition {
  /** The protocol the program belongs to. */
  protocol: ProtocolDefinition;
  /** Kebab-case identifier within the protocol, e.g. `token`. */
  name: string;
  /** The vendored Codama IDL. */
  idl: RootNode;
  npm: ExternalNpmPackage;
  /** Where the vendored Codama IDL comes from. */
  source: GitFileSource & { tag: string; commit: string };
  /**
   * Typed handles the definition exports for other definitions to link
   * against. The graph build asserts each one matches the IDL exactly (name,
   * seeds and program), so a vendored IDL update cannot silently drift from
   * them.
   */
  handles: {
    programs?: Pick<ProgramHandle, "name">[];
    pdas?: { program: string; name: string; node: unknown }[];
  };
}

/**
 * Defines an external program, conventionally in
 * `programs/src/<protocol>/<program>/program.config.ts`.
 */
export function defineExternalProgram<T extends ExternalProgramDefinition>(
  definition: T,
): T {
  return definition;
}
