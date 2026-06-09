// Declarations for side-effect imports of stylesheets. Required under
// TypeScript's `noUncheckedSideEffectImports`, which is enabled by default in
// TypeScript 6, so that `import "@/app/global.css"` type-checks.
declare module "*.css";
