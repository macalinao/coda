import {
  accountNode,
  accountValueNode,
  addNodesVisitor,
  addPdasVisitor,
  bytesTypeNode,
  bytesValueNode,
  constantPdaSeedNodeFromString,
  defineConfig,
  fieldDiscriminatorNode,
  fixedSizeTypeNode,
  numberTypeNode,
  optionTypeNode,
  pdaLinkNode,
  pdaSeedValueNode,
  pdaValueNode,
  publicKeyTypeNode,
  publicKeyValueNode,
  setInstructionAccountDefaultValuesVisitor,
  structFieldTypeNode,
  structTypeNode,
  updateAccountsVisitor,
  variablePdaSeedNode,
} from "@macalinao/coda";

const addCustomPDAsVisitor = addPdasVisitor({
  voterStakeRegistry: [
    {
      name: "registrar",
      docs: [
        "The voting registrar. There can only be a single registrar",
        "per governance realm and governing mint.",
      ],
      seeds: [
        variablePdaSeedNode("realm", publicKeyTypeNode()),
        constantPdaSeedNodeFromString("utf8", "registrar"),
        variablePdaSeedNode("realmGoverningTokenMint", publicKeyTypeNode()),
      ],
    },
    {
      name: "voter",
      docs: [
        "The voter account for a given voter authority.",
        "Each voter authority has a unique voter account per registrar.",
      ],
      seeds: [
        variablePdaSeedNode("registrar", publicKeyTypeNode()),
        constantPdaSeedNodeFromString("utf8", "voter"),
        variablePdaSeedNode("voterAuthority", publicKeyTypeNode()),
      ],
    },
    {
      name: "voterWeightRecord",
      docs: [
        "The voter weight record is the account that will be shown to spl-governance",
        "to prove how much vote weight the voter has. See update_voter_weight_record.",
      ],
      seeds: [
        variablePdaSeedNode("registrar", publicKeyTypeNode()),
        constantPdaSeedNodeFromString("utf8", "voter-weight-record"),
        variablePdaSeedNode("voterAuthority", publicKeyTypeNode()),
      ],
    },
  ],
});

export default defineConfig({
  outputDir: "./src/generated",
  docs: {
    npmPackageName: "@macalinao/clients-voter-stake-registry",
  },
  visitors: [
    addCustomPDAsVisitor,
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
            pda: pdaLinkNode("voterWeightRecord"),
          }),
        ],
      },
    }),
    updateAccountsVisitor({
      registrar: {
        pda: pdaLinkNode("registrar"),
      },
      voter: {
        pda: pdaLinkNode("voter"),
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
        defaultValue: pdaValueNode(pdaLinkNode("voter"), [
          pdaSeedValueNode("registrar", accountValueNode("registrar")),
          pdaSeedValueNode(
            "voterAuthority",
            accountValueNode("voterAuthority"),
          ),
        ]),
      },
      {
        account: "voterWeightRecord",
        instruction: "createVoter",
        defaultValue: pdaValueNode(pdaLinkNode("voterWeightRecord"), [
          pdaSeedValueNode("registrar", accountValueNode("registrar")),
          pdaSeedValueNode(
            "voterAuthority",
            accountValueNode("voterAuthority"),
          ),
        ]),
      },
    ]),
  ],
});
