import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/index.{ts,js}',
    '!src/**/types.{ts,js}'
  ],
  coverageDirectory: 'coverage',
  reporters: [
    'default',
    [
      'jest-junit',
      { outputDirectory: 'reports', outputName: 'junit.xml' }
    ]
  ],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.json' }]
  }
};

export default config;
