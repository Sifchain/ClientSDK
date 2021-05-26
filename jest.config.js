const { defaults } = require('jest-config')
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', ...defaults.moduleFileExtensions],
}
