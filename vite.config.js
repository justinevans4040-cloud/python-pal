import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // BASE_URL is set to '/python-pal/' by CI for GitHub Pages.
  // Locally and on custom domains it stays '/'.
  base: process.env.BASE_URL || '/',
  build: {
    outDir: 'dist',
  },
})
