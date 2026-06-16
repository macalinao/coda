---
"@macalinao/codama-rename-visitor": patch
---

Fix visitor return types to be `Visitor<Node | null, "rootNode">` instead of
`Visitor<unknown, "rootNode">`, so the returned visitors are assignable to
`CodaConfig.visitors` without type errors.
