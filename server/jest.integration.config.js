// const { defaults } = require('jest-config');

// module.exports = {
//   // verbose: true,
//   testPathIgnorePatterns: ['/node_modules/', '/dist/'],
//   moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts'],
// };

// "test": "ts-node node_modules/jest/bin/jest",

module.exports = {
  testEnvironment: 'node',
  // roots: ['<rootDir>/server'],
  globals: {
    'ts-jest': {
      tsConfig: 'server/tsconfig.json',
    },
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
    // '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '((\\.|/)(int.test|int.spec))\\.(jsx?|tsx?)$',
  // testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupTestFrameworkScriptFile: './jestSetup.ts',
};
