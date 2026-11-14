import type { Preview } from '@storybook/nextjs-vite'

// Next.js と同じ Tailwind（globals.css）を Storybook でも読み込む
import '../app/globals.css'

const preview: Preview = {
  parameters: {
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