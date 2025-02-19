import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),vue()],
  base: process.env.NODE_ENV === 'production' 
    ? '/n/VueJsSpaceX//' // Remplacez par le nom de votre dépôt GitHub
    : '/',
})
