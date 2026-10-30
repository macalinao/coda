import {
  SYSVAR_INSTRUCTIONS_ADDRESS,
  SYSVAR_RENT_ADDRESS,
} from "@solana/sysvars";
import { LEGACY_MEMO_PROGRAM_ADDRESS_V3 } from "@solana-program/memo";
import { SYSTEM_PROGRAM_ADDRESS } from "@solana-program/system";
import {
  ASSOCIATED_TOKEN_PROGRAM_ADDRESS,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";
import { TOKEN_2022_PROGRAM_ADDRESS } from "@solana-program/token-2022";
import { publicKeyValueNode } from "codama";

export const SYSTEM_PROGRAM_VALUE_NODE = publicKeyValueNode(
  SYSTEM_PROGRAM_ADDRESS,
  "systemProgram",
);

export const TOKEN_PROGRAM_VALUE_NODE = publicKeyValueNode(
  TOKEN_PROGRAM_ADDRESS,
  "tokenProgram",
);

export const TOKEN_2022_PROGRAM_VALUE_NODE = publicKeyValueNode(
  TOKEN_2022_PROGRAM_ADDRESS,
  "token2022Program",
);

export const ASSOCIATED_TOKEN_PROGRAM_VALUE_NODE = publicKeyValueNode(
  ASSOCIATED_TOKEN_PROGRAM_ADDRESS,
  "associatedTokenProgram",
);

export const SYSVAR_RENT_VALUE_NODE = publicKeyValueNode(
  SYSVAR_RENT_ADDRESS,
  "rentSysvar",
);

export const SYSVAR_INSTRUCTIONS_VALUE_NODE = publicKeyValueNode(
  SYSVAR_INSTRUCTIONS_ADDRESS,
  "instructionsSysvar",
);

// SPL Memo v3 (MemoSq4g...). @solana-program/memo >= 0.14 exports the v4
// program as MEMO_PROGRAM_ADDRESS, but existing on-chain programs (e.g. Orca
// Whirlpools' *V2 instructions) check for the v3 program ID.
export const MEMO_PROGRAM_VALUE_NODE = publicKeyValueNode(
  LEGACY_MEMO_PROGRAM_ADDRESS_V3,
  "memoProgram",
);

export const BPF_UPGRADEABLE_LOADER_PROGRAM_VALUE_NODE = publicKeyValueNode(
  "BPFLoaderUpgradeab1e11111111111111111111111",
  "bpfUpgradeableLoaderProgram",
);

export const TOKEN_METADATA_PROGRAM_VALUE_NODE = publicKeyValueNode(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
  "tokenMetadataProgram",
);
