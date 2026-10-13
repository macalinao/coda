import { defineMegagraph } from "@macalinao/megagraph";
import gokiRelease from "./goki/release.config.ts";
import kaminoRelease from "./kamino/release.config.ts";
import metaplexRelease from "./metaplex/release.config.ts";
import meteoraRelease from "./meteora/release.config.ts";
import orcaRelease from "./orca/release.config.ts";
import quarryRelease from "./quarry/release.config.ts";
import splRelease from "./spl/release.config.ts";
import tribecaRelease from "./tribeca/release.config.ts";
import gokiSmartWalletRelease from "./goki/smart-wallet/release.config.ts";
import gokiTokenSignerRelease from "./goki/token-signer/release.config.ts";
import kaminoFarmsRelease from "./kamino/farms/release.config.ts";
import kaminoLendingRelease from "./kamino/lending/release.config.ts";
import metaplexBubblegumRelease from "./metaplex/bubblegum/release.config.ts";
import metaplexCoreRelease from "./metaplex/core/release.config.ts";
import metaplexTokenAuthRulesRelease from "./metaplex/token-auth-rules/release.config.ts";
import metaplexTokenMetadataRelease from "./metaplex/token-metadata/release.config.ts";
import meteoraDammV2Release from "./meteora/damm-v2/release.config.ts";
import orcaWhirlpoolsRelease from "./orca/whirlpools/release.config.ts";
import quarryMergeMineRelease from "./quarry/merge-mine/release.config.ts";
import quarryMineRelease from "./quarry/mine/release.config.ts";
import quarryMintWrapperRelease from "./quarry/mint-wrapper/release.config.ts";
import quarryOperatorRelease from "./quarry/operator/release.config.ts";
import quarryRedeemerRelease from "./quarry/redeemer/release.config.ts";
import quarryRegistryRelease from "./quarry/registry/release.config.ts";
import splGovernanceRelease from "./spl/governance/release.config.ts";
import splStakePoolRelease from "./spl/stake-pool/release.config.ts";
import splVoterStakeRegistryRelease from "./spl/voter-stake-registry/release.config.ts";
import tribecaGovernRelease from "./tribeca/govern/release.config.ts";
import tribecaLockedVoterRelease from "./tribeca/locked-voter/release.config.ts";
import solanaToken from "./solana/token/program.config.ts";

/**
 * The `@solana/kit` (and `@solana/program-client-core`) versions every
 * generated client supports. Each external program declares its own npm range
 * in its definition; `bun run megagraph peers` checks that those stay aligned
 * with this one.
 */
const KIT_RANGE = "^6.10.0 || ^7.0.0 || ^8.0.0";

/**
 * The megagraph: every program a client is generated for (with its release
 * metadata), the external programs they link to, and how each protocol's
 * packages are released. Programs are only part of the graph if listed here.
 */
export default defineMegagraph({
  programs: [
    gokiSmartWalletRelease,
    gokiTokenSignerRelease,
    kaminoFarmsRelease,
    kaminoLendingRelease,
    metaplexBubblegumRelease,
    metaplexCoreRelease,
    metaplexTokenAuthRulesRelease,
    metaplexTokenMetadataRelease,
    meteoraDammV2Release,
    orcaWhirlpoolsRelease,
    quarryMergeMineRelease,
    quarryMineRelease,
    quarryMintWrapperRelease,
    quarryOperatorRelease,
    quarryRedeemerRelease,
    quarryRegistryRelease,
    splGovernanceRelease,
    splStakePoolRelease,
    splVoterStakeRegistryRelease,
    tribecaGovernRelease,
    tribecaLockedVoterRelease,
  ],
  externals: [solanaToken],
  protocols: [
    gokiRelease,
    kaminoRelease,
    metaplexRelease,
    meteoraRelease,
    orcaRelease,
    quarryRelease,
    splRelease,
    tribecaRelease,
  ],
  peerDependencies: {
    "@solana/kit": KIT_RANGE,
    "@solana/program-client-core": KIT_RANGE,
  },
  workspace: {
    name: "solana-programs",
    repository: "toolboxdao/solana-programs",
    defaultBranch: "main",
    catalog: [
      "@macalinao/tsconfig",
      "@solana-program/token",
      "@solana/kit",
      "@solana/program-client-core",
      "tsdown",
      "typescript",
    ],
    devDependencies: ["@types/node", "oxfmt", "tsdown", "typescript"],
    copyFiles: ["LICENSE", "bunfig.toml", ".oxfmtrc.json", "tsdown.config.ts"],
  },
  sourceRepository: "macalinao/coda",
});
