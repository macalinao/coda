## About

Quarry Mine is the core liquidity mining program of the Quarry protocol: a rewarder distributes rewards across quarries (one per staked token mint), and miners stake into them.

[`@solana-programs/quarry`](https://www.npmjs.com/package/@solana-programs/quarry) bundles all six Quarry programs in one package.

## Usage

```typescript
import {
  fetchMiner,
  getClaimRewardsInstructionAsync,
} from "@solana-programs/quarry-mine";

const miner = await fetchMiner(rpc, minerAddress);

// The miner and the Mint Wrapper minter PDAs are derived automatically.
const instruction = await getClaimRewardsInstructionAsync({
  // ... instruction parameters
});
```
