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

        // 全方向(360°)へ放射状に飛散
        const angle = Math.random() * Math.PI * 2;
        const dist  = 70 + Math.random() * 170;           // 中心からの飛距離
        const rx    = Math.cos(angle) * dist;
        const ry    = Math.sin(angle) * dist;
        const fall  = 120 + Math.random() * 170;          // 落下量(重力)
        const drift = (Math.random() - 0.5) * 50;         // 落下中の横流れ
        const spin  = (Math.random() < 0.5 ? -1 : 1) * (180 + Math.random() * 620);
        const dur   = 1.0 + Math.random() * 0.8;
        const burstT = dur * 0.4;                          // 弾ける時間
        const fallT  = dur - burstT;                       // 落ちる時間

        const tl = gsap.timeline();
        // 出現ポップ
        tl.to(p, { scale: 0.65 + Math.random() * 0.75, duration: 0.12, ease: 'power2.out' }, 0);
        // ① 放射状に弾ける（全方向へ飛び出して減速）
        tl.to(p, { x: rx, y: ry, duration: burstT, ease: 'power3.out' }, 0);
        // ② 重力で落下（横にわずかに流れながら加速して落ちる）
        tl.to(p, { y: ry + fall, duration: fallT, ease: 'power1.in' }, burstT);
        tl.to(p, { x: rx + drift, duration: fallT, ease: 'sine.out' }, burstT);
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
