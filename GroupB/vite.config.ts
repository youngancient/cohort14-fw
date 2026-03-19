import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'  // ← this must be here

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), 
  ],
  build: {
    outDir: 'dist',
  },
})