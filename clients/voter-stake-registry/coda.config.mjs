import {
  accountNode,
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
        account: "tokenProgram",
        defaultValue: publicKeyValueNode(
          "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        ),
      },
      {
        account: "associatedTokenProgram",
        defaultValue: publicKeyValueNode(
          "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
        ),
      },
      {
        account: "systemProgram",
        defaultValue: publicKeyValueNode("11111111111111111111111111111111"),
      },
      {
        account: "rent",
        defaultValue: publicKeyValueNode(
          "SysvarRent111111111111111111111111111111111",
        ),
      },
      {
        account: "instructions",
        defaultValue: publicKeyValueNode(
          "Sysvar1nstructions1111111111111111111111111",
        ),
      },
    ]),
    addCustomPDAsVisitor,
  ],
});
