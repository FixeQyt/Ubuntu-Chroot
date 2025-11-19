// SPDX-License-Identifier: MIT
// https://nuxt.com/docs/api/configuration/nuxt-config
import terser from '@rollup/plugin-terser'

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	ssr: false,

	app: {
		baseURL: '/',
		head: {
			viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
			meta: [
				{ name: 'mobile-web-app-capable', content: 'yes' },
				{ name: 'apple-mobile-web-app-capable', content: 'yes' },
				{ name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
			],
		},
	},

	nitro: {
		preset: 'static',
		prerender: {
			routes: ['/'],
			crawlLinks: true,
			failOnError: false,
		},
		hooks: {
			'prerender:routes': (routes) => {
				routes.add('/index.html')
			},
		},
	},

	modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@nuxtjs/color-mode'],

	shadcn: {
		prefix: '',
		componentDir: '@/components/ui',
	},

	css: ['@/assets/css/tailwind.css'],
	// Temporarily disable Vite terser/minify configuration for debugging/build stability.
	// To re-enable aggressive minification, uncomment the `vite` block below.
	/*
  vite: {
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
          passes: 2,
        },
        mangle: {
          safari10: true,
        },
        format: {
          comments: false,
        },
      },
      rollupOptions: {
        plugins: [
          terser({
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log', 'console.info', 'console.debug'],
              passes: 2,
            },
            mangle: {
              safari10: true,
            },
            format: {
              comments: false,
            },
          }),
        ],
      },
    },
  },
  */

	// Temporarily disabled Nitro minify/compression for debugging/build stability.
	// To re-enable, uncomment the `nitro` block below.
	/*
  nitro: {
    minify: true,
    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },
  },
  */
})
