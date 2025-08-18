#!/usr/bin/env bash
set -e

echo "Publishing packages in dependency order..."


echo "Publishing top-level packages..."
for dir in packages/*; do
  if [ -d "$dir" ] && [ -f "$dir/package.json" ]; then
    if ! grep -q '"private": true' "$dir/package.json"; then
      echo "Publishing $(basename "$dir")..."
      (cd "$dir" && bun publish --access public) || echo "Failed to publish $(basename "$dir"), continuing..."
    fi
  fi
done

echo "Publishing clients..."
for dir in clients/*; do
  if [ -d "$dir" ] && [ -f "$dir/package.json" ]; then
    if ! grep -q '"private": true' "$dir/package.json"; then
      echo "Publishing $(basename "$dir")..."
      (cd "$dir" && bun publish --access public) || echo "Failed to publish $(basename "$dir"), continuing..."
    fi
  fi
done

# Tag the release in git
echo "Creating git tags via Changeset..."
changeset tag

echo "Publishing complete!"
