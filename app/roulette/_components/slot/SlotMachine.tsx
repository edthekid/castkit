'use client';

import { SLOT_CELL_H, SLOT_VISIBLE } from '../../_constants';
import { SingleReel } from './SingleReel';
import { ck } from '../../../_theme/colors';

const FONT = "'Noto Sans JP','Hiragino Sans','Yu Gothic',sans-serif";

/** 当選時に飛び散る紙吹雪の配置（固定パターンでhydration安定） */
const CONFETTI = [
  { x: -120, y: -70,  r: 200, color: ck.text.primary, delay: 0.00 },
  { x:  130, y: -80,  r: -160, color: ck.text.secondary, delay: 0.04 },
  { x: -150, y: 30,   r: 120, color: ck.text.secondary, delay: 0.08 },
  { x:  150, y: 40,   r: -90,  color: ck.text.primary, delay: 0.02 },
  { x:  -60, y: -110, r: 260, color: ck.text.muted, delay: 0.10 },
  { x:   70, y: -120, r: -210, color: ck.text.primary, delay: 0.06 },
  { x: -110, y: 100,  r: 80,  color: ck.text.secondary, delay: 0.12 },
  { x:  110, y: 110,  r: -140, color: ck.text.secondary, delay: 0.03 },
  { x:    0, y: -140, r: 180, color: ck.text.primary, delay: 0.09 },
  { x:    0, y: 140,  r: -60,  color: ck.text.muted, delay: 0.05 },
] as const;

interface SlotMachineProps {
  items: string[];
  triggerKey: number;
  winnerIdx: number;
  winner: string | null;
  isSpinning: boolean;
}

export function SlotMachine({
  items, triggerKey, winnerIdx, winner, isSpinning,
}: SlotMachineProps) {
  const n = items.length;
  const showWinner = winner !== null && !isSpinning;
  const reelHeight = SLOT_CELL_H * SLOT_VISIBLE;

  return (
    /* ─── 統一カード枠（RouletteWheelと同じスタイル） ─── */
    <div style={{
      background: ck.text.onDark,
      borderRadius: 0,
      boxShadow: '0 1px 6px rgba(30,27,46,0.06)',
      border: '1.5px solid #e4e4e7',
      padding: 'clamp(16px, 5vw, 40px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
      width: '100%',
      overflow: 'hidden',
    }}>
      {/* ─── リール部分 ─── */}
      <div style={{ position: 'relative', display: 'block', width: '100%', maxWidth: 320 }}>
        {/* リール本体 */}
        <div style={{
          borderRadius: 0,
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(17,17,20, 0.12)',
        }}>
          {n > 0 ? (
            <SingleReel items={items} triggerKey={triggerKey} winnerIdx={winnerIdx} />
          ) : (
            <div style={{
              width: '100%',
              height: reelHeight,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: ck.bg.card,
              borderRadius: 0,
              border: '1.5px solid #e4e4e7',
              color: ck.text.primary, fontWeight: 700, fontSize: 14, fontFamily: FONT,
            }}>
              候補者がいません
            </div>
          )}
        </div>

        {/* 中央ハイライトライン（上下）: 当選ポップアップ表示中は隠す */}
        {n > 0 && !showWinner && (
          <>
            <div style={{
              position: 'absolute',
              top: reelHeight / 3,
              left: 0, right: 0,
              height: 2,
              background: 'linear-gradient(90deg, transparent, rgba(17,17,20, 0.5), transparent)',
              pointerEvents: 'none',
              zIndex: 10,
            }} />
            <div style={{
              position: 'absolute',
              top: (reelHeight / 3) * 2,
              left: 0, right: 0,
              height: 2,
              background: 'linear-gradient(90deg, transparent, rgba(17,17,20, 0.5), transparent)',
              pointerEvents: 'none',
              zIndex: 10,
            }} />
          </>
        )}

        {/* 当選ポップアップ */}
        {showWinner && (
          <>
            <div
              className="slot-winner-popup"
              style={{
                width: 'calc(100% - 8px)',
                height: reelHeight - 8,
                borderRadius: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <span className="w-text" style={{
                fontSize: winner!.length > 6 ? 20 : winner!.length > 3 ? 26 : 32,
                fontWeight: 900, lineHeight: 1.2, fontFamily: FONT,
              }}>
                {Array.from(winner!).map((ch, i) => (
                  <span key={i} className="w-char" style={{ animationDelay: `${0.1 + i * 0.06}s` }}>
                    {ch}
                  </span>
                ))}
              </span>
            </div>

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
                  animationDelay: `${0.55 + c.delay}s`,
                } as React.CSSProperties}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
