import type { Metadata } from 'next';
import { pageAlternates, webAppJsonLd, breadcrumbJsonLd } from '../_lib/seo';

const DESC = '無料のスコアボード・得点版ツール。2〜10チームの得点をリアルタイムに管理。+/-ボタン・カスタム加減算・順位表示・並べ替え・アンドゥ対応。7セグ／ミニマル／カードの3デザイン。登録不要、ブラウザだけで使える。配信・ゲームイベントの得点管理に。 / Free live scoreboard for streams and gaming events. Manage 2–10 teams, no sign-up.';

export const metadata: Metadata = {
  title: '無料スコアボード・得点管理ツール',
  description: DESC,
  openGraph: {
    title: 'スコアボード | CastKit',
    description: '無料のスコアボードツール。2〜10チームの得点をリアルタイム管理。登録不要で無料。 / Free live scoreboard — manage team scores in real time.',
    locale: 'ja_JP',
    alternateLocale: 'en_US',
  },
  alternates: pageAlternates('/scoreboard'),
};

const jsonLd = webAppJsonLd({ name: 'スコアボード - CastKit', description: DESC, path: '/scoreboard' });
const breadcrumb = breadcrumbJsonLd('スコアボード', '/scoreboard');

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  );
}
