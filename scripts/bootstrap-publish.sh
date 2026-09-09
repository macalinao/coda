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
# What it publishes is a throwaway stub -- a package.json with no files, at
# 0.0.0-bootstrap under the `bootstrap` dist-tag. It must never publish the
# real version from package.json: the release that follows would then try to
# publish that same version and die with
# `E403 You cannot publish over the previously published versions`. That is
# exactly what happened to @solana-programs/goki@0.2.0 on 2026-08-15.
# The stub also leaves `latest` unset until the first real release claims it.
#
# Run this locally, once, whenever a new package is added to the repo:
#
#   npm login                       # or export NPM_TOKEN
#   ./scripts/bootstrap-publish.sh              # dry run, lists what it would do
#   ./scripts/bootstrap-publish.sh --execute
#
# Requires npm >= 11.10.0 for `npm trust`.

REPO="macalinao/coda"
WORKFLOW="release.yml"
STUB_VERSION="0.0.0-bootstrap"
STUB_TAG="bootstrap"

EXECUTE=false
if [ "${1:-}" = "--execute" ]; then
  EXECUTE=true
fi

if [ "$EXECUTE" = false ]; then
  echo "DRY RUN -- pass --execute to actually publish. Nothing will be changed."
  echo
fi

STUB_DIR="$(mktemp -d)"
trap 'rm -rf "$STUB_DIR"' EXIT

bootstrap_dir() {
  local dir="$1"
  local name abs

  # node's require() needs an absolute path -- a bare relative one resolves
  # against the module paths, not the cwd.
  abs="$(cd "$dir" && pwd)"
  name="$(node -p "require('$abs/package.json').name")"

  if npm view "$name" version --json >/dev/null 2>&1; then
    echo "ok    $name -- already on the registry, nothing to bootstrap"
    return
  fi

  if [ "$EXECUTE" = false ]; then
    echo "would $name@$STUB_VERSION -- publish stub with token, then configure trusted publisher"
    return
  fi

  echo "==> $name@$STUB_VERSION (stub)"

  local out="$STUB_DIR/$(basename "$dir")"
  mkdir -p "$out"

  node -e "
    const fs = require('node:fs');
    const pkg = require('$abs/package.json');
    fs.writeFileSync('$out/package.json', JSON.stringify({
      name: pkg.name,
      version: '$STUB_VERSION',
      description: 'Placeholder to bootstrap npm trusted publishing. See ' + (pkg.homepage ?? 'https://github.com/$REPO'),
      license: pkg.license,
      repository: pkg.repository,
    }, null, 2) + '\n');
  "

  # No --provenance here: this publish is token-authenticated, not OIDC.
  # --tag keeps the `latest` tag free for the first real release.
  npm publish "$out" --access public --tag "$STUB_TAG"

  npm trust github "$name" \
    --repo "$REPO" \
    --file "$WORKFLOW" \
    --allow-publish \
    --yes

  echo "    stub published and trusted -- the next release publishes the real version over OIDC"
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
