import type { AnchorIdl } from "@codama/nodes-from-anchor";
import type { Codama, ProgramNode } from "codama";
import type { CodaConfig } from "../config.ts";
import { resolve } from "node:path";
import {
  ASSOCIATED_TOKEN_PROGRAM_VALUE_NODE,
  BPF_UPGRADEABLE_LOADER_PROGRAM_VALUE_NODE,
  eventsToDefinedTypesVisitor,
  fixDocsVisitor,
  linkKnownProgramsVisitor,
  MEMO_PROGRAM_VALUE_NODE,
  SYSVAR_INSTRUCTIONS_VALUE_NODE,
  TOKEN_2022_PROGRAM_VALUE_NODE,
  TOKEN_METADATA_PROGRAM_VALUE_NODE,
  TOKEN_PROGRAM_VALUE_NODE,
} from "@macalinao/coda-visitors";
import {
  getCommonInstructionAccountDefaultRules,
  publicKeyValueNode,
  rootNode,
  rootNodeVisitor,
  setInstructionAccountDefaultValuesVisitor,
} from "codama";
import { applyCustomVisitors } from "./apply-custom-visitors.ts";
import { createCodamaFromIdls } from "./create-codama-from-idls.ts";
import { loadConfig } from "./load-config.ts";
import { loadIdls } from "./load-idls.ts";
import { resolveIdlPaths } from "./resolve-idl-paths.ts";

const ASSOCIATED_TOKEN_PROGRAM_ACCOUNT_REGEX =
  /associatedTokenProgram|ataProgram|splAtaProgram/;
const TOKEN_PROGRAM_ACCOUNT_REGEX =
  /(?!associatedTokenProgram)([\w]+)TokenProgram/;

/**
 * Options for {@link processConfig}.
 */
export interface ProcessConfigOptions {
  /**
   * Directory that `config.idlPath` is resolved against.
   * @default process.cwd()
   */
  baseDir?: string;
  /**
   * Programs added to the root alongside the config's own programs while the
   * config's visitors run. They are only there so that program-qualified links
   * (e.g. `pdaLinkNode("metadata", "tokenMetadata")`) resolve; callers are
   * expected to pick their own programs back out of the result.
   */
  contextPrograms?: ProgramNode[];
  /**
   * Programs whose addresses and associated token account PDA should become
   * links when they are present in the root (typically among
   * `contextPrograms`), instead of inline values. See
   * `linkKnownProgramsVisitor`.
   */
  linkPrograms?: string[];
  /** Suppress progress logging. */
  quiet?: boolean;
}

/**
 * Parse the IDLs a config points at and apply the default account rules and
 * the config's custom visitors.
 */
export async function processConfig(
  config: CodaConfig,
  options: ProcessConfigOptions = {},
): Promise<{ codama: Codama; idls: AnchorIdl[] }> {
  const { quiet = false } = options;

  // Determine IDL paths - use config if provided, otherwise use command line option
  const idlPathInput = config.idlPath ?? "./idls/*.json";
  const resolveOptions =
    options.baseDir === undefined ? {} : { baseDir: options.baseDir };
  const resolvedPaths = await resolveIdlPaths(idlPathInput, resolveOptions);

  if (resolvedPaths.length === 0) {
    throw new Error("No IDL files found matching the specified pattern(s)");
  }

  // Load all IDLs
  const idls = await loadIdls(resolvedPaths, { quiet });

  // Create Codama instance
  const codama = createCodamaFromIdls(idls, { quiet });

  const contextPrograms = options.contextPrograms ?? [];
  if (contextPrograms.length > 0) {
    const root = codama.getRoot();
    codama.update(
      rootNodeVisitor(() =>
        rootNode(root.program, [
          // Parsed roots can omit `additionalPrograms` despite its type.
          ...(root.additionalPrograms ?? []),
          ...contextPrograms,
        ]),
      ),
    );
  }

  codama.update(fixDocsVisitor());

  // Emit Anchor events as defined types. Newer Codama parses events into
  // dedicated event nodes that the JS renderer no longer renders, so lift
  // them back into defined types to keep generating event codecs.
  codama.update(eventsToDefinedTypesVisitor());

  // Default instruction accounts
  codama.update(
    setInstructionAccountDefaultValuesVisitor([
      ...getCommonInstructionAccountDefaultRules(),
      {
        account: "bpfUpgradeableLoaderProgram",
        defaultValue: BPF_UPGRADEABLE_LOADER_PROGRAM_VALUE_NODE,
      },
      {
        account: "memoProgram",
        defaultValue: MEMO_PROGRAM_VALUE_NODE,
      },
      {
        account: "metadataProgram",
        defaultValue: TOKEN_METADATA_PROGRAM_VALUE_NODE,
      },
      {
        account: "token2022Program",
        defaultValue: TOKEN_2022_PROGRAM_VALUE_NODE,
      },
      {
        account: ASSOCIATED_TOKEN_PROGRAM_ACCOUNT_REGEX,
        defaultValue: ASSOCIATED_TOKEN_PROGRAM_VALUE_NODE,
      },
      {
        account: "stakeConfigSysvar",
        defaultValue: publicKeyValueNode(
          "StakeConfig11111111111111111111111111111111",
        ),
      },
      {
        account: "sysvarInstructions",
        defaultValue: SYSVAR_INSTRUCTIONS_VALUE_NODE,
      },
      {
        account: TOKEN_PROGRAM_ACCOUNT_REGEX,
        defaultValue: TOKEN_PROGRAM_VALUE_NODE,
      },
      ...(config.instructionAccountDefaultValues ?? []),
    ]),
  );

  // Apply custom visitors
  applyCustomVisitors(codama, config, idls, { quiet });

  if (options.linkPrograms !== undefined && options.linkPrograms.length > 0) {
    codama.update(linkKnownProgramsVisitor(options.linkPrograms));
  }

  return { codama, idls };
}

/**
 * Process IDLs with the common workflow:
 * 1. Load config
 * 2. Resolve IDL paths
 * 3. Load IDLs
 * 4. Create Codama instance
 * 5. Apply custom visitors
 */
export async function processIdls(options: {
  config: string;
  baseDir?: string;
}): Promise<{ codama: Codama; config: CodaConfig; idls: AnchorIdl[] }> {
  const configPath = resolve(options.config);
  const config = await loadConfig(configPath);

  const { codama, idls } = await processConfig(
    config,
    options.baseDir === undefined ? {} : { baseDir: options.baseDir },
  ).catch((error: unknown) => {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  });
  return { codama, config, idls };
}
