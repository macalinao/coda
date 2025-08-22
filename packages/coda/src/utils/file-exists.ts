import { access } from "node:fs/promises";

/**
 * Check if a file exists at the given path
 */
export async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
