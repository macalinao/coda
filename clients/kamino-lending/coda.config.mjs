import {
  addPdasVisitor,
  constantPdaSeedNodeFromString,
  defineConfig,
  numberTypeNode,
  publicKeyTypeNode,
  renameVisitor,
  stringTypeNode,
  variablePdaSeedNode,
} from "@macalinao/coda";

/** @type {import("@macalinao/coda").CodaConfig} */
export default defineConfig({
  // Use glob pattern to match both IDL files
  outputDir: "./src/generated",
  docs: {
    npmPackageName: "@macalinao/clients-kamino-lending",
  },
  // We can add custom visitors here later if needed
  visitors: [
    addPdasVisitor({
      farms: [
        {
          name: "obligationFarmState",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "user"),
            variablePdaSeedNode("farm", publicKeyTypeNode()),
            variablePdaSeedNode("obligation", publicKeyTypeNode()),
          ],
        },
      ],
      kaminoLending: [
        {
          name: "obligation",
          seeds: [
            variablePdaSeedNode("tag", numberTypeNode("u8", "le")),
            variablePdaSeedNode("id", numberTypeNode("u8", "le")),
            variablePdaSeedNode("user", publicKeyTypeNode()),
            variablePdaSeedNode("market", publicKeyTypeNode()),
            variablePdaSeedNode("seed1Account", publicKeyTypeNode()),
            variablePdaSeedNode("seed2Account", publicKeyTypeNode()),
          ],
        },
        {
          name: "lendingMarketAuth",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "lma"),
            variablePdaSeedNode("lendingMarket", publicKeyTypeNode()),
          ],
        },
        {
          name: "reserveLiquiditySupply",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "reserve_liq_supply"),
            variablePdaSeedNode("lendingMarket", publicKeyTypeNode()),
            variablePdaSeedNode("mint", publicKeyTypeNode()),
          ],
        },
        {
          name: "reserveFeeVault",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "fee_receiver"),
            variablePdaSeedNode("lendingMarket", publicKeyTypeNode()),
            variablePdaSeedNode("mint", publicKeyTypeNode()),
          ],
        },
        {
          name: "reserveCollateralMint",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "reserve_coll_mint"),
            variablePdaSeedNode("lendingMarket", publicKeyTypeNode()),
            variablePdaSeedNode("mint", publicKeyTypeNode()),
          ],
        },
        {
          name: "reserveCollateralSupply",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "reserve_coll_supply"),
            variablePdaSeedNode("lendingMarket", publicKeyTypeNode()),
            variablePdaSeedNode("mint", publicKeyTypeNode()),
          ],
        },
        {
          name: "userMetadata",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "user_meta"),
            variablePdaSeedNode("user", publicKeyTypeNode()),
          ],
        },
        {
          name: "referrerTokenState",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "referrer_acc"),
            variablePdaSeedNode("referrer", publicKeyTypeNode()),
            variablePdaSeedNode("reserve", publicKeyTypeNode()),
          ],
        },
        {
          name: "referrerState",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "ref_state"),
            variablePdaSeedNode("referrer", publicKeyTypeNode()),
          ],
        },
        {
          name: "shortUrl",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "short_url"),
            variablePdaSeedNode("shortUrl", stringTypeNode("utf8")),
          ],
        },
      ],
    }),
    renameVisitor({
      farms: {
        definedTypes: {
          tokenInfo: "farmsTokenInfo",
        },
      },
    }),
  ],
});
