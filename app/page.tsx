'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslation } from './_i18n/useTranslation';
import type { TranslationKey } from './_i18n/translations';
import { gray } from './_theme/colors';
import { IconBolt, IconTarget, IconLadder, IconChat, IconScales, IconTrophy } from './_components/icons';
import { HomeArticles } from './_components/HomeArticles';
import type { ComponentType, SVGProps } from 'react';

const TOOLS: {
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  accent: string;
  gradient: string;
  tag: string;
}[] = [
  {
    href: '/team-division',
    icon: IconBolt,
    titleKey: 'home.teamDivision.title',
    descKey: 'home.teamDivision.description',
    accent: gray[900],
    gradient: 'from-zinc-900/5 to-zinc-500/5',
    tag: 'Team Division',
  },
  {
    href: '/roulette',
    icon: IconTarget,
    titleKey: 'home.roulette.title',
    descKey: 'home.roulette.description',
    accent: gray[500],
    gradient: 'from-zinc-400/10 to-zinc-900/5',
    tag: 'Roulette',
  },
  {
    href: '/amida',
    icon: IconLadder,
    titleKey: 'home.amida.title',
    descKey: 'home.amida.description',
    accent: gray[800],
    gradient: 'from-zinc-700/8 to-zinc-300/8',
    tag: 'Amida',
  },
  {
    href: '/topic',
    icon: IconChat,
    titleKey: 'home.topic.title',
    descKey: 'home.topic.description',
    accent: gray[600],
    gradient: 'from-zinc-600/8 to-zinc-200/8',
    tag: 'Topic',
  },
  {
    href: '/debate',
    icon: IconScales,
    titleKey: 'home.debate.title',
    descKey: 'home.debate.description',
    accent: gray[600],
    gradient: 'from-zinc-500/8 to-zinc-300/8',
    tag: 'Debate',
  },
  {
    href: '/scoreboard',
    icon: IconTrophy,
    titleKey: 'home.scoreboard.title',
    descKey: 'home.scoreboard.description',
    accent: gray[700],
    gradient: 'from-zinc-700/8 to-zinc-300/8',
    tag: 'Scoreboard',
  },
];

export default function HomePage() {
  const titleRef = useRef<HTMLDivElement>(null);
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
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 animate-pulse" />
          {t('home.badge')}
        </div>

        {/* タイトル */}
        <h1 ref={titleRef}
          className="text-5xl sm:text-7xl font-black tracking-widest mb-4 text-ck-ink"
          style={{ fontFamily: 'Inter, sans-serif', lineHeight: 1.1 }}>
          CastKit
        </h1>

        {/* サブタイトル */}
        <p className="text-sm sm:text-base text-ck-muted font-medium max-w-md mx-auto leading-relaxed">
          {t('home.subtitleLine1')}<br />{t('home.subtitleLine2')}
        </p>

        {/* デコライン */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-400/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-ck-ink shadow-[0_0_8px_rgba(17,17,20, 0.5)]" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-400/40" />
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
        {TOOLS.map(({ href, icon: Icon, titleKey, descKey, accent, gradient, tag }, idx) => (
          <Link key={href} href={href}
            className="group relative block overflow-hidden"
            style={{
              animation: `ck-slide-up 0.6s cubic-bezier(0.16,1,0.3,1) ${idx * 0.1 + 0.3}s both`,
            }}>
            {/* カード本体 */}
            <div className="relative p-4 sm:p-6 h-full transition-all duration-300 group-hover:-translate-y-1"
              style={{
                background: 'var(--ck-bg-card)',
                border: `1px solid ${accent}30`,
                borderRadius: 0,
                boxShadow: '0 2px 12px rgba(var(--ck-ink-rgb), 0.05)',
              }}>

              {/* 背景グラデ */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              {/* タグ */}
              <div className="relative flex justify-between items-start mb-4">
                <span className="text-[10px] font-black tracking-widest opacity-30 uppercase">{tag}</span>
                <div className="w-2 h-2 rounded-full opacity-50" style={{ background: accent }} />
              </div>

              {/* アイコン */}
              <div className="relative mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ color: accent }}>
                <Icon size={32} strokeWidth={1.6} aria-hidden="true" />
              </div>

              {/* テキスト */}
              <div className="relative">
                <h2 className="text-sm sm:text-lg font-black text-ck-ink mb-1 sm:mb-2 group-hover:text-ck-ink transition-colors">
                  {t(titleKey)}
                </h2>
                <p className="text-[10px] sm:text-xs text-ck-muted leading-relaxed group-hover:text-ck-subtle transition-colors">
                  {t(descKey)}
                </p>
              </div>

              {/* ホバー矢印 */}
              <div className="relative mt-4 flex items-center gap-1 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all translate-x-0 group-hover:translate-x-1"
                style={{ color: accent }}>
                {t('home.cardOpen')} →
              </div>

              {/* 光沢ライン */}
              <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(90deg, transparent, ${accent}60, transparent)` }} />
            </div>
          </Link>
        ))}
      </div>

      {/* 記事への導線（ホーム → 記事の内部リンク） */}
      <HomeArticles />

    </div>
  );
}
