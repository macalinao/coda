# Govern Program

[![npm version](https://badge.fury.io/js/%40solana-programs%2Ftribeca-govern.svg)](https://www.npmjs.com/package/%40solana-programs%2Ftribeca-govern)

- Program ID: `Govz1VyoyLD5BL6CSCxUJLVLsQHRwjfFj1prNsdNg5Jw`
- TypeScript Client: [`@solana-programs/tribeca-govern`](https://www.npmjs.com/package/@solana-programs/tribeca-govern)

## Table of Contents

- [Accounts](#accounts)
  - [governor](#governor)
  - [proposal](#proposal)
  - [proposalMeta](#proposalMeta)
  - [vote](#vote)
- [Instructions](#instructions)
  - [createGovernor](#createGovernor)
  - [createProposal](#createProposal)
  - [activateProposal](#activateProposal)
  - [cancelProposal](#cancelProposal)
  - [queueProposal](#queueProposal)
  - [newVote](#newVote)
  - [setVote](#setVote)
  - [setGovernanceParams](#setGovernanceParams)
  - [setElectorate](#setElectorate)
  - [createProposalMeta](#createProposalMeta)
- [PDAs](#pdas)
  - [governor](#governor)
  - [proposal](#proposal)
  - [vote](#vote)
  - [proposalMeta](#proposalMeta)
- [Types](#types)
  - [governanceParameters](#governanceParameters)
  - [proposalInstruction](#proposalInstruction)
  - [proposalAccountMeta](#proposalAccountMeta)
  - [proposalState](#proposalState)
  - [voteSide](#voteSide)
  - [governorCreateEvent](#governorCreateEvent)
  - [proposalCreateEvent](#proposalCreateEvent)
  - [proposalActivateEvent](#proposalActivateEvent)
  - [proposalCancelEvent](#proposalCancelEvent)
  - [proposalQueueEvent](#proposalQueueEvent)
  - [voteSetEvent](#voteSetEvent)
  - [proposalMetaCreateEvent](#proposalMetaCreateEvent)
  - [governorSetParamsEvent](#governorSetParamsEvent)
  - [governorSetElectorateEvent](#governorSetElectorateEvent)
- [Errors](#errors)

## Accounts

### governor

**Fields:**

| Field           | Type                                            | Description |
| --------------- | ----------------------------------------------- | ----------- |
| `discriminator` | `unknown`                                       | -           |
| `base`          | `PublicKey`                                     | -           |
| `bump`          | `u8`                                            | -           |
| `proposalCount` | `u64`                                           | -           |
| `electorate`    | `PublicKey`                                     | -           |
| `smartWallet`   | `PublicKey`                                     | -           |
| `params`        | [governanceParameters](#governanceParameters-3) | -           |

### proposal

**Fields:**

| Field               | Type                                            | Description |
| ------------------- | ----------------------------------------------- | ----------- |
| `discriminator`     | `unknown`                                       | -           |
| `governor`          | `PublicKey`                                     | -           |
| `index`             | `u64`                                           | -           |
| `bump`              | `u8`                                            | -           |
| `proposer`          | `PublicKey`                                     | -           |
| `quorumVotes`       | `u64`                                           | -           |
| `forVotes`          | `u64`                                           | -           |
| `againstVotes`      | `u64`                                           | -           |
| `abstainVotes`      | `u64`                                           | -           |
| `canceledAt`        | `i64`                                           | -           |
| `createdAt`         | `i64`                                           | -           |
| `activatedAt`       | `i64`                                           | -           |
| `votingEndsAt`      | `i64`                                           | -           |
| `queuedAt`          | `i64`                                           | -           |
| `queuedTransaction` | `PublicKey`                                     | -           |
| `instructions`      | [proposalInstruction](#proposalInstruction-3)[] | -           |

### proposalMeta

**Fields:**

| Field             | Type        | Description |
| ----------------- | ----------- | ----------- |
| `discriminator`   | `unknown`   | -           |
| `proposal`        | `PublicKey` | -           |
| `title`           | `unknown`   | -           |
| `descriptionLink` | `unknown`   | -           |

### vote

**Fields:**

| Field           | Type        | Description |
| --------------- | ----------- | ----------- |
| `discriminator` | `unknown`   | -           |
| `proposal`      | `PublicKey` | -           |
| `voter`         | `PublicKey` | -           |
| `bump`          | `u8`        | -           |
| `side`          | `u8`        | -           |
| `weight`        | `u64`       | -           |

## Instructions

### createGovernor

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `base`          | signer           | -           |
| `governor`      | writable         | -           |
| `smartWallet`   | readonly         | -           |
| `payer`         | signer, writable | -           |
| `systemProgram` | readonly         | -           |

**Arguments:**

| Argument        | Type                                            | Description |
| --------------- | ----------------------------------------------- | ----------- |
| `discriminator` | `unknown`                                       | -           |
| `bump`          | `u8`                                            | -           |
| `electorate`    | `PublicKey`                                     | -           |
| `params`        | [governanceParameters](#governanceParameters-3) | -           |

### createProposal

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `governor`      | writable         | -           |
| `proposal`      | writable         | -           |
| `proposer`      | signer           | -           |
| `payer`         | signer, writable | -           |
| `systemProgram` | readonly         | -           |

**Arguments:**

| Argument        | Type                                            | Description |
| --------------- | ----------------------------------------------- | ----------- |
| `discriminator` | `unknown`                                       | -           |
| `bump`          | `u8`                                            | -           |
| `instructions`  | [proposalInstruction](#proposalInstruction-3)[] | -           |

### activateProposal

**Accounts:**

| Account      | Type     | Description |
| ------------ | -------- | ----------- |
| `governor`   | readonly | -           |
| `proposal`   | writable | -           |
| `electorate` | signer   | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### cancelProposal

**Accounts:**

| Account    | Type     | Description |
| ---------- | -------- | ----------- |
| `governor` | readonly | -           |
| `proposal` | writable | -           |
| `proposer` | signer   | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### queueProposal

**Accounts:**

| Account              | Type             | Description |
| -------------------- | ---------------- | ----------- |
| `governor`           | readonly         | -           |
| `proposal`           | writable         | -           |
| `transaction`        | writable         | -           |
| `smartWallet`        | writable         | -           |
| `payer`              | signer, writable | -           |
| `smartWalletProgram` | readonly         | -           |
| `systemProgram`      | readonly         | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `txBump`        | `u8`      | -           |

### newVote

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `proposal`      | readonly         | -           |
| `vote`          | writable         | -           |
| `payer`         | signer, writable | -           |
| `systemProgram` | readonly         | -           |

**Arguments:**

| Argument        | Type        | Description |
| --------------- | ----------- | ----------- |
| `discriminator` | `unknown`   | -           |
| `bump`          | `u8`        | -           |
| `voter`         | `PublicKey` | -           |

### setVote

**Accounts:**

| Account      | Type     | Description |
| ------------ | -------- | ----------- |
| `governor`   | readonly | -           |
| `proposal`   | writable | -           |
| `vote`       | writable | -           |
| `electorate` | signer   | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `side`          | `u8`      | -           |
| `weight`        | `u64`     | -           |

### setGovernanceParams

**Accounts:**

| Account       | Type     | Description |
| ------------- | -------- | ----------- |
| `governor`    | writable | -           |
| `smartWallet` | signer   | -           |

**Arguments:**

| Argument        | Type                                            | Description |
| --------------- | ----------------------------------------------- | ----------- |
| `discriminator` | `unknown`                                       | -           |
| `params`        | [governanceParameters](#governanceParameters-3) | -           |

### setElectorate

**Accounts:**

| Account       | Type     | Description |
| ------------- | -------- | ----------- |
| `governor`    | writable | -           |
| `smartWallet` | signer   | -           |

**Arguments:**

| Argument        | Type        | Description |
| --------------- | ----------- | ----------- |
| `discriminator` | `unknown`   | -           |
| `newElectorate` | `PublicKey` | -           |

### createProposalMeta

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `proposal`      | readonly         | -           |
| `proposer`      | signer           | -           |
| `proposalMeta`  | writable         | -           |
| `payer`         | signer, writable | -           |
| `systemProgram` | readonly         | -           |

**Arguments:**

| Argument          | Type      | Description |
| ----------------- | --------- | ----------- |
| `discriminator`   | `unknown` | -           |
| `bump`            | `u8`      | -           |
| `title`           | `unknown` | -           |
| `descriptionLink` | `unknown` | -           |

## PDAs

### governor

Governor account that manages proposals and voting

**Seeds:**

| Seed       | Type             | Description |
| ---------- | ---------------- | ----------- |
| `constant` | bytes (constant) | -           |
| `base`     | `PublicKey`      | -           |

### proposal

Proposal account for governance actions

**Seeds:**

| Seed       | Type             | Description |
| ---------- | ---------------- | ----------- |
| `constant` | bytes (constant) | -           |
| `governor` | `PublicKey`      | -           |
| `index`    | `u64`            | -           |

### vote

Vote account representing a voter's decision on a proposal

**Seeds:**

| Seed       | Type             | Description |
| ---------- | ---------------- | ----------- |
| `constant` | bytes (constant) | -           |
| `proposal` | `PublicKey`      | -           |
| `voter`    | `PublicKey`      | -           |

### proposalMeta

Proposal metadata account with additional information

**Seeds:**

| Seed       | Type             | Description |
| ---------- | ---------------- | ----------- |
| `constant` | bytes (constant) | -           |
| `proposal` | `PublicKey`      | -           |

## Types

### governanceParameters

**Definition:**

```typescript
{
  votingDelay: bigint;
  votingPeriod: bigint;
  quorumVotes: bigint;
  timelockDelaySeconds: bigint;
}
```

### proposalInstruction

**Definition:**

```typescript
{
  programId: PublicKey;
  keys: proposalAccountMeta[];
  data: unknown;
}
```

### proposalAccountMeta

**Definition:**

```typescript
{
  pubkey: PublicKey;
  isSigner: boolean;
  isWritable: boolean;
}
```

### proposalState

**Definition:**

```typescript
| { kind: "draft" }
  | { kind: "active" }
  | { kind: "canceled" }
  | { kind: "defeated" }
  | { kind: "succeeded" }
  | { kind: "queued" }
```

### voteSide

**Definition:**

```typescript
| { kind: "pending" }
  | { kind: "against" }
  | { kind: "for" }
  | { kind: "abstain" }
```

### governorCreateEvent

**Definition:**

```typescript
{
  governor: PublicKey;
  electorate: PublicKey;
  smartWallet: PublicKey;
  parameters: governanceParameters;
}
```

### proposalCreateEvent

**Definition:**

```typescript
{
  governor: PublicKey;
  proposal: PublicKey;
  index: bigint;
  instructions: proposalInstruction[];
}
```

### proposalActivateEvent

**Definition:**

```typescript
{
  governor: PublicKey;
  proposal: PublicKey;
  votingEndsAt: bigint;
}
```

### proposalCancelEvent

**Definition:**

```typescript
{
  governor: PublicKey;
  proposal: PublicKey;
}
```

### proposalQueueEvent

**Definition:**

```typescript
{
  governor: PublicKey;
  proposal: PublicKey;
  transaction: PublicKey;
}
```

### voteSetEvent

**Definition:**

```typescript
{
  governor: PublicKey;
  proposal: PublicKey;
  voter: PublicKey;
  vote: PublicKey;
  side: bigint;
  weight: bigint;
}
```

### proposalMetaCreateEvent

**Definition:**

```typescript
{
  governor: PublicKey;
  proposal: PublicKey;
  title: unknown;
  descriptionLink: unknown;
}
```

### governorSetParamsEvent

**Definition:**

```typescript
{
  governor: PublicKey;
  prevParams: governanceParameters;
  params: governanceParameters;
}
```

### governorSetElectorateEvent

**Definition:**

```typescript
{
  governor: PublicKey;
  prevElectorate: PublicKey;
  newElectorate: PublicKey;
}
```

## Errors

- **6000 - InvalidVoteSide**: Invalid vote side. _(Hex: `0x1770`)_
- **6001 - GovernorNotFound**: The owner of the smart wallet doesn't match with current. _(Hex: `0x1771`)_
- **6002 - VotingDelayNotMet**: The proposal cannot be activated since it has not yet passed the voting delay. _(Hex: `0x1772`)_
- **6003 - ProposalNotDraft**: Only drafts can be canceled. _(Hex: `0x1773`)_
- **6004 - ProposalNotActive**: The proposal must be active. _(Hex: `0x1774`)_
