## About Orca Whirlpools

Orca Whirlpools is a concentrated liquidity AMM (CLMM) protocol on Solana that enables efficient token swaps with capital-efficient liquidity provision. The protocol allows liquidity providers to concentrate their capital within custom price ranges.

## Usage

```typescript
import {
  fetchWhirlpool,
  getSwapInstruction,
} from "@solana-programs/orca-whirlpools";

// Fetch whirlpool account
const whirlpool = await fetchWhirlpool(rpc, whirlpoolAddress);

// Create swap instruction
const instruction = getSwapInstruction({
  // ... instruction parameters
});
```
