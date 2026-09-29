## Usage

```typescript
import {
  fetchMetadata,
  findMetadataPda,
  getCreateMetadataAccountInstruction,
} from "@solana-programs/token-metadata";

// Fetch metadata account
const [metadataAddress] = await findMetadataPda({
  programId: TOKEN_METADATA_PROGRAM_ADDRESS,
  mint: mintAddress,
});
const metadata = await fetchMetadata(rpc, metadataAddress);

// Create metadata account instruction
const instruction = getCreateMetadataAccountInstruction({
  // ... instruction parameters
});
```
