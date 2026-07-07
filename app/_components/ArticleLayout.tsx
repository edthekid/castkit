'use client';

import Link from 'next/link';
import { useTranslation } from '../_i18n/useTranslation';
import type { Article } from '../_lib/articles';

interface ArticleLayoutProps {
  article: Article;
  /** marked で描画済みの本文HTML（ja / en） */
  bodyHtml: { ja: string; en: string };
}

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatDate(date: string, locale: 'ja' | 'en') {
  const [y, m, d] = date.split('-').map(Number);
  return locale === 'ja' ? `${y}年${m}月${d}日` : `${MONTHS_EN[m - 1]} ${d}, ${y}`;
}

export function ArticleLayout({ article, bodyHtml }: ArticleLayoutProps) {
  const { locale } = useTranslation();

  const backLabel = locale === 'ja' ? '← 記事一覧' : '← All articles';
  const articleBadge = locale === 'ja' ? '記事' : 'ARTICLE';
  const ctaLead = locale === 'ja' ? '登録不要・ブラウザだけで使えます' : 'No sign-up — works in your browser';
  const toolCta = locale === 'ja' ? `${article.tag.ja}ツールを使ってみる` : `Try the ${article.tag.en} tool`;

  return (
    <div className="max-w-2xl mx-auto py-4">
      <div className="mb-6">
        <Link
          href="/articles"
          className="inline-flex items-center gap-1 text-xs font-bold transition-opacity hover:opacity-70 text-ck-muted"
        >
          {backLabel}
        </Link>
      </div>

      <article>
        <header className="mb-10">
          <div className="inline-flex items-center mb-4 px-3 py-1 border border-ck-line ck-eyebrow">
            {articleBadge}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black leading-snug mb-3 text-ck-ink">
            {article.title[locale]}
          </h1>
          <p className="text-sm leading-relaxed mb-4 text-ck-subtle">
            {article.description[locale]}
          </p>
          <div className="text-xs text-ck-muted">
            {formatDate(article.date, locale)}
          </div>
          <div className="mt-5 h-px bg-ck-line" />
        </header>

        <div className="article-body" dangerouslySetInnerHTML={{ __html: bodyHtml[locale] }} />

        <div className="mt-12 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-ck-line bg-ck-surface">
          <div>
            <p className="ck-eyebrow mb-1">
              FREE TOOL
            </p>
            <p className="text-sm font-black text-ck-ink">
              {ctaLead}
            </p>
          </div>
          <Link
            href={article.toolHref}
            className="inline-flex items-center gap-2 px-5 py-2.5 font-black text-sm transition-opacity hover:opacity-80 bg-ck-ink text-white"
          >
            {toolCta} →
          </Link>
        </div>
      </article>
    </div>
  );
}
