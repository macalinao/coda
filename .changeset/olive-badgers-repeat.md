---
---

Repo tooling only -- no change to any published package. Restores the deliberate
`typescript` ^6.0.3 pins on the root `devDependencies` and on the private `apps/docs`
workspace, which a dependency sweep had synced up to the catalog's ^7.0.2. TypeScript 7
ships only `tsc.js`, not the `lib/typescript.js` compiler API that `typedoc` and
`next build` load, so the bump broke the Typedoc Docs workflow. The workspace catalog and
every published package stay on TypeScript 7.
CI now runs `typedoc` on pull requests, so a change that breaks the docs build fails
review instead of landing on master.
