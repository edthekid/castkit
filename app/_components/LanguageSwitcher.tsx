'use client';

import { useTranslation } from '../_i18n/useTranslation';
import { ck } from '../_theme/colors';

/**
 * 日本語/英語を切り替えるトグルボタン。
 * サイドバーのフッター付近に配置する。
 */
export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useTranslation();

  return (
    <div className={`flex gap-1 p-1${compact ? '' : ' w-full'}`} style={{ background: ck.bg.muted, border: `1px solid ${ck.border.default}` }}>
      {(['ja', 'en'] as const).map((lng) => (
        <button
          key={lng}
          onClick={() => setLocale(lng)}
          className={`${compact ? 'px-2.5' : 'flex-1'} text-xs font-black py-1.5 transition-all`}
          style={locale === lng ? {
            background: ck.text.onDark, color: ck.text.primary,
            boxShadow: '0 1px 4px rgba(var(--ck-ink-rgb), 0.15)',
          } : { color: ck.text.muted }}
        >
          {lng === 'ja' ? '日本語' : 'English'}
        </button>
      ))}
    </div>
  );
}
