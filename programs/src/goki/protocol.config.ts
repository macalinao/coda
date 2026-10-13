import { defineProtocol } from "@macalinao/megagraph";

export default defineProtocol({
  name: "goki",
  displayName: "Goki",
  description:
    "Goki is a multisig and smart wallet protocol: an owner-threshold smart wallet, and a token signer that lets an NFT holder sign on behalf of a PDA of the NFT's mint.",
  repository: "https://github.com/GokiProtocol/goki",
});
