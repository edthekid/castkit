'use client';

import { RefObject } from 'react';
import { WheelSlices } from './WheelSlices';
import { CenterDot, Needle, WinnerOverlay } from './WheelParts';
import { ck } from '../../../_theme/colors';

interface RouletteWheelProps {
  items: string[];
  svgRef: RefObject<SVGSVGElement | null>;
  winner: string | null;
  animKey: number;
  bounceKey: number;
}

export function RouletteWheel({ items, svgRef, winner, animKey, bounceKey }: RouletteWheelProps) {
  return (
    /* ─── 統一カード枠 ─── */
    <div style={{
      background: ck.text.onDark,
      borderRadius: 0,
      boxShadow: '0 1px 6px rgba(30,27,46,0.06)',
      border: '1.5px solid #e4e4e7',
      padding: 'clamp(16px, 5vw, 40px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 0,
      width: '100%',
      overflow: 'hidden',
    }}>
      {/* ホイール本体 */}
      <div className="relative" style={{ width: '100%', maxWidth: 460, aspectRatio: '1 / 1' }}>
        <Needle bounceKey={bounceKey} />
        <svg
          ref={svgRef}
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
          }}
        >
          <WheelSlices items={items} />
          {items.length > 1 && <CenterDot />}
        </svg>
        {winner && <WinnerOverlay winner={winner} animKey={animKey} />}
      </div>
    </div>
  );
}
