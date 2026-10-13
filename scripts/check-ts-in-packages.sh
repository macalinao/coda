#!/usr/bin/env bash
set -euo pipefail

# Fails if a tracked TypeScript file sits outside a workspace package with a
# tsconfig.json, which oxlint's type-aware checks need to resolve and
# type-check it. The repository root counts: its tsconfig.json covers the
# shared tsdown.config.ts. vendor/ and the generated clients/ are skipped.

root="$(git rev-parse --show-toplevel)"
cd "$root"

status=0
while IFS= read -r file; do
  dir="$(dirname "$file")"
  while :; do
    if [ -f "$dir/package.json" ]; then
      break
    fi
    if [ "$dir" = "." ]; then
      break
    fi
    dir="$(dirname "$dir")"
  done
  if [ ! -f "$dir/package.json" ] || [ ! -f "$dir/tsconfig.json" ]; then
    echo "::error file=$file::$file is not inside a workspace package with a tsconfig.json"
    status=1
  fi
done < <(git ls-files '*.ts' '*.tsx' '*.mts' '*.cts' ':!:vendor/**' ':!:clients/**')

if [ "$status" -eq 0 ]; then
  echo "Every tracked TypeScript file belongs to a package with a tsconfig.json."
fi
exit "$status"
