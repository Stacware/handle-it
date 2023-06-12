import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), vueJsx()],
	optimizeDeps: {
		include: ['parse', "events"]
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
	server: {
		proxy: {
			'/.netlify/functions': {
				target: 'https://handle-it.netlify.app',
				changeOrigin: true,

			}
		}
	},
	build: {
		rollupOptions: {
			plugins: [
				{
					name: 'copy-files',
					writeBundle () {
						fs.copyFileSync('./public/_redirects', './dist/_redirects')
					}
				}
			]
		}
	}
})
