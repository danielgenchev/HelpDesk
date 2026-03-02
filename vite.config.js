import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        register: resolve(__dirname, 'register.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        createTicket: resolve(__dirname, 'create-ticket.html'),
        viewTicket: resolve(__dirname, 'view-ticket.html'),
        settings: resolve(__dirname, 'settings.html')
      }
    }
  }
});