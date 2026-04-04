import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => {
  return {
    // Si ejecutas 'npm run build' (para GitHub) usa la subcarpeta. 
    // Si ejecutas 'npm run dev' (para local) usa la raíz '/'.
    base: command === 'build' ? '/feedback-contenido/' : '/', 
    plugins: [
      react(),
      tailwindcss(),
    ],
  }
})