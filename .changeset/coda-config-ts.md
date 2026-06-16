---
"@macalinao/coda": minor
"@macalinao/create-coda": minor
---

Support `coda.config.ts` configuration files loaded natively by Node.js.

Coda now looks for `coda.config.ts` by default and imports it directly using
Node's native TypeScript support (type stripping), so no build step or loader is
required. Existing `coda.config.mjs`/`.js` files continue to work as a fallback.
`coda init` and `create-coda` now scaffold a `coda.config.ts` using
`defineConfig` for full type safety.
