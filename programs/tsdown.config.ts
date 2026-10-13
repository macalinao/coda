import { defineConfig } from "tsdown";

// Overrides the shared root tsdown.config.ts to build one entry per protocol
// and per program, the package's `./<protocol>` and `./<protocol>/<program>`
// subpath exports. Bundled rather than unbundled: in unbundle mode rolldown
// adds its internal namespace objects (`quarry_exports`, ...) to the public
// exports of every module re-exported with `export * as`. Shared code lands in
// hashed chunks under dist/_chunks/, one per module, so imports stay
// tree-shakable and every entry shares the same module instances.
export default defineConfig({
  entry: ["src/index.ts", "src/*/index.ts", "src/*/*/index.ts"],
  dts: true,
  format: "esm",
  sourcemap: true,
  fixedExtension: false,
  outputOptions: {
    chunkFileNames: "_chunks/[name]-[hash].js",
  },
});
