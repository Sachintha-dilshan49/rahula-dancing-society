import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Soften a few of eslint-config-next's strictest defaults so they surface as
  // advisory warnings instead of build-breaking errors. None affect runtime.
  {
    rules: {
      // Cosmetic: raw quotes/apostrophes in JSX text render fine.
      "react/no-unescaped-entities": "off",
      // Keep `any` visible as a nudge, but don't treat it as an error.
      "@typescript-eslint/no-explicit-any": "warn",
      // Newer, noisy rule; the flagged one-time setState calls are intentional.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
