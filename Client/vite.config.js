import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 3000, // Use the port from the environment variable or default to 3000
    strictPort: true // Prevents Vite from trying to use another port if the specified one is taken
  },
  build: {
    outDir: 'dist', // Specify the output directory
  },
})
