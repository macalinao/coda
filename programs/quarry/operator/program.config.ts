import {
  accountValueNode,
  constant,
  definePdas,
  programHandle,
  publicKeyTypeNode,
  setInstructionAccountDefaultValuesVisitor,
  updateAccountsVisitor,
  variable,
} from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";
import * as quarryMine from "../mine/program.config.ts";

export const program = programHandle("quarryOperator");

export const pdas = definePdas(program, {
  operator: {
    docs: ["Operator account with delegated authority to manage quarries"],
    seeds: [constant("Operator"), variable("base", publicKeyTypeNode())],
  },
});

export default defineProgram({
  package: {
    description:
      "TypeScript client for the Quarry Operator program, which delegates Quarry rewarder administration",
    keywords: ["quarry", "mining", "operator", "ian-macalinao"],
    version: "0.1.0",
    releaseNotes: [
      "Split out of `@solana-programs/quarry`, which now re-exports this package.",
      "Imports `findQuarryPda` from `@solana-programs/quarry-mine` instead of duplicating it.",
    ],
  },

  visitors: [
    updateAccountsVisitor({
      operator: {
        pda: pdas.operator.link,
      },
    }),
    pdas.visitor,
    setInstructionAccountDefaultValuesVisitor([
      ...["createOperator", "createOperatorV2"].map((instruction) => ({
        account: "operator",
        instruction,
        defaultValue: pdas.operator.value({ base: accountValueNode("base") }),
      })),

      // Delegated quarries are Quarry Mine quarries.
      ...["delegateCreateQuarry", "delegateCreateQuarryV2"].map(
        (instruction) => ({
          account: "quarry",
          instruction,
          defaultValue: quarryMine.pdas.quarry.value({
            rewarder: accountValueNode("rewarder"),
            tokenMint: accountValueNode("tokenMint"),
          }),
        }),
      ),
    ]),
  ],
});
