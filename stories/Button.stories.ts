import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { expect, fn } from 'storybook/test';

import { Button } from './Button';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Example/Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/arg-types
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Button',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Button',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Button',
  },
};

// Interaction test: play 関数は Story の描画後に自動で実行される
export const ClickTest: Story = {
  args: {
    primary: true,
    label: 'クリックしてね',
  },
  play: async ({ args, canvas, userEvent, step }) => {
    // 1. 画面からボタンを探す（ユーザーと同じく「役割」と「名前」で探す）
    const button = canvas.getByRole('button', { name: 'クリックしてね' });

    // 2. クリック前は onClick が呼ばれていない
    await expect(args.onClick).not.toHaveBeenCalled();

    // 3. ユーザー操作を再現する（step で Interactions パネル上の区切りを付けられる）
    await step('2回クリックする', async () => {
      await userEvent.click(button);
      await userEvent.click(button);
    });

    // 4. 結果を検証する
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};
