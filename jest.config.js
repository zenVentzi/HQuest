// const { defaults } = require('jest-config');

// module.exports = {
//   // verbose: true,
//   testPathIgnorePatterns: ['/node_modules/', '/dist/'],
//   moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts'],
// };

// "test": "ts-node node_modules/jest/bin/jest",

module.exports = {
  roots: ['<rootDir>/server'],
  // testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
