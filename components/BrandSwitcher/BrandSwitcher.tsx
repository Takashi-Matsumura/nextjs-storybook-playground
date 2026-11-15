export const BRANDS = [
  { value: 'sakura', label: 'Sakura', note: 'ピンク・丸い' },
  { value: 'ocean', label: 'Ocean', note: 'ブルー・角ばった' },
] as const;

export type Brand = (typeof BRANDS)[number]['value'];

export interface BrandSwitcherProps {
  /** 選択中のブランド */
  value: Brand;
  /** ボタンが押されたときに呼ばれる */
  onChange: (brand: Brand) => void;
}

/**
 * ブランドを選ぶボタンの組。
 * 表示だけを担当し、<html data-brand> の書き換えは呼び出し側が行う。
 */
export const BrandSwitcher = ({ value, onChange }: BrandSwitcherProps) => {
  return (
    <div role="group" aria-label="ブランドの切り替え" className="flex flex-wrap gap-2">
      {BRANDS.map((b) => {
        const active = value === b.value;
        return (
          <button
            key={b.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(b.value)}
            className={[
              'rounded-control border-2 px-4 py-2 text-sm font-semibold',
              active
                ? 'border-brand bg-brand text-on-brand'
                : 'border-border bg-surface text-fg hover:border-brand',
            ].join(' ')}
          >
            {b.label}
            <span className="ml-1.5 font-normal">（{b.note}）</span>
          </button>
        );
      })}
    </div>
  );
};
