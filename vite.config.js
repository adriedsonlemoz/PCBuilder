import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Caminhos relativos funcionam tanto no GitHub Pages quanto dentro do APK via Capacitor.
  base: './',
  plugins: [react()],
});
