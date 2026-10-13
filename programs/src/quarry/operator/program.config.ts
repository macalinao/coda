import type { AnchorIdl } from "@codama/nodes-from-anchor";
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
import idlJson from "./idl.json" with { type: "json" };
import protocol from "../protocol.config.ts";

/** The program's Anchor IDL. */
export const idl: AnchorIdl = idlJson as AnchorIdl;

export const program = programHandle("quarryOperator");

export const pdas = definePdas(program, {
  operator: {
    docs: ["Operator account with delegated authority to manage quarries"],
    seeds: [constant("Operator"), variable("base", publicKeyTypeNode())],
  },
});

export default defineProgram({
  protocol,
  name: "operator",
  program,
  idl,
  pdas,
  // The on-chain program. Addresses were checked with getAccountInfo on
  // mainnet-beta and devnet (2026-10).
  metadata: {
    displayName: "Quarry Operator",
    description:
      "Delegates the administration of a Quarry Mine rewarder (setting rates, creating quarries, allocating shares) to separate roles.",
    repository: "https://github.com/QuarryProtocol/quarry",
    addresses: {
      devnet: "QoP6NfrQbaGnccXQrMLUkog2tQZ4C1RFgJcwDnT8Kmz",
    },
    docs: "https://docs.rs/quarry-operator",
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
