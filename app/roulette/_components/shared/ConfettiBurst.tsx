'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ck } from '../../../_theme/colors';

/** パーティクルの色（モノクロ3トーンを維持） */
const COLORS = [ck.text.primary, ck.text.secondary, ck.text.muted];
const COUNT = 32;

interface ConfettiBurstProps {
  /** 値が変わるたびにバーストを再生（当選ごとに発火） */
  triggerKey: number | string;
}

/**
 * 当選時の紙吹雪パーティクル。中心から扇状に飛び出し、重力で舞い落ちながら
 * 回転・フェードする。ホイール／スロット共通。動きはGSAPが担当。
 */
export function ConfettiBurst({ triggerKey }: ConfettiBurstProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parts = rootRef.current?.querySelectorAll<HTMLElement>('.cf-p');
    if (!parts || parts.length === 0) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { gsap.set(parts, { opacity: 0 }); return; }

    const ctx = gsap.context(() => {
      parts.forEach((p) => {
        // 見た目（サイズ・形・色）をランダム付与 ※純度のためrender外(effect内)で生成
        const size   = 5 + Math.random() * 7;
        const circle = Math.random() < 0.35;
        gsap.set(p, {
          width: size,
          height: circle ? size : size * (0.5 + Math.random() * 0.6),
          borderRadius: circle ? '50%' : '1px',
          backgroundColor: COLORS[(Math.random() * COLORS.length) | 0],
          x: 0, y: 0, rotation: Math.random() * 180, scale: 0, opacity: 1,
        });

        // 上方向を中心に扇状の初速
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.15;
        const speed = 90 + Math.random() * 170;
        const vx    = Math.cos(angle) * speed;
        const vy    = Math.sin(angle) * speed;            // 負 = 上向き
        const rise  = vy * (0.55 + Math.random() * 0.4);  // 上昇量(負)
        const fall  = 150 + Math.random() * 150;          // 落下量
        const spin  = (Math.random() < 0.5 ? -1 : 1) * (180 + Math.random() * 620);
        const dur   = 0.95 + Math.random() * 0.75;
        const riseT = dur * 0.38;
        const fallT = dur - riseT;

        const tl = gsap.timeline();
        // 出現ポップ
        tl.to(p, { scale: 0.65 + Math.random() * 0.75, duration: 0.12, ease: 'power2.out' }, 0);
        // 水平ドリフト（空気抵抗で減速）
        tl.to(p, { x: vx * 1.4, duration: dur, ease: 'power1.out' }, 0);
        // 上昇 → 落下（重力の放物線）
        tl.to(p, { y: rise, duration: riseT, ease: 'power2.out' }, 0);
        tl.to(p, { y: rise + fall, duration: fallT, ease: 'power2.in' }, riseT);
        // 回転
        tl.to(p, { rotation: `+=${spin}`, duration: dur, ease: 'none' }, 0);
        // 後半でフェードアウト
        tl.to(p, { opacity: 0, duration: dur * 0.45, ease: 'power1.in' }, dur * 0.58);
      });
    }, rootRef);

    return () => ctx.revert();
  }, [triggerKey]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      style={{ zIndex: 60 }}
    >
      {/* 中心の1点に重ねて配置。飛散・重力・回転はGSAPが付与 */}
      <div style={{ position: 'absolute', width: 0, height: 0 }}>
        {Array.from({ length: COUNT }, (_, i) => (
          <span
            key={i}
            className="cf-p"
            style={{ position: 'absolute', top: 0, left: 0, opacity: 0, willChange: 'transform' }}
          />
        ))}
      </div>
    </div>
  );
}
