import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = mode === 'production' 
    ? 'https://jay-kirana-api.onrender.com'
    : 'http://localhost:5000';

  return {
    plugins: [react()],
    server: {
      port: 5200,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: mode === 'production',
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: mode !== 'production',
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
      __API_URL__: JSON.stringify(apiUrl),
      __MODE__: JSON.stringify(mode)
    },
    base: '/',
    // Remove preview configuration as we're using static deployment
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom']
    }
  };
});