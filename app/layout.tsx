import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ck } from './_theme/colors';
import { Analytics } from '@vercel/analytics/next';
import { LanguageProvider } from './_i18n/LanguageContext';
import { AppShell } from './_components/AppShell';
import { Noto_Sans_JP } from 'next/font/google';
import { SITE_URL, pageAlternates, webAppJsonLd, websiteJsonLd } from './_lib/seo';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['500', '700'], display: 'swap' });
const notoSansJP = Noto_Sans_JP({ subsets: ['latin'], weight: ['500', '700', '900'], display: 'swap', preload: false });
const FONT_STACK = `${spaceGrotesk.style.fontFamily}, ${notoSansJP.style.fontFamily}, "Hiragino Sans", "Yu Gothic", sans-serif`;

export const metadata: Metadata = {
  title: {
    default: 'CastKit',
    template: '%s | CastKit',
  },
  description: '無料の配信・ゲームイベント支援ツール集。チーム分け・ルーレット・あみだくじ・お題ガチャ・ディベートなど、登録不要でブラウザだけで使えます。Free streaming and gaming event tools — Team Division, Roulette, Amida, Topic Picker, Debate. No sign-up required.',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: 'CastKit',
    description: '配信・ゲームイベント支援ツール / Free Streaming and Gaming Event Tools',
    url: SITE_URL,
    siteName: 'CastKit',
    locale: 'ja_JP',
    alternateLocale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CastKit',
    description: '配信・ゲームイベント支援ツール / Free Streaming and Gaming Event Tools',
  },
  alternates: pageAlternates('/'),
};

const siteJsonLd = webAppJsonLd({
  name: 'CastKit',
  description: '無料の配信・ゲームイベント支援ツール集。登録不要でブラウザだけで使えるツールを揃えています。',
  path: '/',
});
const siteWebsiteJsonLd = websiteJsonLd();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body style={{ fontFamily: FONT_STACK, background: ck.bg.page, color: ck.text.primary }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteWebsiteJsonLd) }}
        />
        <LanguageProvider>
          <AppShell>{children}</AppShell>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
