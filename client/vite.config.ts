import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  build: {
    //outDir:'../API/wwwroot',
    outDir: 'dist',
    chunkSizeWarningLimit: 1500,
    emptyOutDir: true
  },
  server: {
    port: 3000
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
