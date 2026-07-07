'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { ck } from '../_theme/colors';

const ParticleBackground = dynamic(
  () => import('./ParticleBackground').then((m) => ({ default: m.ParticleBackground })),
  { ssr: false },
);
import { LanguageSwitcher } from './LanguageSwitcher';
import { ScrollToTop } from './ScrollToTop';
import { AppToaster } from './AppToaster';
import { Footer } from './Footer';
import { useTranslation } from '../_i18n/useTranslation';
import type { TranslationKey } from '../_i18n/translations';
import { IconHome, IconBolt, IconTarget, IconLadder, IconChat, IconScales, IconTrophy, IconDice, IconTimer, IconBook, IconNews } from './icons';
import type { ComponentType, SVGProps } from 'react';

const TOOL_NAV_ITEMS: { href: string; icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>; labelKey: TranslationKey }[] = [
  { href: '/',              icon: IconHome,   labelKey: 'nav.home' },
  { href: '/team-division', icon: IconBolt,   labelKey: 'nav.teamDivision' },
  { href: '/roulette',      icon: IconTarget, labelKey: 'nav.roulette' },
  { href: '/amida',         icon: IconLadder, labelKey: 'nav.amida' },
  { href: '/topic',         icon: IconChat,   labelKey: 'nav.topic' },
  { href: '/debate',        icon: IconScales, labelKey: 'nav.debate' },
  { href: '/scoreboard',    icon: IconTrophy, labelKey: 'nav.scoreboard' },
  { href: '/dice',          icon: IconDice,   labelKey: 'nav.dice' },
  { href: '/timer',         icon: IconTimer,  labelKey: 'nav.timer' },
];

const CONTENT_NAV_ITEMS: { href: string; icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>; labelKey: TranslationKey }[] = [
  { href: '/guide',    icon: IconBook, labelKey: 'nav.guide' },
  { href: '/articles', icon: IconNews, labelKey: 'nav.articles' },
];

function NavLink({ href, icon: Icon, labelKey, pathname }: {
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  labelKey: TranslationKey;
  pathname: string;
}) {
  const { t } = useTranslation();
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
  return (
    <Link
      href={href}
      className={`ck-nav-link ${isActive ? 'active' : ''}`}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="w-5 flex items-center justify-center opacity-80" aria-hidden="true"><Icon size={16} /></span>
      <span>{t(labelKey)}</span>
      {isActive && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-ck-ink shadow-[0_0_6px_rgba(var(--ck-ink-rgb),0.6)]" aria-hidden="true" />
      )}
    </Link>
  );
}

function Sidebar() {
  const pathname = usePathname();
  const { t, locale } = useTranslation();

  return (
    <div className="ck-sidebar flex flex-col w-64 min-h-screen p-5">
      <div className="mb-8 pb-6 border-b border-ck-line">
        <Link href="/" className="block">
          <div className="relative">
            <div className="text-3xl font-black tracking-widest ck-gradient-text">{t('common.castkit')}</div>
            <div style={{ fontSize: 10, color: ck.text.muted, fontWeight: 700, letterSpacing: '0.3em', marginTop: 2 }}>{t('common.utilityToolkit')}</div>
            <div className="absolute -bottom-3 left-0 w-full h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(var(--ck-ink-rgb), 0.2), transparent)' }} />
          </div>
        </Link>
      </div>

      <nav aria-label={locale === 'ja' ? 'メインナビゲーション' : 'Main navigation'} className="flex flex-col gap-1 flex-1">
        {TOOL_NAV_ITEMS.map((item) => (
          <NavLink key={item.href} {...item} pathname={pathname} />
        ))}

        <div className="mt-3 mb-1">
          <div className="h-px mb-3" style={{ background: ck.border.default }} />
          <div className="ck-eyebrow px-2 mb-1">
            {locale === 'ja' ? 'コンテンツ' : 'CONTENT'}
          </div>
        </div>

        {CONTENT_NAV_ITEMS.map((item) => (
          <NavLink key={item.href} {...item} pathname={pathname} />
        ))}
      </nav>
    </div>
  );
}

const PAGE_TITLES: Record<string, { ja: string; en: string; short: { ja: string; en: string } }> = {
  '/':              { ja: 'CastKit',                        en: 'CastKit',               short: { ja: 'ホーム',       en: 'Home' } },
  '/team-division': { ja: '無料チーム分けツール | CastKit',      en: 'Team Division | CastKit', short: { ja: 'チーム分け',   en: 'Team Division' } },
  '/roulette':      { ja: '無料ルーレット抽選ツール | CastKit',   en: 'Roulette | CastKit',     short: { ja: 'ルーレット',   en: 'Roulette' } },
  '/amida':         { ja: '無料あみだくじツール | CastKit',       en: 'Amida | CastKit',        short: { ja: 'あみだくじ',   en: 'Amida' } },
  '/topic':         { ja: '無料お題ガチャ | CastKit',            en: 'Topic Picker | CastKit', short: { ja: 'お題ガチャ',   en: 'Topic Picker' } },
  '/debate':        { ja: '無料ディベートツール | CastKit',       en: 'Debate | CastKit',       short: { ja: 'ディベート',   en: 'Debate' } },
  '/scoreboard':    { ja: '無料スコアボード・得点管理ツール | CastKit', en: 'Scoreboard | CastKit', short: { ja: 'スコアボード', en: 'Scoreboard' } },
  '/dice':          { ja: '無料サイコロツール | CastKit',           en: 'Dice Roller | CastKit',  short: { ja: 'サイコロ',     en: 'Dice' } },
  '/timer':         { ja: '無料タイマー | CastKit',                en: 'Timer | CastKit',        short: { ja: 'タイマー',     en: 'Timer' } },
  '/guide':         { ja: '使い方ガイド | CastKit',              en: 'How to Use | CastKit',   short: { ja: '使い方ガイド', en: 'Guide' } },
  '/articles':      { ja: '記事一覧 | CastKit',                 en: 'Articles | CastKit',     short: { ja: '記事',         en: 'Articles' } },
  '/privacy':       { ja: 'プライバシーポリシー | CastKit',       en: 'Privacy Policy | CastKit', short: { ja: 'プライバシーポリシー', en: 'Privacy' } },
  '/contact':       { ja: 'お問い合わせ | CastKit',             en: 'Contact | CastKit',      short: { ja: 'お問い合わせ', en: 'Contact' } },
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t, locale } = useTranslation();
  const pathname = usePathname();

  const pageInfo = PAGE_TITLES[pathname]
    ?? (pathname.startsWith('/articles') ? PAGE_TITLES['/articles'] : null)
    ?? PAGE_TITLES['/'];

  // 記事詳細ページ（/articles/<slug>）は generateMetadata が記事固有のタイトルを設定するため、
  // ここで汎用タイトルに上書きしない。一覧 /articles は対象外。
  const isArticleDetail = pathname.startsWith('/articles/');

  useEffect(() => {
    document.documentElement.lang = locale;
    if (!isArticleDetail) document.title = pageInfo[locale];
  }, [pageInfo, locale, isArticleDetail]);

  return (
    <>
      <ParticleBackground />
      <div className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(var(--ck-ink-rgb), 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--ck-ink-rgb), 0.025) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* ホームはツールカードがナビ代わりになるため、デスクトップのサイドバーは出さず全幅に */}
        {pathname !== '/' && (
          <div className="hidden lg:flex flex-shrink-0">
            <Sidebar />
          </div>
        )}

        <div className="drawer lg:hidden">
          <input id="drawer-toggle" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <div
              className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3"
              style={{
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(12px)',
                borderBottom: `1px solid ${ck.border.default}`,
              }}
            >
              <label
                htmlFor="drawer-toggle"
                className="flex items-center justify-center w-9 h-9 cursor-pointer transition-colors text-ck-ink hover:bg-ck-surface"
                aria-label={locale === 'ja' ? 'メニューを開く' : 'Open menu'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  className="w-5 h-5 stroke-current text-ck-ink" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </label>
              <div className="flex flex-col min-w-0">
                <span className="font-black text-sm ck-gradient-text leading-tight">{t('common.castkit')}</span>
                {pathname !== '/' && (
                  <span className="text-[10px] font-bold tracking-wider truncate text-ck-muted">
                    {pageInfo.short[locale]}
                  </span>
                )}
              </div>
              <div className="ml-auto">
                <LanguageSwitcher compact />
              </div>
            </div>
          </div>
          <div className="drawer-side" style={{ zIndex: 100 }}>
            <label htmlFor="drawer-toggle" className="drawer-overlay" />
            <Sidebar />
          </div>
        </div>

        {/* overflow-x-clip は hidden と違い暗黙のスクロールコンテナを作らないため、
            水平はみ出しを抑えつつ配下の position:sticky を維持できる */}
        <main className="flex-1 p-4 md:p-8 overflow-x-clip flex flex-col">
          {/* デスクトップは言語切替を画面右上に（モバイルは上部ヘッダーにあるので非表示） */}
          <div className="hidden lg:flex justify-end mb-4">
            <LanguageSwitcher compact />
          </div>
          <div className="flex-1">{children}</div>
          <Footer />
        </main>
      </div>

      <ScrollToTop />
      <AppToaster />
    </>
  );
}
