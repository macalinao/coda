import { configs } from "@macalinao/eslint-config";
import tseslint from "typescript-eslint";

export default [
  ...configs.fast,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["src/generated/**/*.ts"],
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/no-unnecessary-type-arguments": "off",
      "@typescript-eslint/non-nullable-type-assertion-style": "off",
    },
  },
  {
    files: [
      "src/generated/instructions/*.ts",
      "src/generated/types/*.ts",
      "src/generated/errors/*.ts",
    ],
    rules: {
      "@typescript-eslint/no-unnecessary-condition": "off",
      "no-constant-condition": "off",
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
  // The coda config is loaded directly by Node and is not part of the
  // package's TypeScript build, so type-aware linting cannot resolve it.
  {
    ...tseslint.configs.disableTypeChecked,
    files: ["coda.config.ts"],
  },
];
