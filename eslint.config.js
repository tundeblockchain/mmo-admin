import queryPlugin from '@tanstack/eslint-plugin-query';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import jestDom from 'eslint-plugin-jest-dom';
import reactHooks from 'eslint-plugin-react-hooks';
import reactYouMightNotNeedAnEffect from 'eslint-plugin-react-you-might-not-need-an-effect';
import testingLibrary from 'eslint-plugin-testing-library';
import tseslint from 'typescript-eslint';

const architectureSyntax = [
  {
    selector: 'ExportDefaultDeclaration',
    message: 'Use named exports.',
  },
  {
    selector: "ImportSpecifier[imported.name='useEffect']",
    message:
      'Do not use useEffect. Derive during render, handle the event, or subscribe with useSyncExternalStore.',
  },
  {
    selector: "ImportSpecifier[imported.name='useLayoutEffect']",
    message:
      'Do not use useLayoutEffect. Derive during render, handle the event, or subscribe with useSyncExternalStore.',
  },
  {
    selector: "MemberExpression[object.name='React'][property.name='useEffect']",
    message:
      'Do not use useEffect. Derive during render, handle the event, or subscribe with useSyncExternalStore.',
  },
  {
    selector:
      "MemberExpression[object.name='React'][property.name='useLayoutEffect']",
    message:
      'Do not use useLayoutEffect. Derive during render, handle the event, or subscribe with useSyncExternalStore.',
  },
  {
    selector: "Property[key.name='queryKey'][value.type='ArrayExpression']",
    message: 'Use queryKeys from src/hooks/queryKeys.ts.',
  },
  {
    selector:
      "Property[key.name='queryKey'][value.type='TSAsExpression'][value.expression.type='ArrayExpression']",
    message: 'Use queryKeys from src/hooks/queryKeys.ts.',
  },
];

const envSyntax = {
  selector:
    "MemberExpression[object.type='MetaProperty'][property.name='env']",
  message: 'Read environment variables through src/config/env.ts.',
};

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/test/**'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: './tsconfig.app.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: true } },
      ],
      'no-console': 'error',
      'no-restricted-syntax': ['error', ...architectureSyntax, envSyntax],
    },
  },
  {
    files: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/test/**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: './tsconfig.test.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/api/client.ts', 'src/**/*.test.ts', 'src/**/*.test.tsx', 'src/test/**'],
    languageOptions: {
      parser: tseslint.parser,
    },
    rules: {
      'no-restricted-globals': [
        'error',
        {
          name: 'fetch',
          message: 'Use apiClient in src/api/client.ts.',
        },
      ],
    },
  },
  {
    files: ['src/config/env.ts'],
    rules: {
      'no-restricted-syntax': ['error', ...architectureSyntax],
    },
  },
  {
    files: ['src/lib/errors.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['src/components/**/*.{ts,tsx}', 'src/pages/**/*.{ts,tsx}'],
    ignores: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/api', '@/api/*'],
              message: 'UI code must use hooks, not the API client.',
            },
          ],
        },
      ],
    },
  },
  reactYouMightNotNeedAnEffect.configs.strict,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/set-state-in-effect': 'error',
    },
  },
  ...queryPlugin.configs['flat/recommended'].map((config) => ({
    ...config,
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      ...config.rules,
      '@tanstack/query/no-rest-destructuring': 'error',
    },
  })),
  {
    ...jsxA11y.flatConfigs.recommended,
    files: ['src/**/*.{ts,tsx}'],
  },
  {
    ...testingLibrary.configs['flat/react'],
    files: ['src/**/*.test.tsx'],
    rules: {
      ...testingLibrary.configs['flat/react'].rules,
      'testing-library/no-debugging-utils': 'error',
      'testing-library/prefer-user-event': 'error',
    },
  },
  {
    ...jestDom.configs['flat/recommended'],
    files: ['src/**/*.test.{ts,tsx}'],
  },
);
