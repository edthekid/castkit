import type { Metadata } from 'next';
import { pageAlternates, webAppJsonLd, breadcrumbJsonLd } from '../_lib/seo';

const DESC = '無料のサイコロツール。1〜10個・面数自由（d4/d6/d8/d10/d12/d20/d100）。TRPG・チンチロにも対応。1〜6はドット目のオーソドックスな白サイコロ。履歴コピー対応。登録不要、ブラウザだけで使える。 / Free online dice roller. Roll 1–10 dice with any sides (d4–d100), plus TRPG and Chinchiro modes, classic pipped dice, and copyable history. No sign-up required.';

export const metadata: Metadata = {
  title: '無料サイコロツール（TRPG・チンチロ対応）',
  description: DESC,
  openGraph: {
    title: 'サイコロ | CastKit',
    description: '無料のサイコロツール。TRPG（d4〜d100）・チンチロ・ドット目・履歴コピー対応。登録不要で無料。 / Free online dice roller with TRPG dice sets and a Chinchiro mode.',
    locale: 'ja_JP',
    alternateLocale: 'en_US',
  },
  alternates: pageAlternates('/dice'),
};

const jsonLd = webAppJsonLd({ name: 'サイコロ - CastKit', description: DESC, path: '/dice' });
const breadcrumb = breadcrumbJsonLd('サイコロ', '/dice');

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  );
}
