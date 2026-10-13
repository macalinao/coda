import {
  definePdas,
  programHandle,
  publicKeyTypeNode,
  variable,
} from "@macalinao/coda";
import { defineExternalProgram } from "@macalinao/megagraph";

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
  npm: {
    package: "@solana-program/token",
    // One caret per 0.x minor (`^0.x` only matches that minor). Every version
    // accepts a supported @solana/kit: 0.11 and 0.12 need ^6.1.0, 0.13 and
    // 0.14 ^6.5.0, 0.15 ^7.0.0, 0.16 ^8.0.0 and 0.17 ^8.3.0. 0.11 through
    // 0.17 all export TOKEN_PROGRAM_ADDRESS, ASSOCIATED_TOKEN_PROGRAM_ADDRESS
    // and findAssociatedTokenPda (the only imports of the generated code)
    // with identical declarations, and their IDLs agree with idl.json on the
    // program addresses and the associatedToken PDA. The floor is 0.11, the
    // first release that, like the current ones, depends on
    // @solana-program/system; older versions are not tested.
    range:
      "^0.11.0 || ^0.12.0 || ^0.13.0 || ^0.14.0 || ^0.15.0 || ^0.16.0 || ^0.17.0",
  },
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
});
