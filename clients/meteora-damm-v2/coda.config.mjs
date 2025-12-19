import {
  accountValueNode,
  addPdasVisitor,
  argumentValueNode,
  constantPdaSeedNodeFromString,
  defineConfig,
  numberTypeNode,
  pdaLinkNode,
  pdaSeedValueNode,
  pdaValueNode,
  publicKeyTypeNode,
  publicKeyValueNode,
  TOKEN_PROGRAM_VALUE_NODE,
  variablePdaSeedNode,
} from "@macalinao/coda";

// CP-AMM program address
const CP_AMM_PROGRAM_ADDRESS = "cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG";

const addCustomPDAsVisitor = addPdasVisitor({
  cpAmm: [
    {
      name: "poolAuthority",
      docs: [
        "The global pool authority PDA that has authority over all pools in the program.",
      ],
      seeds: [constantPdaSeedNodeFromString("utf8", "pool_authority")],
    },
    {
      name: "config",
      docs: [
        "Configuration account that stores global protocol settings.",
        "Each config is indexed by a unique u64 index.",
      ],
      seeds: [
        constantPdaSeedNodeFromString("utf8", "config"),
        variablePdaSeedNode("index", numberTypeNode("u64"), "The config index"),
      ],
    },
    {
      name: "pool",
      docs: [
        "A liquidity pool account for a specific token pair under a given config.",
        "Token mints must be sorted - tokenAMint should be lexicographically smaller than tokenBMint.",
      ],
      seeds: [
        constantPdaSeedNodeFromString("utf8", "pool"),
        variablePdaSeedNode(
          "config",
          publicKeyTypeNode(),
          "The config account address",
        ),
        variablePdaSeedNode(
          "tokenAMint",
          publicKeyTypeNode(),
          "The first token mint (sorted)",
        ),
        variablePdaSeedNode(
          "tokenBMint",
          publicKeyTypeNode(),
          "The second token mint (sorted)",
        ),
      ],
    },
    {
      name: "position",
      docs: [
        "A liquidity position account that tracks a user's deposited liquidity.",
        "Each position is uniquely identified by its associated NFT mint.",
      ],
      seeds: [
        constantPdaSeedNodeFromString("utf8", "position"),
        variablePdaSeedNode(
          "positionNft",
          publicKeyTypeNode(),
          "The position NFT mint address",
        ),
      ],
    },
    {
      name: "tokenVault",
      docs: [
        "A token vault account that holds tokens for a specific pool.",
        "Each pool has separate vaults for token A and token B.",
      ],
      seeds: [
        constantPdaSeedNodeFromString("utf8", "token_vault"),
        variablePdaSeedNode(
          "tokenMint",
          publicKeyTypeNode(),
          "The token mint address",
        ),
        variablePdaSeedNode("pool", publicKeyTypeNode(), "The pool address"),
      ],
    },
    {
      name: "rewardVault",
      docs: [
        "A reward vault account that holds reward tokens for distribution to liquidity providers.",
        "Each pool can have multiple reward vaults indexed by rewardIndex (0-2).",
      ],
      seeds: [
        constantPdaSeedNodeFromString("utf8", "reward_vault"),
        variablePdaSeedNode("pool", publicKeyTypeNode(), "The pool address"),
        variablePdaSeedNode(
          "rewardIndex",
          numberTypeNode("u8"),
          "The reward index",
        ),
      ],
    },
    {
      name: "customizablePool",
      docs: [
        "A customizable pool account that allows for custom fee configurations.",
        "Unlike regular pools, customizable pools are not tied to a config account.",
        "Token mints must be sorted - tokenAMint should be lexicographically smaller than tokenBMint.",
      ],
      seeds: [
        constantPdaSeedNodeFromString("utf8", "cpool"),
        variablePdaSeedNode(
          "tokenAMint",
          publicKeyTypeNode(),
          "The first token mint (sorted)",
        ),
        variablePdaSeedNode(
          "tokenBMint",
          publicKeyTypeNode(),
          "The second token mint (sorted)",
        ),
      ],
    },
    {
      name: "tokenBadge",
      docs: [
        "A token badge account that stores metadata about a token's permissions and status.",
        "Used to whitelist or configure specific tokens for use in pools.",
      ],
      seeds: [
        constantPdaSeedNodeFromString("utf8", "token_badge"),
        variablePdaSeedNode(
          "tokenMint",
          publicKeyTypeNode(),
          "The token mint address",
        ),
      ],
    },
    {
      name: "claimFeeOperator",
      docs: [
        "A claim fee operator account that authorizes an address to claim protocol fees.",
        "Operators can collect fees on behalf of the protocol.",
      ],
      seeds: [
        constantPdaSeedNodeFromString("utf8", "cf_operator"),
        variablePdaSeedNode(
          "operator",
          publicKeyTypeNode(),
          "The operator address",
        ),
      ],
    },
    {
      name: "positionNftAccount",
      docs: [
        "The token account that holds the position NFT.",
        "This is a program-owned account that stores the NFT representing a liquidity position.",
      ],
      seeds: [
        constantPdaSeedNodeFromString("utf8", "position_nft_account"),
        variablePdaSeedNode(
          "positionNftMint",
          publicKeyTypeNode(),
          "The position NFT mint address",
        ),
      ],
    },
    {
      name: "eventAuthority",
      docs: [
        "The event authority PDA used for emitting program events via CPI.",
      ],
      seeds: [constantPdaSeedNodeFromString("utf8", "__event_authority")],
    },
  ],
});

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

export default defineConfig({
  outputDir: "./src/generated",
  instructionAccountDefaultValues: [
    // Set pool_authority for all instructions that use it
    ...instructionsWithPoolAuthority.map((instruction) => ({
      instruction,
      account: "poolAuthority",
      defaultValue: pdaValueNode(pdaLinkNode("poolAuthority"), []),
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
        defaultValue: pdaValueNode(pdaLinkNode("position"), [
          pdaSeedValueNode("positionNft", accountValueNode("positionNftMint")),
        ]),
      })),
    // Set position_nft_account derived from position NFT mint (only for instructions that have positionNftMint)
    ...instructionsWithPositionNftMint.map((instruction) => ({
      instruction,
      account: "positionNftAccount",
      defaultValue: pdaValueNode(pdaLinkNode("positionNftAccount"), [
        pdaSeedValueNode(
          "positionNftMint",
          accountValueNode("positionNftMint"),
        ),
      ]),
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
      defaultValue: pdaValueNode(pdaLinkNode("eventAuthority"), []),
    },
    // Set tokenAVault derived from tokenAMint and pool
    {
      account: "tokenAVault",
      defaultValue: pdaValueNode(pdaLinkNode("tokenVault"), [
        pdaSeedValueNode("tokenMint", accountValueNode("tokenAMint")),
        pdaSeedValueNode("pool", accountValueNode("pool")),
      ]),
    },
    // Set tokenBVault derived from tokenBMint and pool
    {
      account: "tokenBVault",
      defaultValue: pdaValueNode(pdaLinkNode("tokenVault"), [
        pdaSeedValueNode("tokenMint", accountValueNode("tokenBMint")),
        pdaSeedValueNode("pool", accountValueNode("pool")),
      ]),
    },
    // Set pool to customizablePool PDA for initializeCustomizablePool
    {
      instruction: "initializeCustomizablePool",
      account: "pool",
      defaultValue: pdaValueNode(pdaLinkNode("customizablePool"), [
        pdaSeedValueNode("tokenAMint", accountValueNode("tokenAMint")),
        pdaSeedValueNode("tokenBMint", accountValueNode("tokenBMint")),
      ]),
    },
    // Set pool to pool PDA for initializePool (uses config)
    {
      instruction: "initializePool",
      account: "pool",
      defaultValue: pdaValueNode(pdaLinkNode("pool"), [
        pdaSeedValueNode("config", accountValueNode("config")),
        pdaSeedValueNode("tokenAMint", accountValueNode("tokenAMint")),
        pdaSeedValueNode("tokenBMint", accountValueNode("tokenBMint")),
      ]),
    },
    // Set pool to pool PDA for initializePoolWithDynamicConfig (uses config)
    {
      instruction: "initializePoolWithDynamicConfig",
      account: "pool",
      defaultValue: pdaValueNode(pdaLinkNode("pool"), [
        pdaSeedValueNode("config", accountValueNode("config")),
        pdaSeedValueNode("tokenAMint", accountValueNode("tokenAMint")),
        pdaSeedValueNode("tokenBMint", accountValueNode("tokenBMint")),
      ]),
    },
    // Set claimFeeOperator derived from operator for claimProtocolFee
    {
      instruction: "claimProtocolFee",
      account: "claimFeeOperator",
      defaultValue: pdaValueNode(pdaLinkNode("claimFeeOperator"), [
        pdaSeedValueNode("operator", accountValueNode("operator")),
      ]),
    },
    // Set rewardVault derived from pool and rewardIndex arg for claimReward
    {
      instruction: "claimReward",
      account: "rewardVault",
      defaultValue: pdaValueNode(pdaLinkNode("rewardVault"), [
        pdaSeedValueNode("pool", accountValueNode("pool")),
        pdaSeedValueNode("rewardIndex", argumentValueNode("rewardIndex")),
      ]),
    },
    // Set rewardVault derived from pool and rewardIndex arg for fundReward
    {
      instruction: "fundReward",
      account: "rewardVault",
      defaultValue: pdaValueNode(pdaLinkNode("rewardVault"), [
        pdaSeedValueNode("pool", accountValueNode("pool")),
        pdaSeedValueNode("rewardIndex", argumentValueNode("rewardIndex")),
      ]),
    },
    // Set rewardVault derived from pool and rewardIndex arg for withdrawIneligibleReward
    {
      instruction: "withdrawIneligibleReward",
      account: "rewardVault",
      defaultValue: pdaValueNode(pdaLinkNode("rewardVault"), [
        pdaSeedValueNode("pool", accountValueNode("pool")),
        pdaSeedValueNode("rewardIndex", argumentValueNode("rewardIndex")),
      ]),
    },
  ],
  visitors: [addCustomPDAsVisitor],
});
