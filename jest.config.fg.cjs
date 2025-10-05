module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*\\.fg)\\.js$': '$1.ts',
  },
  setupFiles: ['<rootDir>/tests/setupEnv.fg.ts'],
  testMatch: ['**/tests/**/*.test.fg.ts'],
};
