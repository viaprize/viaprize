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
    '@typescript-eslint/no-unsafe-call': 'off',
    //TODO: on this soon
    '@typescript-eslint/no-unsafe-member-access': 'off',
    //TODO : on this soon
    '@typescript-eslint/no-unsafe-return': 'off',
    //TODO : on this  soon
    'turbo/no-undeclared-env-vars': 'off',
    //TODO: on this sooon,
    'no-console': 'off',
    '@typescript-eslint/no-unnecessary-condition': 'off',
    //TODO: on this soon
    '@typescript-eslint/no-misused-promises': 'off',
    'import/no-default-export': 'off',
    'react/react-in-jsx-scope': 'off',
    'jsx-a11y/accessible-emoji': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'eslint-comments/require-description': 'off',
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'import/order': 'off',
    // "unicorn/filename-case": [
    //   "error",
    //   {
    //     case: "pascalCase",
    //   },
    // ],
    'no-alert': 'off',
    'react/button-has-type': 'off',
    '@typescript-eslint/default-param-last': 'off',
    '@typescript-eslint/non-nullable-type-assertion-style': 'off',
    '@typescript-eslint/no-confusing-void-expression': 'off',
  },
};

module.exports = config;
