import {
  addPdasVisitor,
  constantPdaSeedNodeFromString,
  defineConfig,
  publicKeyTypeNode,
  publicKeyValueNode,
  setInstructionAccountDefaultValuesVisitor,
  variablePdaSeedNode,
} from "@macalinao/coda";

const addCustomPDAsVisitor = addPdasVisitor({
  tokenMetadata: [
    {
      name: "metadata",
      seeds: [
        constantPdaSeedNodeFromString("utf8", "metadata"),
        variablePdaSeedNode(
          "programId",
          publicKeyTypeNode(),
          "The address of the program",
        ),
        variablePdaSeedNode(
          "mint",
          publicKeyTypeNode(),
          "The address of the mint account",
        ),
      ],
    },
    {
      name: "masterEdition",
      seeds: [
        constantPdaSeedNodeFromString("utf8", "metadata"),
        variablePdaSeedNode(
          "programId",
          publicKeyTypeNode(),
          "The address of the program",
        ),
        variablePdaSeedNode(
          "mint",
          publicKeyTypeNode(),
          "The address of the mint account",
        ),
        constantPdaSeedNodeFromString("utf8", "edition"),
      ],
    },
  ],
});

export default defineConfig({
  outputDir: "./src/generated",
  docs: {
    npmPackageName: "@macalinao/clients-token-metadata",
  },
  visitors: [
    addCustomPDAsVisitor,
    setInstructionAccountDefaultValuesVisitor([
      {
        account: "systemProgram",
        defaultValue: publicKeyValueNode("11111111111111111111111111111111"),
      },
      {
        account: "sysvarInstructions",
        defaultValue: publicKeyValueNode(
          "Sysvar1nstructions1111111111111111111111111",
        ),
      },
      {
        account: "tokenProgram",
        defaultValue: publicKeyValueNode(
          "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        ),
      },
      {
        account: "splTokenProgram",
        defaultValue: publicKeyValueNode(
          "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        ),
      },
      {
        account: "ataProgram",
        defaultValue: publicKeyValueNode(
          "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
        ),
      },
      {
        account: "splAtaProgram",
        defaultValue: publicKeyValueNode(
          "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
        ),
      },
      {
        account: "rent",
        defaultValue: publicKeyValueNode(
          "SysvarRent111111111111111111111111111111111",
        ),
      },
    ]),
  ],
});
