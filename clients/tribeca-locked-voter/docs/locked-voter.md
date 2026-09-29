# Locked Voter Program

[![npm version](https://badge.fury.io/js/%40solana-programs%2Ftribeca-locked-voter.svg)](https://www.npmjs.com/package/%40solana-programs%2Ftribeca-locked-voter)

- Program ID: `LocktDzaV1W2Bm9DeZeiyz4J9zs4fRqNiYqQyracRXw`
- TypeScript Client: [`@solana-programs/tribeca-locked-voter`](https://www.npmjs.com/package/@solana-programs/tribeca-locked-voter)

## Table of Contents

- [Accounts](#accounts)
  - [locker](#locker)
  - [lockerWhitelistEntry](#lockerWhitelistEntry)
  - [escrow](#escrow)
- [Instructions](#instructions)
  - [newLocker](#newLocker)
  - [newEscrow](#newEscrow)
  - [lock](#lock)
  - [lockWithWhitelist](#lockWithWhitelist)
  - [lockWithWhitelistEntry](#lockWithWhitelistEntry)
  - [lockPermissionless](#lockPermissionless)
  - [exit](#exit)
  - [activateProposal](#activateProposal)
  - [castVote](#castVote)
  - [setVoteDelegate](#setVoteDelegate)
  - [setLockerParams](#setLockerParams)
  - [approveProgramLockPrivilege](#approveProgramLockPrivilege)
  - [revokeProgramLockPrivilege](#revokeProgramLockPrivilege)
- [PDAs](#pdas)
  - [locker](#locker)
  - [escrow](#escrow)
  - [whitelist](#whitelist)
- [Types](#types)
  - [lockerParams](#lockerParams)
  - [approveLockPrivilegeEvent](#approveLockPrivilegeEvent)
  - [exitEscrowEvent](#exitEscrowEvent)
  - [lockEvent](#lockEvent)
  - [newEscrowEvent](#newEscrowEvent)
  - [newLockerEvent](#newLockerEvent)
  - [revokeLockPrivilegeEvent](#revokeLockPrivilegeEvent)
  - [lockerSetParamsEvent](#lockerSetParamsEvent)
  - [setVoteDelegateEvent](#setVoteDelegateEvent)
- [Errors](#errors)

## Accounts

### locker

**Fields:**

| Field           | Type                            | Description |
| --------------- | ------------------------------- | ----------- |
| `discriminator` | `unknown`                       | -           |
| `base`          | `PublicKey`                     | -           |
| `bump`          | `u8`                            | -           |
| `tokenMint`     | `PublicKey`                     | -           |
| `lockedSupply`  | `u64`                           | -           |
| `governor`      | `PublicKey`                     | -           |
| `params`        | [lockerParams](#lockerParams-3) | -           |

### lockerWhitelistEntry

**Fields:**

| Field           | Type        | Description |
| --------------- | ----------- | ----------- |
| `discriminator` | `unknown`   | -           |
| `bump`          | `u8`        | -           |
| `locker`        | `PublicKey` | -           |
| `programId`     | `PublicKey` | -           |
| `owner`         | `PublicKey` | -           |

### escrow

**Fields:**

| Field             | Type        | Description |
| ----------------- | ----------- | ----------- |
| `discriminator`   | `unknown`   | -           |
| `locker`          | `PublicKey` | -           |
| `owner`           | `PublicKey` | -           |
| `bump`            | `u8`        | -           |
| `tokens`          | `PublicKey` | -           |
| `amount`          | `u64`       | -           |
| `escrowStartedAt` | `i64`       | -           |
| `escrowEndsAt`    | `i64`       | -           |
| `voteDelegate`    | `PublicKey` | -           |

## Instructions

### newLocker

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `base`          | signer           | -           |
| `locker`        | writable         | -           |
| `tokenMint`     | readonly         | -           |
| `governor`      | readonly         | -           |
| `payer`         | signer, writable | -           |
| `systemProgram` | readonly         | -           |

**Arguments:**

| Argument        | Type                            | Description |
| --------------- | ------------------------------- | ----------- |
| `discriminator` | `unknown`                       | -           |
| `bump`          | `u8`                            | -           |
| `params`        | [lockerParams](#lockerParams-3) | -           |

### newEscrow

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `locker`        | readonly         | -           |
| `escrow`        | writable         | -           |
| `escrowOwner`   | readonly         | -           |
| `payer`         | signer, writable | -           |
| `systemProgram` | readonly         | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `bump`          | `u8`      | -           |

### lock

**Accounts:**

| Account        | Type     | Description |
| -------------- | -------- | ----------- |
| `locker`       | writable | -           |
| `escrow`       | writable | -           |
| `escrowTokens` | writable | -           |
| `escrowOwner`  | signer   | -           |
| `sourceTokens` | writable | -           |
| `tokenProgram` | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `amount`        | `u64`     | -           |
| `duration`      | `i64`     | -           |

### lockWithWhitelist

**Accounts:**

| Account              | Type     | Description |
| -------------------- | -------- | ----------- |
| `locker`             | writable | -           |
| `escrow`             | writable | -           |
| `escrowTokens`       | writable | -           |
| `escrowOwner`        | signer   | -           |
| `sourceTokens`       | writable | -           |
| `tokenProgram`       | readonly | -           |
| `instructionsSysvar` | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `amount`        | `u64`     | -           |
| `duration`      | `i64`     | -           |

### lockWithWhitelistEntry

**Accounts:**

| Account              | Type     | Description |
| -------------------- | -------- | ----------- |
| `locker`             | writable | -           |
| `escrow`             | writable | -           |
| `escrowTokens`       | writable | -           |
| `escrowOwner`        | signer   | -           |
| `sourceTokens`       | writable | -           |
| `tokenProgram`       | readonly | -           |
| `instructionsSysvar` | readonly | -           |
| `whitelistEntry`     | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `amount`        | `u64`     | -           |
| `duration`      | `i64`     | -           |

### lockPermissionless

**Accounts:**

| Account        | Type     | Description |
| -------------- | -------- | ----------- |
| `locker`       | writable | -           |
| `escrow`       | writable | -           |
| `escrowTokens` | writable | -           |
| `escrowOwner`  | signer   | -           |
| `sourceTokens` | writable | -           |
| `tokenProgram` | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `amount`        | `u64`     | -           |
| `duration`      | `i64`     | -           |

### exit

**Accounts:**

| Account             | Type             | Description |
| ------------------- | ---------------- | ----------- |
| `locker`            | writable         | -           |
| `escrow`            | writable         | -           |
| `escrowOwner`       | signer           | -           |
| `escrowTokens`      | writable         | -           |
| `destinationTokens` | writable         | -           |
| `payer`             | signer, writable | -           |
| `tokenProgram`      | readonly         | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### activateProposal

**Accounts:**

| Account         | Type     | Description |
| --------------- | -------- | ----------- |
| `locker`        | readonly | -           |
| `governor`      | readonly | -           |
| `proposal`      | writable | -           |
| `escrow`        | readonly | -           |
| `escrowOwner`   | signer   | -           |
| `governProgram` | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### castVote

**Accounts:**

| Account         | Type     | Description |
| --------------- | -------- | ----------- |
| `locker`        | readonly | -           |
| `escrow`        | readonly | -           |
| `voteDelegate`  | signer   | -           |
| `proposal`      | writable | -           |
| `vote`          | writable | -           |
| `governor`      | readonly | -           |
| `governProgram` | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `side`          | `u8`      | -           |

### setVoteDelegate

**Accounts:**

| Account       | Type     | Description |
| ------------- | -------- | ----------- |
| `escrow`      | writable | -           |
| `escrowOwner` | signer   | -           |

**Arguments:**

| Argument        | Type        | Description |
| --------------- | ----------- | ----------- |
| `discriminator` | `unknown`   | -           |
| `newDelegate`   | `PublicKey` | -           |

### setLockerParams

**Accounts:**

| Account       | Type     | Description |
| ------------- | -------- | ----------- |
| `locker`      | writable | -           |
| `governor`    | readonly | -           |
| `smartWallet` | signer   | -           |

**Arguments:**

| Argument        | Type                            | Description |
| --------------- | ------------------------------- | ----------- |
| `discriminator` | `unknown`                       | -           |
| `params`        | [lockerParams](#lockerParams-3) | -           |

### approveProgramLockPrivilege

**Accounts:**

| Account            | Type             | Description |
| ------------------ | ---------------- | ----------- |
| `locker`           | readonly         | -           |
| `whitelistEntry`   | writable         | -           |
| `governor`         | readonly         | -           |
| `smartWallet`      | signer           | -           |
| `executableId`     | readonly         | -           |
| `whitelistedOwner` | readonly         | -           |
| `payer`            | signer, writable | -           |
| `systemProgram`    | readonly         | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `bump`          | `u8`      | -           |

### revokeProgramLockPrivilege

**Accounts:**

| Account          | Type             | Description |
| ---------------- | ---------------- | ----------- |
| `locker`         | readonly         | -           |
| `whitelistEntry` | writable         | -           |
| `governor`       | readonly         | -           |
| `smartWallet`    | signer           | -           |
| `payer`          | signer, writable | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

## PDAs

### locker

Locker account that manages vote escrows for a specific base

**Seeds:**

| Seed       | Type             | Description |
| ---------- | ---------------- | ----------- |
| `constant` | bytes (constant) | -           |
| `base`     | `PublicKey`      | -           |

### escrow

Escrow account that holds locked tokens for a user

**Seeds:**

| Seed        | Type             | Description |
| ----------- | ---------------- | ----------- |
| `constant`  | bytes (constant) | -           |
| `locker`    | `PublicKey`      | -           |
| `authority` | `PublicKey`      | -           |

### whitelist

Whitelist entry for a program that can interact with the locker

**Seeds:**

| Seed        | Type             | Description |
| ----------- | ---------------- | ----------- |
| `constant`  | bytes (constant) | -           |
| `locker`    | `PublicKey`      | -           |
| `programId` | `PublicKey`      | -           |
| `owner`     | `unknown`        | -           |

## Types

### lockerParams

**Definition:**

```typescript
{
  whitelistEnabled: boolean;
  maxStakeVoteMultiplier: bigint;
  minStakeDuration: bigint;
  maxStakeDuration: bigint;
  proposalActivationMinVotes: bigint;
}
```

### approveLockPrivilegeEvent

**Definition:**

```typescript
{
  locker: PublicKey;
  programId: PublicKey;
  owner: PublicKey;
  timestamp: bigint;
}
```

### exitEscrowEvent

**Definition:**

```typescript
{
  escrowOwner: PublicKey;
  locker: PublicKey;
  timestamp: bigint;
  lockerSupply: bigint;
  releasedAmount: bigint;
}
```

### lockEvent

**Definition:**

```typescript
{
  locker: PublicKey;
  escrowOwner: PublicKey;
  tokenMint: PublicKey;
  amount: bigint;
  lockerSupply: bigint;
  duration: bigint;
  prevEscrowEndsAt: bigint;
  nextEscrowEndsAt: bigint;
  nextEscrowStartedAt: bigint;
}
```

### newEscrowEvent

**Definition:**

```typescript
{
  escrow: PublicKey;
  escrowOwner: PublicKey;
  locker: PublicKey;
  timestamp: bigint;
}
```

### newLockerEvent

**Definition:**

```typescript
{
  governor: PublicKey;
  locker: PublicKey;
  tokenMint: PublicKey;
  params: lockerParams;
}
```

### revokeLockPrivilegeEvent

**Definition:**

```typescript
{
  locker: PublicKey;
  programId: PublicKey;
  timestamp: bigint;
}
```

### lockerSetParamsEvent

**Definition:**

```typescript
{
  locker: PublicKey;
  prevParams: lockerParams;
  params: lockerParams;
}
```

### setVoteDelegateEvent

**Definition:**

```typescript
{
  escrowOwner: PublicKey;
  oldDelegate: PublicKey;
  newDelegate: PublicKey;
}
```

## Errors

- **6000 - ProgramNotWhitelisted**: CPI caller not whitelisted to invoke lock instruction. _(Hex: `0x1770`)_
- **6001 - LockupDurationTooShort**: Lockup duration must at least be the min stake duration. _(Hex: `0x1771`)_
- **6002 - LockupDurationTooLong**: Lockup duration must at most be the max stake duration. _(Hex: `0x1772`)_
- **6003 - RefreshCannotShorten**: A voting escrow refresh cannot shorten the escrow time remaining. _(Hex: `0x1773`)_
- **6004 - EscrowNotEnded**: Escrow has not ended. _(Hex: `0x1774`)_
- **6005 - MustProvideWhitelist**: Program whitelist enabled; please provide whitelist entry and instructions sysvar or use the 'lock_with_whitelist' instruction. _(Hex: `0x1775`)_
- **6006 - EscrowOwnerNotWhitelisted**: CPI caller not whitelisted for escrow owner to invoke lock instruction. _(Hex: `0x1776`)_
- **6007 - MustCallLockWithWhitelistEntry**: Must call `lock_with_whitelist_entry` to lock via CPI. _(Hex: `0x1777`)_
- **6008 - MustCallLockPermissionless**: Must call `lock_permissionless` since this DAO does not have a CPI whitelist. _(Hex: `0x1778`)_
