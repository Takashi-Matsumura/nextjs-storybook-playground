export interface BadgeProps {
  /** 表示するテキスト */
  label: string;
  /** 色の種類 */
  variant?: 'neutral' | 'success' | 'warning' | 'danger';
  /** サイズ */
  size?: 'small' | 'medium';
  /** 追加の Tailwind クラス（余白の調整など） */
  className?: string;
}

// 色はデザイントークン（app/globals.css）の名前で指定する。
// ダークモードの色もトークン側で切り替わるので、dark: クラスは不要。
const variantClasses = {
  neutral: 'bg-neutral-bg text-neutral-fg',
  success: 'bg-success-bg text-success-fg',
  warning: 'bg-warning-bg text-warning-fg',
  danger: 'bg-danger-bg text-danger-fg',
};

const sizeClasses = {
  small: 'px-2 py-0.5 text-[11px]',
  medium: 'px-3 py-1 text-[13px]',
};

/** 状態やカテゴリを示す小さなラベル */
export const Badge = ({
  label,
  variant = 'neutral',
  size = 'medium',
  className = '',
}: BadgeProps) => {
  return (
    <span
      className={[
        'inline-block rounded-badge font-bold leading-none whitespace-nowrap',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label}
    </span>
  );
};
