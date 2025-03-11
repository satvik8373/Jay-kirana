import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';

  return {
    plugins: [react()],
    server: {
      port: 5200,
      proxy: {
        '/api': {
          target: isProduction
            ? 'https://jay-kirana-api.onrender.com'
            : 'http://localhost:5000',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path
        },
        '/uploads': {
          target: isProduction
            ? 'https://jay-kirana-api.onrender.com'
            : 'http://localhost:5000',
          changeOrigin: true,
          secure: true
        }
      }
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.VITE_API_URL': JSON.stringify(
        isProduction
          ? 'https://jay-kirana-api.onrender.com/api'
          : 'http://localhost:5000/api'
      )
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['react-icons', 'framer-motion']
          }
        }
      }
    }
  };
});