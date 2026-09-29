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
    name: "@solana-programs/quarry-mint-wrapper",
    description:
      "TypeScript client for the Quarry Mint Wrapper program, which mints Quarry rewards through rate-limited minters",
    keywords: ["quarry", "mining", "mint-wrapper", "ian-macalinao"],
    initialVersion: "0.8.1",
  },

  visitors: [
    updateAccountsVisitor({
      mintWrapper: {
        pda: pdaLinkNode("mintWrapper"),
      },
      minter: {
        pda: pdaLinkNode("minter"),
      },
    }),
    addPdasVisitor({
      quarryMintWrapper: [
        {
          name: "mintWrapper",
          docs: ["Mint wrapper that controls minting of wrapped tokens"],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "MintWrapper"),
            variablePdaSeedNode("base", publicKeyTypeNode()),
          ],
        },
        {
          name: "minter",
          docs: ["Minter authority for a specific mint wrapper"],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "MintWrapperMinter"),
            variablePdaSeedNode("wrapper", publicKeyTypeNode()),
            variablePdaSeedNode("authority", publicKeyTypeNode()),
          ],
        },
      ],
    }),
    setInstructionAccountDefaultValuesVisitor([
      ...["newWrapper", "newWrapperV2"].flatMap((instruction) => [
        {
          account: "mintWrapper",
          instruction,
          defaultValue: pdaValueNode(pdaLinkNode("mintWrapper"), [
            pdaSeedValueNode("base", accountValueNode("base")),
          ]),
        },
        {
          account: "admin",
          instruction,
          defaultValue: accountValueNode("payer"),
        },
      ]),

      ...["newMinter", "newMinterV2"].flatMap((instruction) => [
        {
          account: "minter",
          instruction,
          defaultValue: pdaValueNode(pdaLinkNode("minter"), [
            pdaSeedValueNode("wrapper", accountValueNode("mintWrapper")),
            pdaSeedValueNode(
              "authority",
              accountValueNode("newMinterAuthority"),
            ),
          ]),
        },
        {
          account: "newMinterAuthority",
          instruction,
          defaultValue: accountValueNode("payer"),
        },
      ]),
    ]),
  ],
});
