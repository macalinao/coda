---
"@macalinao/coda": patch
---

`coda generate` now scaffolds a `src/index.ts` barrel re-exporting the generated client when one is missing. Previously only the `generated/` directory was emitted, so a package whose entry point compiles from `src/index.ts` would build with no errors yet produce no entry file, publishing a broken package that resolves to nothing. Existing entry files are never overwritten.
