import {
  constant,
  definePdas,
  programHandle,
  publicKeyTypeNode,
  variable,
} from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";

export const program = programHandle("tokenSigner");

export const pdas = definePdas(program, {
  nftSigner: {
    docs: ["Signer PDA owned by the holder of a given NFT mint"],
    seeds: [constant("GokiTokenSigner"), variable("mint", publicKeyTypeNode())],
  },
});

export default defineProgram({
  package: {
    description:
      "TypeScript client for the Goki Token Signer program, which lets an NFT holder sign for a PDA derived from the NFT's mint",
    keywords: ["goki", "token-signer", "nft"],
    version: "0.1.0",
    releaseNotes: [
      "Split out of `@solana-programs/goki`, which now re-exports this package.",
    ],
  },
  // The on-chain program. Addresses were checked with getAccountInfo on
  // mainnet-beta and devnet (2026-10).
  program: {
    displayName: "Goki Token Signer",
    description:
      "Lets the holder of an NFT sign instructions on behalf of a PDA derived from the NFT's mint.",
    repository: "https://github.com/GokiProtocol/goki",
    addresses: {
      // Not deployed on mainnet-beta at the IDL's address.
      mainnet: null,
      devnet: "NFTUJzSHuUCsMMqMRJpB7PmbsaU7Wm51acdPk2FXMLn",
    },
    docs: "https://docs.rs/token-signer",
  },

  // The Goki IDLs are legacy Anchor 0.x IDLs: they declare their PDA seeds
  // inline on instruction accounts, which the Anchor-to-Codama parser drops.
  // Redeclare them here so the client ships PDA helpers.
  visitors: [pdas.visitor],
});
