#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { renderVisitor as renderRustVisitor } from "@codama/renderers-rust";
import { renderESMTypeScriptVisitor } from "@macalinao/codama-renderers-js-esm";
import { renderMarkdownVisitor } from "@macalinao/codama-renderers-markdown";
import { Command } from "commander";
import { CONFIG_TEMPLATE } from "../config-template.js";
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
    "-c, --config <path>",
    "Path to coda.config.mjs file",
    "./coda.config.mjs",
  )
  .action(async (options: { config: string }) => {
    try {
      const { codama, config } = await processIdls(options);
      const outputPath = resolve(config.outputDir ?? "./src/generated/");

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

      // Write config file
      await writeFile(configPath, CONFIG_TEMPLATE, "utf-8");

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
  .command("generate-rust")
  .alias("gen-rust")
  .description("Generate a Rust client from an Anchor IDL")
  .option(
    "-c, --config <path>",
    "Path to coda.config.mjs file",
    "./coda.config.mjs",
  )
  .action(async (options: { config: string }) => {
    try {
      const { codama, config } = await processIdls(options);
      const outputPath = resolve(config.rustOutputDir ?? "./rust");

      // Apply the Rust visitor
      console.log(`Generating Rust client to ${outputPath}...`);
      codama.accept(renderRustVisitor(outputPath));

      console.log("✅ Rust client generated successfully!");
    } catch (error) {
      console.error("Error generating Rust client:", error);
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
