import type { Preview } from '@storybook/nextjs-vite'

// Next.js と同じ Tailwind（globals.css）を Storybook でも読み込む
import '../app/globals.css'

import { themes } from 'storybook/theming'

// OS がダークモードなら、Docs ページもダークテーマにする
// （Tailwind の dark: クラスと Docs の背景色をそろえるため）
const prefersDark =
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches

const preview: Preview = {
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