# My Coda Client

TypeScript client for Solana program generated with [Coda](https://github.com/macalinao/coda).

## Getting Started

1. **Add your IDL file(s)**
   - Place your Anchor IDL JSON file(s) in the `idls/` directory
   - Remove the example.json file

2. **Generate the client code**

   ```bash
   bun run codegen
   ```

3. **Build the project**
   ```bash
   bun run build
   ```

## Project Structure

```
.
├── idls/               # Anchor IDL files
├── src/
│   ├── generated/      # Generated client code (do not edit)
│   └── index.ts        # Main entry point
├── coda.config.mjs     # Coda configuration
└── package.json
```

## Available Scripts

- `bun run codegen` - Generate TypeScript client from IDL
- `bun run build` - Build the TypeScript project
- `bun run clean` - Clean build artifacts
- `bun run lint` - Run ESLint
- `bun test` - Run tests

## Configuration

Edit `coda.config.mjs` to customize:

- IDL discovery patterns
- Output directory
- Custom PDAs and visitors

## Usage

```typescript
import { createInitializeInstruction } from "./dist/index.js";

// Use the generated client
const instruction = createInitializeInstruction({
  // ... instruction parameters
});
```

## Learn More

- [Coda Documentation](https://github.com/macalinao/coda)
- [Codama Documentation](https://github.com/codama-idl/codama)
- [Anchor Framework](https://www.anchor-lang.com/)
