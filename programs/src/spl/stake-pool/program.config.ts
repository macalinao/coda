import type { AnchorIdl } from "@codama/nodes-from-anchor";
import {
  accountValueNode,
  argumentValueNode,
  constant,
  definePdas,
  enumValueNode,
  numberTypeNode,
  programHandle,
  publicKeyTypeNode,
  publicKeyValueNode,
  remainderOptionTypeNode,
  setAccountDiscriminatorFromFieldVisitor,
  setInstructionAccountDefaultValuesVisitor,
  variable,
} from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";
import idlJson from "./idl.json" with { type: "json" };
import protocol from "../protocol.config.ts";

/** The program's Anchor IDL. */
export const idl: AnchorIdl = idlJson as AnchorIdl;

export const program = programHandle("splStakePool");

export const pdas = definePdas(program, {
  withdrawAuthority: {
    seeds: [
      variable("stakePoolAddress", publicKeyTypeNode()),
      constant("withdraw"),
    ],
  },
  stake: {
    seeds: [
      variable("voteAccountAddress", publicKeyTypeNode()),
      variable("stakePoolAddress", publicKeyTypeNode()),
      variable("seed", remainderOptionTypeNode(numberTypeNode("u32", "le"))),
    ],
  },
  transientStake: {
    seeds: [
      constant("transient"),
      variable("voteAccountAddress", publicKeyTypeNode()),
      variable("stakePoolAddress", publicKeyTypeNode()),
      variable("seed", numberTypeNode("u64", "le")),
    ],
  },
  ephemeralStake: {
    seeds: [
      constant("ephemeral"),
      variable("stakePoolAddress", publicKeyTypeNode()),
      variable("seed", numberTypeNode("u64", "le")),
    ],
  },
});

export default defineProgram({
  protocol,
  name: "stake-pool",
  program,
  idl,
  pdas,
  // The on-chain program. Addresses were checked with getAccountInfo on
  // mainnet-beta and devnet (2026-10).
  metadata: {
    displayName: "SPL Stake Pool",
    description: "Pools stake accounts, managed by another entity.",
    repository: "https://github.com/solana-program/stake-pool",
    addresses: {
      devnet: "SPoo1Ku8WFXoNDMHPsrGSTSG1Y47rzgn41SLUNakuHy",
    },
    docs: "https://www.solana-program.com/docs/stake-pool",
    audits: [
      {
        auditor: "Halborn",
        url: "https://github.com/anza-xyz/security-audits/blob/master/spl/HalbornStakePoolAudit-2023-12-31.pdf",
        date: "2023-12-31",
      },
    ],
  },
  visitors: [
    setAccountDiscriminatorFromFieldVisitor({
      // Realm accounts
      stakePool: {
        field: "accountType",
        value: enumValueNode(program.definedType("accountType"), "StakePool"),
      },
      validatorList: {
        field: "accountType",
        value: enumValueNode(
          program.definedType("accountType"),
          "ValidatorList",
        ),
      },
    }),
    pdas.visitor,
    setInstructionAccountDefaultValuesVisitor([
      {
        account: "stakeProgram",
        defaultValue: publicKeyValueNode(
          "Stake11111111111111111111111111111111111111",
        ),
      },
      {
        account: "withdrawAuthority",
        defaultValue: pdas.withdrawAuthority.value({
          stakePoolAddress: accountValueNode("stakePool"),
        }),
      },
      {
        account: "transientStakeAccount",
        defaultValue: pdas.transientStake.value({
          voteAccountAddress: accountValueNode("validatorVoteAccount"),
          stakePoolAddress: accountValueNode("stakePool"),
          seed: argumentValueNode("transientStakeSeed"),
        }),
      },
    ]),
  ],
});
