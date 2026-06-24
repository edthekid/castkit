'use client';

import { useEffect, useState } from 'react';
import { ck } from '../_theme/colors';

interface Particle {
  id: number;
  size: number;
  left: number;
  top: number;
  color: string;
  duration: number;
  delay: number;
  opacity: number;
  driftX: number;
}

/**
 * tsParticlesを使わない軽量パーティクル演出。
 * 紫・青・シアンの粒がCSSアニメーションでゆっくり浮遊する。
 *
 * Math.random()はSSR/CSRで値が一致せずhydrationエラーになるため、
 * クライアントマウント後にのみ生成・描画する。
 */
export function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[] | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const colors = [ck.text.primary, ck.text.secondary, ck.text.secondary];
    setParticles(
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        size: 2 + Math.random() * 4,
        left: Math.random() * 100,
        top: Math.random() * 100,
        color: colors[i % colors.length],
        duration: 14 + Math.random() * 16,
        delay: Math.random() * -20,
        opacity: 0.08 + Math.random() * 0.18,
        driftX: (Math.random() - 0.5) * 60,
      })),
    );
  }, []);

  // 初回SSR・マウント前は何も描画しない
  if (!particles) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            opacity: p.opacity,
            filter: 'blur(0.5px)',
            animation: `ck-particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
            '--ck-drift-x': `${p.driftX}px`,
          } as React.CSSProperties}
        />
      ))}
      <style>{`
        @keyframes ck-particle-drift {
          0%, 100% { transform: translate(0, 0); }
          50%      { transform: translate(var(--ck-drift-x), -40px); }
        }
      `}</style>
    </div>
  );
}
