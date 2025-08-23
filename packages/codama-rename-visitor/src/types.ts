/**
 * Rename mapping for a single program
 */
export interface ProgramRenameOptions {
  /** Mapping of old account names to new account names */
  accounts?: Record<string, string>;
  /** Mapping of old instruction names to new instruction names */
  instructions?: Record<string, string>;
  /** Mapping of old defined type names to new defined type names */
  definedTypes?: Record<string, string>;
}

/**
 * Options for the rename visitor (legacy interface)
 */
export type RenameVisitorOptions = ProgramRenameOptions;
