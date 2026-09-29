The client ships PDA helpers for the pool withdraw authority, validator stake accounts (with and without custom seeds), and the transient and ephemeral stake accounts used during delegation.

## Usage

```typescript
import {
  findStakePda,
  findWithdrawAuthorityPda,
} from "@solana-programs/spl-stake-pool";

// Get withdraw authority PDA
const withdrawAuthorityPda = await findWithdrawAuthorityPda({
  stakePool: stakePoolPublicKey,
});

// Get stake account PDA
const stakePda = await findStakePda({
  voteAccount: validatorVoteAccount,
  stakePool: stakePoolPublicKey,
});
```
