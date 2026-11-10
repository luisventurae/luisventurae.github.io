import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import astro from 'eslint-plugin-astro'
import jsx_a11y from 'eslint-plugin-jsx-a11y-x'
import react_hooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/**
 * Naming rules from docs/development-rules.md › Nombres.
 * Destructured bindings are exempt because their names come from the source object
 * (library APIs, React hooks, props).
 */
const naming_rules = [
  { selector: 'default', format: ['camelCase'], leadingUnderscore: 'allow' },
  { selector: 'import', format: null },
  { selector: 'variable', modifiers: ['destructured'], format: null },
  { selector: 'parameter', modifiers: ['destructured'], format: null },
  // zod schemas describe types, so they read like types: `ContactRequestSchema`.
  { selector: 'variable', filter: { regex: 'Schema$', match: true }, format: ['PascalCase'] },
  {
    selector: 'variable',
    format: ['snake_case', 'UPPER_CASE'],
    leadingUnderscore: 'allow',
  },
  { selector: 'parameter', format: ['snake_case'], leadingUnderscore: 'allow' },
  { selector: 'function', format: ['camelCase', 'PascalCase'] },
  { selector: ['method', 'accessor'], format: ['camelCase'] },
  { selector: 'typeLike', format: ['PascalCase'] },
  { selector: 'enumMember', format: ['PascalCase', 'UPPER_CASE'] },
  // Object keys and type members often mirror external contracts (HTTP, env, libraries).
  { selector: ['property', 'objectLiteralMethod', 'typeMethod'], format: null },
]

/** Variables holding functions (handlers, components) are named as functions. Needs type info. */
const function_variable_rules = [
  { selector: 'variable', types: ['function'], format: ['camelCase', 'PascalCase'] },
  { selector: 'parameter', types: ['function'], format: ['camelCase'] },
]

export const eslint_config = tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.astro/**',
      '**/.wrangler/**',
      '**/coverage/**',
      '**/playwright-report/**',
      '**/test-results/**',
      '.agents/**',
      '.claude/**',
      'openspec/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    languageOptions: { globals: { ...globals.node } },
    rules: {
      '@typescript-eslint/naming-convention': ['error', ...naming_rules],
      '@typescript-eslint/no-explicit-any': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportDefaultDeclaration',
          message: 'Use named exports (docs/development-rules.md › Funciones).',
        },
      ],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: { projectService: true },
    },
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        ...naming_rules.slice(0, 4),
        ...function_variable_rules,
        ...naming_rules.slice(4),
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    files: ['**/*.tsx'],
    plugins: { 'jsx-a11y-x': jsx_a11y, 'react-hooks': react_hooks },
    languageOptions: { globals: { ...globals.browser } },
    rules: {
      ...jsx_a11y.configs.strict.rules,
      ...react_hooks.configs.recommended.rules,
    },
  },
  ...astro.configs.recommended,
  {
    // Frameworks require default exports in config files, pages and the Worker entrypoint.
    files: [
      '**/*.config.{js,ts,mjs}',
      '**/vitest.workspace.ts',
      'apps/api/src/main.ts',
      'apps/web/src/pages/**',
    ],
    rules: { 'no-restricted-syntax': 'off' },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/e2e/**', '**/testing/**'],
    rules: { '@typescript-eslint/explicit-module-boundary-types': 'off' },
  },
  prettier,
)
