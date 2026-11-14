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
  },
};

export default preview;