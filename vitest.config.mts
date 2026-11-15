import path from 'node:path';

import { defineConfig } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

import { playwright } from '@vitest/browser-playwright';

const dirname = import.meta.dirname;

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            // 同じ Story を「ライト」と「ダーク」の2つのブラウザで実行する。
            // ダーク側は prefers-color-scheme: dark になり、Tailwind の dark: クラスが効いた状態で
            // play 関数と a11y チェック（コントラストなど）が走る。
            instances: [
              { browser: 'chromium', name: 'light' },
              {
                browser: 'chromium',
                name: 'dark',
                provider: playwright({ contextOptions: { colorScheme: 'dark' } }),
              },
            ],
          },
        },
      },
    ],
  },
});
