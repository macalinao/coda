# Kamino Lending Program

[![npm version](https://badge.fury.io/js/%40solana-programs%2Fkamino-lending.svg)](https://www.npmjs.com/package/%40solana-programs%2Fkamino-lending)

- Program ID: `KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD`
- TypeScript Client: [`@solana-programs/kamino-lending`](https://www.npmjs.com/package/@solana-programs/kamino-lending)

## Table of Contents

- [Accounts](#accounts)
  - [userState](#userState)
  - [lendingGlobalConfig](#lendingGlobalConfig)
  - [lendingMarket](#lendingMarket)
  - [obligation](#obligation)
  - [referrerState](#referrerState)
  - [referrerTokenState](#referrerTokenState)
  - [shortUrl](#shortUrl)
  - [userMetadata](#userMetadata)
  - [reserve](#reserve)
- [Instructions](#instructions)
  - [initLendingMarket](#initLendingMarket)
  - [updateLendingMarket](#updateLendingMarket)
  - [updateLendingMarketOwner](#updateLendingMarketOwner)
  - [initReserve](#initReserve)
  - [initFarmsForReserve](#initFarmsForReserve)
  - [updateReserveConfig](#updateReserveConfig)
  - [redeemFees](#redeemFees)
  - [withdrawProtocolFee](#withdrawProtocolFee)
  - [socializeLoss](#socializeLoss)
  - [socializeLossV2](#socializeLossV2)
  - [markObligationForDeleveraging](#markObligationForDeleveraging)
  - [refreshReserve](#refreshReserve)
  - [refreshReservesBatch](#refreshReservesBatch)
  - [depositReserveLiquidity](#depositReserveLiquidity)
  - [redeemReserveCollateral](#redeemReserveCollateral)
  - [initObligation](#initObligation)
  - [initObligationFarmsForReserve](#initObligationFarmsForReserve)
  - [refreshObligationFarmsForReserve](#refreshObligationFarmsForReserve)
  - [refreshObligation](#refreshObligation)
  - [depositObligationCollateral](#depositObligationCollateral)
  - [depositObligationCollateralV2](#depositObligationCollateralV2)
  - [withdrawObligationCollateral](#withdrawObligationCollateral)
  - [withdrawObligationCollateralV2](#withdrawObligationCollateralV2)
  - [borrowObligationLiquidity](#borrowObligationLiquidity)
  - [borrowObligationLiquidityV2](#borrowObligationLiquidityV2)
  - [repayObligationLiquidity](#repayObligationLiquidity)
  - [repayObligationLiquidityV2](#repayObligationLiquidityV2)
  - [repayAndWithdrawAndRedeem](#repayAndWithdrawAndRedeem)
  - [depositAndWithdraw](#depositAndWithdraw)
  - [depositReserveLiquidityAndObligationCollateral](#depositReserveLiquidityAndObligationCollateral)
  - [depositReserveLiquidityAndObligationCollateralV2](#depositReserveLiquidityAndObligationCollateralV2)
  - [withdrawObligationCollateralAndRedeemReserveCollateral](#withdrawObligationCollateralAndRedeemReserveCollateral)
  - [withdrawObligationCollateralAndRedeemReserveCollateralV2](#withdrawObligationCollateralAndRedeemReserveCollateralV2)
  - [liquidateObligationAndRedeemReserveCollateral](#liquidateObligationAndRedeemReserveCollateral)
  - [liquidateObligationAndRedeemReserveCollateralV2](#liquidateObligationAndRedeemReserveCollateralV2)
  - [flashRepayReserveLiquidity](#flashRepayReserveLiquidity)
  - [flashBorrowReserveLiquidity](#flashBorrowReserveLiquidity)
  - [requestElevationGroup](#requestElevationGroup)
  - [initReferrerTokenState](#initReferrerTokenState)
  - [initUserMetadata](#initUserMetadata)
  - [withdrawReferrerFees](#withdrawReferrerFees)
  - [initReferrerStateAndShortUrl](#initReferrerStateAndShortUrl)
  - [deleteReferrerStateAndShortUrl](#deleteReferrerStateAndShortUrl)
  - [setObligationOrder](#setObligationOrder)
  - [initGlobalConfig](#initGlobalConfig)
  - [updateGlobalConfig](#updateGlobalConfig)
  - [updateGlobalConfigAdmin](#updateGlobalConfigAdmin)
  - [idlMissingTypes](#idlMissingTypes)
- [PDAs](#pdas)
  - [lendingGlobalConfigState](#lendingGlobalConfigState)
  - [obligation](#obligation)
  - [lendingMarketAuth](#lendingMarketAuth)
  - [reserveLiquiditySupply](#reserveLiquiditySupply)
  - [reserveFeeVault](#reserveFeeVault)
  - [reserveCollateralMint](#reserveCollateralMint)
  - [reserveCollateralSupply](#reserveCollateralSupply)
  - [userMetadata](#userMetadata)
  - [referrerTokenState](#referrerTokenState)
  - [referrerState](#referrerState)
  - [shortUrl](#shortUrl)
- [Types](#types)
  - [updateConfigMode](#updateConfigMode)
  - [updateLendingMarketConfigValue](#updateLendingMarketConfigValue)
  - [updateLendingMarketMode](#updateLendingMarketMode)
  - [updateGlobalConfigMode](#updateGlobalConfigMode)
  - [lastUpdate](#lastUpdate)
  - [elevationGroup](#elevationGroup)
  - [initObligationArgs](#initObligationArgs)
  - [obligationCollateral](#obligationCollateral)
  - [obligationLiquidity](#obligationLiquidity)
  - [obligationOrderInput](#obligationOrderInput)
  - [obligationOrder](#obligationOrder)
  - [assetTier](#assetTier)
  - [bigFractionBytes](#bigFractionBytes)
  - [feeCalculation](#feeCalculation)
  - [reserveCollateral](#reserveCollateral)
  - [reserveConfig](#reserveConfig)
  - [reserveFarmKind](#reserveFarmKind)
  - [reserveFees](#reserveFees)
  - [reserveLiquidity](#reserveLiquidity)
  - [reserveStatus](#reserveStatus)
  - [withdrawalCaps](#withdrawalCaps)
  - [priceHeuristic](#priceHeuristic)
  - [pythConfiguration](#pythConfiguration)
  - [scopeConfiguration](#scopeConfiguration)
  - [switchboardConfiguration](#switchboardConfiguration)
  - [tokenInfo](#tokenInfo)
  - [borrowRateCurve](#borrowRateCurve)
  - [curvePoint](#curvePoint)
  - [elevationGroupPod](#elevationGroupPod)
- [Errors](#errors)

## Accounts

### userState

**Fields:**

| Field                            | Type        | Description                                                                                                                    |
| -------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `discriminator`                  | `unknown`   | -                                                                                                                              |
| `userId`                         | `u64`       | -                                                                                                                              |
| `farmState`                      | `PublicKey` | -                                                                                                                              |
| `owner`                          | `PublicKey` | -                                                                                                                              |
| `isFarmDelegated`                | `u8`        | Indicate if this user state is part of a delegated farm                                                                        |
| `padding0`                       | `u8`[7]     | -                                                                                                                              |
| `rewardsTallyScaled`             | `u128`[10]  | Rewards tally used for computation of gained rewards (scaled from `Decimal` representation).                                   |
| `rewardsIssuedUnclaimed`         | `u64`[10]   | Number of reward tokens ready for claim                                                                                        |
| `lastClaimTs`                    | `u64`[10]   | -                                                                                                                              |
| `activeStakeScaled`              | `u128`      | User stake deposited and usable, generating rewards and fees. (scaled from `Decimal` representation).                          |
| `pendingDepositStakeScaled`      | `u128`      | User stake deposited but not usable and not generating rewards yet. (scaled from `Decimal` representation).                    |
| `pendingDepositStakeTs`          | `u64`       | After this timestamp, pending user stake can be moved to user stake Initialized to now() + delayed user stake period           |
| `pendingWithdrawalUnstakeScaled` | `u128`      | User deposits unstaked, pending for withdrawal, not usable and not generating rewards. (scaled from `Decimal` representation). |
| `pendingWithdrawalUnstakeTs`     | `u64`       | After this timestamp, user can withdraw their deposit.                                                                         |
| `bump`                           | `u64`       | User bump used for account address validation                                                                                  |
| `delegatee`                      | `PublicKey` | Delegatee used for initialisation - useful to check against                                                                    |
| `lastStakeTs`                    | `u64`       | -                                                                                                                              |
| `padding1`                       | `u64`[50]   | -                                                                                                                              |

### lendingGlobalConfig

**Fields:**

| Field           | Type        | Description                                                                       |
| --------------- | ----------- | --------------------------------------------------------------------------------- |
| `discriminator` | `unknown`   | -                                                                                 |
| `globalAdmin`   | `PublicKey` | Global admin of the program                                                       |
| `pendingAdmin`  | `PublicKey` | Pending admin must sign a specific transaction to become the global admin         |
| `feeCollector`  | `PublicKey` | Fee collector is the only allowed owner of token accounts receiving protocol fees |
| `padding`       | `u8`[928]   | Padding to make the struct size 1024 bytes                                        |

### lendingMarket

**Fields:**

| Field                                          | Type                                          | Description                                                                                                                                                                                                                                                                              |
| ---------------------------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator`                                | `unknown`                                     | -                                                                                                                                                                                                                                                                                        |
| `version`                                      | `u64`                                         | Version of lending market                                                                                                                                                                                                                                                                |
| `bumpSeed`                                     | `u64`                                         | Bump seed for derived authority address                                                                                                                                                                                                                                                  |
| `lendingMarketOwner`                           | `PublicKey`                                   | Owner authority which can add new reserves                                                                                                                                                                                                                                               |
| `lendingMarketOwnerCached`                     | `PublicKey`                                   | Temporary cache of the lending market owner, used in update_lending_market_owner                                                                                                                                                                                                         |
| `quoteCurrency`                                | `u8`[32]                                      | Currency market prices are quoted in e.g. "USD" null padded (`*b"USD\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0"`) or a SPL token mint pubkey                                                                                                                             |
| `referralFeeBps`                               | `u16`                                         | Referral fee for the lending market, as bps out of the total protocol fee                                                                                                                                                                                                                |
| `emergencyMode`                                | `u8`                                          | -                                                                                                                                                                                                                                                                                        |
| `autodeleverageEnabled`                        | `u8`                                          | Whether the obligations on this market should be subject to auto-deleveraging after deposit or borrow limit is crossed. Besides this flag, the particular reserve's flag also needs to be enabled (logical `AND`). **NOTE:** this also affects the individual "target LTV" deleveraging. |
| `borrowDisabled`                               | `u8`                                          | -                                                                                                                                                                                                                                                                                        |
| `priceRefreshTriggerToMaxAgePct`               | `u8`                                          | Refresh price from oracle only if it's older than this percentage of the price max age. e.g. if the max age is set to 100s and this is set to 80%, the price will be refreshed if it's older than 80s. Price is always refreshed if this set to 0.                                       |
| `liquidationMaxDebtCloseFactorPct`             | `u8`                                          | Percentage of the total borrowed value in an obligation available for liquidation                                                                                                                                                                                                        |
| `insolvencyRiskUnhealthyLtvPct`                | `u8`                                          | Minimum acceptable unhealthy LTV before max_debt_close_factor_pct becomes 100%                                                                                                                                                                                                           |
| `minFullLiquidationValueThreshold`             | `u64`                                         | Minimum liquidation value threshold triggering full liquidation for an obligation                                                                                                                                                                                                        |
| `maxLiquidatableDebtMarketValueAtOnce`         | `u64`                                         | Max allowed liquidation value in one ix call                                                                                                                                                                                                                                             |
| `reserved0`                                    | `u8`[8]                                       | [DEPRECATED] Global maximum unhealthy borrow value allowed for any obligation                                                                                                                                                                                                            |
| `globalAllowedBorrowValue`                     | `u64`                                         | Global maximum allowed borrow value allowed for any obligation                                                                                                                                                                                                                           |
| `riskCouncil`                                  | `PublicKey`                                   | The address of the risk council, in charge of making parameter and risk decisions on behalf of the protocol                                                                                                                                                                              |
| `reserved1`                                    | `u8`[8]                                       | [DEPRECATED] Reward points multiplier per obligation type                                                                                                                                                                                                                                |
| `elevationGroups`                              | [elevationGroupPod](#elevationGroupPod-3)[32] | Elevation groups are used to group together reserves that have the same risk parameters and can bump the ltv and liquidation threshold                                                                                                                                                   |
| `elevationGroupPadding`                        | `u64`[90]                                     | -                                                                                                                                                                                                                                                                                        |
| `minNetValueInObligationSf`                    | `u128`                                        | Min net value accepted to be found in a position after any lending action in an obligation (scaled by quote currency decimals)                                                                                                                                                           |
| `minValueSkipLiquidationLtvChecks`             | `u64`                                         | Minimum value to enforce smallest ltv priority checks on the collateral reserves on liquidation                                                                                                                                                                                          |
| `name`                                         | `u8`[32]                                      | Market name, zero-padded.                                                                                                                                                                                                                                                                |
| `minValueSkipLiquidationBfChecks`              | `u64`                                         | Minimum value to enforce highest borrow factor priority checks on the debt reserves on liquidation                                                                                                                                                                                       |
| `individualAutodeleverageMarginCallPeriodSecs` | `u64`                                         | Time (in seconds) that must pass before liquidation is allowed on an obligation that has been individually marked for auto-deleveraging (by the risk council).                                                                                                                           |
| `minInitialDepositAmount`                      | `u64`                                         | Minimum amount of deposit at creation of a reserve to prevent artificial inflation Note: this amount cannot be recovered, the ctoken associated are never minted                                                                                                                         |
| `obligationOrderExecutionEnabled`              | `u8`                                          | Whether the obligation orders should be evaluated during liquidations.                                                                                                                                                                                                                   |
| `immutable`                                    | `u8`                                          | Whether the lending market is set as immutable.                                                                                                                                                                                                                                          |
| `obligationOrderCreationEnabled`               | `u8`                                          | Whether new obligation orders can be created. Note: updating or cancelling existing orders is _not_ affected by this flag.                                                                                                                                                               |
| `padding2`                                     | `u8`[5]                                       | -                                                                                                                                                                                                                                                                                        |
| `padding1`                                     | `u64`[169]                                    | -                                                                                                                                                                                                                                                                                        |

### obligation

**Fields:**

| Field                                      | Type                                               | Description                                                                                                                                               |
| ------------------------------------------ | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator`                            | `unknown`                                          | -                                                                                                                                                         |
| `tag`                                      | `u64`                                              | Version of the struct                                                                                                                                     |
| `lastUpdate`                               | [lastUpdate](#lastUpdate-3)                        | Last update to collateral, liquidity, or their market values                                                                                              |
| `lendingMarket`                            | `PublicKey`                                        | Lending market address                                                                                                                                    |
| `owner`                                    | `PublicKey`                                        | Owner authority which can borrow liquidity                                                                                                                |
| `deposits`                                 | [obligationCollateral](#obligationCollateral-3)[8] | Deposited collateral for the obligation, unique by deposit reserve address                                                                                |
| `lowestReserveDepositLiquidationLtv`       | `u64`                                              | Worst LTV for the collaterals backing the loan, represented as a percentage                                                                               |
| `depositedValueSf`                         | `u128`                                             | Market value of deposits (scaled fraction)                                                                                                                |
| `borrows`                                  | [obligationLiquidity](#obligationLiquidity-3)[5]   | Borrowed liquidity for the obligation, unique by borrow reserve address                                                                                   |
| `borrowFactorAdjustedDebtValueSf`          | `u128`                                             | Risk adjusted market value of borrows/debt (sum of price * borrowed_amount * borrow_factor) (scaled fraction)                                             |
| `borrowedAssetsMarketValueSf`              | `u128`                                             | Market value of borrows - used for max_liquidatable_borrowed_amount (scaled fraction)                                                                     |
| `allowedBorrowValueSf`                     | `u128`                                             | The maximum borrow value at the weighted average loan to value ratio (scaled fraction)                                                                    |
| `unhealthyBorrowValueSf`                   | `u128`                                             | The dangerous borrow value at the weighted average liquidation threshold (scaled fraction)                                                                |
| `depositsAssetTiers`                       | `u8`[8]                                            | The asset tier of the deposits                                                                                                                            |
| `borrowsAssetTiers`                        | `u8`[5]                                            | The asset tier of the borrows                                                                                                                             |
| `elevationGroup`                           | `u8`                                               | The elevation group id the obligation opted into.                                                                                                         |
| `numOfObsoleteDepositReserves`             | `u8`                                               | The number of obsolete reserves the obligation has a deposit in                                                                                           |
| `hasDebt`                                  | `u8`                                               | Marked = 1 if borrows array is not empty, 0 = borrows empty                                                                                               |
| `referrer`                                 | `PublicKey`                                        | Wallet address of the referrer                                                                                                                            |
| `borrowingDisabled`                        | `u8`                                               | Marked = 1 if borrowing disabled, 0 = borrowing enabled                                                                                                   |
| `autodeleverageTargetLtvPct`               | `u8`                                               | A target LTV set by the risk council when marking this obligation for deleveraging. Only effective when `deleveraging_margin_call_started_slot != 0`.     |
| `lowestReserveDepositMaxLtvPct`            | `u8`                                               | The lowest max LTV found amongst the collateral deposits                                                                                                  |
| `numOfObsoleteBorrowReserves`              | `u8`                                               | The number of obsolete reserves the obligation has a borrow in                                                                                            |
| `reserved`                                 | `u8`[4]                                            | -                                                                                                                                                         |
| `highestBorrowFactorPct`                   | `u64`                                              | -                                                                                                                                                         |
| `autodeleverageMarginCallStartedTimestamp` | `u64`                                              | A timestamp at which the risk council most-recently marked this obligation for deleveraging. Zero if not currently subject to deleveraging.               |
| `orders`                                   | [obligationOrder](#obligationOrder-3)[2]           | Owner-defined, liquidator-executed orders applicable to this obligation. Typical use-cases would be a stop-loss and a take-profit (possibly co-existing). |
| `padding3`                                 | `u64`[93]                                          | -                                                                                                                                                         |

### referrerState

**Fields:**

| Field           | Type        | Description |
| --------------- | ----------- | ----------- |
| `discriminator` | `unknown`   | -           |
| `shortUrl`      | `PublicKey` | -           |
| `owner`         | `PublicKey` | -           |

### referrerTokenState

**Fields:**

| Field                | Type        | Description                                                                                       |
| -------------------- | ----------- | ------------------------------------------------------------------------------------------------- |
| `discriminator`      | `unknown`   | -                                                                                                 |
| `referrer`           | `PublicKey` | Pubkey of the referrer/owner                                                                      |
| `mint`               | `PublicKey` | Token mint for the account                                                                        |
| `amountUnclaimedSf`  | `u128`      | Amount that has been accumulated and not claimed yet -> available to claim (scaled fraction)      |
| `amountCumulativeSf` | `u128`      | Amount that has been accumulated in total -> both already claimed and unclaimed (scaled fraction) |
| `bump`               | `u64`       | Referrer token state bump, used for address validation                                            |
| `padding`            | `u64`[31]   | -                                                                                                 |

### shortUrl

**Fields:**

| Field           | Type        | Description |
| --------------- | ----------- | ----------- |
| `discriminator` | `unknown`   | -           |
| `referrer`      | `PublicKey` | -           |
| `shortUrl`      | `unknown`   | -           |

### userMetadata

**Fields:**

| Field             | Type        | Description                                                                                                                                                                     |
| ----------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator`   | `unknown`   | -                                                                                                                                                                               |
| `referrer`        | `PublicKey` | Pubkey of the referrer/owner - pubkey::default if no referrer                                                                                                                   |
| `bump`            | `u64`       | Bump used for validation of account address                                                                                                                                     |
| `userLookupTable` | `PublicKey` | User lookup table - used to store all user accounts - atas for each reserve mint, each obligation PDA, UserMetadata itself and all referrer_token_states if there is a referrer |
| `owner`           | `PublicKey` | User metadata account owner                                                                                                                                                     |
| `padding1`        | `u64`[51]   | -                                                                                                                                                                               |
| `padding2`        | `u64`[64]   | -                                                                                                                                                                               |

### reserve

**Fields:**

| Field                                                | Type                                      | Description                                                                                                                  |
| ---------------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `discriminator`                                      | `unknown`                                 | -                                                                                                                            |
| `version`                                            | `u64`                                     | Version of the reserve                                                                                                       |
| `lastUpdate`                                         | [lastUpdate](#lastUpdate-3)               | Last slot when supply and rates updated                                                                                      |
| `lendingMarket`                                      | `PublicKey`                               | Lending market address                                                                                                       |
| `farmCollateral`                                     | `PublicKey`                               | -                                                                                                                            |
| `farmDebt`                                           | `PublicKey`                               | -                                                                                                                            |
| `liquidity`                                          | [reserveLiquidity](#reserveLiquidity-3)   | Reserve liquidity                                                                                                            |
| `reserveLiquidityPadding`                            | `u64`[150]                                | -                                                                                                                            |
| `collateral`                                         | [reserveCollateral](#reserveCollateral-3) | Reserve collateral                                                                                                           |
| `reserveCollateralPadding`                           | `u64`[150]                                | -                                                                                                                            |
| `config`                                             | [reserveConfig](#reserveConfig-3)         | Reserve configuration values                                                                                                 |
| `configPadding`                                      | `u64`[116]                                | -                                                                                                                            |
| `borrowedAmountOutsideElevationGroup`                | `u64`                                     | -                                                                                                                            |
| `borrowedAmountsAgainstThisReserveInElevationGroups` | `u64`[32]                                 | Amount of token borrowed in lamport of debt asset in the given elevation group when this reserve is part of the collaterals. |
| `padding`                                            | `u64`[207]                                | -                                                                                                                            |

## Instructions

### initLendingMarket

**Accounts:**

| Account                  | Type             | Description |
| ------------------------ | ---------------- | ----------- |
| `lendingMarketOwner`     | signer, writable | -           |
| `lendingMarket`          | writable         | -           |
| `lendingMarketAuthority` | readonly         | -           |
| `systemProgram`          | readonly         | -           |
| `rent`                   | readonly         | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `quoteCurrency` | `u8`[32]  | -           |

### updateLendingMarket

**Accounts:**

| Account              | Type     | Description |
| -------------------- | -------- | ----------- |
| `lendingMarketOwner` | signer   | -           |
| `lendingMarket`      | writable | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `mode`          | `u64`     | -           |
| `value`         | `u8`[72]  | -           |

### updateLendingMarketOwner

**Accounts:**

| Account                    | Type     | Description |
| -------------------------- | -------- | ----------- |
| `lendingMarketOwnerCached` | signer   | -           |
| `lendingMarket`            | writable | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### initReserve

**Accounts:**

| Account                   | Type             | Description |
| ------------------------- | ---------------- | ----------- |
| `lendingMarketOwner`      | signer, writable | -           |
| `lendingMarket`           | readonly         | -           |
| `lendingMarketAuthority`  | readonly         | -           |
| `reserve`                 | writable         | -           |
| `reserveLiquidityMint`    | readonly         | -           |
| `reserveLiquiditySupply`  | writable         | -           |
| `feeReceiver`             | writable         | -           |
| `reserveCollateralMint`   | writable         | -           |
| `reserveCollateralSupply` | writable         | -           |
| `initialLiquiditySource`  | writable         | -           |
| `rent`                    | readonly         | -           |
| `liquidityTokenProgram`   | readonly         | -           |
| `collateralTokenProgram`  | readonly         | -           |
| `systemProgram`           | readonly         | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### initFarmsForReserve

**Accounts:**

| Account                  | Type             | Description |
| ------------------------ | ---------------- | ----------- |
| `lendingMarketOwner`     | signer, writable | -           |
| `lendingMarket`          | readonly         | -           |
| `lendingMarketAuthority` | readonly         | -           |
| `reserve`                | writable         | -           |
| `farmsProgram`           | readonly         | -           |
| `farmsGlobalConfig`      | readonly         | -           |
| `farmState`              | writable         | -           |
| `farmsVaultAuthority`    | readonly         | -           |
| `rent`                   | readonly         | -           |
| `systemProgram`          | readonly         | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `mode`          | `u8`      | -           |

### updateReserveConfig

**Accounts:**

| Account         | Type     | Description |
| --------------- | -------- | ----------- |
| `signer`        | signer   | -           |
| `globalConfig`  | readonly | -           |
| `lendingMarket` | readonly | -           |
| `reserve`       | writable | -           |

**Arguments:**

| Argument                        | Type                                    | Description |
| ------------------------------- | --------------------------------------- | ----------- |
| `discriminator`                 | `unknown`                               | -           |
| `mode`                          | [updateConfigMode](#updateConfigMode-3) | -           |
| `value`                         | `unknown`                               | -           |
| `skipConfigIntegrityValidation` | `boolean`                               | -           |

### redeemFees

**Accounts:**

| Account                       | Type     | Description |
| ----------------------------- | -------- | ----------- |
| `reserve`                     | writable | -           |
| `reserveLiquidityMint`        | readonly | -           |
| `reserveLiquidityFeeReceiver` | writable | -           |
| `reserveSupplyLiquidity`      | writable | -           |
| `lendingMarket`               | readonly | -           |
| `lendingMarketAuthority`      | readonly | -           |
| `tokenProgram`                | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### withdrawProtocolFee

**Accounts:**

| Account                  | Type     | Description |
| ------------------------ | -------- | ----------- |
| `globalConfig`           | readonly | -           |
| `lendingMarket`          | readonly | -           |
| `reserve`                | readonly | -           |
| `reserveLiquidityMint`   | readonly | -           |
| `lendingMarketAuthority` | readonly | -           |
| `feeVault`               | writable | -           |
| `feeCollectorAta`        | writable | -           |
| `tokenProgram`           | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `amount`        | `u64`     | -           |

### socializeLoss

**Accounts:**

| Account                    | Type     | Description |
| -------------------------- | -------- | ----------- |
| `riskCouncil`              | signer   | -           |
| `obligation`               | writable | -           |
| `lendingMarket`            | readonly | -           |
| `reserve`                  | writable | -           |
| `instructionSysvarAccount` | readonly | -           |

**Arguments:**

| Argument          | Type      | Description |
| ----------------- | --------- | ----------- |
| `discriminator`   | `unknown` | -           |
| `liquidityAmount` | `u64`     | -           |

### socializeLossV2

**Accounts:**

| Account                    | Type               | Description |
| -------------------------- | ------------------ | ----------- |
| `riskCouncil`              | signer             | -           |
| `obligation`               | writable           | -           |
| `lendingMarket`            | readonly           | -           |
| `reserve`                  | writable           | -           |
| `instructionSysvarAccount` | readonly           | -           |
| `obligationFarmUserState`  | writable, optional | -           |
| `reserveFarmState`         | writable, optional | -           |
| `lendingMarketAuthority`   | readonly           | -           |
| `farmsProgram`             | readonly           | -           |

**Arguments:**

| Argument          | Type      | Description |
| ----------------- | --------- | ----------- |
| `discriminator`   | `unknown` | -           |
| `liquidityAmount` | `u64`     | -           |

### markObligationForDeleveraging

**Accounts:**

| Account         | Type     | Description |
| --------------- | -------- | ----------- |
| `riskCouncil`   | signer   | -           |
| `obligation`    | writable | -           |
| `lendingMarket` | readonly | -           |

**Arguments:**

| Argument                     | Type      | Description |
| ---------------------------- | --------- | ----------- |
| `discriminator`              | `unknown` | -           |
| `autodeleverageTargetLtvPct` | `u8`      | -           |

### refreshReserve

**Accounts:**

| Account                  | Type     | Description |
| ------------------------ | -------- | ----------- |
| `reserve`                | writable | -           |
| `lendingMarket`          | readonly | -           |
| `pythOracle`             | optional | -           |
| `switchboardPriceOracle` | optional | -           |
| `switchboardTwapOracle`  | optional | -           |
| `scopePrices`            | optional | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### refreshReservesBatch

**Arguments:**

| Argument           | Type      | Description |
| ------------------ | --------- | ----------- |
| `discriminator`    | `unknown` | -           |
| `skipPriceUpdates` | `boolean` | -           |

### depositReserveLiquidity

**Accounts:**

| Account                     | Type     | Description |
| --------------------------- | -------- | ----------- |
| `owner`                     | signer   | -           |
| `reserve`                   | writable | -           |
| `lendingMarket`             | readonly | -           |
| `lendingMarketAuthority`    | readonly | -           |
| `reserveLiquidityMint`      | readonly | -           |
| `reserveLiquiditySupply`    | writable | -           |
| `reserveCollateralMint`     | writable | -           |
| `userSourceLiquidity`       | writable | -           |
| `userDestinationCollateral` | writable | -           |
| `collateralTokenProgram`    | readonly | -           |
| `liquidityTokenProgram`     | readonly | -           |
| `instructionSysvarAccount`  | readonly | -           |

**Arguments:**

| Argument          | Type      | Description |
| ----------------- | --------- | ----------- |
| `discriminator`   | `unknown` | -           |
| `liquidityAmount` | `u64`     | -           |

### redeemReserveCollateral

**Accounts:**

| Account                    | Type     | Description |
| -------------------------- | -------- | ----------- |
| `owner`                    | signer   | -           |
| `lendingMarket`            | readonly | -           |
| `reserve`                  | writable | -           |
| `lendingMarketAuthority`   | readonly | -           |
| `reserveLiquidityMint`     | readonly | -           |
| `reserveCollateralMint`    | writable | -           |
| `reserveLiquiditySupply`   | writable | -           |
| `userSourceCollateral`     | writable | -           |
| `userDestinationLiquidity` | writable | -           |
| `collateralTokenProgram`   | readonly | -           |
| `liquidityTokenProgram`    | readonly | -           |
| `instructionSysvarAccount` | readonly | -           |

**Arguments:**

| Argument           | Type      | Description |
| ------------------ | --------- | ----------- |
| `discriminator`    | `unknown` | -           |
| `collateralAmount` | `u64`     | -           |

### initObligation

**Accounts:**

| Account             | Type             | Description |
| ------------------- | ---------------- | ----------- |
| `obligationOwner`   | signer           | -           |
| `feePayer`          | signer, writable | -           |
| `obligation`        | writable         | -           |
| `lendingMarket`     | readonly         | -           |
| `seed1Account`      | readonly         | -           |
| `seed2Account`      | readonly         | -           |
| `ownerUserMetadata` | readonly         | -           |
| `rent`              | readonly         | -           |
| `systemProgram`     | readonly         | -           |

**Arguments:**

| Argument        | Type                                        | Description |
| --------------- | ------------------------------------------- | ----------- |
| `discriminator` | `unknown`                                   | -           |
| `args`          | [initObligationArgs](#initObligationArgs-3) | -           |

### initObligationFarmsForReserve

**Accounts:**

| Account                  | Type             | Description |
| ------------------------ | ---------------- | ----------- |
| `payer`                  | signer, writable | -           |
| `owner`                  | readonly         | -           |
| `obligation`             | writable         | -           |
| `lendingMarketAuthority` | readonly         | -           |
| `reserve`                | writable         | -           |
| `reserveFarmState`       | writable         | -           |
| `obligationFarm`         | writable         | -           |
| `lendingMarket`          | readonly         | -           |
| `farmsProgram`           | readonly         | -           |
| `rent`                   | readonly         | -           |
| `systemProgram`          | readonly         | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `mode`          | `u8`      | -           |

### refreshObligationFarmsForReserve

**Accounts:**

| Account                   | Type     | Description |
| ------------------------- | -------- | ----------- |
| `crank`                   | signer   | -           |
| `obligation`              | readonly | -           |
| `lendingMarketAuthority`  | readonly | -           |
| `reserve`                 | readonly | -           |
| `reserveFarmState`        | writable | -           |
| `obligationFarmUserState` | writable | -           |
| `lendingMarket`           | readonly | -           |
| `farmsProgram`            | readonly | -           |
| `rent`                    | readonly | -           |
| `systemProgram`           | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `mode`          | `u8`      | -           |

### refreshObligation

**Accounts:**

| Account         | Type     | Description |
| --------------- | -------- | ----------- |
| `lendingMarket` | readonly | -           |
| `obligation`    | writable | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### depositObligationCollateral

**Accounts:**

| Account                        | Type     | Description |
| ------------------------------ | -------- | ----------- |
| `owner`                        | signer   | -           |
| `obligation`                   | writable | -           |
| `lendingMarket`                | readonly | -           |
| `depositReserve`               | writable | -           |
| `reserveDestinationCollateral` | writable | -           |
| `userSourceCollateral`         | writable | -           |
| `tokenProgram`                 | readonly | -           |
| `instructionSysvarAccount`     | readonly | -           |

**Arguments:**

| Argument           | Type      | Description |
| ------------------ | --------- | ----------- |
| `discriminator`    | `unknown` | -           |
| `collateralAmount` | `u64`     | -           |

### depositObligationCollateralV2

**Accounts:**

| Account                        | Type               | Description |
| ------------------------------ | ------------------ | ----------- |
| `owner`                        | signer             | -           |
| `obligation`                   | writable           | -           |
| `lendingMarket`                | readonly           | -           |
| `depositReserve`               | writable           | -           |
| `reserveDestinationCollateral` | writable           | -           |
| `userSourceCollateral`         | writable           | -           |
| `tokenProgram`                 | readonly           | -           |
| `instructionSysvarAccount`     | readonly           | -           |
| `lendingMarketAuthority`       | readonly           | -           |
| `obligationFarmUserState`      | writable, optional | -           |
| `reserveFarmState`             | writable, optional | -           |
| `farmsProgram`                 | readonly           | -           |

**Arguments:**

| Argument           | Type      | Description |
| ------------------ | --------- | ----------- |
| `discriminator`    | `unknown` | -           |
| `collateralAmount` | `u64`     | -           |

### withdrawObligationCollateral

**Accounts:**

| Account                     | Type     | Description |
| --------------------------- | -------- | ----------- |
| `owner`                     | signer   | -           |
| `obligation`                | writable | -           |
| `lendingMarket`             | readonly | -           |
| `lendingMarketAuthority`    | readonly | -           |
| `withdrawReserve`           | writable | -           |
| `reserveSourceCollateral`   | writable | -           |
| `userDestinationCollateral` | writable | -           |
| `tokenProgram`              | readonly | -           |
| `instructionSysvarAccount`  | readonly | -           |

**Arguments:**

| Argument           | Type      | Description |
| ------------------ | --------- | ----------- |
| `discriminator`    | `unknown` | -           |
| `collateralAmount` | `u64`     | -           |

### withdrawObligationCollateralV2

**Accounts:**

| Account                     | Type               | Description |
| --------------------------- | ------------------ | ----------- |
| `owner`                     | signer             | -           |
| `obligation`                | writable           | -           |
| `lendingMarket`             | readonly           | -           |
| `lendingMarketAuthority`    | readonly           | -           |
| `withdrawReserve`           | writable           | -           |
| `reserveSourceCollateral`   | writable           | -           |
| `userDestinationCollateral` | writable           | -           |
| `tokenProgram`              | readonly           | -           |
| `instructionSysvarAccount`  | readonly           | -           |
| `obligationFarmUserState`   | writable, optional | -           |
| `reserveFarmState`          | writable, optional | -           |
| `farmsProgram`              | readonly           | -           |

**Arguments:**

| Argument           | Type      | Description |
| ------------------ | --------- | ----------- |
| `discriminator`    | `unknown` | -           |
| `collateralAmount` | `u64`     | -           |

### borrowObligationLiquidity

**Accounts:**

| Account                             | Type               | Description |
| ----------------------------------- | ------------------ | ----------- |
| `owner`                             | signer             | -           |
| `obligation`                        | writable           | -           |
| `lendingMarket`                     | readonly           | -           |
| `lendingMarketAuthority`            | readonly           | -           |
| `borrowReserve`                     | writable           | -           |
| `borrowReserveLiquidityMint`        | readonly           | -           |
| `reserveSourceLiquidity`            | writable           | -           |
| `borrowReserveLiquidityFeeReceiver` | writable           | -           |
| `userDestinationLiquidity`          | writable           | -           |
| `referrerTokenState`                | writable, optional | -           |
| `tokenProgram`                      | readonly           | -           |
| `instructionSysvarAccount`          | readonly           | -           |

**Arguments:**

| Argument          | Type      | Description |
| ----------------- | --------- | ----------- |
| `discriminator`   | `unknown` | -           |
| `liquidityAmount` | `u64`     | -           |

### borrowObligationLiquidityV2

**Accounts:**

| Account                             | Type               | Description |
| ----------------------------------- | ------------------ | ----------- |
| `owner`                             | signer             | -           |
| `obligation`                        | writable           | -           |
| `lendingMarket`                     | readonly           | -           |
| `lendingMarketAuthority`            | readonly           | -           |
| `borrowReserve`                     | writable           | -           |
| `borrowReserveLiquidityMint`        | readonly           | -           |
| `reserveSourceLiquidity`            | writable           | -           |
| `borrowReserveLiquidityFeeReceiver` | writable           | -           |
| `userDestinationLiquidity`          | writable           | -           |
| `referrerTokenState`                | writable, optional | -           |
| `tokenProgram`                      | readonly           | -           |
| `instructionSysvarAccount`          | readonly           | -           |
| `obligationFarmUserState`           | writable, optional | -           |
| `reserveFarmState`                  | writable, optional | -           |
| `farmsProgram`                      | readonly           | -           |

**Arguments:**

| Argument          | Type      | Description |
| ----------------- | --------- | ----------- |
| `discriminator`   | `unknown` | -           |
| `liquidityAmount` | `u64`     | -           |

### repayObligationLiquidity

**Accounts:**

| Account                       | Type     | Description |
| ----------------------------- | -------- | ----------- |
| `owner`                       | signer   | -           |
| `obligation`                  | writable | -           |
| `lendingMarket`               | readonly | -           |
| `repayReserve`                | writable | -           |
| `reserveLiquidityMint`        | readonly | -           |
| `reserveDestinationLiquidity` | writable | -           |
| `userSourceLiquidity`         | writable | -           |
| `tokenProgram`                | readonly | -           |
| `instructionSysvarAccount`    | readonly | -           |

**Arguments:**

| Argument          | Type      | Description |
| ----------------- | --------- | ----------- |
| `discriminator`   | `unknown` | -           |
| `liquidityAmount` | `u64`     | -           |

### repayObligationLiquidityV2

**Accounts:**

| Account                       | Type               | Description |
| ----------------------------- | ------------------ | ----------- |
| `owner`                       | signer             | -           |
| `obligation`                  | writable           | -           |
| `lendingMarket`               | readonly           | -           |
| `repayReserve`                | writable           | -           |
| `reserveLiquidityMint`        | readonly           | -           |
| `reserveDestinationLiquidity` | writable           | -           |
| `userSourceLiquidity`         | writable           | -           |
| `tokenProgram`                | readonly           | -           |
| `instructionSysvarAccount`    | readonly           | -           |
| `obligationFarmUserState`     | writable, optional | -           |
| `reserveFarmState`            | writable, optional | -           |
| `lendingMarketAuthority`      | readonly           | -           |
| `farmsProgram`                | readonly           | -           |

**Arguments:**

| Argument          | Type      | Description |
| ----------------- | --------- | ----------- |
| `discriminator`   | `unknown` | -           |
| `liquidityAmount` | `u64`     | -           |

### repayAndWithdrawAndRedeem

**Accounts:**

| Account                                                | Type               | Description |
| ------------------------------------------------------ | ------------------ | ----------- |
| `repayAccountsOwner`                                   | signer             | -           |
| `repayAccountsObligation`                              | writable           | -           |
| `repayAccountsLendingMarket`                           | readonly           | -           |
| `repayAccountsRepayReserve`                            | writable           | -           |
| `repayAccountsReserveLiquidityMint`                    | readonly           | -           |
| `repayAccountsReserveDestinationLiquidity`             | writable           | -           |
| `repayAccountsUserSourceLiquidity`                     | writable           | -           |
| `repayAccountsTokenProgram`                            | readonly           | -           |
| `repayAccountsInstructionSysvarAccount`                | readonly           | -           |
| `withdrawAccountsOwner`                                | signer, writable   | -           |
| `withdrawAccountsObligation`                           | writable           | -           |
| `withdrawAccountsLendingMarket`                        | readonly           | -           |
| `withdrawAccountsLendingMarketAuthority`               | readonly           | -           |
| `withdrawAccountsWithdrawReserve`                      | writable           | -           |
| `withdrawAccountsReserveLiquidityMint`                 | readonly           | -           |
| `withdrawAccountsReserveSourceCollateral`              | writable           | -           |
| `withdrawAccountsReserveCollateralMint`                | writable           | -           |
| `withdrawAccountsReserveLiquiditySupply`               | writable           | -           |
| `withdrawAccountsUserDestinationLiquidity`             | writable           | -           |
| `withdrawAccountsPlaceholderUserDestinationCollateral` | optional           | -           |
| `withdrawAccountsCollateralTokenProgram`               | readonly           | -           |
| `withdrawAccountsLiquidityTokenProgram`                | readonly           | -           |
| `withdrawAccountsInstructionSysvarAccount`             | readonly           | -           |
| `collateralFarmsAccountsObligationFarmUserState`       | writable, optional | -           |
| `collateralFarmsAccountsReserveFarmState`              | writable, optional | -           |
| `repayDebtFarmsAccountsObligationFarmUserState`        | writable, optional | -           |
| `repayDebtFarmsAccountsReserveFarmState`               | writable, optional | -           |
| `farmsProgram`                                         | readonly           | -           |

**Arguments:**

| Argument                   | Type      | Description |
| -------------------------- | --------- | ----------- |
| `discriminator`            | `unknown` | -           |
| `repayAmount`              | `u64`     | -           |
| `withdrawCollateralAmount` | `u64`     | -           |

### depositAndWithdraw

**Accounts:**

| Account                                                | Type               | Description |
| ------------------------------------------------------ | ------------------ | ----------- |
| `depositAccountsOwner`                                 | signer, writable   | -           |
| `depositAccountsObligation`                            | writable           | -           |
| `depositAccountsLendingMarket`                         | readonly           | -           |
| `depositAccountsLendingMarketAuthority`                | readonly           | -           |
| `depositAccountsReserve`                               | writable           | -           |
| `depositAccountsReserveLiquidityMint`                  | readonly           | -           |
| `depositAccountsReserveLiquiditySupply`                | writable           | -           |
| `depositAccountsReserveCollateralMint`                 | writable           | -           |
| `depositAccountsReserveDestinationDepositCollateral`   | writable           | -           |
| `depositAccountsUserSourceLiquidity`                   | writable           | -           |
| `depositAccountsPlaceholderUserDestinationCollateral`  | optional           | -           |
| `depositAccountsCollateralTokenProgram`                | readonly           | -           |
| `depositAccountsLiquidityTokenProgram`                 | readonly           | -           |
| `depositAccountsInstructionSysvarAccount`              | readonly           | -           |
| `withdrawAccountsOwner`                                | signer, writable   | -           |
| `withdrawAccountsObligation`                           | writable           | -           |
| `withdrawAccountsLendingMarket`                        | readonly           | -           |
| `withdrawAccountsLendingMarketAuthority`               | readonly           | -           |
| `withdrawAccountsWithdrawReserve`                      | writable           | -           |
| `withdrawAccountsReserveLiquidityMint`                 | readonly           | -           |
| `withdrawAccountsReserveSourceCollateral`              | writable           | -           |
| `withdrawAccountsReserveCollateralMint`                | writable           | -           |
| `withdrawAccountsReserveLiquiditySupply`               | writable           | -           |
| `withdrawAccountsUserDestinationLiquidity`             | writable           | -           |
| `withdrawAccountsPlaceholderUserDestinationCollateral` | optional           | -           |
| `withdrawAccountsCollateralTokenProgram`               | readonly           | -           |
| `withdrawAccountsLiquidityTokenProgram`                | readonly           | -           |
| `withdrawAccountsInstructionSysvarAccount`             | readonly           | -           |
| `depositFarmsAccountsObligationFarmUserState`          | writable, optional | -           |
| `depositFarmsAccountsReserveFarmState`                 | writable, optional | -           |
| `withdrawFarmsAccountsObligationFarmUserState`         | writable, optional | -           |
| `withdrawFarmsAccountsReserveFarmState`                | writable, optional | -           |
| `farmsProgram`                                         | readonly           | -           |

**Arguments:**

| Argument                   | Type      | Description |
| -------------------------- | --------- | ----------- |
| `discriminator`            | `unknown` | -           |
| `liquidityAmount`          | `u64`     | -           |
| `withdrawCollateralAmount` | `u64`     | -           |

### depositReserveLiquidityAndObligationCollateral

**Accounts:**

| Account                                | Type             | Description |
| -------------------------------------- | ---------------- | ----------- |
| `owner`                                | signer, writable | -           |
| `obligation`                           | writable         | -           |
| `lendingMarket`                        | readonly         | -           |
| `lendingMarketAuthority`               | readonly         | -           |
| `reserve`                              | writable         | -           |
| `reserveLiquidityMint`                 | readonly         | -           |
| `reserveLiquiditySupply`               | writable         | -           |
| `reserveCollateralMint`                | writable         | -           |
| `reserveDestinationDepositCollateral`  | writable         | -           |
| `userSourceLiquidity`                  | writable         | -           |
| `placeholderUserDestinationCollateral` | optional         | -           |
| `collateralTokenProgram`               | readonly         | -           |
| `liquidityTokenProgram`                | readonly         | -           |
| `instructionSysvarAccount`             | readonly         | -           |

**Arguments:**

| Argument          | Type      | Description |
| ----------------- | --------- | ----------- |
| `discriminator`   | `unknown` | -           |
| `liquidityAmount` | `u64`     | -           |

### depositReserveLiquidityAndObligationCollateralV2

**Accounts:**

| Account                                | Type               | Description |
| -------------------------------------- | ------------------ | ----------- |
| `owner`                                | signer, writable   | -           |
| `obligation`                           | writable           | -           |
| `lendingMarket`                        | readonly           | -           |
| `lendingMarketAuthority`               | readonly           | -           |
| `reserve`                              | writable           | -           |
| `reserveLiquidityMint`                 | readonly           | -           |
| `reserveLiquiditySupply`               | writable           | -           |
| `reserveCollateralMint`                | writable           | -           |
| `reserveDestinationDepositCollateral`  | writable           | -           |
| `userSourceLiquidity`                  | writable           | -           |
| `placeholderUserDestinationCollateral` | optional           | -           |
| `collateralTokenProgram`               | readonly           | -           |
| `liquidityTokenProgram`                | readonly           | -           |
| `instructionSysvarAccount`             | readonly           | -           |
| `obligationFarmUserState`              | writable, optional | -           |
| `reserveFarmState`                     | writable, optional | -           |
| `farmsProgram`                         | readonly           | -           |

**Arguments:**

| Argument          | Type      | Description |
| ----------------- | --------- | ----------- |
| `discriminator`   | `unknown` | -           |
| `liquidityAmount` | `u64`     | -           |

### withdrawObligationCollateralAndRedeemReserveCollateral

**Accounts:**

| Account                                | Type             | Description |
| -------------------------------------- | ---------------- | ----------- |
| `owner`                                | signer, writable | -           |
| `obligation`                           | writable         | -           |
| `lendingMarket`                        | readonly         | -           |
| `lendingMarketAuthority`               | readonly         | -           |
| `withdrawReserve`                      | writable         | -           |
| `reserveLiquidityMint`                 | readonly         | -           |
| `reserveSourceCollateral`              | writable         | -           |
| `reserveCollateralMint`                | writable         | -           |
| `reserveLiquiditySupply`               | writable         | -           |
| `userDestinationLiquidity`             | writable         | -           |
| `placeholderUserDestinationCollateral` | optional         | -           |
| `collateralTokenProgram`               | readonly         | -           |
| `liquidityTokenProgram`                | readonly         | -           |
| `instructionSysvarAccount`             | readonly         | -           |

**Arguments:**

| Argument           | Type      | Description |
| ------------------ | --------- | ----------- |
| `discriminator`    | `unknown` | -           |
| `collateralAmount` | `u64`     | -           |

### withdrawObligationCollateralAndRedeemReserveCollateralV2

**Accounts:**

| Account                                | Type               | Description |
| -------------------------------------- | ------------------ | ----------- |
| `owner`                                | signer, writable   | -           |
| `obligation`                           | writable           | -           |
| `lendingMarket`                        | readonly           | -           |
| `lendingMarketAuthority`               | readonly           | -           |
| `withdrawReserve`                      | writable           | -           |
| `reserveLiquidityMint`                 | readonly           | -           |
| `reserveSourceCollateral`              | writable           | -           |
| `reserveCollateralMint`                | writable           | -           |
| `reserveLiquiditySupply`               | writable           | -           |
| `userDestinationLiquidity`             | writable           | -           |
| `placeholderUserDestinationCollateral` | optional           | -           |
| `collateralTokenProgram`               | readonly           | -           |
| `liquidityTokenProgram`                | readonly           | -           |
| `instructionSysvarAccount`             | readonly           | -           |
| `obligationFarmUserState`              | writable, optional | -           |
| `reserveFarmState`                     | writable, optional | -           |
| `farmsProgram`                         | readonly           | -           |

**Arguments:**

| Argument           | Type      | Description |
| ------------------ | --------- | ----------- |
| `discriminator`    | `unknown` | -           |
| `collateralAmount` | `u64`     | -           |

### liquidateObligationAndRedeemReserveCollateral

**Accounts:**

| Account                               | Type     | Description |
| ------------------------------------- | -------- | ----------- |
| `liquidator`                          | signer   | -           |
| `obligation`                          | writable | -           |
| `lendingMarket`                       | readonly | -           |
| `lendingMarketAuthority`              | readonly | -           |
| `repayReserve`                        | writable | -           |
| `repayReserveLiquidityMint`           | readonly | -           |
| `repayReserveLiquiditySupply`         | writable | -           |
| `withdrawReserve`                     | writable | -           |
| `withdrawReserveLiquidityMint`        | readonly | -           |
| `withdrawReserveCollateralMint`       | writable | -           |
| `withdrawReserveCollateralSupply`     | writable | -           |
| `withdrawReserveLiquiditySupply`      | writable | -           |
| `withdrawReserveLiquidityFeeReceiver` | writable | -           |
| `userSourceLiquidity`                 | writable | -           |
| `userDestinationCollateral`           | writable | -           |
| `userDestinationLiquidity`            | writable | -           |
| `collateralTokenProgram`              | readonly | -           |
| `repayLiquidityTokenProgram`          | readonly | -           |
| `withdrawLiquidityTokenProgram`       | readonly | -           |
| `instructionSysvarAccount`            | readonly | -           |

**Arguments:**

| Argument                               | Type      | Description |
| -------------------------------------- | --------- | ----------- |
| `discriminator`                        | `unknown` | -           |
| `liquidityAmount`                      | `u64`     | -           |
| `minAcceptableReceivedLiquidityAmount` | `u64`     | -           |
| `maxAllowedLtvOverridePercent`         | `u64`     | -           |

### liquidateObligationAndRedeemReserveCollateralV2

**Accounts:**

| Account                                                  | Type               | Description |
| -------------------------------------------------------- | ------------------ | ----------- |
| `liquidationAccountsLiquidator`                          | signer             | -           |
| `liquidationAccountsObligation`                          | writable           | -           |
| `liquidationAccountsLendingMarket`                       | readonly           | -           |
| `liquidationAccountsLendingMarketAuthority`              | writable           | -           |
| `liquidationAccountsRepayReserve`                        | writable           | -           |
| `liquidationAccountsRepayReserveLiquidityMint`           | readonly           | -           |
| `liquidationAccountsRepayReserveLiquiditySupply`         | writable           | -           |
| `liquidationAccountsWithdrawReserve`                     | writable           | -           |
| `liquidationAccountsWithdrawReserveLiquidityMint`        | readonly           | -           |
| `liquidationAccountsWithdrawReserveCollateralMint`       | writable           | -           |
| `liquidationAccountsWithdrawReserveCollateralSupply`     | writable           | -           |
| `liquidationAccountsWithdrawReserveLiquiditySupply`      | writable           | -           |
| `liquidationAccountsWithdrawReserveLiquidityFeeReceiver` | writable           | -           |
| `liquidationAccountsUserSourceLiquidity`                 | writable           | -           |
| `liquidationAccountsUserDestinationCollateral`           | writable           | -           |
| `liquidationAccountsUserDestinationLiquidity`            | writable           | -           |
| `liquidationAccountsCollateralTokenProgram`              | readonly           | -           |
| `liquidationAccountsRepayLiquidityTokenProgram`          | readonly           | -           |
| `liquidationAccountsWithdrawLiquidityTokenProgram`       | readonly           | -           |
| `liquidationAccountsInstructionSysvarAccount`            | readonly           | -           |
| `collateralFarmsAccountsV2ObligationFarmUserState`       | writable, optional | -           |
| `collateralFarmsAccountsV2ReserveFarmState`              | writable, optional | -           |
| `debtFarmsAccountsObligationFarmUserState`               | writable, optional | -           |
| `debtFarmsAccountsReserveFarmState`                      | writable, optional | -           |
| `farmsProgram`                                           | readonly           | -           |

**Arguments:**

| Argument                               | Type      | Description |
| -------------------------------------- | --------- | ----------- |
| `discriminator`                        | `unknown` | -           |
| `liquidityAmount`                      | `u64`     | -           |
| `minAcceptableReceivedLiquidityAmount` | `u64`     | -           |
| `maxAllowedLtvOverridePercent`         | `u64`     | -           |

### flashRepayReserveLiquidity

**Accounts:**

| Account                       | Type               | Description |
| ----------------------------- | ------------------ | ----------- |
| `userTransferAuthority`       | signer             | -           |
| `lendingMarketAuthority`      | readonly           | -           |
| `lendingMarket`               | readonly           | -           |
| `reserve`                     | writable           | -           |
| `reserveLiquidityMint`        | readonly           | -           |
| `reserveDestinationLiquidity` | writable           | -           |
| `userSourceLiquidity`         | writable           | -           |
| `reserveLiquidityFeeReceiver` | writable           | -           |
| `referrerTokenState`          | writable, optional | -           |
| `referrerAccount`             | writable, optional | -           |
| `sysvarInfo`                  | readonly           | -           |
| `tokenProgram`                | readonly           | -           |

**Arguments:**

| Argument                 | Type      | Description |
| ------------------------ | --------- | ----------- |
| `discriminator`          | `unknown` | -           |
| `liquidityAmount`        | `u64`     | -           |
| `borrowInstructionIndex` | `u8`      | -           |

### flashBorrowReserveLiquidity

**Accounts:**

| Account                       | Type               | Description |
| ----------------------------- | ------------------ | ----------- |
| `userTransferAuthority`       | signer             | -           |
| `lendingMarketAuthority`      | readonly           | -           |
| `lendingMarket`               | readonly           | -           |
| `reserve`                     | writable           | -           |
| `reserveLiquidityMint`        | readonly           | -           |
| `reserveSourceLiquidity`      | writable           | -           |
| `userDestinationLiquidity`    | writable           | -           |
| `reserveLiquidityFeeReceiver` | writable           | -           |
| `referrerTokenState`          | writable, optional | -           |
| `referrerAccount`             | writable, optional | -           |
| `sysvarInfo`                  | readonly           | -           |
| `tokenProgram`                | readonly           | -           |

**Arguments:**

| Argument          | Type      | Description |
| ----------------- | --------- | ----------- |
| `discriminator`   | `unknown` | -           |
| `liquidityAmount` | `u64`     | -           |

### requestElevationGroup

**Accounts:**

| Account         | Type     | Description |
| --------------- | -------- | ----------- |
| `owner`         | signer   | -           |
| `obligation`    | writable | -           |
| `lendingMarket` | readonly | -           |

**Arguments:**

| Argument         | Type      | Description |
| ---------------- | --------- | ----------- |
| `discriminator`  | `unknown` | -           |
| `elevationGroup` | `u8`      | -           |

### initReferrerTokenState

**Accounts:**

| Account              | Type             | Description |
| -------------------- | ---------------- | ----------- |
| `payer`              | signer, writable | -           |
| `lendingMarket`      | readonly         | -           |
| `reserve`            | readonly         | -           |
| `referrer`           | readonly         | -           |
| `referrerTokenState` | writable         | -           |
| `rent`               | readonly         | -           |
| `systemProgram`      | readonly         | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### initUserMetadata

**Accounts:**

| Account                | Type             | Description |
| ---------------------- | ---------------- | ----------- |
| `owner`                | signer           | -           |
| `feePayer`             | signer, writable | -           |
| `userMetadata`         | writable         | -           |
| `referrerUserMetadata` | optional         | -           |
| `rent`                 | readonly         | -           |
| `systemProgram`        | readonly         | -           |

**Arguments:**

| Argument          | Type        | Description |
| ----------------- | ----------- | ----------- |
| `discriminator`   | `unknown`   | -           |
| `userLookupTable` | `PublicKey` | -           |

### withdrawReferrerFees

**Accounts:**

| Account                  | Type             | Description |
| ------------------------ | ---------------- | ----------- |
| `referrer`               | signer, writable | -           |
| `referrerTokenState`     | writable         | -           |
| `reserve`                | writable         | -           |
| `reserveLiquidityMint`   | readonly         | -           |
| `reserveSupplyLiquidity` | writable         | -           |
| `referrerTokenAccount`   | writable         | -           |
| `lendingMarket`          | readonly         | -           |
| `lendingMarketAuthority` | readonly         | -           |
| `tokenProgram`           | readonly         | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### initReferrerStateAndShortUrl

**Accounts:**

| Account                | Type             | Description |
| ---------------------- | ---------------- | ----------- |
| `referrer`             | signer, writable | -           |
| `referrerState`        | writable         | -           |
| `referrerShortUrl`     | writable         | -           |
| `referrerUserMetadata` | readonly         | -           |
| `rent`                 | readonly         | -           |
| `systemProgram`        | readonly         | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `shortUrl`      | `unknown` | -           |

### deleteReferrerStateAndShortUrl

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `referrer`      | signer, writable | -           |
| `referrerState` | writable         | -           |
| `shortUrl`      | writable         | -           |
| `rent`          | readonly         | -           |
| `systemProgram` | readonly         | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### setObligationOrder

**Accounts:**

| Account         | Type     | Description |
| --------------- | -------- | ----------- |
| `owner`         | signer   | -           |
| `obligation`    | writable | -           |
| `lendingMarket` | readonly | -           |

**Arguments:**

| Argument        | Type                                            | Description |
| --------------- | ----------------------------------------------- | ----------- |
| `discriminator` | `unknown`                                       | -           |
| `index`         | `u8`                                            | -           |
| `order`         | [obligationOrderInput](#obligationOrderInput-3) | -           |

### initGlobalConfig

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `payer`         | signer, writable | -           |
| `globalConfig`  | writable         | -           |
| `programData`   | readonly         | -           |
| `systemProgram` | readonly         | -           |
| `rent`          | readonly         | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### updateGlobalConfig

**Accounts:**

| Account        | Type     | Description |
| -------------- | -------- | ----------- |
| `globalAdmin`  | signer   | -           |
| `globalConfig` | writable | -           |

**Arguments:**

| Argument        | Type                                                | Description |
| --------------- | --------------------------------------------------- | ----------- |
| `discriminator` | `unknown`                                           | -           |
| `mode`          | [updateGlobalConfigMode](#updateGlobalConfigMode-3) | -           |
| `value`         | `unknown`                                           | -           |

### updateGlobalConfigAdmin

**Accounts:**

| Account        | Type     | Description |
| -------------- | -------- | ----------- |
| `pendingAdmin` | signer   | -           |
| `globalConfig` | writable | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### idlMissingTypes

**Accounts:**

| Account         | Type     | Description |
| --------------- | -------- | ----------- |
| `signer`        | signer   | -           |
| `globalConfig`  | readonly | -           |
| `lendingMarket` | readonly | -           |
| `reserve`       | writable | -           |

**Arguments:**

| Argument                         | Type                                                                | Description |
| -------------------------------- | ------------------------------------------------------------------- | ----------- |
| `discriminator`                  | `unknown`                                                           | -           |
| `reserveFarmKind`                | [reserveFarmKind](#reserveFarmKind-3)                               | -           |
| `assetTier`                      | [assetTier](#assetTier-3)                                           | -           |
| `feeCalculation`                 | [feeCalculation](#feeCalculation-3)                                 | -           |
| `reserveStatus`                  | [reserveStatus](#reserveStatus-3)                                   | -           |
| `updateConfigMode`               | [updateConfigMode](#updateConfigMode-3)                             | -           |
| `updateLendingMarketConfigValue` | [updateLendingMarketConfigValue](#updateLendingMarketConfigValue-3) | -           |
| `updateLendingMarketConfigMode`  | [updateLendingMarketMode](#updateLendingMarketMode-3)               | -           |

## PDAs

### lendingGlobalConfigState

**Seeds:**

| Seed       | Type             | Description |
| ---------- | ---------------- | ----------- |
| `constant` | bytes (constant) | -           |

### obligation

**Seeds:**

| Seed           | Type        | Description |
| -------------- | ----------- | ----------- |
| `tag`          | `u8`        | -           |
| `id`           | `u8`        | -           |
| `user`         | `PublicKey` | -           |
| `market`       | `PublicKey` | -           |
| `seed1Account` | `PublicKey` | -           |
| `seed2Account` | `PublicKey` | -           |

### lendingMarketAuth

**Seeds:**

| Seed            | Type             | Description |
| --------------- | ---------------- | ----------- |
| `constant`      | bytes (constant) | -           |
| `lendingMarket` | `PublicKey`      | -           |

### reserveLiquiditySupply

**Seeds:**

| Seed            | Type             | Description |
| --------------- | ---------------- | ----------- |
| `constant`      | bytes (constant) | -           |
| `lendingMarket` | `PublicKey`      | -           |
| `mint`          | `PublicKey`      | -           |

### reserveFeeVault

**Seeds:**

| Seed            | Type             | Description |
| --------------- | ---------------- | ----------- |
| `constant`      | bytes (constant) | -           |
| `lendingMarket` | `PublicKey`      | -           |
| `mint`          | `PublicKey`      | -           |

### reserveCollateralMint

**Seeds:**

| Seed            | Type             | Description |
| --------------- | ---------------- | ----------- |
| `constant`      | bytes (constant) | -           |
| `lendingMarket` | `PublicKey`      | -           |
| `mint`          | `PublicKey`      | -           |

### reserveCollateralSupply

**Seeds:**

| Seed            | Type             | Description |
| --------------- | ---------------- | ----------- |
| `constant`      | bytes (constant) | -           |
| `lendingMarket` | `PublicKey`      | -           |
| `mint`          | `PublicKey`      | -           |

### userMetadata

**Seeds:**

| Seed       | Type             | Description |
| ---------- | ---------------- | ----------- |
| `constant` | bytes (constant) | -           |
| `user`     | `PublicKey`      | -           |

### referrerTokenState

**Seeds:**

| Seed       | Type             | Description |
| ---------- | ---------------- | ----------- |
| `constant` | bytes (constant) | -           |
| `referrer` | `PublicKey`      | -           |
| `reserve`  | `PublicKey`      | -           |

### referrerState

**Seeds:**

| Seed       | Type             | Description |
| ---------- | ---------------- | ----------- |
| `constant` | bytes (constant) | -           |
| `referrer` | `PublicKey`      | -           |

### shortUrl

**Seeds:**

| Seed       | Type             | Description |
| ---------- | ---------------- | ----------- |
| `constant` | bytes (constant) | -           |
| `shortUrl` | `string`         | -           |

## Types

### updateConfigMode

**Definition:**

```typescript
| { kind: "updateLoanToValuePct" }
  | { kind: "updateMaxLiquidationBonusBps" }
  | { kind: "updateLiquidationThresholdPct" }
  | { kind: "updateProtocolLiquidationFee" }
  | { kind: "updateProtocolTakeRate" }
  | { kind: "updateFeesBorrowFee" }
  | { kind: "updateFeesFlashLoanFee" }
  | { kind: "deprecatedUpdateFeesReferralFeeBps" }
  | { kind: "updateDepositLimit" }
  | { kind: "updateBorrowLimit" }
  | { kind: "updateTokenInfoLowerHeuristic" }
  | { kind: "updateTokenInfoUpperHeuristic" }
  | { kind: "updateTokenInfoExpHeuristic" }
  | { kind: "updateTokenInfoTwapDivergence" }
  | { kind: "updateTokenInfoScopeTwap" }
  | { kind: "updateTokenInfoScopeChain" }
  | { kind: "updateTokenInfoName" }
  | { kind: "updateTokenInfoPriceMaxAge" }
  | { kind: "updateTokenInfoTwapMaxAge" }
  | { kind: "updateScopePriceFeed" }
  | { kind: "updatePythPrice" }
  | { kind: "updateSwitchboardFeed" }
  | { kind: "updateSwitchboardTwapFeed" }
  | { kind: "updateBorrowRateCurve" }
  | { kind: "updateEntireReserveConfig" }
  | { kind: "updateDebtWithdrawalCap" }
  | { kind: "updateDepositWithdrawalCap" }
  | { kind: "deprecatedUpdateDebtWithdrawalCapCurrentTotal" }
  | { kind: "deprecatedUpdateDepositWithdrawalCapCurrentTotal" }
  | { kind: "updateBadDebtLiquidationBonusBps" }
  | { kind: "updateMinLiquidationBonusBps" }
  | { kind: "updateDeleveragingMarginCallPeriod" }
  | { kind: "updateBorrowFactor" }
  | { kind: "updateAssetTier" }
  | { kind: "updateElevationGroup" }
  | { kind: "updateDeleveragingThresholdDecreaseBpsPerDay" }
  | { kind: "deprecatedUpdateMultiplierSideBoost" }
  | { kind: "deprecatedUpdateMultiplierTagBoost" }
  | { kind: "updateReserveStatus" }
  | { kind: "updateFarmCollateral" }
  | { kind: "updateFarmDebt" }
  | { kind: "updateDisableUsageAsCollateralOutsideEmode" }
  | { kind: "updateBlockBorrowingAboveUtilizationPct" }
  | { kind: "updateBlockPriceUsage" }
  | { kind: "updateBorrowLimitOutsideElevationGroup" }
  | { kind: "updateBorrowLimitsInElevationGroupAgainstThisReserve" }
  | { kind: "updateHostFixedInterestRateBps" }
  | { kind: "updateAutodeleverageEnabled" }
  | { kind: "updateDeleveragingBonusIncreaseBpsPerDay" }
  | { kind: "updateProtocolOrderExecutionFee" }
```

### updateLendingMarketConfigValue

**Definition:**

```typescript
| { kind: "bool"; value: [boolean] }
  | { kind: "u8"; value: [bigint] }
  | { kind: "u8Array"; value: [bigint[8]] }
  | { kind: "u16"; value: [bigint] }
  | { kind: "u64"; value: [bigint] }
  | { kind: "u128"; value: [bigint] }
  | { kind: "pubkey"; value: [PublicKey] }
  | { kind: "elevationGroup"; value: [elevationGroup] }
  | { kind: "name"; value: [bigint[32]] }
```

### updateLendingMarketMode

**Definition:**

```typescript
| { kind: "updateOwner" }
  | { kind: "updateEmergencyMode" }
  | { kind: "updateLiquidationCloseFactor" }
  | { kind: "updateLiquidationMaxValue" }
  | { kind: "deprecatedUpdateGlobalUnhealthyBorrow" }
  | { kind: "updateGlobalAllowedBorrow" }
  | { kind: "updateRiskCouncil" }
  | { kind: "updateMinFullLiquidationThreshold" }
  | { kind: "updateInsolvencyRiskLtv" }
  | { kind: "updateElevationGroup" }
  | { kind: "updateReferralFeeBps" }
  | { kind: "deprecatedUpdateMultiplierPoints" }
  | { kind: "updatePriceRefreshTriggerToMaxAgePct" }
  | { kind: "updateAutodeleverageEnabled" }
  | { kind: "updateBorrowingDisabled" }
  | { kind: "updateMinNetValueObligationPostAction" }
  | { kind: "updateMinValueLtvSkipPriorityLiqCheck" }
  | { kind: "updateMinValueBfSkipPriorityLiqCheck" }
  | { kind: "updatePaddingFields" }
  | { kind: "updateName" }
  | { kind: "updateIndividualAutodeleverageMarginCallPeriodSecs" }
  | { kind: "updateInitialDepositAmount" }
  | { kind: "updateObligationOrderExecutionEnabled" }
  | { kind: "updateImmutableFlag" }
  | { kind: "updateObligationOrderCreationEnabled" }
```

### updateGlobalConfigMode

**Definition:**

```typescript
| { kind: "pendingAdmin" }
  | { kind: "feeCollector" }
```

### lastUpdate

Last update state

**Definition:**

```typescript
{
  slot: bigint;
  stale: bigint;
  priceStatus: bigint;
  placeholder: bigint[6];
}
```

### elevationGroup

**Definition:**

```typescript
{
  maxLiquidationBonusBps: bigint;
  id: bigint;
  ltvPct: bigint;
  liquidationThresholdPct: bigint;
  allowNewLoans: bigint;
  maxReservesAsCollateral: bigint;
  padding0: bigint;
  debtReserve: PublicKey;
  padding1: bigint[4];
}
```

### initObligationArgs

**Definition:**

```typescript
{
  tag: bigint;
  id: bigint;
}
```

### obligationCollateral

Obligation collateral state

**Definition:**

```typescript
{
  depositReserve: PublicKey;
  depositedAmount: bigint;
  marketValueSf: bigint;
  borrowedAmountAgainstThisCollateralInElevationGroup: bigint;
  padding: bigint[9];
}
```

### obligationLiquidity

Obligation liquidity state

**Definition:**

```typescript
{
  borrowReserve: PublicKey;
  cumulativeBorrowRateBsf: bigFractionBytes;
  padding: bigint;
  borrowedAmountSf: bigint;
  marketValueSf: bigint;
  borrowFactorAdjustedMarketValueSf: bigint;
  borrowedAmountOutsideElevationGroups: bigint;
  padding2: bigint[7];
}
```

### obligationOrderInput

A single obligation order.

See [Obligation::orders].

**Definition:**

```typescript
{
  conditionThresholdSf: bigint;
  opportunityParameterSf: bigint;
  minExecutionBonusBps: bigint;
  maxExecutionBonusBps: bigint;
  conditionType: bigint;
  opportunityType: bigint;
  padding1: bigint[10];
  padding2: bigint[5];
}
```

### obligationOrder

A single obligation order.

See [Obligation::orders].

**Definition:**

```typescript
{
  conditionThresholdSf: bigint;
  opportunityParameterSf: bigint;
  minExecutionBonusBps: bigint;
  maxExecutionBonusBps: bigint;
  conditionType: bigint;
  opportunityType: bigint;
  padding1: bigint[10];
  padding2: bigint[5];
}
```

### assetTier

**Definition:**

```typescript
| { kind: "regular" }
  | { kind: "isolatedCollateral" }
  | { kind: "isolatedDebt" }
```

### bigFractionBytes

**Definition:**

```typescript
{
  value: bigint[4];
  padding: bigint[2];
}
```

### feeCalculation

Calculate fees exlusive or inclusive of an amount

**Definition:**

```typescript
| { kind: "exclusive" }
  | { kind: "inclusive" }
```

### reserveCollateral

Reserve collateral

**Definition:**

```typescript
{
  mintPubkey: PublicKey;
  mintTotalSupply: bigint;
  supplyVault: PublicKey;
  padding1: bigint[32];
  padding2: bigint[32];
}
```

### reserveConfig

Reserve configuration values

**Definition:**

```typescript
{
  status: bigint;
  assetTier: bigint;
  hostFixedInterestRateBps: bigint;
  reserved2: bigint[9];
  protocolOrderExecutionFeePct: bigint;
  protocolTakeRatePct: bigint;
  protocolLiquidationFeePct: bigint;
  loanToValuePct: bigint;
  liquidationThresholdPct: bigint;
  minLiquidationBonusBps: bigint;
  maxLiquidationBonusBps: bigint;
  badDebtLiquidationBonusBps: bigint;
  deleveragingMarginCallPeriodSecs: bigint;
  deleveragingThresholdDecreaseBpsPerDay: bigint;
  fees: reserveFees;
  borrowRateCurve: borrowRateCurve;
  borrowFactorPct: bigint;
  depositLimit: bigint;
  borrowLimit: bigint;
  tokenInfo: tokenInfo;
  depositWithdrawalCap: withdrawalCaps;
  debtWithdrawalCap: withdrawalCaps;
  elevationGroups: bigint[20];
  disableUsageAsCollOutsideEmode: bigint;
  utilizationLimitBlockBorrowingAbovePct: bigint;
  autodeleverageEnabled: bigint;
  reserved1: bigint[1];
  borrowLimitOutsideElevationGroup: bigint;
  borrowLimitAgainstThisCollateralInElevationGroup: bigint[32];
  deleveragingBonusIncreaseBpsPerDay: bigint;
}
```

### reserveFarmKind

**Definition:**

```typescript
| { kind: "collateral" }
  | { kind: "debt" }
```

### reserveFees

Additional fee information on a reserve

These exist separately from interest accrual fees, and are specifically for the program owner

and referral fee. The fees are paid out as a percentage of liquidity token amounts during

repayments and liquidations.

**Definition:**

```typescript
{
  borrowFeeSf: bigint;
  flashLoanFeeSf: bigint;
  padding: bigint[8];
}
```

### reserveLiquidity

Reserve liquidity

**Definition:**

```typescript
{
  mintPubkey: PublicKey;
  supplyVault: PublicKey;
  feeVault: PublicKey;
  availableAmount: bigint;
  borrowedAmountSf: bigint;
  marketPriceSf: bigint;
  marketPriceLastUpdatedTs: bigint;
  mintDecimals: bigint;
  depositLimitCrossedTimestamp: bigint;
  borrowLimitCrossedTimestamp: bigint;
  cumulativeBorrowRateBsf: bigFractionBytes;
  accumulatedProtocolFeesSf: bigint;
  accumulatedReferrerFeesSf: bigint;
  pendingReferrerFeesSf: bigint;
  absoluteReferralRateSf: bigint;
  tokenProgram: PublicKey;
  padding2: bigint[51];
  padding3: bigint[32];
}
```

### reserveStatus

**Definition:**

```typescript
| { kind: "active" }
  | { kind: "obsolete" }
  | { kind: "hidden" }
```

### withdrawalCaps

Reserve Withdrawal Caps State

**Definition:**

```typescript
{
  configCapacity: bigint;
  currentTotal: bigint;
  lastIntervalStartTimestamp: bigint;
  configIntervalLengthSeconds: bigint;
}
```

### priceHeuristic

**Definition:**

```typescript
{
  lower: bigint;
  upper: bigint;
  exp: bigint;
}
```

### pythConfiguration

**Definition:**

```typescript
{
  price: PublicKey;
}
```

### scopeConfiguration

**Definition:**

```typescript
{
  priceFeed: PublicKey;
  priceChain: bigint[4];
  twapChain: bigint[4];
}
```

### switchboardConfiguration

**Definition:**

```typescript
{
  priceAggregator: PublicKey;
  twapAggregator: PublicKey;
}
```

### tokenInfo

**Definition:**

```typescript
{
  name: bigint[32];
  heuristic: priceHeuristic;
  maxTwapDivergenceBps: bigint;
  maxAgePriceSeconds: bigint;
  maxAgeTwapSeconds: bigint;
  scopeConfiguration: scopeConfiguration;
  switchboardConfiguration: switchboardConfiguration;
  pythConfiguration: pythConfiguration;
  blockPriceUsage: bigint;
  reserved: bigint[7];
  padding: bigint[19];
}
```

### borrowRateCurve

**Definition:**

```typescript
{
  points: curvePoint[11];
}
```

### curvePoint

**Definition:**

```typescript
{
  utilizationRateBps: bigint;
  borrowRateBps: bigint;
}
```

### elevationGroupPod

**Definition:**

```typescript
{
  maxLiquidationBonusBps: bigint;
  id: bigint;
  ltvPct: bigint;
  liquidationThresholdPct: bigint;
  allowNewLoans: bigint;
  maxReservesAsCollateral: bigint;
  padding0: bigint;
  debtReserve: PublicKey;
  padding1: bigint[4];
}
```

## Errors

- **6000 - InvalidMarketAuthority**: Market authority is invalid _(Hex: `0x1770`)_
- **6001 - InvalidMarketOwner**: Market owner is invalid _(Hex: `0x1771`)_
- **6002 - InvalidAccountOwner**: Input account owner is not the program address _(Hex: `0x1772`)_
- **6003 - InvalidAmount**: Input amount is invalid _(Hex: `0x1773`)_
- **6004 - InvalidConfig**: Input config value is invalid _(Hex: `0x1774`)_
- **6005 - InvalidSigner**: Input account must be a signer _(Hex: `0x1775`)_
- **6006 - InvalidAccountInput**: Invalid account input _(Hex: `0x1776`)_
- **6007 - MathOverflow**: Math operation overflow _(Hex: `0x1777`)_
- **6008 - InsufficientLiquidity**: Insufficient liquidity available _(Hex: `0x1778`)_
- **6009 - ReserveStale**: Reserve state needs to be refreshed _(Hex: `0x1779`)_
- **6010 - WithdrawTooSmall**: Withdraw amount too small _(Hex: `0x177a`)_
- **6011 - WithdrawTooLarge**: Withdraw amount too large _(Hex: `0x177b`)_
- **6012 - BorrowTooSmall**: Borrow amount too small to receive liquidity after fees _(Hex: `0x177c`)_
- **6013 - BorrowTooLarge**: Borrow amount too large for deposited collateral _(Hex: `0x177d`)_
- **6014 - RepayTooSmall**: Repay amount too small to transfer liquidity _(Hex: `0x177e`)_
- **6015 - LiquidationTooSmall**: Liquidation amount too small to receive collateral _(Hex: `0x177f`)_
- **6016 - ObligationHealthy**: Cannot liquidate healthy obligations _(Hex: `0x1780`)_
- **6017 - ObligationStale**: Obligation state needs to be refreshed _(Hex: `0x1781`)_
- **6018 - ObligationReserveLimit**: Obligation reserve limit exceeded _(Hex: `0x1782`)_
- **6019 - InvalidObligationOwner**: Obligation owner is invalid _(Hex: `0x1783`)_
- **6020 - ObligationDepositsEmpty**: Obligation deposits are empty _(Hex: `0x1784`)_
- **6021 - ObligationBorrowsEmpty**: Obligation borrows are empty _(Hex: `0x1785`)_
- **6022 - ObligationDepositsZero**: Obligation deposits have zero value _(Hex: `0x1786`)_
- **6023 - ObligationBorrowsZero**: Obligation borrows have zero value _(Hex: `0x1787`)_
- **6024 - InvalidObligationCollateral**: Invalid obligation collateral _(Hex: `0x1788`)_
- **6025 - InvalidObligationLiquidity**: Invalid obligation liquidity _(Hex: `0x1789`)_
- **6026 - ObligationCollateralEmpty**: Obligation collateral is empty _(Hex: `0x178a`)_
- **6027 - ObligationLiquidityEmpty**: Obligation liquidity is empty _(Hex: `0x178b`)_
- **6028 - NegativeInterestRate**: Interest rate is negative _(Hex: `0x178c`)_
- **6029 - InvalidOracleConfig**: Input oracle config is invalid _(Hex: `0x178d`)_
- **6030 - InsufficientProtocolFeesToRedeem**: Insufficient protocol fees to claim or no liquidity available _(Hex: `0x178e`)_
- **6031 - FlashBorrowCpi**: No cpi flash borrows allowed _(Hex: `0x178f`)_
- **6032 - NoFlashRepayFound**: No corresponding repay found for flash borrow _(Hex: `0x1790`)_
- **6033 - InvalidFlashRepay**: Invalid repay found _(Hex: `0x1791`)_
- **6034 - FlashRepayCpi**: No cpi flash repays allowed _(Hex: `0x1792`)_
- **6035 - MultipleFlashBorrows**: Multiple flash borrows not allowed in the same transaction _(Hex: `0x1793`)_
- **6036 - FlashLoansDisabled**: Flash loans are disabled for this reserve _(Hex: `0x1794`)_
- **6037 - SwitchboardV2Error**: Switchboard error _(Hex: `0x1795`)_
- **6038 - CouldNotDeserializeScope**: Cannot deserialize the scope price account _(Hex: `0x1796`)_
- **6039 - PriceTooOld**: Price too old _(Hex: `0x1797`)_
- **6040 - PriceTooDivergentFromTwap**: Price too divergent from twap _(Hex: `0x1798`)_
- **6041 - InvalidTwapPrice**: Invalid twap price _(Hex: `0x1799`)_
- **6042 - GlobalEmergencyMode**: Emergency mode is enabled _(Hex: `0x179a`)_
- **6043 - InvalidFlag**: Invalid lending market config _(Hex: `0x179b`)_
- **6044 - PriceNotValid**: Price is not valid _(Hex: `0x179c`)_
- **6045 - PriceIsBiggerThanHeuristic**: Price is bigger than allowed by heuristic _(Hex: `0x179d`)_
- **6046 - PriceIsLowerThanHeuristic**: Price lower than allowed by heuristic _(Hex: `0x179e`)_
- **6047 - PriceIsZero**: Price is zero _(Hex: `0x179f`)_
- **6048 - PriceConfidenceTooWide**: Price confidence too wide _(Hex: `0x17a0`)_
- **6049 - IntegerOverflow**: Conversion between integers failed _(Hex: `0x17a1`)_
- **6050 - NoFarmForReserve**: This reserve does not have a farm _(Hex: `0x17a2`)_
- **6051 - IncorrectInstructionInPosition**: Wrong instruction at expected position _(Hex: `0x17a3`)_
- **6052 - NoPriceFound**: No price found _(Hex: `0x17a4`)_
- **6053 - InvalidTwapConfig**: Invalid Twap configuration: Twap is enabled but one of the enabled price doesn't have a twap _(Hex: `0x17a5`)_
- **6054 - InvalidPythPriceAccount**: Pyth price account does not match configuration _(Hex: `0x17a6`)_
- **6055 - InvalidSwitchboardAccount**: Switchboard account(s) do not match configuration _(Hex: `0x17a7`)_
- **6056 - InvalidScopePriceAccount**: Scope price account does not match configuration _(Hex: `0x17a8`)_
- **6057 - ObligationCollateralLtvZero**: The obligation has one collateral with an LTV set to 0. Withdraw it before withdrawing other collaterals _(Hex: `0x17a9`)_
- **6058 - InvalidObligationSeedsValue**: Seeds must be default pubkeys for tag 0, and mint addresses for tag 1 or 2 _(Hex: `0x17aa`)_
- **6059 - DeprecatedInvalidObligationId**: [DEPRECATED] Obligation id must be 0 _(Hex: `0x17ab`)_
- **6060 - InvalidBorrowRateCurvePoint**: Invalid borrow rate curve point _(Hex: `0x17ac`)_
- **6061 - InvalidUtilizationRate**: Invalid utilization rate _(Hex: `0x17ad`)_
- **6062 - CannotSocializeObligationWithCollateral**: Obligation hasn't been fully liquidated and debt cannot be socialized. _(Hex: `0x17ae`)_
- **6063 - ObligationEmpty**: Obligation has no borrows or deposits. _(Hex: `0x17af`)_
- **6064 - WithdrawalCapReached**: Withdrawal cap is reached _(Hex: `0x17b0`)_
- **6065 - LastTimestampGreaterThanCurrent**: The last interval start timestamp is greater than the current timestamp _(Hex: `0x17b1`)_
- **6066 - LiquidationRewardTooSmall**: The reward amount is less than the minimum acceptable received liquidity _(Hex: `0x17b2`)_
- **6067 - IsolatedAssetTierViolation**: Isolated Asset Tier Violation _(Hex: `0x17b3`)_
- **6068 - InconsistentElevationGroup**: The obligation's elevation group and the reserve's are not the same _(Hex: `0x17b4`)_
- **6069 - InvalidElevationGroup**: The elevation group chosen for the reserve does not exist in the lending market _(Hex: `0x17b5`)_
- **6070 - InvalidElevationGroupConfig**: The elevation group updated has wrong parameters set _(Hex: `0x17b6`)_
- **6071 - UnhealthyElevationGroupLtv**: The current obligation must have most or all its debt repaid before changing the elevation group _(Hex: `0x17b7`)_
- **6072 - ElevationGroupNewLoansDisabled**: Elevation group does not accept any new loans or any new borrows/withdrawals _(Hex: `0x17b8`)_
- **6073 - ReserveDeprecated**: Reserve was deprecated, no longer usable _(Hex: `0x17b9`)_
- **6074 - ReferrerAccountNotInitialized**: Referrer account not initialized _(Hex: `0x17ba`)_
- **6075 - ReferrerAccountMintMissmatch**: Referrer account mint does not match the operation reserve mint _(Hex: `0x17bb`)_
- **6076 - ReferrerAccountWrongAddress**: Referrer account address is not a valid program address _(Hex: `0x17bc`)_
- **6077 - ReferrerAccountReferrerMissmatch**: Referrer account referrer does not match the owner referrer _(Hex: `0x17bd`)_
- **6078 - ReferrerAccountMissing**: Referrer account missing for obligation with referrer _(Hex: `0x17be`)_
- **6079 - InsufficientReferralFeesToRedeem**: Insufficient referral fees to claim or no liquidity available _(Hex: `0x17bf`)_
- **6080 - CpiDisabled**: CPI disabled for this instruction _(Hex: `0x17c0`)_
- **6081 - ShortUrlNotAsciiAlphanumeric**: Referrer short_url is not ascii alphanumeric _(Hex: `0x17c1`)_
- **6082 - ReserveObsolete**: Reserve is marked as obsolete _(Hex: `0x17c2`)_
- **6083 - ElevationGroupAlreadyActivated**: Obligation already part of the same elevation group _(Hex: `0x17c3`)_
- **6084 - ObligationInObsoleteReserve**: Obligation has a deposit or borrow in an obsolete reserve _(Hex: `0x17c4`)_
- **6085 - ReferrerStateOwnerMismatch**: Referrer state owner does not match the given signer _(Hex: `0x17c5`)_
- **6086 - UserMetadataOwnerAlreadySet**: User metadata owner is already set _(Hex: `0x17c6`)_
- **6087 - CollateralNonLiquidatable**: This collateral cannot be liquidated (LTV set to 0) _(Hex: `0x17c7`)_
- **6088 - BorrowingDisabled**: Borrowing is disabled _(Hex: `0x17c8`)_
- **6089 - BorrowLimitExceeded**: Cannot borrow above borrow limit _(Hex: `0x17c9`)_
- **6090 - DepositLimitExceeded**: Cannot deposit above deposit limit _(Hex: `0x17ca`)_
- **6091 - BorrowingDisabledOutsideElevationGroup**: Reserve does not accept any new borrows outside elevation group _(Hex: `0x17cb`)_
- **6092 - NetValueRemainingTooSmall**: Net value remaining too small _(Hex: `0x17cc`)_
- **6093 - WorseLtvBlocked**: Cannot get the obligation in a worse position _(Hex: `0x17cd`)_
- **6094 - LiabilitiesBiggerThanAssets**: Cannot have more liabilities than assets in a position _(Hex: `0x17ce`)_
- **6095 - ReserveTokenBalanceMismatch**: Reserve state and token account cannot drift _(Hex: `0x17cf`)_
- **6096 - ReserveVaultBalanceMismatch**: Reserve token account has been unexpectedly modified _(Hex: `0x17d0`)_
- **6097 - ReserveAccountingMismatch**: Reserve internal state accounting has been unexpectedly modified _(Hex: `0x17d1`)_
- **6098 - BorrowingAboveUtilizationRateDisabled**: Borrowing above set utilization rate is disabled _(Hex: `0x17d2`)_
- **6099 - LiquidationBorrowFactorPriority**: Liquidation must prioritize the debt with the highest borrow factor _(Hex: `0x17d3`)_
- **6100 - LiquidationLowestLiquidationLtvPriority**: Liquidation must prioritize the collateral with the lowest liquidation LTV _(Hex: `0x17d4`)_
- **6101 - ElevationGroupBorrowLimitExceeded**: Elevation group borrow limit exceeded _(Hex: `0x17d5`)_
- **6102 - ElevationGroupWithoutDebtReserve**: The elevation group does not have a debt reserve defined _(Hex: `0x17d6`)_
- **6103 - ElevationGroupMaxCollateralReserveZero**: The elevation group does not allow any collateral reserves _(Hex: `0x17d7`)_
- **6104 - ElevationGroupHasAnotherDebtReserve**: In elevation group attempt to borrow from a reserve that is not the debt reserve _(Hex: `0x17d8`)_
- **6105 - ElevationGroupDebtReserveAsCollateral**: The elevation group's debt reserve cannot be used as a collateral reserve _(Hex: `0x17d9`)_
- **6106 - ObligationCollateralExceedsElevationGroupLimit**: Obligation have more collateral than the maximum allowed by the elevation group _(Hex: `0x17da`)_
- **6107 - ObligationElevationGroupMultipleDebtReserve**: Obligation is an elevation group but have more than one debt reserve _(Hex: `0x17db`)_
- **6108 - UnsupportedTokenExtension**: Mint has a token (2022) extension that is not supported _(Hex: `0x17dc`)_
- **6109 - InvalidTokenAccount**: Can't have an spl token mint with a t22 account _(Hex: `0x17dd`)_
- **6110 - DepositDisabledOutsideElevationGroup**: Can't deposit into this reserve outside elevation group _(Hex: `0x17de`)_
- **6111 - CannotCalculateReferralAmountDueToSlotsMismatch**: Cannot calculate referral amount due to slots mismatch _(Hex: `0x17df`)_
- **6112 - ObligationOwnersMustMatch**: Obligation owners must match _(Hex: `0x17e0`)_
- **6113 - ObligationsMustMatch**: Obligations must match _(Hex: `0x17e1`)_
- **6114 - LendingMarketsMustMatch**: Lending markets must match _(Hex: `0x17e2`)_
- **6115 - ObligationCurrentlyMarkedForDeleveraging**: Obligation is already marked for deleveraging _(Hex: `0x17e3`)_
- **6116 - MaximumWithdrawValueZero**: Maximum withdrawable value of this collateral is zero, LTV needs improved _(Hex: `0x17e4`)_
- **6117 - ZeroMaxLtvAssetsInDeposits**: No max LTV 0 assets allowed in deposits for repay and withdraw _(Hex: `0x17e5`)_
- **6118 - LowestLtvAssetsPriority**: Withdrawing must prioritize the collateral with the lowest reserve max-LTV _(Hex: `0x17e6`)_
- **6119 - WorseLtvThanUnhealthyLtv**: Cannot get the obligation liquidatable _(Hex: `0x17e7`)_
- **6120 - FarmAccountsMissing**: Farm accounts to refresh are missing _(Hex: `0x17e8`)_
- **6121 - RepayTooSmallForFullLiquidation**: Repay amount is too small to satisfy the mandatory full liquidation _(Hex: `0x17e9`)_
- **6122 - InsufficientRepayAmount**: Liquidator provided repay amount lower than required by liquidation rules _(Hex: `0x17ea`)_
- **6123 - OrderIndexOutOfBounds**: Obligation order of the given index cannot exist _(Hex: `0x17eb`)_
- **6124 - InvalidOrderConfiguration**: Given order configuration has wrong parameters _(Hex: `0x17ec`)_
- **6125 - OrderConfigurationNotSupportedByObligation**: Given order configuration cannot be used with the current state of the obligation _(Hex: `0x17ed`)_
- **6126 - OperationNotPermittedWithCurrentObligationOrders**: Single debt, single collateral obligation orders have to be cancelled before changing the deposit/borrow count _(Hex: `0x17ee`)_
- **6127 - OperationNotPermittedMarketImmutable**: Cannot update lending market because it is set as immutable _(Hex: `0x17ef`)_
- **6128 - OrderCreationDisabled**: Creation of new orders is disabled _(Hex: `0x17f0`)_
- **6129 - NoUpgradeAuthority**: Cannot initialize global config because there is no upgrade authority to the program _(Hex: `0x17f1`)_
