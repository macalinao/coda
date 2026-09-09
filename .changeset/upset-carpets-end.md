---
---

Release tooling only -- no change to any published package. `scripts/bootstrap-publish.sh` now
publishes a throwaway stub instead of the real version, and `scripts/ci-publish.sh` treats the
registry's "already published" 403 as a skip.
