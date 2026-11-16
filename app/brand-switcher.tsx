'use client';

import { useEffect, useState } from 'react';

import { BrandSwitcher as BrandSwitcherView, type Brand } from '@/components/BrandSwitcher/BrandSwitcher';

/** アプリ用：選んだブランドを <html data-brand="..."> に反映して、ページ全体のトークンを差し替える */
export function BrandSwitcher() {
  const [brand, setBrand] = useState<Brand>('sakura');

  // 外部の DOM（<html>）との同期なので effect で行う
  useEffect(() => {
    document.documentElement.dataset.brand = brand;
  }, [brand]);

  return <BrandSwitcherView value={brand} onChange={setBrand} />;
}
