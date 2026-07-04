'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import type { TopicPhase } from '../_constants';
import { DRAW_DURATION_MS } from '../_constants';
import type { TopicHistoryItem } from '../_hooks/useTopicPicker';
import { useTranslation } from '../../_i18n/useTranslation';
import { ck } from '../../_theme/colors';
import { TOPIC_CATEGORIES } from '../_data/topics';
import type { TranslationKey } from '../../_i18n/translations';
import { ICON_MAP } from '../../_components/icons';

interface TopicCardProps {
  phase: TopicPhase;
  current: TopicHistoryItem | null;
  drawKey: number;
  disabled: boolean;
  shufflePool: string[];
  onDraw: () => void;
  isCustomOnly?: boolean;
  customTopicCount?: number;
}

const SPARK_COUNT = 16;

export function TopicCard({ phase, current, drawKey, disabled, shufflePool, onDraw, isCustomOnly, customTopicCount }: TopicCardProps) {
  const { t } = useTranslation();
  const [shuffleText, setShuffleText] = useState('');

  const rootRef  = useRef<HTMLDivElement>(null);
  const cardRef  = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const textRef  = useRef<HTMLParagraphElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const isCustom = current?.categoryId === 'custom';

  // ── 抽選中：減速するシャッフル演出（スロットが止まっていく感じ）──
  useEffect(() => {
    if (phase !== 'drawing' || shufflePool.length === 0) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pool = shufflePool;
    const pick = () => setShuffleText(pool[Math.floor(Math.random() * pool.length)]);
    pick();

    if (reduce) {
      const id = setInterval(pick, 120);
      return () => clearInterval(id);
    }

    const ctx = gsap.context(() => {
      // テキストの切り替えを「最初は速く・終盤は遅く」進める
      const proxy = { p: 0 };
      let lastStep = -1;
      const STEPS = 26;
      gsap.to(proxy, {
        p: 1,
        duration: DRAW_DURATION_MS / 1000,
        ease: 'power2.out',
        onUpdate: () => {
          const step = Math.floor(proxy.p * STEPS);
          if (step !== lastStep) {
            lastStep = step;
            pick();
          }
        },
      });

      // カードの「溜め」：わずかな上下バウンドとグロー脈動
      gsap.to(cardRef.current, {
        keyframes: [
          { boxShadow: `0 0 0 1.5px ${ck.text.primary}22, 0 8px 24px ${ck.shadow.glow}` },
          { boxShadow: `0 0 0 2px ${ck.text.primary}55, 0 14px 40px ${ck.shadow.mid}` },
        ],
        duration: 0.45,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.fromTo(
        textRef.current,
        { scale: 0.98 },
        { scale: 1.04, duration: 0.22, repeat: -1, yoyo: true, ease: 'sine.inOut' },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [phase, drawKey, shufflePool]);

  // ── 結果リビール：インパクト → ラベル → 文字スタッガー → 飛散 ──
  useEffect(() => {
    if (phase !== 'result' || !current) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const chars = textRef.current?.querySelectorAll<HTMLElement>('.topic-char');

    if (reduce) {
      gsap.set([labelRef.current, ...(chars ? Array.from(chars) : [])], { clearProps: 'all' });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // カードのインパクト＋フラッシュ
      tl.fromTo(
        cardRef.current,
        { scale: 1.14 },
        { scale: 1, duration: 0.55, ease: 'back.out(1.7)', clearProps: 'boxShadow' },
        0,
      );
      tl.fromTo(flashRef.current, { opacity: 0.7 }, { opacity: 0, duration: 0.5 }, 0);

      // カテゴリラベルが上から落ちる
      tl.fromTo(labelRef.current, { y: -16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, 0.08);

      // お題テキストを1文字ずつめくり上げる
      if (chars && chars.length) {
        tl.fromTo(
          chars,
          { opacity: 0, y: 26, rotateX: -80, scale: 0.4 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.035,
            ease: 'back.out(2.2)',
          },
          0.18,
        );
      }

      // 飛散スパーク（方向はここ＝effect内で生成／renderを純粋に保つ）
      const sparkEls = rootRef.current?.querySelectorAll<HTMLElement>('.topic-spark');
      if (sparkEls && sparkEls.length) {
        const dirs = Array.from(sparkEls, (_, i) => {
          const angle = (i / sparkEls.length) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
          const dist  = 60 + Math.random() * 70;
          return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, s: 0.5 + Math.random() * 0.9 };
        });
        tl.fromTo(
          sparkEls,
          { x: 0, y: 0, scale: 0, opacity: 1 },
          {
            x: (i) => dirs[i].x,
            y: (i) => dirs[i].y,
            scale: (i) => dirs[i].s,
            opacity: 0,
            duration: 0.75,
            ease: 'power2.out',
            stagger: { each: 0.008, from: 'random' },
          },
          0.16,
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, [phase, current, drawKey]);

  return (
    <div ref={rootRef} className="ck-section ck-slide-up flex flex-col items-center gap-6" style={{ animationDelay: '0.1s' }}>
      <div
        ref={cardRef}
        key={drawKey}
        className="relative w-full flex flex-col items-center justify-center text-center px-6 overflow-hidden"
        style={{
          minHeight: 180,
          border: `1.5px solid ${ck.border.default}`,
          background: ck.bg.muted,
          perspective: 600,
        }}
      >
        {/* インパクト時のフラッシュ */}
        <div
          ref={flashRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: ck.text.primary, opacity: 0 }}
        />

        {/* 飛散スパーク（結果リビール時） */}
        {phase === 'result' && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {Array.from({ length: SPARK_COUNT }, (_, i) => (
              <span
                key={i}
                className="topic-spark absolute"
                style={{ width: 7, height: 7, borderRadius: 9999, background: ck.text.primary, opacity: 0 }}
              />
            ))}
          </div>
        )}

        {phase === 'idle' && (
          <p className="text-base font-bold" style={{ color: ck.text.muted }}>
            {t('topic.idleMessage')}
          </p>
        )}

        {phase === 'drawing' && (
          <p ref={textRef} className="text-xl font-black" style={{ color: ck.text.muted }}>
            {shuffleText}
          </p>
        )}

        {phase === 'result' && current && (
          <div className="relative flex flex-col items-center gap-3">
            <span
              ref={labelRef}
              className="flex items-center gap-1.5 text-xs font-black tracking-widest uppercase"
              style={{ color: ck.text.secondary }}
            >
              {isCustom ? (
                <>{current.categoryIcon} カスタム</>
              ) : (
                <>
                  {(() => { const Icon = ICON_MAP[current.categoryIcon]; return Icon ? <Icon size={14} /> : null; })()}
                  {t((TOPIC_CATEGORIES.find((c) => c.id === current.categoryId)?.labelKey ?? 'topic.categoryTitle') as TranslationKey)}
                </>
              )}
            </span>
            <p
              ref={textRef}
              aria-label={current.text}
              className="text-xl sm:text-2xl font-black leading-snug"
              style={{ color: ck.text.primary }}
            >
              <span aria-hidden="true">
                {Array.from(current.text).map((chChar, i) => (
                  <span
                    key={i}
                    className="topic-char"
                    style={{ display: 'inline-block', whiteSpace: 'pre' }}
                  >
                    {chChar === ' ' ? ' ' : chChar}
                  </span>
                ))}
              </span>
            </p>
          </div>
        )}
      </div>

      <button
        onClick={onDraw}
        disabled={disabled || phase === 'drawing'}
        className="ck-btn ck-btn-primary w-full max-w-xs text-xl h-14 tracking-widest disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {phase === 'drawing' ? t('topic.drawing') : t('topic.drawButton')}
      </button>

      {disabled && (
        <p className="text-sm font-semibold" style={{ color: ck.text.secondary }}>
          {t('topic.noTopics')}
          {isCustomOnly && (customTopicCount ?? 0) === 0 && (
            <span className="block text-xs mt-1 font-medium" style={{ color: ck.text.muted }}>
              {t('topic.noTopicsCustomOnlyHint')}
            </span>
          )}
        </p>
      )}
    </div>
  );
}
