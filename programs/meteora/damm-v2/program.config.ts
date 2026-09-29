import {
  accountValueNode,
  argumentValueNode,
  constant,
  definePdas,
  numberTypeNode,
  programHandle,
  publicKeyTypeNode,
  publicKeyValueNode,
  TOKEN_PROGRAM_VALUE_NODE,
  variable,
} from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";

export const program = programHandle("cpAmm");

export const pdas = definePdas(program, {
  poolAuthority: {
    docs: [
      "The global pool authority PDA that has authority over all pools in the program.",
    ],
    seeds: [constant("pool_authority")],
  },
  config: {
    docs: [
      "Configuration account that stores global protocol settings.",
      "Each config is indexed by a unique u64 index.",
    ],
    seeds: [
      constant("config"),
      variable("index", numberTypeNode("u64"), "The config index"),
    ],
  },
  pool: {
    docs: [
      "A liquidity pool account for a specific token pair under a given config.",
      "Token mints must be sorted - tokenAMint should be lexicographically smaller than tokenBMint.",
    ],
    seeds: [
      constant("pool"),
      variable("config", publicKeyTypeNode(), "The config account address"),
      variable(
        "tokenAMint",
        publicKeyTypeNode(),
        "The first token mint (sorted)",
      ),
      variable(
        "tokenBMint",
        publicKeyTypeNode(),
        "The second token mint (sorted)",
      ),
    ],
  },
  position: {
    docs: [
      "A liquidity position account that tracks a user's deposited liquidity.",
      "Each position is uniquely identified by its associated NFT mint.",
    ],
    seeds: [
      constant("position"),
      variable(
        "positionNft",
        publicKeyTypeNode(),
        "The position NFT mint address",
      ),
    ],
  },
  tokenVault: {
    docs: [
      "A token vault account that holds tokens for a specific pool.",
      "Each pool has separate vaults for token A and token B.",
    ],
    seeds: [
      constant("token_vault"),
      variable("tokenMint", publicKeyTypeNode(), "The token mint address"),
      variable("pool", publicKeyTypeNode(), "The pool address"),
    ],
  },
  rewardVault: {
    docs: [
      "A reward vault account that holds reward tokens for distribution to liquidity providers.",
      "Each pool can have multiple reward vaults indexed by rewardIndex (0-2).",
    ],
    seeds: [
      constant("reward_vault"),
      variable("pool", publicKeyTypeNode(), "The pool address"),
      variable("rewardIndex", numberTypeNode("u8"), "The reward index"),
    ],
  },
  customizablePool: {
    docs: [
      "A customizable pool account that allows for custom fee configurations.",
      "Unlike regular pools, customizable pools are not tied to a config account.",
      "Token mints must be sorted - tokenAMint should be lexicographically smaller than tokenBMint.",
    ],
    seeds: [
      constant("cpool"),
      variable(
        "tokenAMint",
        publicKeyTypeNode(),
        "The first token mint (sorted)",
      ),
      variable(
        "tokenBMint",
        publicKeyTypeNode(),
        "The second token mint (sorted)",
      ),
    ],
  },
  tokenBadge: {
    docs: [
      "A token badge account that stores metadata about a token's permissions and status.",
      "Used to whitelist or configure specific tokens for use in pools.",
    ],
    seeds: [
      constant("token_badge"),
      variable("tokenMint", publicKeyTypeNode(), "The token mint address"),
    ],
  },
  claimFeeOperator: {
    docs: [
      "A claim fee operator account that authorizes an address to claim protocol fees.",
      "Operators can collect fees on behalf of the protocol.",
    ],
    seeds: [
      constant("cf_operator"),
      variable("operator", publicKeyTypeNode(), "The operator address"),
    ],
  },
  positionNftAccount: {
    docs: [
      "The token account that holds the position NFT.",
      "This is a program-owned account that stores the NFT representing a liquidity position.",
    ],
    seeds: [
      constant("position_nft_account"),
      variable(
        "positionNftMint",
        publicKeyTypeNode(),
        "The position NFT mint address",
      ),
    ],
  },
  eventAuthority: {
    docs: ["The event authority PDA used for emitting program events via CPI."],
    seeds: [constant("__event_authority")],
  },
});

// CP-AMM program address
const CP_AMM_PROGRAM_ADDRESS = "cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG";

// Instructions that use pool_authority account
const instructionsWithPoolAuthority = [
  "claimPartnerFee",
  "claimPositionFee",
  "claimProtocolFee",
  "claimReward",
  "closePosition",
  "createPosition",
  "initializeCustomizablePool",
  "initializePoolWithDynamicConfig",
  "initializeReward",
  "removeAllLiquidity",
  "removeLiquidity",
  "swap",
  "swap2",
  "withdrawIneligibleReward",
];

// Instructions that have position_nft_mint and can derive position from it
const instructionsWithPositionNftMint = [
  "closePosition",
  "createPosition",
  "initializeCustomizablePool",
  "initializePool",
  "initializePoolWithDynamicConfig",
];

export default defineProgram({
  package: {
    description: "TypeScript client for Meteora Damm V2 program",
    keywords: ["meteora", "damm", "cpamm", "dex", "amm", "ian-macalinao"],
    version: "0.6.0",
    releaseNotes: [
      "**Breaking:** now has a peer dependency on `@solana-program/token` (`^0.14.0 || ^0.15.0 || ^0.16.0 || ^0.17.0`): the generated code imports the token program addresses (`TOKEN_PROGRAM_ADDRESS`, `ASSOCIATED_TOKEN_PROGRAM_ADDRESS`) and `findAssociatedTokenPda` from it instead of inlining them.",
      "Generated from the program megagraph in macalinao/coda; the README, reference docs and package metadata are regenerated.",
    ],
  },
  instructionAccountDefaultValues: [
    // Set pool_authority for all instructions that use it
    ...instructionsWithPoolAuthority.map((instruction) => ({
      instruction,
      account: "poolAuthority",
      defaultValue: pdas.poolAuthority.value(),
    })),
    // Set position account derived from position NFT mint (only for instructions that have positionNftMint)
    // Note: initialize* instructions already have position as a PDA in the IDL, so we exclude them
    ...instructionsWithPositionNftMint
      .filter(
        (i) =>
          i !== "initializeCustomizablePool" &&
          i !== "initializePool" &&
          i !== "initializePoolWithDynamicConfig",
      )
      .map((instruction) => ({
        instruction,
        account: "position",
        defaultValue: pdas.position.value({
          positionNft: accountValueNode("positionNftMint"),
        }),
      })),
    // Set position_nft_account derived from position NFT mint (only for instructions that have positionNftMint)
    ...instructionsWithPositionNftMint.map((instruction) => ({
      instruction,
      account: "positionNftAccount",
      defaultValue: pdas.positionNftAccount.value({
        positionNftMint: accountValueNode("positionNftMint"),
      }),
    })),
    // Set tokenAProgram to SPL Token program
    {
      account: "tokenAProgram",
      defaultValue: TOKEN_PROGRAM_VALUE_NODE,
    },
    // Set tokenBProgram to SPL Token program
    {
      account: "tokenBProgram",
      defaultValue: TOKEN_PROGRAM_VALUE_NODE,
    },
    // Set program account to CP-AMM program (used with event_authority for CPI)
    {
      account: "program",
      defaultValue: publicKeyValueNode(CP_AMM_PROGRAM_ADDRESS),
    },
    // Set eventAuthority to the event authority PDA
    {
      account: "eventAuthority",
      defaultValue: pdas.eventAuthority.value(),
    },
    // Set tokenAVault derived from tokenAMint and pool
    {
      account: "tokenAVault",
      defaultValue: pdas.tokenVault.value({
        tokenMint: accountValueNode("tokenAMint"),
        pool: accountValueNode("pool"),
      }),
    },
    // Set tokenBVault derived from tokenBMint and pool
    {
      account: "tokenBVault",
      defaultValue: pdas.tokenVault.value({
        tokenMint: accountValueNode("tokenBMint"),
        pool: accountValueNode("pool"),
      }),
    },
    // Set pool to customizablePool PDA for initializeCustomizablePool
    {
      instruction: "initializeCustomizablePool",
      account: "pool",
      defaultValue: pdas.customizablePool.value({
        tokenAMint: accountValueNode("tokenAMint"),
        tokenBMint: accountValueNode("tokenBMint"),
      }),
    },
    // Set pool to pool PDA for initializePool (uses config)
    {
      instruction: "initializePool",
      account: "pool",
      defaultValue: pdas.pool.value({
        config: accountValueNode("config"),
        tokenAMint: accountValueNode("tokenAMint"),
        tokenBMint: accountValueNode("tokenBMint"),
      }),
    },
    // Set pool to pool PDA for initializePoolWithDynamicConfig (uses config)
    {
      instruction: "initializePoolWithDynamicConfig",
      account: "pool",
      defaultValue: pdas.pool.value({
        config: accountValueNode("config"),
        tokenAMint: accountValueNode("tokenAMint"),
        tokenBMint: accountValueNode("tokenBMint"),
      }),
    },
    // Set claimFeeOperator derived from operator for claimProtocolFee
    {
      instruction: "claimProtocolFee",
      account: "claimFeeOperator",
      defaultValue: pdas.claimFeeOperator.value({
        operator: accountValueNode("operator"),
      }),
    },
    // Set rewardVault derived from pool and rewardIndex arg for claimReward
    {
      instruction: "claimReward",
      account: "rewardVault",
      defaultValue: pdas.rewardVault.value({
        pool: accountValueNode("pool"),
        rewardIndex: argumentValueNode("rewardIndex"),
      }),
    },
    // Set rewardVault derived from pool and rewardIndex arg for fundReward
    {
      instruction: "fundReward",
      account: "rewardVault",
      defaultValue: pdas.rewardVault.value({
        pool: accountValueNode("pool"),
        rewardIndex: argumentValueNode("rewardIndex"),
      }),
    },
    // Set rewardVault derived from pool and rewardIndex arg for withdrawIneligibleReward
    {
      instruction: "withdrawIneligibleReward",
      account: "rewardVault",
      defaultValue: pdas.rewardVault.value({
        pool: accountValueNode("pool"),
        rewardIndex: argumentValueNode("rewardIndex"),
      }),
    },
  ],
  visitors: [pdas.visitor],
});
