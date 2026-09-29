# Cp Amm Program

[![npm version](https://badge.fury.io/js/%40solana-programs%2Fmeteora-damm-v2.svg)](https://www.npmjs.com/package/%40solana-programs%2Fmeteora-damm-v2)

- Program ID: `cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG`
- TypeScript Client: [`@solana-programs/meteora-damm-v2`](https://www.npmjs.com/package/@solana-programs/meteora-damm-v2)

## Table of Contents

- [Accounts](#accounts)
  - [claimFeeOperator](#claimFeeOperator)
  - [config](#config)
  - [pool](#pool)
  - [position](#position)
  - [tokenBadge](#tokenBadge)
  - [vesting](#vesting)
- [Instructions](#instructions)
  - [addLiquidity](#addLiquidity)
  - [claimPartnerFee](#claimPartnerFee)
  - [claimPositionFee](#claimPositionFee)
  - [claimProtocolFee](#claimProtocolFee)
  - [claimReward](#claimReward)
  - [closeClaimFeeOperator](#closeClaimFeeOperator)
  - [closeConfig](#closeConfig)
  - [closePosition](#closePosition)
  - [closeTokenBadge](#closeTokenBadge)
  - [createClaimFeeOperator](#createClaimFeeOperator)
  - [createConfig](#createConfig)
  - [createDynamicConfig](#createDynamicConfig)
  - [createPosition](#createPosition)
  - [createTokenBadge](#createTokenBadge)
  - [fundReward](#fundReward)
  - [initializeCustomizablePool](#initializeCustomizablePool)
  - [initializePool](#initializePool)
  - [initializePoolWithDynamicConfig](#initializePoolWithDynamicConfig)
  - [initializeReward](#initializeReward)
  - [lockPosition](#lockPosition)
  - [permanentLockPosition](#permanentLockPosition)
  - [refreshVesting](#refreshVesting)
  - [removeAllLiquidity](#removeAllLiquidity)
  - [removeLiquidity](#removeLiquidity)
  - [setPoolStatus](#setPoolStatus)
  - [splitPosition](#splitPosition)
  - [splitPosition2](#splitPosition2)
  - [swap](#swap)
  - [swap2](#swap2)
  - [updateRewardDuration](#updateRewardDuration)
  - [updateRewardFunder](#updateRewardFunder)
  - [withdrawIneligibleReward](#withdrawIneligibleReward)
- [PDAs](#pdas)
  - [poolAuthority](#poolAuthority)
  - [config](#config)
  - [pool](#pool)
  - [position](#position)
  - [tokenVault](#tokenVault)
  - [rewardVault](#rewardVault)
  - [customizablePool](#customizablePool)
  - [tokenBadge](#tokenBadge)
  - [claimFeeOperator](#claimFeeOperator)
  - [positionNftAccount](#positionNftAccount)
  - [eventAuthority](#eventAuthority)
- [Types](#types)
  - [addLiquidityParameters](#addLiquidityParameters)
  - [baseFeeConfig](#baseFeeConfig)
  - [baseFeeParameters](#baseFeeParameters)
  - [baseFeeStruct](#baseFeeStruct)
  - [dynamicConfigParameters](#dynamicConfigParameters)
  - [dynamicFeeConfig](#dynamicFeeConfig)
  - [dynamicFeeParameters](#dynamicFeeParameters)
  - [dynamicFeeStruct](#dynamicFeeStruct)
  - [initializeCustomizablePoolParameters](#initializeCustomizablePoolParameters)
  - [initializePoolParameters](#initializePoolParameters)
  - [poolFeeParameters](#poolFeeParameters)
  - [poolFeesConfig](#poolFeesConfig)
  - [poolFeesStruct](#poolFeesStruct)
  - [poolMetrics](#poolMetrics)
  - [positionMetrics](#positionMetrics)
  - [removeLiquidityParameters](#removeLiquidityParameters)
  - [rewardInfo](#rewardInfo)
  - [splitAmountInfo](#splitAmountInfo)
  - [splitPositionInfo](#splitPositionInfo)
  - [splitPositionParameters](#splitPositionParameters)
  - [splitPositionParameters2](#splitPositionParameters2)
  - [staticConfigParameters](#staticConfigParameters)
  - [swapParameters](#swapParameters)
  - [swapParameters2](#swapParameters2)
  - [swapResult](#swapResult)
  - [swapResult2](#swapResult2)
  - [userRewardInfo](#userRewardInfo)
  - [vestingParameters](#vestingParameters)
  - [evtAddLiquidity](#evtAddLiquidity)
  - [evtClaimPartnerFee](#evtClaimPartnerFee)
  - [evtClaimPositionFee](#evtClaimPositionFee)
  - [evtClaimProtocolFee](#evtClaimProtocolFee)
  - [evtClaimReward](#evtClaimReward)
  - [evtCloseClaimFeeOperator](#evtCloseClaimFeeOperator)
  - [evtCloseConfig](#evtCloseConfig)
  - [evtClosePosition](#evtClosePosition)
  - [evtCreateClaimFeeOperator](#evtCreateClaimFeeOperator)
  - [evtCreateConfig](#evtCreateConfig)
  - [evtCreateDynamicConfig](#evtCreateDynamicConfig)
  - [evtCreatePosition](#evtCreatePosition)
  - [evtCreateTokenBadge](#evtCreateTokenBadge)
  - [evtFundReward](#evtFundReward)
  - [evtInitializePool](#evtInitializePool)
  - [evtInitializeReward](#evtInitializeReward)
  - [evtLiquidityChange](#evtLiquidityChange)
  - [evtLockPosition](#evtLockPosition)
  - [evtPermanentLockPosition](#evtPermanentLockPosition)
  - [evtRemoveLiquidity](#evtRemoveLiquidity)
  - [evtSetPoolStatus](#evtSetPoolStatus)
  - [evtSplitPosition2](#evtSplitPosition2)
  - [evtSwap](#evtSwap)
  - [evtSwap2](#evtSwap2)
  - [evtUpdateRewardDuration](#evtUpdateRewardDuration)
  - [evtUpdateRewardFunder](#evtUpdateRewardFunder)
  - [evtWithdrawIneligibleReward](#evtWithdrawIneligibleReward)
- [Errors](#errors)

## Accounts

### claimFeeOperator

**Fields:**

| Field           | Type        | Description |
| --------------- | ----------- | ----------- |
| `discriminator` | `unknown`   | -           |
| `operator`      | `PublicKey` | operator    |
| `padding`       | `u8`[128]   | Reserve     |

### config

**Fields:**

| Field                  | Type                                | Description                                                                                                                     |
| ---------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator`        | `unknown`                           | -                                                                                                                               |
| `vaultConfigKey`       | `PublicKey`                         | Vault config key                                                                                                                |
| `poolCreatorAuthority` | `PublicKey`                         | Only pool_creator_authority can use the current config to initialize new pool. When it's Pubkey::default, it's a public config. |
| `poolFees`             | [poolFeesConfig](#poolFeesConfig-3) | Pool fee                                                                                                                        |
| `activationType`       | `u8`                                | Activation type                                                                                                                 |
| `collectFeeMode`       | `u8`                                | Collect fee mode                                                                                                                |
| `configType`           | `u8`                                | Config type mode, 0 for static, 1 for dynamic                                                                                   |
| `padding0`             | `u8`[5]                             | padding 0                                                                                                                       |
| `index`                | `u64`                               | config index                                                                                                                    |
| `sqrtMinPrice`         | `u128`                              | sqrt min price                                                                                                                  |
| `sqrtMaxPrice`         | `u128`                              | sqrt max price                                                                                                                  |
| `padding1`             | `u64`[10]                           | Fee curve point Padding for further use                                                                                         |

### pool

**Fields:**

| Field                    | Type                                | Description                                                                                  |
| ------------------------ | ----------------------------------- | -------------------------------------------------------------------------------------------- |
| `discriminator`          | `unknown`                           | -                                                                                            |
| `poolFees`               | [poolFeesStruct](#poolFeesStruct-3) | Pool fee                                                                                     |
| `tokenAMint`             | `PublicKey`                         | token a mint                                                                                 |
| `tokenBMint`             | `PublicKey`                         | token b mint                                                                                 |
| `tokenAVault`            | `PublicKey`                         | token a vault                                                                                |
| `tokenBVault`            | `PublicKey`                         | token b vault                                                                                |
| `whitelistedVault`       | `PublicKey`                         | Whitelisted vault to be able to buy pool before activation_point                             |
| `partner`                | `PublicKey`                         | partner                                                                                      |
| `liquidity`              | `u128`                              | liquidity share                                                                              |
| `padding`                | `u128`                              | padding, previous reserve amount, be careful to use that field                               |
| `protocolAFee`           | `u64`                               | protocol a fee                                                                               |
| `protocolBFee`           | `u64`                               | protocol b fee                                                                               |
| `partnerAFee`            | `u64`                               | partner a fee                                                                                |
| `partnerBFee`            | `u64`                               | partner b fee                                                                                |
| `sqrtMinPrice`           | `u128`                              | min price                                                                                    |
| `sqrtMaxPrice`           | `u128`                              | max price                                                                                    |
| `sqrtPrice`              | `u128`                              | current price                                                                                |
| `activationPoint`        | `u64`                               | Activation point, can be slot or timestamp                                                   |
| `activationType`         | `u8`                                | Activation type, 0 means by slot, 1 means by timestamp                                       |
| `poolStatus`             | `u8`                                | pool status, 0: enable, 1 disable                                                            |
| `tokenAFlag`             | `u8`                                | token a flag                                                                                 |
| `tokenBFlag`             | `u8`                                | token b flag                                                                                 |
| `collectFeeMode`         | `u8`                                | 0 is collect fee in both token, 1 only collect fee in token a, 2 only collect fee in token b |
| `poolType`               | `u8`                                | pool type                                                                                    |
| `version`                | `u8`                                | pool version, 0: max_fee is still capped at 50%, 1: max_fee is capped at 99%                 |
| `padding0`               | `u8`                                | padding                                                                                      |
| `feeAPerLiquidity`       | `u8`[32]                            | cumulative                                                                                   |
| `feeBPerLiquidity`       | `u8`[32]                            | cumulative                                                                                   |
| `permanentLockLiquidity` | `u128`                              | -                                                                                            |
| `metrics`                | [poolMetrics](#poolMetrics-3)       | metrics                                                                                      |
| `creator`                | `PublicKey`                         | pool creator                                                                                 |
| `padding1`               | `u64`[6]                            | Padding for further use                                                                      |
| `rewardInfos`            | [rewardInfo](#rewardInfo-3)[2]      | Farming reward information                                                                   |

### position

**Fields:**

| Field                      | Type                                   | Description                |
| -------------------------- | -------------------------------------- | -------------------------- |
| `discriminator`            | `unknown`                              | -                          |
| `pool`                     | `PublicKey`                            | -                          |
| `nftMint`                  | `PublicKey`                            | nft mint                   |
| `feeAPerTokenCheckpoint`   | `u8`[32]                               | fee a checkpoint           |
| `feeBPerTokenCheckpoint`   | `u8`[32]                               | fee b checkpoint           |
| `feeAPending`              | `u64`                                  | fee a pending              |
| `feeBPending`              | `u64`                                  | fee b pending              |
| `unlockedLiquidity`        | `u128`                                 | unlock liquidity           |
| `vestedLiquidity`          | `u128`                                 | vesting liquidity          |
| `permanentLockedLiquidity` | `u128`                                 | permanent locked liquidity |
| `metrics`                  | [positionMetrics](#positionMetrics-3)  | metrics                    |
| `rewardInfos`              | [userRewardInfo](#userRewardInfo-3)[2] | Farming reward information |
| `padding`                  | `u128`[6]                              | padding for future usage   |

### tokenBadge

**Fields:**

| Field           | Type        | Description |
| --------------- | ----------- | ----------- |
| `discriminator` | `unknown`   | -           |
| `tokenMint`     | `PublicKey` | token mint  |
| `padding`       | `u8`[128]   | Reserve     |

### vesting

**Fields:**

| Field                    | Type        | Description |
| ------------------------ | ----------- | ----------- |
| `discriminator`          | `unknown`   | -           |
| `position`               | `PublicKey` | -           |
| `cliffPoint`             | `u64`       | -           |
| `periodFrequency`        | `u64`       | -           |
| `cliffUnlockLiquidity`   | `u128`      | -           |
| `liquidityPerPeriod`     | `u128`      | -           |
| `totalReleasedLiquidity` | `u128`      | -           |
| `numberOfPeriod`         | `u16`       | -           |
| `padding`                | `u8`[14]    | -           |
| `padding2`               | `u128`[4]   | -           |

## Instructions

### addLiquidity

**Accounts:**

| Account              | Type     | Description                              |
| -------------------- | -------- | ---------------------------------------- |
| `pool`               | writable | -                                        |
| `position`           | writable | -                                        |
| `tokenAAccount`      | writable | The user token a account                 |
| `tokenBAccount`      | writable | The user token b account                 |
| `tokenAVault`        | writable | The vault token account for input token  |
| `tokenBVault`        | writable | The vault token account for output token |
| `tokenAMint`         | readonly | The mint of token a                      |
| `tokenBMint`         | readonly | The mint of token b                      |
| `positionNftAccount` | readonly | The token account for nft                |
| `owner`              | signer   | owner of position                        |
| `tokenAProgram`      | readonly | Token a program                          |
| `tokenBProgram`      | readonly | Token b program                          |
| `eventAuthority`     | readonly | -                                        |
| `program`            | readonly | -                                        |

**Arguments:**

| Argument        | Type                                                | Description |
| --------------- | --------------------------------------------------- | ----------- |
| `discriminator` | `unknown`                                           | -           |
| `params`        | [addLiquidityParameters](#addLiquidityParameters-3) | -           |

### claimPartnerFee

**Accounts:**

| Account          | Type     | Description                              |
| ---------------- | -------- | ---------------------------------------- |
| `poolAuthority`  | readonly | -                                        |
| `pool`           | writable | -                                        |
| `tokenAAccount`  | writable | The treasury token a account             |
| `tokenBAccount`  | writable | The treasury token b account             |
| `tokenAVault`    | writable | The vault token account for input token  |
| `tokenBVault`    | writable | The vault token account for output token |
| `tokenAMint`     | readonly | The mint of token a                      |
| `tokenBMint`     | readonly | The mint of token b                      |
| `partner`        | signer   | -                                        |
| `tokenAProgram`  | readonly | Token a program                          |
| `tokenBProgram`  | readonly | Token b program                          |
| `eventAuthority` | readonly | -                                        |
| `program`        | readonly | -                                        |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `maxAmountA`    | `u64`     | -           |
| `maxAmountB`    | `u64`     | -           |

### claimPositionFee

**Accounts:**

| Account              | Type     | Description                              |
| -------------------- | -------- | ---------------------------------------- |
| `poolAuthority`      | readonly | -                                        |
| `pool`               | readonly | -                                        |
| `position`           | writable | -                                        |
| `tokenAAccount`      | writable | The user token a account                 |
| `tokenBAccount`      | writable | The user token b account                 |
| `tokenAVault`        | writable | The vault token account for input token  |
| `tokenBVault`        | writable | The vault token account for output token |
| `tokenAMint`         | readonly | The mint of token a                      |
| `tokenBMint`         | readonly | The mint of token b                      |
| `positionNftAccount` | readonly | The token account for nft                |
| `owner`              | signer   | owner of position                        |
| `tokenAProgram`      | readonly | Token a program                          |
| `tokenBProgram`      | readonly | Token b program                          |
| `eventAuthority`     | readonly | -                                        |
| `program`            | readonly | -                                        |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### claimProtocolFee

**Accounts:**

| Account            | Type     | Description                              |
| ------------------ | -------- | ---------------------------------------- |
| `poolAuthority`    | readonly | -                                        |
| `pool`             | writable | -                                        |
| `tokenAVault`      | writable | The vault token account for input token  |
| `tokenBVault`      | writable | The vault token account for output token |
| `tokenAMint`       | readonly | The mint of token a                      |
| `tokenBMint`       | readonly | The mint of token b                      |
| `tokenAAccount`    | writable | The treasury token a account             |
| `tokenBAccount`    | writable | The treasury token b account             |
| `claimFeeOperator` | readonly | Claim fee operator                       |
| `operator`         | signer   | Operator                                 |
| `tokenAProgram`    | readonly | Token a program                          |
| `tokenBProgram`    | readonly | Token b program                          |
| `eventAuthority`   | readonly | -                                        |
| `program`          | readonly | -                                        |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `maxAmountA`    | `u64`     | -           |
| `maxAmountB`    | `u64`     | -           |

### claimReward

**Accounts:**

| Account              | Type     | Description                              |
| -------------------- | -------- | ---------------------------------------- |
| `poolAuthority`      | readonly | -                                        |
| `pool`               | writable | -                                        |
| `position`           | writable | -                                        |
| `rewardVault`        | writable | The vault token account for reward token |
| `rewardMint`         | readonly | -                                        |
| `userTokenAccount`   | writable | -                                        |
| `positionNftAccount` | readonly | The token account for nft                |
| `owner`              | signer   | owner of position                        |
| `tokenProgram`       | readonly | -                                        |
| `eventAuthority`     | readonly | -                                        |
| `program`            | readonly | -                                        |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `rewardIndex`   | `u8`      | -           |
| `skipReward`    | `u8`      | -           |

### closeClaimFeeOperator

**Accounts:**

| Account            | Type     | Description |
| ------------------ | -------- | ----------- |
| `claimFeeOperator` | writable | -           |
| `rentReceiver`     | writable | -           |
| `admin`            | signer   | -           |
| `eventAuthority`   | readonly | -           |
| `program`          | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### closeConfig

**Accounts:**

| Account          | Type             | Description |
| ---------------- | ---------------- | ----------- |
| `config`         | writable         | -           |
| `admin`          | signer, writable | -           |
| `rentReceiver`   | writable         | -           |
| `eventAuthority` | readonly         | -           |
| `program`        | readonly         | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### closePosition

**Accounts:**

| Account              | Type     | Description                                                               |
| -------------------- | -------- | ------------------------------------------------------------------------- |
| `positionNftMint`    | writable | position_nft_mint                                                         |
| `positionNftAccount` | writable | The token account for nft                                                 |
| `pool`               | writable | -                                                                         |
| `position`           | writable | -                                                                         |
| `poolAuthority`      | readonly | -                                                                         |
| `rentReceiver`       | writable | -                                                                         |
| `owner`              | signer   | Owner of position                                                         |
| `tokenProgram`       | readonly | Program to create NFT mint/token account and transfer for token22 account |
| `eventAuthority`     | readonly | -                                                                         |
| `program`            | readonly | -                                                                         |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### closeTokenBadge

**Accounts:**

| Account          | Type             | Description |
| ---------------- | ---------------- | ----------- |
| `tokenBadge`     | writable         | -           |
| `admin`          | signer, writable | -           |
| `rentReceiver`   | writable         | -           |
| `eventAuthority` | readonly         | -           |
| `program`        | readonly         | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### createClaimFeeOperator

**Accounts:**

| Account            | Type             | Description |
| ------------------ | ---------------- | ----------- |
| `claimFeeOperator` | writable         | -           |
| `operator`         | readonly         | -           |
| `admin`            | signer, writable | -           |
| `systemProgram`    | readonly         | -           |
| `eventAuthority`   | readonly         | -           |
| `program`          | readonly         | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### createConfig

ADMIN FUNCTIONS /////

**Accounts:**

| Account          | Type             | Description |
| ---------------- | ---------------- | ----------- |
| `config`         | writable         | -           |
| `admin`          | signer, writable | -           |
| `systemProgram`  | readonly         | -           |
| `eventAuthority` | readonly         | -           |
| `program`        | readonly         | -           |

**Arguments:**

| Argument           | Type                                                | Description |
| ------------------ | --------------------------------------------------- | ----------- |
| `discriminator`    | `unknown`                                           | -           |
| `index`            | `u64`                                               | -           |
| `configParameters` | [staticConfigParameters](#staticConfigParameters-3) | -           |

### createDynamicConfig

**Accounts:**

| Account          | Type             | Description |
| ---------------- | ---------------- | ----------- |
| `config`         | writable         | -           |
| `admin`          | signer, writable | -           |
| `systemProgram`  | readonly         | -           |
| `eventAuthority` | readonly         | -           |
| `program`        | readonly         | -           |

**Arguments:**

| Argument           | Type                                                  | Description |
| ------------------ | ----------------------------------------------------- | ----------- |
| `discriminator`    | `unknown`                                             | -           |
| `index`            | `u64`                                                 | -           |
| `configParameters` | [dynamicConfigParameters](#dynamicConfigParameters-3) | -           |

### createPosition

**Accounts:**

| Account              | Type             | Description                                                               |
| -------------------- | ---------------- | ------------------------------------------------------------------------- |
| `owner`              | readonly         | -                                                                         |
| `positionNftMint`    | signer, writable | position_nft_mint                                                         |
| `positionNftAccount` | writable         | position nft account                                                      |
| `pool`               | writable         | -                                                                         |
| `position`           | writable         | -                                                                         |
| `poolAuthority`      | readonly         | -                                                                         |
| `payer`              | signer, writable | Address paying to create the position. Can be anyone                      |
| `tokenProgram`       | readonly         | Program to create NFT mint/token account and transfer for token22 account |
| `systemProgram`      | readonly         | -                                                                         |
| `eventAuthority`     | readonly         | -                                                                         |
| `program`            | readonly         | -                                                                         |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### createTokenBadge

**Accounts:**

| Account          | Type             | Description |
| ---------------- | ---------------- | ----------- |
| `tokenBadge`     | writable         | -           |
| `tokenMint`      | readonly         | -           |
| `admin`          | signer, writable | -           |
| `systemProgram`  | readonly         | -           |
| `eventAuthority` | readonly         | -           |
| `program`        | readonly         | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### fundReward

**Accounts:**

| Account              | Type     | Description |
| -------------------- | -------- | ----------- |
| `pool`               | writable | -           |
| `rewardVault`        | writable | -           |
| `rewardMint`         | readonly | -           |
| `funderTokenAccount` | writable | -           |
| `funder`             | signer   | -           |
| `tokenProgram`       | readonly | -           |
| `eventAuthority`     | readonly | -           |
| `program`            | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `rewardIndex`   | `u8`      | -           |
| `amount`        | `u64`     | -           |
| `carryForward`  | `boolean` | -           |

### initializeCustomizablePool

**Accounts:**

| Account              | Type             | Description                                                               |
| -------------------- | ---------------- | ------------------------------------------------------------------------- |
| `creator`            | readonly         | -                                                                         |
| `positionNftMint`    | signer, writable | position_nft_mint                                                         |
| `positionNftAccount` | writable         | position nft account                                                      |
| `payer`              | signer, writable | Address paying to create the pool. Can be anyone                          |
| `poolAuthority`      | readonly         | -                                                                         |
| `pool`               | writable         | Initialize an account to store the pool state                             |
| `position`           | writable         | -                                                                         |
| `tokenAMint`         | readonly         | Token a mint                                                              |
| `tokenBMint`         | readonly         | Token b mint                                                              |
| `tokenAVault`        | writable         | Token a vault for the pool                                                |
| `tokenBVault`        | writable         | Token b vault for the pool                                                |
| `payerTokenA`        | writable         | payer token a account                                                     |
| `payerTokenB`        | writable         | creator token b account                                                   |
| `tokenAProgram`      | readonly         | Program to create mint account and mint tokens                            |
| `tokenBProgram`      | readonly         | Program to create mint account and mint tokens                            |
| `token2022Program`   | readonly         | Program to create NFT mint/token account and transfer for token22 account |
| `systemProgram`      | readonly         | -                                                                         |
| `eventAuthority`     | readonly         | -                                                                         |
| `program`            | readonly         | -                                                                         |

**Arguments:**

| Argument        | Type                                                                            | Description |
| --------------- | ------------------------------------------------------------------------------- | ----------- |
| `discriminator` | `unknown`                                                                       | -           |
| `params`        | [initializeCustomizablePoolParameters](#initializeCustomizablePoolParameters-3) | -           |

### initializePool

USER FUNCTIONS ////

**Accounts:**

| Account              | Type             | Description                                                               |
| -------------------- | ---------------- | ------------------------------------------------------------------------- |
| `creator`            | readonly         | -                                                                         |
| `positionNftMint`    | signer, writable | position_nft_mint                                                         |
| `positionNftAccount` | writable         | position nft account                                                      |
| `payer`              | signer, writable | Address paying to create the pool. Can be anyone                          |
| `config`             | readonly         | Which config the pool belongs to.                                         |
| `poolAuthority`      | readonly         | -                                                                         |
| `pool`               | writable         | Initialize an account to store the pool state                             |
| `position`           | writable         | -                                                                         |
| `tokenAMint`         | readonly         | Token a mint                                                              |
| `tokenBMint`         | readonly         | Token b mint                                                              |
| `tokenAVault`        | writable         | Token a vault for the pool                                                |
| `tokenBVault`        | writable         | Token b vault for the pool                                                |
| `payerTokenA`        | writable         | payer token a account                                                     |
| `payerTokenB`        | writable         | creator token b account                                                   |
| `tokenAProgram`      | readonly         | Program to create mint account and mint tokens                            |
| `tokenBProgram`      | readonly         | Program to create mint account and mint tokens                            |
| `token2022Program`   | readonly         | Program to create NFT mint/token account and transfer for token22 account |
| `systemProgram`      | readonly         | -                                                                         |
| `eventAuthority`     | readonly         | -                                                                         |
| `program`            | readonly         | -                                                                         |

**Arguments:**

| Argument        | Type                                                    | Description |
| --------------- | ------------------------------------------------------- | ----------- |
| `discriminator` | `unknown`                                               | -           |
| `params`        | [initializePoolParameters](#initializePoolParameters-3) | -           |

### initializePoolWithDynamicConfig

**Accounts:**

| Account                | Type             | Description                                                               |
| ---------------------- | ---------------- | ------------------------------------------------------------------------- |
| `creator`              | readonly         | -                                                                         |
| `positionNftMint`      | signer, writable | position_nft_mint                                                         |
| `positionNftAccount`   | writable         | position nft account                                                      |
| `payer`                | signer, writable | Address paying to create the pool. Can be anyone                          |
| `poolCreatorAuthority` | signer           | -                                                                         |
| `config`               | readonly         | Which config the pool belongs to.                                         |
| `poolAuthority`        | readonly         | -                                                                         |
| `pool`                 | writable         | Initialize an account to store the pool state                             |
| `position`             | writable         | -                                                                         |
| `tokenAMint`           | readonly         | Token a mint                                                              |
| `tokenBMint`           | readonly         | Token b mint                                                              |
| `tokenAVault`          | writable         | Token a vault for the pool                                                |
| `tokenBVault`          | writable         | Token b vault for the pool                                                |
| `payerTokenA`          | writable         | payer token a account                                                     |
| `payerTokenB`          | writable         | creator token b account                                                   |
| `tokenAProgram`        | readonly         | Program to create mint account and mint tokens                            |
| `tokenBProgram`        | readonly         | Program to create mint account and mint tokens                            |
| `token2022Program`     | readonly         | Program to create NFT mint/token account and transfer for token22 account |
| `systemProgram`        | readonly         | -                                                                         |
| `eventAuthority`       | readonly         | -                                                                         |
| `program`              | readonly         | -                                                                         |

**Arguments:**

| Argument        | Type                                                                            | Description |
| --------------- | ------------------------------------------------------------------------------- | ----------- |
| `discriminator` | `unknown`                                                                       | -           |
| `params`        | [initializeCustomizablePoolParameters](#initializeCustomizablePoolParameters-3) | -           |

### initializeReward

**Accounts:**

| Account          | Type             | Description |
| ---------------- | ---------------- | ----------- |
| `poolAuthority`  | readonly         | -           |
| `pool`           | writable         | -           |
| `rewardVault`    | writable         | -           |
| `rewardMint`     | readonly         | -           |
| `signer`         | signer           | -           |
| `payer`          | signer, writable | -           |
| `tokenProgram`   | readonly         | -           |
| `systemProgram`  | readonly         | -           |
| `eventAuthority` | readonly         | -           |
| `program`        | readonly         | -           |

**Arguments:**

| Argument         | Type        | Description |
| ---------------- | ----------- | ----------- |
| `discriminator`  | `unknown`   | -           |
| `rewardIndex`    | `u8`        | -           |
| `rewardDuration` | `u64`       | -           |
| `funder`         | `PublicKey` | -           |

### lockPosition

**Accounts:**

| Account              | Type             | Description               |
| -------------------- | ---------------- | ------------------------- |
| `pool`               | readonly         | -                         |
| `position`           | writable         | -                         |
| `vesting`            | signer, writable | -                         |
| `positionNftAccount` | readonly         | The token account for nft |
| `owner`              | signer           | owner of position         |
| `payer`              | signer, writable | -                         |
| `systemProgram`      | readonly         | -                         |
| `eventAuthority`     | readonly         | -                         |
| `program`            | readonly         | -                         |

**Arguments:**

| Argument        | Type                                      | Description |
| --------------- | ----------------------------------------- | ----------- |
| `discriminator` | `unknown`                                 | -           |
| `params`        | [vestingParameters](#vestingParameters-3) | -           |

### permanentLockPosition

**Accounts:**

| Account              | Type     | Description               |
| -------------------- | -------- | ------------------------- |
| `pool`               | writable | -                         |
| `position`           | writable | -                         |
| `positionNftAccount` | readonly | The token account for nft |
| `owner`              | signer   | owner of position         |
| `eventAuthority`     | readonly | -                         |
| `program`            | readonly | -                         |

**Arguments:**

| Argument                 | Type      | Description |
| ------------------------ | --------- | ----------- |
| `discriminator`          | `unknown` | -           |
| `permanentLockLiquidity` | `u128`    | -           |

### refreshVesting

**Accounts:**

| Account              | Type     | Description               |
| -------------------- | -------- | ------------------------- |
| `pool`               | readonly | -                         |
| `position`           | writable | -                         |
| `positionNftAccount` | readonly | The token account for nft |
| `owner`              | readonly | -                         |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### removeAllLiquidity

**Accounts:**

| Account              | Type     | Description                              |
| -------------------- | -------- | ---------------------------------------- |
| `poolAuthority`      | readonly | -                                        |
| `pool`               | writable | -                                        |
| `position`           | writable | -                                        |
| `tokenAAccount`      | writable | The user token a account                 |
| `tokenBAccount`      | writable | The user token b account                 |
| `tokenAVault`        | writable | The vault token account for input token  |
| `tokenBVault`        | writable | The vault token account for output token |
| `tokenAMint`         | readonly | The mint of token a                      |
| `tokenBMint`         | readonly | The mint of token b                      |
| `positionNftAccount` | readonly | The token account for nft                |
| `owner`              | signer   | owner of position                        |
| `tokenAProgram`      | readonly | Token a program                          |
| `tokenBProgram`      | readonly | Token b program                          |
| `eventAuthority`     | readonly | -                                        |
| `program`            | readonly | -                                        |

**Arguments:**

| Argument                | Type      | Description |
| ----------------------- | --------- | ----------- |
| `discriminator`         | `unknown` | -           |
| `tokenAAmountThreshold` | `u64`     | -           |
| `tokenBAmountThreshold` | `u64`     | -           |

### removeLiquidity

**Accounts:**

| Account              | Type     | Description                              |
| -------------------- | -------- | ---------------------------------------- |
| `poolAuthority`      | readonly | -                                        |
| `pool`               | writable | -                                        |
| `position`           | writable | -                                        |
| `tokenAAccount`      | writable | The user token a account                 |
| `tokenBAccount`      | writable | The user token b account                 |
| `tokenAVault`        | writable | The vault token account for input token  |
| `tokenBVault`        | writable | The vault token account for output token |
| `tokenAMint`         | readonly | The mint of token a                      |
| `tokenBMint`         | readonly | The mint of token b                      |
| `positionNftAccount` | readonly | The token account for nft                |
| `owner`              | signer   | owner of position                        |
| `tokenAProgram`      | readonly | Token a program                          |
| `tokenBProgram`      | readonly | Token b program                          |
| `eventAuthority`     | readonly | -                                        |
| `program`            | readonly | -                                        |

**Arguments:**

| Argument        | Type                                                      | Description |
| --------------- | --------------------------------------------------------- | ----------- |
| `discriminator` | `unknown`                                                 | -           |
| `params`        | [removeLiquidityParameters](#removeLiquidityParameters-3) | -           |

### setPoolStatus

**Accounts:**

| Account          | Type     | Description |
| ---------------- | -------- | ----------- |
| `pool`           | writable | -           |
| `admin`          | signer   | -           |
| `eventAuthority` | readonly | -           |
| `program`        | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `status`        | `u8`      | -           |

### splitPosition

**Accounts:**

| Account                    | Type     | Description                        |
| -------------------------- | -------- | ---------------------------------- |
| `pool`                     | writable | -                                  |
| `firstPosition`            | writable | The first position                 |
| `firstPositionNftAccount`  | readonly | The token account for position nft |
| `secondPosition`           | writable | The second position                |
| `secondPositionNftAccount` | readonly | The token account for position nft |
| `firstOwner`               | signer   | Owner of first position            |
| `secondOwner`              | signer   | Owner of second position           |
| `eventAuthority`           | readonly | -                                  |
| `program`                  | readonly | -                                  |

**Arguments:**

| Argument        | Type                                                  | Description |
| --------------- | ----------------------------------------------------- | ----------- |
| `discriminator` | `unknown`                                             | -           |
| `params`        | [splitPositionParameters](#splitPositionParameters-3) | -           |

### splitPosition2

**Accounts:**

| Account                    | Type     | Description                        |
| -------------------------- | -------- | ---------------------------------- |
| `pool`                     | writable | -                                  |
| `firstPosition`            | writable | The first position                 |
| `firstPositionNftAccount`  | readonly | The token account for position nft |
| `secondPosition`           | writable | The second position                |
| `secondPositionNftAccount` | readonly | The token account for position nft |
| `firstOwner`               | signer   | Owner of first position            |
| `secondOwner`              | signer   | Owner of second position           |
| `eventAuthority`           | readonly | -                                  |
| `program`                  | readonly | -                                  |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `numerator`     | `u32`     | -           |

### swap

**Accounts:**

| Account                | Type               | Description                              |
| ---------------------- | ------------------ | ---------------------------------------- |
| `poolAuthority`        | readonly           | -                                        |
| `pool`                 | writable           | Pool account                             |
| `inputTokenAccount`    | writable           | The user token account for input token   |
| `outputTokenAccount`   | writable           | The user token account for output token  |
| `tokenAVault`          | writable           | The vault token account for input token  |
| `tokenBVault`          | writable           | The vault token account for output token |
| `tokenAMint`           | readonly           | The mint of token a                      |
| `tokenBMint`           | readonly           | The mint of token b                      |
| `payer`                | signer             | The user performing the swap             |
| `tokenAProgram`        | readonly           | Token a program                          |
| `tokenBProgram`        | readonly           | Token b program                          |
| `referralTokenAccount` | writable, optional | referral token account                   |
| `eventAuthority`       | readonly           | -                                        |
| `program`              | readonly           | -                                        |

**Arguments:**

| Argument        | Type                                | Description |
| --------------- | ----------------------------------- | ----------- |
| `discriminator` | `unknown`                           | -           |
| `params`        | [swapParameters](#swapParameters-3) | -           |

### swap2

**Accounts:**

| Account                | Type               | Description                              |
| ---------------------- | ------------------ | ---------------------------------------- |
| `poolAuthority`        | readonly           | -                                        |
| `pool`                 | writable           | Pool account                             |
| `inputTokenAccount`    | writable           | The user token account for input token   |
| `outputTokenAccount`   | writable           | The user token account for output token  |
| `tokenAVault`          | writable           | The vault token account for input token  |
| `tokenBVault`          | writable           | The vault token account for output token |
| `tokenAMint`           | readonly           | The mint of token a                      |
| `tokenBMint`           | readonly           | The mint of token b                      |
| `payer`                | signer             | The user performing the swap             |
| `tokenAProgram`        | readonly           | Token a program                          |
| `tokenBProgram`        | readonly           | Token b program                          |
| `referralTokenAccount` | writable, optional | referral token account                   |
| `eventAuthority`       | readonly           | -                                        |
| `program`              | readonly           | -                                        |

**Arguments:**

| Argument        | Type                                  | Description |
| --------------- | ------------------------------------- | ----------- |
| `discriminator` | `unknown`                             | -           |
| `params`        | [swapParameters2](#swapParameters2-3) | -           |

### updateRewardDuration

**Accounts:**

| Account          | Type     | Description |
| ---------------- | -------- | ----------- |
| `pool`           | writable | -           |
| `signer`         | signer   | -           |
| `eventAuthority` | readonly | -           |
| `program`        | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `rewardIndex`   | `u8`      | -           |
| `newDuration`   | `u64`     | -           |

### updateRewardFunder

**Accounts:**

| Account          | Type     | Description |
| ---------------- | -------- | ----------- |
| `pool`           | writable | -           |
| `signer`         | signer   | -           |
| `eventAuthority` | readonly | -           |
| `program`        | readonly | -           |

**Arguments:**

| Argument        | Type        | Description |
| --------------- | ----------- | ----------- |
| `discriminator` | `unknown`   | -           |
| `rewardIndex`   | `u8`        | -           |
| `newFunder`     | `PublicKey` | -           |

### withdrawIneligibleReward

**Accounts:**

| Account              | Type     | Description |
| -------------------- | -------- | ----------- |
| `poolAuthority`      | readonly | -           |
| `pool`               | writable | -           |
| `rewardVault`        | writable | -           |
| `rewardMint`         | readonly | -           |
| `funderTokenAccount` | writable | -           |
| `funder`             | signer   | -           |
| `tokenProgram`       | readonly | -           |
| `eventAuthority`     | readonly | -           |
| `program`            | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `rewardIndex`   | `u8`      | -           |

## PDAs

### poolAuthority

The global pool authority PDA that has authority over all pools in the program.

**Seeds:**

| Seed       | Type             | Description |
| ---------- | ---------------- | ----------- |
| `constant` | bytes (constant) | -           |

### config

Configuration account that stores global protocol settings.

Each config is indexed by a unique u64 index.

**Seeds:**

| Seed       | Type             | Description      |
| ---------- | ---------------- | ---------------- |
| `constant` | bytes (constant) | -                |
| `index`    | `u64`            | The config index |

### pool

A liquidity pool account for a specific token pair under a given config.

Token mints must be sorted - tokenAMint should be lexicographically smaller than tokenBMint.

**Seeds:**

| Seed         | Type             | Description                    |
| ------------ | ---------------- | ------------------------------ |
| `constant`   | bytes (constant) | -                              |
| `config`     | `PublicKey`      | The config account address     |
| `tokenAMint` | `PublicKey`      | The first token mint (sorted)  |
| `tokenBMint` | `PublicKey`      | The second token mint (sorted) |

### position

A liquidity position account that tracks a user's deposited liquidity.

Each position is uniquely identified by its associated NFT mint.

**Seeds:**

| Seed          | Type             | Description                   |
| ------------- | ---------------- | ----------------------------- |
| `constant`    | bytes (constant) | -                             |
| `positionNft` | `PublicKey`      | The position NFT mint address |

### tokenVault

A token vault account that holds tokens for a specific pool.

Each pool has separate vaults for token A and token B.

**Seeds:**

| Seed        | Type             | Description            |
| ----------- | ---------------- | ---------------------- |
| `constant`  | bytes (constant) | -                      |
| `tokenMint` | `PublicKey`      | The token mint address |
| `pool`      | `PublicKey`      | The pool address       |

### rewardVault

A reward vault account that holds reward tokens for distribution to liquidity providers.

Each pool can have multiple reward vaults indexed by rewardIndex (0-2).

**Seeds:**

| Seed          | Type             | Description      |
| ------------- | ---------------- | ---------------- |
| `constant`    | bytes (constant) | -                |
| `pool`        | `PublicKey`      | The pool address |
| `rewardIndex` | `u8`             | The reward index |

### customizablePool

A customizable pool account that allows for custom fee configurations.

Unlike regular pools, customizable pools are not tied to a config account.

Token mints must be sorted - tokenAMint should be lexicographically smaller than tokenBMint.

**Seeds:**

| Seed         | Type             | Description                    |
| ------------ | ---------------- | ------------------------------ |
| `constant`   | bytes (constant) | -                              |
| `tokenAMint` | `PublicKey`      | The first token mint (sorted)  |
| `tokenBMint` | `PublicKey`      | The second token mint (sorted) |

### tokenBadge

A token badge account that stores metadata about a token's permissions and status.

Used to whitelist or configure specific tokens for use in pools.

**Seeds:**

| Seed        | Type             | Description            |
| ----------- | ---------------- | ---------------------- |
| `constant`  | bytes (constant) | -                      |
| `tokenMint` | `PublicKey`      | The token mint address |

### claimFeeOperator

A claim fee operator account that authorizes an address to claim protocol fees.

Operators can collect fees on behalf of the protocol.

**Seeds:**

| Seed       | Type             | Description          |
| ---------- | ---------------- | -------------------- |
| `constant` | bytes (constant) | -                    |
| `operator` | `PublicKey`      | The operator address |

### positionNftAccount

The token account that holds the position NFT.

This is a program-owned account that stores the NFT representing a liquidity position.

**Seeds:**

| Seed              | Type             | Description                   |
| ----------------- | ---------------- | ----------------------------- |
| `constant`        | bytes (constant) | -                             |
| `positionNftMint` | `PublicKey`      | The position NFT mint address |

### eventAuthority

The event authority PDA used for emitting program events via CPI.

**Seeds:**

| Seed       | Type             | Description |
| ---------- | ---------------- | ----------- |
| `constant` | bytes (constant) | -           |

## Types

### addLiquidityParameters

**Definition:**

```typescript
{
  liquidityDelta: bigint;
  tokenAAmountThreshold: bigint;
  tokenBAmountThreshold: bigint;
}
```

### baseFeeConfig

**Definition:**

```typescript
{
  cliffFeeNumerator: bigint;
  baseFeeMode: bigint;
  padding: bigint[5];
  firstFactor: bigint;
  secondFactor: bigint[8];
  thirdFactor: bigint;
}
```

### baseFeeParameters

**Definition:**

```typescript
{
  cliffFeeNumerator: bigint;
  firstFactor: bigint;
  secondFactor: bigint[8];
  thirdFactor: bigint;
  baseFeeMode: bigint;
}
```

### baseFeeStruct

**Definition:**

```typescript
{
  cliffFeeNumerator: bigint;
  baseFeeMode: bigint;
  padding0: bigint[5];
  firstFactor: bigint;
  secondFactor: bigint[8];
  thirdFactor: bigint;
  padding1: bigint;
}
```

### dynamicConfigParameters

**Definition:**

```typescript
{
  poolCreatorAuthority: PublicKey;
}
```

### dynamicFeeConfig

**Definition:**

```typescript
{
  initialized: bigint;
  padding: bigint[7];
  maxVolatilityAccumulator: bigint;
  variableFeeControl: bigint;
  binStep: bigint;
  filterPeriod: bigint;
  decayPeriod: bigint;
  reductionFactor: bigint;
  padding1: bigint[8];
  binStepU128: bigint;
}
```

### dynamicFeeParameters

**Definition:**

```typescript
{
  binStep: bigint;
  binStepU128: bigint;
  filterPeriod: bigint;
  decayPeriod: bigint;
  reductionFactor: bigint;
  maxVolatilityAccumulator: bigint;
  variableFeeControl: bigint;
}
```

### dynamicFeeStruct

**Definition:**

```typescript
{
  initialized: bigint;
  padding: bigint[7];
  maxVolatilityAccumulator: bigint;
  variableFeeControl: bigint;
  binStep: bigint;
  filterPeriod: bigint;
  decayPeriod: bigint;
  reductionFactor: bigint;
  lastUpdateTimestamp: bigint;
  binStepU128: bigint;
  sqrtPriceReference: bigint;
  volatilityAccumulator: bigint;
  volatilityReference: bigint;
}
```

### initializeCustomizablePoolParameters

**Definition:**

```typescript
{
  poolFees: poolFeeParameters;
  sqrtMinPrice: bigint;
  sqrtMaxPrice: bigint;
  hasAlphaVault: boolean;
  liquidity: bigint;
  sqrtPrice: bigint;
  activationType: bigint;
  collectFeeMode: bigint;
  activationPoint: bigint | null;
}
```

### initializePoolParameters

**Definition:**

```typescript
{
  liquidity: bigint;
  sqrtPrice: bigint;
  activationPoint: bigint | null;
}
```

### poolFeeParameters

Information regarding fee charges

**Definition:**

```typescript
{
  baseFee: baseFeeParameters;
  padding: bigint[3];
  dynamicFee: dynamicFeeParameters | null;
}
```

### poolFeesConfig

**Definition:**

```typescript
{
  baseFee: baseFeeConfig;
  dynamicFee: dynamicFeeConfig;
  protocolFeePercent: bigint;
  partnerFeePercent: bigint;
  referralFeePercent: bigint;
  padding0: bigint[5];
  padding1: bigint[5];
}
```

### poolFeesStruct

Information regarding fee charges

trading_fee = amount * trade_fee_numerator / denominator

protocol_fee = trading_fee * protocol_fee_percentage / 100

referral_fee = protocol_fee * referral_percentage / 100

partner_fee = (protocol_fee - referral_fee) * partner_fee_percentage / denominator

**Definition:**

```typescript
{
  baseFee: baseFeeStruct;
  protocolFeePercent: bigint;
  partnerFeePercent: bigint;
  referralFeePercent: bigint;
  padding0: bigint[5];
  dynamicFee: dynamicFeeStruct;
  padding1: bigint[2];
}
```

### poolMetrics

**Definition:**

```typescript
{
  totalLpAFee: bigint;
  totalLpBFee: bigint;
  totalProtocolAFee: bigint;
  totalProtocolBFee: bigint;
  totalPartnerAFee: bigint;
  totalPartnerBFee: bigint;
  totalPosition: bigint;
  padding: bigint;
}
```

### positionMetrics

**Definition:**

```typescript
{
  totalClaimedAFee: bigint;
  totalClaimedBFee: bigint;
}
```

### removeLiquidityParameters

**Definition:**

```typescript
{
  liquidityDelta: bigint;
  tokenAAmountThreshold: bigint;
  tokenBAmountThreshold: bigint;
}
```

### rewardInfo

Stores the state relevant for tracking liquidity mining rewards

**Definition:**

```typescript
{
  initialized: bigint;
  rewardTokenFlag: bigint;
  padding0: bigint[6];
  padding1: bigint[8];
  mint: PublicKey;
  vault: PublicKey;
  funder: PublicKey;
  rewardDuration: bigint;
  rewardDurationEnd: bigint;
  rewardRate: bigint;
  rewardPerTokenStored: bigint[32];
  lastUpdateTime: bigint;
  cumulativeSecondsWithEmptyLiquidityReward: bigint;
}
```

### splitAmountInfo

**Definition:**

```typescript
{
  permanentLockedLiquidity: bigint;
  unlockedLiquidity: bigint;
  feeA: bigint;
  feeB: bigint;
  reward0: bigint;
  reward1: bigint;
}
```

### splitPositionInfo

**Definition:**

```typescript
{
  liquidity: bigint;
  feeA: bigint;
  feeB: bigint;
  reward0: bigint;
  reward1: bigint;
}
```

### splitPositionParameters

**Definition:**

```typescript
{
  unlockedLiquidityPercentage: bigint;
  permanentLockedLiquidityPercentage: bigint;
  feeAPercentage: bigint;
  feeBPercentage: bigint;
  reward0Percentage: bigint;
  reward1Percentage: bigint;
  padding: bigint[16];
}
```

### splitPositionParameters2

**Definition:**

```typescript
{
  unlockedLiquidityNumerator: bigint;
  permanentLockedLiquidityNumerator: bigint;
  feeANumerator: bigint;
  feeBNumerator: bigint;
  reward0Numerator: bigint;
  reward1Numerator: bigint;
}
```

### staticConfigParameters

**Definition:**

```typescript
{
  poolFees: poolFeeParameters;
  sqrtMinPrice: bigint;
  sqrtMaxPrice: bigint;
  vaultConfigKey: PublicKey;
  poolCreatorAuthority: PublicKey;
  activationType: bigint;
  collectFeeMode: bigint;
}
```

### swapParameters

**Definition:**

```typescript
{
  amountIn: bigint;
  minimumAmountOut: bigint;
}
```

### swapParameters2

**Definition:**

```typescript
{
  amount0: bigint;
  amount1: bigint;
  swapMode: bigint;
}
```

### swapResult

Encodes all results of swapping

**Definition:**

```typescript
{
  outputAmount: bigint;
  nextSqrtPrice: bigint;
  lpFee: bigint;
  protocolFee: bigint;
  partnerFee: bigint;
  referralFee: bigint;
}
```

### swapResult2

**Definition:**

```typescript
{
  includedFeeInputAmount: bigint;
  excludedFeeInputAmount: bigint;
  amountLeft: bigint;
  outputAmount: bigint;
  nextSqrtPrice: bigint;
  tradingFee: bigint;
  protocolFee: bigint;
  partnerFee: bigint;
  referralFee: bigint;
}
```

### userRewardInfo

**Definition:**

```typescript
{
  rewardPerTokenCheckpoint: bigint[32];
  rewardPendings: bigint;
  totalClaimedRewards: bigint;
}
```

### vestingParameters

**Definition:**

```typescript
{
  cliffPoint: bigint | null;
  periodFrequency: bigint;
  cliffUnlockLiquidity: bigint;
  liquidityPerPeriod: bigint;
  numberOfPeriod: bigint;
}
```

### evtAddLiquidity

**Definition:**

```typescript
{
  pool: PublicKey;
  position: PublicKey;
  owner: PublicKey;
  params: addLiquidityParameters;
  tokenAAmount: bigint;
  tokenBAmount: bigint;
  totalAmountA: bigint;
  totalAmountB: bigint;
}
```

### evtClaimPartnerFee

**Definition:**

```typescript
{
  pool: PublicKey;
  tokenAAmount: bigint;
  tokenBAmount: bigint;
}
```

### evtClaimPositionFee

**Definition:**

```typescript
{
  pool: PublicKey;
  position: PublicKey;
  owner: PublicKey;
  feeAClaimed: bigint;
  feeBClaimed: bigint;
}
```

### evtClaimProtocolFee

**Definition:**

```typescript
{
  pool: PublicKey;
  tokenAAmount: bigint;
  tokenBAmount: bigint;
}
```

### evtClaimReward

**Definition:**

```typescript
{
  pool: PublicKey;
  position: PublicKey;
  owner: PublicKey;
  mintReward: PublicKey;
  rewardIndex: bigint;
  totalReward: bigint;
}
```

### evtCloseClaimFeeOperator

**Definition:**

```typescript
{
  claimFeeOperator: PublicKey;
  operator: PublicKey;
}
```

### evtCloseConfig

**Definition:**

```typescript
{
  config: PublicKey;
  admin: PublicKey;
}
```

### evtClosePosition

**Definition:**

```typescript
{
  pool: PublicKey;
  owner: PublicKey;
  position: PublicKey;
  positionNftMint: PublicKey;
}
```

### evtCreateClaimFeeOperator

**Definition:**

```typescript
{
  operator: PublicKey;
}
```

### evtCreateConfig

**Definition:**

```typescript
{
  poolFees: poolFeeParameters;
  vaultConfigKey: PublicKey;
  poolCreatorAuthority: PublicKey;
  activationType: bigint;
  sqrtMinPrice: bigint;
  sqrtMaxPrice: bigint;
  collectFeeMode: bigint;
  index: bigint;
  config: PublicKey;
}
```

### evtCreateDynamicConfig

**Definition:**

```typescript
{
  config: PublicKey;
  poolCreatorAuthority: PublicKey;
  index: bigint;
}
```

### evtCreatePosition

**Definition:**

```typescript
{
  pool: PublicKey;
  owner: PublicKey;
  position: PublicKey;
  positionNftMint: PublicKey;
}
```

### evtCreateTokenBadge

**Definition:**

```typescript
{
  tokenMint: PublicKey;
}
```

### evtFundReward

**Definition:**

```typescript
{
  pool: PublicKey;
  funder: PublicKey;
  mintReward: PublicKey;
  rewardIndex: bigint;
  amount: bigint;
  transferFeeExcludedAmountIn: bigint;
  rewardDurationEnd: bigint;
  preRewardRate: bigint;
  postRewardRate: bigint;
}
```

### evtInitializePool

**Definition:**

```typescript
{
  pool: PublicKey;
  tokenAMint: PublicKey;
  tokenBMint: PublicKey;
  creator: PublicKey;
  payer: PublicKey;
  alphaVault: PublicKey;
  poolFees: poolFeeParameters;
  sqrtMinPrice: bigint;
  sqrtMaxPrice: bigint;
  activationType: bigint;
  collectFeeMode: bigint;
  liquidity: bigint;
  sqrtPrice: bigint;
  activationPoint: bigint;
  tokenAFlag: bigint;
  tokenBFlag: bigint;
  tokenAAmount: bigint;
  tokenBAmount: bigint;
  totalAmountA: bigint;
  totalAmountB: bigint;
  poolType: bigint;
}
```

### evtInitializeReward

**Definition:**

```typescript
{
  pool: PublicKey;
  rewardMint: PublicKey;
  funder: PublicKey;
  creator: PublicKey;
  rewardIndex: bigint;
  rewardDuration: bigint;
}
```

### evtLiquidityChange

**Definition:**

```typescript
{
  pool: PublicKey;
  position: PublicKey;
  owner: PublicKey;
  tokenAAmount: bigint;
  tokenBAmount: bigint;
  transferFeeIncludedTokenAAmount: bigint;
  transferFeeIncludedTokenBAmount: bigint;
  reserveAAmount: bigint;
  reserveBAmount: bigint;
  liquidityDelta: bigint;
  tokenAAmountThreshold: bigint;
  tokenBAmountThreshold: bigint;
  changeType: bigint;
}
```

### evtLockPosition

**Definition:**

```typescript
{
  pool: PublicKey;
  position: PublicKey;
  owner: PublicKey;
  vesting: PublicKey;
  cliffPoint: bigint;
  periodFrequency: bigint;
  cliffUnlockLiquidity: bigint;
  liquidityPerPeriod: bigint;
  numberOfPeriod: bigint;
}
```

### evtPermanentLockPosition

**Definition:**

```typescript
{
  pool: PublicKey;
  position: PublicKey;
  lockLiquidityAmount: bigint;
  totalPermanentLockedLiquidity: bigint;
}
```

### evtRemoveLiquidity

**Definition:**

```typescript
{
  pool: PublicKey;
  position: PublicKey;
  owner: PublicKey;
  params: removeLiquidityParameters;
  tokenAAmount: bigint;
  tokenBAmount: bigint;
}
```

### evtSetPoolStatus

**Definition:**

```typescript
{
  pool: PublicKey;
  status: bigint;
}
```

### evtSplitPosition2

**Definition:**

```typescript
{
  pool: PublicKey;
  firstOwner: PublicKey;
  secondOwner: PublicKey;
  firstPosition: PublicKey;
  secondPosition: PublicKey;
  currentSqrtPrice: bigint;
  amountSplits: splitAmountInfo;
  firstPositionInfo: splitPositionInfo;
  secondPositionInfo: splitPositionInfo;
  splitPositionParameters: splitPositionParameters2;
}
```

### evtSwap

**Definition:**

```typescript
{
  pool: PublicKey;
  tradeDirection: bigint;
  hasReferral: boolean;
  params: swapParameters;
  swapResult: swapResult;
  actualAmountIn: bigint;
  currentTimestamp: bigint;
}
```

### evtSwap2

**Definition:**

```typescript
{
  pool: PublicKey;
  tradeDirection: bigint;
  collectFeeMode: bigint;
  hasReferral: boolean;
  params: swapParameters2;
  swapResult: swapResult2;
  includedTransferFeeAmountIn: bigint;
  includedTransferFeeAmountOut: bigint;
  excludedTransferFeeAmountOut: bigint;
  currentTimestamp: bigint;
  reserveAAmount: bigint;
  reserveBAmount: bigint;
}
```

### evtUpdateRewardDuration

**Definition:**

```typescript
{
  pool: PublicKey;
  rewardIndex: bigint;
  oldRewardDuration: bigint;
  newRewardDuration: bigint;
}
```

### evtUpdateRewardFunder

**Definition:**

```typescript
{
  pool: PublicKey;
  rewardIndex: bigint;
  oldFunder: PublicKey;
  newFunder: PublicKey;
}
```

### evtWithdrawIneligibleReward

**Definition:**

```typescript
{
  pool: PublicKey;
  rewardMint: PublicKey;
  amount: bigint;
}
```

## Errors

- **6000 - MathOverflow**: Math operation overflow _(Hex: `0x1770`)_
- **6001 - InvalidFee**: Invalid fee setup _(Hex: `0x1771`)_
- **6002 - ExceededSlippage**: Exceeded slippage tolerance _(Hex: `0x1772`)_
- **6003 - PoolDisabled**: Pool disabled _(Hex: `0x1773`)_
- **6004 - ExceedMaxFeeBps**: Exceeded max fee bps _(Hex: `0x1774`)_
- **6005 - InvalidAdmin**: Invalid admin _(Hex: `0x1775`)_
- **6006 - AmountIsZero**: Amount is zero _(Hex: `0x1776`)_
- **6007 - TypeCastFailed**: Type cast error _(Hex: `0x1777`)_
- **6008 - UnableToModifyActivationPoint**: Unable to modify activation point _(Hex: `0x1778`)_
- **6009 - InvalidAuthorityToCreateThePool**: Invalid authority to create the pool _(Hex: `0x1779`)_
- **6010 - InvalidActivationType**: Invalid activation type _(Hex: `0x177a`)_
- **6011 - InvalidActivationPoint**: Invalid activation point _(Hex: `0x177b`)_
- **6012 - InvalidQuoteMint**: Quote token must be SOL,USDC _(Hex: `0x177c`)_
- **6013 - InvalidFeeCurve**: Invalid fee curve _(Hex: `0x177d`)_
- **6014 - InvalidPriceRange**: Invalid Price Range _(Hex: `0x177e`)_
- **6015 - PriceRangeViolation**: Trade is over price range _(Hex: `0x177f`)_
- **6016 - InvalidParameters**: Invalid parameters _(Hex: `0x1780`)_
- **6017 - InvalidCollectFeeMode**: Invalid collect fee mode _(Hex: `0x1781`)_
- **6018 - InvalidInput**: Invalid input _(Hex: `0x1782`)_
- **6019 - CannotCreateTokenBadgeOnSupportedMint**: Cannot create token badge on supported mint _(Hex: `0x1783`)_
- **6020 - InvalidTokenBadge**: Invalid token badge _(Hex: `0x1784`)_
- **6021 - InvalidMinimumLiquidity**: Invalid minimum liquidity _(Hex: `0x1785`)_
- **6022 - InvalidVestingInfo**: Invalid vesting information _(Hex: `0x1786`)_
- **6023 - InsufficientLiquidity**: Insufficient liquidity _(Hex: `0x1787`)_
- **6024 - InvalidVestingAccount**: Invalid vesting account _(Hex: `0x1788`)_
- **6025 - InvalidPoolStatus**: Invalid pool status _(Hex: `0x1789`)_
- **6026 - UnsupportNativeMintToken2022**: Unsupported native mint token2022 _(Hex: `0x178a`)_
- **6027 - InvalidRewardIndex**: Invalid reward index _(Hex: `0x178b`)_
- **6028 - InvalidRewardDuration**: Invalid reward duration _(Hex: `0x178c`)_
- **6029 - RewardInitialized**: Reward already initialized _(Hex: `0x178d`)_
- **6030 - RewardUninitialized**: Reward not initialized _(Hex: `0x178e`)_
- **6031 - InvalidRewardVault**: Invalid reward vault _(Hex: `0x178f`)_
- **6032 - MustWithdrawnIneligibleReward**: Must withdraw ineligible reward _(Hex: `0x1790`)_
- **6033 - IdenticalRewardDuration**: Reward duration is the same _(Hex: `0x1791`)_
- **6034 - RewardCampaignInProgress**: Reward campaign in progress _(Hex: `0x1792`)_
- **6035 - IdenticalFunder**: Identical funder _(Hex: `0x1793`)_
- **6036 - InvalidFunder**: Invalid funder _(Hex: `0x1794`)_
- **6037 - RewardNotEnded**: Reward not ended _(Hex: `0x1795`)_
- **6038 - FeeInverseIsIncorrect**: Fee inverse is incorrect _(Hex: `0x1796`)_
- **6039 - PositionIsNotEmpty**: Position is not empty _(Hex: `0x1797`)_
- **6040 - InvalidPoolCreatorAuthority**: Invalid pool creator authority _(Hex: `0x1798`)_
- **6041 - InvalidConfigType**: Invalid config type _(Hex: `0x1799`)_
- **6042 - InvalidPoolCreator**: Invalid pool creator _(Hex: `0x179a`)_
- **6043 - RewardVaultFrozenSkipRequired**: Reward vault is frozen, must skip reward to proceed _(Hex: `0x179b`)_
- **6044 - InvalidSplitPositionParameters**: Invalid parameters for split position _(Hex: `0x179c`)_
- **6045 - UnsupportPositionHasVestingLock**: Unsupported split position has vesting lock _(Hex: `0x179d`)_
- **6046 - SamePosition**: Same position _(Hex: `0x179e`)_
- **6047 - InvalidBaseFeeMode**: Invalid base fee mode _(Hex: `0x179f`)_
- **6048 - InvalidFeeRateLimiter**: Invalid fee rate limiter _(Hex: `0x17a0`)_
- **6049 - FailToValidateSingleSwapInstruction**: Fail to validate single swap instruction in rate limiter _(Hex: `0x17a1`)_
- **6050 - InvalidFeeScheduler**: Invalid fee scheduler _(Hex: `0x17a2`)_
- **6051 - UndeterminedError**: Undetermined error _(Hex: `0x17a3`)_
- **6052 - InvalidPoolVersion**: Invalid pool version _(Hex: `0x17a4`)_
