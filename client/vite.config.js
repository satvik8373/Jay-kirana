import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5200,
    host: true,
    historyApiFallback: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined,
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});