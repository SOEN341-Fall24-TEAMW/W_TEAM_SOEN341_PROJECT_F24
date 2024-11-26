import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser, // Browser globals
        jest: true,          // Jest globals
      },
    },
    plugins: {
      react: pluginReact, // Define react plugin correctly as an object
    },
  },
  pluginJs.configs.recommended,         // JS recommended rules
  pluginReact.configs.recommended,      // React recommended rules
];
