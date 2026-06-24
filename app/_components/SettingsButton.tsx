'use client';

import { IconGear } from './icons';
import { ck } from '../_theme/colors';

interface SettingsButtonProps {
  label: string;
  /** バッジに表示する件数（0なら非表示） */
  count: number;
  onClick: () => void;
}

/**
 * 設定モーダルを開くボタン（お題ガチャ・ディベートで共通）。
 * カスタム件数が1以上のときバッジを表示する。
 */
export function SettingsButton({ label, count, onClick }: SettingsButtonProps) {
  return (
    <button
      onClick={onClick}
      className="ck-btn ck-btn-ghost flex items-center gap-1.5 text-xs px-3 py-2"
      aria-label={label}
    >
      <IconGear size={14} aria-hidden="true" />
      {label}
      {count > 0 && (
        <span
          className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-black rounded-full"
          style={{ background: ck.text.primary, color: ck.text.onDark }}
        >
          {count}
        </span>
      )}
    </button>
  );
}
