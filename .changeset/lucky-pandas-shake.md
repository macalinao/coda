---
---

Tooling only: enable the `react/react-compiler` oxlint rule so React Compiler
diagnostics (Rules of Hooks, refs during render, setState during render) are
caught in CI. Only `.oxlintrc.json` changed; no published package output
changes.
