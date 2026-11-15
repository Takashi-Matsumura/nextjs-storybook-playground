import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/Badge/Badge";
import { BrandSwitcher } from "../brand-switcher";
import { BadgePlayground } from "./badge-playground";
import { ButtonPlayground } from "./button-playground";
import { HeaderPlayground } from "./header-playground";
import { PagePlayground } from "./page-playground";
import { ContactPlayground } from "./contact-playground";

export const metadata: Metadata = {
  title: "部品を Next.js で使う | Storybook 学習アプリ",
  description: "Storybook で作った部品（BrandSwitcher・Badge・Button・Header・Page・ContactForm）を Next.js のページで使う例",
};

// このページは色・角丸をすべてデザイントークン（bg-surface, text-fg, border-border など）で指定している。
// そのため BrandSwitcher でブランドを変えると、ページ全体がそのブランドの見た目に変わる。

const codeView = `// components/BrandSwitcher/BrandSwitcher.tsx（Storybook で作った部品）
// 表示だけを担当：選択中の値を受け取り、押されたら onChange で知らせる
export const BrandSwitcher = ({ value, onChange }) => ( ... );`;

const codeApp = `// app/brand-switcher.tsx（Next.js 側のつなぎ役）
"use client";
import { useEffect, useState } from "react";
import { BrandSwitcher as BrandSwitcherView, type Brand }
  from "@/components/BrandSwitcher/BrandSwitcher";

export function BrandSwitcher() {
  const [brand, setBrand] = useState<Brand>("sakura");

  // 選んだブランドを <html data-brand="..."> に反映する
  useEffect(() => {
    document.documentElement.dataset.brand = brand;
  }, [brand]);

  return <BrandSwitcherView value={brand} onChange={setBrand} />;
}`;

const codePage = `// app/playground/page.tsx（このページ）
import { BrandSwitcher } from "../brand-switcher";

export default function Page() {
  return <BrandSwitcher />;
}`;

function Code({ children }: { children: string }) {
  return (
    <pre className="mt-3 overflow-x-auto rounded-control border border-border bg-surface p-4 font-mono text-xs leading-6 text-fg">
      {children}
    </pre>
  );
}

function Block({ title, lead, children }: { title: string; lead?: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 rounded-control border border-border bg-surface p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-fg">{title}</h2>
      {lead && <p className="mt-1 text-sm leading-6 text-fg-muted">{lead}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function PlaygroundPage() {
  return (
    <div className="flex flex-1 justify-center bg-background font-sans text-fg">
      <main className="w-full max-w-4xl px-4 py-10 sm:px-8 sm:py-14">
        <Link href="/" className="text-sm text-fg-muted underline underline-offset-4 hover:text-fg">
          ← 学習ページに戻る
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">部品を Next.js で使う</h1>
        <p className="mt-3 leading-7 text-fg-muted">
          Storybook で作って検査した部品を、Next.js のページにそのまま置いています。
          このページは色と角丸をすべて<strong className="text-fg">デザイントークン</strong>で指定しているので、
          下のボタンでブランドを変えると<strong className="text-fg">ページ全体</strong>が切り替わります。
        </p>

        {/* 画面上部に固定して、スクロールしてもすぐ切り替えられるようにする */}
        <div className="sticky top-0 z-10 -mx-4 mt-6 border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold">ブランド</span>
            <BrandSwitcher />
          </div>
        </div>

        <Block title="ブランドで変わるもの" lead="ボタンの色・角丸、Badge の形、フォームの送信ボタンなどが、ブランドに合わせて変わります。">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-control bg-brand px-4 py-2 text-sm font-semibold text-on-brand">
              ブランドのボタン
            </span>
            <span className="rounded-control border-2 border-brand px-4 py-2 text-sm font-semibold text-fg">
              枠線のボタン
            </span>
          </div>
        </Block>

        <Block
          title="Badge"
          lead="label・variant・size を変えると、その場で表示とコードが変わります。Storybook の Controls と同じ操作です。"
        >
          <BadgePlayground />
          <p className="mt-6 text-sm font-semibold text-fg">全部の組み合わせ</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge label="Neutral" />
            <Badge variant="success" label="公開中" />
            <Badge variant="warning" label="下書き" />
            <Badge variant="danger" label="エラー" />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge size="small" label="Neutral" />
            <Badge size="small" variant="success" label="公開中" />
            <Badge size="small" variant="warning" label="下書き" />
            <Badge size="small" variant="danger" label="エラー" />
          </div>
        </Block>

        <Block
          title="Button（Storybook のサンプル）"
          lead="primary・size・backgroundColor・label を変えると、その場で表示とコードが変わります。押すとクリックの記録が残ります。"
        >
          <ButtonPlayground />
        </Block>

        <Block
          title="Header（Storybook のサンプル）"
          lead="ログイン状態・名前・画面の幅を変えて表示を確かめられます。ヘッダーのボタンを押すとイベントが記録されます。"
        >
          <HeaderPlayground />
        </Block>

        <Block
          title="Page（Storybook のサンプル）"
          lead="props を持たない画面全体の部品です。見本ボタンで LoggedOut / LoggedIn の状態を作り、画面の幅を変えて確かめられます。"
        >
          <PagePlayground />
        </Block>

        <Block
          title="ContactForm"
          lead="結果と初期値を選んでから送信すると、入力エラー・送信中・成功・失敗の各状態を確かめられます（実際には送信しません）。"
        >
          <ContactPlayground />
        </Block>

        <Block
          title="BrandSwitcher の使い方"
          lead="部品（表示だけ）と、Next.js 側のつなぎ役（状態と <html> の書き換え）に分けています。"
        >
          <ol className="list-decimal space-y-1 pl-5 text-sm leading-6 text-fg-muted">
            <li>部品は「選択中の値」と「押されたときの関数」を受け取るだけ。だから Storybook で単体で表示・テストできる。</li>
            <li>Next.js 側では、状態（useState）を持ち、選んだブランドを <code className="font-mono text-fg">{"<html data-brand>"}</code> に書き込む。</li>
            <li>ページでは、つなぎ役を1行置くだけで使える。</li>
          </ol>
          <Code>{codeView}</Code>
          <Code>{codeApp}</Code>
          <Code>{codePage}</Code>
        </Block>

        <p className="mt-10 text-sm leading-6 text-fg-muted">
          同じ部品は Storybook（http://localhost:6006）の「Components」でも確認できます。
          Storybook ではツールバーの <strong className="text-fg">Brand</strong> メニューが、このページの切り替えボタンと同じ役割です。
        </p>
      </main>
    </div>
  );
}
