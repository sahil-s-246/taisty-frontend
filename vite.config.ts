import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    host: true,
  },
  plugins: [
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'My Awesome PWA',
        short_name: 'PWA',
        start_url: '/',
        scope:'/',
        description: "A brief description of what your PWA does and offers to users",
        display: 'standalone',
        background_color: '#ffffff',
        lang: 'en',
        icons: [
          {
            src: '/c.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/b.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          // Add more icons as needed
        ],

      }
    }),
  ],
})