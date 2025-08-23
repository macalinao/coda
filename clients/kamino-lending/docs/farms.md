# Farms Program

[![npm version](https://badge.fury.io/js/%40macalinao%2Fclients-kamino-lending.svg)](https://www.npmjs.com/package/%40macalinao%2Fclients-kamino-lending)

- Program ID: `FarmsPZpWu9i7Kky8tPN37rs2TpmMrAZrC7S7vJa91Hr`
- TypeScript Client: [`@macalinao/clients-kamino-lending`](https://www.npmjs.com/package/@macalinao/clients-kamino-lending)

## Table of Contents

- [Accounts](#accounts)
  - [farmState](#farmState)
  - [globalConfig](#globalConfig)
  - [farmsUserState](#farmsUserState)
  - [oraclePrices](#oraclePrices)
- [Instructions](#instructions)
  - [initializeGlobalConfig](#initializeGlobalConfig)
  - [updateGlobalConfig](#updateGlobalConfig)
  - [initializeFarm](#initializeFarm)
  - [initializeFarmDelegated](#initializeFarmDelegated)
  - [initializeReward](#initializeReward)
  - [addRewards](#addRewards)
  - [updateFarmConfig](#updateFarmConfig)
  - [initializeUser](#initializeUser)
  - [transferOwnership](#transferOwnership)
  - [rewardUserOnce](#rewardUserOnce)
  - [refreshFarm](#refreshFarm)
  - [stake](#stake)
  - [setStakeDelegated](#setStakeDelegated)
  - [harvestReward](#harvestReward)
  - [unstake](#unstake)
  - [refreshUserState](#refreshUserState)
  - [withdrawUnstakedDeposits](#withdrawUnstakedDeposits)
  - [withdrawTreasury](#withdrawTreasury)
  - [depositToFarmVault](#depositToFarmVault)
  - [withdrawFromFarmVault](#withdrawFromFarmVault)
  - [withdrawSlashedAmount](#withdrawSlashedAmount)
  - [updateFarmAdmin](#updateFarmAdmin)
  - [updateGlobalConfigAdmin](#updateGlobalConfigAdmin)
  - [withdrawReward](#withdrawReward)
  - [farmsIdlMissingTypes](#farmsIdlMissingTypes)
- [PDAs](#pdas)
  - [obligationFarmState](#obligationFarmState)
- [Types](#types)
  - [farmConfigOption](#farmConfigOption)
  - [globalConfigOption](#globalConfigOption)
  - [lockingMode](#lockingMode)
  - [rewardInfo](#rewardInfo)
  - [rewardPerTimeUnitPoint](#rewardPerTimeUnitPoint)
  - [rewardScheduleCurve](#rewardScheduleCurve)
  - [rewardType](#rewardType)
  - [timeUnit](#timeUnit)
  - [farmsTokenInfo](#farmsTokenInfo)
  - [datedPrice](#datedPrice)
  - [price](#price)
- [Errors](#errors)

## Accounts

### farmState

**Fields:**

| Field                              | Type                            | Description                                                                                                                                                    |
| ---------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator`                    | `unknown`                       |                                                                                                                                                                |
| `farmAdmin`                        | `PublicKey`                     |                                                                                                                                                                |
| `globalConfig`                     | `PublicKey`                     |                                                                                                                                                                |
| `token`                            | [tokenInfo](#tokenInfo-3)       |                                                                                                                                                                |
| `rewardInfos`                      | [rewardInfo](#rewardInfo-3)[10] |                                                                                                                                                                |
| `numRewardTokens`                  | `u64`                           |                                                                                                                                                                |
| `numUsers`                         | `u64`                           | Data used to calculate the rewards of the user                                                                                                                 |
| `totalStakedAmount`                | `u64`                           | The number of token in the `farm_vault` staked (getting rewards and fees) Set such as `farm_vault.amount = total_staked_amount + total_pending_amount`         |
| `farmVault`                        | `PublicKey`                     |                                                                                                                                                                |
| `farmVaultsAuthority`              | `PublicKey`                     |                                                                                                                                                                |
| `farmVaultsAuthorityBump`          | `u64`                           |                                                                                                                                                                |
| `delegateAuthority`                | `PublicKey`                     | Only used for delegate farms Set to `default()` otherwise                                                                                                      |
| `timeUnit`                         | `u8`                            | Raw representation of a `TimeUnit` Seconds = 0, Slots = 1                                                                                                      |
| `isFarmFrozen`                     | `u8`                            | Automatically set to true in case of a full authority withdrawal If true, the farm is frozen and no more deposits are allowed                                  |
| `isFarmDelegated`                  | `u8`                            | Indicates if the farm is a delegate farm If true, the farm is a delegate farm and the `delegate_authority` is set\*                                            |
| `padding0`                         | `u8`[5]                         |                                                                                                                                                                |
| `withdrawAuthority`                | `PublicKey`                     | Withdraw authority for the farm, allowed to lock deposited funds and withdraw them Set to `default()` if unused (only the depositors can withdraw their funds) |
| `depositWarmupPeriod`              | `u32`                           | Delay between a user deposit and the moment it is considered as staked 0 if unused                                                                             |
| `withdrawalCooldownPeriod`         | `u32`                           | Delay between a user unstake and the ability to withdraw his deposit.                                                                                          |
| `totalActiveStakeScaled`           | `u128`                          | Total active stake of tokens in the farm (scaled from `Decimal` representation).                                                                               |
| `totalPendingStakeScaled`          | `u128`                          | Total pending stake of tokens in the farm (scaled from `Decimal` representation). (can be used by `withdraw_authority` but don't get rewards or fees)          |
| `totalPendingAmount`               | `u64`                           | Total pending amount of tokens in the farm                                                                                                                     |
| `slashedAmountCurrent`             | `u64`                           | Slashed amounts from early withdrawal                                                                                                                          |
| `slashedAmountCumulative`          | `u64`                           |                                                                                                                                                                |
| `slashedAmountSpillAddress`        | `PublicKey`                     |                                                                                                                                                                |
| `lockingMode`                      | `u64`                           | Locking stake                                                                                                                                                  |
| `lockingStartTimestamp`            | `u64`                           |                                                                                                                                                                |
| `lockingDuration`                  | `u64`                           |                                                                                                                                                                |
| `lockingEarlyWithdrawalPenaltyBps` | `u64`                           |                                                                                                                                                                |
| `depositCapAmount`                 | `u64`                           |                                                                                                                                                                |
| `scopePrices`                      | `PublicKey`                     |                                                                                                                                                                |
| `scopeOraclePriceId`               | `u64`                           |                                                                                                                                                                |
| `scopeOracleMaxAge`                | `u64`                           |                                                                                                                                                                |
| `pendingFarmAdmin`                 | `PublicKey`                     |                                                                                                                                                                |
| `strategyId`                       | `PublicKey`                     |                                                                                                                                                                |
| `delegatedRpsAdmin`                | `PublicKey`                     |                                                                                                                                                                |
| `vaultId`                          | `PublicKey`                     |                                                                                                                                                                |
| `padding`                          | `u64`[78]                       |                                                                                                                                                                |

### globalConfig

**Fields:**

| Field                         | Type        | Description |
| ----------------------------- | ----------- | ----------- |
| `discriminator`               | `unknown`   |             |
| `globalAdmin`                 | `PublicKey` |             |
| `treasuryFeeBps`              | `u64`       |             |
| `treasuryVaultsAuthority`     | `PublicKey` |             |
| `treasuryVaultsAuthorityBump` | `u64`       |             |
| `pendingGlobalAdmin`          | `PublicKey` |             |
| `padding1`                    | `u128`[126] |             |

### farmsUserState

**Fields:**

| Field                            | Type        | Description                                                                                                                    |
| -------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `discriminator`                  | `unknown`   |                                                                                                                                |
| `userId`                         | `u64`       |                                                                                                                                |
| `farmState`                      | `PublicKey` |                                                                                                                                |
| `owner`                          | `PublicKey` |                                                                                                                                |
| `isFarmDelegated`                | `u8`        | Indicate if this user state is part of a delegated farm                                                                        |
| `padding0`                       | `u8`[7]     |                                                                                                                                |
| `rewardsTallyScaled`             | `u128`[10]  | Rewards tally used for computation of gained rewards (scaled from `Decimal` representation).                                   |
| `rewardsIssuedUnclaimed`         | `u64`[10]   | Number of reward tokens ready for claim                                                                                        |
| `lastClaimTs`                    | `u64`[10]   |                                                                                                                                |
| `activeStakeScaled`              | `u128`      | User stake deposited and usable, generating rewards and fees. (scaled from `Decimal` representation).                          |
| `pendingDepositStakeScaled`      | `u128`      | User stake deposited but not usable and not generating rewards yet. (scaled from `Decimal` representation).                    |
| `pendingDepositStakeTs`          | `u64`       | After this timestamp, pending user stake can be moved to user stake Initialized to now() + delayed user stake period           |
| `pendingWithdrawalUnstakeScaled` | `u128`      | User deposits unstaked, pending for withdrawal, not usable and not generating rewards. (scaled from `Decimal` representation). |
| `pendingWithdrawalUnstakeTs`     | `u64`       | After this timestamp, user can withdraw their deposit.                                                                         |
| `bump`                           | `u64`       | User bump used for account address validation                                                                                  |
| `delegatee`                      | `PublicKey` | Delegatee used for initialisation - useful to check against                                                                    |
| `lastStakeTs`                    | `u64`       |                                                                                                                                |
| `padding1`                       | `u64`[50]   |                                                                                                                                |

### oraclePrices

**Fields:**

| Field            | Type                             | Description |
| ---------------- | -------------------------------- | ----------- |
| `discriminator`  | `unknown`                        |             |
| `oracleMappings` | `PublicKey`                      |             |
| `prices`         | [datedPrice](#datedPrice-3)[512] |             |

## Instructions

### initializeGlobalConfig

**Accounts:**

| Account                   | Type             | Description |
| ------------------------- | ---------------- | ----------- |
| `globalAdmin`             | signer, writable |             |
| `globalConfig`            | writable         |             |
| `treasuryVaultsAuthority` | readonly         |             |
| `systemProgram`           | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### updateGlobalConfig

**Accounts:**

| Account        | Type     | Description |
| -------------- | -------- | ----------- |
| `globalAdmin`  | signer   |             |
| `globalConfig` | writable |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `mode`          | `u8`      |             |
| `value`         | `u8`[32]  |             |

### initializeFarm

**Accounts:**

| Account               | Type             | Description |
| --------------------- | ---------------- | ----------- |
| `farmAdmin`           | signer, writable |             |
| `farmState`           | writable         |             |
| `globalConfig`        | readonly         |             |
| `farmVault`           | writable         |             |
| `farmVaultsAuthority` | readonly         |             |
| `tokenMint`           | readonly         |             |
| `tokenProgram`        | readonly         |             |
| `systemProgram`       | readonly         |             |
| `rent`                | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### initializeFarmDelegated

**Accounts:**

| Account               | Type             | Description |
| --------------------- | ---------------- | ----------- |
| `farmAdmin`           | signer, writable |             |
| `farmDelegate`        | signer           |             |
| `farmState`           | writable         |             |
| `globalConfig`        | readonly         |             |
| `farmVaultsAuthority` | readonly         |             |
| `systemProgram`       | readonly         |             |
| `rent`                | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### initializeReward

**Accounts:**

| Account                   | Type             | Description |
| ------------------------- | ---------------- | ----------- |
| `farmAdmin`               | signer, writable |             |
| `farmState`               | writable         |             |
| `globalConfig`            | readonly         |             |
| `rewardMint`              | readonly         |             |
| `rewardVault`             | writable         |             |
| `rewardTreasuryVault`     | writable         |             |
| `farmVaultsAuthority`     | readonly         |             |
| `treasuryVaultsAuthority` | readonly         |             |
| `tokenProgram`            | readonly         |             |
| `systemProgram`           | readonly         |             |
| `rent`                    | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### addRewards

**Accounts:**

| Account               | Type             | Description |
| --------------------- | ---------------- | ----------- |
| `payer`               | signer, writable |             |
| `farmState`           | writable         |             |
| `rewardMint`          | readonly         |             |
| `rewardVault`         | writable         |             |
| `farmVaultsAuthority` | readonly         |             |
| `payerRewardTokenAta` | writable         |             |
| `scopePrices`         | optional         |             |
| `tokenProgram`        | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `amount`        | `u64`     |             |
| `rewardIndex`   | `u64`     |             |

### updateFarmConfig

**Accounts:**

| Account       | Type             | Description |
| ------------- | ---------------- | ----------- |
| `signer`      | signer, writable |             |
| `farmState`   | writable         |             |
| `scopePrices` | optional         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `mode`          | `u16`     |             |
| `data`          | `unknown` |             |

### initializeUser

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `authority`     | signer           |             |
| `payer`         | signer, writable |             |
| `owner`         | readonly         |             |
| `delegatee`     | readonly         |             |
| `userState`     | writable         |             |
| `farmState`     | writable         |             |
| `systemProgram` | readonly         |             |
| `rent`          | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### transferOwnership

**Accounts:**

| Account     | Type     | Description |
| ----------- | -------- | ----------- |
| `owner`     | signer   |             |
| `userState` | writable |             |

**Arguments:**

| Argument        | Type        | Description |
| --------------- | ----------- | ----------- |
| `discriminator` | `unknown`   |             |
| `newOwner`      | `PublicKey` |             |

### rewardUserOnce

**Accounts:**

| Account     | Type             | Description |
| ----------- | ---------------- | ----------- |
| `farmAdmin` | signer, writable |             |
| `farmState` | writable         |             |
| `userState` | writable         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `rewardIndex`   | `u64`     |             |
| `amount`        | `u64`     |             |

### refreshFarm

**Accounts:**

| Account       | Type     | Description |
| ------------- | -------- | ----------- |
| `farmState`   | writable |             |
| `scopePrices` | optional |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### stake

**Accounts:**

| Account        | Type     | Description |
| -------------- | -------- | ----------- |
| `owner`        | signer   |             |
| `userState`    | writable |             |
| `farmState`    | writable |             |
| `farmVault`    | writable |             |
| `userAta`      | writable |             |
| `tokenMint`    | readonly |             |
| `scopePrices`  | optional |             |
| `tokenProgram` | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `amount`        | `u64`     |             |

### setStakeDelegated

**Accounts:**

| Account             | Type     | Description |
| ------------------- | -------- | ----------- |
| `delegateAuthority` | signer   |             |
| `userState`         | writable |             |
| `farmState`         | writable |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `newAmount`     | `u64`     |             |

### harvestReward

**Accounts:**

| Account                | Type             | Description |
| ---------------------- | ---------------- | ----------- |
| `owner`                | signer, writable |             |
| `userState`            | writable         |             |
| `farmState`            | writable         |             |
| `globalConfig`         | readonly         |             |
| `rewardMint`           | readonly         |             |
| `userRewardAta`        | writable         |             |
| `rewardsVault`         | writable         |             |
| `rewardsTreasuryVault` | writable         |             |
| `farmVaultsAuthority`  | readonly         |             |
| `scopePrices`          | optional         |             |
| `tokenProgram`         | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `rewardIndex`   | `u64`     |             |

### unstake

**Accounts:**

| Account       | Type             | Description |
| ------------- | ---------------- | ----------- |
| `owner`       | signer, writable |             |
| `userState`   | writable         |             |
| `farmState`   | writable         |             |
| `scopePrices` | optional         |             |

**Arguments:**

| Argument            | Type      | Description |
| ------------------- | --------- | ----------- |
| `discriminator`     | `unknown` |             |
| `stakeSharesScaled` | `u128`    |             |

### refreshUserState

**Accounts:**

| Account       | Type     | Description |
| ------------- | -------- | ----------- |
| `userState`   | writable |             |
| `farmState`   | writable |             |
| `scopePrices` | optional |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### withdrawUnstakedDeposits

**Accounts:**

| Account               | Type             | Description |
| --------------------- | ---------------- | ----------- |
| `owner`               | signer, writable |             |
| `userState`           | writable         |             |
| `farmState`           | writable         |             |
| `userAta`             | writable         |             |
| `farmVault`           | writable         |             |
| `farmVaultsAuthority` | readonly         |             |
| `tokenProgram`        | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### withdrawTreasury

**Accounts:**

| Account                           | Type             | Description |
| --------------------------------- | ---------------- | ----------- |
| `globalAdmin`                     | signer, writable |             |
| `globalConfig`                    | readonly         |             |
| `rewardMint`                      | readonly         |             |
| `rewardTreasuryVault`             | writable         |             |
| `treasuryVaultAuthority`          | readonly         |             |
| `withdrawDestinationTokenAccount` | writable         |             |
| `tokenProgram`                    | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `amount`        | `u64`     |             |

### depositToFarmVault

**Accounts:**

| Account        | Type     | Description |
| -------------- | -------- | ----------- |
| `depositor`    | signer   |             |
| `farmState`    | writable |             |
| `farmVault`    | writable |             |
| `depositorAta` | writable |             |
| `tokenProgram` | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `amount`        | `u64`     |             |

### withdrawFromFarmVault

**Accounts:**

| Account                  | Type             | Description |
| ------------------------ | ---------------- | ----------- |
| `withdrawAuthority`      | signer, writable |             |
| `farmState`              | writable         |             |
| `withdrawerTokenAccount` | writable         |             |
| `farmVault`              | writable         |             |
| `farmVaultsAuthority`    | readonly         |             |
| `tokenProgram`           | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `amount`        | `u64`     |             |

### withdrawSlashedAmount

**Accounts:**

| Account                     | Type             | Description |
| --------------------------- | ---------------- | ----------- |
| `crank`                     | signer, writable |             |
| `farmState`                 | writable         |             |
| `slashedAmountSpillAddress` | writable         |             |
| `farmVault`                 | writable         |             |
| `farmVaultsAuthority`       | readonly         |             |
| `tokenProgram`              | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### updateFarmAdmin

**Accounts:**

| Account            | Type             | Description |
| ------------------ | ---------------- | ----------- |
| `pendingFarmAdmin` | signer, writable |             |
| `farmState`        | writable         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### updateGlobalConfigAdmin

**Accounts:**

| Account              | Type     | Description |
| -------------------- | -------- | ----------- |
| `pendingGlobalAdmin` | signer   |             |
| `globalConfig`       | writable |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### withdrawReward

**Accounts:**

| Account               | Type             | Description |
| --------------------- | ---------------- | ----------- |
| `farmAdmin`           | signer, writable |             |
| `farmState`           | writable         |             |
| `rewardMint`          | readonly         |             |
| `rewardVault`         | writable         |             |
| `farmVaultsAuthority` | readonly         |             |
| `adminRewardTokenAta` | writable         |             |
| `scopePrices`         | optional         |             |
| `tokenProgram`        | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `amount`        | `u64`     |             |
| `rewardIndex`   | `u64`     |             |

### farmsIdlMissingTypes

**Accounts:**

| Account        | Type     | Description |
| -------------- | -------- | ----------- |
| `globalAdmin`  | signer   |             |
| `globalConfig` | writable |             |

**Arguments:**

| Argument                 | Type                                        | Description |
| ------------------------ | ------------------------------------------- | ----------- |
| `discriminator`          | `unknown`                                   |             |
| `globalConfigOptionKind` | [globalConfigOption](#globalConfigOption-3) |             |
| `farmConfigOptionKind`   | [farmConfigOption](#farmConfigOption-3)     |             |
| `timeUnit`               | [timeUnit](#timeUnit-3)                     |             |
| `lockingMode`            | [lockingMode](#lockingMode-3)               |             |
| `rewardType`             | [rewardType](#rewardType-3)                 |             |

## PDAs

### obligationFarmState

**Seeds:**

| Seed         | Type             | Description |
| ------------ | ---------------- | ----------- |
| `constant`   | bytes (constant) | -           |
| `farm`       | `PublicKey`      |             |
| `obligation` | `PublicKey`      |             |

## Types

### farmConfigOption

**Definition:**

```typescript
| { kind: "updateRewardRps" }
  | { kind: "updateRewardMinClaimDuration" }
  | { kind: "withdrawAuthority" }
  | { kind: "depositWarmupPeriod" }
  | { kind: "withdrawCooldownPeriod" }
  | { kind: "rewardType" }
  | { kind: "rpsDecimals" }
  | { kind: "lockingMode" }
  | { kind: "lockingStartTimestamp" }
  | { kind: "lockingDuration" }
  | { kind: "lockingEarlyWithdrawalPenaltyBps" }
  | { kind: "depositCapAmount" }
  | { kind: "slashedAmountSpillAddress" }
  | { kind: "scopePricesAccount" }
  | { kind: "scopeOraclePriceId" }
  | { kind: "scopeOracleMaxAge" }
  | { kind: "updateRewardScheduleCurvePoints" }
  | { kind: "updatePendingFarmAdmin" }
  | { kind: "updateStrategyId" }
  | { kind: "updateDelegatedRpsAdmin" }
  | { kind: "updateVaultId" }
```

### globalConfigOption

**Definition:**

```typescript
| { kind: "setPendingGlobalAdmin" }
  | { kind: "setTreasuryFeeBps" }
```

### lockingMode

**Definition:**

```typescript
| { kind: "none" }
  | { kind: "continuous" }
  | { kind: "withExpiry" }
```

### rewardInfo

**Definition:**

```typescript
{
  token: tokenInfo;
  rewardsVault: PublicKey;
  rewardsAvailable: bigint;
  rewardScheduleCurve: rewardScheduleCurve;
  minClaimDurationSeconds: bigint;
  lastIssuanceTs: bigint;
  rewardsIssuedUnclaimed: bigint;
  rewardsIssuedCumulative: bigint;
  rewardPerShareScaled: bigint;
  placeholder0: bigint;
  rewardType: bigint;
  rewardsPerSecondDecimals: bigint;
  padding0: bigint[6];
  padding1: bigint[20];
}
```

### rewardPerTimeUnitPoint

**Definition:**

```typescript
{
  tsStart: bigint;
  rewardPerTimeUnit: bigint;
}
```

### rewardScheduleCurve

**Definition:**

```typescript
{
  points: rewardPerTimeUnitPoint[20];
}
```

### rewardType

**Definition:**

```typescript
| { kind: "proportional" }
  | { kind: "constant" }
```

### timeUnit

**Definition:**

```typescript
| { kind: "seconds" }
  | { kind: "slots" }
```

### farmsTokenInfo

**Definition:**

```typescript
{
  mint: PublicKey;
  decimals: bigint;
  tokenProgram: PublicKey;
  padding: bigint[6];
}
```

### datedPrice

**Definition:**

```typescript
{
  price: price;
  lastUpdatedSlot: bigint;
  unixTimestamp: bigint;
  reserved: bigint[2];
  reserved2: bigint[3];
  index: bigint;
}
```

### price

**Definition:**

```typescript
{
  value: bigint;
  exp: bigint;
}
```

## Errors

- **6000 - StakeZero**: Cannot stake 0 amount _(Hex: `0x1770`)_
- **6001 - UnstakeZero**: Cannot unstake 0 amount _(Hex: `0x1771`)_
- **6002 - NothingToUnstake**: Nothing to unstake _(Hex: `0x1772`)_
- **6003 - NoRewardToHarvest**: No reward to harvest _(Hex: `0x1773`)_
- **6004 - NoRewardInList**: Reward not present in reward list _(Hex: `0x1774`)_
- **6005 - RewardAlreadyInitialized**: Reward already initialized _(Hex: `0x1775`)_
- **6006 - MaxRewardNumberReached**: Max number of reward tokens reached _(Hex: `0x1776`)_
- **6007 - RewardDoesNotExist**: Reward does not exist _(Hex: `0x1777`)_
- **6008 - WrongRewardVaultAccount**: Reward vault exists but the account is wrong _(Hex: `0x1778`)_
- **6009 - RewardVaultMismatch**: Reward vault pubkey does not match staking pool vault _(Hex: `0x1779`)_
- **6010 - RewardVaultAuthorityMismatch**: Reward vault authority pubkey does not match staking pool vault _(Hex: `0x177a`)_
- **6011 - NothingStaked**: Nothing staked, cannot collect any rewards _(Hex: `0x177b`)_
- **6012 - IntegerOverflow**: Integer overflow _(Hex: `0x177c`)_
- **6013 - ConversionFailure**: Conversion failure _(Hex: `0x177d`)_
- **6014 - UnexpectedAccount**: Unexpected account in instruction _(Hex: `0x177e`)_
- **6015 - OperationForbidden**: Operation forbidden _(Hex: `0x177f`)_
- **6016 - MathOverflow**: Mathematical operation with overflow _(Hex: `0x1780`)_
- **6017 - MinClaimDurationNotReached**: Minimum claim duration has not been reached _(Hex: `0x1781`)_
- **6018 - RewardsVaultHasDelegate**: Reward vault has a delegate _(Hex: `0x1782`)_
- **6019 - RewardsVaultHasCloseAuthority**: Reward vault has a close authority _(Hex: `0x1783`)_
- **6020 - FarmVaultHasDelegate**: Farm vault has a delegate _(Hex: `0x1784`)_
- **6021 - FarmVaultHasCloseAuthority**: Farm vault has a close authority _(Hex: `0x1785`)_
- **6022 - RewardsTreasuryVaultHasDelegate**: Reward vault has a delegate _(Hex: `0x1786`)_
- **6023 - RewardsTreasuryVaultHasCloseAuthority**: Reward vault has a close authority _(Hex: `0x1787`)_
- **6024 - UserAtaRewardVaultMintMissmatch**: User ata and reward vault have different mints _(Hex: `0x1788`)_
- **6025 - UserAtaFarmTokenMintMissmatch**: User ata and farm token have different mints _(Hex: `0x1789`)_
- **6026 - TokenFarmTokenMintMissmatch**: Token mint and farm token have different mints _(Hex: `0x178a`)_
- **6027 - RewardAtaRewardMintMissmatch**: Reward ata mint is different than reward mint _(Hex: `0x178b`)_
- **6028 - RewardAtaOwnerNotPayer**: Reward ata owner is different than payer _(Hex: `0x178c`)_
- **6029 - InvalidGlobalConfigMode**: Mode to update global_config is invalid _(Hex: `0x178d`)_
- **6030 - RewardIndexOutOfRange**: Reward Index is higher than number of rewards _(Hex: `0x178e`)_
- **6031 - NothingToWithdraw**: No tokens available to withdraw _(Hex: `0x178f`)_
- **6032 - UserDelegatedFarmNonDelegatedMissmatch**: user, user_ref, authority and payer must match for non-delegated farm _(Hex: `0x1790`)_
- **6033 - AuthorityFarmDelegateMissmatch**: Authority must match farm delegate authority _(Hex: `0x1791`)_
- **6034 - FarmNotDelegated**: Farm not delegated, can not set stake _(Hex: `0x1792`)_
- **6035 - FarmDelegated**: Operation not allowed for delegated farm _(Hex: `0x1793`)_
- **6036 - UnstakeNotElapsed**: Unstake lockup period is not elapsed. Deposit is locked until end of unstake period _(Hex: `0x1794`)_
- **6037 - PendingWithdrawalNotWithdrawnYet**: Pending withdrawal already exist and not withdrawn yet _(Hex: `0x1795`)_
- **6038 - DepositZero**: Cannot deposit zero amount directly to farm vault _(Hex: `0x1796`)_
- **6039 - InvalidConfigValue**: Invalid config value _(Hex: `0x1797`)_
- **6040 - InvalidPenaltyPercentage**: Invalid penalty percentage _(Hex: `0x1798`)_
- **6041 - EarlyWithdrawalNotAllowed**: Early withdrawal not allowed _(Hex: `0x1799`)_
- **6042 - InvalidLockingTimestamps**: Invalid locking timestamps _(Hex: `0x179a`)_
- **6043 - InvalidRpsCurvePoint**: Invalid reward rate curve point _(Hex: `0x179b`)_
- **6044 - InvalidTimestamp**: Invalid timestamp _(Hex: `0x179c`)_
- **6045 - DepositCapReached**: Deposit cap reached _(Hex: `0x179d`)_
- **6046 - MissingScopePrices**: Missing Scope Prices _(Hex: `0x179e`)_
- **6047 - ScopeOraclePriceTooOld**: Scope Oracle Price Too Old _(Hex: `0x179f`)_
- **6048 - InvalidOracleConfig**: Invalid Oracle Config _(Hex: `0x17a0`)_
- **6049 - CouldNotDeserializeScope**: Could not deserialize scope _(Hex: `0x17a1`)_
- **6050 - RewardAtaOwnerNotAdmin**: Reward ata owner is different than farm admin _(Hex: `0x17a2`)_
- **6051 - WithdrawRewardZeroAvailable**: Cannot withdraw reward as available amount is zero _(Hex: `0x17a3`)_
- **6052 - RewardScheduleCurveSet**: Cannot withdraw reward as reward schedule is set _(Hex: `0x17a4`)_
- **6053 - UnsupportedTokenExtension**: Cannot initialize farm while having a mint with token22 and requested extensions _(Hex: `0x17a5`)_
- **6054 - InvalidFarmConfigUpdateAuthority**: Invalid authority for updating farm config _(Hex: `0x17a6`)_
