import { configs } from "@macalinao/eslint-config";

export default [
  ...configs.fast,
  {
    ignores: ["tsdown.config.ts"],
  },
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: ["**/*.test.ts", "dist/**"],
  },
];
