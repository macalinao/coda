import { readFile } from "node:fs/promises";
import type { AnchorIdl } from "@codama/nodes-from-anchor";
import { fileExists } from "./file-exists.js";

/**
 * Load IDL files from the specified paths
 */
export async function loadIdls(idlPaths: string[]): Promise<AnchorIdl[]> {
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

  return idls;
}
