import { resolve } from 'path'

export default {
    root: resolve(__dirname, 'src'),
    publicDir: resolve(__dirname, 'public'),
    build: {
        outDir: '../dist'
    },
    // Optional: Silence Sass deprecation warnings. See note below.
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: [
                    'import',
                    'mixed-decls',
                    'color-functions',
                    'global-builtin',
                ],
            },
        },
    },
}

