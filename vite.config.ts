import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ts from 'vite-plugin-ts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ts()],
  optimizeDeps: {
    include: ['dominionrandomizercore'],
  },
})
