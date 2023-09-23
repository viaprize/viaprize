/** @type {import("eslint").Linter.Config} */
const config = {
  extends: ["custom/next"],
  rules:{
    "unicorn/filename-case":"off"
  }

};

module.exports = config;


