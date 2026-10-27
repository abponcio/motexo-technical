import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { renderContentHtml } from './html-content.ts';

export default defineConfig({
  plugins: [react(), {
    name: 'motexo-content',
    transformIndexHtml(html, context) {
      const route = context.path.split('/').filter(Boolean)[0];
      return renderContentHtml(html, route === 'expertise' || route === 'work' || route === 'contact' ? route : 'home');
    },
  }],
  build: {
    target: 'es2022',
    rolldownOptions: { input: { home: 'index.html', expertise: 'expertise/index.html', work: 'work/index.html', contact: 'contact/index.html' } },
  },
});
