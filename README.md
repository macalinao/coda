<h1 align="center">
Coda
</h1>

<p align="center">
Automated client generation for Solana programs.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@macalinao/coda"><img src="https://img.shields.io/npm/v/@macalinao/coda?logo=npm&color=377CC0" /></a>
  <a href="https://www.npmjs.com/package/@macalinao/coda"><img src="https://img.shields.io/npm/dm/@macalinao/coda?color=377CC0" /></a>
</p>

Coda automatically generates type-safe TypeScript clients from your Anchor IDLs. Built on [Codama](https://github.com/codama-idl/codama), it provides a CLI that transforms Anchor IDLs into modern TypeScript clients with full type safety and ES modules support.

## Documentation

Visit **[coda.ianm.com](https://coda.ianm.com)** for complete documentation including:

- Getting started guide
- Configuration options
- API reference
- Examples and tutorials

Full TypeDoc documentation is available at **[coda-typedocs.ianm.com](https://coda-typedocs.ianm.com)**.

## Quick Start

```bash
# Install
bun add -D @macalinao/coda

# Generate client from Anchor IDL
coda generate

# Or initialize with config
coda init
```

By default, Coda looks for IDLs at `./target/idl/program.json` and outputs to `./src/generated`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0
