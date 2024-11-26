import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginJest from "eslint-plugin-jest";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,  // Include default browser globals
        ...globals.jest,     // Add Jest globals
        global: true,
      },
    },
  },
  pluginJs.configs.recommended,  // Apply recommended JavaScript rules
  pluginReact.configs.flat.recommended,  // Apply recommended React rules
  {
    plugins: {
      jest: pluginJest,  // Add the Jest plugin
    },
    rules: {
      "jest/no-disabled-tests": "warn",  // Example Jest rule
      "jest/no-focused-tests": "error",  // Example Jest rule
      "jest/no-identical-title": "error",  // Example Jest rule
      "jest/valid-expect": "error",  // Example Jest rule
    },
  },
  {
    settings: {
      react: {
        version: 'detect', // Automatically detect the version of React
      },
    },
  },
];

