module.exports = {
  "root": true,
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "parser": "@typescript-eslint/parser",
  "extends": [
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 13,
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "react-hooks",
    "@typescript-eslint"
  ],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "@typescript-eslint/no-empty-function": "warn",
    "react/no-children-prop": "warn",
    "@typescript-eslint/ban-ts-comment": "off"
  }
};