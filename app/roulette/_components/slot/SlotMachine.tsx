'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SLOT_CELL_H, SLOT_VISIBLE } from '../../_constants';
import { SingleReel } from './SingleReel';
import { ConfettiBurst } from '../shared/ConfettiBurst';
import { ck } from '../../../_theme/colors';

const FONT = "'Noto Sans JP','Hiragino Sans','Yu Gothic',sans-serif";

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

  const rootRef  = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showWinner) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const popup = popupRef.current;
    const chEls = rootRef.current?.querySelectorAll<HTMLElement>('.w-char');

    if (reduce) {
      gsap.set(popup, { xPercent: -50, yPercent: -50, scale: 1, opacity: 1 });
      if (chEls) gsap.set(chEls, { opacity: 1, y: 0, rotateX: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // ポップアップの登場 → ボーダー脈動を無限ループ
      tl.fromTo(
        popup,
        { xPercent: -50, yPercent: -50, scale: 0.4, opacity: 0 },
        { xPercent: -50, yPercent: -50, scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' },
      );
      tl.to(popup, { borderColor: '#18181b', duration: 0.7, ease: 'sine.inOut', repeat: -1, yoyo: true }, 0.6);

      // 当選文字を1文字ずつめくり上げ
      if (chEls && chEls.length) {
        tl.fromTo(
          chEls,
          { opacity: 0, y: 12, rotateX: -80, scale: 0.6 },
          { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 0.4, stagger: 0.06, ease: 'back.out(2.4)' },
          0.2,
        );
      }

    }, rootRef);

    return () => ctx.revert();
  }, [showWinner, winner]);

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
      <div ref={rootRef} style={{ position: 'relative', display: 'block', width: '100%', maxWidth: 320 }}>
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
              ref={popupRef}
              className="slot-winner-popup"
              style={{
                width: 'calc(100% - 8px)',
                height: reelHeight - 8,
                borderRadius: 0,
                opacity: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <span className="w-text" aria-label={winner!} style={{
                fontSize: winner!.length > 6 ? 20 : winner!.length > 3 ? 26 : 32,
                fontWeight: 900, lineHeight: 1.2, fontFamily: FONT,
                perspective: 400,
              }}>
                {Array.from(winner!).map((ch, i) => (
                  <span key={i} className="w-char" aria-hidden="true" style={{ display: 'inline-block' }}>
                    {ch}
                  </span>
                ))}
              </span>
            </div>

            {/* 紙吹雪パーティクル */}
            <ConfettiBurst triggerKey={winner ?? ''} />
          </>
        )}
      </div>
    </div>
  );
}
