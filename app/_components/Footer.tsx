'use client';

import Link from 'next/link';
import { useTranslation } from '../_i18n/useTranslation';
import type { TranslationKey } from '../_i18n/translations';

const LEGAL_LINKS: { href: string; labelKey: TranslationKey }[] = [
  { href: '/privacy', labelKey: 'footer.privacy' },
  { href: '/contact', labelKey: 'footer.contact' },
];

/**
 * 全ページ共通のサイトフッター。
 * 規約系リンク（プライバシーポリシー・お問い合わせ）と著作権を表示する。
 * ホーム・ガイド・記事はサイドバーやホーム本体で導線があるためフッターには載せない。
 */
export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-16 pt-8 pb-4 border-t border-ck-line text-center">
      <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-4">
        {LEGAL_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-xs font-bold text-ck-subtle hover:text-ck-ink transition-colors"
          >
            {t(l.labelKey)}
          </Link>
        ))}
      </nav>
      <div className="text-[10px] text-ck-muted">{t('common.copyright')}</div>
    </footer>
  );
}
