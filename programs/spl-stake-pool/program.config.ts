import {
  accountValueNode,
  addPdasVisitor,
  argumentValueNode,
  constantPdaSeedNodeFromString,
  definedTypeLinkNode,
  enumValueNode,
  numberTypeNode,
  pdaLinkNode,
  pdaSeedValueNode,
  pdaValueNode,
  publicKeyTypeNode,
  publicKeyValueNode,
  remainderOptionTypeNode,
  setAccountDiscriminatorFromFieldVisitor,
  setInstructionAccountDefaultValuesVisitor,
  variablePdaSeedNode,
} from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";

export default defineProgram({
  package: {
    name: "@solana-programs/spl-stake-pool",
    description: "TypeScript client for the SPL Stake Pool program",
    keywords: [
      "spl",
      "stake-pool",
      "staking",
      "delegation",
      "validator",
      "ian-macalinao",
    ],
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
            variablePdaSeedNode(
              "seed",
              remainderOptionTypeNode(numberTypeNode("u32", "le")),
            ),
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
      {
        account: "transientStakeAccount",
        defaultValue: pdaValueNode(pdaLinkNode("transientStake"), [
          pdaSeedValueNode(
            "voteAccountAddress",
            accountValueNode("validatorVoteAccount"),
          ),
          pdaSeedValueNode("stakePoolAddress", accountValueNode("stakePool")),
          pdaSeedValueNode("seed", argumentValueNode("transientStakeSeed")),
        ]),
      },
    ]),
  ],
});
