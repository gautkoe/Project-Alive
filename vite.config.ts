import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Project-Alive/',
  plugins: [react()],
  resolve: {
    alias: {
      'react-router-dom': fileURLToPath(
        new URL('./vendor/react-router-dom/index.tsx', import.meta.url)
      ),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
