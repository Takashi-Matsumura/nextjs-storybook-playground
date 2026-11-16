import type { Preview } from '@storybook/nextjs-vite'

// Next.js と同じ Tailwind（globals.css）を Storybook でも読み込む
import '../app/globals.css'

import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events'
import { addons } from 'storybook/preview-api'
import { themes } from 'storybook/theming'

// OS がダークモードなら、Docs ページもダークテーマにする
// （Tailwind の dark: クラスと Docs の背景色をそろえるため）
const prefersDark =
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches

// npm test ではブランドごとに Vitest のプロジェクトを分け、ここで強制的に切り替える
// （vitest.config.mts の define で埋め込まれる。通常の Storybook では undefined）
declare const __TEST_BRAND__: string | undefined
const testBrand = typeof __TEST_BRAND__ !== 'undefined' ? __TEST_BRAND__ : undefined

// 選ばれたブランドを <html data-brand="..."> に反映する
// → globals.css の [data-brand="ocean"] のトークンが効く
const applyBrand = (brand: unknown) => {
  document.documentElement.dataset.brand =
    testBrand ?? (typeof brand === 'string' ? brand : 'sakura')
}

// MDX だけのページ（Brand/Colors など）では decorator が呼ばれないため、
// ツールバーの値の設定・変更イベントでも反映する
if (typeof window !== 'undefined') {
  const channel = addons.getChannel()
  const onGlobals = ({ globals }: { globals: Record<string, unknown> }) => applyBrand(globals.brand)
  channel.on(SET_GLOBALS, onGlobals)
  channel.on(GLOBALS_UPDATED, onGlobals)
}

const preview: Preview = {
  // ツールバーに「Brand」メニューを追加する
  globalTypes: {
    brand: {
      description: 'ブランドを切り替える',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: [
          { value: 'sakura', title: 'Sakura（ピンク・丸い）' },
          { value: 'ocean', title: 'Ocean（ブルー・角ばった）' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    brand: 'sakura',
  },

  // Story を描画するたびにも反映する（npm test ではこちらが使われる）
  decorators: [
    (Story, context) => {
      applyBrand(context.globals.brand)
      return <Story />
    },
  ],

  parameters: {
    docs: {
      theme: prefersDark ? themes.dark : themes.light,
    },

    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo'  - 違反を表示するだけ（テストは失敗しない）
      // 'error' - 違反があるとテストを失敗させる（npm test / CI）
      // 'off'   - チェックしない
      test: 'error'
    }
  },
};

export default preview;
