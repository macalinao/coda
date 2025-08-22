import type { LinkableDictionary } from "@codama/visitors-core";

export interface RenderMarkdownOptions {
  /** Format program addresses */
  formatAddress?: (address: string) => string;

  /** Whether to render table of contents */
  renderTableOfContents?: boolean;

  /** Whether to format output with prettier */
  formatWithPrettier?: boolean;

  /** Whether to hide discriminators from the documentation (default: true) */
  hideDiscriminators?: boolean;

  /** Prettier configuration options */
  prettierOptions?: {
    printWidth?: number;
    tabWidth?: number;
    proseWrap?: "always" | "never" | "preserve";
  };
}

export interface RenderContext {
  linkables: LinkableDictionary;
  options: RenderMarkdownOptions;
}
