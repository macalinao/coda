# @macalinao/clients-meteora-damm-v2

[![npm version](https://img.shields.io/npm/v/@macalinao/clients-meteora-damm-v2.svg)](https://www.npmjs.com/package/@macalinao/clients-meteora-damm-v2)

TypeScript client for the Meteora DAMM V2 (CP-AMM) program, generated using Coda CLI with full ESM support.

## Installation

```bash
bun add @macalinao/clients-meteora-damm-v2
```

## About Meteora DAMM V2

Meteora DAMM V2 is a constant product AMM (CPAMM) protocol on Solana that enables efficient token swaps with liquidity provision. The protocol supports multiple pool types, customizable pools, and reward distributions.

### Resources

- [DAMM V2 Program](https://github.com/MeteoraAg/damm-v2) - The on-chain Solana program
- [DAMM V2 SDK](https://github.com/MeteoraAg/damm-v2-sdk) - Official TypeScript SDK
- [SDK Documentation](https://github.com/MeteoraAg/damm-v2-sdk/blob/main/docs.md) - Detailed SDK usage guide

## Development

This client is generated from the Meteora DAMM V2 IDL using Coda CLI:

```bash
# Generate the client from idls/
bun run codegen

# Build the TypeScript
bun run build
```

### Configuration

The `coda.config.mjs` file includes custom PDAs for all the program-derived addresses used by the protocol.

## Usage

```typescript
import {
  getAddLiquidityInstruction,
  fetchPool,
  findPoolPda,
  findPositionPda,
  findTokenVaultPda,
} from "@macalinao/clients-meteora-damm-v2";

// Find pool PDA
const [poolAddress] = await findPoolPda({
  config: configAddress,
  tokenAMint: tokenAMintAddress,
  tokenBMint: tokenBMintAddress,
});

// Fetch pool account
const pool = await fetchPool(rpc, poolAddress);

// Find position PDA
const [positionAddress] = await findPositionPda({
  positionNft: positionNftMintAddress,
});

// Find token vault PDA
const [tokenVaultAddress] = await findTokenVaultPda({
  tokenMint: tokenMintAddress,
  pool: poolAddress,
});

// Create add liquidity instruction
const instruction = getAddLiquidityInstruction({
  // ... instruction parameters
});
```

## PDAs

The client exports PDA helper functions for all program-derived addresses:

| Function | Seeds | Description |
|----------|-------|-------------|
| `findPoolAuthorityPda()` | `"pool_authority"` | Global pool authority |
| `findConfigPda({ index })` | `"config"`, index (u64) | Configuration account |
| `findPoolPda({ config, tokenAMint, tokenBMint })` | `"pool"`, config, tokenAMint, tokenBMint | Pool account |
| `findPositionPda({ positionNft })` | `"position"`, positionNft | Position account |
| `findTokenVaultPda({ tokenMint, pool })` | `"token_vault"`, tokenMint, pool | Token vault account |
| `findRewardVaultPda({ pool, rewardIndex })` | `"reward_vault"`, pool, rewardIndex (u8) | Reward vault account |
| `findCustomizablePoolPda({ tokenAMint, tokenBMint })` | `"cpool"`, tokenAMint, tokenBMint | Customizable pool account |
| `findTokenBadgePda({ tokenMint })` | `"token_badge"`, tokenMint | Token badge account |
| `findClaimFeeOperatorPda({ operator })` | `"cf_operator"`, operator | Claim fee operator account |
| `findPositionNftAccountPda({ positionNftMint })` | `"position_nft_account"`, positionNftMint | Position NFT account |

**Note:** For `findPoolPda` and `findCustomizablePoolPda`, the token mints must be sorted. The first mint should be the lexicographically smaller address.

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0
