import type { Metadata } from 'next';
import { pageAlternates, webAppJsonLd, breadcrumbJsonLd } from '../_lib/seo';

const DESC = '無料のサイコロツール。1〜10個・面数自由（d4/d6/d8/d10/d12/d20/d100）。TRPGモード＆3D物理演算でリアルに転がる。1〜6はドット目のオーソドックスな白サイコロ。履歴コピー対応。登録不要、ブラウザだけで使える。 / Free 3D dice roller with realistic physics. TRPG dice sets (d4–d100), classic pipped dice, and copyable history. No sign-up required.';

export const metadata: Metadata = {
  title: '無料サイコロツール（3D物理演算・TRPG対応）',
  description: DESC,
  openGraph: {
    title: 'サイコロ | CastKit',
    description: '無料のサイコロツール。3D物理演算でリアルに転がる。TRPG（d4〜d100）・ドット目・履歴コピー対応。登録不要で無料。 / Free 3D dice roller with realistic physics and TRPG dice sets.',
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
