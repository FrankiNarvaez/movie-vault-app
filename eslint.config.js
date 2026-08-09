import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default tseslint.config(
  { ignores: ["dist"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  reactHooks.configs.flat["recommended-latest"],
  reactRefresh.configs.vite,
  {
    settings: {
      // Pinned on purpose: eslint-plugin-react's "detect" path calls
      // context.getFilename(), which ESLint 10 removed.
      react: { version: "19.2" },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      "react/jsx-no-target-blank": "off",
      // TypeScript checks props at compile time now, so runtime propTypes
      // would be duplicated work React 19 ignores anyway.
      "react/prop-types": "off",
      // Kept at "warn" as in the previous config: losing fast refresh is an
      // ergonomics issue, not a correctness one.
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  }
);
