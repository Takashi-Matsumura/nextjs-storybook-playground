'use client';

import { useState, type FormEvent } from 'react';

export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormProps {
  /** 入力チェックを通過したときに呼ばれる */
  onSubmit: (values: ContactFormValues) => void | Promise<void>;
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
export const ContactForm = ({ onSubmit }: ContactFormProps) => {
  const [values, setValues] = useState<ContactFormValues>(emptyValues);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle');

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
    await onSubmit(values);
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
        className="rounded-md bg-zinc-900 px-4 py-2 font-semibold text-white hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {status === 'submitting' ? '送信中…' : '送信する'}
      </button>

      <p role="status" className="min-h-5 text-sm text-green-700 dark:text-green-400">
        {status === 'done' ? '送信しました。ありがとうございます。' : ''}
      </p>
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
      'w-full rounded-md border bg-white px-3 py-2 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100',
      error ? 'border-red-600' : 'border-zinc-400 dark:border-zinc-600',
    ].join(' '),
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
        {label}
      </label>
      {multiline ? (
        <textarea {...common} rows={4} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input {...common} type={type} onChange={(e) => onChange(e.target.value)} />
      )}
      {error && (
        <p id={errorId} className="text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
