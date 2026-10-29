/** @type {import('jest').Config} */
module.exports = {
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.tools.json' }] },
  testEnvironment: 'node',
  testMatch: ['<rootDir>/submission/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  passWithNoTests: false,
};
