import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    rolldownOptions: { input: { home: 'index.html', expertise: 'expertise/index.html', work: 'work/index.html', contact: 'contact/index.html' } },
  },
});
