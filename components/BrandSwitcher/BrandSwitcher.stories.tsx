import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { expect, fn } from 'storybook/test';

import { BrandSwitcher, type Brand } from './BrandSwitcher';

const meta = {
  title: 'Components/BrandSwitcher',
  component: BrandSwitcher,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { value: 'sakura', onChange: fn() },
} satisfies Meta<typeof BrandSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

// 選択中の状態ごとの表示（a11y テストで「選択中ボタンの文字のコントラスト」も検査される）
export const SakuraSelected: Story = {};

export const OceanSelected: Story = {
  args: { value: 'ocean' },
};

// 色見本は、今のブランド（ツールバー／npm test のブランド）に関係なく、
// それぞれ自分のブランドの色で表示される（data-brand による範囲指定のテスト）
export const SwatchesShowOwnBrand: Story = {
  play: async ({ canvas }) => {
    const sakura = canvas.getByTestId('swatch-sakura');
    const ocean = canvas.getByTestId('swatch-ocean');
    await expect(getComputedStyle(sakura).backgroundColor).toBe('rgb(219, 39, 119)'); // #db2777
    await expect(getComputedStyle(ocean).backgroundColor).toBe('rgb(3, 105, 161)'); // #0369a1
  },
};

// 選択中のボタンでも、色見本はボタンの背景と違う色になる（見本が埋もれない）
// ブランドごと（npm test の sakura / ocean）に、両方のボタンを選択中にして確かめる
export const SelectedSwatchStandsOut: Story = {
  render: function Render(args) {
    return (
      <div className="flex flex-col gap-3">
        <BrandSwitcher {...args} value="sakura" />
        <BrandSwitcher {...args} value="ocean" />
      </div>
    );
  },
  play: async ({ canvas }) => {
    const pressed = canvas.getAllByRole('button', { pressed: true });
    await expect(pressed).toHaveLength(2);
    for (const button of pressed) {
      const swatch = button.querySelector('[data-testid^="swatch-"]')!;
      await expect(getComputedStyle(swatch).backgroundColor).not.toBe(getComputedStyle(button).backgroundColor);
    }
  },
};

// ① ボタンを押すと、押したブランドで onChange が呼ばれる
export const ClickCallsOnChange: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Ocean/ }));
    await expect(args.onChange).toHaveBeenCalledTimes(1);
    await expect(args.onChange).toHaveBeenCalledWith('ocean');
  },
};

// ② 状態を持たせて、選択状態（aria-pressed）が切り替わることを確かめる
export const Interactive: Story = {
  render: function Render(args) {
    const [brand, setBrand] = useState<Brand>(args.value);
    return (
      <BrandSwitcher
        value={brand}
        onChange={(b) => {
          setBrand(b);
          args.onChange(b);
        }}
      />
    );
  },
  play: async ({ canvas, userEvent, step }) => {
    const sakura = canvas.getByRole('button', { name: /Sakura/ });
    const ocean = canvas.getByRole('button', { name: /Ocean/ });

    await step('最初は Sakura が選択中', async () => {
      await expect(sakura).toHaveAttribute('aria-pressed', 'true');
      await expect(ocean).toHaveAttribute('aria-pressed', 'false');
    });

    await step('Ocean を押すと Ocean が選択中になる', async () => {
      await userEvent.click(ocean);
      await expect(ocean).toHaveAttribute('aria-pressed', 'true');
      await expect(sakura).toHaveAttribute('aria-pressed', 'false');
    });

    await step('Sakura を押すと元に戻る', async () => {
      await userEvent.click(sakura);
      await expect(sakura).toHaveAttribute('aria-pressed', 'true');
    });
  },
};
