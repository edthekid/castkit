'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '../_i18n/useTranslation';
import { getArticlesByToolHref } from '../_lib/articles';
import { IconBook } from './icons';

/**
 * 各ツールページから、対応する活用ガイド記事へ誘導する内部リンク。
 * 1ツールに複数記事がある場合はすべて表示する（クラスター構造の相互リンク）。
 * - SEO: よく見られるツールページから記事へリンク評価を流す
 * - 回遊: ツール利用後の「次に読む」導線でPVを伸ばす
 *
 * 現在のパスに対応する記事が無ければ何も描画しない。
 */
export function ToolArticleLink() {
  const pathname = usePathname();
  const { locale } = useTranslation();
  const articles = getArticlesByToolHref(pathname);
  if (articles.length === 0) return null;

  const lead = locale === 'ja' ? '活用ガイドを読む' : 'Read the guide';

  return (
    <div className="flex flex-col gap-3 mt-12">
      {articles.map((article) => (
        <Link
          key={article.slug}
          href={article.href}
          className="ck-card ck-card-interactive group flex items-center gap-3 p-4"
        >
          <span className="shrink-0 text-ck-subtle" aria-hidden="true">
            <IconBook size={20} strokeWidth={1.6} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="ck-eyebrow mb-0.5">
              {lead}
            </p>
            <p className="text-sm font-bold leading-snug text-ck-ink">
              {article.title[locale]}
            </p>
          </div>
          <span
            className="shrink-0 text-sm font-bold transition-transform group-hover:translate-x-0.5 text-ck-subtle"
            aria-hidden="true"
          >
            →
          </span>
        </Link>
      ))}
    </div>
  );
}
