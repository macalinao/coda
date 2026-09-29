# Mpl Token Auth Rules Program

[![npm version](https://badge.fury.io/js/%40solana-programs%2Fmpl-token-auth-rules.svg)](https://www.npmjs.com/package/%40solana-programs%2Fmpl-token-auth-rules)

- Program ID: `auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg`
- TypeScript Client: [`@solana-programs/mpl-token-auth-rules`](https://www.npmjs.com/package/@solana-programs/mpl-token-auth-rules)

## Table of Contents

- [Accounts](#accounts)
  - [frequencyAccount](#frequencyAccount)
- [Instructions](#instructions)
  - [createOrUpdate](#createOrUpdate)
  - [validate](#validate)
  - [writeToBuffer](#writeToBuffer)
  - [puffRuleSet](#puffRuleSet)
- [PDAs](#pdas)
  - [ruleSet](#ruleSet)
  - [ruleSetBuffer](#ruleSetBuffer)
- [Types](#types)
  - [seedsVec](#seedsVec)
  - [proofInfo](#proofInfo)
  - [payload](#payload)
  - [ruleSetHeader](#ruleSetHeader)
  - [ruleSetRevisionMapV1](#ruleSetRevisionMapV1)
  - [createOrUpdateArgs](#createOrUpdateArgs)
  - [validateArgs](#validateArgs)
  - [writeToBufferArgs](#writeToBufferArgs)
  - [puffRuleSetArgs](#puffRuleSetArgs)
  - [payloadType](#payloadType)
  - [key](#key)
- [Errors](#errors)

## Accounts

### frequencyAccount

**Fields:**

| Field        | Type          | Description |
| ------------ | ------------- | ----------- |
| `key`        | [key](#key-3) | -           |
| `lastUpdate` | `i64`         | -           |
| `period`     | `i64`         | -           |

## Instructions

### createOrUpdate

Creates or updates a RuleSet stored in a program-derived account.

A RuleSet is a named, versioned collection of authorization rules

owned by its creator. Each call appends a new revision to the PDA;

existing revisions are preserved so previously-signed operations

remain reproducible. Pass a serialized RuleSet built with the

auth-rules Rust/JS SDK.

**Accounts:**

| Account         | Type             | Description                                 |
| --------------- | ---------------- | ------------------------------------------- |
| `payer`         | signer, writable | Payer and creator of the RuleSet            |
| `ruleSetPda`    | writable         | The PDA account where the RuleSet is stored |
| `systemProgram` | readonly         | System program                              |
| `bufferPda`     | optional         | The buffer to copy a complete ruleset from  |

**Arguments:**

| Argument             | Type                                        | Description                                       |
| -------------------- | ------------------------------------------- | ------------------------------------------------- |
| `discriminator`      | `u8`                                        | -                                                 |
| `createOrUpdateArgs` | [createOrUpdateArgs](#createOrUpdateArgs-3) | The (versioned) CBOR-serialized RuleSet to store. |

### validate

Validates an operation against a stored RuleSet.

Normally invoked via CPI by another program (e.g. Token Metadata)

to decide whether a token operation is permitted. Returns an error

if any rule for the operation fails. When `updateRuleState` is set,

stateful rules such as Frequency are advanced and persisted to the

rule-set state PDA.

**Accounts:**

| Account           | Type                       | Description                                       |
| ----------------- | -------------------------- | ------------------------------------------------- |
| `ruleSetPda`      | readonly                   | The PDA account where the RuleSet is stored       |
| `mint`            | readonly                   | Mint of token asset                               |
| `systemProgram`   | readonly                   | System program                                    |
| `payer`           | signer, writable, optional | Payer for RuleSet state PDA account               |
| `ruleAuthority`   | signer, optional           | Signing authority for any Rule state updates      |
| `ruleSetStatePda` | writable, optional         | The PDA account where any RuleSet state is stored |

**Arguments:**

| Argument        | Type                            | Description                                               |
| --------------- | ------------------------------- | --------------------------------------------------------- |
| `discriminator` | `u8`                            | -                                                         |
| `validateArgs`  | [validateArgs](#validateArgs-3) | The operation to validate together with its rule payload. |

### writeToBuffer

Appends serialized RuleSet bytes to a buffer PDA.

RuleSets larger than a single transaction can hold are streamed in

chunks to a buffer account, then applied in one `createOrUpdate`

call that reads from the buffer.

**Accounts:**

| Account         | Type             | Description                                        |
| --------------- | ---------------- | -------------------------------------------------- |
| `payer`         | signer, writable | Payer and creator of the RuleSet                   |
| `bufferPda`     | writable         | The PDA account where the RuleSet buffer is stored |
| `systemProgram` | readonly         | System program                                     |

**Arguments:**

| Argument            | Type                                      | Description                                     |
| ------------------- | ----------------------------------------- | ----------------------------------------------- |
| `discriminator`     | `u8`                                      | -                                               |
| `writeToBufferArgs` | [writeToBufferArgs](#writeToBufferArgs-3) | The chunk of serialized RuleSet data to append. |

### puffRuleSet

Grows a RuleSet PDA by reallocating additional space.

Used to pre-allocate ("puff up") the account to the size a large

RuleSet will need before writing to it, since a single instruction

can only grow an account by a limited amount.

**Accounts:**

| Account         | Type             | Description                                 |
| --------------- | ---------------- | ------------------------------------------- |
| `payer`         | signer, writable | Payer and creator of the RuleSet            |
| `ruleSetPda`    | writable         | The PDA account where the RuleSet is stored |
| `systemProgram` | readonly         | System program                              |

**Arguments:**

| Argument          | Type                                  | Description                             |
| ----------------- | ------------------------------------- | --------------------------------------- |
| `discriminator`   | `u8`                                  | -                                       |
| `puffRuleSetArgs` | [puffRuleSetArgs](#puffRuleSetArgs-3) | Identifies the RuleSet to grow by name. |

## PDAs

### ruleSet

RuleSet PDA storing a named set of authorization rules

**Seeds:**

| Seed       | Type             | Description                         |
| ---------- | ---------------- | ----------------------------------- |
| `constant` | bytes (constant) | -                                   |
| `owner`    | `PublicKey`      | The owner (creator) of the rule set |
| `name`     | `string`         | The name of the rule set            |

### ruleSetBuffer

Buffer PDA used to assemble large rule sets before applying

**Seeds:**

| Seed       | Type             | Description                         |
| ---------- | ---------------- | ----------------------------------- |
| `constant` | bytes (constant) | -                                   |
| `owner`    | `PublicKey`      | The owner (creator) of the rule set |

## Types

### seedsVec

A list of seeds used to derive and match a program address in a rule.

**Definition:**

```typescript
{
  seeds: unknown[];
}
```

### proofInfo

A Merkle proof used to validate membership against a rule's root hash.

**Definition:**

```typescript
{
  proof: bigint[32][];
}
```

### payload

The runtime values passed to `validate`, keyed by the field name a

rule expects (e.g. the destination address, amount, or a Merkle proof).

**Definition:**

```typescript
{
  map: unknown;
}
```

### ruleSetHeader

On-chain header at the start of a RuleSet PDA, locating its revision map.

**Definition:**

```typescript
{
  key: key;
  revMapVersionLocation: bigint;
}
```

### ruleSetRevisionMapV1

Maps each RuleSet revision to its byte offset within the PDA.

**Definition:**

```typescript
{
  ruleSetRevisions: bigint[];
}
```

### createOrUpdateArgs

Versioned arguments for the `createOrUpdate` instruction.

**Definition:**

```typescript
| { kind: "v1"; serializedRuleSet: unknown }
```

### validateArgs

Versioned arguments for the `validate` instruction.

**Definition:**

```typescript
| { kind: "v1"; operation: unknown; payload: payload; updateRuleState: boolean; ruleSetRevision: bigint | null }
```

### writeToBufferArgs

Versioned arguments for the `writeToBuffer` instruction.

**Definition:**

```typescript
| { kind: "v1"; serializedRuleSet: unknown; overwrite: boolean }
```

### puffRuleSetArgs

Versioned arguments for the `puffRuleSet` instruction.

**Definition:**

```typescript
| { kind: "v1"; ruleSetName: unknown }
```

### payloadType

A single typed value supplied in a `validate` payload.

**Definition:**

```typescript
| { kind: "pubkey"; value: [PublicKey] }
  | { kind: "seeds"; value: [seedsVec] }
  | { kind: "merkleProof"; value: [proofInfo] }
  | { kind: "number"; value: [bigint] }
```

### key

Discriminator identifying the type of an auth-rules account.

**Definition:**

```typescript
| { kind: "uninitialized" }
  | { kind: "ruleSet" }
  | { kind: "frequency" }
```

## Errors

- **0 - NumericalOverflow**: Numerical Overflow _(Hex: `0x0`)_
- **1 - DataTypeMismatch**: Data type mismatch _(Hex: `0x1`)_
- **2 - DataSliceUnexpectedIndexError**: Data slice unexpected index error _(Hex: `0x2`)_
- **3 - IncorrectOwner**: Incorrect account owner _(Hex: `0x3`)_
- **4 - PayloadVecIndexError**: Could not index into PayloadVec _(Hex: `0x4`)_
- **5 - DerivedKeyInvalid**: Derived key invalid _(Hex: `0x5`)_
- **6 - PayerIsNotSigner**: Payer is not a signer _(Hex: `0x6`)_
- **7 - NotImplemented**: Not implemented _(Hex: `0x7`)_
- **8 - BorshSerializationError**: Borsh serialization error _(Hex: `0x8`)_
- **9 - BorshDeserializationError**: Borsh deserialization error _(Hex: `0x9`)_
- **10 - ValueOccupied**: Value in Payload or RuleSet is occupied _(Hex: `0xa`)_
- **11 - DataIsEmpty**: Account data is empty _(Hex: `0xb`)_
- **12 - MessagePackSerializationError**: MessagePack serialization error _(Hex: `0xc`)_
- **13 - MessagePackDeserializationError**: MessagePack deserialization error _(Hex: `0xd`)_
- **14 - MissingAccount**: Missing account _(Hex: `0xe`)_
- **15 - MissingPayloadValue**: Missing Payload value _(Hex: `0xf`)_
- **16 - RuleSetOwnerMismatch**: RuleSet owner must be payer _(Hex: `0x10`)_
- **17 - NameTooLong**: Name too long _(Hex: `0x11`)_
- **18 - OperationNotFound**: The operation retrieved is not in the selected RuleSet _(Hex: `0x12`)_
- **19 - RuleAuthorityIsNotSigner**: Rule authority is not signer _(Hex: `0x13`)_
- **20 - UnsupportedRuleSetRevMapVersion**: Unsupported RuleSet revision map version _(Hex: `0x14`)_
- **21 - UnsupportedRuleSetVersion**: Unsupported RuleSet version _(Hex: `0x15`)_
- **22 - UnexpectedRuleSetFailure**: Unexpected RuleSet failure _(Hex: `0x16`)_
- **23 - RuleSetRevisionNotAvailable**: RuleSet revision not available _(Hex: `0x17`)_
- **24 - AdditionalSignerCheckFailed**: Additional Signer check failed _(Hex: `0x18`)_
- **25 - PubkeyMatchCheckFailed**: Pubkey Match check failed _(Hex: `0x19`)_
- **26 - PubkeyListMatchCheckFailed**: Pubkey List Match check failed _(Hex: `0x1a`)_
- **27 - PubkeyTreeMatchCheckFailed**: Pubkey Tree Match check failed _(Hex: `0x1b`)_
- **28 - PDAMatchCheckFailed**: PDA Match check failed _(Hex: `0x1c`)_
- **29 - ProgramOwnedCheckFailed**: Program Owned check failed _(Hex: `0x1d`)_
- **30 - ProgramOwnedListCheckFailed**: Program Owned List check failed _(Hex: `0x1e`)_
- **31 - ProgramOwnedTreeCheckFailed**: Program Owned Tree check failed _(Hex: `0x1f`)_
- **32 - AmountCheckFailed**: Amount checked failed _(Hex: `0x20`)_
- **33 - FrequencyCheckFailed**: Frequency check failed _(Hex: `0x21`)_
- **34 - IsWalletCheckFailed**: IsWallet check failed _(Hex: `0x22`)_
- **35 - ProgramOwnedSetCheckFailed**: Program Owned Set check failed _(Hex: `0x23`)_
- **36 - InvalidCompareOp**: Invalid compare operator _(Hex: `0x24`)_
- **37 - InvalidConstraintType**: Invalid constraint type value _(Hex: `0x25`)_
- **38 - RuleSetReadFailed**: Failed to read the rule set _(Hex: `0x26`)_
- **39 - DuplicatedOperationName**: Duplicated operation name _(Hex: `0x27`)_
- **40 - AlignmentError**: Could not determine alignemnt _(Hex: `0x28`)_
