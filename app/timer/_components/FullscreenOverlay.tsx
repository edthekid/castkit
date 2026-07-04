'use client';

import { useEffect } from 'react';
import { useTranslation } from '../../_i18n/useTranslation';
import { ck } from '../../_theme/colors';
import { IconX } from '../../_components/icons';
import { TimeDisplay } from './TimeDisplay';

interface FullscreenOverlayProps {
  open: boolean;
  onClose: () => void;
  value: string;
  label?: string;
  flashing?: boolean;
}

/**
 * 配信の待機画面用の大型表示（アプリ内オーバーレイ）。
 * position:fixed で画面全体を覆い、巨大な等幅数字を表示する。Esc で閉じる。
 * ネイティブ Fullscreen API は使わず、OBS のウィンドウ/ブラウザキャプチャでも
 * 安定して映せるようにしている。
 */
export function FullscreenOverlay({ open, onClose, value, label, flashing = false }: FullscreenOverlayProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-6"
      style={{ zIndex: 200, background: ck.bg.page }}
      role="dialog"
      aria-modal="true"
      aria-label={label ?? t('timer.title')}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t('timer.exitFullscreen')}
        className="ck-btn absolute top-4 right-4 w-11 h-11 flex items-center justify-center"
        style={{ background: ck.bg.muted, color: ck.text.primary, border: `1.5px solid ${ck.border.default}` }}
      >
        <IconX size={20} aria-hidden="true" />
      </button>

      <TimeDisplay value={value} label={label} flashing={flashing} size="full" />

      <span
        className="absolute bottom-6 text-xs font-bold tracking-widest uppercase"
        style={{ color: ck.text.muted }}
      >
        {t('timer.exitHint')}
      </span>
    </div>
  );
}
