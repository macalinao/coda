## Usage

```typescript
import {
  fetchLendingMarket,
  getInitLendingMarketInstruction,
} from "@solana-programs/kamino-lending";

// Fetch account data
const lendingMarket = await fetchLendingMarket(rpc, marketAddress);

// Create instructions
const instruction = getInitLendingMarketInstruction({
  // ... instruction parameters
});
```

The Kamino Farms program, which lending reserves and obligations stake into, is published separately as [`@solana-programs/kamino-farms`](https://www.npmjs.com/package/@solana-programs/kamino-farms).
