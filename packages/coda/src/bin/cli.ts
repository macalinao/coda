#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { renderESMTypeScriptVisitor } from "@macalinao/codama-renderers-js-esm";
import { renderMarkdownVisitor } from "@macalinao/codama-renderers-markdown";
import { Command } from "commander";
import { fileExists, processIdls } from "../utils/index.js";

const program = new Command();

program
  .name("coda")
  .description("Zero-config CLI for generating clients for Solana programs")
  .version("0.0.1");

program
  .command("generate")
  .alias("gen")
  .description("Generate a client from an Anchor IDL")
  .option(
    "-i, --idl <path>",
    "Path to the Anchor IDL file(s) or glob pattern",
    "./idls/*.json",
  )
  .option(
    "-o, --output <path>",
    "Output directory for generated client",
    "./src/generated",
  )
  .option(
    "-c, --config <path>",
    "Path to coda.config.mjs file",
    "./coda.config.mjs",
  )
  .action(async (options: { idl: string; output: string; config: string }) => {
    try {
      const { codama, config } = await processIdls(options);
      const outputPath = resolve(config.outputDir ?? options.output);

      // Apply the ESM TypeScript visitor
      console.log(`Generating client to ${outputPath}...`);
      codama.accept(renderESMTypeScriptVisitor(outputPath));

      console.log("✅ Client generated successfully!");
    } catch (error) {
      console.error("Error generating client:", error);
      process.exit(1);
    }
  });

program
  .command("init")
  .description("Initialize a new coda.config.mjs file")
  .option(
    "-c, --config <path>",
    "Path for the config file",
    "./coda.config.mjs",
  )
  .action(async (options: { config: string }) => {
    try {
      const configPath = resolve(options.config);

      // Check if config already exists
      if (await fileExists(configPath)) {
        console.error(`Error: Config file already exists at ${configPath}`);
        process.exit(1);
      }

      // Create config template
      const configTemplate = `/**
 * @type {import('@macalinao/coda').CodaConfig}
 */
export default {
  // Optional: Path to the Anchor IDL file(s) (overrides --idl option)
  // Can be a single path, glob pattern, or an array of paths/patterns
  // Default: Looks for "./idls/*.json" if available, otherwise "./target/idl/program.json"
  // idlPath: "./target/idl/program.json",        // Single file
  // idlPath: "./idls/*.json",                     // Glob pattern (all JSON files in idls/)
  // idlPath: "./idls/program_*.json",             // Glob pattern (matching files)
  // idlPath: ["./idls/program1.json", "./idls/program2.json"],  // Array of files
  // idlPath: ["./idls/*.json", "./extra/*.json"], // Array with glob patterns
  
  // Optional: Output directory for generated client (overrides --output option)
  // outputDir: "./src/generated",
  
  // Optional: Documentation generation options
  // docs: {
  //   // NPM package name for the TypeScript client
  //   // If provided, will add an NPM badge and link to the package
  //   npmPackageName: "@my-org/my-solana-client",
  // },
  
  // Optional: Add custom visitors to transform the Codama tree
  // Can be an array of visitors or a function that returns visitors
  // visitors: [
  //   // Example: Add a custom visitor
  //   someVisitor(),
  // ],
  
  // Example using a function to access the IDL:
  // visitors: ({ idl }) => [
  //   customVisitor(idl),
  // ],
};
`;

      // Write config file
      await writeFile(configPath, configTemplate, "utf-8");

      console.log(`✅ Created coda.config.mjs at ${configPath}`);
      console.log("\nNext steps:");
      console.log(
        "1. Edit coda.config.mjs to customize your client generation",
      );
      console.log("2. Run 'coda generate' to generate your Solana client");
    } catch (error) {
      console.error("Error creating config file:", error);
      process.exit(1);
    }
  });

program
  .command("docs")
  .description("Generate markdown documentation from an Anchor IDL")
  .option(
    "-i, --idl <path>",
    "Path to the Anchor IDL file(s) or glob pattern",
    "./idls/*.json",
  )
  .option(
    "-c, --config <path>",
    "Path to coda.config.mjs file",
    "./coda.config.mjs",
  )
  .action(async (options: { idl: string; config: string }) => {
    try {
      const { codama, config } = await processIdls(options);
      const outputPath = resolve(config.docs?.path ?? "./docs");

      // Apply the markdown visitor with options from config
      console.log(`Generating documentation to ${outputPath}...`);
      const markdownOptions = {
        npmPackageName: config.docs?.npmPackageName,
      };
      codama.accept(renderMarkdownVisitor(outputPath, markdownOptions));

      console.log("✅ Documentation generated successfully!");
    } catch (error) {
      console.error("Error generating documentation:", error);
      process.exit(1);
    }
  });

program.parse();
