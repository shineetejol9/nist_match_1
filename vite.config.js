import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(), // React plugin for Vite
  ],
  build: {
    // Optional: increase warning limit if you have large chunks
    chunkSizeWarningLimit: 2500, // in kB
    rollupOptions: {
      output: {
        // Optional: manual chunking for large libraries
        manualChunks: {
          react: ['react', 'react-dom'],
          framer: ['framer-motion'],
        },
      },
    },
  },
});