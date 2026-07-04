'use client';

import { useState } from 'react';
import { ck } from '../../_theme/colors';

interface NumberStepperProps {
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  ariaLabel: string;
  ariaDec: string;
  ariaInc: string;
  disabled?: boolean;
}

/**
 * − [入力] + の数値ステッパー（タイマーの時/分/秒・ポモドーロ設定で共用）。
 * 外部からの値変更（プリセット等）にレンダリング中の state 調整で追従する。
 */
export function NumberStepper({
  value, min, max, onChange, ariaLabel, ariaDec, ariaInc, disabled = false,
}: NumberStepperProps) {
  const [draft, setDraft] = useState(String(value));
  const [last, setLast]   = useState(value);

  if (value !== last) {
    setLast(value);
    setDraft(String(value));
  }

  const commit = () => {
    const n = parseInt(draft, 10);
    if (Number.isFinite(n)) onChange(n);
    else setDraft(String(value));
  };

  const btnStyle = { border: `1.5px solid ${ck.border.default}`, background: ck.bg.muted, color: ck.text.primary };

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= min}
        aria-label={ariaDec}
        className="ck-btn w-9 h-9 text-lg font-black leading-none disabled:opacity-30"
        style={btnStyle}
      >
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        value={draft}
        min={min}
        max={max}
        disabled={disabled}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') { commit(); e.currentTarget.blur(); } }}
        aria-label={ariaLabel}
        className="w-14 h-9 text-center text-lg font-black tabular-nums outline-none disabled:opacity-40"
        style={{ border: `1.5px solid ${ck.border.default}`, background: ck.bg.page, color: ck.text.primary }}
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label={ariaInc}
        className="ck-btn w-9 h-9 text-lg font-black leading-none disabled:opacity-30"
        style={btnStyle}
      >
        +
      </button>
    </div>
  );
}
