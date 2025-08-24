# Whirlpool Program

- Program ID: `whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc`

## Table of Contents

- [Accounts](#accounts)
  - [whirlpoolsConfig](#whirlpoolsConfig)
  - [whirlpoolsConfigExtension](#whirlpoolsConfigExtension)
  - [feeTier](#feeTier)
  - [lockConfig](#lockConfig)
  - [position](#position)
  - [positionBundle](#positionBundle)
  - [tickArray](#tickArray)
  - [tokenBadge](#tokenBadge)
  - [whirlpool](#whirlpool)
- [Instructions](#instructions)
  - [initializeConfig](#initializeConfig)
  - [initializePool](#initializePool)
  - [initializeTickArray](#initializeTickArray)
  - [initializeFeeTier](#initializeFeeTier)
  - [initializeReward](#initializeReward)
  - [setRewardEmissions](#setRewardEmissions)
  - [openPosition](#openPosition)
  - [openPositionWithMetadata](#openPositionWithMetadata)
  - [increaseLiquidity](#increaseLiquidity)
  - [decreaseLiquidity](#decreaseLiquidity)
  - [updateFeesAndRewards](#updateFeesAndRewards)
  - [collectFees](#collectFees)
  - [collectReward](#collectReward)
  - [collectProtocolFees](#collectProtocolFees)
  - [swap](#swap)
  - [closePosition](#closePosition)
  - [setDefaultFeeRate](#setDefaultFeeRate)
  - [setDefaultProtocolFeeRate](#setDefaultProtocolFeeRate)
  - [setFeeRate](#setFeeRate)
  - [setProtocolFeeRate](#setProtocolFeeRate)
  - [setFeeAuthority](#setFeeAuthority)
  - [setCollectProtocolFeesAuthority](#setCollectProtocolFeesAuthority)
  - [setRewardAuthority](#setRewardAuthority)
  - [setRewardAuthorityBySuperAuthority](#setRewardAuthorityBySuperAuthority)
  - [setRewardEmissionsSuperAuthority](#setRewardEmissionsSuperAuthority)
  - [twoHopSwap](#twoHopSwap)
  - [initializePositionBundle](#initializePositionBundle)
  - [initializePositionBundleWithMetadata](#initializePositionBundleWithMetadata)
  - [deletePositionBundle](#deletePositionBundle)
  - [openBundledPosition](#openBundledPosition)
  - [closeBundledPosition](#closeBundledPosition)
  - [openPositionWithTokenExtensions](#openPositionWithTokenExtensions)
  - [closePositionWithTokenExtensions](#closePositionWithTokenExtensions)
  - [lockPosition](#lockPosition)
  - [collectFeesV2](#collectFeesV2)
  - [collectProtocolFeesV2](#collectProtocolFeesV2)
  - [collectRewardV2](#collectRewardV2)
  - [decreaseLiquidityV2](#decreaseLiquidityV2)
  - [increaseLiquidityV2](#increaseLiquidityV2)
  - [initializePoolV2](#initializePoolV2)
  - [initializeRewardV2](#initializeRewardV2)
  - [setRewardEmissionsV2](#setRewardEmissionsV2)
  - [swapV2](#swapV2)
  - [twoHopSwapV2](#twoHopSwapV2)
  - [initializeConfigExtension](#initializeConfigExtension)
  - [setConfigExtensionAuthority](#setConfigExtensionAuthority)
  - [setTokenBadgeAuthority](#setTokenBadgeAuthority)
  - [initializeTokenBadge](#initializeTokenBadge)
  - [deleteTokenBadge](#deleteTokenBadge)
- [Types](#types)
  - [lockType](#lockType)
  - [lockTypeLabel](#lockTypeLabel)
  - [openPositionBumps](#openPositionBumps)
  - [openPositionWithMetadataBumps](#openPositionWithMetadataBumps)
  - [positionRewardInfo](#positionRewardInfo)
  - [tick](#tick)
  - [whirlpoolBumps](#whirlpoolBumps)
  - [whirlpoolRewardInfo](#whirlpoolRewardInfo)
  - [accountsType](#accountsType)
  - [remainingAccountsInfo](#remainingAccountsInfo)
  - [remainingAccountsSlice](#remainingAccountsSlice)
- [Errors](#errors)

## Accounts

### whirlpoolsConfig

**Fields:**

| Field                           | Type        | Description |
| ------------------------------- | ----------- | ----------- |
| `discriminator`                 | `unknown`   |             |
| `feeAuthority`                  | `PublicKey` |             |
| `collectProtocolFeesAuthority`  | `PublicKey` |             |
| `rewardEmissionsSuperAuthority` | `PublicKey` |             |
| `defaultProtocolFeeRate`        | `u16`       |             |

### whirlpoolsConfigExtension

**Fields:**

| Field                      | Type        | Description |
| -------------------------- | ----------- | ----------- |
| `discriminator`            | `unknown`   |             |
| `whirlpoolsConfig`         | `PublicKey` |             |
| `configExtensionAuthority` | `PublicKey` |             |
| `tokenBadgeAuthority`      | `PublicKey` |             |

### feeTier

**Fields:**

| Field              | Type        | Description |
| ------------------ | ----------- | ----------- |
| `discriminator`    | `unknown`   |             |
| `whirlpoolsConfig` | `PublicKey` |             |
| `tickSpacing`      | `u16`       |             |
| `defaultFeeRate`   | `u16`       |             |

### lockConfig

**Fields:**

| Field             | Type                              | Description |
| ----------------- | --------------------------------- | ----------- |
| `discriminator`   | `unknown`                         |             |
| `position`        | `PublicKey`                       |             |
| `positionOwner`   | `PublicKey`                       |             |
| `whirlpool`       | `PublicKey`                       |             |
| `lockedTimestamp` | `u64`                             |             |
| `lockType`        | [lockTypeLabel](#lockTypeLabel-3) |             |

### position

**Fields:**

| Field                  | Type                                           | Description |
| ---------------------- | ---------------------------------------------- | ----------- |
| `discriminator`        | `unknown`                                      |             |
| `whirlpool`            | `PublicKey`                                    |             |
| `positionMint`         | `PublicKey`                                    |             |
| `liquidity`            | `u128`                                         |             |
| `tickLowerIndex`       | `i32`                                          |             |
| `tickUpperIndex`       | `i32`                                          |             |
| `feeGrowthCheckpointA` | `u128`                                         |             |
| `feeOwedA`             | `u64`                                          |             |
| `feeGrowthCheckpointB` | `u128`                                         |             |
| `feeOwedB`             | `u64`                                          |             |
| `rewardInfos`          | [positionRewardInfo](#positionRewardInfo-3)[3] |             |

### positionBundle

**Fields:**

| Field                | Type        | Description |
| -------------------- | ----------- | ----------- |
| `discriminator`      | `unknown`   |             |
| `positionBundleMint` | `PublicKey` |             |
| `positionBitmap`     | `u8`[32]    |             |

### tickArray

**Fields:**

| Field            | Type                | Description |
| ---------------- | ------------------- | ----------- |
| `discriminator`  | `unknown`           |             |
| `startTickIndex` | `i32`               |             |
| `ticks`          | [tick](#tick-3)[88] |             |
| `whirlpool`      | `PublicKey`         |             |

### tokenBadge

**Fields:**

| Field              | Type        | Description |
| ------------------ | ----------- | ----------- |
| `discriminator`    | `unknown`   |             |
| `whirlpoolsConfig` | `PublicKey` |             |
| `tokenMint`        | `PublicKey` |             |

### whirlpool

**Fields:**

| Field                        | Type                                             | Description |
| ---------------------------- | ------------------------------------------------ | ----------- |
| `discriminator`              | `unknown`                                        |             |
| `whirlpoolsConfig`           | `PublicKey`                                      |             |
| `whirlpoolBump`              | `u8`[1]                                          |             |
| `tickSpacing`                | `u16`                                            |             |
| `tickSpacingSeed`            | `u8`[2]                                          |             |
| `feeRate`                    | `u16`                                            |             |
| `protocolFeeRate`            | `u16`                                            |             |
| `liquidity`                  | `u128`                                           |             |
| `sqrtPrice`                  | `u128`                                           |             |
| `tickCurrentIndex`           | `i32`                                            |             |
| `protocolFeeOwedA`           | `u64`                                            |             |
| `protocolFeeOwedB`           | `u64`                                            |             |
| `tokenMintA`                 | `PublicKey`                                      |             |
| `tokenVaultA`                | `PublicKey`                                      |             |
| `feeGrowthGlobalA`           | `u128`                                           |             |
| `tokenMintB`                 | `PublicKey`                                      |             |
| `tokenVaultB`                | `PublicKey`                                      |             |
| `feeGrowthGlobalB`           | `u128`                                           |             |
| `rewardLastUpdatedTimestamp` | `u64`                                            |             |
| `rewardInfos`                | [whirlpoolRewardInfo](#whirlpoolRewardInfo-3)[3] |             |

## Instructions

### initializeConfig

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `config`        | signer, writable |             |
| `funder`        | signer, writable |             |
| `systemProgram` | readonly         |             |

**Arguments:**

| Argument                        | Type        | Description |
| ------------------------------- | ----------- | ----------- |
| `discriminator`                 | `unknown`   |             |
| `feeAuthority`                  | `PublicKey` |             |
| `collectProtocolFeesAuthority`  | `PublicKey` |             |
| `rewardEmissionsSuperAuthority` | `PublicKey` |             |
| `defaultProtocolFeeRate`        | `u16`       |             |

### initializePool

**Accounts:**

| Account            | Type             | Description |
| ------------------ | ---------------- | ----------- |
| `whirlpoolsConfig` | readonly         |             |
| `tokenMintA`       | readonly         |             |
| `tokenMintB`       | readonly         |             |
| `funder`           | signer, writable |             |
| `whirlpool`        | writable         |             |
| `tokenVaultA`      | signer, writable |             |
| `tokenVaultB`      | signer, writable |             |
| `feeTier`          | readonly         |             |
| `tokenProgram`     | readonly         |             |
| `systemProgram`    | readonly         |             |
| `rent`             | readonly         |             |

**Arguments:**

| Argument           | Type                                | Description |
| ------------------ | ----------------------------------- | ----------- |
| `discriminator`    | `unknown`                           |             |
| `bumps`            | [whirlpoolBumps](#whirlpoolBumps-3) |             |
| `tickSpacing`      | `u16`                               |             |
| `initialSqrtPrice` | `u128`                              |             |

### initializeTickArray

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `whirlpool`     | readonly         |             |
| `funder`        | signer, writable |             |
| `tickArray`     | writable         |             |
| `systemProgram` | readonly         |             |

**Arguments:**

| Argument         | Type      | Description |
| ---------------- | --------- | ----------- |
| `discriminator`  | `unknown` |             |
| `startTickIndex` | `i32`     |             |

### initializeFeeTier

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `config`        | readonly         |             |
| `feeTier`       | writable         |             |
| `funder`        | signer, writable |             |
| `feeAuthority`  | signer           |             |
| `systemProgram` | readonly         |             |

**Arguments:**

| Argument         | Type      | Description |
| ---------------- | --------- | ----------- |
| `discriminator`  | `unknown` |             |
| `tickSpacing`    | `u16`     |             |
| `defaultFeeRate` | `u16`     |             |

### initializeReward

**Accounts:**

| Account           | Type             | Description |
| ----------------- | ---------------- | ----------- |
| `rewardAuthority` | signer           |             |
| `funder`          | signer, writable |             |
| `whirlpool`       | writable         |             |
| `rewardMint`      | readonly         |             |
| `rewardVault`     | signer, writable |             |
| `tokenProgram`    | readonly         |             |
| `systemProgram`   | readonly         |             |
| `rent`            | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `rewardIndex`   | `u8`      |             |

### setRewardEmissions

**Accounts:**

| Account           | Type     | Description |
| ----------------- | -------- | ----------- |
| `whirlpool`       | writable |             |
| `rewardAuthority` | signer   |             |
| `rewardVault`     | readonly |             |

**Arguments:**

| Argument                | Type      | Description |
| ----------------------- | --------- | ----------- |
| `discriminator`         | `unknown` |             |
| `rewardIndex`           | `u8`      |             |
| `emissionsPerSecondX64` | `u128`    |             |

### openPosition

**Accounts:**

| Account                  | Type             | Description |
| ------------------------ | ---------------- | ----------- |
| `funder`                 | signer, writable |             |
| `owner`                  | readonly         |             |
| `position`               | writable         |             |
| `positionMint`           | signer, writable |             |
| `positionTokenAccount`   | writable         |             |
| `whirlpool`              | readonly         |             |
| `tokenProgram`           | readonly         |             |
| `systemProgram`          | readonly         |             |
| `rent`                   | readonly         |             |
| `associatedTokenProgram` | readonly         |             |

**Arguments:**

| Argument         | Type                                      | Description |
| ---------------- | ----------------------------------------- | ----------- |
| `discriminator`  | `unknown`                                 |             |
| `bumps`          | [openPositionBumps](#openPositionBumps-3) |             |
| `tickLowerIndex` | `i32`                                     |             |
| `tickUpperIndex` | `i32`                                     |             |

### openPositionWithMetadata

**Accounts:**

| Account                   | Type             | Description |
| ------------------------- | ---------------- | ----------- |
| `funder`                  | signer, writable |             |
| `owner`                   | readonly         |             |
| `position`                | writable         |             |
| `positionMint`            | signer, writable |             |
| `positionMetadataAccount` | writable         |             |
| `positionTokenAccount`    | writable         |             |
| `whirlpool`               | readonly         |             |
| `tokenProgram`            | readonly         |             |
| `systemProgram`           | readonly         |             |
| `rent`                    | readonly         |             |
| `associatedTokenProgram`  | readonly         |             |
| `metadataProgram`         | readonly         |             |
| `metadataUpdateAuth`      | readonly         |             |

**Arguments:**

| Argument         | Type                                                              | Description |
| ---------------- | ----------------------------------------------------------------- | ----------- |
| `discriminator`  | `unknown`                                                         |             |
| `bumps`          | [openPositionWithMetadataBumps](#openPositionWithMetadataBumps-3) |             |
| `tickLowerIndex` | `i32`                                                             |             |
| `tickUpperIndex` | `i32`                                                             |             |

### increaseLiquidity

**Accounts:**

| Account                | Type     | Description |
| ---------------------- | -------- | ----------- |
| `whirlpool`            | writable |             |
| `tokenProgram`         | readonly |             |
| `positionAuthority`    | signer   |             |
| `position`             | writable |             |
| `positionTokenAccount` | readonly |             |
| `tokenOwnerAccountA`   | writable |             |
| `tokenOwnerAccountB`   | writable |             |
| `tokenVaultA`          | writable |             |
| `tokenVaultB`          | writable |             |
| `tickArrayLower`       | writable |             |
| `tickArrayUpper`       | writable |             |

**Arguments:**

| Argument          | Type      | Description |
| ----------------- | --------- | ----------- |
| `discriminator`   | `unknown` |             |
| `liquidityAmount` | `u128`    |             |
| `tokenMaxA`       | `u64`     |             |
| `tokenMaxB`       | `u64`     |             |

### decreaseLiquidity

**Accounts:**

| Account                | Type     | Description |
| ---------------------- | -------- | ----------- |
| `whirlpool`            | writable |             |
| `tokenProgram`         | readonly |             |
| `positionAuthority`    | signer   |             |
| `position`             | writable |             |
| `positionTokenAccount` | readonly |             |
| `tokenOwnerAccountA`   | writable |             |
| `tokenOwnerAccountB`   | writable |             |
| `tokenVaultA`          | writable |             |
| `tokenVaultB`          | writable |             |
| `tickArrayLower`       | writable |             |
| `tickArrayUpper`       | writable |             |

**Arguments:**

| Argument          | Type      | Description |
| ----------------- | --------- | ----------- |
| `discriminator`   | `unknown` |             |
| `liquidityAmount` | `u128`    |             |
| `tokenMinA`       | `u64`     |             |
| `tokenMinB`       | `u64`     |             |

### updateFeesAndRewards

**Accounts:**

| Account          | Type     | Description |
| ---------------- | -------- | ----------- |
| `whirlpool`      | writable |             |
| `position`       | writable |             |
| `tickArrayLower` | readonly |             |
| `tickArrayUpper` | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### collectFees

**Accounts:**

| Account                | Type     | Description |
| ---------------------- | -------- | ----------- |
| `whirlpool`            | readonly |             |
| `positionAuthority`    | signer   |             |
| `position`             | writable |             |
| `positionTokenAccount` | readonly |             |
| `tokenOwnerAccountA`   | writable |             |
| `tokenVaultA`          | writable |             |
| `tokenOwnerAccountB`   | writable |             |
| `tokenVaultB`          | writable |             |
| `tokenProgram`         | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### collectReward

**Accounts:**

| Account                | Type     | Description |
| ---------------------- | -------- | ----------- |
| `whirlpool`            | readonly |             |
| `positionAuthority`    | signer   |             |
| `position`             | writable |             |
| `positionTokenAccount` | readonly |             |
| `rewardOwnerAccount`   | writable |             |
| `rewardVault`          | writable |             |
| `tokenProgram`         | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `rewardIndex`   | `u8`      |             |

### collectProtocolFees

**Accounts:**

| Account                        | Type     | Description |
| ------------------------------ | -------- | ----------- |
| `whirlpoolsConfig`             | readonly |             |
| `whirlpool`                    | writable |             |
| `collectProtocolFeesAuthority` | signer   |             |
| `tokenVaultA`                  | writable |             |
| `tokenVaultB`                  | writable |             |
| `tokenDestinationA`            | writable |             |
| `tokenDestinationB`            | writable |             |
| `tokenProgram`                 | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### swap

**Accounts:**

| Account              | Type     | Description |
| -------------------- | -------- | ----------- |
| `tokenProgram`       | readonly |             |
| `tokenAuthority`     | signer   |             |
| `whirlpool`          | writable |             |
| `tokenOwnerAccountA` | writable |             |
| `tokenVaultA`        | writable |             |
| `tokenOwnerAccountB` | writable |             |
| `tokenVaultB`        | writable |             |
| `tickArray0`         | writable |             |
| `tickArray1`         | writable |             |
| `tickArray2`         | writable |             |
| `oracle`             | readonly |             |

**Arguments:**

| Argument                 | Type      | Description |
| ------------------------ | --------- | ----------- |
| `discriminator`          | `unknown` |             |
| `amount`                 | `u64`     |             |
| `otherAmountThreshold`   | `u64`     |             |
| `sqrtPriceLimit`         | `u128`    |             |
| `amountSpecifiedIsInput` | `boolean` |             |
| `aToB`                   | `boolean` |             |

### closePosition

**Accounts:**

| Account                | Type     | Description |
| ---------------------- | -------- | ----------- |
| `positionAuthority`    | signer   |             |
| `receiver`             | writable |             |
| `position`             | writable |             |
| `positionMint`         | writable |             |
| `positionTokenAccount` | writable |             |
| `tokenProgram`         | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### setDefaultFeeRate

**Accounts:**

| Account            | Type     | Description |
| ------------------ | -------- | ----------- |
| `whirlpoolsConfig` | readonly |             |
| `feeTier`          | writable |             |
| `feeAuthority`     | signer   |             |

**Arguments:**

| Argument         | Type      | Description |
| ---------------- | --------- | ----------- |
| `discriminator`  | `unknown` |             |
| `defaultFeeRate` | `u16`     |             |

### setDefaultProtocolFeeRate

**Accounts:**

| Account            | Type     | Description |
| ------------------ | -------- | ----------- |
| `whirlpoolsConfig` | writable |             |
| `feeAuthority`     | signer   |             |

**Arguments:**

| Argument                 | Type      | Description |
| ------------------------ | --------- | ----------- |
| `discriminator`          | `unknown` |             |
| `defaultProtocolFeeRate` | `u16`     |             |

### setFeeRate

**Accounts:**

| Account            | Type     | Description |
| ------------------ | -------- | ----------- |
| `whirlpoolsConfig` | readonly |             |
| `whirlpool`        | writable |             |
| `feeAuthority`     | signer   |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `feeRate`       | `u16`     |             |

### setProtocolFeeRate

**Accounts:**

| Account            | Type     | Description |
| ------------------ | -------- | ----------- |
| `whirlpoolsConfig` | readonly |             |
| `whirlpool`        | writable |             |
| `feeAuthority`     | signer   |             |

**Arguments:**

| Argument          | Type      | Description |
| ----------------- | --------- | ----------- |
| `discriminator`   | `unknown` |             |
| `protocolFeeRate` | `u16`     |             |

### setFeeAuthority

**Accounts:**

| Account            | Type     | Description |
| ------------------ | -------- | ----------- |
| `whirlpoolsConfig` | writable |             |
| `feeAuthority`     | signer   |             |
| `newFeeAuthority`  | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### setCollectProtocolFeesAuthority

**Accounts:**

| Account                           | Type     | Description |
| --------------------------------- | -------- | ----------- |
| `whirlpoolsConfig`                | writable |             |
| `collectProtocolFeesAuthority`    | signer   |             |
| `newCollectProtocolFeesAuthority` | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### setRewardAuthority

**Accounts:**

| Account              | Type     | Description |
| -------------------- | -------- | ----------- |
| `whirlpool`          | writable |             |
| `rewardAuthority`    | signer   |             |
| `newRewardAuthority` | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `rewardIndex`   | `u8`      |             |

### setRewardAuthorityBySuperAuthority

**Accounts:**

| Account                         | Type     | Description |
| ------------------------------- | -------- | ----------- |
| `whirlpoolsConfig`              | readonly |             |
| `whirlpool`                     | writable |             |
| `rewardEmissionsSuperAuthority` | signer   |             |
| `newRewardAuthority`            | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `rewardIndex`   | `u8`      |             |

### setRewardEmissionsSuperAuthority

**Accounts:**

| Account                            | Type     | Description |
| ---------------------------------- | -------- | ----------- |
| `whirlpoolsConfig`                 | writable |             |
| `rewardEmissionsSuperAuthority`    | signer   |             |
| `newRewardEmissionsSuperAuthority` | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### twoHopSwap

**Accounts:**

| Account                 | Type     | Description |
| ----------------------- | -------- | ----------- |
| `tokenProgram`          | readonly |             |
| `tokenAuthority`        | signer   |             |
| `whirlpoolOne`          | writable |             |
| `whirlpoolTwo`          | writable |             |
| `tokenOwnerAccountOneA` | writable |             |
| `tokenVaultOneA`        | writable |             |
| `tokenOwnerAccountOneB` | writable |             |
| `tokenVaultOneB`        | writable |             |
| `tokenOwnerAccountTwoA` | writable |             |
| `tokenVaultTwoA`        | writable |             |
| `tokenOwnerAccountTwoB` | writable |             |
| `tokenVaultTwoB`        | writable |             |
| `tickArrayOne0`         | writable |             |
| `tickArrayOne1`         | writable |             |
| `tickArrayOne2`         | writable |             |
| `tickArrayTwo0`         | writable |             |
| `tickArrayTwo1`         | writable |             |
| `tickArrayTwo2`         | writable |             |
| `oracleOne`             | readonly |             |
| `oracleTwo`             | readonly |             |

**Arguments:**

| Argument                 | Type      | Description |
| ------------------------ | --------- | ----------- |
| `discriminator`          | `unknown` |             |
| `amount`                 | `u64`     |             |
| `otherAmountThreshold`   | `u64`     |             |
| `amountSpecifiedIsInput` | `boolean` |             |
| `aToBOne`                | `boolean` |             |
| `aToBTwo`                | `boolean` |             |
| `sqrtPriceLimitOne`      | `u128`    |             |
| `sqrtPriceLimitTwo`      | `u128`    |             |

### initializePositionBundle

**Accounts:**

| Account                      | Type             | Description |
| ---------------------------- | ---------------- | ----------- |
| `positionBundle`             | writable         |             |
| `positionBundleMint`         | signer, writable |             |
| `positionBundleTokenAccount` | writable         |             |
| `positionBundleOwner`        | readonly         |             |
| `funder`                     | signer, writable |             |
| `tokenProgram`               | readonly         |             |
| `systemProgram`              | readonly         |             |
| `rent`                       | readonly         |             |
| `associatedTokenProgram`     | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### initializePositionBundleWithMetadata

**Accounts:**

| Account                      | Type             | Description |
| ---------------------------- | ---------------- | ----------- |
| `positionBundle`             | writable         |             |
| `positionBundleMint`         | signer, writable |             |
| `positionBundleMetadata`     | writable         |             |
| `positionBundleTokenAccount` | writable         |             |
| `positionBundleOwner`        | readonly         |             |
| `funder`                     | signer, writable |             |
| `metadataUpdateAuth`         | readonly         |             |
| `tokenProgram`               | readonly         |             |
| `systemProgram`              | readonly         |             |
| `rent`                       | readonly         |             |
| `associatedTokenProgram`     | readonly         |             |
| `metadataProgram`            | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### deletePositionBundle

**Accounts:**

| Account                      | Type     | Description |
| ---------------------------- | -------- | ----------- |
| `positionBundle`             | writable |             |
| `positionBundleMint`         | writable |             |
| `positionBundleTokenAccount` | writable |             |
| `positionBundleOwner`        | signer   |             |
| `receiver`                   | writable |             |
| `tokenProgram`               | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### openBundledPosition

**Accounts:**

| Account                      | Type             | Description |
| ---------------------------- | ---------------- | ----------- |
| `bundledPosition`            | writable         |             |
| `positionBundle`             | writable         |             |
| `positionBundleTokenAccount` | readonly         |             |
| `positionBundleAuthority`    | signer           |             |
| `whirlpool`                  | readonly         |             |
| `funder`                     | signer, writable |             |
| `systemProgram`              | readonly         |             |
| `rent`                       | readonly         |             |

**Arguments:**

| Argument         | Type      | Description |
| ---------------- | --------- | ----------- |
| `discriminator`  | `unknown` |             |
| `bundleIndex`    | `u16`     |             |
| `tickLowerIndex` | `i32`     |             |
| `tickUpperIndex` | `i32`     |             |

### closeBundledPosition

**Accounts:**

| Account                      | Type     | Description |
| ---------------------------- | -------- | ----------- |
| `bundledPosition`            | writable |             |
| `positionBundle`             | writable |             |
| `positionBundleTokenAccount` | readonly |             |
| `positionBundleAuthority`    | signer   |             |
| `receiver`                   | writable |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `bundleIndex`   | `u16`     |             |

### openPositionWithTokenExtensions

**Accounts:**

| Account                  | Type             | Description |
| ------------------------ | ---------------- | ----------- |
| `funder`                 | signer, writable |             |
| `owner`                  | readonly         |             |
| `position`               | writable         |             |
| `positionMint`           | signer, writable |             |
| `positionTokenAccount`   | writable         |             |
| `whirlpool`              | readonly         |             |
| `token2022Program`       | readonly         |             |
| `systemProgram`          | readonly         |             |
| `associatedTokenProgram` | readonly         |             |
| `metadataUpdateAuth`     | readonly         |             |

**Arguments:**

| Argument                     | Type      | Description |
| ---------------------------- | --------- | ----------- |
| `discriminator`              | `unknown` |             |
| `tickLowerIndex`             | `i32`     |             |
| `tickUpperIndex`             | `i32`     |             |
| `withTokenMetadataExtension` | `boolean` |             |

### closePositionWithTokenExtensions

**Accounts:**

| Account                | Type     | Description |
| ---------------------- | -------- | ----------- |
| `positionAuthority`    | signer   |             |
| `receiver`             | writable |             |
| `position`             | writable |             |
| `positionMint`         | writable |             |
| `positionTokenAccount` | writable |             |
| `token2022Program`     | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### lockPosition

**Accounts:**

| Account                | Type             | Description |
| ---------------------- | ---------------- | ----------- |
| `funder`               | signer, writable |             |
| `positionAuthority`    | signer           |             |
| `position`             | readonly         |             |
| `positionMint`         | readonly         |             |
| `positionTokenAccount` | writable         |             |
| `lockConfig`           | writable         |             |
| `whirlpool`            | readonly         |             |
| `token2022Program`     | readonly         |             |
| `systemProgram`        | readonly         |             |

**Arguments:**

| Argument        | Type                    | Description |
| --------------- | ----------------------- | ----------- |
| `discriminator` | `unknown`               |             |
| `lockType`      | [lockType](#lockType-3) |             |

### collectFeesV2

**Accounts:**

| Account                | Type     | Description |
| ---------------------- | -------- | ----------- |
| `whirlpool`            | readonly |             |
| `positionAuthority`    | signer   |             |
| `position`             | writable |             |
| `positionTokenAccount` | readonly |             |
| `tokenMintA`           | readonly |             |
| `tokenMintB`           | readonly |             |
| `tokenOwnerAccountA`   | writable |             |
| `tokenVaultA`          | writable |             |
| `tokenOwnerAccountB`   | writable |             |
| `tokenVaultB`          | writable |             |
| `tokenProgramA`        | readonly |             |
| `tokenProgramB`        | readonly |             |
| `memoProgram`          | readonly |             |

**Arguments:**

| Argument                | Type                                              | Description |
| ----------------------- | ------------------------------------------------- | ----------- | --- |
| `discriminator`         | `unknown`                                         |             |
| `remainingAccountsInfo` | [remainingAccountsInfo](#remainingAccountsInfo-3) | null        |     |

### collectProtocolFeesV2

**Accounts:**

| Account                        | Type     | Description |
| ------------------------------ | -------- | ----------- |
| `whirlpoolsConfig`             | readonly |             |
| `whirlpool`                    | writable |             |
| `collectProtocolFeesAuthority` | signer   |             |
| `tokenMintA`                   | readonly |             |
| `tokenMintB`                   | readonly |             |
| `tokenVaultA`                  | writable |             |
| `tokenVaultB`                  | writable |             |
| `tokenDestinationA`            | writable |             |
| `tokenDestinationB`            | writable |             |
| `tokenProgramA`                | readonly |             |
| `tokenProgramB`                | readonly |             |
| `memoProgram`                  | readonly |             |

**Arguments:**

| Argument                | Type                                              | Description |
| ----------------------- | ------------------------------------------------- | ----------- | --- |
| `discriminator`         | `unknown`                                         |             |
| `remainingAccountsInfo` | [remainingAccountsInfo](#remainingAccountsInfo-3) | null        |     |

### collectRewardV2

**Accounts:**

| Account                | Type     | Description |
| ---------------------- | -------- | ----------- |
| `whirlpool`            | readonly |             |
| `positionAuthority`    | signer   |             |
| `position`             | writable |             |
| `positionTokenAccount` | readonly |             |
| `rewardOwnerAccount`   | writable |             |
| `rewardMint`           | readonly |             |
| `rewardVault`          | writable |             |
| `rewardTokenProgram`   | readonly |             |
| `memoProgram`          | readonly |             |

**Arguments:**

| Argument                | Type                                              | Description |
| ----------------------- | ------------------------------------------------- | ----------- | --- |
| `discriminator`         | `unknown`                                         |             |
| `rewardIndex`           | `u8`                                              |             |
| `remainingAccountsInfo` | [remainingAccountsInfo](#remainingAccountsInfo-3) | null        |     |

### decreaseLiquidityV2

**Accounts:**

| Account                | Type     | Description |
| ---------------------- | -------- | ----------- |
| `whirlpool`            | writable |             |
| `tokenProgramA`        | readonly |             |
| `tokenProgramB`        | readonly |             |
| `memoProgram`          | readonly |             |
| `positionAuthority`    | signer   |             |
| `position`             | writable |             |
| `positionTokenAccount` | readonly |             |
| `tokenMintA`           | readonly |             |
| `tokenMintB`           | readonly |             |
| `tokenOwnerAccountA`   | writable |             |
| `tokenOwnerAccountB`   | writable |             |
| `tokenVaultA`          | writable |             |
| `tokenVaultB`          | writable |             |
| `tickArrayLower`       | writable |             |
| `tickArrayUpper`       | writable |             |

**Arguments:**

| Argument                | Type                                              | Description |
| ----------------------- | ------------------------------------------------- | ----------- | --- |
| `discriminator`         | `unknown`                                         |             |
| `liquidityAmount`       | `u128`                                            |             |
| `tokenMinA`             | `u64`                                             |             |
| `tokenMinB`             | `u64`                                             |             |
| `remainingAccountsInfo` | [remainingAccountsInfo](#remainingAccountsInfo-3) | null        |     |

### increaseLiquidityV2

**Accounts:**

| Account                | Type     | Description |
| ---------------------- | -------- | ----------- |
| `whirlpool`            | writable |             |
| `tokenProgramA`        | readonly |             |
| `tokenProgramB`        | readonly |             |
| `memoProgram`          | readonly |             |
| `positionAuthority`    | signer   |             |
| `position`             | writable |             |
| `positionTokenAccount` | readonly |             |
| `tokenMintA`           | readonly |             |
| `tokenMintB`           | readonly |             |
| `tokenOwnerAccountA`   | writable |             |
| `tokenOwnerAccountB`   | writable |             |
| `tokenVaultA`          | writable |             |
| `tokenVaultB`          | writable |             |
| `tickArrayLower`       | writable |             |
| `tickArrayUpper`       | writable |             |

**Arguments:**

| Argument                | Type                                              | Description |
| ----------------------- | ------------------------------------------------- | ----------- | --- |
| `discriminator`         | `unknown`                                         |             |
| `liquidityAmount`       | `u128`                                            |             |
| `tokenMaxA`             | `u64`                                             |             |
| `tokenMaxB`             | `u64`                                             |             |
| `remainingAccountsInfo` | [remainingAccountsInfo](#remainingAccountsInfo-3) | null        |     |

### initializePoolV2

**Accounts:**

| Account            | Type             | Description |
| ------------------ | ---------------- | ----------- |
| `whirlpoolsConfig` | readonly         |             |
| `tokenMintA`       | readonly         |             |
| `tokenMintB`       | readonly         |             |
| `tokenBadgeA`      | readonly         |             |
| `tokenBadgeB`      | readonly         |             |
| `funder`           | signer, writable |             |
| `whirlpool`        | writable         |             |
| `tokenVaultA`      | signer, writable |             |
| `tokenVaultB`      | signer, writable |             |
| `feeTier`          | readonly         |             |
| `tokenProgramA`    | readonly         |             |
| `tokenProgramB`    | readonly         |             |
| `systemProgram`    | readonly         |             |
| `rent`             | readonly         |             |

**Arguments:**

| Argument           | Type      | Description |
| ------------------ | --------- | ----------- |
| `discriminator`    | `unknown` |             |
| `tickSpacing`      | `u16`     |             |
| `initialSqrtPrice` | `u128`    |             |

### initializeRewardV2

**Accounts:**

| Account              | Type             | Description |
| -------------------- | ---------------- | ----------- |
| `rewardAuthority`    | signer           |             |
| `funder`             | signer, writable |             |
| `whirlpool`          | writable         |             |
| `rewardMint`         | readonly         |             |
| `rewardTokenBadge`   | readonly         |             |
| `rewardVault`        | signer, writable |             |
| `rewardTokenProgram` | readonly         |             |
| `systemProgram`      | readonly         |             |
| `rent`               | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `rewardIndex`   | `u8`      |             |

### setRewardEmissionsV2

**Accounts:**

| Account           | Type     | Description |
| ----------------- | -------- | ----------- |
| `whirlpool`       | writable |             |
| `rewardAuthority` | signer   |             |
| `rewardVault`     | readonly |             |

**Arguments:**

| Argument                | Type      | Description |
| ----------------------- | --------- | ----------- |
| `discriminator`         | `unknown` |             |
| `rewardIndex`           | `u8`      |             |
| `emissionsPerSecondX64` | `u128`    |             |

### swapV2

**Accounts:**

| Account              | Type     | Description |
| -------------------- | -------- | ----------- |
| `tokenProgramA`      | readonly |             |
| `tokenProgramB`      | readonly |             |
| `memoProgram`        | readonly |             |
| `tokenAuthority`     | signer   |             |
| `whirlpool`          | writable |             |
| `tokenMintA`         | readonly |             |
| `tokenMintB`         | readonly |             |
| `tokenOwnerAccountA` | writable |             |
| `tokenVaultA`        | writable |             |
| `tokenOwnerAccountB` | writable |             |
| `tokenVaultB`        | writable |             |
| `tickArray0`         | writable |             |
| `tickArray1`         | writable |             |
| `tickArray2`         | writable |             |
| `oracle`             | writable |             |

**Arguments:**

| Argument                 | Type                                              | Description |
| ------------------------ | ------------------------------------------------- | ----------- | --- |
| `discriminator`          | `unknown`                                         |             |
| `amount`                 | `u64`                                             |             |
| `otherAmountThreshold`   | `u64`                                             |             |
| `sqrtPriceLimit`         | `u128`                                            |             |
| `amountSpecifiedIsInput` | `boolean`                                         |             |
| `aToB`                   | `boolean`                                         |             |
| `remainingAccountsInfo`  | [remainingAccountsInfo](#remainingAccountsInfo-3) | null        |     |

### twoHopSwapV2

**Accounts:**

| Account                     | Type     | Description |
| --------------------------- | -------- | ----------- |
| `whirlpoolOne`              | writable |             |
| `whirlpoolTwo`              | writable |             |
| `tokenMintInput`            | readonly |             |
| `tokenMintIntermediate`     | readonly |             |
| `tokenMintOutput`           | readonly |             |
| `tokenProgramInput`         | readonly |             |
| `tokenProgramIntermediate`  | readonly |             |
| `tokenProgramOutput`        | readonly |             |
| `tokenOwnerAccountInput`    | writable |             |
| `tokenVaultOneInput`        | writable |             |
| `tokenVaultOneIntermediate` | writable |             |
| `tokenVaultTwoIntermediate` | writable |             |
| `tokenVaultTwoOutput`       | writable |             |
| `tokenOwnerAccountOutput`   | writable |             |
| `tokenAuthority`            | signer   |             |
| `tickArrayOne0`             | writable |             |
| `tickArrayOne1`             | writable |             |
| `tickArrayOne2`             | writable |             |
| `tickArrayTwo0`             | writable |             |
| `tickArrayTwo1`             | writable |             |
| `tickArrayTwo2`             | writable |             |
| `oracleOne`                 | writable |             |
| `oracleTwo`                 | writable |             |
| `memoProgram`               | readonly |             |

**Arguments:**

| Argument                 | Type                                              | Description |
| ------------------------ | ------------------------------------------------- | ----------- | --- |
| `discriminator`          | `unknown`                                         |             |
| `amount`                 | `u64`                                             |             |
| `otherAmountThreshold`   | `u64`                                             |             |
| `amountSpecifiedIsInput` | `boolean`                                         |             |
| `aToBOne`                | `boolean`                                         |             |
| `aToBTwo`                | `boolean`                                         |             |
| `sqrtPriceLimitOne`      | `u128`                                            |             |
| `sqrtPriceLimitTwo`      | `u128`                                            |             |
| `remainingAccountsInfo`  | [remainingAccountsInfo](#remainingAccountsInfo-3) | null        |     |

### initializeConfigExtension

**Accounts:**

| Account           | Type             | Description |
| ----------------- | ---------------- | ----------- |
| `config`          | readonly         |             |
| `configExtension` | writable         |             |
| `funder`          | signer, writable |             |
| `feeAuthority`    | signer           |             |
| `systemProgram`   | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### setConfigExtensionAuthority

**Accounts:**

| Account                       | Type     | Description |
| ----------------------------- | -------- | ----------- |
| `whirlpoolsConfig`            | readonly |             |
| `whirlpoolsConfigExtension`   | writable |             |
| `configExtensionAuthority`    | signer   |             |
| `newConfigExtensionAuthority` | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### setTokenBadgeAuthority

**Accounts:**

| Account                     | Type     | Description |
| --------------------------- | -------- | ----------- |
| `whirlpoolsConfig`          | readonly |             |
| `whirlpoolsConfigExtension` | writable |             |
| `configExtensionAuthority`  | signer   |             |
| `newTokenBadgeAuthority`    | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### initializeTokenBadge

**Accounts:**

| Account                     | Type             | Description |
| --------------------------- | ---------------- | ----------- |
| `whirlpoolsConfig`          | readonly         |             |
| `whirlpoolsConfigExtension` | readonly         |             |
| `tokenBadgeAuthority`       | signer           |             |
| `tokenMint`                 | readonly         |             |
| `tokenBadge`                | writable         |             |
| `funder`                    | signer, writable |             |
| `systemProgram`             | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### deleteTokenBadge

**Accounts:**

| Account                     | Type     | Description |
| --------------------------- | -------- | ----------- |
| `whirlpoolsConfig`          | readonly |             |
| `whirlpoolsConfigExtension` | readonly |             |
| `tokenBadgeAuthority`       | signer   |             |
| `tokenMint`                 | readonly |             |
| `tokenBadge`                | writable |             |
| `receiver`                  | writable |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

## Types

### lockType

**Definition:**

```typescript
| { kind: "permanent" }
```

### lockTypeLabel

**Definition:**

```typescript
| { kind: "permanent" }
```

### openPositionBumps

**Definition:**

```typescript
{
  positionBump: bigint;
}
```

### openPositionWithMetadataBumps

**Definition:**

```typescript
{
  positionBump: bigint;
  metadataBump: bigint;
}
```

### positionRewardInfo

**Definition:**

```typescript
{
  growthInsideCheckpoint: bigint;
  amountOwed: bigint;
}
```

### tick

**Definition:**

```typescript
{
  initialized: boolean;
  liquidityNet: bigint;
  liquidityGross: bigint;
  feeGrowthOutsideA: bigint;
  feeGrowthOutsideB: bigint;
  rewardGrowthsOutside: bigint[3];
}
```

### whirlpoolBumps

**Definition:**

```typescript
{
  whirlpoolBump: bigint;
}
```

### whirlpoolRewardInfo

**Definition:**

```typescript
{
  mint: PublicKey;
  vault: PublicKey;
  authority: PublicKey;
  emissionsPerSecondX64: bigint;
  growthGlobalX64: bigint;
}
```

### accountsType

**Definition:**

```typescript
| { kind: "transferHookA" }
  | { kind: "transferHookB" }
  | { kind: "transferHookReward" }
  | { kind: "transferHookInput" }
  | { kind: "transferHookIntermediate" }
  | { kind: "transferHookOutput" }
  | { kind: "supplementalTickArrays" }
  | { kind: "supplementalTickArraysOne" }
  | { kind: "supplementalTickArraysTwo" }
```

### remainingAccountsInfo

**Definition:**

```typescript
{
  slices: remainingAccountsSlice[];
}
```

### remainingAccountsSlice

**Definition:**

```typescript
{
  accountsType: accountsType;
  length: bigint;
}
```

## Errors

- **6000 - InvalidEnum**: Enum value could not be converted _(Hex: `0x1770`)_
- **6001 - InvalidStartTick**: Invalid start tick index provided. _(Hex: `0x1771`)_
- **6002 - TickArrayExistInPool**: Tick-array already exists in this whirlpool _(Hex: `0x1772`)_
- **6003 - TickArrayIndexOutofBounds**: Attempt to search for a tick-array failed _(Hex: `0x1773`)_
- **6004 - InvalidTickSpacing**: Tick-spacing is not supported _(Hex: `0x1774`)_
- **6005 - ClosePositionNotEmpty**: Position is not empty It cannot be closed _(Hex: `0x1775`)_
- **6006 - DivideByZero**: Unable to divide by zero _(Hex: `0x1776`)_
- **6007 - NumberCastError**: Unable to cast number into BigInt _(Hex: `0x1777`)_
- **6008 - NumberDownCastError**: Unable to down cast number _(Hex: `0x1778`)_
- **6009 - TickNotFound**: Tick not found within tick array _(Hex: `0x1779`)_
- **6010 - InvalidTickIndex**: Provided tick index is either out of bounds or uninitializable _(Hex: `0x177a`)_
- **6011 - SqrtPriceOutOfBounds**: Provided sqrt price out of bounds _(Hex: `0x177b`)_
- **6012 - LiquidityZero**: Liquidity amount must be greater than zero _(Hex: `0x177c`)_
- **6013 - LiquidityTooHigh**: Liquidity amount must be less than i64::MAX _(Hex: `0x177d`)_
- **6014 - LiquidityOverflow**: Liquidity overflow _(Hex: `0x177e`)_
- **6015 - LiquidityUnderflow**: Liquidity underflow _(Hex: `0x177f`)_
- **6016 - LiquidityNetError**: Tick liquidity net underflowed or overflowed _(Hex: `0x1780`)_
- **6017 - TokenMaxExceeded**: Exceeded token max _(Hex: `0x1781`)_
- **6018 - TokenMinSubceeded**: Did not meet token min _(Hex: `0x1782`)_
- **6019 - MissingOrInvalidDelegate**: Position token account has a missing or invalid delegate _(Hex: `0x1783`)_
- **6020 - InvalidPositionTokenAmount**: Position token amount must be 1 _(Hex: `0x1784`)_
- **6021 - InvalidTimestampConversion**: Timestamp should be convertible from i64 to u64 _(Hex: `0x1785`)_
- **6022 - InvalidTimestamp**: Timestamp should be greater than the last updated timestamp _(Hex: `0x1786`)_
- **6023 - InvalidTickArraySequence**: Invalid tick array sequence provided for instruction. _(Hex: `0x1787`)_
- **6024 - InvalidTokenMintOrder**: Token Mint in wrong order _(Hex: `0x1788`)_
- **6025 - RewardNotInitialized**: Reward not initialized _(Hex: `0x1789`)_
- **6026 - InvalidRewardIndex**: Invalid reward index _(Hex: `0x178a`)_
- **6027 - RewardVaultAmountInsufficient**: Reward vault requires amount to support emissions for at least one day _(Hex: `0x178b`)_
- **6028 - FeeRateMaxExceeded**: Exceeded max fee rate _(Hex: `0x178c`)_
- **6029 - ProtocolFeeRateMaxExceeded**: Exceeded max protocol fee rate _(Hex: `0x178d`)_
- **6030 - MultiplicationShiftRightOverflow**: Multiplication with shift right overflow _(Hex: `0x178e`)_
- **6031 - MulDivOverflow**: Muldiv overflow _(Hex: `0x178f`)_
- **6032 - MulDivInvalidInput**: Invalid div_u256 input _(Hex: `0x1790`)_
- **6033 - MultiplicationOverflow**: Multiplication overflow _(Hex: `0x1791`)_
- **6034 - InvalidSqrtPriceLimitDirection**: Provided SqrtPriceLimit not in the same direction as the swap. _(Hex: `0x1792`)_
- **6035 - ZeroTradableAmount**: There are no tradable amount to swap. _(Hex: `0x1793`)_
- **6036 - AmountOutBelowMinimum**: Amount out below minimum threshold _(Hex: `0x1794`)_
- **6037 - AmountInAboveMaximum**: Amount in above maximum threshold _(Hex: `0x1795`)_
- **6038 - TickArraySequenceInvalidIndex**: Invalid index for tick array sequence _(Hex: `0x1796`)_
- **6039 - AmountCalcOverflow**: Amount calculated overflows _(Hex: `0x1797`)_
- **6040 - AmountRemainingOverflow**: Amount remaining overflows _(Hex: `0x1798`)_
- **6041 - InvalidIntermediaryMint**: Invalid intermediary mint _(Hex: `0x1799`)_
- **6042 - DuplicateTwoHopPool**: Duplicate two hop pool _(Hex: `0x179a`)_
- **6043 - InvalidBundleIndex**: Bundle index is out of bounds _(Hex: `0x179b`)_
- **6044 - BundledPositionAlreadyOpened**: Position has already been opened _(Hex: `0x179c`)_
- **6045 - BundledPositionAlreadyClosed**: Position has already been closed _(Hex: `0x179d`)_
- **6046 - PositionBundleNotDeletable**: Unable to delete PositionBundle with open positions _(Hex: `0x179e`)_
- **6047 - UnsupportedTokenMint**: Token mint has unsupported attributes _(Hex: `0x179f`)_
- **6048 - RemainingAccountsInvalidSlice**: Invalid remaining accounts _(Hex: `0x17a0`)_
- **6049 - RemainingAccountsInsufficient**: Insufficient remaining accounts _(Hex: `0x17a1`)_
- **6050 - NoExtraAccountsForTransferHook**: Unable to call transfer hook without extra accounts _(Hex: `0x17a2`)_
- **6051 - IntermediateTokenAmountMismatch**: Output and input amount mismatch _(Hex: `0x17a3`)_
- **6052 - TransferFeeCalculationError**: Transfer fee calculation failed _(Hex: `0x17a4`)_
- **6053 - RemainingAccountsDuplicatedAccountsType**: Same accounts type is provided more than once _(Hex: `0x17a5`)_
- **6054 - FullRangeOnlyPool**: This whirlpool only supports full-range positions _(Hex: `0x17a6`)_
- **6055 - TooManySupplementalTickArrays**: Too many supplemental tick arrays provided _(Hex: `0x17a7`)_
- **6056 - DifferentWhirlpoolTickArrayAccount**: TickArray account for different whirlpool provided _(Hex: `0x17a8`)_
- **6057 - PartialFillError**: Trade resulted in partial fill _(Hex: `0x17a9`)_
- **6058 - PositionNotLockable**: Position is not lockable _(Hex: `0x17aa`)_
- **6059 - OperationNotAllowedOnLockedPosition**: Operation not allowed on locked position _(Hex: `0x17ab`)_
