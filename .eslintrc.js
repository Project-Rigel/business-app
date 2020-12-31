module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint/eslint-plugin", "testing-library"],
  extends: [
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint",
    "plugin:testing-library/angular"
  ],
  root: true,
  env: {
    node: true,
    jest: true
  },
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off"
  },
  overrides: [
    {
      files: [
        "*.resolver.ts",
        "*.spec.ts",
        "*.model.ts",
        "*.dto.ts",
        "*.scalar.ts",
        "*.view-model.ts"
      ],
      rules: {
        "@typescript-eslint/no-unused-vars": "off"
      }
    }
  ]
};
