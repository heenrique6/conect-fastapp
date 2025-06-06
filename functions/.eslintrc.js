module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"],
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": ["error", "double"],
    "indent": ["error", 2],
    "max-len": ["error", { "code": 120 }],
    "import/no-unresolved": 0,
    "import/no-duplicates": "error",
  },
  ignorePatterns: [
    ".eslintrc.js",
    "/lib/**/*",
    "/generated/**/*",
  ],
};

