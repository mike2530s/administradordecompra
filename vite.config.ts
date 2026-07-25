import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Verdulería La Primavera',
        short_name: 'La Primavera',
        description: 'Pide tus verduras frescas desde el celular',
        theme_color: '#065f46', // emerald-800
        background_color: '#f8fafc', // slate-50
        display: 'standalone',
        icons: [
          {
            src: '/logo.png', // Fallback icon
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
