'use client';

/** playground 用の選択肢（Storybook の Controls のラジオボタンに相当） */
export function Choice<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
}: {
  legend: string;
  name: string;
  value: T;
  options: Record<T, { label: string }>;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-fg">{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {(Object.keys(options) as T[]).map((key) => (
          <label
            key={key}
            className={[
              'cursor-pointer rounded-control border-2 px-3 py-1.5 text-sm text-fg',
              value === key ? 'border-brand' : 'border-border hover:border-brand',
            ].join(' ')}
          >
            <input
              type="radio"
              name={name}
              value={key}
              checked={value === key}
              onChange={() => onChange(key)}
              className="mr-1.5 accent-[var(--brand)]"
            />
            {options[key].label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
