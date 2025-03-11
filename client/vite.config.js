import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5200,
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production'
          ? 'https://jay-kirana-api.onrender.com'
          : 'http://localhost:5000',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['react-icons', 'framer-motion']
        }
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL)
  }
});