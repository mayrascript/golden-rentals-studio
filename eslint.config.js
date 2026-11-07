import js from '@eslint/js';
import tseslint from 'typescript-eslint';
export default tseslint.config(
  { ignores: ['node_modules/**', '.angular/**', 'docs/guide-assets/**', 'dist/**', 'release/**', 'test-results/**', 'playwright-report/**', '.data/**'] },
  js.configs.recommended, ...tseslint.configs.recommended,
  { files: ['**/*.ts', '**/*.tsx'], rules: { '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }] } },
  { files: ['workshop/exercises/**/*.ts'], rules: { '@typescript-eslint/no-unused-vars': 'off' } },
);
