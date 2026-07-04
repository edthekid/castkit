'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { SLOT_CELL_H, SLOT_VISIBLE, SLOT_LAPS } from '../../_constants';
import { generateColors } from '../../_utils';
import { ck } from '../../../_theme/colors';

const FONT = "'Noto Sans JP','Hiragino Sans','Yu Gothic',sans-serif";

interface SingleReelProps {
  items: string[];
  triggerKey: number;
  winnerIdx: number;
  delay?: number;
}

export function SingleReel({ items, triggerKey, winnerIdx, delay = 0 }: SingleReelProps) {
  const reelRef      = useRef<HTMLDivElement>(null);
  const tlRef        = useRef<gsap.core.Timeline | null>(null);
  const isMountedRef = useRef(false);

  const n          = items.length;
  const colors     = generateColors(Math.max(n, 1));
  const totalCells = n * (SLOT_LAPS + 2);

  // クリーンアップ
  useEffect(() => {
    isMountedRef.current = false;
    return () => { tlRef.current?.kill(); };
  }, []);

  // スピン実行（GSAP: 減速 → わずかに行き過ぎ → カチッと着地）
  useEffect(() => {
    // 初回マウント時はスキップ
    if (!isMountedRef.current) { isMountedRef.current = true; return; }
    if (triggerKey === 0 || n === 0 || winnerIdx < 0) return;
    const el = reelRef.current;
    if (!el) return;

    const centerOffset =
      (SLOT_LAPS * n + winnerIdx) * SLOT_CELL_H - Math.floor(SLOT_VISIBLE / 2) * SLOT_CELL_H;

    tlRef.current?.kill();
    gsap.set(el, { y: 0 });

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { gsap.set(el, { y: -centerOffset }); return; }

    const duration  = 4.8 + Math.random() * 0.8;
    const overshoot = SLOT_CELL_H * 0.5;
    tlRef.current = gsap.timeline({ delay: delay / 1000 });
    tlRef.current
      .to(el, { y: -(centerOffset + overshoot), duration, ease: 'power3.out' })
      .to(el, { y: -centerOffset, duration: 0.4, ease: 'back.out(2.6)' });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- スピンはtriggerKey(明示的な開始信号)でのみ発火。winnerIdx/n/delayは発火時点の値を読む（値変化での再スピンを防ぐ）
  }, [triggerKey]);

  if (n === 0) return null;

  return (
    <div style={{
      width: '100%',
      height: SLOT_CELL_H * SLOT_VISIBLE,
      overflow: 'hidden',
      position: 'relative',
      background: ck.bg.card,
      borderRadius: 0,
      border: '1.5px solid #e4e4e7',
    }}>
      <div ref={reelRef} style={{ display: 'flex', flexDirection: 'column' }}>
        {Array.from({ length: totalCells }, (_, i) => {
          const origIdx      = i % n;
          const isCenterCell = i === SLOT_LAPS * n + winnerIdx && winnerIdx >= 0;
          const cellBg       = isCenterCell ? ck.text.onDark : colors[origIdx];
          // 背景が白なら黒文字、それ以外は白文字にして可読性を保つ
          const cellColor    = cellBg === '#ffffff' ? ck.text.primary : ck.text.onDark;
          return (
            <div key={i} style={{
              height: SLOT_CELL_H, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: cellBg,
              color:      cellColor,
              fontSize:   items[origIdx].length > 4 ? 14 : items[origIdx].length > 2 ? 17 : 20,
              fontWeight: 900, fontFamily: FONT,
              borderBottom: `1px solid ${cellColor === '#ffffff' ? 'rgba(255,255,255,0.15)' : 'rgba(17,17,20,0.1)'}`,
            }}>
              {items[origIdx]}
            </div>
          );
        })}
      </div>
    </div>
  );
}
