import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'path';
import { fileURLToPath } from 'url';

import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  { ignores: ['dist', 'node_modules', '*.config.js', '*.config.ts'] },
  
  // Base JavaScript recommended config
  js.configs.recommended,
  
  // TypeScript ESLint recommended configs
  ...tseslint.configs.recommended,
  
  // Use FlatCompat to extend Airbnb configs (without airbnb-typescript for now)
  ...compat.extends(
    'airbnb',
    'airbnb/hooks',
  ),
  
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.app.json',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.app.json',
        },
      },
    },
    rules: {
      // React Hooks rules
      ...reactHooks.configs.recommended.rules,
      // React Refresh
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      
      // React 17+ doesn't need React import
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      
      // Allow JSX in .tsx files
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
      
      // Allow props spreading for flexibility
      'react/jsx-props-no-spreading': 'off',
      
      // Use function declarations for named components
      'react/function-component-definition': ['error', {
        namedComponents: 'function-declaration',
        unnamedComponents: 'arrow-function',
      }],
      
      // TypeScript handles prop validation
      'react/prop-types': 'off',
      'react/require-default-props': 'off',
      
      // Allow Redux Toolkit state mutations
      'no-param-reassign': ['error', { 
        props: true,
        ignorePropertyModificationsFor: ['state'],
      }],
      
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      'no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      
      // Relax some strict rules for development
      'class-methods-use-this': 'off',
      'max-classes-per-file': ['error', 5],
      'jsx-a11y/label-has-associated-control': 'off',
      'react/no-unused-prop-types': 'off',
      
      // Import rules
      'import/prefer-default-export': 'off',
      'import/extensions': ['error', 'ignorePackages', {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      }],
      
      // Consistent import ordering
      'import/order': ['error', {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      }],
      
      // Console warnings instead of errors in development
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      
      // Line length
      'max-len': ['error', { 
        code: 100, 
        ignoreUrls: true, 
        ignoreComments: false, 
        ignoreRegExpLiterals: true, 
        ignoreStrings: true, 
        ignoreTemplateLiterals: true,
      }],
    },
  },
  
  // Overrides for specific file patterns
  {
    files: ['*.js', '*.jsx'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
];