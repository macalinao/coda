import {
  addPdasVisitor,
  constantPdaSeedNodeFromString,
  defineConfig,
  numberTypeNode,
  publicKeyTypeNode,
  variablePdaSeedNode,
} from "@macalinao/coda";

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
  ],
});

export default defineConfig({
  outputDir: "./src/generated",
  visitors: [addCustomPDAsVisitor],
});
