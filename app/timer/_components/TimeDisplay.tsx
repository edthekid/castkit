'use client';

import { ck } from '../../_theme/colors';

interface TimeDisplayProps {
  /** 表示する時計文字列（例: "05:00" / "1:23:45.67"） */
  value: string;
  /** アラーム点滅中か（点滅アニメを付ける） */
  flashing?: boolean;
  /** 補助ラベル（フェーズ名など、数字の上に小さく表示） */
  label?: string;
  /** サイズ（通常 / 全画面） */
  size?: 'normal' | 'full';
}

/**
 * 等幅の大きな時計表示。数字は tabular-nums で桁ブレしないようにする。
 * 色はトークンのみ。点滅は Tailwind の animate-pulse を使う。
 */
export function TimeDisplay({ value, flashing = false, label, size = 'normal' }: TimeDisplayProps) {
  const digitClass = size === 'full'
    ? 'text-[19vw] sm:text-[15vw]'
    : 'text-6xl sm:text-7xl';

  return (
    <div className={`flex flex-col items-center ${flashing ? 'animate-pulse' : ''}`}>
      {label && (
        <span
          className="text-xs sm:text-sm font-black tracking-[0.3em] uppercase mb-2"
          style={{ color: ck.text.secondary }}
        >
          {label}
        </span>
      )}
      <span
        className={`${digitClass} font-black tabular-nums leading-none`}
        style={{ color: ck.text.primary, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.01em' }}
      >
        {value}
      </span>
    </div>
  );
}
