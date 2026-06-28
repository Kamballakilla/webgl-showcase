import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default [
  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts"],

    languageOptions: {
      globals: globals.browser,
    },

    rules: {
      "no-console": "warn",
      "no-var": "error",
      "prefer-const": "error",
      eqeqeq: "error",
      curly: "error",
    },
  },
];
