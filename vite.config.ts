import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(),vue()],
  base: process.env.NODE_ENV === 'production' 
    ? '/n/VueJsSpaceX//'
    : '/',
})
