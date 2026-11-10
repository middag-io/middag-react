import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
    {
        ignores: [
            'dist/',
            'demo/dist/',
            '.docs-dist/',
            'dist-lib/',
            'dist-master/',
            'dist-mock/',
            'docs/.vitepress/dist/',
            'docs/.vitepress/cache/',
            'node_modules/',
            'scripts/',
            'src/assets/lottie/next-app/',
            'src/primitives/reui/',
            'src/primitives/examples/',
            'src/contracts/generated/'
        ]
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },
    {
        // Raw requests go through trackedFetch (src/lib/host-pending.ts), so a host
        // that tracks pending work (Moodle's Behat) waits for them.
        files: ['src/**/*.{ts,tsx}'],
        rules: {
            'no-restricted-globals': [
                'error',
                { name: 'fetch', message: 'Use trackedFetch from @/lib/host-pending.' },
            ],
            'no-restricted-properties': [
                'error',
                ...['window', 'globalThis', 'self'].map((object) => ({
                    object,
                    property: 'fetch',
                    message: 'Use trackedFetch from @/lib/host-pending.',
                })),
            ],
        },
    },
    prettierConfig,
);
