import path from 'node:path';

import { defineConfig } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

import { playwright } from '@vitest/browser-playwright';

const dirname = import.meta.dirname;

// テストするブランド（globals.css の [data-brand] と .storybook/preview.tsx のツールバーに対応）
const BRANDS = ['sakura', 'ocean'] as const;

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    // ブランドごとに Vitest のプロジェクトを作る。
    // 各プロジェクトで、全 Story を「ライト」「ダーク」の2つのブラウザで実行する。
    // → Story 数 × ブランド数 × 2 のテストになる
    projects: BRANDS.map((brand) => ({
      extends: true,
      plugins: [
        storybookTest({ configDir: path.join(dirname, '.storybook') }),
      ],
      // preview.tsx の decorator がこの値を見て <html data-brand="..."> を切り替える
      define: { __TEST_BRAND__: JSON.stringify(brand) },
      test: {
        name: brand,
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          // ダーク側は prefers-color-scheme: dark になり、ダーク用のトークンが効いた状態で
          // play 関数と a11y チェック（コントラストなど）が走る。
          instances: [
            { browser: 'chromium', name: `${brand}-light` },
            {
              browser: 'chromium',
              name: `${brand}-dark`,
              provider: playwright({ contextOptions: { colorScheme: 'dark' } }),
            },
          ],
        },
      },
    })),
  },
});
