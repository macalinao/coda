import {
  accountValueNode,
  constant,
  definePdas,
  enumValueNode,
  numberTypeNode,
  programHandle,
  publicKeyTypeNode,
  setAccountDiscriminatorFromFieldVisitor,
  setInstructionAccountDefaultValuesVisitor,
  stringTypeNode,
  SYSTEM_PROGRAM_VALUE_NODE,
  updateAccountsVisitor,
  variable,
} from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";

export const program = programHandle("splGovernance");

export const pdas = definePdas(program, {
  // Realm
  realm: {
    docs: ["Realm account identified by its name"],
    seeds: [constant("governance"), variable("name", stringTypeNode("utf8"))],
  },
  // Community Token Holding
  communityTokenHolding: {
    docs: ["Community token holding account of a realm"],
    seeds: [
      constant("governance"),
      variable("realm", publicKeyTypeNode()),
      variable("communityMint", publicKeyTypeNode()),
    ],
  },
  // Council Token Holding
  councilTokenHolding: {
    docs: ["Council token holding account of a realm"],
    seeds: [
      constant("governance"),
      variable("realm", publicKeyTypeNode()),
      variable("councilMint", publicKeyTypeNode()),
    ],
  },
  // Realm Config
  realmConfig: {
    docs: ["Configuration of a realm"],
    seeds: [constant("realm-config"), variable("realm", publicKeyTypeNode())],
  },
  // Token Owner Record
  tokenOwnerRecord: {
    docs: ["Token owner's record within a realm"],
    seeds: [
      constant("governance"),
      variable("realm", publicKeyTypeNode()),
      variable("governingTokenMint", publicKeyTypeNode()),
      variable("governingTokenOwner", publicKeyTypeNode()),
    ],
  },
  // Governing Token Holding
  governingTokenHolding: {
    docs: ["Governing token holding account"],
    seeds: [
      constant("governance"),
      variable("realm", publicKeyTypeNode()),
      variable("governingTokenMint", publicKeyTypeNode()),
    ],
  },
  // Governance
  governance: {
    docs: ["Governance account within a realm"],
    seeds: [
      constant("account-governance"),
      variable("realm", publicKeyTypeNode()),
      variable("seed", publicKeyTypeNode()),
    ],
  },
  // Native Treasury
  nativeTreasury: {
    docs: ["Governance's native SOL treasury account"],
    seeds: [
      constant("native-treasury"),
      variable("governance", publicKeyTypeNode()),
    ],
  },
  // Proposal
  proposal: {
    docs: ["Governance proposal"],
    seeds: [
      constant("governance"),
      variable("governance", publicKeyTypeNode()),
      variable("governingTokenMint", publicKeyTypeNode()),
      variable("proposalSeed", publicKeyTypeNode()),
    ],
  },
  // Proposal Deposit
  proposalDeposit: {
    docs: ["Proposal deposit made by a specific payer"],
    seeds: [
      constant("proposal-deposit"),
      variable("proposal", publicKeyTypeNode()),
      variable("depositPayer", publicKeyTypeNode()),
    ],
  },
  // Signatory Record
  signatoryRecord: {
    docs: ["Signatory's record on a proposal"],
    seeds: [
      constant("governance"),
      variable("proposal", publicKeyTypeNode()),
      variable("signatory", publicKeyTypeNode()),
    ],
  },
  // Proposal Transaction
  proposalTransaction: {
    docs: ["Transaction within a proposal option"],
    seeds: [
      constant("governance"),
      variable("proposal", publicKeyTypeNode()),
      variable("optionIndex", numberTypeNode("u8")),
      variable("index", numberTypeNode("u16")),
    ],
  },
  // Vote Record
  voteRecord: {
    docs: ["Vote record on a proposal"],
    seeds: [
      constant("governance"),
      variable("proposal", publicKeyTypeNode()),
      variable("tokenOwnerRecord", publicKeyTypeNode()),
    ],
  },
  // Required Signatory
  requiredSignatory: {
    docs: ["Required signatory on a governance"],
    seeds: [
      constant("required-signatory"),
      variable("governance", publicKeyTypeNode()),
      variable("signatory", publicKeyTypeNode()),
    ],
  },
});

// PDAs are based on the original SPL Governance SDK:
// https://raw.githubusercontent.com/Mythic-Project/governance-sdk/refs/heads/main/src/pda.ts

export default defineProgram({
  package: {
    description: "TypeScript client for the SPL Governance program",
    keywords: ["spl", "governance", "dao", "voting", "realm", "ian-macalinao"],
    version: "0.6.2",
    releaseNotes: [
      "Generated from the program megagraph in macalinao/coda. The generated code is unchanged; the README, reference docs and package metadata are regenerated.",
    ],
  },
  visitors: [
    updateAccountsVisitor({
      // Realm accounts
      realmV1: {
        pda: pdas.realm.link,
      },
      realmV2: {
        pda: pdas.realm.link,
      },
      realmConfigAccount: {
        pda: pdas.realmConfig.link,
      },

      // Governance accounts
      governanceV1: {
        pda: pdas.governance.link,
      },
      governanceV2: {
        pda: pdas.governance.link,
      },

      // Proposal accounts
      proposalV1: {
        pda: pdas.proposal.link,
      },
      proposalV2: {
        pda: pdas.proposal.link,
      },
      proposalDeposit: {
        pda: pdas.proposalDeposit.link,
      },
      proposalInstructionV1: {
        pda: pdas.proposalTransaction.link,
      },
      proposalTransactionV2: {
        pda: pdas.proposalTransaction.link,
      },

      // Token owner records
      tokenOwnerRecordV1: {
        pda: pdas.tokenOwnerRecord.link,
      },
      tokenOwnerRecordV2: {
        pda: pdas.tokenOwnerRecord.link,
      },
      legacyTokenOwnerRecord: {
        pda: pdas.tokenOwnerRecord.link,
      },

      // Signatory records
      signatoryRecordV1: {
        pda: pdas.signatoryRecord.link,
      },
      signatoryRecordV2: {
        pda: pdas.signatoryRecord.link,
      },
      requiredSignatory: {
        pda: pdas.requiredSignatory.link,
      },

      // Vote records
      voteRecordV1: {
        pda: pdas.voteRecord.link,
      },
      voteRecordV2: {
        pda: pdas.voteRecord.link,
      },
    }),

    setInstructionAccountDefaultValuesVisitor([
      {
        account: "systemProgram",
        defaultValue: SYSTEM_PROGRAM_VALUE_NODE,
      },
      // Create token owner record defaults
      {
        account: "tokenOwnerRecord",
        instruction: "createTokenOwnerRecord",
        defaultValue: pdas.tokenOwnerRecord.value({
          realm: accountValueNode("realmAccount"),
          governingTokenMint: accountValueNode("governingTokenMint"),
          governingTokenOwner: accountValueNode("governingTokenOwnerAccount"),
        }),
      },
    ]),
    setAccountDiscriminatorFromFieldVisitor({
      // Realm accounts
      realmV1: {
        field: "accountType",
        value: enumValueNode(
          program.definedType("governanceAccountType"),
          "RealmV1",
        ),
      },
      realmV2: {
        field: "accountType",
        value: enumValueNode(
          program.definedType("governanceAccountType"),
          "RealmV2",
        ),
      },
      realmConfigAccount: {
        field: "accountType",
        value: enumValueNode(
          program.definedType("governanceAccountType"),
          "RealmConfig",
        ),
      },

      // Governance accounts
      governanceV1: {
        field: "accountType",
        value: enumValueNode(
          program.definedType("governanceAccountType"),
          "GovernanceV1",
        ),
      },
      governanceV2: {
        field: "accountType",
        value: enumValueNode(
          program.definedType("governanceAccountType"),
          "GovernanceV2",
        ),
      },

      // Token Owner Record accounts
      tokenOwnerRecordV1: {
        field: "accountType",
        value: enumValueNode(
          program.definedType("governanceAccountType"),
          "TokenOwnerRecordV1",
        ),
      },
      tokenOwnerRecordV2: {
        field: "accountType",
        value: enumValueNode(
          program.definedType("governanceAccountType"),
          "TokenOwnerRecordV2",
        ),
      },
      legacyTokenOwnerRecord: {
        field: "accountType",
        value: enumValueNode(
          program.definedType("governanceAccountType"),
          "TokenOwnerRecordV1",
        ),
      },

      // Proposal accounts
      proposalV1: {
        field: "accountType",
        value: enumValueNode(
          program.definedType("governanceAccountType"),
          "ProposalV1",
        ),
      },
      proposalV2: {
        field: "accountType",
        value: enumValueNode(
          program.definedType("governanceAccountType"),
          "ProposalV2",
        ),
      },
      proposalDeposit: {
        field: "accountType",
        value: enumValueNode(
          program.definedType("governanceAccountType"),
          "ProposalDeposit",
        ),
      },
      proposalInstructionV1: {
        field: "accountType",
        value: enumValueNode(
          program.definedType("governanceAccountType"),
          "ProposalInstructionV1",
        ),
      },
      proposalTransactionV2: {
        field: "accountType",
        value: enumValueNode(
          program.definedType("governanceAccountType"),
          "ProposalTransactionV2",
        ),
      },

      // Signatory Record accounts
      signatoryRecordV1: {
        field: "accountType",
        value: enumValueNode(
          program.definedType("governanceAccountType"),
          "SignatoryRecordV1",
        ),
      },
      signatoryRecordV2: {
        field: "accountType",
        value: enumValueNode(
          program.definedType("governanceAccountType"),
          "SignatoryRecordV2",
        ),
      },
      requiredSignatory: {
        field: "accountType",
        value: enumValueNode(
          program.definedType("governanceAccountType"),
          "RequiredSignatory",
        ),
      },

      // Vote Record accounts
      voteRecordV1: {
        field: "accountType",
        value: enumValueNode(
          program.definedType("governanceAccountType"),
          "VoteRecordV1",
        ),
      },
      voteRecordV2: {
        field: "accountType",
        value: enumValueNode(
          program.definedType("governanceAccountType"),
          "VoteRecordV2",
        ),
      },

      // Program Metadata
      programMetadata: {
        field: "accountType",
        value: enumValueNode(
          program.definedType("governanceAccountType"),
          "ProgramMetadata",
        ),
      },
    }),
    pdas.visitor,
  ],
});
