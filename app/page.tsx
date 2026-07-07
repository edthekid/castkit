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
    // reduced-motion: 文字スクランブル演出をせず、確定表示のみ
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = 'CastKit';
      return;
    }
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
        {/* ステータスチップ（角ばり・インク基調） */}
        <div className="inline-flex items-center gap-2 mb-7 px-3.5 py-1.5 text-[11px] font-bold tracking-wide"
          style={{
            background: `rgba(var(--ck-ink-rgb), 0.06)`,
            border: '1px solid rgba(var(--ck-ink-rgb), 0.22)',
            color: 'var(--ck-text-primary)',
          }}>
          <span className="w-1.5 h-1.5 rounded-full bg-ck-ink animate-pulse" />
          {t('home.badge')}
        </div>

        {/* ワードマーク（グリッチ演出＝サイト唯一のシグネチャーモーション。
            フォントは body 継承の Space Grotesk） */}
        <h1 ref={titleRef}
          className="text-5xl sm:text-7xl font-black tracking-widest mb-5 text-ck-ink"
          style={{ lineHeight: 1.05 }}>
          CastKit
        </h1>

        {/* サブタイトル（可読性のため muted→subtle に一段濃く） */}
        <p className="text-sm sm:text-base text-ck-subtle font-medium max-w-md mx-auto leading-relaxed">
          {t('home.subtitleLine1')}<br />{t('home.subtitleLine2')}
        </p>

        {/* デコ：角ばりの菱形アクセント（radius:0 の世界観に合わせ、丸ドットから変更） */}
        <div className="flex items-center justify-center gap-3 mt-9" aria-hidden="true">
          <div className="h-px w-14" style={{ background: 'linear-gradient(to right, transparent, var(--ck-border-strong))' }} />
          <div className="w-2 h-2 bg-ck-ink" style={{ transform: 'rotate(45deg)' }} />
          <div className="h-px w-14" style={{ background: 'linear-gradient(to left, transparent, var(--ck-border-strong))' }} />
        </div>

        {/* ガイドCTA（曖昧な小文字リンク → 角ばりゴーストの明確なCTAに） */}
        <div className="mt-8">
          <Link href="/guide"
            className="inline-flex items-center gap-2 border border-ck-line-bold px-4 py-2 text-xs font-black tracking-widest text-ck-subtle transition-colors hover:bg-ck-ink hover:text-white hover:border-ck-ink">
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
