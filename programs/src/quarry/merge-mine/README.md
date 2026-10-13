## About

Quarry Merge Mine stakes a single deposit into multiple quarries at once by minting replica tokens for a merge pool. Its instructions derive Quarry Mine PDAs (`findMinerPda`, `findQuarryPda`) from [`@solana-programs/quarry-mine`](https://www.npmjs.com/package/@solana-programs/quarry-mine).

Instructions and types that clashed with Quarry Mine when they were rendered into one package keep their `MM` suffix (`claimRewardsMM`, `initMinerMM`, `initMinerMMV2`, `withdrawTokensMM`, `rescueTokensMM`, `ClaimEventMM`).

[`@solana-programs/quarry`](https://www.npmjs.com/package/@solana-programs/quarry) bundles all six Quarry programs in one package.

## Usage

```typescript
import {
  findMergeMinerPda,
  getStakePrimaryMinerInstructionAsync,
} from "@solana-programs/quarry-merge-mine";
```
