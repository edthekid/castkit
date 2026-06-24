'use client';

import Link from 'next/link';
import { useTranslation } from '../_i18n/useTranslation';
import { ARTICLES } from '../_lib/articles';

/**
 * ホームから各記事への内部リンクセクション。
 * よく見られるホームから記事へリンク評価を流しつつ、回遊（PV）を促す。
 */
export function HomeArticles() {
  const { locale } = useTranslation();

  const heading = locale === 'ja' ? '活用ガイド・記事' : 'Guides and Articles';
  const lead = locale === 'ja'
    ? '各ツールの使い方や、配信・ゲームイベントでの活用テクニックを記事で解説しています。'
    : 'Articles on how to use each tool and techniques for streaming and gaming events.';
  const viewAll = locale === 'ja' ? 'すべての記事を見る →' : 'View all articles →';

  return (
    <section className="mt-20">
      <div className="flex items-end justify-between gap-4 mb-2">
        <div>
          <p className="text-[10px] font-black tracking-widest uppercase mb-1 text-ck-muted">
            ARTICLES
          </p>
          <h2 className="text-xl sm:text-2xl font-black text-ck-ink">
            {heading}
          </h2>
        </div>
        <Link
          href="/articles"
          className="text-xs font-bold whitespace-nowrap transition-opacity hover:opacity-70 text-ck-subtle"
        >
          {viewAll}
        </Link>
      </div>
      <p className="text-sm leading-relaxed mb-6 text-ck-subtle">
        {lead}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ARTICLES.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="ck-card ck-card-interactive group flex flex-col p-4"
          >
            <span className="text-[10px] font-black tracking-widest uppercase mb-2 text-ck-muted">
              {a.tag[locale]}
            </span>
            <p className="text-sm font-bold leading-snug group-hover:underline text-ck-ink">
              {a.title[locale]}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
