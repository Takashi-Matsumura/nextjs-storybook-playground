import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { expect } from 'storybook/test';

import { Badge } from './Badge';

// meta: このファイル全体の設定（サイドバーの場所・対象コンポーネント・共通の args）
const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { label: 'Badge' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// 基本の Story: args を変えるだけでバリエーションを作れる
export const Neutral: Story = {};

export const Success: Story = {
  args: { variant: 'success', label: '公開中' },
  // 操作のないコンポーネントでも、play で「正しく描画されたか」を検証できる
  play: async ({ canvas }) => {
    const badge = canvas.getByText('公開中');
    await expect(badge).toBeVisible();
    // Tailwind が Storybook で効いていれば、背景色が透明ではなくなる
    await expect(getComputedStyle(badge).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  },
};

export const Warning: Story = {
  args: { variant: 'warning', label: '下書き' },
};

export const Danger: Story = {
  args: { variant: 'danger', label: 'エラー' },
};

export const Small: Story = {
  args: { size: 'small', label: 'New' },
};

// 長いテキストでも崩れないかを確認するための Story
export const LongLabel: Story = {
  args: { label: 'とても長いラベルのテキストが入った場合の表示確認' },
};

// className で Tailwind のクラスを外から追加できる
export const WithClassName: Story = {
  args: { label: 'カスタム', className: 'ring-2 ring-pink-400 ring-offset-2' },
};

// render を使うと、複数を並べた一覧も Story にできる
export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Badge {...args} variant="neutral" label="Neutral" />
      <Badge {...args} variant="success" label="Success" />
      <Badge {...args} variant="warning" label="Warning" />
      <Badge {...args} variant="danger" label="Danger" />
    </div>
  ),
};
