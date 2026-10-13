## Usage

```typescript
import {
  fetchLendingMarket,
  getInitLendingMarketInstruction,
} from "@solana-programs/kamino-klend";

// Fetch account data
const lendingMarket = await fetchLendingMarket(rpc, marketAddress);

// Create instructions
const instruction = getInitLendingMarketInstruction({
  // ... instruction parameters
});
```

[`@solana-programs/kamino-lending`](https://www.npmjs.com/package/@solana-programs/kamino-lending) bundles this package with the Kamino Farms program ([`@solana-programs/kamino-farms`](https://www.npmjs.com/package/@solana-programs/kamino-farms)), which lending reserves and obligations stake into.
