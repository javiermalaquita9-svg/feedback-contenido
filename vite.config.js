import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // IMPORTANTE: Este debe ser el nombre EXACTO de tu repositorio en GitHub
  base: '/feedback-contenido/', 
  plugins: [
    react(),
    tailwindcss(),
  ],
})