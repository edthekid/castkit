'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ck } from '../../../_theme/colors';

const FONT = "'Noto Sans JP','Hiragino Sans','Yu Gothic',sans-serif";

/** 当選時に飛び散る紙吹雪の配置（固定パターンでhydration安定） */
const CONFETTI = [
  { x: -130, y: -80,  r: 200, color: ck.text.primary, delay: 0.00 },
  { x:  140, y: -90,  r: -160, color: ck.text.secondary, delay: 0.05 },
  { x: -160, y: 40,   r: 120, color: ck.text.secondary, delay: 0.10 },
  { x:  160, y: 50,   r: -90,  color: ck.text.primary, delay: 0.02 },
  { x:  -60, y: -150, r: 260, color: ck.text.muted, delay: 0.12 },
  { x:   80, y: -160, r: -210, color: ck.text.primary, delay: 0.07 },
  { x: -120, y: 120,  r: 80,  color: ck.text.secondary, delay: 0.14 },
  { x:  120, y: 130,  r: -140, color: ck.text.secondary, delay: 0.03 },
  { x:    0, y: -180, r: 180, color: ck.text.primary, delay: 0.11 },
  { x:    0, y: 170,  r: -60,  color: ck.text.muted, delay: 0.06 },
] as const;

// ─── 中央ドット ──────────────────────────────────────────
export function CenterDot() {
  return (
    <g>
      <circle cx={100} cy={100} r={14} fill="#18181b" />
      <circle cx={100} cy={100} r={10} fill="#27272a" />
      <circle cx={100} cy={100} r={5}  fill="#ffffff" />
    </g>
  );
}

// ─── 針 ─────────────────────────────────────────────────
export function Needle({ bounceKey }: { bounceKey: number }) {
  return (
    <div
      key={bounceKey}
      className={bounceKey > 0 ? 'needle-hit' : ''}
      style={{
        position: 'absolute', top: '50%', right: 0,
        transform: 'translateY(-50%)', transformOrigin: 'right center',
        zIndex: 20,
      }}
    >
      <svg width="58" height="20" viewBox="-2 -2 58 20" fill="none">
        {/* 針本体（白縁取り付きで黒背景でも視認可能に） */}
        <polygon points="2,8 50,3 54,8 50,13" fill="#18181b" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
        {/* ハイライト */}
        <polygon points="2,8 50,3 40,5.5" fill="#d4d4d8" opacity="0.6" />
        {/* 先端ノブ */}
        <circle cx="50" cy="8" r="5" fill="#27272a" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="50" cy="8" r="2.5" fill="#f4f4f5" />
      </svg>
    </div>
  );
}

// ─── 当選オーバーレイ ────────────────────────────────────
const RING_SOFT = '0 0 0 3px #a1a1aa, 0 0 20px 4px rgba(17,17,20,0.35)';
const RING_HARD = '0 0 0 6px #d4d4d8, 0 0 36px 10px rgba(17,17,20,0.55)';

export function WinnerOverlay({ winner, animKey }: { winner: string; animKey: number }) {
  const chars    = Array.from(winner);
  const fontSize = winner.length > 6 ? 17 : winner.length > 4 ? 20 : winner.length > 2 ? 25 : 30;

  const rootRef   = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const circle = circleRef.current;
    const chEls  = rootRef.current?.querySelectorAll<HTMLElement>('.w-char');
    const dots   = rootRef.current?.querySelectorAll<HTMLElement>('.confetti-dot');

    if (reduce) {
      gsap.set(circle, { opacity: 1, scale: 1, boxShadow: RING_SOFT });
      if (chEls) gsap.set(chEls, { opacity: 1, y: 0, rotateX: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 円のポップイン → リング脈動を無限ループ
      tl.fromTo(
        circle,
        { scale: 0.2, opacity: 0, boxShadow: RING_SOFT },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' },
      );
      tl.to(circle, { boxShadow: RING_HARD, duration: 1, ease: 'sine.inOut', repeat: -1, yoyo: true }, 0.5);

      // 当選文字を1文字ずつめくり上げ
      if (chEls && chEls.length) {
        tl.fromTo(
          chEls,
          { opacity: 0, y: 10, rotateX: -80, scale: 0.6 },
          { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 0.4, stagger: 0.06, ease: 'back.out(2.4)' },
          0.28,
        );
      }

      // 紙吹雪バースト（外へ飛散しつつ回転・フェード）
      if (dots && dots.length) {
        tl.fromTo(
          dots,
          { x: 0, y: 0, scale: 0.4, opacity: 1, rotate: 0 },
          {
            x: (i) => CONFETTI[i].x,
            y: (i) => CONFETTI[i].y,
            rotate: (i) => CONFETTI[i].r,
            scale: 1,
            opacity: 0,
            duration: 0.9,
            ease: 'power2.out',
            stagger: { each: 0.02, from: 'random' },
          },
          0.3,
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, [animKey, winner]);

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ zIndex: 10 }}
    >
      <div
        ref={circleRef}
        className="w-circle flex items-center justify-center"
        style={{ width: 150, height: 150, borderRadius: '50%', opacity: 0 }}
      >
        <span
          className="w-text"
          aria-label={winner}
          style={{
            fontSize, fontWeight: 900, lineHeight: 1.2, fontFamily: FONT,
            maxWidth: 124, textAlign: 'center', display: 'block',
            perspective: 400,
          }}
        >
          {chars.map((ch, i) => (
            <span key={i} className="w-char" aria-hidden="true" style={{ display: 'inline-block' }}>
              {ch}
            </span>
          ))}
        </span>

        {/* 紙吹雪 */}
        {CONFETTI.map((c, i) => (
          <span
            key={i}
            className="confetti-dot"
            aria-hidden="true"
            style={{ background: c.color, opacity: 0 }}
          />
        ))}
      </div>
    </div>
  );
}
