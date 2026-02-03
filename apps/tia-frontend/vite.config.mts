/// <reference types='vitest' />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/tia-frontend',
  plugins: [angular(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  // Uncomment this if you are using workers.
  // worker: {
  //   plugins: () => [ nxViteTsPaths() ],
  // },
  test: {
    name: 'tia-frontend',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      all: true,
      include: ['src/**/*.ts'],
      reportsDirectory: '../../coverage/apps/tia-frontend',
      provider: 'v8' as const,
      reporter: ['text', 'html', 'lcov', 'json'],
      exclude: [
        '**/*.html',
        '**/*.scss',
        '**/*.css',
        '**/test-setup.ts',
        '**/*.spec.ts',
        '**/*.config.*',
        '**/node_modules/**',
        'scripts/**',
        '**/src/main.ts',
        '**/*.routes.ts',
        '**/nx-welcome.ts',
        '**/environment.ts',
        '**/environment.prod.ts',
        '**/*.model.ts',
        '**/*.models.ts',
        '**/config/**',
        '**/*.actions.ts',
        '**/*.state.ts',
        '**/*.provider.ts',
        '**/*.constants.ts',
        '**/i18n/**',
      ],
    },
  },
}));
