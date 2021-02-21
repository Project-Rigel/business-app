module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverage: true,
  coverageReporters: ['html'],
  transformIgnorePatterns: ['node_modules/(?!@ionic-native|@ionic)'],
};
