import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'react': react,
      'jsx-a11y': jsxA11y,
      'import': importPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {},
      },
    },
    rules: {
      // Airbnb JavaScript Style Guide Rules
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'arrow-spacing': 'error',
      'block-spacing': 'error',
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'comma-spacing': ['error', { before: false, after: true }],
      'func-call-spacing': ['error', 'never'],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'keyword-spacing': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'no-trailing-spaces': 'error',
      'space-before-blocks': 'error',
      'space-in-parens': ['error', 'never'],
      'space-infix-ops': 'error',
      'spaced-comment': ['error', 'always'],
      'max-len': ['error', { 
        code: 100, 
        ignoreUrls: true, 
        ignoreComments: false, 
        ignoreRegExpLiterals: true, 
        ignoreStrings: true, 
        ignoreTemplateLiterals: true 
      }],
      
      // Airbnb Best Practices
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-wrappers': 'error',
      'no-throw-literal': 'error',
      'no-undef-init': 'error',
      'no-unused-expressions': 'error',
      'radix': 'error',
      'no-underscore-dangle': 'error',
      'no-param-reassign': ['error', { 
        props: true,
        ignorePropertyModificationsFor: ['state'], // Allow Redux Toolkit state mutations
      }],
      'no-return-assign': ['error', 'always'],
      'no-sequences': 'error',
      'no-unneeded-ternary': 'error',
      'no-nested-ternary': 'error',
      'no-plusplus': 'error',
      'yoda': 'error',
      
      // Airbnb ES6 Rules
      'arrow-parens': ['error', 'always'],
      'arrow-body-style': ['error', 'as-needed'],
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'template-curly-spacing': 'error',
      'object-shorthand': 'error',
      'prefer-destructuring': ['error', {
        array: true,
        object: true,
      }, {
        enforceForRenamedProperties: false,
      }],
      'prefer-spread': 'error',
      'prefer-rest-params': 'error',
      'no-duplicate-imports': 'error',
      
      // TypeScript overrides for Airbnb rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-shadow': 'error',
      'no-shadow': 'off', // Turn off base rule as it can report incorrect errors
      '@typescript-eslint/no-use-before-define': ['error', { functions: true, classes: true, variables: true }],
      'no-use-before-define': 'off', // Turn off base rule as it can report incorrect errors
      
      // Airbnb Import Rules
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
      'import/extensions': ['error', 'ignorePackages', {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      }],
      'import/no-unresolved': 'error',
      'import/prefer-default-export': 'off', // Modern React doesn't need this
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',
      'import/no-named-as-default': 'error',
      'import/no-named-as-default-member': 'error',
      
      // React Rules (Airbnb React Style)
      'react/react-in-jsx-scope': 'off', // React 17+
      'react/jsx-uses-react': 'off',     // React 17+
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
      'react/jsx-props-no-spreading': 'off', // Allow spreading for flexibility
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react/jsx-indent': ['error', 2],
      'react/jsx-indent-props': ['error', 2],
      'react/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
      'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
      'react/jsx-closing-tag-location': 'error',
      'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
      'react/jsx-tag-spacing': ['error', {
        closingSlash: 'never',
        beforeSelfClosing: 'always',
        afterOpening: 'never',
        beforeClosing: 'never',
      }],
      'react/self-closing-comp': ['error', {
        component: true,
        html: true,
      }],
      'react/function-component-definition': ['error', {
        namedComponents: 'function-declaration',
        unnamedComponents: 'arrow-function',
      }],
      'react/prop-types': 'off', // Using TypeScript instead
      'react/require-default-props': 'off', // TypeScript handles this
      'react/jsx-no-useless-fragment': 'error',
      'react/no-array-index-key': 'error',
      'react/jsx-key': 'error',
      'react/no-danger': 'error',
      'react/no-deprecated': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/jsx-pascal-case': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      
      // React Hooks Rules
      ...reactHooks.configs.recommended.rules,
      
      // React Refresh Rules
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      
      // Accessibility Rules (Airbnb includes these)
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/no-static-element-interactions': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      'jsx-a11y/img-redundant-alt': 'error',
      'jsx-a11y/no-access-key': 'error',
      'jsx-a11y/no-autofocus': ['error', { ignoreNonDOM: true }],
      'jsx-a11y/no-distracting-elements': 'error',
      'jsx-a11y/no-redundant-roles': 'error',
    },
  },
];