#!/usr/bin/env bash
set -euo pipefail

# Publishing uses npm OIDC trusted publishing (no NPM_TOKEN required).
#
# bun publish does not support OIDC trusted publishing yet
# (https://github.com/oven-sh/bun/issues/22423), so we pack each package with
# `bun pm pack` -- which rewrites the `catalog:` and `workspace:` protocols to
# concrete versions in the tarball -- and then publish the resulting tarball
# with `npm publish`, which supports OIDC and auto-generates provenance.
#
# Requires: npm >= 11.5.1 and `id-token: write` permission in the workflow, plus
# a trusted publisher configured for each package on npmjs.com. A package with
# no trusted publisher fails to publish -- npm cannot configure one until the
# package exists, so brand-new names need one bootstrap publish with a token
# before they can ride this path. See scripts/bootstrap-publish.sh.

echo "Publishing packages via npm OIDC trusted publishing..."

PACK_DIR="$(mktemp -d)"
trap 'rm -rf "$PACK_DIR"' EXIT

FAILED=()
PUBLISHED=()
SKIPPED=()

publish_dir() {
  local dir="$1"
  local name version abs

  # node's require() needs an absolute path -- a bare relative one resolves
  # against the module paths, not the cwd.
  abs="$(cd "$dir" && pwd)"
  name="$(node -p "require('$abs/package.json').name")"
  version="$(node -p "require('$abs/package.json').version")"

  # Every release run walks all packages, not just the ones changesets bumped,
  # so an unchanged package is expected to be already on the registry. That is
  # the only benign failure -- skip it rather than masking real errors.
  if npm view "$name@$version" version --json >/dev/null 2>&1; then
    echo "Skipping $name@$version (already published)"
    SKIPPED+=("$name@$version")
    return
  fi

  # Pack into a per-package directory so the tarball is unambiguous -- scoped
  # names do not map cleanly back from the filename.
  local out="$PACK_DIR/$(basename "$dir")"
  mkdir -p "$out"

  echo "Packing $name@$version..."
  # bun pm pack resolves catalog:/workspace: protocols to concrete versions
  (cd "$dir" && bun pm pack --destination "$out")

  local tarball
  tarball="$(echo "$out"/*.tgz)"

  echo "Publishing $name@$version..."
  if npm publish "$tarball" --access public; then
    PUBLISHED+=("$name@$version")
  else
    echo "::error::Failed to publish $name@$version"
    FAILED+=("$name@$version")
  fi
}

publish_all() {
  local parent="$1"
  for dir in "$parent"/*; do
    if [ -d "$dir" ] && [ -f "$dir/package.json" ]; then
      if ! grep -q '"private": true' "$dir/package.json"; then
        publish_dir "$dir"
      fi
    fi
  done
}

publish_all packages
publish_all clients

echo
echo "Published: ${#PUBLISHED[@]}  Skipped: ${#SKIPPED[@]}  Failed: ${#FAILED[@]}"

if [ ${#FAILED[@]} -gt 0 ]; then
  echo "::error::${#FAILED[@]} package(s) failed to publish:"
  printf '  %s\n' "${FAILED[@]}"
  echo "If these are new package names, they need a bootstrap publish and a"
  echo "trusted publisher configured before OIDC publishing works."
  exit 1
fi

# Tag the release in git
echo "Creating git tags via Changeset..."
changeset tag

echo "Publishing complete!"
