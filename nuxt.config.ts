// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app:{
    head:{
      title:'水ai对话',
      meta:[
        {name:'description',content:'一个免费的ai对话网站'},
      ],
      link:[
        {rel:'manifest',href:'/manifest.webmanifest'}
      ]
    }
  },
	modules: ['@unocss/nuxt', 'nuxt-icon', '@vite-pwa/nuxt'],
	devtools: { enabled: true },
	compatibilityDate: '2025-01-21',
	pwa: {
		registerType: 'autoUpdate',
		includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
		manifest: {
			name: '水ai对话网站',
			short_name: 'ai对话',
			description: '免费的ai对话网站',
			theme_color: '#000000',
			icons: [
				{
					src: '/icon-192x192.webp',
					sizes: '192x192',
					type: 'image/webp',
				},
				{
					src: '/icon-512x512.webp',
					sizes: '512x512',
					type: 'image/webp',
				},
			],
		},
		workbox: {
			runtimeCaching: [
				{
					urlPattern: /\.(?:js|css|png|jpg|jpeg|svg|webp)$/,
					handler: 'CacheFirst',
					options: {
						cacheName: 'static-resources',
						expiration: {
							maxEntries: 100,
							maxAgeSeconds: 2592000, // 30 天
						},
					},
				},
			],
		},
    devOptions:{
      enabled:false,
      type:'module'
    }
	},
});
