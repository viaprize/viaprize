/** @type {import("eslint").Linter.Config} */
const config = {
  // extends: ["custom/next"],
  extends: [
    '@vercel/style-guide/eslint/node',
    '@vercel/style-guide/eslint/browser',
    '@vercel/style-guide/eslint/typescript',
    '@vercel/style-guide/eslint/react',
    '@vercel/style-guide/eslint/next',
    'eslint-config-turbo',
  ].map((path) => require.resolve(path)), // specify the type of 'path' parameter explicitly
  overrides: [
    {
      // extends: [
      //   "plugin:@typescript-eslint/recommended-requiring-type-checking",
      // ],
      files: ['*.ts', '*.tsx'],
    },
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
  globals: {
    React: true,
    JSX: true,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  ignorePatterns: ['node_modules/', 'dist/', 'lib/smartContract.ts','next/babel'],
  // add rules configurations here
  rules: {
    'unicorn/filename-case': 'off',
    'react/jsx-sort-props': 'off',
    '@typescript-eslint/no-unnecessary-type-arguments': 'off',
    //TODO: on this soon
    '@typescript-eslint/no-unsafe-call': 'warn',
    //TODO: on this soon
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    //TODO : on this soon
    '@typescript-eslint/no-unsafe-return': 'warn',
    //TODO : on this  soon
    'turbo/no-undeclared-env-vars': 'warn',
    //TODO: on this sooon,
    'no-console': 'warn',
    '@typescript-eslint/no-unnecessary-condition': 'warn',
    //TODO: on this soon
    '@typescript-eslint/no-misused-promises': 'warn',
    'import/no-default-export': 'off',
    'react/react-in-jsx-scope': 'off',
    'jsx-a11y/accessible-emoji': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'eslint-comments/require-description': 'warn',
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    // "unicorn/filename-case": [
    //   "error",
    //   {
    //     case: "pascalCase",
    //   },
    // ],
    'no-alert': 'warn',
    'react/button-has-type': 'off',
    '@typescript-eslint/default-param-last': 'off',
    '@typescript-eslint/non-nullable-type-assertion-style': 'warn',
    '@typescript-eslint/no-confusing-void-expression': 'warn',
  },
};

module.exports = config;
