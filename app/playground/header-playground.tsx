'use client';

import { useState } from 'react';

// Storybook を入れたときに付いてくるサンプルの Header（stories/Header.tsx）。
// 中で styled-jsx を使う Button を含むので、クライアントコンポーネントから使う。
import { Header } from '@/stories/Header';

import { Choice } from './choice';

// Storybook の Controls / Actions / Viewport に相当する操作を、Next.js のページ上で行う。

type Login = 'loggedOut' | 'loggedIn';
type Width = 'full' | 'mobile';

const logins: Record<Login, { label: string }> = {
  loggedOut: { label: 'ログアウト中（user なし）' },
  loggedIn: { label: 'ログイン中（user あり）' },
};

const widths: Record<Width, { label: string }> = {
  full: { label: '広い画面' },
  mobile: { label: 'スマホ幅（375px）' },
};

export function HeaderPlayground() {
  const [login, setLogin] = useState<Login>('loggedOut');
  const [name, setName] = useState('Jane Doe');
  const [width, setWidth] = useState<Width>('full');
  // Storybook の Actions パネルの代わり：どのイベントが呼ばれたかの記録
  const [events, setEvents] = useState<string[]>([]);

  const record = (event: string) =>
    setEvents((e) => [`${event}（${new Date().toLocaleTimeString('ja-JP')}）`, ...e].slice(0, 6));

  const user = login === 'loggedIn' ? { name } : undefined;

  const code =
    login === 'loggedIn'
      ? `<Header\n  user={{ name: "${name}" }}\n  onLogout={...}\n/>`
      : `<Header\n  onLogin={...}\n  onCreateAccount={...}\n/>`;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-sm font-semibold text-fg">見本（Storybook の Story と同じ）</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(
            [
              ['LoggedIn', 'loggedIn'],
              ['LoggedOut', 'loggedOut'],
            ] as const
          ).map(([label, value]) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                setLogin(value);
                setName('Jane Doe');
              }}
              className="rounded-control border-2 border-border px-3 py-1.5 text-sm text-fg hover:border-brand"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Choice legend="user（ログイン状態）" name="header-login" value={login} options={logins} onChange={setLogin} />
        <div>
          <label htmlFor="header-name" className="text-sm font-semibold text-fg">
            user.name（表示される名前）
          </label>
          <input
            id="header-name"
            value={name}
            disabled={login !== 'loggedIn'}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-control border border-border bg-surface px-3 py-2 text-fg disabled:opacity-50"
          />
        </div>
        <Choice legend="画面の幅" name="header-width" value={width} options={widths} onChange={setWidth} />
      </div>

      <div>
        <p className="text-sm font-semibold text-fg">表示（ヘッダーのボタンも押せます）</p>
        <div className="mt-2 overflow-x-auto rounded-control border border-dashed border-border">
          <div data-testid="header-preview" className={width === 'mobile' ? 'mx-auto w-[375px] border-x border-border' : ''}>
            <Header
              user={user}
              onLogin={() => {
                record('onLogin');
                setLogin('loggedIn');
              }}
              onLogout={() => {
                record('onLogout');
                setLogin('loggedOut');
              }}
              onCreateAccount={() => {
                record('onCreateAccount');
                setLogin('loggedIn');
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-fg">コード</p>
          <pre className="mt-2 whitespace-pre-wrap break-all rounded-control border border-border bg-background p-3 font-mono text-xs text-fg">
            {code}
          </pre>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-fg">イベントの記録（Storybook の Actions パネルに相当）</p>
            <button
              type="button"
              onClick={() => setEvents([])}
              className="text-xs text-fg-muted underline underline-offset-4 hover:text-fg"
            >
              消す
            </button>
          </div>
          <ul data-testid="header-events" className="mt-2 min-h-16 rounded-control border border-border bg-background p-3 font-mono text-xs text-fg">
            {events.length === 0 ? (
              <li className="text-fg-muted">ヘッダーの Log in / Sign up / Log out を押すと、ここに記録されます</li>
            ) : (
              events.map((e, i) => <li key={`${e}-${i}`}>{e}</li>)
            )}
          </ul>
        </div>
      </div>

      <p className="text-sm leading-6 text-fg-muted">
        Header は Button を組み合わせた部品です。Storybook ではボタンを押しても記録が残るだけですが、
        ここでは押すとログイン状態も切り替わるようにしています（Storybook の Example / Page に近い動き）。
        色は直書きなので、ブランド切り替えでは変わりません。
      </p>
    </div>
  );
}
