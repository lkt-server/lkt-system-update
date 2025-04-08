import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['iife'],
    dts: false,
    minify: true,
    external: [
        'axios',
        'vue',
        'lkt-control-tools',
        'lkt-http-client',
        'lkt-string-tools',
        'lkt-i18n',
    ],
});