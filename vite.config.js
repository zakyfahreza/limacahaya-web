import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

import { resolve } from 'path'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        interior: 'portfolio-interior.html',
        eksterior: 'portfolio-eksterior.html',
        renovasi: 'portfolio-renovasi.html',
        komersial: 'portfolio-komersial.html',
        residensial: 'portfolio-residensial.html',
        'manajemen-proyek': 'portfolio-manajemen-proyek.html'
      },
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
})
