'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ck } from '../_theme/colors';

interface ModalProps {
  onClose: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}

export function Modal({ onClose, ariaLabel, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Escape キー閉鎖 + フォーカス復元
  // onClose を ref 経由で参照することで、親の再レンダーによる effect 再実行を防ぐ
  useEffect(() => {
    prevFocusRef.current = document.activeElement as HTMLElement;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onCloseRef.current(); };
    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
      prevFocusRef.current?.focus();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 初期フォーカス + フォーカストラップ
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const getFocusable = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ));

    getFocusable()[0]?.focus();

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const els = getFocusable();
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    panel.addEventListener('keydown', trap);
    return () => panel.removeEventListener('keydown', trap);
  }, []);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(30,27,46,0.35)',
        backdropFilter: 'blur(2px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(440px, 100%)',
          background: ck.text.onDark,
          border: `1px solid ${ck.border.default}`,
          boxShadow: '0 16px 48px rgba(30,27,46,0.25)',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
