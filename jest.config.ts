export default {
    testEnvironment: 'node',
    testEnvironmentOptions: {
        NODE_ENV: 'test',
    },
    restoreMocks: true,
    coveragePathIgnorePatterns: [
        'node_modules',
        'src/config',
        'src/app.ts',
        'tests',
        'dist',
    ],
    modulePathIgnorePatterns: ['<rootDir>/dist/'],
    coverageReporters: ['text', 'lcov', 'clover', 'html'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
}
