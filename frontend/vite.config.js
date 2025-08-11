// vite.config.js
// Configuração básica para rodar o Vite sem complicação

import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    open: true,
    // Permite chamadas para o backend local sem CORS
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
