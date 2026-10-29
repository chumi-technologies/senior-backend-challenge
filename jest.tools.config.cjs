/** @type {import('jest').Config} */
module.exports = {
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.tools.json' }] },
  testEnvironment: 'node',
  testMatch: ['<rootDir>/scripts/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
};
