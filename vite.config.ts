import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
      '@/core': path.resolve(process.cwd(), './src/core'),
      '@/modules': path.resolve(process.cwd(), './src/modules'),
      '@/shared': path.resolve(process.cwd(), './src/shared'),
      '@/styles': path.resolve(process.cwd(), './src/styles'),
    },
  },
});
