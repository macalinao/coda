---
"@macalinao/create-coda": patch
---

The project template now type-checks `coda.config.ts`: `tsconfig.json` covers the whole project (`bun run typecheck`, and editors), while `bun run build` emits `src/` through the new `tsconfig.build.json`. The template's `@types/bun` devDependency is now a plain version range instead of a `catalog:` reference that only resolved inside the coda repository.
