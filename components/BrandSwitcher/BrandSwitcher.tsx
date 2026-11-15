// 型は文字列の組み合わせで直接書く（Storybook の Docs / Controls が選択肢として読み取れるように）
export type Brand = 'sakura' | 'ocean';

export const BRANDS: readonly { value: Brand; label: string; note: string }[] = [
  { value: 'sakura', label: 'Sakura', note: 'ピンク・丸い' },
  { value: 'ocean', label: 'Ocean', note: 'ブルー・角ばった' },
];

export interface BrandSwitcherProps {
  /** 選択中のブランド */
  value: 'sakura' | 'ocean';
  /** ボタンが押されたときに呼ばれる */
  onChange: (brand: Brand) => void;
}

/**
 * ブランドを選ぶボタンの組。
 * 表示だけを担当し、`<html data-brand>` の書き換えは呼び出し側が行う。
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
              'inline-flex items-center rounded-control border-2 px-4 py-2 text-sm font-semibold',
              // 選択中は塗りつぶさず「ブランド色の太い枠 + ✓」で示す。
              // 塗りつぶすと、同じブランドの色見本がボタンの色に埋もれて見えなくなるため
              active
                ? 'border-brand bg-surface text-fg ring-2 ring-brand'
                : 'border-border bg-surface text-fg hover:border-brand',
            ].join(' ')}
          >
            {/* 色見本: data-brand でこの要素の中だけ「そのボタンのブランド」のトークンにする。
                今のブランドに関係なく、自分のブランドの色と形（角丸）で表示される。
                枠線は currentColor（文字色）なので、ライト/ダークどちらでも輪郭が見える */}
            <span
              aria-hidden
              data-brand={b.value}
              data-testid={`swatch-${b.value}`}
              className="mr-2 inline-block size-3.5 rounded-badge bg-brand ring-1 ring-current"
            />
            {b.label}
            <span className="ml-1.5 font-normal">（{b.note}）</span>
            {/* 色だけに頼らず、形でも選択中がわかるようにする */}
            {active && (
              <span aria-hidden className="ml-2">
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
