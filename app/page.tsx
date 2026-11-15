import { Badge } from "@/components/Badge/Badge";
import { ContactDemo } from "./contact-demo";

/* ---------- 例題のコード（表示用の文字列） ---------- */

const codeComponent = `// components/Badge/Badge.tsx
export function Badge({ label, variant = "neutral" }) {
  return (
    <span className={colors[variant]}>
      {label}
    </span>
  );
}`;

const codeStory = `// components/Badge/Badge.stories.tsx
export default { component: Badge };

export const Success = {
  args: { variant: "success", label: "公開中" },
};

export const Danger = {
  args: { variant: "danger", label: "エラー" },
};`;

const codePage = `// app/page.tsx
import { Badge } from "@/components/Badge/Badge";

export default function Page() {
  return (
    <h1>
      記事タイトル <Badge variant="success" label="公開中" />
    </h1>
  );
}`;

const codePlay = `// ContactForm.stories.tsx（抜粋）
export const EmptySubmit = {
  play: async ({ canvas, userEvent, args }) => {
    // 何も入力せずに送信ボタンを押す
    await userEvent.click(canvas.getByRole("button", { name: "送信する" }));
    // エラーが表示され、送信処理は呼ばれないはず
    await expect(canvas.getByText("お名前を入力してください")).toBeVisible();
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};`;

const codeTokens = `/* app/globals.css — ブランドの決まりを1か所で定義 */
:root {
  --brand: #db2777;
  --success-bg: #dcfce7;
  --success-fg: #166534;
}
@media (prefers-color-scheme: dark) {
  :root {
    --success-bg: #14532d;   /* ダーク用の値 */
    --success-fg: #dcfce7;
  }
}
@theme inline {
  --color-brand: var(--brand);          /* → bg-brand */
  --color-success-bg: var(--success-bg); /* → bg-success-bg */
  --color-success-fg: var(--success-fg); /* → text-success-fg */
}`;

const codeBefore = `// ❌ 色を直書き（画面ごとにバラバラになりやすい）
success: "bg-green-100 text-green-800
          dark:bg-green-900 dark:text-green-100"`;

const codeAfter = `// ✅ トークンの名前で指定（ダークも自動で切り替わる）
success: "bg-success-bg text-success-fg"`;

const tokenSwatches = [
  ["bg-brand", "var(--brand)", "ブランド"],
  ["bg-surface", "var(--surface)", "面"],
  ["text-fg", "var(--fg)", "文字"],
  ["border-border", "var(--border)", "枠線"],
  ["bg-success-bg", "var(--success-bg)", "成功"],
  ["bg-warning-bg", "var(--warning-bg)", "注意"],
  ["bg-danger-bg", "var(--danger-bg)", "エラー"],
  ["text-danger", "var(--danger)", "エラー文"],
] as const;

/* ---------- 小さな部品 ---------- */

function Section({
  id,
  num,
  title,
  lead,
  children,
}: {
  id: string;
  num: string;
  title: string;
  lead?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-16 scroll-mt-8">
      <p className="font-mono text-sm font-semibold text-pink-700 dark:text-pink-400">{num}</p>
      <h2 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        {title}
      </h2>
      {lead && <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">{lead}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

const tones = {
  amber: "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/60",
  sky: "border-sky-300 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/60",
  pink: "border-pink-300 bg-pink-50 dark:border-pink-800 dark:bg-pink-950/60",
  zinc: "border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900",
};

function Card({
  tone = "zinc",
  title,
  sub,
  children,
}: {
  tone?: keyof typeof tones;
  title: string;
  sub?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border-2 p-4 ${tones[tone]}`}>
      <p className="font-semibold text-zinc-900 dark:text-zinc-50">{title}</p>
      {sub && <p className="mt-0.5 font-mono text-xs text-zinc-600 dark:text-zinc-400">{sub}</p>}
      {children && (
        <div className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">{children}</div>
      )}
    </div>
  );
}

function Down({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center py-2 text-zinc-500 dark:text-zinc-400">
      {label && <span className="text-xs">{label}</span>}
      <span aria-hidden className="text-xl leading-none">
        ↓
      </span>
    </div>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-4 text-[13px] leading-6 text-zinc-100 dark:bg-zinc-950 dark:ring-1 dark:ring-zinc-800">
      <code>{children}</code>
    </pre>
  );
}

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-zinc-200/70 px-1.5 py-0.5 font-mono text-[0.85em] text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
      {children}
    </code>
  );
}

/* ---------- ページ ---------- */

const toc = [
  ["analogy", "たとえ話で理解する"],
  ["diagram", "関係図"],
  ["flow", "開発の流れ"],
  ["example", "例題：Badge"],
  ["test", "例題：フォームのテスト"],
  ["design-system", "デザインシステム"],
  ["compare", "役割の比較"],
  ["faq", "よくある誤解"],
  ["try", "このアプリで試す"],
] as const;

export default function Home() {
  return (
    <div className="flex flex-1 justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-4xl px-4 py-12 sm:px-8 sm:py-16">
        {/* ヒーロー */}
        <header>
          <p className="text-sm font-medium text-pink-700 dark:text-pink-400">
            はじめての人のための学習ページ
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            Next.js と Storybook の関係
          </h1>
          <p className="mt-4 text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            <strong>Next.js</strong> はユーザーに届ける「Web アプリ本体」を作る道具。
            <br className="hidden sm:block" />
            <strong>Storybook</strong> はその横に置く、画面の部品（コンポーネント）の
            <strong>「カタログ兼作業台兼テスト場」</strong>です。
          </p>
          <nav aria-label="目次" className="mt-8 flex flex-wrap gap-2">
            {toc.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-sm text-zinc-700 hover:border-pink-400 hover:text-pink-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:text-pink-400"
              >
                {label}
              </a>
            ))}
          </nav>
        </header>

        {/* 1. たとえ話 */}
        <Section
          id="analogy"
          num="01"
          title="たとえ話で理解する"
          lead="家具メーカーにたとえると、3つの役割がはっきりします。"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <Card tone="amber" title="🪑 家具の部品" sub="= コンポーネント">
              脚・天板・引き出し。いろいろな家具で使い回す。
              <br />
              Web では <Mono>Button</Mono> や <Mono>Badge</Mono>、<Mono>Form</Mono>。
            </Card>
            <Card tone="sky" title="🏠 お客様の部屋" sub="= Next.js アプリ">
              部品を組み合わせた完成品が置かれ、実際に使われる場所。
              <br />
              Web では本番のページ。
            </Card>
            <Card tone="pink" title="🏭 ショールーム兼検査場" sub="= Storybook">
              部品を1つずつ並べて見せ、色違い・サイズ違いを比べ、壊れていないか検査する。
            </Card>
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            ポイントは、<strong>実体は「部品」</strong>だということ。Next.js と Storybook
            は、同じ部品をそれぞれの目的で使う「2つの利用者」です。
          </p>
        </Section>

        {/* 2. 関係図 */}
        <Section
          id="diagram"
          num="02"
          title="関係図"
          lead="Storybook は Next.js を包むのではなく、横に並んで同じ部品を読み込みます。"
        >
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mx-auto max-w-md">
              <Card tone="amber" title="コンポーネント（実体）" sub="components/*.tsx">
                props を受け取って見た目を返す、ただの React の関数。
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge label="Neutral" />
                  <Badge variant="success" label="Success" />
                  <Badge variant="warning" label="Warning" />
                  <Badge variant="danger" label="Danger" />
                </div>
              </Card>
            </div>

            <div className="mt-1 grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col">
                <Down label="import して画面に組み込む" />
                <Card tone="sky" title="Next.js アプリ" sub="app/**/page.tsx">
                  データ取得・ルーティング・認証などと組み合わせてページを作る。
                </Card>
                <Down label="next build" />
                <Card title="🌐 本番の Web サイト" sub="ユーザーが使う">
                  デプロイされるのはこちらだけ。
                </Card>
              </div>
              <div className="flex flex-col">
                <Down label="import して Story を書く" />
                <Card tone="pink" title="Storybook" sub="components/*.stories.tsx">
                  部品を単体で表示。状態ごとに並べ、操作し、テストする。
                </Card>
                <Down label="storybook dev / build" />
                <Card title="📚 部品カタログ" sub="開発者・デザイナーが使う">
                  本番には含まれない（devDependencies）。
                </Card>
              </div>
            </div>
          </div>
        </Section>

        {/* 3. 開発の流れ */}
        <Section
          id="flow"
          num="03"
          title="開発の流れ"
          lead="Storybook を使うと、部品を先に作り込んでから画面に組み込む流れになります。"
        >
          <ol className="grid gap-3 sm:grid-cols-5">
            {[
              ["部品を作る", "Badge.tsx を書く", "amber"],
              ["Story を書く", "状態ごとの表示を並べる", "pink"],
              ["テストする", "操作・a11y を自動検証", "pink"],
              ["画面で使う", "page.tsx で import", "sky"],
              ["公開する", "Next.js だけをデプロイ", "sky"],
            ].map(([title, desc, tone], i) => (
              <li
                key={title}
                className={`relative rounded-xl border-2 p-3 ${tones[tone as keyof typeof tones]}`}
              >
                <span className="font-mono text-xs font-bold text-zinc-600 dark:text-zinc-400">
                  STEP {i + 1}
                </span>
                <p className="mt-1 font-semibold text-zinc-900 dark:text-zinc-50">{title}</p>
                <p className="mt-1 text-xs leading-5 text-zinc-700 dark:text-zinc-300">{desc}</p>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-zinc-600 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-sm border-2 border-pink-300 bg-pink-50 dark:border-pink-800 dark:bg-pink-950" /> Storybook で行う
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-sm border-2 border-sky-300 bg-sky-50 dark:border-sky-800 dark:bg-sky-950" /> Next.js で行う
            </span>
          </div>
        </Section>

        {/* 4. 例題 Badge */}
        <Section
          id="example"
          num="04"
          title="例題：Badge を3つのファイルで見る"
          lead="同じ Badge が「部品」「Story」「ページ」の3か所に登場します。"
        >
          <div className="grid gap-6">
            <div>
              <p className="mb-2 text-sm font-semibold text-amber-800 dark:text-amber-400">
                ① 部品を定義する
              </p>
              <Code>{codeComponent}</Code>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-pink-700 dark:text-pink-400">
                ② Storybook で状態を並べる
              </p>
              <Code>{codeStory}</Code>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-sky-800 dark:text-sky-400">
                ③ Next.js のページで使う
              </p>
              <Code>{codePage}</Code>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">③ の表示結果（実物）</p>
            <p className="mt-3 text-xl font-bold text-zinc-900 dark:text-zinc-50">
              記事タイトル <Badge variant="success" label="公開中" className="ml-1 align-middle" />
            </p>
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Story の <Mono>export const Success</Mono> 1つが、Storybook のサイドバーの1項目になります。
            Story の <Mono>args</Mono> は、ページで渡す props と同じものです。
          </p>
        </Section>

        {/* 5. 例題 フォームのテスト */}
        <Section
          id="test"
          num="05"
          title="例題：フォームを自動でテストする"
          lead={
            <>
              Story に <Mono>play</Mono> 関数を書くと、「入力 → クリック → 結果の確認」をコンピュータが代わりに行います。
              <Mono>npm test</Mono> で全 Story をまとめて実行できます。
            </>
          }
        >
          <div className="grid gap-6">
            <Code>{codePlay}</Code>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                実物のフォーム（空のまま送信してみてください）
              </p>
              <ContactDemo />
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            このフォームは、Storybook で「正しい入力」「空送信」「メール形式エラー」の3パターンを自動テスト済みの部品です。
            a11y アドオンで、色のコントラストやラベルの付け忘れも同時に検査しています。
          </p>
        </Section>

        {/* 6. デザインシステム */}
        <Section
          id="design-system"
          num="06"
          title="デザインシステムとして使う"
          lead={
            <>
              アプリの「ブランド」を見た目の面で統一するのにも Storybook を使います。
              色・文字・角丸などの<strong>決まり（デザイントークン）</strong>と、それを使った
              <strong>部品</strong>をセットで管理する仕組みを「デザインシステム」と呼びます。
            </>
          }
        >
          {/* 3層の図 */}
          <div className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-4 sm:grid-cols-[1fr_auto] sm:p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex flex-col">
              <Card tone="amber" title="① デザイントークン" sub="app/globals.css">
                「ブランドの決まり」を名前付きの変数にしたもの。
                <Mono>--brand</Mono>、<Mono>--success-bg</Mono> など。値を変えるのはここだけ。
              </Card>
              <Down label="名前で使う（bg-brand, text-fg …）" />
              <Card tone="amber" title="② コンポーネント" sub="components/*.tsx">
                Button・Badge・Form などを、トークンだけで作る。色を直接書かない。
              </Card>
              <Down label="組み合わせる" />
              <Card tone="sky" title="③ 画面・アプリ" sub="app/**/page.tsx">
                部品を並べて画面を作る。ブランドは部品経由で自然にそろう。
              </Card>
            </div>
            <div className="flex flex-row items-stretch gap-3 sm:flex-col sm:justify-start">
              <div className="flex-1 rounded-xl border-2 border-dashed border-pink-300 bg-pink-50 p-4 text-sm leading-6 text-zinc-700 sm:w-56 sm:flex-none dark:border-pink-800 dark:bg-pink-950/60 dark:text-zinc-300">
                <p className="font-semibold text-zinc-900 dark:text-zinc-50">Storybook の担当</p>
                <ul className="mt-2 list-disc space-y-1 pl-4">
                  <li>①を「Brand / Colors」「Typography」ページで見本帳にする</li>
                  <li>②を Story でカタログにする</li>
                  <li>①②の崩れをテストで見つける（ライト／ダーク両方）</li>
                  <li>デザイナーやチームと共有する</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 実物のトークン */}
          <h3 className="mt-10 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            このアプリのトークン（実物）
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            下の色見本は CSS 変数をそのまま表示しています。OS をダークモードにすると、同じ名前のままダーク用の色に切り替わります。
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {tokenSwatches.map(([name, value, label]) => (
              <li
                key={name}
                className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="h-12 border-b border-zinc-200 dark:border-zinc-800" style={{ background: value }} />
                <div className="p-2">
                  <p className="font-mono text-xs text-zinc-800 dark:text-zinc-200">{name}</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">{label}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* コード */}
          <h3 className="mt-10 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            トークンの定義と使い方
          </h3>
          <div className="mt-4 grid gap-4">
            <Code>{codeTokens}</Code>
            <div className="grid gap-4 md:grid-cols-2">
              <Code>{codeBefore}</Code>
              <Code>{codeAfter}</Code>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            たとえばブランドカラーを変えたくなったら、<Mono>--brand</Mono> の1行を直すだけで、
            ボタンなど <Mono>bg-brand</Mono> を使うすべての部品が変わります。
            このページのフォームの「送信する」ボタンも <Mono>bg-brand</Mono> です。
          </p>

          {/* 注意 */}
          <div className="mt-6 rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4 text-sm leading-6 text-zinc-700 dark:bg-amber-950/40 dark:text-zinc-300">
            <p className="font-semibold text-zinc-900 dark:text-zinc-50">注意：Storybook はブランドを「強制」はしない</p>
            <p className="mt-1">
              画面で <Mono>bg-green-100</Mono> と直接書けば、それは防げません。統一は
              「トークン」「部品を使う習慣」「Storybook での見える化とテスト」「レビュー」の組み合わせで成り立ちます。
            </p>
          </div>
        </Section>

        {/* 7. 比較 */}
        <Section id="compare" num="07" title="役割の比較">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="border-b-2 border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
                <tr>
                  <th scope="col" className="py-2 pr-4 font-medium"></th>
                  <th scope="col" className="py-2 pr-4 font-semibold text-sky-800 dark:text-sky-400">Next.js</th>
                  <th scope="col" className="py-2 font-semibold text-pink-700 dark:text-pink-400">Storybook</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 text-zinc-700 dark:divide-zinc-800 dark:text-zinc-300">
                {[
                  ["ひとことで", "Web アプリを作るフレームワーク", "部品のカタログ・作業台・テスト場"],
                  ["扱う単位", "ページ・アプリ全体", "コンポーネント1つずつ"],
                  ["見る人", "エンドユーザー", "開発者・デザイナー・レビュアー"],
                  ["データ", "本物（DB・API）", "Story に書いた固定値（args）"],
                  ["本番に含まれる？", "はい", "いいえ（開発時だけ）"],
                  ["主なコマンド", "next dev / next build", "storybook dev / vitest"],
                ].map(([k, a, b]) => (
                  <tr key={k}>
                    <th scope="row" className="py-2.5 pr-4 font-medium text-zinc-900 dark:text-zinc-100">{k}</th>
                    <td className="py-2.5 pr-4">{a}</td>
                    <td className="py-2.5">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* 7. FAQ */}
        <Section id="faq" num="08" title="よくある誤解">
          <div className="space-y-3">
            {[
              [
                "Storybook を入れると、コンポーネントが自動でカタログになる？",
                "なりません。*.stories.tsx を書いたコンポーネントの、書いた状態だけが載ります。どの状態を見せるかは開発者が決めます。",
              ],
              [
                "Storybook は Next.js 専用？",
                "いいえ。React・Vue・Angular・Svelte などで使えます。Next.js 用には next/image などを真似てくれる専用パッケージ（@storybook/nextjs-vite）があります。",
              ],
              [
                "Storybook はユーザーにも見える？",
                "見えません。本番にデプロイされるのは Next.js のビルドだけです。チーム向けに Storybook を別サイトとして公開することはできます。",
              ],
              [
                "Next.js のどんなコンポーネントでも Story にできる？",
                "props だけで表示が決まる部品が得意です。サーバーでデータを取得する async な Server Component は苦手なので、「データ取得は親、表示は子」と分けると Story にしやすくなります。",
              ],
              [
                "Storybook は有料？",
                "無料のオープンソース（MIT ライセンス）です。Storybook の公開やビジュアルテストを行うクラウドサービス（Chromatic など）には有料プランがあります。",
              ],
            ].map(([q, a]) => (
              <details
                key={q}
                className="group rounded-xl border border-zinc-200 bg-white p-4 open:border-pink-300 dark:border-zinc-800 dark:bg-zinc-900 dark:open:border-pink-800"
              >
                <summary className="cursor-pointer list-none font-medium text-zinc-900 marker:hidden dark:text-zinc-50">
                  <span className="mr-2 font-mono text-pink-700 dark:text-pink-400">Q.</span>
                  {q}
                </summary>
                <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                  <span className="mr-2 font-mono font-semibold text-sky-800 dark:text-sky-400">A.</span>
                  {a}
                </p>
              </details>
            ))}
          </div>
        </Section>

        {/* 8. 試す */}
        <Section id="try" num="09" title="このアプリで試す" lead="ターミナルで次のコマンドを実行します。">
          <div className="grid gap-3 sm:grid-cols-3">
            <Card tone="sky" title="Next.js を起動" sub="npm run dev">
              このページ（http://localhost:3000）が開きます。
            </Card>
            <Card tone="pink" title="Storybook を起動" sub="npm run storybook">
              部品カタログ（http://localhost:6006）が開きます。
            </Card>
            <Card tone="pink" title="テストを実行" sub="npm test">
              すべての Story を、ブラウザで自動テストします。
            </Card>
          </div>
        </Section>

        <footer className="mt-20 border-t border-zinc-200 pt-6 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          storybook-demo — Storybook 学習用アプリ
        </footer>
      </main>
    </div>
  );
}
