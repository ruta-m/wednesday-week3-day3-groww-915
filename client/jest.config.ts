import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // setupFilesAfterFramework: ['<rootDir>/src/setupTests.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    // Handle CSS/image imports in tests
    '\\.(css|less|scss|svg)$': '<rootDir>/__mocks__/fileMock.ts',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};

export default config;
