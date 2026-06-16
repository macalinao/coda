import { defineConfig } from "@macalinao/coda";

export default defineConfig({
  // Coda will automatically discover IDLs from ./idls/*.json
  // You can override this by specifying a custom path:
  // idlPath: "./idls/my_program.json",

  // For multiple IDLs, use a glob pattern or array:
  // idlPath: "./idls/*.json",
  // idlPath: ["./idls/program1.json", "./idls/program2.json"],

  // Output directory for generated code (default: "./src/generated")
  outputDir: "./src/generated",

  // Optional: Add custom Codama visitors for advanced customization
  // visitors: [
  //   addPdasVisitor({
  //     // Define custom PDAs here
  //   })
  // ]
});
