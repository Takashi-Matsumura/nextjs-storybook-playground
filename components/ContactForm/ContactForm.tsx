'use client';

import { useState, type FormEvent } from 'react';

export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormProps {
  /** 入力チェックを通過したときに呼ばれる。Promise を reject すると「送信に失敗」の表示になる */
  onSubmit: (values: ContactFormValues) => void | Promise<void>;
  /** 最初から入っている値（編集画面や、入力済みの状態を見たいときに使う） */
  defaultValues?: Partial<ContactFormValues>;
}

type Errors = Partial<Record<keyof ContactFormValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: ContactFormValues): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = 'お名前を入力してください';
  if (!values.email.trim()) errors.email = 'メールアドレスを入力してください';
  else if (!EMAIL_PATTERN.test(values.email)) errors.email = 'メールアドレスの形式が正しくありません';
  if (!values.message.trim()) errors.message = 'お問い合わせ内容を入力してください';
  return errors;
}

const emptyValues: ContactFormValues = { name: '', email: '', message: '' };

/** お問い合わせフォーム */
export const ContactForm = ({ onSubmit, defaultValues }: ContactFormProps) => {
  const [values, setValues] = useState<ContactFormValues>({ ...emptyValues, ...defaultValues });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'failed'>('idle');

  const update = (key: keyof ContactFormValues) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setStatus('idle');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus('submitting');
    try {
      await onSubmit(values);
    } catch {
      // 失敗したときは入力を残して、もう一度送れるようにする
      setStatus('failed');
      return;
    }
    setValues(emptyValues);
    setStatus('done');
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex w-80 flex-col gap-4">
      <Field id="name" label="お名前" value={values.name} error={errors.name} onChange={update('name')} />
      <Field
        id="email"
        label="メールアドレス"
        type="email"
        value={values.email}
        error={errors.email}
        onChange={update('email')}
      />
      <Field
        id="message"
        label="お問い合わせ内容"
        multiline
        value={values.message}
        error={errors.message}
        onChange={update('message')}
      />

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="rounded-control bg-brand px-4 py-2 font-semibold text-on-brand hover:bg-brand-strong disabled:opacity-60"
      >
        {status === 'submitting' ? '送信中…' : '送信する'}
      </button>

      <p role="status" className="min-h-5 text-sm text-success-fg">
        {status === 'done' ? '送信しました。ありがとうございます。' : ''}
      </p>
      {status === 'failed' && (
        <p role="alert" className="-mt-4 text-sm text-danger">
          送信に失敗しました。時間をおいて、もう一度お試しください。
        </p>
      )}
    </form>
  );
};

interface FieldProps {
  id: string;
  label: string;
  value: string;
  error?: string;
  type?: string;
  multiline?: boolean;
  onChange: (value: string) => void;
}

function Field({ id, label, value, error, type = 'text', multiline, onChange }: FieldProps) {
  const errorId = `${id}-error`;
  const common = {
    id,
    value,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    className: [
      'w-full rounded-control border bg-surface px-3 py-2 text-fg',
      error ? 'border-danger' : 'border-border',
    ].join(' '),
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-fg">
        {label}
      </label>
      {multiline ? (
        <textarea {...common} rows={4} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input {...common} type={type} onChange={(e) => onChange(e.target.value)} />
      )}
      {error && (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
