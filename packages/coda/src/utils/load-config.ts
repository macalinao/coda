import type { CodaConfig } from "../config.js";
import { fileExists } from "./file-exists.js";

/**
 * Load configuration from the specified path if it exists
 */
export async function loadConfig(configPath: string): Promise<CodaConfig> {
  if (await fileExists(configPath)) {
    console.log(`Loading config from ${configPath}...`);
    const configUrl = new URL(`file://${configPath}`);
    const configModule = (await import(configUrl.href)) as {
      default: CodaConfig;
    };
    return configModule.default;
  }
  return {};
}
