module.exports = {
  extends: ['plugin:@next/next/recommended', 'plugin:jest/recommended'],
  plugins: ['testing-library', 'jest'],
  overrides: [
    {
      files: ['**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
  ],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/extensions': 'off',
  },
};
