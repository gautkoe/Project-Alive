import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const base = process.env.GITHUB_PAGES === 'true' ? '/Project-Alive/' : '/';

// https://vitejs.dev/config/
export default defineConfig({
  base,
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
