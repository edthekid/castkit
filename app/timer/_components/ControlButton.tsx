'use client';

import type { ReactNode } from 'react';
import { ck } from '../../_theme/colors';

interface ControlButtonProps {
  onClick: () => void;
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

/**
 * タイマー各モード共通の操作ボタン（開始/一時停止/リセット/ラップ 等）。
 * primary = 塗り、ghost = 枠線のみ。色はトークンのみ。
 */
export function ControlButton({
  onClick, children, variant = 'ghost', disabled = false, ariaLabel, className = '',
}: ControlButtonProps) {
  const style = variant === 'primary'
    ? { background: ck.text.primary, color: ck.text.onDark, border: `1.5px solid ${ck.text.primary}` }
    : { background: ck.bg.muted, color: ck.text.primary, border: `1.5px solid ${ck.border.default}` };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`ck-btn h-12 px-5 text-sm font-black tracking-wider flex items-center justify-center gap-2 disabled:opacity-40 ${className}`}
      style={style}
    >
      {children}
    </button>
  );
}
