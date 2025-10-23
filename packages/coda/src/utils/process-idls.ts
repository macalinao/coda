import type { AnchorIdl } from "@codama/nodes-from-anchor";
import type { Codama } from "codama";
import type { CodaConfig } from "../config.js";
import { resolve } from "node:path";
import {
  ASSOCIATED_TOKEN_PROGRAM_VALUE_NODE,
  BPF_UPGRADEABLE_LOADER_PROGRAM_VALUE_NODE,
  fixDocsVisitor,
  MEMO_PROGRAM_VALUE_NODE,
  SYSVAR_INSTRUCTIONS_VALUE_NODE,
  TOKEN_2022_PROGRAM_VALUE_NODE,
  TOKEN_METADATA_PROGRAM_VALUE_NODE,
  TOKEN_PROGRAM_VALUE_NODE,
} from "@macalinao/coda-visitors";
import {
  getCommonInstructionAccountDefaultRules,
  publicKeyValueNode,
  setInstructionAccountDefaultValuesVisitor,
} from "codama";
import { applyCustomVisitors } from "./apply-custom-visitors.js";
import { createCodamaFromIdls } from "./create-codama-from-idls.js";
import { loadConfig } from "./load-config.js";
import { loadIdls } from "./load-idls.js";
import { resolveIdlPaths } from "./resolve-idl-paths.js";

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
}): Promise<{ codama: Codama; config: CodaConfig; idls: AnchorIdl[] }> {
  const configPath = resolve(options.config);
  const config = await loadConfig(configPath);

  // Determine IDL paths - use config if provided, otherwise use command line option
  const idlPathInput = config.idlPath ?? "./idls/*.json";
  const resolvedPaths = await resolveIdlPaths(idlPathInput);

  if (resolvedPaths.length === 0) {
    console.error(
      "Error: No IDL files found matching the specified pattern(s)",
    );
    process.exit(1);
  }

  // Load all IDLs
  const idls = await loadIdls(resolvedPaths);

  // Create Codama instance
  const codama = createCodamaFromIdls(idls);

  codama.update(fixDocsVisitor());

  // Default instruction accounts
  codama.update(
    setInstructionAccountDefaultValuesVisitor([
      ...getCommonInstructionAccountDefaultRules(),
      {
        account: /[\w+]TokenProgram/,
        defaultValue: TOKEN_PROGRAM_VALUE_NODE,
      },
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
        account: /associatedTokenProgram|ataProgram|splAtaProgram/,
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
      ...(config.instructionAccountDefaultValues ?? []),
    ]),
  );

  // Apply custom visitors
  applyCustomVisitors(codama, config, idls);

  return { codama, config, idls };
}
