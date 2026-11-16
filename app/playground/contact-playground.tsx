'use client';

import { useState } from 'react';

import { ContactForm, type ContactFormValues } from '@/components/ContactForm/ContactForm';

import { Choice } from './choice';

// Storybook の Controls / 各 Story に相当する切り替えを、Next.js のページ上で行う。
// 部品は同じ ContactForm。onSubmit の振る舞いと defaultValues を変えて状態を作る。

const results = {
  success: { label: '成功する', note: '0.6秒後に「送信しました」' },
  failure: { label: '失敗する', note: '「送信に失敗しました」が出て、入力は残る' },
  pending: { label: '終わらない', note: '「送信中…」のまま止まる' },
} as const;

const presets = {
  empty: { label: '空', values: undefined },
  filled: {
    label: '入力済み',
    values: { name: '山田 太郎', email: 'taro@example.com', message: 'Storybook について質問があります。' },
  },
  invalid: {
    label: 'メール形式が不正',
    values: { name: '山田 太郎', email: 'taro@example', message: 'テスト' },
  },
  long: {
    label: '長い文章',
    values: {
      name: 'とても長い名前の山田 太郎左衛門之助',
      email: 'very.long.email.address.for.layout.check@example.co.jp',
      message: 'Storybook について質問があります。'.repeat(8),
    },
  },
} satisfies Record<string, { label: string; values?: Partial<ContactFormValues> }>;

type Result = keyof typeof results;
type Preset = keyof typeof presets;

const submitters: Record<Result, () => Promise<void>> = {
  success: () => new Promise((r) => setTimeout(r, 600)),
  failure: () => new Promise((_, reject) => setTimeout(() => reject(new Error('demo')), 600)),
  pending: () => new Promise(() => {}),
};

export function ContactPlayground() {
  const [result, setResult] = useState<Result>('success');
  const [preset, setPreset] = useState<Preset>('empty');
  const [round, setRound] = useState(0);

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_auto]">
      <div className="flex flex-col gap-5">
        <Choice legend="送信したときの結果" name="result" value={result} options={results} onChange={setResult} />
        <p className="-mt-3 text-sm text-fg-muted">{results[result].note}</p>
        <Choice legend="最初に入っている値" name="preset" value={preset} options={presets} onChange={setPreset} />
        <button
          type="button"
          onClick={() => setRound((n) => n + 1)}
          className="self-start rounded-control border-2 border-border px-3 py-1.5 text-sm text-fg hover:border-brand"
        >
          フォームを最初の状態に戻す
        </button>
        <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-fg-muted">
          <li>「空」のまま送信 → 入力エラー（3項目）</li>
          <li>「メール形式が不正」で送信 → メール欄だけエラー</li>
          <li>「入力済み」＋ 結果を選んで送信 → 送信中 / 成功 / 失敗</li>
          <li>Storybook の Story（Filled・Submitting・SubmitFailed など）と同じ状態です</li>
        </ul>
      </div>
      {/* 設定が変わったら key を変えてフォームを作り直す（defaultValues は最初の値なので） */}
      <ContactForm key={`${preset}-${result}-${round}`} defaultValues={presets[preset].values} onSubmit={submitters[result]} />
    </div>
  );
}
