'use client';

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
export function WinnerOverlay({ winner, animKey }: { winner: string; animKey: number }) {
  const chars    = Array.from(winner);
  const fontSize = winner.length > 6 ? 17 : winner.length > 4 ? 20 : winner.length > 2 ? 25 : 30;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ zIndex: 10 }}
    >
      <div
        key={animKey}
        className="w-circle flex items-center justify-center"
        style={{ width: 150, height: 150, borderRadius: '50%' }}
      >
        <span
          className="w-text"
          style={{
            fontSize, fontWeight: 900, lineHeight: 1.2, fontFamily: FONT,
            maxWidth: 124, textAlign: 'center', display: 'block',
          }}
        >
          {chars.map((ch, i) => (
            <span key={i} className="w-char" style={{ animationDelay: `${0.28 + i * 0.07}s` }}>
              {ch}
            </span>
          ))}
        </span>

        {/* 紙吹雪 */}
        {CONFETTI.map((c, i) => (
          <span
            key={i}
            className="confetti-dot"
            style={{
              background: c.color,
              '--cx': `${c.x}px`,
              '--cy': `${c.y}px`,
              '--cr': `${c.r}deg`,
              animationDelay: `${0.3 + c.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
