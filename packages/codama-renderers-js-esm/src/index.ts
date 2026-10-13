export { ESM_DEPENDENCY_MAP } from "./constants.ts";
export { makeSyntaxErasable } from "./erasable-syntax.ts";
export type { LinkOverrides } from "./external-programs.ts";
export {
  filterBarrel,
  getExternalLinkOverrides,
  getProgramRenderPaths,
} from "./external-programs.ts";
export type { RenderESMTypeScriptOptions } from "./render-esm-typescript-visitor.ts";
export { renderESMTypeScriptVisitor } from "./render-esm-typescript-visitor.ts";
