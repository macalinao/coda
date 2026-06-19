import {
  accountValueNode,
  addPdasVisitor,
  constantPdaSeedNodeFromString,
  defineConfig,
  pdaLinkNode,
  pdaSeedValueNode,
  pdaValueNode,
  publicKeyTypeNode,
  setInstructionAccountDefaultValuesVisitor,
  stringTypeNode,
  variablePdaSeedNode,
} from "@macalinao/coda";

export default defineConfig({
  outputDir: "./src/generated",
  docs: {
    npmPackageName: "@macalinao/clients-mpl-token-auth-rules",
  },

  visitors: [
    addPdasVisitor({
      mplTokenAuthRules: [
        {
          name: "ruleSet",
          docs: ["RuleSet PDA storing a named set of authorization rules"],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "rule_set"),
            variablePdaSeedNode(
              "owner",
              publicKeyTypeNode(),
              "The owner (creator) of the rule set",
            ),
            variablePdaSeedNode(
              "name",
              stringTypeNode("utf8"),
              "The name of the rule set",
            ),
          ],
        },
        {
          name: "ruleSetBuffer",
          docs: ["Buffer PDA used to assemble large rule sets before applying"],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "rule_set"),
            variablePdaSeedNode(
              "owner",
              publicKeyTypeNode(),
              "The owner (creator) of the rule set",
            ),
          ],
        },
      ],
    }),

    setInstructionAccountDefaultValuesVisitor(
      // The buffer PDA is fully derivable from the payer.
      ["createOrUpdate", "writeToBuffer"].map((instruction) => ({
        account: "bufferPda",
        instruction,
        defaultValue: pdaValueNode(pdaLinkNode("ruleSetBuffer"), [
          pdaSeedValueNode("owner", accountValueNode("payer")),
        ]),
      })),
    ),
  ],
});
