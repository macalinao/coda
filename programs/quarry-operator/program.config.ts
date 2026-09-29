import {
  accountValueNode,
  addPdasVisitor,
  constantPdaSeedNodeFromString,
  pdaLinkNode,
  pdaSeedValueNode,
  pdaValueNode,
  publicKeyTypeNode,
  setInstructionAccountDefaultValuesVisitor,
  updateAccountsVisitor,
  variablePdaSeedNode,
} from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";

export default defineProgram({
  package: {
    name: "@solana-programs/quarry-operator",
    description:
      "TypeScript client for the Quarry Operator program, which delegates Quarry rewarder administration",
    keywords: ["quarry", "mining", "operator", "ian-macalinao"],
    initialVersion: "0.8.1",
  },

  visitors: [
    updateAccountsVisitor({
      operator: {
        pda: pdaLinkNode("operator"),
      },
    }),
    addPdasVisitor({
      quarryOperator: [
        {
          name: "operator",
          docs: [
            "Operator account with delegated authority to manage quarries",
          ],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "Operator"),
            variablePdaSeedNode("base", publicKeyTypeNode()),
          ],
        },
      ],
    }),
    setInstructionAccountDefaultValuesVisitor([
      ...["createOperator", "createOperatorV2"].map((instruction) => ({
        account: "operator",
        instruction,
        defaultValue: pdaValueNode(pdaLinkNode("operator"), [
          pdaSeedValueNode("base", accountValueNode("base")),
        ]),
      })),

      // Delegated quarries are Quarry Mine quarries.
      ...["delegateCreateQuarry", "delegateCreateQuarryV2"].map(
        (instruction) => ({
          account: "quarry",
          instruction,
          defaultValue: pdaValueNode(pdaLinkNode("quarry", "quarryMine"), [
            pdaSeedValueNode("rewarder", accountValueNode("rewarder")),
            pdaSeedValueNode("tokenMint", accountValueNode("tokenMint")),
          ]),
        }),
      ),
    ]),
  ],
});
