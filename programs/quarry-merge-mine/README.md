## About

Quarry Merge Mine stakes a single deposit into multiple quarries at once by minting replica tokens for a merge pool. Its instructions derive Quarry Mine PDAs (`findMinerPda`, `findQuarryPda`) from [`@solana-programs/quarry-mine`](https://www.npmjs.com/package/@solana-programs/quarry-mine).

Instructions and types that clashed with Quarry Mine in the combined `@solana-programs/quarry` client keep their `MM` suffix (`claimRewardsMM`, `initMinerMM`, `initMinerMMV2`, `withdrawTokensMM`, `rescueTokensMM`, `ClaimEventMM`).

This package was previously part of `@solana-programs/quarry`, which bundled all six Quarry programs.

## Usage

```typescript
import {
  findMergeMinerPda,
  getStakePrimaryMinerInstructionAsync,
} from "@solana-programs/quarry-merge-mine";
```
