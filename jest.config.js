module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.ts"
  ],
  transformIgnorePatterns: [
    "node_modules/(?!@ionic-native|@ionic)"
  ]
};
