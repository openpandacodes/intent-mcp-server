/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleNameMapper: {
    '^@modelcontextprotocol/sdk$': '<rootDir>/src/__mocks__/@modelcontextprotocol/sdk.ts',
    '^@anthropic-ai/sdk$': '<rootDir>/src/__mocks__/@anthropic-ai/sdk.ts'
  },
  moduleDirectories: ['node_modules', 'src'],
  setupFiles: ['<rootDir>/jest.setup.js']
}; 