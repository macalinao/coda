import type { CodaConfig } from "../config.js";
import { extname } from "node:path";
import { fileExists } from "./file-exists.js";

/**
 * Config file extensions that Coda can load, in order of preference.
 *
 * TypeScript configs (`.ts`/`.mts`) are loaded natively by Node.js via type
 * stripping (Node 22.18+/23.6+, on by default in Node 24+), so no build step
 * or loader is required.
 */
const CONFIG_EXTENSIONS = ["ts", "mts", "mjs", "js", "cjs"] as const;

/**
 * Resolve the actual config file to load.
 *
 * If the provided path exists, it is used directly. Otherwise, the extension is
 * stripped and each supported extension is tried in turn. This lets the default
 * `./coda.config.ts` transparently fall back to a legacy `./coda.config.mjs`.
 */
async function resolveConfigPath(configPath: string): Promise<string | null> {
  if (await fileExists(configPath)) {
    return configPath;
  }

  const ext = extname(configPath);
  const base = ext ? configPath.slice(0, -ext.length) : configPath;

  for (const candidateExt of CONFIG_EXTENSIONS) {
    const candidate = `${base}.${candidateExt}`;
    if (await fileExists(candidate)) {
      return candidate;
    }
  }

  return null;
}

/**
 * Load configuration from the specified path if it exists.
 *
 * Supports both TypeScript (`coda.config.ts`) and JavaScript (`coda.config.mjs`)
 * configs. TypeScript configs are imported natively by Node.js.
 */
export async function loadConfig(configPath: string): Promise<CodaConfig> {
  const resolvedPath = await resolveConfigPath(configPath);
  if (resolvedPath === null) {
    return {};
  }

  console.log(`Loading config from ${resolvedPath}...`);
  const configUrl = new URL(`file://${resolvedPath}`);
  const configModule = (await import(configUrl.href)) as {
    default: CodaConfig;
  };
  return configModule.default;
}
