import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['src/tests/**/*.spec.ts', 'src/tests/**/*.test.ts'],
        coverage: {
            reporter: ['text', 'json', 'html'],
            include: ['src/lib/**/*.ts', 'src/app/api/**/*.ts'],
            exclude: ['src/tests/**', 'node_modules/**'],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
