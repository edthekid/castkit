import type { Metadata } from 'next';
import { pageAlternates, webAppJsonLd, breadcrumbJsonLd } from '../_lib/seo';

const DESC = '無料のサイコロツール。基本はd6を1〜10個、TRPGはd4〜d100のダイスセット、チンチロにも対応。d4/d8/d10/d12/d20は本物の多面体で3D物理演算、1d100は2つのd10方式。履歴コピー対応・登録不要。 / Free online dice roller. 1–10 d6 in Basic, TRPG dice sets (d4–d100) with real 3D polyhedra and a two-d10 percentile, plus a Chinchiro mode. Copyable history, no sign-up.';

export const metadata: Metadata = {
  title: '無料サイコロツール｜オンラインでダイスを振る（TRPG・チンチロ）',
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
