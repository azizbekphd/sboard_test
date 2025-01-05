import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
    base: '/sboard_test/',
    optimizeDeps: {
        include: ['pixi.js-legacy'],
    },
    plugins: [mkcert()],
})
