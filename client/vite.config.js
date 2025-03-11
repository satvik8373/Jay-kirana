import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-redirects',
      closeBundle: () => {
        // Copy _redirects file to dist folder
        fs.copyFileSync(
          path.resolve(__dirname, 'public/_redirects'),
          path.resolve(__dirname, 'dist/_redirects')
        );
      }
    }
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:10000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
});