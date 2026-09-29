import {
  accountValueNode,
  constant,
  definePdas,
  programHandle,
  publicKeyTypeNode,
  setInstructionAccountDefaultValuesVisitor,
  updateAccountsVisitor,
  variable,
} from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";

export const program = programHandle("quarryMintWrapper");

export const pdas = definePdas(program, {
  mintWrapper: {
    docs: ["Mint wrapper that controls minting of wrapped tokens"],
    seeds: [constant("MintWrapper"), variable("base", publicKeyTypeNode())],
  },
  minter: {
    docs: ["Minter authority for a specific mint wrapper"],
    seeds: [
      constant("MintWrapperMinter"),
      variable("wrapper", publicKeyTypeNode()),
      variable("authority", publicKeyTypeNode()),
    ],
  },
});

export default defineProgram({
  package: {
    description:
      "TypeScript client for the Quarry Mint Wrapper program, which mints Quarry rewards through rate-limited minters",
    keywords: ["quarry", "mining", "mint-wrapper", "ian-macalinao"],
    version: "0.1.0",
    releaseNotes: [
      "Split out of `@solana-programs/quarry`, which now re-exports this package.",
    ],
  },

  visitors: [
    updateAccountsVisitor({
      mintWrapper: {
        pda: pdas.mintWrapper.link,
      },
      minter: {
        pda: pdas.minter.link,
      },
    }),
    pdas.visitor,
    setInstructionAccountDefaultValuesVisitor([
      ...["newWrapper", "newWrapperV2"].flatMap((instruction) => [
        {
          account: "mintWrapper",
          instruction,
          defaultValue: pdas.mintWrapper.value({
            base: accountValueNode("base"),
          }),
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
          defaultValue: pdas.minter.value({
            wrapper: accountValueNode("mintWrapper"),
            authority: accountValueNode("newMinterAuthority"),
          }),
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
