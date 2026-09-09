---
---

Security and CI tooling only -- no change to any published package. `next` in the private
docs app moved to 16.3.4, clearing 11 Dependabot advisories (two critical RCEs). The release
pipeline moved to Changesets CLI v3 to match `changesets/action@v2`, and the OSSF Scorecard
action was bumped to v2.4.4, whose image is served from ghcr.io instead of the unreachable
gcr.io registry. Four transitive packages
(`js-yaml`, `brace-expansion`, `mdast-util-to-hast`, `baseline-browser-mapping`) were pinned
forward to their patched releases via root `overrides` to clear the remaining Trivy findings.
