// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  // jsdom sirve para pruebas de frontend; si alguna prueba requiere Node puro,
  // puedes poner el pragma en el test: /** @jest-environment node */
  testEnvironment: 'node',
  clearMocks: true,
  verbose: true,

  // Detección de tests
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/', '/coverage/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Dónde buscar por defecto
  roots: ['<rootDir>/src', '<rootDir>/tests'],

  // Transforma TS/TSX con ts-jest
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },

  // Alias y estáticos
  moduleNameMapper: {
    // Alias previos
    '^@/(.*)$': '<rootDir>/src/$1',
    // Alias nuevos y útiles
    '^@backend/(.*)$': '<rootDir>/src/$1',
    '^@frontend/(.*)$': '<rootDir>/frontend/src/$1',
    // Estáticos/CSS
    '\\.(css|scss|sass|less)$': 'identity-obj-proxy',
  },

  // Archivos que cuentan para cobertura (backend + frontend)
  collectCoverageFrom: [
  'src/**/*.{ts,tsx,js,jsx}',
  '!src/**/index.{ts,tsx,js,jsx}',
  '!src/**/*.d.ts',
  '!src/**/types.{ts,tsx,js,jsx}',
  '!src/**/*.test.{ts,tsx,js,jsx}',
  ],

  coveragePathIgnorePatterns: [
  '/node_modules/',
  '/dist/',
  'src/server.ts',   
  'src/config/db.ts' 
],

  // Dónde y en qué formatos se genera la cobertura
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  // Umbral mínimo (Sonar OK a 80%)
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Setup para variables de entorno de Vite en tests y otros ajustes
  setupFiles: ['<rootDir>/tests/setup/env.setup.ts'],
};

export default config;
