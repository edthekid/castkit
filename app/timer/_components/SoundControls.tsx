'use client';

import { useTranslation } from '../../_i18n/useTranslation';
import { ck } from '../../_theme/colors';
import { MuteToggle } from './MuteToggle';

interface SoundControlsProps {
  muted: boolean;
  volume: number; // 0〜1
  onToggleMute: () => void;
  onVolumeChange: (v: number) => void;
  /** スライダー操作後の試聴（現在の音量で1回鳴らす）。 */
  onPreview: () => void;
}

/**
 * 通知音の操作（ミュート切替＋音量バー）。
 * 音がオン（muted=false）のときだけ音量バーを表示する。
 */
export function SoundControls({ muted, volume, onToggleMute, onVolumeChange, onPreview }: SoundControlsProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2">
      <MuteToggle muted={muted} onToggle={onToggleMute} />
      {!muted && (
        <div
          className="flex items-center gap-2 h-9 px-2"
          style={{ border: `1.5px solid ${ck.border.default}`, background: ck.bg.page }}
        >
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(volume * 100)}
            onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
            onPointerUp={onPreview}
            onKeyUp={onPreview}
            aria-label={t('timer.volume')}
            className="ck-range w-24 sm:w-28"
          />
          <span className="text-xs font-black tabular-nums w-8 text-right" style={{ color: ck.text.secondary }}>
            {Math.round(volume * 100)}
          </span>
        </div>
      )}
    </div>
  );
}
