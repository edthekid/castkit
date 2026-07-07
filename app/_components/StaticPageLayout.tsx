'use client';

import { useTranslation } from '../_i18n/useTranslation';

interface StaticPageLayoutProps {
  title: { ja: string; en: string };
  /** Markdown 描画済みの本文HTML（ja / en） */
  bodyHtml: { ja: string; en: string };
  /** 最終更新日などの補足（任意） */
  meta?: { ja: string; en: string };
}

/**
 * プライバシーポリシー等の固定テキストページ用レイアウト。
 * 本文は marked で描画済みのHTMLを受け取り、locale で切り替える。
 */
export function StaticPageLayout({ title, bodyHtml, meta }: StaticPageLayoutProps) {
  const { locale } = useTranslation();

  return (
    <div className="max-w-2xl mx-auto py-4">
      <h1 className="text-2xl sm:text-3xl font-black leading-snug mb-2 text-ck-ink">{title[locale]}</h1>
      {meta && <p className="text-xs text-ck-muted mb-6">{meta[locale]}</p>}
      <div className="article-body" dangerouslySetInnerHTML={{ __html: bodyHtml[locale] }} />
    </div>
  );
}
