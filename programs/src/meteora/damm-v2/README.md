TypeScript client for the [Meteora DAMM V2](https://github.com/MeteoraAg/damm-v2) (CP-AMM) program.

## Usage

```typescript
import {
  fetchPool,
  findPoolPda,
  getSwapInstructionAsync,
} from "@solana-programs/meteora-damm-v2";

// Find and fetch a pool
const [poolAddress] = await findPoolPda({
  config: configAddress,
  tokenAMint: tokenAMintAddress,
  tokenBMint: tokenBMintAddress,
});
const pool = await fetchPool(rpc, poolAddress);

// Create a swap instruction (accounts are auto-derived)
const ix = await getSwapInstructionAsync({
  pool: poolAddress,
  inputTokenMint: tokenAMintAddress,
  outputTokenMint: tokenBMintAddress,
  userInputToken: userTokenAAccount,
  userOutputToken: userTokenBAccount,
  user: userSigner,
  amountIn: 1000000n,
  minimumAmountOut: 0n,
});
```

## Resources

- [DAMM V2 Program](https://github.com/MeteoraAg/damm-v2)
- [Official SDK](https://github.com/MeteoraAg/damm-v2-sdk)
