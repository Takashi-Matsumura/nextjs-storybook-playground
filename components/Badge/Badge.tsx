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

const variantClasses = {
  neutral: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-100',
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
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
        'inline-block rounded-full font-bold leading-none whitespace-nowrap',
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
