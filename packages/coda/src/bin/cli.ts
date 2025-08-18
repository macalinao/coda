#!/usr/bin/env node
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { AnchorIdl, IdlV01 } from "@codama/nodes-from-anchor";
import { rootNodeFromAnchorV01 } from "@codama/nodes-from-anchor";
import { renderESMTypeScriptVisitor } from "@macalinao/codama-renderers-js-esm";
import { createFromRoot } from "codama";
import { Command } from "commander";
import type { CodaConfig } from "../config.js";

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

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
    "Path to the Anchor IDL file",
    "./target/idl/program.json",
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
      const configPath = resolve(options.config);

      // Load config first if it exists
      let config: CodaConfig = {};
      if (await fileExists(configPath)) {
        console.log(`Loading config from ${configPath}...`);

        // Dynamic import of the config file
        const configUrl = new URL(`file://${configPath}`);
        const configModule = (await import(configUrl.href)) as {
          default: CodaConfig;
        };
        config = configModule.default;
      }

      // Use config values if provided, otherwise fall back to command line options
      const idlPaths = Array.isArray(config.idlPath)
        ? config.idlPath.map((p) => resolve(p))
        : [resolve(config.idlPath ?? options.idl)];
      const outputPath = resolve(config.outputDir ?? options.output);

      // Load all IDLs
      const idls: AnchorIdl[] = [];
      for (const idlPath of idlPaths) {
        // Check if IDL file exists
        if (!(await fileExists(idlPath))) {
          console.error(`Error: IDL file not found at ${idlPath}`);
          process.exit(1);
        }

        // Load the IDL
        console.log(`Loading IDL from ${idlPath}...`);
        const idlContent = await readFile(idlPath, "utf-8");
        const idl = JSON.parse(idlContent) as AnchorIdl;
        idls.push(idl);
      }

      // Ensure we have at least one IDL
      if (idls.length === 0) {
        console.error("Error: No IDL files were loaded");
        process.exit(1);
      }

      // Create root node from Anchor IDL(s)
      console.log(
        `Creating Codama nodes from ${idls.length.toString()} Anchor IDL(s)...`,
      );

      // Create root nodes from IDL(s)
      // Note: rootNodeFromAnchor can accept additional IDLs as external programs
      const [firstIdl, ...restIdls] = idls;
      if (!firstIdl) {
        throw new Error("Unexpected: No IDL files loaded");
      }
      const root = rootNodeFromAnchorV01(
        firstIdl as unknown as IdlV01,
        restIdls as unknown as IdlV01[],
      );
      const codama = createFromRoot(root);

      // Apply additional visitors from config
      if (config.visitors) {
        // Resolve visitors - either array or function
        const visitors =
          typeof config.visitors === "function"
            ? config.visitors({ idl: firstIdl, idls })
            : config.visitors;

        if (visitors.length > 0) {
          console.log(
            `Applying ${visitors.length.toLocaleString()} custom visitor(s)...`,
          );
          for (const visitor of visitors) {
            codama.update(visitor);
          }
        }
      }

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
  // Can be a single path or an array for multiple IDLs
  // idlPath: "./target/idl/program.json",
  // idlPath: ["./idls/program1.json", "./idls/program2.json"],
  
  // Optional: Output directory for generated client (overrides --output option)
  // outputDir: "./src/generated",
  
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
      const { writeFile } = await import("node:fs/promises");
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

program.parse();
