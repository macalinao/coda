import { defineConfig } from "tsdown";

// Overrides the shared root tsdown.config.ts to also build the CLI binary.
export default defineConfig({
  entry: ["src/index.ts", "src/bin.ts"],
  unbundle: true,
  dts: true,
  format: "esm",
  sourcemap: true,
  fixedExtension: false,
});
