#!/usr/bin/env bash
set -euo pipefail

# One-time bootstrap for package names that have never been published.
#
# npm cannot configure a trusted publisher for a package that does not exist on
# the registry yet -- unlike PyPI, there is no pending-publisher flow. So a new
# name cannot make its first publish over OIDC. This script does that first
# publish with a token, then wires up the trusted publisher so every subsequent
# release goes through scripts/ci-publish.sh over OIDC with no token at all.
#
# Run this locally, once, whenever a new package is added to the repo:
#
#   npm login                       # or export NPM_TOKEN
#   bun run build:ci
#   ./scripts/bootstrap-publish.sh              # dry run, lists what it would do
#   ./scripts/bootstrap-publish.sh --execute
#
# Requires npm >= 11.10.0 for `npm trust`.

REPO="macalinao/coda"
WORKFLOW="release.yml"

EXECUTE=false
if [ "${1:-}" = "--execute" ]; then
  EXECUTE=true
fi

if [ "$EXECUTE" = false ]; then
  echo "DRY RUN -- pass --execute to actually publish. Nothing will be changed."
  echo
fi

PACK_DIR="$(mktemp -d)"
trap 'rm -rf "$PACK_DIR"' EXIT

bootstrap_dir() {
  local dir="$1"
  local name version abs

  # node's require() needs an absolute path -- a bare relative one resolves
  # against the module paths, not the cwd.
  abs="$(cd "$dir" && pwd)"
  name="$(node -p "require('$abs/package.json').name")"
  version="$(node -p "require('$abs/package.json').version")"

  if npm view "$name" version --json >/dev/null 2>&1; then
    echo "ok    $name -- already on the registry, nothing to bootstrap"
    return
  fi

  if [ "$EXECUTE" = false ]; then
    echo "would $name@$version -- publish with token, then configure trusted publisher"
    return
  fi

  echo "==> $name@$version"

  local out="$PACK_DIR/$(basename "$dir")"
  mkdir -p "$out"
  (cd "$dir" && bun pm pack --destination "$out")

  # No --provenance here: this publish is token-authenticated, not OIDC.
  npm publish "$out"/*.tgz --access public

  npm trust github "$name" \
    --repo "$REPO" \
    --file "$WORKFLOW" \
    --allow-publish \
    --yes

  echo "    published and trusted -- future releases run over OIDC"
}

bootstrap_all() {
  local parent="$1"
  for dir in "$parent"/*; do
    if [ -d "$dir" ] && [ -f "$dir/package.json" ]; then
      if ! grep -q '"private": true' "$dir/package.json"; then
        bootstrap_dir "$dir"
      fi
    fi
  done
}

bootstrap_all packages
bootstrap_all clients

echo
if [ "$EXECUTE" = false ]; then
  echo "Dry run complete. Re-run with --execute to publish."
else
  echo "Bootstrap complete. Verify with: npm trust list <package>"
fi
