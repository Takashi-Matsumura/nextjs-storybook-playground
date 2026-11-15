'use client';

import { useState } from 'react';

import { Badge, type BadgeProps } from '@/components/Badge/Badge';

import { Choice } from './choice';

// Storybook の Controls に相当する操作を、Next.js のページ上で行う。
// 部品は同じ Badge。props を変えると、その場で表示とコードが変わる。

type Variant = NonNullable<BadgeProps['variant']>;
type Size = NonNullable<BadgeProps['size']>;

const variants: Record<Variant, { label: string }> = {
  neutral: { label: 'neutral' },
  success: { label: 'success' },
  warning: { label: 'warning' },
  danger: { label: 'danger' },
};

const sizes: Record<Size, { label: string }> = {
  medium: { label: 'medium' },
  small: { label: 'small' },
};

// Storybook の Story と同じ見本（ボタンで一発で切り替えられる）
const presets: { name: string; props: { label: string; variant: Variant; size: Size } }[] = [
  { name: 'Neutral', props: { label: 'Neutral', variant: 'neutral', size: 'medium' } },
  { name: 'Success', props: { label: '公開中', variant: 'success', size: 'medium' } },
  { name: 'Warning', props: { label: '下書き', variant: 'warning', size: 'medium' } },
  { name: 'Danger', props: { label: 'エラー', variant: 'danger', size: 'medium' } },
  { name: 'Small', props: { label: 'NEW', variant: 'success', size: 'small' } },
  { name: 'LongLabel', props: { label: 'とても長いラベルのバッジでも折り返さない', variant: 'neutral', size: 'medium' } },
];

export function BadgePlayground() {
  const [label, setLabel] = useState('公開中');
  const [variant, setVariant] = useState<Variant>('success');
  const [size, setSize] = useState<Size>('medium');

  // 既定値（variant="neutral" / size="medium"）は書かない。実際のコードと同じ書き方にする
  const code = [
    '<Badge',
    variant !== 'neutral' && ` variant="${variant}"`,
    size !== 'medium' && ` size="${size}"`,
    ` label="${label}"`,
    ' />',
  ]
    .filter(Boolean)
    .join('');

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-sm font-semibold text-fg">見本（Storybook の Story と同じ）</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                setLabel(p.props.label);
                setVariant(p.props.variant);
                setSize(p.props.size);
              }}
              className="rounded-control border-2 border-border px-3 py-1.5 text-sm text-fg hover:border-brand"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="badge-label" className="text-sm font-semibold text-fg">
              label（表示するテキスト）
            </label>
            <input
              id="badge-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="mt-2 w-full rounded-control border border-border bg-surface px-3 py-2 text-fg"
            />
          </div>
          <Choice legend="variant（色の種類）" name="badge-variant" value={variant} options={variants} onChange={setVariant} />
          <Choice legend="size（大きさ）" name="badge-size" value={size} options={sizes} onChange={setSize} />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-fg">表示</p>
          <div
            data-testid="badge-preview"
            className="flex min-h-24 items-center justify-center overflow-x-auto rounded-control border border-dashed border-border p-4"
          >
            <Badge label={label} variant={variant} size={size} />
          </div>
          <p className="text-sm font-semibold text-fg">コード</p>
          <pre className="whitespace-pre-wrap break-all rounded-control border border-border bg-background p-3 font-mono text-xs text-fg">
            {code}
          </pre>
        </div>
      </div>
    </div>
  );
}
