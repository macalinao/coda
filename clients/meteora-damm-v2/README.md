# @macalinao/clients-meteora-damm-v2

[![npm version](https://img.shields.io/npm/v/@macalinao/clients-meteora-damm-v2.svg)](https://www.npmjs.com/package/@macalinao/clients-meteora-damm-v2)

TypeScript client for the [Meteora DAMM V2](https://github.com/MeteoraAg/damm-v2) (CP-AMM) program, generated using [Coda CLI](https://github.com/macalinao/coda).

## Installation

```bash
bun add @macalinao/clients-meteora-damm-v2
```

## Usage

```typescript
import {
  getSwapInstructionAsync,
  fetchPool,
  findPoolPda,
} from "@macalinao/clients-meteora-damm-v2";

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

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0
