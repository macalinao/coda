import { defineConfig } from "tsdown";

/**
 * Shared tsdown configuration for the monorepo.
 *
 * tsdown walks up the directory tree to find this config, so every
 * package builds from `src/index.ts` with no per-package config needed.
 * Packages with extra entry points (e.g. CLI binaries) add their own
 * `tsdown.config.ts`, which takes precedence over this one.
 */
export default defineConfig({
  entry: ["src/index.ts"],
  unbundle: true,
  dts: true,
  format: "esm",
  sourcemap: true,
  fixedExtension: false,
});
