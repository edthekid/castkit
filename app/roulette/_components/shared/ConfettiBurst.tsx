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
 * 当選時の紙吹雪パーティクル。中心から全方向へ射出され、重力で連続的に
 * カーブしながら落下・回転・フェードする（放物運動＝途中で止まらない）。
 * ホイール／スロット共通。動きはGSAPが担当。
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
          x: 0, y: 0, opacity: 1,
        });

        // 放物運動のパラメータ（px/秒・px/秒^2）
        const dir    = Math.random() * Math.PI * 2;        // 全方向へ射出
        const speed  = 170 + Math.random() * 260;          // 初速
        const upBias = 120 + Math.random() * 200;          // 上方向への打ち上げ強化(負=上)
        const vx     = Math.cos(dir) * speed;
        const vy     = Math.sin(dir) * speed - upBias;     // 上向き(負)へ寄せる
        const grav   = 320 + Math.random() * 240;          // 重力(軽め)
        const drag   = 0.6 + Math.random() * 0.25;         // 横方向の減衰(空気抵抗)
        const spin0  = Math.random() * 180;                // 初期角
        const spinV  = (Math.random() < 0.5 ? -1 : 1) * (220 + Math.random() * 640); // deg/秒
        const scl    = 0.65 + Math.random() * 0.75;
        const dur    = 1.7 + Math.random() * 1.0;          // 秒

        // 時間tを線形に進め、位置は毎フレーム物理式で算出（＝止まらず連続的に落下）
        const st = { t: 0 };
        const tl = gsap.timeline();
        tl.to(st, {
          t: dur,
          duration: dur,
          ease: 'none',
          onUpdate: () => {
            const t = st.t;
            // 横: 初速に空気抵抗で徐々に減衰（1-e^{-kt} 型）。縦: 初速+重力(0.5*g*t^2)
            const x = (vx / drag) * (1 - Math.exp(-drag * t));
            const y = vy * t + 0.5 * grav * t * t;
            const pop = Math.min(t / 0.12, 1);             // 出現ポップ(0→1)
            gsap.set(p, { x, y, rotation: spin0 + spinV * t, scale: scl * pop });
          },
        }, 0);
        // 後半でフェードアウト（落下しながら消える）
        tl.to(p, { opacity: 0, duration: dur * 0.4, ease: 'power1.in' }, dur * 0.6);
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
