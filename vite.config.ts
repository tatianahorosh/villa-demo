import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './',
  // GitHub Pages публикует готовый сайт из папки docs/ в ветке main
  build: { outDir: 'docs', emptyOutDir: true },
  plugins: [react(), tailwindcss()],
  server: { host: true, port: 5173 },
})
