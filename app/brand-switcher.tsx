'use client';

import { useEffect, useState } from 'react';

const BRANDS = [
  { value: 'sakura', label: 'Sakura', note: 'ピンク・丸い' },
  { value: 'ocean', label: 'Ocean', note: 'ブルー・角ばった' },
] as const;

type Brand = (typeof BRANDS)[number]['value'];

/** <html data-brand="..."> を切り替えて、ページ全体のブランドトークンを差し替える */
export function BrandSwitcher() {
  const [brand, setBrand] = useState<Brand>('sakura');

  // 選んだブランドを <html data-brand="..."> に反映する（外部の DOM との同期なので effect で行う）
  useEffect(() => {
    document.documentElement.dataset.brand = brand;
  }, [brand]);

  return (
    <div role="group" aria-label="ブランドの切り替え" className="flex flex-wrap gap-2">
      {BRANDS.map((b) => {
        const active = brand === b.value;
        return (
          <button
            key={b.value}
            type="button"
            aria-pressed={active}
            onClick={() => setBrand(b.value)}
            className={[
              'rounded-control border-2 px-4 py-2 text-sm font-semibold',
              active
                ? 'border-brand bg-brand text-on-brand'
                : 'border-border bg-surface text-fg hover:border-brand',
            ].join(' ')}
          >
            {b.label}
            <span className="ml-1.5 font-normal opacity-90">（{b.note}）</span>
          </button>
        );
      })}
    </div>
  );
}
