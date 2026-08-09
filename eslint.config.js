import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist"] },
  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  reactHooks.configs.flat["recommended-latest"],
  reactRefresh.configs.vite,
  {
    files: ["**/*.{js,jsx}"],
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
    settings: {
      // Pinned on purpose: eslint-plugin-react's "detect" path calls
      // context.getFilename(), which ESLint 10 removed.
      react: { version: "19.2" },
    },
    rules: {
      "react/jsx-no-target-blank": "off",
      // Kept at "warn" as in the previous config: losing fast refresh is an
      // ergonomics issue, not a correctness one.
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // React 19 dropped runtime propTypes support: the field is ignored, so
      // enforcing it would only add code React never reads. Static typing is
      // the replacement.
      "react/prop-types": "off",
    },
  },
];
