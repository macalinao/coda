import {
  definePdas,
  programHandle,
  publicKeyTypeNode,
  variable,
} from "@macalinao/coda";
import { defineExternalProgram } from "@macalinao/megagraph";
import { TOKEN_RANGE } from "../../peer-ranges.ts";

/** The SPL Token program. */
export const program = programHandle("token");

/** The Associated Token Account program, in the same IDL and package. */
export const associatedTokenProgram = programHandle("associatedToken");

export const associatedTokenPdas = definePdas(associatedTokenProgram, {
  associatedToken: {
    seeds: [
      variable(
        "owner",
        publicKeyTypeNode(),
        "The wallet address of the associated token account.",
      ),
      variable(
        "tokenProgram",
        publicKeyTypeNode(),
        "The address of the token program to use.",
      ),
      variable(
        "mint",
        publicKeyTypeNode(),
        "The mint address of the associated token account.",
      ),
    ],
  },
});

export default defineExternalProgram({
  external: {
    package: "@solana-program/token",
    peerRange: TOKEN_RANGE,
    // idl.json is the Codama IDL of the release we develop against
    // (the catalog pins @solana-program/token ^0.17.0).
    source: {
      repository: "https://github.com/solana-program/token",
      tag: "js@v0.17.0",
      commit: "8185db13640f0df038266c7cf4306c212d81380a",
      path: "idl.json",
    },
    handles: {
      programs: [program, associatedTokenProgram],
      pdas: [associatedTokenPdas.associatedToken],
    },
  },
});
