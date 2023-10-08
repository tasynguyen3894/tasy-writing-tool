import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';
import { PluginOption } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: [
      // Matches vitest tests in any subfolder of 'src' or into 'test/vitest/__tests__'
      // Matches all files with extension 'js', 'jsx', 'ts' and 'tsx'
      'src/**/__tests__/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
  },
  plugins: [
    vue({
      template: { transformAssetUrls },
    }) as PluginOption,
    quasar({
      sassVariables: 'src/quasar-variables.scss',
    }) as PluginOption,
    tsconfigPaths(),
  ],
});
