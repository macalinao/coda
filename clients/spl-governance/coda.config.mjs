import {
  accountValueNode,
  addPdasVisitor,
  constantPdaSeedNodeFromString,
  defineConfig,
  numberTypeNode,
  pdaLinkNode,
  pdaSeedValueNode,
  pdaValueNode,
  publicKeyTypeNode,
  publicKeyValueNode,
  setInstructionAccountDefaultValuesVisitor,
  stringTypeNode,
  updateAccountsVisitor,
  variablePdaSeedNode,
} from "@macalinao/coda";

// PDAs are based on the original SPL Governance SDK:
// https://raw.githubusercontent.com/Mythic-Project/governance-sdk/refs/heads/main/src/pda.ts
const addCustomPDAsVisitor = addPdasVisitor({
  splGovernance: [
    // Realm
    {
      name: "realm",
      docs: ["Realm account identified by its name"],
      seeds: [
        constantPdaSeedNodeFromString("utf8", "governance"),
        variablePdaSeedNode("name", stringTypeNode("utf8")),
      ],
    },
    // Community Token Holding
    {
      name: "communityTokenHolding",
      docs: ["Community token holding account of a realm"],
      seeds: [
        constantPdaSeedNodeFromString("utf8", "governance"),
        variablePdaSeedNode("realm", publicKeyTypeNode()),
        variablePdaSeedNode("communityMint", publicKeyTypeNode()),
      ],
    },
    // Council Token Holding
    {
      name: "councilTokenHolding",
      docs: ["Council token holding account of a realm"],
      seeds: [
        constantPdaSeedNodeFromString("utf8", "governance"),
        variablePdaSeedNode("realm", publicKeyTypeNode()),
        variablePdaSeedNode("councilMint", publicKeyTypeNode()),
      ],
    },
    // Realm Config
    {
      name: "realmConfig",
      docs: ["Configuration of a realm"],
      seeds: [
        constantPdaSeedNodeFromString("utf8", "realm-config"),
        variablePdaSeedNode("realm", publicKeyTypeNode()),
      ],
    },
    // Token Owner Record
    {
      name: "tokenOwnerRecord",
      docs: ["Token owner's record within a realm"],
      seeds: [
        constantPdaSeedNodeFromString("utf8", "governance"),
        variablePdaSeedNode("realm", publicKeyTypeNode()),
        variablePdaSeedNode("governingTokenMint", publicKeyTypeNode()),
        variablePdaSeedNode("governingTokenOwner", publicKeyTypeNode()),
      ],
    },
    // Governing Token Holding
    {
      name: "governingTokenHolding",
      docs: ["Governing token holding account"],
      seeds: [
        constantPdaSeedNodeFromString("utf8", "governance"),
        variablePdaSeedNode("realm", publicKeyTypeNode()),
        variablePdaSeedNode("governingTokenMint", publicKeyTypeNode()),
      ],
    },
    // Governance
    {
      name: "governance",
      docs: ["Governance account within a realm"],
      seeds: [
        constantPdaSeedNodeFromString("utf8", "account-governance"),
        variablePdaSeedNode("realm", publicKeyTypeNode()),
        variablePdaSeedNode("seed", publicKeyTypeNode()),
      ],
    },
    // Native Treasury
    {
      name: "nativeTreasury",
      docs: ["Governance's native SOL treasury account"],
      seeds: [
        constantPdaSeedNodeFromString("utf8", "native-treasury"),
        variablePdaSeedNode("governance", publicKeyTypeNode()),
      ],
    },
    // Proposal
    {
      name: "proposal",
      docs: ["Governance proposal"],
      seeds: [
        constantPdaSeedNodeFromString("utf8", "governance"),
        variablePdaSeedNode("governance", publicKeyTypeNode()),
        variablePdaSeedNode("governingTokenMint", publicKeyTypeNode()),
        variablePdaSeedNode("proposalSeed", publicKeyTypeNode()),
      ],
    },
    // Proposal Deposit
    {
      name: "proposalDeposit",
      docs: ["Proposal deposit made by a specific payer"],
      seeds: [
        constantPdaSeedNodeFromString("utf8", "proposal-deposit"),
        variablePdaSeedNode("proposal", publicKeyTypeNode()),
        variablePdaSeedNode("depositPayer", publicKeyTypeNode()),
      ],
    },
    // Signatory Record
    {
      name: "signatoryRecord",
      docs: ["Signatory's record on a proposal"],
      seeds: [
        constantPdaSeedNodeFromString("utf8", "governance"),
        variablePdaSeedNode("proposal", publicKeyTypeNode()),
        variablePdaSeedNode("signatory", publicKeyTypeNode()),
      ],
    },
    // Proposal Transaction
    {
      name: "proposalTransaction",
      docs: ["Transaction within a proposal option"],
      seeds: [
        constantPdaSeedNodeFromString("utf8", "governance"),
        variablePdaSeedNode("proposal", publicKeyTypeNode()),
        variablePdaSeedNode("optionIndex", numberTypeNode("u8")),
        variablePdaSeedNode("index", numberTypeNode("u16")),
      ],
    },
    // Vote Record
    {
      name: "voteRecord",
      docs: ["Vote record on a proposal"],
      seeds: [
        constantPdaSeedNodeFromString("utf8", "governance"),
        variablePdaSeedNode("proposal", publicKeyTypeNode()),
        variablePdaSeedNode("tokenOwnerRecord", publicKeyTypeNode()),
      ],
    },
    // Required Signatory
    {
      name: "requiredSignatory",
      docs: ["Required signatory on a governance"],
      seeds: [
        constantPdaSeedNodeFromString("utf8", "required-signatory"),
        variablePdaSeedNode("governance", publicKeyTypeNode()),
        variablePdaSeedNode("signatory", publicKeyTypeNode()),
      ],
    },
  ],
});

export default defineConfig({
  outputDir: "./src/generated",
  docs: {
    npmPackageName: "@macalinao/clients-spl-governance",
  },
  visitors: [
    updateAccountsVisitor({
      // Realm accounts
      realmV1: {
        pda: pdaLinkNode("realm"),
      },
      realmV2: {
        pda: pdaLinkNode("realm"),
      },
      realmConfigAccount: {
        pda: pdaLinkNode("realmConfig"),
      },

      // Governance accounts
      governanceV1: {
        pda: pdaLinkNode("governance"),
      },
      governanceV2: {
        pda: pdaLinkNode("governance"),
      },

      // Proposal accounts
      proposalV1: {
        pda: pdaLinkNode("proposal"),
      },
      proposalV2: {
        pda: pdaLinkNode("proposal"),
      },
      proposalDeposit: {
        pda: pdaLinkNode("proposalDeposit"),
      },
      proposalInstructionV1: {
        pda: pdaLinkNode("proposalTransaction"),
      },
      proposalTransactionV2: {
        pda: pdaLinkNode("proposalTransaction"),
      },

      // Token owner records
      tokenOwnerRecordV1: {
        pda: pdaLinkNode("tokenOwnerRecord"),
      },
      tokenOwnerRecordV2: {
        pda: pdaLinkNode("tokenOwnerRecord"),
      },
      legacyTokenOwnerRecord: {
        pda: pdaLinkNode("tokenOwnerRecord"),
      },

      // Signatory records
      signatoryRecordV1: {
        pda: pdaLinkNode("signatoryRecord"),
      },
      signatoryRecordV2: {
        pda: pdaLinkNode("signatoryRecord"),
      },
      requiredSignatory: {
        pda: pdaLinkNode("requiredSignatory"),
      },

      // Vote records
      voteRecordV1: {
        pda: pdaLinkNode("voteRecord"),
      },
      voteRecordV2: {
        pda: pdaLinkNode("voteRecord"),
      },
    }),

    setInstructionAccountDefaultValuesVisitor([
      {
        account: "systemProgram",
        defaultValue: publicKeyValueNode("11111111111111111111111111111111"),
      },
      // Create token owner record defaults
      {
        account: "tokenOwnerRecord",
        instruction: "createTokenOwnerRecord",
        defaultValue: pdaValueNode(pdaLinkNode("tokenOwnerRecord"), [
          pdaSeedValueNode("realm", accountValueNode("realmAccount")),
          pdaSeedValueNode(
            "governingTokenMint",
            accountValueNode("governingTokenMint"),
          ),
          pdaSeedValueNode(
            "governingTokenOwner",
            accountValueNode("governingTokenOwnerAccount"),
          ),
        ]),
      },
    ]),
    addCustomPDAsVisitor,
  ],
});
