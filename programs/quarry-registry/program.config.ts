import {
  addPdasVisitor,
  constantPdaSeedNodeFromString,
  pdaLinkNode,
  publicKeyTypeNode,
  updateAccountsVisitor,
  variablePdaSeedNode,
} from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";

export default defineProgram({
  package: {
    name: "@solana-programs/quarry-registry",
    description:
      "TypeScript client for the Quarry Registry program, which tracks the quarries of a rewarder",
    keywords: ["quarry", "registry", "ian-macalinao"],
    initialVersion: "0.8.1",
  },

  visitors: [
    updateAccountsVisitor({
      registry: {
        pda: pdaLinkNode("registry"),
      },
    }),
    addPdasVisitor({
      quarryRegistry: [
        {
          name: "registry",
          docs: ["Registry tracking all quarries for a rewarder"],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "QuarryRegistry"),
            variablePdaSeedNode("rewarder", publicKeyTypeNode()),
          ],
        },
      ],
    }),
  ],
});
