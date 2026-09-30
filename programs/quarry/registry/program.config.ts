import {
  constant,
  definePdas,
  programHandle,
  publicKeyTypeNode,
  updateAccountsVisitor,
  variable,
} from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";

export const program = programHandle("quarryRegistry");

export const pdas = definePdas(program, {
  registry: {
    docs: ["Registry tracking all quarries for a rewarder"],
    seeds: [
      constant("QuarryRegistry"),
      variable("rewarder", publicKeyTypeNode()),
    ],
  },
});

export default defineProgram({
  package: {
    description:
      "TypeScript client for the Quarry Registry program, which tracks the quarries of a rewarder",
    keywords: ["quarry", "registry", "ian-macalinao"],
    version: "0.1.0",
    releaseNotes: [
      "Split out of `@solana-programs/quarry`, which now re-exports this package.",
    ],
  },

  visitors: [
    updateAccountsVisitor({
      registry: {
        pda: pdas.registry.link,
      },
    }),
    pdas.visitor,
  ],
});
