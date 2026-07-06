import type { Metadata } from 'next';
import { pageAlternates, webAppJsonLd, breadcrumbJsonLd } from '../_lib/seo';

const DESC = '無料の雑談お題ガチャ。配信の雑談コーナーで使えるお題をランダム抽選。カテゴリ別絞り込み・カスタムお題に対応。登録不要、ブラウザだけで使える。 / Free random topic picker for streaming. Category filter and custom topics supported. No sign-up required.';

export const metadata: Metadata = {
  title: '無料お題ガチャ｜雑談配信の話のネタをランダム抽選',
  description: DESC,
  openGraph: {
    title: 'お題ガチャ | CastKit',
    description: '無料の雑談お題ガチャ。カテゴリ別絞り込み・カスタムお題に対応。登録不要で無料。 / Free random topic picker — no sign-up needed.',
    locale: 'ja_JP',
    alternateLocale: 'en_US',
  },
  alternates: pageAlternates('/topic'),
};

const jsonLd = webAppJsonLd({ name: 'お題ガチャ - CastKit', description: DESC, path: '/topic' });
const breadcrumb = breadcrumbJsonLd('お題ガチャ', '/topic');

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  );
}
