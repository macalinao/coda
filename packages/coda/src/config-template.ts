export const CONFIG_TEMPLATE = `/**
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
  
  // Optional: Output directory for generated Rust client
  // rustOutputDir: "./rust",
  
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
