// vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    server: {
      host: true,
      port: 6210,
      proxy: {
        '/api': {
          target: 'http://0.0.0.0:6110',
          changeOrigin: true, // Recommended for virtual hosts
          rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix
        },
      },
    },

    plugins: [
      react(),
      svgr(),
    ],

    define: {
      'process.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL),
    },

    resolve: {
      alias: {
        'src': path.resolve(__dirname, './src'),
      },
    },
  };
});