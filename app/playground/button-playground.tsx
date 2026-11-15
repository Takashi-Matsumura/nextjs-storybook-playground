'use client';

import { useState } from 'react';

// Storybook を入れたときに付いてくるサンプルの Button（stories/Button.tsx）。
// 中で styled-jsx（<style jsx>）を使っているので、クライアントコンポーネントから使う。
import { Button, type ButtonProps } from '@/stories/Button';

import { Choice } from './choice';

// Storybook の Controls / Actions に相当する操作を、Next.js のページ上で行う。

type Size = NonNullable<ButtonProps['size']>;
type Kind = 'primary' | 'secondary';

const kinds: Record<Kind, { label: string }> = {
  primary: { label: 'primary（主ボタン）' },
  secondary: { label: 'secondary（副ボタン）' },
};

const sizes: Record<Size, { label: string }> = {
  small: { label: 'small' },
  medium: { label: 'medium' },
  large: { label: 'large' },
};

// Storybook の Story と同じ見本
const presets: { name: string; props: { kind: Kind; size: Size; label: string } }[] = [
  { name: 'Primary', props: { kind: 'primary', size: 'medium', label: 'Button' } },
  { name: 'Secondary', props: { kind: 'secondary', size: 'medium', label: 'Button' } },
  { name: 'Large', props: { kind: 'secondary', size: 'large', label: 'Button' } },
  { name: 'Small', props: { kind: 'secondary', size: 'small', label: 'Button' } },
];

export function ButtonPlayground() {
  const [label, setLabel] = useState('Button');
  const [kind, setKind] = useState<Kind>('primary');
  const [size, setSize] = useState<Size>('medium');
  const [useColor, setUseColor] = useState(false);
  const [color, setColor] = useState('#16a34a');
  // Storybook の Actions パネルの代わり：onClick が呼ばれた記録
  const [clicks, setClicks] = useState<string[]>([]);

  const code = [
    '<Button',
    kind === 'primary' && ' primary',
    size !== 'medium' && ` size="${size}"`,
    useColor && ` backgroundColor="${color}"`,
    ` label="${label}"`,
    ' onClick={...}',
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
                setKind(p.props.kind);
                setSize(p.props.size);
                setLabel(p.props.label);
                setUseColor(false);
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
            <label htmlFor="button-label" className="text-sm font-semibold text-fg">
              label（ボタンの文字）
            </label>
            <input
              id="button-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="mt-2 w-full rounded-control border border-border bg-surface px-3 py-2 text-fg"
            />
          </div>
          <Choice legend="primary（種類）" name="button-kind" value={kind} options={kinds} onChange={setKind} />
          <Choice legend="size（大きさ）" name="button-size" value={size} options={sizes} onChange={setSize} />
          <fieldset>
            <legend className="text-sm font-semibold text-fg">backgroundColor（背景色）</legend>
            <div className="mt-2 flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-sm text-fg">
                <input
                  type="checkbox"
                  checked={useColor}
                  onChange={(e) => setUseColor(e.target.checked)}
                  className="accent-[var(--brand)]"
                />
                指定する
              </label>
              <input
                type="color"
                aria-label="背景色"
                value={color}
                disabled={!useColor}
                onChange={(e) => setColor(e.target.value)}
                className="h-8 w-12 cursor-pointer rounded-control border border-border bg-surface disabled:cursor-not-allowed disabled:opacity-40"
              />
              <span className="font-mono text-xs text-fg-muted">{useColor ? color : '指定なし'}</span>
            </div>
          </fieldset>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-fg">表示</p>
          <div
            data-testid="button-preview"
            className="flex min-h-24 items-center justify-center rounded-control border border-dashed border-border p-4"
          >
            <Button
              primary={kind === 'primary'}
              size={size}
              backgroundColor={useColor ? color : undefined}
              label={label}
              onClick={() => setClicks((c) => [`onClick（${new Date().toLocaleTimeString('ja-JP')}）`, ...c].slice(0, 5))}
            />
          </div>
          <p className="text-sm font-semibold text-fg">コード</p>
          <pre className="whitespace-pre-wrap break-all rounded-control border border-border bg-background p-3 font-mono text-xs text-fg">
            {code}
          </pre>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-fg">クリックの記録（Storybook の Actions パネルに相当）</p>
            <button
              type="button"
              onClick={() => setClicks([])}
              className="text-xs text-fg-muted underline underline-offset-4 hover:text-fg"
            >
              消す
            </button>
          </div>
          <ul data-testid="button-clicks" className="min-h-16 rounded-control border border-border bg-background p-3 font-mono text-xs text-fg">
            {clicks.length === 0 ? (
              <li className="text-fg-muted">ボタンを押すと、ここに記録されます</li>
            ) : (
              clicks.map((c, i) => <li key={`${c}-${i}`}>{c}</li>)
            )}
          </ul>
        </div>
      </div>

      <p className="text-sm leading-6 text-fg-muted">
        この Button は Storybook に最初から付いてくるサンプルで、色が直書きされています。
        そのため上のブランド切り替えでは見た目が変わりません（Badge や ContactForm との違い）。
      </p>
    </div>
  );
}
