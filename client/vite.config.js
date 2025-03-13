import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

// Ensure _redirects file exists in public directory
const redirectsContent = '/* /index.html 200';
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}
fs.writeFileSync('public/_redirects', redirectsContent);

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5200,
    host: true,
    historyApiFallback: true
  },
  preview: {
    port: 5200,
    historyApiFallback: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@mui/material', '@emotion/react', '@emotion/styled'],
          'icons': ['react-icons']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});