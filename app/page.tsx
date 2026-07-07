'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslation } from './_i18n/useTranslation';
import { HomeArticles } from './_components/HomeArticles';
import { ToolCard } from './_components/ToolCard';
import { TOOL_CARDS } from './_components/toolList';

export default function HomePage() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    let frame = 0;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';
    const original = 'CastKit';
    const glitch = () => {
      if (frame < 12) {
        el.textContent = original.split('').map((c, i) =>
          i < frame / 2 ? c : chars[Math.floor(Math.random() * chars.length)]
        ).join('');
        frame++;
        setTimeout(glitch, 50);
      } else {
        el.textContent = original;
      }
    };
    setTimeout(glitch, 400);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      {/* ヒーローセクション */}
      <div className="text-center mb-16 pt-8" style={{ animation: 'ck-slide-up 0.8s cubic-bezier(0.16,1,0.3,1) both' }}>
        {/* バッジ */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 text-xs font-bold"
          style={{
            background: `rgba(var(--ck-ink-rgb), 0.08)`,
            border: '1px solid rgba(var(--ck-ink-rgb), 0.25)',
            color: 'var(--ck-text-primary)',
          }}>
          <span className="w-1.5 h-1.5 rounded-full bg-ck-ink animate-pulse" />
          {t('home.badge')}
        </div>

        {/* タイトル（フォントは body 継承の Space Grotesk。個別フォント指定はしない） */}
        <h1 ref={titleRef}
          className="text-5xl sm:text-7xl font-black tracking-widest mb-4 text-ck-ink"
          style={{ lineHeight: 1.1 }}>
          CastKit
        </h1>

        {/* サブタイトル */}
        <p className="text-sm sm:text-base text-ck-muted font-medium max-w-md mx-auto leading-relaxed">
          {t('home.subtitleLine1')}<br />{t('home.subtitleLine2')}
        </p>

        {/* デコライン（モノクロ：インク基調のハーフトーン） */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, var(--ck-border-strong))' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-ck-ink" style={{ boxShadow: '0 0 8px rgba(var(--ck-ink-rgb), 0.5)' }} />
          <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, var(--ck-border-strong))' }} />
        </div>

        {/* ガイドリンク */}
        <div className="mt-5">
          <Link href="/guide" className="text-xs text-ck-muted hover:text-ck-subtle transition-colors font-bold tracking-widest">
            {t('home.guideLink')}
          </Link>
        </div>
      </div>

      {/* ツールカード */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
        {TOOL_CARDS.map((tool, idx) => (
          <div
            key={tool.href}
            style={{ animation: `ck-slide-up 0.6s cubic-bezier(0.16,1,0.3,1) ${idx * 0.08 + 0.3}s both` }}
          >
            <ToolCard {...tool} variant="featured" />
          </div>
        ))}
      </div>

      {/* 記事への導線（ホーム → 記事の内部リンク） */}
      <HomeArticles />

    </div>
  );
}
