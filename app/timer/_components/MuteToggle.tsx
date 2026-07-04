'use client';

import { useTranslation } from '../../_i18n/useTranslation';
import { ck } from '../../_theme/colors';
import { IconVolume, IconVolumeMute } from '../../_components/icons';

/**
 * 通知音のミュート切替。既定はミュート（muted=true）。
 * 音を出す環境向けのスイッチで、視覚的な点滅通知は常に併用する。
 */
export function MuteToggle({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  const { t } = useTranslation();
  const label = muted ? t('timer.soundOff') : t('timer.soundOn');
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={!muted}
      aria-label={label}
      className="ck-btn h-9 px-3 text-xs font-black flex items-center gap-2"
      style={{
        background: muted ? ck.bg.muted : ck.text.primary,
        color:      muted ? ck.text.secondary : ck.text.onDark,
        border: `1.5px solid ${muted ? ck.border.default : ck.text.primary}`,
      }}
    >
      {muted ? <IconVolumeMute size={16} aria-hidden="true" /> : <IconVolume size={16} aria-hidden="true" />}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
