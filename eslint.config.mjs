// eslint.config.mjs
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    ignores: [
      'node_modules/',
      'playwright-report/',
      'test-results/',
      'dist/',
    ],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ['tests/**/*.ts'],
    ...playwright.configs['flat/recommended'],
  },

  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  eslintConfigPrettier,
];
