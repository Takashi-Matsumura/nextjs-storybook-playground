import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { expect, fn } from 'storybook/test';

import { ContactForm } from './ContactForm';

const meta = {
  title: 'Components/ContactForm',
  component: ContactForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  // fn() で onSubmit をスパイにする（呼ばれた回数・引数を検証できる）
  args: { onSubmit: fn() },
  // Controls で defaultValues を書き換えたら、フォームを作り直して反映する
  // （defaultValues は「最初の値」なので、作り直さないと画面に反映されない）
  render: (args) => <ContactForm key={JSON.stringify(args.defaultValues ?? {})} {...args} />,
} satisfies Meta<typeof ContactForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const filled = {
  name: '山田 太郎',
  email: 'taro@example.com',
  message: 'Storybook について質問があります。',
};

// ---------- 見た目の状態（Controls で値を書き換えて試せる） ----------

// 何も操作しない初期表示
export const Default: Story = {};

// 入力済みの状態。Controls の defaultValues を書き換えると表示が変わる
export const Filled: Story = {
  args: { defaultValues: filled },
};

// 長い文章を入れても、レイアウトが崩れないか
export const LongText: Story = {
  args: {
    defaultValues: {
      name: 'とても長い名前の山田 太郎左衛門之助',
      email: 'very.long.email.address.for.layout.check@example.co.jp',
      message: 'Storybook について質問があります。'.repeat(8),
    },
  },
};

// 送信中：onSubmit が終わらないようにして「送信中…」の状態で止める
export const Submitting: Story = {
  args: { defaultValues: filled, onSubmit: fn(() => new Promise<void>(() => {})) },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: '送信する' }));
    const button = await canvas.findByRole('button', { name: '送信中…' });
    await expect(button).toBeDisabled();
  },
};

// 送信失敗：onSubmit が失敗（reject）したときのエラー表示。入力は残る
export const SubmitFailed: Story = {
  args: { defaultValues: filled, onSubmit: fn(() => Promise.reject(new Error('network'))) },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: '送信する' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('送信に失敗しました');
    await expect(canvas.getByLabelText('お名前')).toHaveValue(filled.name);
    // もう一度送信できる
    await expect(canvas.getByRole('button', { name: '送信する' })).toBeEnabled();
    await expect(args.onSubmit).toHaveBeenCalledTimes(1);
  },
};

// ---------- 操作の流れ（Interaction test） ----------

// ① 正しく入力して送信 → onSubmit が入力値で呼ばれ、完了メッセージが出る
export const SubmitSuccess: Story = {
  play: async ({ args, canvas, userEvent, step }) => {
    await step('3つの項目を入力する', async () => {
      // ラベル名で入力欄を探す（ユーザーが画面を見るのと同じ探し方）
      await userEvent.type(canvas.getByLabelText('お名前'), '山田 太郎');
      await userEvent.type(canvas.getByLabelText('メールアドレス'), 'taro@example.com');
      await userEvent.type(canvas.getByLabelText('お問い合わせ内容'), 'Storybook について');
    });

    await step('送信ボタンを押す', async () => {
      await userEvent.click(canvas.getByRole('button', { name: '送信する' }));
    });

    await expect(args.onSubmit).toHaveBeenCalledTimes(1);
    await expect(args.onSubmit).toHaveBeenCalledWith({
      name: '山田 太郎',
      email: 'taro@example.com',
      message: 'Storybook について',
    });
    // 送信後の非同期な画面更新は findBy〜 で「現れるまで待つ」
    await expect(await canvas.findByText('送信しました。ありがとうございます。')).toBeVisible();
    // 送信後は入力欄が空に戻る
    await expect(canvas.getByLabelText('お名前')).toHaveValue('');
  },
};

// ② 何も入力せずに送信 → エラーが出て、onSubmit は呼ばれない
export const EmptySubmit: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: '送信する' }));

    await expect(canvas.getByText('お名前を入力してください')).toBeVisible();
    await expect(canvas.getByText('メールアドレスを入力してください')).toBeVisible();
    await expect(canvas.getByText('お問い合わせ内容を入力してください')).toBeVisible();
    // 支援技術向けにも「エラーである」ことが伝わっているか
    await expect(canvas.getByLabelText('お名前')).toHaveAttribute('aria-invalid', 'true');
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

// ③ メールアドレスの形式が不正 → メール欄だけエラー
export const InvalidEmail: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText('お名前'), '山田 太郎');
    await userEvent.type(canvas.getByLabelText('メールアドレス'), 'taro@example');
    await userEvent.type(canvas.getByLabelText('お問い合わせ内容'), 'テスト');
    await userEvent.click(canvas.getByRole('button', { name: '送信する' }));

    await expect(canvas.getByText('メールアドレスの形式が正しくありません')).toBeVisible();
    await expect(canvas.queryByText('お名前を入力してください')).not.toBeInTheDocument();
    await expect(args.onSubmit).not.toHaveBeenCalled();

    // 直して再送信すると通る
    const email = canvas.getByLabelText('メールアドレス');
    await userEvent.clear(email);
    await userEvent.type(email, 'taro@example.com');
    await userEvent.click(canvas.getByRole('button', { name: '送信する' }));
    await expect(args.onSubmit).toHaveBeenCalledTimes(1);
  },
};
