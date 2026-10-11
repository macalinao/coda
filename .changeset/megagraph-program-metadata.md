---
"@macalinao/megagraph": minor
---

`defineProgram` takes an optional `program` block describing the on-chain program, separate from the npm `package` block: `displayName`, `description`, `repository`, `idlSource` (`{ repository, tag?, commit?, path }`, the same shape as an external program's `source`), `addresses` per cluster, `docs`, `audits` (`{ auditor, url, date? }[]`) and `status` (`"active"` or `"deprecated"`, with an optional `supersededBy` program). Every field is optional.

`addresses.mainnet` defaults to the IDL's address. When given it must equal that address, and `null` records that the program is not deployed on mainnet. The graph build also rejects non-https URLs, malformed addresses, commit hashes and audit dates, and a `supersededBy` that is not another program in the graph or is set on a program not marked deprecated.

The resolved metadata is written to `graph/packages.json` as `metadata` on each program entry. Generated READMEs show it in the Program section, and a deprecation notice appears at the top. Release planning classifies a metadata-only change as a fix, so it produces a patch release. Release states from before metadata existed are not diffed.
