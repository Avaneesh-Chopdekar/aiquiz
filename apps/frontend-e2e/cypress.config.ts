import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      bundler: 'vite',
      webServerCommands: {
        default: 'pnpm exec nx run @aiquiz/frontend:dev',
        production: 'pnpm exec nx run @aiquiz/frontend:preview',
      },
      ciWebServerCommand: 'pnpm exec nx run @aiquiz/frontend:preview',
      ciBaseUrl: 'http://localhost:5173',
    }),
    baseUrl: 'http://localhost:5173',
  },
});
