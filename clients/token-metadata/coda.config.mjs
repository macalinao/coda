import {
  addPdasVisitor,
  constantPdaSeedNodeFromString,
  defineConfig,
  publicKeyTypeNode,
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
  ],
});

export default defineConfig({
  outputDir: "./src/generated",
  docs: {
    npmPackageName: "@macalinao/clients-token-metadata",
  },
  visitors: [addCustomPDAsVisitor],
});
