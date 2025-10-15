import {
  accountValueNode,
  addPdasVisitor,
  constantPdaSeedNodeFromString,
  defineConfig,
  definedTypeLinkNode,
  enumValueNode,
  numberTypeNode,
  pdaLinkNode,
  pdaSeedValueNode,
  pdaValueNode,
  publicKeyTypeNode,
  publicKeyValueNode,
  setAccountDiscriminatorFromFieldVisitor,
  setInstructionAccountDefaultValuesVisitor,
  variablePdaSeedNode,
} from "@macalinao/coda";

/** @type {import("@macalinao/coda").CodaConfig} */
export default defineConfig({
  // Use glob pattern to match both IDL files
  outputDir: "./src/generated",
  docs: {
    npmPackageName: "@macalinao/clients-spl-stake-pool",
  },
  visitors: [
    setAccountDiscriminatorFromFieldVisitor({
      // Realm accounts
      stakePool: {
        field: "accountType",
        value: enumValueNode(definedTypeLinkNode("accountType"), "StakePool"),
      },
      validatorList: {
        field: "accountType",
        value: enumValueNode(
          definedTypeLinkNode("accountType"),
          "ValidatorList",
        ),
      },
    }),
    addPdasVisitor({
      splStakePool: [
        {
          name: "withdrawAuthority",
          seeds: [
            variablePdaSeedNode("stakePoolAddress", publicKeyTypeNode()),
            constantPdaSeedNodeFromString("utf8", "withdraw"),
          ],
        },
        {
          name: "stake",
          seeds: [
            variablePdaSeedNode("voteAccountAddress", publicKeyTypeNode()),
            variablePdaSeedNode("stakePoolAddress", publicKeyTypeNode()),
          ],
        },
        {
          name: "stakeWithSeed",
          seeds: [
            variablePdaSeedNode("voteAccountAddress", publicKeyTypeNode()),
            variablePdaSeedNode("stakePoolAddress", publicKeyTypeNode()),
            variablePdaSeedNode("seed", numberTypeNode("u32", "le")),
          ],
        },
        {
          name: "transientStake",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "transient"),
            variablePdaSeedNode("voteAccountAddress", publicKeyTypeNode()),
            variablePdaSeedNode("stakePoolAddress", publicKeyTypeNode()),
            variablePdaSeedNode("seed", numberTypeNode("u64", "le")),
          ],
        },
        {
          name: "ephemeralStake",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "ephemeral"),
            variablePdaSeedNode("stakePoolAddress", publicKeyTypeNode()),
            variablePdaSeedNode("seed", numberTypeNode("u64", "le")),
          ],
        },
      ],
    }),
    setInstructionAccountDefaultValuesVisitor([
      {
        account: "stakeProgram",
        defaultValue: publicKeyValueNode(
          "Stake11111111111111111111111111111111111111",
        ),
      },
      {
        account: "withdrawAuthority",
        defaultValue: pdaValueNode(pdaLinkNode("withdrawAuthority"), [
          pdaSeedValueNode("stakePoolAddress", accountValueNode("stakePool")),
        ]),
      },
    ]),
  ],
});
