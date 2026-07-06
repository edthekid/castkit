import type { Metadata } from 'next';
import { pageAlternates, webAppJsonLd, breadcrumbJsonLd } from '../_lib/seo';

const DESC = '無料のルーレット抽選ツール。ルーレット・スロットの2モード搭載。名前を入力してランダム抽選。登録不要、ブラウザだけで使える。ライブ配信・対戦ゲームの司会進行に。 / Free random picker with Wheel and Slot modes. No sign-up required.';

export const metadata: Metadata = {
  title: '無料ルーレット抽選ツール｜ライブ配信の視聴者参加抽選に',
  description: DESC,
  openGraph: {
    title: 'ルーレット | CastKit',
    description: '無料のルーレット抽選ツール。ルーレット・スロットの2モード搭載。登録不要で無料。 / Free random picker — Wheel and Slot modes.',
    locale: 'ja_JP',
    alternateLocale: 'en_US',
  },
  alternates: pageAlternates('/roulette'),
};

const jsonLd = webAppJsonLd({ name: 'ルーレット - CastKit', description: DESC, path: '/roulette' });
const breadcrumb = breadcrumbJsonLd('ルーレット', '/roulette');

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  );
}
