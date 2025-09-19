import type { RootNode } from "@codama/nodes";
import type { RenderMarkdownOptions } from "./types.js";
import { getAllPrograms } from "@codama/nodes";
import {
  addToRenderMap,
  createRenderMap,
  writeRenderMap,
} from "@codama/renderers-core";
import {
  getRecordLinkablesVisitor,
  LinkableDictionary,
  rootNodeVisitor,
  visit,
} from "@codama/visitors-core";
import * as prettier from "prettier";
import { renderProgram } from "./renderers/renderProgram.js";

export function renderMarkdownVisitor(
  outputDir: string,
  options: RenderMarkdownOptions = {},
): ReturnType<typeof rootNodeVisitor> {
  const linkables = new LinkableDictionary();

  return rootNodeVisitor(async (root) => {
    // Record linkables using getRecordLinkablesVisitor
    visit(root, getRecordLinkablesVisitor(linkables));

    let map = createRenderMap();
    const programs = getAllPrograms(root as unknown as RootNode);

    // Generate markdown for each program
    for (const program of programs) {
      let markdown = renderProgram(program, { linkables, options });

      // Format with prettier if requested
      if (options.formatWithPrettier !== false) {
        // Debug: log the markdown before prettier
        // console.log("BEFORE PRETTIER:", markdown.substring(0, 2000));
        markdown = await prettier.format(markdown, {
          parser: "markdown",
          printWidth: options.prettierOptions?.printWidth ?? 120,
          tabWidth: options.prettierOptions?.tabWidth ?? 2,
          proseWrap: options.prettierOptions?.proseWrap ?? "preserve",
        });
      }

      // Convert camelCase to kebab-case for filename
      const kebabCase = program.name
        .replace(/([A-Z])/g, "-$1") // Add dash before capitals
        .toLowerCase()
        .replace(/^-/, ""); // Remove leading dash if present
      const filename = `${kebabCase}.md`;
      map = addToRenderMap(map, filename, markdown);
    }

    writeRenderMap(map, outputDir);
  });
}
