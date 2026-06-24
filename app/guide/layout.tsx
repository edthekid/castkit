import type { Metadata } from 'next';
import { pageAlternates, breadcrumbJsonLd } from '../_lib/seo';

const DESC = 'CastKit の使い方ガイド。チーム分け・ルーレット・あみだくじ・お題ガチャ・ディベートの操作方法を解説。配信や対戦ゲームイベントに活用しよう。';

export const metadata: Metadata = {
  title: '使い方ガイド',
  description: DESC,
  openGraph: {
    title: '使い方ガイド | CastKit',
    description: 'CastKit 各ツールの使い方を解説。登録不要、ブラウザだけで使える無料ツール集。',
  },
  alternates: pageAlternates('/guide'),
};

const breadcrumb = breadcrumbJsonLd('使い方ガイド', '/guide');

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  );
}
