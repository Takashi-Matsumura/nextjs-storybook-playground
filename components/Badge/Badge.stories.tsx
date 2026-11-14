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
    // CSS Modules のクラス名はハッシュ付きなので、部分一致で確認する
    await expect(badge.className).toMatch(/success/);
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
