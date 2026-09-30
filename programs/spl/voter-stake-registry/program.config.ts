import {
  accountNode,
  accountValueNode,
  addNodesVisitor,
  bytesTypeNode,
  bytesValueNode,
  constant,
  definePdas,
  fieldDiscriminatorNode,
  fixedSizeTypeNode,
  numberTypeNode,
  optionTypeNode,
  programHandle,
  publicKeyTypeNode,
  publicKeyValueNode,
  setInstructionAccountDefaultValuesVisitor,
  structFieldTypeNode,
  structTypeNode,
  updateAccountsVisitor,
  variable,
} from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";

export const program = programHandle("voterStakeRegistry");

export const pdas = definePdas(program, {
  registrar: {
    docs: [
      "The voting registrar. There can only be a single registrar",
      "per governance realm and governing mint.",
    ],
    seeds: [
      variable("realm", publicKeyTypeNode()),
      constant("registrar"),
      variable("realmGoverningTokenMint", publicKeyTypeNode()),
    ],
  },
  voter: {
    docs: [
      "The voter account for a given voter authority.",
      "Each voter authority has a unique voter account per registrar.",
    ],
    seeds: [
      variable("registrar", publicKeyTypeNode()),
      constant("voter"),
      variable("voterAuthority", publicKeyTypeNode()),
    ],
  },
  voterWeightRecord: {
    docs: [
      "The voter weight record is the account that will be shown to spl-governance",
      "to prove how much vote weight the voter has. See update_voter_weight_record.",
    ],
    seeds: [
      variable("registrar", publicKeyTypeNode()),
      constant("voter-weight-record"),
      variable("voterAuthority", publicKeyTypeNode()),
    ],
  },
});

export default defineProgram({
  package: {
    name: "@solana-programs/voter-stake-registry",
    description:
      "TypeScript client for the SPL Governance Voter Stake Registry program",
    keywords: [
      "spl",
      "governance",
      "voter-stake-registry",
      "dao",
      "voting",
      "staking",
      "realm",
      "ian-macalinao",
    ],
    version: "0.7.0",
    releaseNotes: [
      "**Breaking:** now has a peer dependency on `@solana-program/token` (`^0.14.0 || ^0.15.0 || ^0.16.0 || ^0.17.0`): the generated code imports the token program addresses (`TOKEN_PROGRAM_ADDRESS`, `ASSOCIATED_TOKEN_PROGRAM_ADDRESS`) and `findAssociatedTokenPda` from it instead of inlining them.",
      "Generated from the program megagraph in macalinao/coda; the README, reference docs and package metadata are regenerated.",
    ],
  },
  visitors: [
    pdas.visitor,
    addNodesVisitor({
      voterStakeRegistry: {
        accounts: [
          // See: https://github.com/Mythic-Project/oyster/blob/main/packages/governance-sdk/src/addins/serialisation.ts
          accountNode({
            name: "voterWeightRecord",
            discriminators: [fieldDiscriminatorNode("discriminator", 0)],
            data: structTypeNode([
              structFieldTypeNode({
                name: "discriminator",
                defaultValueStrategy: "omitted",
                type: fixedSizeTypeNode(bytesTypeNode(), 8),
                defaultValue: bytesValueNode("base16", "3265663939623462"),
              }),
              structFieldTypeNode({
                name: "realm",
                type: publicKeyTypeNode(),
              }),
              structFieldTypeNode({
                name: "governingTokenMint",
                type: publicKeyTypeNode(),
              }),
              structFieldTypeNode({
                name: "governingTokenOwner",
                type: publicKeyTypeNode(),
              }),
              structFieldTypeNode({
                name: "voterWeight",
                type: numberTypeNode("u64"),
              }),
              structFieldTypeNode({
                name: "voterWeightExpiry",
                type: optionTypeNode(numberTypeNode("u64")),
              }),
              structFieldTypeNode({
                name: "weightAction",
                type: optionTypeNode(numberTypeNode("u8")),
              }),
              structFieldTypeNode({
                name: "weightActionTarget",
                type: optionTypeNode(publicKeyTypeNode()),
              }),
              // ['realm', 'pubkey'],
              // ['governingTokenMint', 'pubkey'],
              // ['governingTokenOwner', 'pubkey'],
              // ['voterWeight', 'u64'],
              // ['voterWeightExpiry', { kind: 'option', type: 'u64' }],
              // ['weightAction', { kind: 'option', type: 'u8' }],
              // ['weightActionTarget', { kind: 'option', type: 'pubkey' }],
            ]),
            pda: pdas.voterWeightRecord.link,
          }),
        ],
      },
    }),
    updateAccountsVisitor({
      registrar: {
        pda: pdas.registrar.link,
      },
      voter: {
        pda: pdas.voter.link,
      },
    }),

    setInstructionAccountDefaultValuesVisitor([
      {
        account: "governanceProgramId",
        defaultValue: publicKeyValueNode(
          "GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw",
        ),
      },
      {
        account: "voter",
        instruction: "createVoter",
        defaultValue: pdas.voter.value({
          registrar: accountValueNode("registrar"),
          voterAuthority: accountValueNode("voterAuthority"),
        }),
      },
      {
        account: "voterWeightRecord",
        instruction: "createVoter",
        defaultValue: pdas.voterWeightRecord.value({
          registrar: accountValueNode("registrar"),
          voterAuthority: accountValueNode("voterAuthority"),
        }),
      },
    ]),
  ],
});
