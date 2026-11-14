import { Badge } from "@/components/Badge/Badge";

function Box({
  title,
  sub,
  children,
  tone = "zinc",
}: {
  title: string;
  sub?: string;
  children?: React.ReactNode;
  tone?: "zinc" | "blue" | "pink" | "amber";
}) {
  const tones = {
    zinc: "border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900",
    blue: "border-sky-300 bg-sky-50 dark:border-sky-800 dark:bg-sky-950",
    pink: "border-pink-300 bg-pink-50 dark:border-pink-800 dark:bg-pink-950",
    amber: "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950",
  };
  return (
    <div className={`rounded-xl border-2 p-4 ${tones[tone]}`}>
      <p className="font-semibold text-zinc-900 dark:text-zinc-50">{title}</p>
      {sub && (
        <p className="mt-0.5 font-mono text-xs text-zinc-500 dark:text-zinc-400">
          {sub}
        </p>
      )}
      {children && (
        <div className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          {children}
        </div>
      )}
    </div>
  );
}

function Arrow({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center py-2 text-zinc-400">
      <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
      <span aria-hidden className="text-2xl leading-none">
        ↓
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-1 justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-4xl px-4 py-12 sm:px-8 sm:py-16">
        <header>
          <p className="text-sm font-medium text-pink-600 dark:text-pink-400">
            学習用アプリ
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Next.js と Storybook の関係
          </h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            「実体」は Next.js ではなく、共通の<strong>コンポーネント</strong>
            です。Next.js と Storybook は、同じコンポーネントをそれぞれの目的で使う
            「2つの利用者」です。
          </p>
        </header>

        {/* 図 */}
        <section className="mt-10" aria-label="関係図">
          <div className="mx-auto max-w-md">
            <Box
              title="① コンポーネント（実体）"
              sub="components/Badge/Badge.tsx"
              tone="amber"
            >
              ただの React コンポーネント。props（label / variant / size）で表示が決まる。
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge label="Neutral" />
                <Badge variant="success" label="Success" />
                <Badge variant="warning" label="Warning" />
                <Badge variant="danger" label="Danger" />
              </div>
            </Box>
          </div>

          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col">
              <Arrow label="import して画面を組み立てる" />
              <Box title="② Next.js アプリ" sub="app/page.tsx" tone="blue">
                本番の画面。データ取得・ルーティング・認証などと組み合わせて、
                コンポーネントを<strong>使う</strong>。
              </Box>
              <Arrow label="next dev / next build（Turbopack）" />
              <Box title="ユーザーが見る Web サイト" sub="http://localhost:3000">
                デプロイされるのはこちら。
              </Box>
            </div>

            <div className="flex flex-col">
              <Arrow label="import して Story を書く" />
              <Box
                title="③ Storybook"
                sub="components/Badge/Badge.stories.tsx"
                tone="pink"
              >
                開発用の道具。コンポーネントを単体で表示し、状態ごとに
                <strong>並べる・試す・テストする</strong>。
              </Box>
              <Arrow label="storybook dev（Vite）" />
              <Box title="開発者向けカタログ" sub="http://localhost:6006">
                Docs・Controls・Interactions。
                <br />
                <span className="font-mono text-xs">npm test</span>{" "}
                で Vitest からも実行できる。
              </Box>
            </div>
          </div>

          <p className="mt-6 rounded-lg bg-zinc-100 p-3 text-center text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
            Storybook は devDependencies なので、②の本番ビルドには含まれません。
          </p>
        </section>

        {/* 考え方の整理 */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            「Storybook は Next.js をまとめるもの？」
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="border-b border-zinc-300 text-zinc-500 dark:border-zinc-700">
                <tr>
                  <th className="py-2 pr-4 font-medium"></th>
                  <th className="py-2 pr-4 font-medium">Next.js</th>
                  <th className="py-2 font-medium">Storybook</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 text-zinc-700 dark:divide-zinc-800 dark:text-zinc-300">
                <tr>
                  <td className="py-2 pr-4 font-medium">役割</td>
                  <td className="py-2 pr-4">本番アプリを作るフレームワーク</td>
                  <td className="py-2">部品のカタログ・テストの道具</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">扱う単位</td>
                  <td className="py-2 pr-4">ページ・アプリ全体</td>
                  <td className="py-2">コンポーネント単体</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">見る人</td>
                  <td className="py-2 pr-4">エンドユーザー</td>
                  <td className="py-2">開発者・デザイナー</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">ビルド</td>
                  <td className="py-2 pr-4">Turbopack</td>
                  <td className="py-2">Vite（@storybook/nextjs-vite）</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Storybook は Next.js アプリを包むのではなく、その<strong>横に並んで</strong>
            同じ部品を読み込みます。<code className="font-mono">@storybook/nextjs-vite</code>{" "}
            が <code className="font-mono">next/image</code> や{" "}
            <code className="font-mono">next/navigation</code>{" "}
            を真似てくれるので、Next.js 向けに書いた部品もそのまま表示できます。
          </p>
        </section>

        {/* OSS */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Storybook は OSS？
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            はい。<strong>MIT ライセンス</strong>のオープンソースで、無料で使えます。
            ソースは{" "}
            <a
              href="https://github.com/storybookjs/storybook"
              className="font-medium text-pink-600 underline dark:text-pink-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/storybookjs/storybook
            </a>{" "}
            で公開されています。Storybook の公開・ビジュアルテストのクラウドサービス
            「Chromatic」は有料プランのある別サービスです。
          </p>
        </section>
      </main>
    </div>
  );
}
