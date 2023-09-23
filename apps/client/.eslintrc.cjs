/** @type {import("eslint").Linter.Config} */
const config = {
  extends: ["custom/next"],
  rules:{
    "unicorn/filename-case":"off",
    "react/jsx-sort-props":"off",
    "@typescript-eslint/no-unnecessary-type-arguments":'off',
    //TODO: on this soon
    "@typescript-eslint/no-unsafe-call":"warn",
    //TODO: on this soon
    "@typescript-eslint/no-unsafe-member-access":"warn",
    //TODO : on this soon
    "@typescript-eslint/no-unsafe-return":"warn",
    //TODO : on this  soon
    "turbo/no-undeclared-env-vars":"warn",
    //TODO: on this sooon,
    "no-console":"warn",
    //TODO: on this soon
    "@typescript-eslint/no-misused-promises":"warn"
  }

};

module.exports = config;


