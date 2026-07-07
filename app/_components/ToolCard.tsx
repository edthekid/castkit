'use client';

import Link from 'next/link';
import { useTranslation } from '../_i18n/useTranslation';
import type { ToolCardData } from './toolList';

interface ToolCardProps extends ToolCardData {
  /** featured=ホームの大カード / compact=RelatedTools の横並び小カード */
  variant?: 'featured' | 'compact';
}

/**
 * 全ツール導線カードの共通コンポーネント。
 * サイトのシグネチャー（角ばり＋ハードオフセット影＋対角hover = .ck-tool-card）を担う。
 * featured / compact でレイアウトのみ切り替え、見た目の核は共通に保つ。
 */
export function ToolCard({ href, icon: Icon, tag, titleKey, descKey, variant = 'compact' }: ToolCardProps) {
  const { t, locale } = useTranslation();
  const openLabel = locale === 'ja' ? '開く' : 'Open';

  if (variant === 'featured') {
    return (
      <Link href={href} className="ck-tool-card group block h-full p-5 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <span className="ck-eyebrow opacity-60">{tag}</span>
          <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-ck-ink" aria-hidden="true" />
        </div>
        <div
          className="mb-4 text-ck-ink transition-transform duration-200 group-hover:scale-110"
          style={{ transformOrigin: 'left center' }}
        >
          <Icon size={30} strokeWidth={1.6} aria-hidden="true" />
        </div>
        <h2 className="text-base sm:text-lg font-black text-ck-ink mb-1.5">{t(titleKey)}</h2>
        <p className="text-xs sm:text-sm leading-relaxed text-ck-subtle">{t(descKey)}</p>
        <div className="mt-4 flex items-center gap-1 text-xs font-bold text-ck-ink opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {openLabel} <span aria-hidden="true">→</span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="ck-tool-card group flex items-start gap-3 p-4">
      <span
        className="mt-0.5 shrink-0 text-ck-subtle transition-transform duration-200 group-hover:scale-110"
        aria-hidden="true"
      >
        <Icon size={18} strokeWidth={1.6} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="ck-eyebrow opacity-60 mb-1">{tag}</p>
        <p className="text-sm font-black text-ck-ink mb-0.5">{t(titleKey)}</p>
        <p className="text-xs leading-relaxed text-ck-muted line-clamp-2">{t(descKey)}</p>
      </div>
    </Link>
  );
}
