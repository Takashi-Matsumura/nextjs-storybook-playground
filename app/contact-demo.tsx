'use client';

import { ContactForm } from '@/components/ContactForm/ContactForm';

// ページ上のデモ用。実際には送信せず、少し待つだけ
export function ContactDemo() {
  return <ContactForm onSubmit={() => new Promise((resolve) => setTimeout(resolve, 600))} />;
}
