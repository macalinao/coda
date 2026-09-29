# Spl Stake Pool Program

[![npm version](https://badge.fury.io/js/%40solana-programs%2Fspl-stake-pool.svg)](https://www.npmjs.com/package/%40solana-programs%2Fspl-stake-pool)

- Program ID: `SPoo1Ku8WFXoNDMHPsrGSTSG1Y47rzgn41SLUNakuHy`
- TypeScript Client: [`@solana-programs/spl-stake-pool`](https://www.npmjs.com/package/@solana-programs/spl-stake-pool)

## Table of Contents

- [Accounts](#accounts)
  - [stakePool](#stakePool)
  - [validatorList](#validatorList)
- [Instructions](#instructions)
  - [initialize](#initialize)
  - [addValidatorToPool](#addValidatorToPool)
  - [removeValidatorFromPool](#removeValidatorFromPool)
  - [decreaseValidatorStake](#decreaseValidatorStake)
  - [increaseValidatorStake](#increaseValidatorStake)
  - [setPreferredValidator](#setPreferredValidator)
  - [updateValidatorListBalance](#updateValidatorListBalance)
  - [updateStakePoolBalance](#updateStakePoolBalance)
  - [cleanupRemovedValidatorEntries](#cleanupRemovedValidatorEntries)
  - [depositStake](#depositStake)
  - [withdrawStake](#withdrawStake)
  - [setManager](#setManager)
  - [setFee](#setFee)
  - [setStaker](#setStaker)
  - [depositSol](#depositSol)
  - [setFundingAuthority](#setFundingAuthority)
  - [withdrawSol](#withdrawSol)
  - [createTokenMetadata](#createTokenMetadata)
  - [updateTokenMetadata](#updateTokenMetadata)
  - [increaseAdditionalValidatorStake](#increaseAdditionalValidatorStake)
  - [decreaseAdditionalValidatorStake](#decreaseAdditionalValidatorStake)
  - [decreaseValidatorStakeWithReserve](#decreaseValidatorStakeWithReserve)
  - [redelegate](#redelegate)
  - [depositStakeWithSlippage](#depositStakeWithSlippage)
  - [withdrawStakeWithSlippage](#withdrawStakeWithSlippage)
  - [depositSolWithSlippage](#depositSolWithSlippage)
  - [withdrawSolWithSlippage](#withdrawSolWithSlippage)
- [PDAs](#pdas)
  - [withdrawAuthority](#withdrawAuthority)
  - [stake](#stake)
  - [transientStake](#transientStake)
  - [ephemeralStake](#ephemeralStake)
- [Types](#types)
  - [createMetadataAccountArgsV3](#createMetadataAccountArgsV3)
  - [updateMetadataAccountArgsV2](#updateMetadataAccountArgsV2)
  - [dataV2](#dataV2)
  - [podStakeStatus](#podStakeStatus)
  - [lockup](#lockup)
  - [validatorStakeInfo](#validatorStakeInfo)
  - [fee](#fee)
  - [preferredValidatorType](#preferredValidatorType)
  - [fundingType](#fundingType)
  - [accountType](#accountType)
  - [stakeStatus](#stakeStatus)
  - [futureEpoch](#futureEpoch)
  - [feeType](#feeType)
- [Errors](#errors)

## Accounts

### stakePool

Initialized program details.

**Fields:**

| Field                                   | Type                          | Description                                                                                                                                                                                                                                                                                                       |
| --------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `accountType`                           | [accountType](#accountType-3) | Account type, must be `StakePool` currently                                                                                                                                                                                                                                                                       |
| `manager`                               | `PublicKey`                   | Manager authority, allows for updating the staker, manager, and fee account                                                                                                                                                                                                                                       |
| `staker`                                | `PublicKey`                   | Staker authority, allows for adding and removing validators, and managing stake distribution                                                                                                                                                                                                                      |
| `stakeDepositAuthority`                 | `PublicKey`                   | Stake deposit authority If a depositor pubkey is specified on initialization, then deposits must be signed by this authority. If no deposit authority is specified, then the stake pool will default to the result of: `Pubkey::find_program_address( &[&stake_pool_address.as_ref(), b"deposit"], program_id, )` |
| `stakeWithdrawBumpSeed`                 | `u8`                          | Stake withdrawal authority bump seed for `create_program_address(&[state::StakePool account, "withdrawal"])`                                                                                                                                                                                                      |
| `validatorList`                         | `PublicKey`                   | Validator stake list storage account                                                                                                                                                                                                                                                                              |
| `reserveStake`                          | `PublicKey`                   | Reserve stake account, holds deactivated stake                                                                                                                                                                                                                                                                    |
| `poolMint`                              | `PublicKey`                   | Pool Mint                                                                                                                                                                                                                                                                                                         |
| `managerFeeAccount`                     | `PublicKey`                   | Manager fee account                                                                                                                                                                                                                                                                                               |
| `tokenProgramId`                        | `PublicKey`                   | Pool token program id                                                                                                                                                                                                                                                                                             |
| `totalLamports`                         | `u64`                         | Total stake under management. Note that if `last_update_epoch` does not match the current epoch then this field may not be accurate                                                                                                                                                                               |
| `poolTokenSupply`                       | `u64`                         | Total supply of pool tokens (should always match the supply in the Pool Mint)                                                                                                                                                                                                                                     |
| `lastUpdateEpoch`                       | `u64`                         | Last epoch the `total_lamports` field was updated                                                                                                                                                                                                                                                                 |
| `lockup`                                | [lockup](#lockup-3)           | Lockup that all stakes in the pool must have                                                                                                                                                                                                                                                                      |
| `epochFee`                              | [fee](#fee-3)                 | Fee taken as a proportion of rewards each epoch                                                                                                                                                                                                                                                                   |
| `nextEpochFee`                          | [futureEpoch](#futureEpoch-3) | Fee for next epoch                                                                                                                                                                                                                                                                                                |
| `preferredDepositValidatorVoteAddress`  | `PublicKey`                   | null                                                                                                                                                                                                                                                                                                              | Preferred deposit validator vote account pubkey                                                     |
| `preferredWithdrawValidatorVoteAddress` | `PublicKey`                   | null                                                                                                                                                                                                                                                                                                              | Preferred withdraw validator vote account pubkey                                                    |
| `stakeDepositFee`                       | [fee](#fee-3)                 | Fee assessed on stake deposits                                                                                                                                                                                                                                                                                    |
| `stakeWithdrawalFee`                    | [fee](#fee-3)                 | Fee assessed on withdrawals                                                                                                                                                                                                                                                                                       |
| `nextStakeWithdrawalFee`                | [futureEpoch](#futureEpoch-3) | Future stake withdrawal fee, to be set for the following epoch                                                                                                                                                                                                                                                    |
| `stakeReferralFee`                      | `u8`                          | Fees paid out to referrers on referred stake deposits. Expressed as a percentage (0 - 100) of deposit fees. i.e. `stake_deposit_fee`% of stake deposited is collected as deposit fees for every deposit and `stake_referral_fee`% of the collected stake deposit fees is paid out to the referrer                 |
| `solDepositAuthority`                   | `PublicKey`                   | null                                                                                                                                                                                                                                                                                                              | Toggles whether the `DepositSol` instruction requires a signature from this `sol_deposit_authority` |
| `solDepositFee`                         | [fee](#fee-3)                 | Fee assessed on SOL deposits                                                                                                                                                                                                                                                                                      |
| `solReferralFee`                        | `u8`                          | Fees paid out to referrers on referred SOL deposits. Expressed as a percentage (0 - 100) of SOL deposit fees. i.e. `sol_deposit_fee`% of SOL deposited is collected as deposit fees for every deposit and `sol_referral_fee`% of the collected SOL deposit fees is paid out to the referrer                       |
| `solWithdrawAuthority`                  | `PublicKey`                   | null                                                                                                                                                                                                                                                                                                              | Toggles whether the `WithdrawSol` instruction requires a signature from the `deposit_authority`     |
| `solWithdrawalFee`                      | [fee](#fee-3)                 | Fee assessed on SOL withdrawals                                                                                                                                                                                                                                                                                   |
| `nextSolWithdrawalFee`                  | [futureEpoch](#futureEpoch-3) | Future SOL withdrawal fee, to be set for the following epoch                                                                                                                                                                                                                                                      |
| `lastEpochPoolTokenSupply`              | `u64`                         | Last epoch's total pool tokens, used only for APR estimation                                                                                                                                                                                                                                                      |
| `lastEpochTotalLamports`                | `u64`                         | Last epoch's total lamports, used only for APR estimation                                                                                                                                                                                                                                                         |

### validatorList

Storage list for all validator stake accounts in the pool.

**Fields:**

| Field           | Type                                          | Description                                       |
| --------------- | --------------------------------------------- | ------------------------------------------------- |
| `accountType`   | [accountType](#accountType-3)                 | Account type, must be `ValidatorList` currently   |
| `maxValidators` | `u32`                                         | Maximum allowable number of validators            |
| `validators`    | [validatorStakeInfo](#validatorStakeInfo-3)[] | List of stake info for each validator in the pool |

## Instructions

### initialize

Initializes a new `StakePool`.

0. `[w]` New `StakePool` to create.

1. `[s]` Manager

2. `[]` Staker

3. `[]` Stake pool withdraw authority

4. `[w]` Uninitialized validator stake list storage account

5. `[]` Reserve stake account must be initialized, have zero balance,

and staker / withdrawer authority set to pool withdraw authority.

6. `[]` Pool token mint. Must have zero supply, owned by withdraw

authority.

7. `[]` Pool account to deposit the generated fee for manager.

8. `[]` Token program id

9. `[]` (Optional) Deposit authority that must sign all deposits.

Defaults to the program address generated using

`find_deposit_authority_program_address`, making deposits

permissionless.

**Accounts:**

| Account             | Type     | Description |
| ------------------- | -------- | ----------- |
| `stakePool`         | writable | -           |
| `manager`           | signer   | -           |
| `staker`            | readonly | -           |
| `withdrawAuthority` | readonly | -           |
| `validatorList`     | writable | -           |
| `reserveStake`      | readonly | -           |
| `poolMint`          | readonly | -           |
| `feeAccount`        | readonly | -           |
| `tokenProgram`      | readonly | -           |
| `depositAuthority`  | signer   | -           |

**Arguments:**

| Argument        | Type          | Description |
| --------------- | ------------- | ----------- |
| `discriminator` | `u8`          | -           |
| `fee`           | [fee](#fee-3) | -           |
| `withdrawalFee` | [fee](#fee-3) | -           |
| `depositFee`    | [fee](#fee-3) | -           |
| `referralFee`   | `u8`          | -           |
| `maxValidators` | `u32`         | -           |

### addValidatorToPool

(Staker only) Adds stake account delegated to validator to the pool's

list of managed validators.

The stake account will have the rent-exempt amount plus

`max(

crate::MINIMUM_ACTIVE_STAKE,

solana_program::stake::tools::get_minimum_delegation()

)`.

It is funded from the stake pool reserve.

0. `[w]` Stake pool

1. `[s]` Staker

2. `[w]` Reserve stake account

3. `[]` Stake pool withdraw authority

4. `[w]` Validator stake list storage account

5. `[w]` Stake account to add to the pool

6. `[]` Validator this stake account will be delegated to

7. `[]` Rent sysvar

8. `[]` Clock sysvar

9. '[]' Stake history sysvar

10. '[]' Stake config sysvar

11. `[]` System program

12. `[]` Stake program

User data: optional non-zero `u32` seed used for generating the

validator stake address

**Accounts:**

| Account                | Type     | Description                                       |
| ---------------------- | -------- | ------------------------------------------------- |
| `stakePool`            | writable | Stake pool                                        |
| `staker`               | signer   | Staker                                            |
| `reserveStakeAccount`  | writable | Reserve stake account                             |
| `withdrawAuthority`    | readonly | Stake pool withdraw authority                     |
| `validatorStakeList`   | writable | Validator stake list storage account              |
| `newStakeAccount`      | writable | Stake account to add to the pool                  |
| `validatorVoteAccount` | readonly | Validator this stake account will be delegated to |
| `rentSysvar`           | readonly | Rent sysvar                                       |
| `clockSysvar`          | readonly | Clock sysvar                                      |
| `stakeHistorySysvar`   | readonly | Stake history sysvar                              |
| `stakeConfigSysvar`    | readonly | Stake config sysvar                               |
| `systemProgram`        | readonly | System program                                    |
| `stakeProgram`         | readonly | Stake program                                     |

**Arguments:**

| Argument        | Type  | Description |
| --------------- | ----- | ----------- |
| `discriminator` | `u8`  | -           |
| `args`          | `u32` | -           |

### removeValidatorFromPool

(Staker only) Removes validator from the pool, deactivating its stake

Only succeeds if the validator stake account has the minimum of

`max(crate::MINIMUM_ACTIVE_STAKE,

solana_program::stake::tools::get_minimum_delegation())`. plus the

rent-exempt amount.

0. `[w]` Stake pool

1. `[s]` Staker

2. `[]` Stake pool withdraw authority

3. `[w]` Validator stake list storage account

4. `[w]` Stake account to remove from the pool

5. `[w]` Transient stake account, to deactivate if necessary

6. `[]` Sysvar clock

7. `[]` Stake program id,

**Accounts:**

| Account                 | Type     | Description                                         |
| ----------------------- | -------- | --------------------------------------------------- |
| `stakePool`             | writable | Stake pool                                          |
| `staker`                | signer   | Staker                                              |
| `withdrawAuthority`     | readonly | Stake pool withdraw authority                       |
| `validatorStakeList`    | writable | Validator stake list storage account                |
| `stakeAccount`          | writable | Stake account to remove from the pool               |
| `transientStakeAccount` | writable | Transient stake account, to deactivate if necessary |
| `clockSysvar`           | readonly | Sysvar clock                                        |
| `stakeProgram`          | readonly | Stake program id                                    |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` | -           |

### decreaseValidatorStake

NOTE: This instruction has been deprecated since version 0.7.0. Please

use `DecreaseValidatorStakeWithReserve` instead.

(Staker only) Decrease active stake on a validator, eventually moving it

to the reserve

Internally, this instruction splits a validator stake account into its

corresponding transient stake account and deactivates it.

In order to rebalance the pool without taking custody, the staker needs

a way of reducing the stake on a stake account. This instruction splits

some amount of stake, up to the total activated stake, from the

canonical validator stake account, into its "transient" stake

account.

The instruction only succeeds if the transient stake account does not

exist. The amount of lamports to move must be at least rent-exemption

plus `max(crate::MINIMUM_ACTIVE_STAKE,

solana_program::stake::tools::get_minimum_delegation())`.

0. `[]` Stake pool

1. `[s]` Stake pool staker

2. `[]` Stake pool withdraw authority

3. `[w]` Validator list

4. `[w]` Canonical stake account to split from

5. `[w]` Transient stake account to receive split

6. `[]` Clock sysvar

7. `[]` Rent sysvar

8. `[]` System program

9. `[]` Stake program

**Accounts:**

| Account                 | Type     | Description |
| ----------------------- | -------- | ----------- |
| `stakePool`             | readonly | -           |
| `staker`                | signer   | -           |
| `withdrawAuthority`     | readonly | -           |
| `validatorList`         | writable | -           |
| `stakeAccount`          | writable | -           |
| `transientStakeAccount` | writable | -           |
| `clockSysvar`           | readonly | -           |
| `rentSysvar`            | readonly | -           |
| `systemProgram`         | readonly | -           |
| `stakeProgram`          | readonly | -           |

**Arguments:**

| Argument             | Type  | Description |
| -------------------- | ----- | ----------- |
| `discriminator`      | `u8`  | -           |
| `lamports`           | `u64` | -           |
| `transientStakeSeed` | `u64` | -           |

### increaseValidatorStake

(Staker only) Increase stake on a validator from the reserve account

Internally, this instruction splits reserve stake into a transient stake

account and delegate to the appropriate validator.

`UpdateValidatorListBalance` will do the work of merging once it's

ready.

This instruction only succeeds if the transient stake account does not

exist. The minimum amount to move is rent-exemption plus

`max(crate::MINIMUM_ACTIVE_STAKE,

solana_program::stake::tools::get_minimum_delegation())`.

0. `[]` Stake pool

1. `[s]` Stake pool staker

2. `[]` Stake pool withdraw authority

3. `[w]` Validator list

4. `[w]` Stake pool reserve stake

5. `[w]` Transient stake account

6. `[]` Validator stake account

7. `[]` Validator vote account to delegate to

8. '[]' Clock sysvar

9. '[]' Rent sysvar

10. `[]` Stake History sysvar

11. `[]` Stake Config sysvar

12. `[]` System program

13. `[]` Stake program

User data: amount of lamports to increase on the given validator.

The actual amount split into the transient stake account is:

`lamports + stake_rent_exemption`.

The rent-exemption of the stake account is withdrawn back to the

reserve after it is merged.

**Accounts:**

| Account                 | Type     | Description |
| ----------------------- | -------- | ----------- |
| `stakePool`             | readonly | -           |
| `staker`                | signer   | -           |
| `withdrawAuthority`     | readonly | -           |
| `validatorList`         | writable | -           |
| `reserveStake`          | writable | -           |
| `transientStakeAccount` | writable | -           |
| `validatorStakeAccount` | readonly | -           |
| `validatorVoteAccount`  | readonly | -           |
| `clockSysvar`           | readonly | -           |
| `rentSysvar`            | readonly | -           |
| `stakeHistorySysvar`    | readonly | -           |
| `stakeConfigSysvar`     | readonly | -           |
| `systemProgram`         | readonly | -           |
| `stakeProgram`          | readonly | -           |

**Arguments:**

| Argument             | Type  | Description |
| -------------------- | ----- | ----------- |
| `discriminator`      | `u8`  | -           |
| `lamports`           | `u64` | -           |
| `transientStakeSeed` | `u64` | -           |

### setPreferredValidator

(Staker only) Set the preferred deposit or withdraw stake account for

the stake pool

In order to avoid users abusing the stake pool as a free conversion

between SOL staked on different validators, the staker can force all

deposits and/or withdraws to go to one chosen account, or unset that

account.

0. `[w]` Stake pool

1. `[s]` Stake pool staker

2. `[]` Validator list

Fails if the validator is not part of the stake pool.

**Accounts:**

| Account         | Type     | Description |
| --------------- | -------- | ----------- |
| `stakePool`     | writable | -           |
| `staker`        | signer   | -           |
| `validatorList` | readonly | -           |

**Arguments:**

| Argument               | Type                                                | Description |
| ---------------------- | --------------------------------------------------- | ----------- |
| `discriminator`        | `u8`                                                | -           |
| `validatorType`        | [preferredValidatorType](#preferredValidatorType-3) | -           |
| `validatorVoteAddress` | `PublicKey`                                         | null        | -   |

### updateValidatorListBalance

Updates balances of validator and transient stake accounts in the pool

While going through the pairs of validator and transient stake

accounts, if the transient stake is inactive, it is merged into the

reserve stake account. If the transient stake is active and has

matching credits observed, it is merged into the canonical

validator stake account. In all other states, nothing is done, and

the balance is simply added to the canonical stake account balance.

0. `[]` Stake pool

1. `[]` Stake pool withdraw authority

2. `[w]` Validator stake list storage account

3. `[w]` Reserve stake account

4. `[]` Sysvar clock

5. `[]` Sysvar stake history

6. `[]` Stake program

7. `..7+2N` [] N pairs of validator and transient stake accounts

**Accounts:**

| Account              | Type     | Description |
| -------------------- | -------- | ----------- |
| `stakePool`          | readonly | -           |
| `withdrawAuthority`  | readonly | -           |
| `validatorList`      | writable | -           |
| `reserveStake`       | writable | -           |
| `clockSysvar`        | readonly | -           |
| `stakeHistorySysvar` | readonly | -           |
| `stakeProgram`       | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `u8`      | -           |
| `startIndex`    | `u32`     | -           |
| `noMerge`       | `boolean` | -           |

### updateStakePoolBalance

Updates total pool balance based on balances in the reserve and

validator list

0. `[w]` Stake pool

1. `[]` Stake pool withdraw authority

2. `[w]` Validator stake list storage account

3. `[]` Reserve stake account

4. `[w]` Account to receive pool fee tokens

5. `[w]` Pool mint account

6. `[]` Pool token program

**Accounts:**

| Account             | Type     | Description |
| ------------------- | -------- | ----------- |
| `stakePool`         | writable | -           |
| `withdrawAuthority` | readonly | -           |
| `validatorList`     | writable | -           |
| `reserveStake`      | readonly | -           |
| `feeAccount`        | writable | -           |
| `poolMint`          | writable | -           |
| `tokenProgram`      | readonly | -           |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` | -           |

### cleanupRemovedValidatorEntries

Cleans up validator stake account entries marked as `ReadyForRemoval`

0. `[]` Stake pool

1. `[w]` Validator stake list storage account

**Accounts:**

| Account         | Type     | Description |
| --------------- | -------- | ----------- |
| `stakePool`     | readonly | -           |
| `validatorList` | writable | -           |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` | -           |

### depositStake

Deposit some stake into the pool. The output is a "pool" token

representing ownership into the pool. Inputs are converted to the

current ratio.

0. `[w]` Stake pool

1. `[w]` Validator stake list storage account

2. `[s]/[]` Stake pool deposit authority

3. `[]` Stake pool withdraw authority

4. `[w]` Stake account to join the pool (withdraw authority for the

stake account should be first set to the stake pool deposit

authority)

5. `[w]` Validator stake account for the stake account to be merged

with

6. `[w]` Reserve stake account, to withdraw rent exempt reserve

7. `[w]` User account to receive pool tokens

8. `[w]` Account to receive pool fee tokens

9. `[w]` Account to receive a portion of pool fee tokens as referral

fees

10. `[w]` Pool token mint account

11. '[]' Sysvar clock account

12. '[]' Sysvar stake history account

13. `[]` Pool token program id,

14. `[]` Stake program id,

**Accounts:**

| Account                 | Type     | Description |
| ----------------------- | -------- | ----------- |
| `stakePool`             | writable | -           |
| `validatorList`         | writable | -           |
| `depositAuthority`      | signer   | -           |
| `withdrawAuthority`     | readonly | -           |
| `stakeToMerge`          | writable | -           |
| `validatorStakeAccount` | writable | -           |
| `reserveStake`          | writable | -           |
| `userPoolTokenAccount`  | writable | -           |
| `feeAccount`            | writable | -           |
| `referralFeeAccount`    | writable | -           |
| `poolMint`              | writable | -           |
| `clockSysvar`           | readonly | -           |
| `stakeHistorySysvar`    | readonly | -           |
| `tokenProgram`          | readonly | -           |
| `stakeProgram`          | readonly | -           |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` | -           |

### withdrawStake

Withdraw the token from the pool at the current ratio.

Succeeds if the stake account has enough SOL to cover the desired

amount of pool tokens, and if the withdrawal keeps the total

staked amount above the minimum of rent-exempt amount plus `max(

crate::MINIMUM_ACTIVE_STAKE,

solana_program::stake::tools::get_minimum_delegation()

)`.

When allowing withdrawals, the order of priority goes:

- preferred withdraw validator stake account (if set)

- validator stake accounts

- transient stake accounts

- reserve stake account OR totally remove validator stake accounts

A user can freely withdraw from a validator stake account, and if they

are all at the minimum, then they can withdraw from transient stake

accounts, and if they are all at minimum, then they can withdraw from

the reserve or remove any validator from the pool.

0. `[w]` Stake pool

1. `[w]` Validator stake list storage account

2. `[]` Stake pool withdraw authority

3. `[w]` Validator or reserve stake account to split

4. `[w]` Uninitialized stake account to receive withdrawal

5. `[]` User account to set as a new withdraw authority

6. `[s]` User transfer authority, for pool token account

7. `[w]` User account with pool tokens to burn from

8. `[w]` Account to receive pool fee tokens

9. `[w]` Pool token mint account

10. `[]` Sysvar clock account (required)

11. `[]` Pool token program id

12. `[]` Stake program id,

User data: amount of pool tokens to withdraw

**Accounts:**

| Account                   | Type     | Description               |
| ------------------------- | -------- | ------------------------- |
| `stakePool`               | writable | Stake pool                |
| `validatorList`           | writable | Validator list            |
| `withdrawAuthority`       | readonly | Withdraw authority        |
| `sourceStakeAccount`      | writable | Source stake account      |
| `destinationStakeAccount` | writable | Destination stake account |
| `newWithdrawAuthority`    | readonly | New withdraw authority    |
| `userTransferAuthority`   | signer   | User transfer authority   |
| `userPoolTokenAccount`    | writable | User pool token account   |
| `feeAccount`              | writable | Fee account               |
| `poolMint`                | writable | Pool mint                 |
| `clockSysvar`             | readonly | Clock sysvar              |
| `tokenProgram`            | readonly | Token program             |
| `stakeProgram`            | readonly | Stake program             |

**Arguments:**

| Argument        | Type  | Description |
| --------------- | ----- | ----------- |
| `discriminator` | `u8`  | -           |
| `args`          | `u64` | -           |

### setManager

(Manager only) Update manager

0. `[w]` Stake pool

1. `[s]` Manager

2. `[s]` New manager

3. `[]` New manager fee account

**Accounts:**

| Account                | Type     | Description             |
| ---------------------- | -------- | ----------------------- |
| `stakePool`            | writable | Stake pool              |
| `manager`              | signer   | Manager                 |
| `newManager`           | signer   | New manager             |
| `newManagerFeeAccount` | readonly | New manager fee account |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` | -           |

### setFee

(Manager only) Update fee

0. `[w]` Stake pool

1. `[s]` Manager

**Accounts:**

| Account     | Type     | Description |
| ----------- | -------- | ----------- |
| `stakePool` | writable | Stake pool  |
| `manager`   | signer   | Manager     |

**Arguments:**

| Argument        | Type                  | Description |
| --------------- | --------------------- | ----------- |
| `discriminator` | `u8`                  | -           |
| `fee`           | [feeType](#feeType-3) | -           |

### setStaker

(Manager or staker only) Update staker

0. `[w]` Stake pool

1. `[s]` Manager or current staker

2. '[]` New staker pubkey

**Accounts:**

| Account           | Type     | Description               |
| ----------------- | -------- | ------------------------- |
| `stakePool`       | writable | Stake pool                |
| `authority`       | signer   | Manager or current staker |
| `newStakerPubkey` | readonly | New staker pubkey         |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` | -           |

### depositSol

Deposit SOL directly into the pool's reserve account. The output is a

"pool" token representing ownership into the pool. Inputs are

converted to the current ratio.

0. `[w]` Stake pool

1. `[]` Stake pool withdraw authority

2. `[w]` Reserve stake account, to deposit SOL

3. `[s]` Account providing the lamports to be deposited into the pool

4. `[w]` User account to receive pool tokens

5. `[w]` Account to receive fee tokens

6. `[w]` Account to receive a portion of fee as referral fees

7. `[w]` Pool token mint account

8. `[]` System program account

9. `[]` Token program id

10. `[s]` (Optional) Stake pool sol deposit authority.

**Accounts:**

| Account                | Type             | Description                                                  |
| ---------------------- | ---------------- | ------------------------------------------------------------ |
| `stakePool`            | writable         | Stake pool                                                   |
| `withdrawAuthority`    | readonly         | Stake pool withdraw authority                                |
| `reserveStake`         | writable         | Reserve stake account, to deposit SOL                        |
| `payer`                | signer, writable | Account providing the lamports to be deposited into the pool |
| `userPoolTokenAccount` | writable         | User account to receive pool tokens                          |
| `managerFeeAccount`    | writable         | Account to receive fee tokens                                |
| `referralPoolAccount`  | writable         | Account to receive a portion of fee as referral fees         |
| `poolMint`             | writable         | Pool token mint account                                      |
| `systemProgram`        | readonly         | System program account                                       |
| `tokenProgram`         | readonly         | Token program id                                             |
| `depositAuthority`     | signer, optional | (Optional) Stake pool sol deposit authority.                 |

**Arguments:**

| Argument        | Type  | Description |
| --------------- | ----- | ----------- |
| `discriminator` | `u8`  | -           |
| `args`          | `u64` | -           |

### setFundingAuthority

(Manager only) Update SOL deposit, stake deposit, or SOL withdrawal

authority.

0. `[w]` Stake pool

1. `[s]` Manager

2. '[]` New authority pubkey or none

**Accounts:**

| Account              | Type     | Description          |
| -------------------- | -------- | -------------------- |
| `stakePool`          | writable | Stake pool           |
| `manager`            | signer   | Manager              |
| `newAuthorityPubkey` | readonly | New authority pubkey |

**Arguments:**

| Argument        | Type                          | Description |
| --------------- | ----------------------------- | ----------- |
| `discriminator` | `u8`                          | -           |
| `fundingType`   | [fundingType](#fundingType-3) | -           |

### withdrawSol

Withdraw SOL directly from the pool's reserve account. Fails if the

reserve does not have enough SOL.

0. `[w]` Stake pool

1. `[]` Stake pool withdraw authority

2. `[s]` User transfer authority, for pool token account

3. `[w]` User account to burn pool tokens

4. `[w]` Reserve stake account, to withdraw SOL

5. `[w]` Account receiving the lamports from the reserve, must be a

system account

6. `[w]` Account to receive pool fee tokens

7. `[w]` Pool token mint account

8. '[]' Clock sysvar

9. '[]' Stake history sysvar

10. `[]` Stake program account

11. `[]` Token program id

12. `[s]` (Optional) Stake pool sol withdraw authority

**Accounts:**

| Account                    | Type             | Description                |
| -------------------------- | ---------------- | -------------------------- |
| `stakePool`                | writable         | Stake pool                 |
| `withdrawAuthority`        | readonly         | Withdraw authority         |
| `userTransferAuthority`    | signer           | User transfer authority    |
| `userPoolTokenAccount`     | writable         | User pool token account    |
| `reserveStake`             | writable         | Reserve stake              |
| `destinationSystemAccount` | writable         | Destination system account |
| `feeAccount`               | writable         | Fee account                |
| `poolMint`                 | writable         | Pool mint                  |
| `clockSysvar`              | readonly         | Clock sysvar               |
| `stakeHistorySysvar`       | readonly         | Stake history sysvar       |
| `stakeProgram`             | readonly         | Stake program              |
| `tokenProgram`             | readonly         | Token program              |
| `solWithdrawAuthority`     | signer, optional | Sol withdraw authority     |

**Arguments:**

| Argument        | Type  | Description |
| --------------- | ----- | ----------- |
| `discriminator` | `u8`  | -           |
| `args`          | `u64` | -           |

### createTokenMetadata

Create token metadata for the stake-pool token in the

metaplex-token program

0. `[]` Stake pool

1. `[s]` Manager

2. `[]` Stake pool withdraw authority

3. `[]` Pool token mint account

4. `[s, w]` Payer for creation of token metadata account

5. `[w]` Token metadata account

6. `[]` Metadata program id

7. `[]` System program id

**Accounts:**

| Account             | Type             | Description |
| ------------------- | ---------------- | ----------- |
| `stakePool`         | readonly         | -           |
| `manager`           | signer           | -           |
| `withdrawAuthority` | readonly         | -           |
| `poolMint`          | readonly         | -           |
| `payer`             | signer, writable | -           |
| `metadataAccount`   | writable         | -           |
| `metadataProgram`   | readonly         | -           |
| `systemProgram`     | readonly         | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `u8`      | -           |
| `name`          | `unknown` | -           |
| `symbol`        | `unknown` | -           |
| `uri`           | `unknown` | -           |

### updateTokenMetadata

Update token metadata for the stake-pool token in the

metaplex-token program

0. `[]` Stake pool

1. `[s]` Manager

2. `[]` Stake pool withdraw authority

3. `[w]` Token metadata account

4. `[]` Metadata program id

**Accounts:**

| Account             | Type     | Description |
| ------------------- | -------- | ----------- |
| `stakePool`         | readonly | -           |
| `manager`           | signer   | -           |
| `withdrawAuthority` | readonly | -           |
| `metadataAccount`   | writable | -           |
| `metadataProgram`   | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `u8`      | -           |
| `name`          | `unknown` | -           |
| `symbol`        | `unknown` | -           |
| `uri`           | `unknown` | -           |

### increaseAdditionalValidatorStake

(Staker only) Increase stake on a validator again in an epoch.

Works regardless if the transient stake account exists.

Internally, this instruction splits reserve stake into an ephemeral

stake account, activates it, then merges or splits it into the

transient stake account delegated to the appropriate validator.

`UpdateValidatorListBalance` will do the work of merging once it's

ready.

The minimum amount to move is rent-exemption plus

`max(crate::MINIMUM_ACTIVE_STAKE,

solana_program::stake::tools::get_minimum_delegation())`.

0. `[]` Stake pool

1. `[s]` Stake pool staker

2. `[]` Stake pool withdraw authority

3. `[w]` Validator list

4. `[w]` Stake pool reserve stake

5. `[w]` Uninitialized ephemeral stake account to receive stake

6. `[w]` Transient stake account

7. `[]` Validator stake account

8. `[]` Validator vote account to delegate to

9. '[]' Clock sysvar

10. `[]` Stake History sysvar

11. `[]` Stake Config sysvar

12. `[]` System program

13. `[]` Stake program

User data: amount of lamports to increase on the given validator.

The actual amount split into the transient stake account is:

`lamports + stake_rent_exemption`.

The rent-exemption of the stake account is withdrawn back to the

reserve after it is merged.

**Accounts:**

| Account              | Type     | Description |
| -------------------- | -------- | ----------- |
| `stakePool`          | readonly | -           |
| `staker`             | signer   | -           |
| `withdrawAuthority`  | readonly | -           |
| `validatorList`      | writable | -           |
| `reserveStake`       | writable | -           |
| `ephemeralStake`     | writable | -           |
| `transientStake`     | writable | -           |
| `validatorStake`     | readonly | -           |
| `validatorVote`      | readonly | -           |
| `clockSysvar`        | readonly | -           |
| `stakeHistorySysvar` | readonly | -           |
| `stakeConfigSysvar`  | readonly | -           |
| `systemProgram`      | readonly | -           |
| `stakeProgram`       | readonly | -           |

**Arguments:**

| Argument             | Type  | Description |
| -------------------- | ----- | ----------- |
| `discriminator`      | `u8`  | -           |
| `lamports`           | `u64` | -           |
| `transientStakeSeed` | `u64` | -           |
| `ephemeralStakeSeed` | `u64` | -           |

### decreaseAdditionalValidatorStake

(Staker only) Decrease active stake again from a validator, eventually

moving it to the reserve

Works regardless if the transient stake account already exists.

Internally, this instruction:

- withdraws rent-exempt reserve lamports from the reserve into the

ephemeral stake

- splits a validator stake account into an ephemeral stake account

- deactivates the ephemeral account

- merges or splits the ephemeral account into the transient stake

account delegated to the appropriate validator

The amount of lamports to move must be at least

`max(crate::MINIMUM_ACTIVE_STAKE,

solana_program::stake::tools::get_minimum_delegation())`.

0. `[]` Stake pool

1. `[s]` Stake pool staker

2. `[]` Stake pool withdraw authority

3. `[w]` Validator list

4. `[w]` Reserve stake account, to fund rent exempt reserve

5. `[w]` Canonical stake account to split from

6. `[w]` Uninitialized ephemeral stake account to receive stake

7. `[w]` Transient stake account

8. `[]` Clock sysvar

9. '[]' Stake history sysvar

10. `[]` System program

11. `[]` Stake program

**Accounts:**

| Account              | Type     | Description |
| -------------------- | -------- | ----------- |
| `stakePool`          | readonly | -           |
| `staker`             | signer   | -           |
| `withdrawAuthority`  | readonly | -           |
| `validatorList`      | writable | -           |
| `reserveStake`       | writable | -           |
| `canonicalStake`     | writable | -           |
| `ephemeralStake`     | writable | -           |
| `transientStake`     | writable | -           |
| `clockSysvar`        | readonly | -           |
| `stakeHistorySysvar` | readonly | -           |
| `systemProgram`      | readonly | -           |
| `stakeProgram`       | readonly | -           |

**Arguments:**

| Argument             | Type  | Description |
| -------------------- | ----- | ----------- |
| `discriminator`      | `u8`  | -           |
| `lamports`           | `u64` | -           |
| `transientStakeSeed` | `u64` | -           |
| `ephemeralStakeSeed` | `u64` | -           |

### decreaseValidatorStakeWithReserve

(Staker only) Decrease active stake on a validator, eventually moving it

to the reserve

Internally, this instruction:

- withdraws enough lamports to make the transient account rent-exempt

- splits from a validator stake account into a transient stake account

- deactivates the transient stake account

In order to rebalance the pool without taking custody, the staker needs

a way of reducing the stake on a stake account. This instruction splits

some amount of stake, up to the total activated stake, from the

canonical validator stake account, into its "transient" stake

account.

The instruction only succeeds if the transient stake account does not

exist. The amount of lamports to move must be at least rent-exemption

plus `max(crate::MINIMUM_ACTIVE_STAKE,

solana_program::stake::tools::get_minimum_delegation())`.

0. `[]` Stake pool

1. `[s]` Stake pool staker

2. `[]` Stake pool withdraw authority

3. `[w]` Validator list

4. `[w]` Reserve stake account, to fund rent exempt reserve

5. `[w]` Canonical stake account to split from

6. `[w]` Transient stake account to receive split

7. `[]` Clock sysvar

8. '[]' Stake history sysvar

9. `[]` System program

10. `[]` Stake program

**Accounts:**

| Account              | Type     | Description |
| -------------------- | -------- | ----------- |
| `stakePool`          | readonly | -           |
| `staker`             | signer   | -           |
| `withdrawAuthority`  | readonly | -           |
| `validatorList`      | writable | -           |
| `reserveStake`       | writable | -           |
| `canonicalStake`     | writable | -           |
| `transientStake`     | writable | -           |
| `clockSysvar`        | readonly | -           |
| `stakeHistorySysvar` | readonly | -           |
| `systemProgram`      | readonly | -           |
| `stakeProgram`       | readonly | -           |

**Arguments:**

| Argument             | Type  | Description |
| -------------------- | ----- | ----------- |
| `discriminator`      | `u8`  | -           |
| `lamports`           | `u64` | -           |
| `transientStakeSeed` | `u64` | -           |

### redelegate

(Staker only) Redelegate active stake on a validator, eventually moving

it to another

Internally, this instruction splits a validator stake account into its

corresponding transient stake account, redelegates it to an ephemeral

stake account, then merges that stake into the destination transient

stake account.

In order to rebalance the pool without taking custody, the staker needs

a way of reducing the stake on a stake account. This instruction splits

some amount of stake, up to the total activated stake, from the

canonical validator stake account, into its "transient" stake

account.

The instruction only succeeds if the source transient stake account and

ephemeral stake account do not exist.

The amount of lamports to move must be at least rent-exemption plus the

minimum delegation amount. Rent-exemption plus minimum delegation

is required for the destination ephemeral stake account.

The rent-exemption for the source transient account comes from the stake

pool reserve, if needed.

The amount that arrives at the destination validator in the end is

`redelegate_lamports - rent_exemption` if the destination transient

account does _not_ exist, and `redelegate_lamports` if the destination

transient account already exists. The `rent_exemption` is not activated

when creating the destination transient stake account, but if it already

exists, then the full amount is delegated.

0. `[]` Stake pool

1. `[s]` Stake pool staker

2. `[]` Stake pool withdraw authority

3. `[w]` Validator list

4. `[w]` Reserve stake account, to withdraw rent exempt reserve

5. `[w]` Source canonical stake account to split from

6. `[w]` Source transient stake account to receive split and be

redelegated

7. `[w]` Uninitialized ephemeral stake account to receive redelegation

8. `[w]` Destination transient stake account to receive ephemeral stake

by merge

9. `[]` Destination stake account to receive transient stake after

activation

10. `[]` Destination validator vote account

11. `[]` Clock sysvar

12. `[]` Stake History sysvar

13. `[]` Stake Config sysvar

14. `[]` System program

15. `[]` Stake program

**Accounts:**

| Account                     | Type     | Description |
| --------------------------- | -------- | ----------- |
| `stakePool`                 | readonly | -           |
| `staker`                    | signer   | -           |
| `withdrawAuthority`         | readonly | -           |
| `validatorList`             | writable | -           |
| `reserveStake`              | writable | -           |
| `sourceCanonicalStake`      | writable | -           |
| `sourceTransientStake`      | writable | -           |
| `ephemeralStake`            | writable | -           |
| `destinationTransientStake` | writable | -           |
| `destinationStake`          | readonly | -           |
| `destinationVote`           | readonly | -           |
| `clockSysvar`               | readonly | -           |
| `stakeHistorySysvar`        | readonly | -           |
| `stakeConfigSysvar`         | readonly | -           |
| `systemProgram`             | readonly | -           |
| `stakeProgram`              | readonly | -           |

**Arguments:**

| Argument                        | Type  | Description |
| ------------------------------- | ----- | ----------- |
| `discriminator`                 | `u8`  | -           |
| `lamports`                      | `u64` | -           |
| `sourceTransientStakeSeed`      | `u64` | -           |
| `ephemeralStakeSeed`            | `u64` | -           |
| `destinationTransientStakeSeed` | `u64` | -           |

### depositStakeWithSlippage

Deposit some stake into the pool, with a specified slippage

constraint. The output is a "pool" token representing ownership

into the pool. Inputs are converted at the current ratio.

0. `[w]` Stake pool

1. `[w]` Validator stake list storage account

2. `[s]/[]` Stake pool deposit authority

3. `[]` Stake pool withdraw authority

4. `[w]` Stake account to join the pool (withdraw authority for the

stake account should be first set to the stake pool deposit

authority)

5. `[w]` Validator stake account for the stake account to be merged

with

6. `[w]` Reserve stake account, to withdraw rent exempt reserve

7. `[w]` User account to receive pool tokens

8. `[w]` Account to receive pool fee tokens

9. `[w]` Account to receive a portion of pool fee tokens as referral

fees

10. `[w]` Pool token mint account

11. '[]' Sysvar clock account

12. '[]' Sysvar stake history account

13. `[]` Pool token program id,

14. `[]` Stake program id,

**Accounts:**

| Account                 | Type     | Description |
| ----------------------- | -------- | ----------- |
| `stakePool`             | writable | -           |
| `validatorList`         | writable | -           |
| `depositAuthority`      | signer   | -           |
| `withdrawAuthority`     | readonly | -           |
| `stakeToMerge`          | writable | -           |
| `validatorStakeAccount` | writable | -           |
| `reserveStake`          | writable | -           |
| `userPoolTokenAccount`  | writable | -           |
| `feeAccount`            | writable | -           |
| `referralFeeAccount`    | writable | -           |
| `poolMint`              | writable | -           |
| `clockSysvar`           | readonly | -           |
| `stakeHistorySysvar`    | readonly | -           |
| `tokenProgram`          | readonly | -           |
| `stakeProgram`          | readonly | -           |

**Arguments:**

| Argument               | Type  | Description |
| ---------------------- | ----- | ----------- |
| `discriminator`        | `u8`  | -           |
| `minimumPoolTokensOut` | `u64` | -           |

### withdrawStakeWithSlippage

Withdraw the token from the pool at the current ratio, specifying a

minimum expected output lamport amount.

Succeeds if the stake account has enough SOL to cover the desired

amount of pool tokens, and if the withdrawal keeps the total

staked amount above the minimum of rent-exempt amount plus `max(

crate::MINIMUM_ACTIVE_STAKE,

solana_program::stake::tools::get_minimum_delegation()

)`.

0. `[w]` Stake pool

1. `[w]` Validator stake list storage account

2. `[]` Stake pool withdraw authority

3. `[w]` Validator or reserve stake account to split

4. `[w]` Uninitialized stake account to receive withdrawal

5. `[]` User account to set as a new withdraw authority

6. `[s]` User transfer authority, for pool token account

7. `[w]` User account with pool tokens to burn from

8. `[w]` Account to receive pool fee tokens

9. `[w]` Pool token mint account

10. `[]` Sysvar clock account (required)

11. `[]` Pool token program id

12. `[]` Stake program id,

User data: amount of pool tokens to withdraw

**Accounts:**

| Account                   | Type     | Description |
| ------------------------- | -------- | ----------- |
| `stakePool`               | writable | -           |
| `validatorList`           | writable | -           |
| `withdrawAuthority`       | readonly | -           |
| `sourceStakeAccount`      | writable | -           |
| `destinationStakeAccount` | writable | -           |
| `newWithdrawAuthority`    | readonly | -           |
| `userTransferAuthority`   | signer   | -           |
| `userPoolTokenAccount`    | writable | -           |
| `feeAccount`              | writable | -           |
| `poolMint`                | writable | -           |
| `clockSysvar`             | readonly | -           |
| `tokenProgram`            | readonly | -           |
| `stakeProgram`            | readonly | -           |

**Arguments:**

| Argument             | Type  | Description |
| -------------------- | ----- | ----------- |
| `discriminator`      | `u8`  | -           |
| `poolTokensIn`       | `u64` | -           |
| `minimumLamportsOut` | `u64` | -           |

### depositSolWithSlippage

Deposit SOL directly into the pool's reserve account, with a

specified slippage constraint. The output is a "pool" token

representing ownership into the pool. Inputs are converted at the

current ratio.

0. `[w]` Stake pool

1. `[]` Stake pool withdraw authority

2. `[w]` Reserve stake account, to deposit SOL

3. `[s]` Account providing the lamports to be deposited into the pool

4. `[w]` User account to receive pool tokens

5. `[w]` Account to receive fee tokens

6. `[w]` Account to receive a portion of fee as referral fees

7. `[w]` Pool token mint account

8. `[]` System program account

9. `[]` Token program id

10. `[s]` (Optional) Stake pool sol deposit authority.

**Accounts:**

| Account                | Type     | Description                      |
| ---------------------- | -------- | -------------------------------- |
| `stakePool`            | writable | Stake pool                       |
| `withdrawAuthority`    | readonly | Stake pool withdraw authority    |
| `reserveStake`         | writable | Reserve stake                    |
| `payer`                | signer   | Payer                            |
| `userPoolTokenAccount` | writable | User pool token account          |
| `feeAccount`           | writable | Fee account                      |
| `referralFeeAccount`   | writable | Referral fee account             |
| `poolMint`             | writable | Pool mint                        |
| `systemProgram`        | readonly | System program                   |
| `tokenProgram`         | readonly | Token program                    |
| `solDepositAuthority`  | signer   | Stake pool sol deposit authority |

**Arguments:**

| Argument               | Type  | Description |
| ---------------------- | ----- | ----------- |
| `discriminator`        | `u8`  | -           |
| `lamportsIn`           | `u64` | -           |
| `minimumPoolTokensOut` | `u64` | -           |

### withdrawSolWithSlippage

Withdraw SOL directly from the pool's reserve account. Fails if the

reserve does not have enough SOL or if the slippage constraint is not

met.

0. `[w]` Stake pool

1. `[]` Stake pool withdraw authority

2. `[s]` User transfer authority, for pool token account

3. `[w]` User account to burn pool tokens

4. `[w]` Reserve stake account, to withdraw SOL

5. `[w]` Account receiving the lamports from the reserve, must be a

system account

6. `[w]` Account to receive pool fee tokens

7. `[w]` Pool token mint account

8. '[]' Clock sysvar

9. '[]' Stake history sysvar

10. `[]` Stake program account

11. `[]` Token program id

12. `[s]` (Optional) Stake pool sol withdraw authority

**Accounts:**

| Account                    | Type     | Description                       |
| -------------------------- | -------- | --------------------------------- |
| `stakePool`                | writable | Stake pool                        |
| `withdrawAuthority`        | readonly | Stake pool withdraw authority     |
| `userTransferAuthority`    | signer   | User transfer authority           |
| `userPoolTokenAccount`     | writable | User pool token account           |
| `reserveStake`             | writable | Reserve stake                     |
| `destinationSystemAccount` | writable | Destination system account        |
| `feeAccount`               | writable | Fee account                       |
| `poolMint`                 | writable | Pool mint                         |
| `clockSysvar`              | readonly | Clock sysvar                      |
| `stakeHistorySysvar`       | readonly | Stake history sysvar              |
| `stakeProgram`             | readonly | Stake program                     |
| `tokenProgram`             | readonly | Token program                     |
| `solWithdrawAuthority`     | signer   | Stake pool sol withdraw authority |

**Arguments:**

| Argument             | Type  | Description |
| -------------------- | ----- | ----------- |
| `discriminator`      | `u8`  | -           |
| `poolTokensIn`       | `u64` | -           |
| `minimumLamportsOut` | `u64` | -           |

## PDAs

### withdrawAuthority

**Seeds:**

| Seed               | Type             | Description |
| ------------------ | ---------------- | ----------- |
| `stakePoolAddress` | `PublicKey`      | -           |
| `constant`         | bytes (constant) | -           |

### stake

**Seeds:**

| Seed                 | Type        | Description |
| -------------------- | ----------- | ----------- |
| `voteAccountAddress` | `PublicKey` | -           |
| `stakePoolAddress`   | `PublicKey` | -           |
| `seed`               | `unknown`   | -           |

### transientStake

**Seeds:**

| Seed                 | Type             | Description |
| -------------------- | ---------------- | ----------- |
| `constant`           | bytes (constant) | -           |
| `voteAccountAddress` | `PublicKey`      | -           |
| `stakePoolAddress`   | `PublicKey`      | -           |
| `seed`               | `u64`            | -           |

### ephemeralStake

**Seeds:**

| Seed               | Type             | Description |
| ------------------ | ---------------- | ----------- |
| `constant`         | bytes (constant) | -           |
| `stakePoolAddress` | `PublicKey`      | -           |
| `seed`             | `u64`            | -           |

## Types

### createMetadataAccountArgsV3

**Definition:**

```typescript
{
  data: dataV2;
  isMutable: boolean;
  collectionDetails: bigint | null;
}
```

### updateMetadataAccountArgsV2

**Definition:**

```typescript
{
  data: dataV2 | null;
  updateAuthority: PublicKey | null;
  primarySaleHappened: boolean | null;
  isMutable: boolean | null;
}
```

### dataV2

**Definition:**

```typescript
{
  name: unknown;
  symbol: unknown;
  uri: unknown;
  sellerFeeBasisPoints: bigint;
  creators: bigint | null;
  collection: bigint | null;
  uses: bigint | null;
}
```

### podStakeStatus

Wrapper struct that can be `Pod`, containing a byte that _should_ be a valid

`StakeStatus` underneath.

**Definition:**

```typescript
{
  status: bigint;
}
```

### lockup

**Definition:**

```typescript
{
  unixTimestamp: bigint;
  epoch: bigint;
  custodian: PublicKey;
}
```

### validatorStakeInfo

Information about a validator in the pool

NOTE: ORDER IS VERY IMPORTANT HERE, PLEASE DO NOT RE-ORDER THE FIELDS UNLESS

THERE'S AN EXTREMELY GOOD REASON.

To save on BPF instructions, the serialized bytes are reinterpreted with a

`bytemuck` transmute, which means that this structure cannot have any

undeclared alignment-padding in its representation.

**Definition:**

```typescript
{
  activeStakeLamports: bigint;
  transientStakeLamports: bigint;
  lastUpdateEpoch: bigint;
  transientSeedSuffix: bigint;
  unused: bigint;
  validatorSeedSuffix: bigint;
  status: podStakeStatus;
  voteAccountAddress: PublicKey;
}
```

### fee

Fee rate as a ratio, minted on `UpdateStakePoolBalance` as a proportion of

the rewards

If either the numerator or the denominator is 0, the fee is considered to be

0

**Definition:**

```typescript
{
  denominator: bigint;
  numerator: bigint;
}
```

### preferredValidatorType

Defines which validator vote account is set during the

`SetPreferredValidator` instruction

**Definition:**

```typescript
| { kind: "deposit" }
  | { kind: "withdraw" }
```

### fundingType

Defines which authority to update in the `SetFundingAuthority`

instruction

**Definition:**

```typescript
| { kind: "stakeDeposit" }
  | { kind: "solDeposit" }
  | { kind: "solWithdraw" }
```

### accountType

Enum representing the account type managed by the program

**Definition:**

```typescript
| { kind: "uninitialized" }
  | { kind: "stakePool" }
  | { kind: "validatorList" }
```

### stakeStatus

Status of the stake account in the validator list, for accounting

**Definition:**

```typescript
| { kind: "active" }
  | { kind: "deactivatingTransient" }
  | { kind: "readyForRemoval" }
  | { kind: "deactivatingValidator" }
  | { kind: "deactivatingAll" }
```

### futureEpoch

Wrapper type that "counts down" epochs, which is Borsh-compatible with the

native `Option`

**Definition:**

```typescript
| { kind: "none" }
  | { kind: "one"; value: [fee] }
  | { kind: "two"; value: [fee] }
```

### feeType

The type of fees that can be set on the stake pool

**Definition:**

```typescript
| { kind: "solReferral"; value: [bigint] }
  | { kind: "stakeReferral"; value: [bigint] }
  | { kind: "epoch"; value: [fee] }
  | { kind: "stakeWithdrawal"; value: [fee] }
  | { kind: "solDeposit"; value: [fee] }
  | { kind: "stakeDeposit"; value: [fee] }
  | { kind: "solWithdrawal"; value: [fee] }
```

## Errors

- **0 - AlreadyInUse**: AlreadyInUse _(Hex: `0x0`)_
- **1 - InvalidProgramAddress**: InvalidProgramAddress _(Hex: `0x1`)_
- **2 - InvalidState**: InvalidState _(Hex: `0x2`)_
- **3 - CalculationFailure**: CalculationFailure _(Hex: `0x3`)_
- **4 - FeeTooHigh**: FeeTooHigh _(Hex: `0x4`)_
- **5 - WrongAccountMint**: WrongAccountMint _(Hex: `0x5`)_
- **6 - WrongManager**: WrongManager _(Hex: `0x6`)_
- **7 - SignatureMissing**: SignatureMissing _(Hex: `0x7`)_
- **8 - InvalidValidatorStakeList**: InvalidValidatorStakeList _(Hex: `0x8`)_
- **9 - InvalidFeeAccount**: InvalidFeeAccount _(Hex: `0x9`)_
- **10 - WrongPoolMint**: WrongPoolMint _(Hex: `0xa`)_
- **11 - WrongStakeStake**: WrongStakeStake _(Hex: `0xb`)_
- **12 - UserStakeNotActive**: UserStakeNotActive _(Hex: `0xc`)_
- **13 - ValidatorAlreadyAdded**: ValidatorAlreadyAdded _(Hex: `0xd`)_
- **14 - ValidatorNotFound**: ValidatorNotFound _(Hex: `0xe`)_
- **15 - InvalidStakeAccountAddress**: InvalidStakeAccountAddress _(Hex: `0xf`)_
- **16 - StakeListOutOfDate**: StakeListOutOfDate _(Hex: `0x10`)_
- **17 - StakeListAndPoolOutOfDate**: StakeListAndPoolOutOfDate _(Hex: `0x11`)_
- **18 - UnknownValidatorStakeAccount**: UnknownValidatorStakeAccount _(Hex: `0x12`)_
- **19 - WrongMintingAuthority**: WrongMintingAuthority _(Hex: `0x13`)_
- **20 - UnexpectedValidatorListAccountSize**: UnexpectedValidatorListAccountSize _(Hex: `0x14`)_
- **21 - WrongStaker**: WrongStaker _(Hex: `0x15`)_
- **22 - NonZeroPoolTokenSupply**: NonZeroPoolTokenSupply _(Hex: `0x16`)_
- **23 - StakeLamportsNotEqualToMinimum**: StakeLamportsNotEqualToMinimum _(Hex: `0x17`)_
- **24 - IncorrectDepositVoteAddress**: IncorrectDepositVoteAddress _(Hex: `0x18`)_
- **25 - IncorrectWithdrawVoteAddress**: IncorrectWithdrawVoteAddress _(Hex: `0x19`)_
- **26 - InvalidMintFreezeAuthority**: InvalidMintFreezeAuthority _(Hex: `0x1a`)_
- **27 - FeeIncreaseTooHigh**: FeeIncreaseTooHigh _(Hex: `0x1b`)_
- **28 - WithdrawalTooSmall**: WithdrawalTooSmall _(Hex: `0x1c`)_
- **29 - DepositTooSmall**: DepositTooSmall _(Hex: `0x1d`)_
- **30 - InvalidStakeDepositAuthority**: InvalidStakeDepositAuthority _(Hex: `0x1e`)_
- **31 - InvalidSolDepositAuthority**: InvalidSolDepositAuthority _(Hex: `0x1f`)_
- **32 - InvalidPreferredValidator**: InvalidPreferredValidator _(Hex: `0x20`)_
- **33 - TransientAccountInUse**: TransientAccountInUse _(Hex: `0x21`)_
- **34 - InvalidSolWithdrawAuthority**: InvalidSolWithdrawAuthority _(Hex: `0x22`)_
- **35 - SolWithdrawalTooLarge**: SolWithdrawalTooLarge _(Hex: `0x23`)_
- **36 - InvalidMetadataAccount**: InvalidMetadataAccount _(Hex: `0x24`)_
- **37 - UnsupportedMintExtension**: UnsupportedMintExtension _(Hex: `0x25`)_
- **38 - UnsupportedFeeAccountExtension**: UnsupportedFeeAccountExtension _(Hex: `0x26`)_
- **39 - ExceededSlippage**: Instruction exceeds desired slippage limit _(Hex: `0x27`)_
- **40 - IncorrectMintDecimals**: IncorrectMintDecimals _(Hex: `0x28`)_
- **41 - ReserveDepleted**: ReserveDepleted _(Hex: `0x29`)_
- **42 - MissingRequiredSysvar**: Missing required sysvar account _(Hex: `0x2a`)_
