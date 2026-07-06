import type { Metadata } from 'next';
import { pageAlternates, webAppJsonLd, breadcrumbJsonLd } from '../_lib/seo';

const DESC = '無料のあみだくじツール。参加者と結果を入力するだけで自動生成。登録不要、ブラウザだけで使える。配信・ゲームイベントの役割決めや担当決めに。 / Free ladder lottery (Amida) tool. Auto-generates results from participants. No sign-up required.';

export const metadata: Metadata = {
  title: '無料あみだくじツール｜オンラインで順番・役割決め',
  description: DESC,
  openGraph: {
    title: 'あみだくじ | CastKit',
    description: '無料のあみだくじツール。参加者と結果を入力するだけ。登録不要で無料。 / Free ladder lottery tool — no sign-up needed.',
    locale: 'ja_JP',
    alternateLocale: 'en_US',
  },
  alternates: pageAlternates('/amida'),
};

const jsonLd = webAppJsonLd({ name: 'あみだくじ - CastKit', description: DESC, path: '/amida' });
const breadcrumb = breadcrumbJsonLd('あみだくじ', '/amida');

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  );
}
