import pluginReact from 'eslint-plugin-react'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { FlatCompat } from '@eslint/eslintrc'
import pluginJs from '@eslint/js'

const compat = new FlatCompat()

const compatConfig = compat.config({
    extends: ['plugin:@next/eslint-plugin-next/core-web-vitals']
})

export default tseslint.config({
    ignores: ['node_modules', '.turbo', '.next', 'build', 'coverage', 'global.d.ts'],
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    extends: [
        pluginJs.configs.recommended,
        pluginReact.configs.flat.recommended,
        ...tseslint.configs.recommended,
        ...compatConfig
    ],
    plugins: {
        'simple-import-sort': simpleImportSort
    },
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    settings: {
        react: {
            version: 'detect'
        }
    },
    rules: {
        'simple-import-sort/imports': [
            'error',
            {
                groups: [
                    [
                        '^react$',
                        '^react',
                        '^next',
                        '^W*',
                        '@(?!(app|partials|icons|shared-ui|atoms|molecules|organisms|templates|core|styles|public))'
                    ],
                    ['^@app'],
                    ['^@templates'],
                    ['^@partials'],
                    ['^@organisms'],
                    ['^@molecules'],
                    ['^@atoms'],
                    ['^@shared-ui'],
                    ['^@icons'],
                    ['^@core'],
                    ['^@styles'],
                    ['^@public'],
                    ['^\\u0000'],
                    ['^\\./', '^\\../']
                ]
            }
        ],
        'react/react-in-jsx-scope': 'off',
        /*  @typescript-eslint/consistent-type-exports ~> Isolated modules is already enabled in ts config */
        '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
        '@typescript-eslint/no-empty-interface': ['error', { allowSingleExtends: true }],
        '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }],
         
    }
})
