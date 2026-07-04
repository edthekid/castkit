'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useSyncExternalStore } from 'react';
import { useTranslation } from '../_i18n/useTranslation';
import { IconBolt, IconTarget, IconLadder, IconChat, IconScales, IconTrophy, IconDice, IconTimer } from './icons';
import type { ComponentType, SVGProps } from 'react';

const ALL_TOOLS: {
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  tag: string;
  titleJa: string;
  titleEn: string;
  descJa: string;
  descEn: string;
}[] = [
  { href: '/team-division', icon: IconBolt,   tag: 'Team Division', titleJa: 'チーム分け',   titleEn: 'Team Division', descJa: 'メンバーを均等チームへ振り分け', descEn: 'Split members into balanced teams' },
  { href: '/roulette',      icon: IconTarget, tag: 'Roulette',      titleJa: 'ルーレット',   titleEn: 'Roulette',      descJa: 'ランダム抽選ツール（2モード）',  descEn: 'Random draw in Wheel or Slot mode' },
  { href: '/amida',         icon: IconLadder, tag: 'Amida',         titleJa: 'あみだくじ',   titleEn: 'Amida',         descJa: '結果をあみだくじで割り当て',    descEn: 'Assign results via ladder lottery' },
  { href: '/topic',         icon: IconChat,   tag: 'Topic',         titleJa: 'お題ガチャ',   titleEn: 'Topic Picker',  descJa: 'ランダムにお題を出すツール',   descEn: 'Pick a random conversation topic' },
  { href: '/debate',        icon: IconScales, tag: 'Debate',        titleJa: 'ディベート',   titleEn: 'Debate',        descJa: 'お題と陣営をランダム決定',     descEn: 'Randomly assign debate topics and sides' },
  { href: '/scoreboard',    icon: IconTrophy, tag: 'Scoreboard',    titleJa: 'スコアボード', titleEn: 'Scoreboard',    descJa: 'チームの得点をリアルタイム管理', descEn: 'Manage team scores in real time' },
  { href: '/dice',          icon: IconDice,   tag: 'Dice',          titleJa: 'サイコロ',     titleEn: 'Dice Roller',   descJa: 'サイコロを振って手軽に決める', descEn: 'Roll dice to decide anything' },
  { href: '/timer',         icon: IconTimer,  tag: 'Timer',         titleJa: 'タイマー',     titleEn: 'Timer',         descJa: 'カウントダウン・ストップウォッチ・ポモドーロ', descEn: 'Countdown, stopwatch, and Pomodoro' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// SSR は false、クライアントは true を返す。hydration mismatch を避けるための判定。
function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function RelatedTools() {
  const pathname = usePathname();
  const { locale } = useTranslation();
  const isClient = useIsClient();

  // SSR／初回レンダーは決定論的に先頭3つ、マウント後は毎表示ランダム3つ。
  const related = useMemo(() => {
    const candidates = ALL_TOOLS.filter((t) => t.href !== pathname);
    return (isClient ? shuffle(candidates) : candidates).slice(0, 3);
  }, [pathname, isClient]);

  const label = locale === 'ja' ? '他のツールも使ってみる' : 'Try other tools';
  const open  = locale === 'ja' ? '開く →' : 'Open →';

  return (
    <div className="mt-16 pt-10 border-t border-ck-line">
      <p className="text-xs font-black tracking-widest uppercase mb-5 text-ck-muted">
        {label}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {related.map(({ href, icon: Icon, tag, titleJa, titleEn, descJa, descEn }) => (
          <Link
            key={href}
            href={href}
            className="ck-card ck-card-interactive group flex items-start gap-3 p-4"
          >
            <span
              className="mt-0.5 shrink-0 transition-transform duration-200 group-hover:scale-110 text-ck-subtle"
              aria-hidden="true"
            >
              <Icon size={18} strokeWidth={1.6} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black tracking-widest opacity-40 uppercase mb-0.5">{tag}</p>
              <p className="text-sm font-black text-ck-ink mb-0.5">
                {locale === 'ja' ? titleJa : titleEn}
              </p>
              <p className="text-xs leading-relaxed text-ck-muted">
                {locale === 'ja' ? descJa : descEn}
              </p>
              <p className="mt-2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity text-ck-subtle">
                {open}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
