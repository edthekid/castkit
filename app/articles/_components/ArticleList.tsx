'use client';

import Link from 'next/link';
import { useTranslation } from '../../_i18n/useTranslation';
import { ARTICLES } from '../../_lib/articles';

export function ArticleList() {
  const { locale } = useTranslation();

  const heading = locale === 'ja' ? '記事一覧' : 'Articles';
  const lead = locale === 'ja'
    ? '配信・ゲームイベントをもっと楽しくするためのツール活用ガイドや、実践的なテクニックを紹介します。'
    : 'Guides and practical techniques to make your streaming and gaming events more fun.';
  const readMore = locale === 'ja' ? '続きを読む →' : 'Read more →';

  return (
    <div className="max-w-2xl mx-auto py-4">
      <header className="mb-10">
        <div className="inline-flex items-center mb-4 px-3 py-1 text-[10px] font-black tracking-widest uppercase border border-ck-line text-ck-muted">
          ARTICLES
        </div>
        <h1 className="text-2xl sm:text-3xl font-black mb-3 text-ck-ink">
          {heading}
        </h1>
        <p className="text-sm leading-relaxed text-ck-body">
          {lead}
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {ARTICLES.map((article) => (
          <Link
            key={article.href}
            href={article.href}
            className="ck-card ck-card-interactive group block p-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 border border-ck-line text-ck-subtle bg-ck-surface">
                {article.tag[locale]}
              </span>
              <span className="text-[10px] text-ck-muted">{article.date}</span>
            </div>
            <h2 className="text-sm font-black leading-snug mb-2 group-hover:underline text-ck-ink">
              {article.title[locale]}
            </h2>
            <p className="text-xs leading-relaxed text-ck-body">
              {article.excerpt[locale]}
            </p>
            <div className="mt-3 text-xs font-bold text-ck-muted">
              {readMore}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
