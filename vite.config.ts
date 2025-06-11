import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/readme-converter/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          markdown: ['marked', 'dompurify'],
          export: ['jspdf', 'html2canvas', 'docx', 'file-saver'],
          ui: ['framer-motion', 'lucide-react', 'react-dropzone'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'marked', 'dompurify'],
  },
});
