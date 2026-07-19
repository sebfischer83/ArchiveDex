import { defineConfig } from '@playwright/test';
export default defineConfig({ webServer: { command: 'npm start', url: 'http://localhost:4200' } });
