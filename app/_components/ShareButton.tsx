'use client';

import { usePathname } from 'next/navigation';
import { IconX } from './icons';
import { ck } from '../_theme/colors';
import { useTranslation } from '../_i18n/useTranslation';
import { SITE_URL } from '../_lib/seo';

interface ShareButtonProps {
  text: string;
  size?: 'sm' | 'md';
}

export function ShareButton({ text, size = 'sm' }: ShareButtonProps) {
  const { locale } = useTranslation();
  // window.location を使うとSSRとハイドレーション時でhref属性が食い違う。
  // usePathname() はサーバー/クライアントで一致し、共有URLも正規の本番URLになる。
  const pathname = usePathname();
  const url = `${SITE_URL}${pathname}`;
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&related=CastKit`;

  const isSm = size === 'sm';
  const label = locale === 'ja' ? 'ポスト' : 'Post';
  const ariaLabel = locale === 'ja' ? 'X (Twitter) でシェア' : 'Share on X';

  return (
    <a
      href={shareUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 font-bold transition-opacity hover:opacity-70"
      style={{
        fontSize: isSm ? 11 : 13,
        color: ck.text.secondary,
        border: `1px solid ${ck.border.default}`,
        padding: isSm ? '4px 10px' : '6px 14px',
        background: ck.bg.muted,
      }}
      aria-label={ariaLabel}
    >
      <IconX size={isSm ? 12 : 14} aria-hidden="true" />
      <span>{label}</span>
    </a>
  );
}
