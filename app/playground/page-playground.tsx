'use client';

import { useEffect, useRef, useState } from 'react';

// Storybook を入れたときに付いてくるサンプルの Page（stories/Page.tsx）。
// props を持たず、ログイン状態は中で管理している（Header のボタンで切り替わる）。
import { Page } from '@/stories/Page';

import { Choice } from './choice';

// props で状態を渡せない部品は、Storybook では play 関数で「操作して」状態を作る。
// ここでも同じく、作り直したあとにボタンを自動で押して LoggedIn を再現する。

type Story = 'loggedOut' | 'loggedIn';
type Width = 'full' | 'mobile';

const stories: Record<Story, { label: string; note: string }> = {
  loggedOut: { label: 'LoggedOut', note: '作り直すだけ（初期状態）' },
  loggedIn: { label: 'LoggedIn', note: '作り直してから「Log in」を自動で押す（Storybook の play と同じ）' },
};

const widths: Record<Width, { label: string }> = {
  full: { label: '広い画面' },
  mobile: { label: 'スマホ幅（375px）' },
};

export function PagePlayground() {
  const [story, setStory] = useState<Story>('loggedOut');
  const [width, setWidth] = useState<Width>('full');
  // 見本を選ぶたびに数を増やし、key を変えて Page を作り直す
  const [round, setRound] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);

  // play 関数に相当：作り直した直後に、LoggedIn なら Log in ボタンを押す
  useEffect(() => {
    if (story !== 'loggedIn') return;
    const button = Array.from(previewRef.current?.querySelectorAll('button') ?? []).find(
      (b) => b.textContent === 'Log in',
    );
    button?.click();
  }, [story, round]);

  const choose = (s: Story) => {
    setStory(s);
    setRound((n) => n + 1);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-fg">見本（Storybook の Story と同じ）</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(Object.keys(stories) as Story[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => choose(s)}
                className={[
                  'rounded-control border-2 px-3 py-1.5 text-sm text-fg',
                  story === s ? 'border-brand' : 'border-border hover:border-brand',
                ].join(' ')}
              >
                {stories[s].label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-fg-muted">{stories[story].note}</p>
        </div>
        <Choice legend="画面の幅" name="page-width" value={width} options={widths} onChange={setWidth} />
      </div>

      <div>
        <p className="text-sm font-semibold text-fg">表示（ヘッダーのボタンも押せます）</p>
        <div className="mt-2 max-h-[560px] overflow-auto rounded-control border border-dashed border-border">
          <div
            ref={previewRef}
            data-testid="page-preview"
            className={width === 'mobile' ? 'mx-auto w-[375px] border-x border-border' : ''}
          >
            <Page key={round} />
          </div>
        </div>
      </div>

      <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-fg-muted">
        <li>Page は props がないので、Controls では状態を変えられません。状態は「操作」で作ります。</li>
        <li>
          Storybook の LoggedIn は、play 関数で Log in ボタンを押してから「Log out が出たか」をテストしています。
          ここの LoggedIn ボタンも同じ手順です。
        </li>
        <li>Page は Header と Button を組み合わせた部品です。小さな部品から画面を組み立てる流れが見られます。</li>
      </ul>
    </div>
  );
}
