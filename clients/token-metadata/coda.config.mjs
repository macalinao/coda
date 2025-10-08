import {
  ASSOCIATED_TOKEN_PROGRAM_VALUE_NODE,
  addPdasVisitor,
  constantPdaSeedNodeFromString,
  defineConfig,
  publicKeyTypeNode,
  SYSTEM_PROGRAM_VALUE_NODE,
  SYSVAR_INSTRUCTIONS_VALUE_NODE,
  SYSVAR_RENT_VALUE_NODE,
  setInstructionAccountDefaultValuesVisitor,
  TOKEN_PROGRAM_VALUE_NODE,
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
        defaultValue: SYSTEM_PROGRAM_VALUE_NODE,
      },
      {
        account: "sysvarInstructions",
        defaultValue: SYSVAR_INSTRUCTIONS_VALUE_NODE,
      },
      {
        account: "tokenProgram",
        defaultValue: TOKEN_PROGRAM_VALUE_NODE,
      },
      {
        account: "splTokenProgram",
        defaultValue: TOKEN_PROGRAM_VALUE_NODE,
      },
      {
        account: "ataProgram",
        defaultValue: ASSOCIATED_TOKEN_PROGRAM_VALUE_NODE,
      },
      {
        account: "splAtaProgram",
        defaultValue: ASSOCIATED_TOKEN_PROGRAM_VALUE_NODE,
      },
      {
        account: "rent",
        defaultValue: SYSVAR_RENT_VALUE_NODE,
      },
    ]),
  ],
});
