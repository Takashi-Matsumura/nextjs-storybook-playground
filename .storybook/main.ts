import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  "stories": [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../design-system/**/*.mdx"
  ],
  "addons": [
    "@storybook/addon-docs",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y"
  ],
  "framework": "@storybook/nextjs-vite",
  "staticDirs": [
    "../public"
  ],
  // Next.js は @tailwindcss/turbopack で Tailwind を処理するが、
  // Storybook は Vite で動くため、Vite 用プラグインを追加する
  async viteFinal(config) {
    const { mergeConfig } = await import('vite');
    const { default: tailwindcss } = await import('@tailwindcss/vite');
    return mergeConfig(config, {
      plugins: [tailwindcss()],
      // next build の出力（.next/）の変更で Storybook が再読み込みしないようにする
      server: { watch: { ignored: ['**/.next/**'] } },
    });
  },
};
export default config;
