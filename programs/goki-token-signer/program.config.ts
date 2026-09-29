import {
  addPdasVisitor,
  constantPdaSeedNodeFromString,
  publicKeyTypeNode,
  variablePdaSeedNode,
} from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";

export default defineProgram({
  package: {
    name: "@solana-programs/goki-token-signer",
    description:
      "TypeScript client for the Goki Token Signer program, which lets an NFT holder sign for a PDA derived from the NFT's mint",
    keywords: ["goki", "token-signer", "nft"],
    initialVersion: "0.4.1",
  },

  // The Goki IDLs are legacy Anchor 0.x IDLs: they declare their PDA seeds
  // inline on instruction accounts, which the Anchor-to-Codama parser drops.
  // Redeclare them here so the client ships PDA helpers.
  visitors: [
    addPdasVisitor({
      tokenSigner: [
        {
          name: "nftSigner",
          docs: ["Signer PDA owned by the holder of a given NFT mint"],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "GokiTokenSigner"),
            variablePdaSeedNode("mint", publicKeyTypeNode()),
          ],
        },
      ],
    }),
  ],
});
