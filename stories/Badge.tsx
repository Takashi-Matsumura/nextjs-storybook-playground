import './badge.css';

export interface BadgeProps {
  /** 表示するテキスト */
  label: string;
  /** 色の種類 */
  variant?: 'neutral' | 'success' | 'warning' | 'danger';
  /** サイズ */
  size?: 'small' | 'medium';
}

/** 状態やカテゴリを示す小さなラベル */
export const Badge = ({ label, variant = 'neutral', size = 'medium' }: BadgeProps) => {
  return (
    <span className={['badge', `badge--${variant}`, `badge--${size}`].join(' ')}>
      {label}
    </span>
  );
};
