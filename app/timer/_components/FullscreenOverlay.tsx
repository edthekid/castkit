'use client';

import { useEffect } from 'react';
import { useTranslation } from '../../_i18n/useTranslation';
import { ck } from '../../_theme/colors';
import { TimeDisplay } from './TimeDisplay';

interface FullscreenOverlayProps {
  open: boolean;
  onClose: () => void;
  value: string;
  label?: string;
  flashing?: boolean;
  fontFamily?: string;
}

/**
 * 配信の待機画面用の大型表示（アプリ内オーバーレイ）。
 * position:fixed で画面全体を覆い、巨大な等幅数字を表示する。
 * クリック（どこでも）または Esc で閉じる。閉じるボタンは置かず、
 * 待機画面として余計なUIを映さないようにしている。
 * ネイティブ Fullscreen API は使わず、OBS のウィンドウ/ブラウザキャプチャでも
 * 安定して映せるようにしている。
 */
export function FullscreenOverlay({ open, onClose, value, label, flashing = false, fontFamily }: FullscreenOverlayProps) {
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
      className="fixed inset-0 flex items-center justify-center p-6 cursor-pointer"
      style={{ zIndex: 200, background: ck.bg.page }}
      role="dialog"
      aria-modal="true"
      aria-label={label ?? t('timer.title')}
      onClick={onClose}
    >
      <TimeDisplay value={value} label={label} flashing={flashing} size="full" fontFamily={fontFamily} />

      <span
        className="absolute bottom-6 text-xs font-bold tracking-widest uppercase"
        style={{ color: ck.text.muted }}
      >
        {t('timer.exitHint')}
      </span>
    </div>
  );
}
