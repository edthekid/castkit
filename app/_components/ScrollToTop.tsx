'use client';

import { useEffect, useState } from 'react';
import { IconArrowUp } from './icons';
import { useTranslation } from '../_i18n/useTranslation';

/**
 * ページ上部へ戻るフローティングボタン。
 * 一定量スクロールした時だけ右下に出現する（短いページでは表示されない）。
 *
 * 二層構造：
 *   外側 div … 出現/退場のアニメーション（opacity + translateY）を担当
 *   内側 button … サイト共通の ck-btn-primary（ハードオフセット影 + hoverリフト）を維持
 * こうすることで、表示用の transform と hover用の transform が衝突しない。
 */
export function ScrollToTop() {
  const { locale } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="fixed z-40"
      style={{
        right: 'max(20px, env(safe-area-inset-right))',
        bottom: 'max(20px, env(safe-area-inset-bottom))',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(14px)',
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.3s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <button
        type="button"
        onClick={scrollUp}
        aria-label={locale === 'ja' ? 'ページ上部へ戻る' : 'Back to top'}
        className="ck-btn ck-btn-primary flex items-center justify-center"
        style={{ width: 48, height: 48 }}
      >
        <IconArrowUp size={20} aria-hidden="true" />
      </button>
    </div>
  );
}
