import type { Metadata } from 'next';
import { pageAlternates, webAppJsonLd, breadcrumbJsonLd } from '../_lib/seo';

const DESC = '無料のチーム分け・グループ分けツール。メンバー名を入力するだけで均等なチームをランダムに自動生成。登録不要、ブラウザだけで使える。配信・対戦ゲームのチーム編成に。 / Free team division tool. Auto-generates balanced teams from member names. No sign-up required.';

export const metadata: Metadata = {
  title: '無料チーム分けツール｜ランダム・均等にグループ分け',
  description: DESC,
  openGraph: {
    title: 'チーム分け | CastKit',
    description: 'メンバー名を入力するだけで均等なチームを自動生成。登録不要で無料。 / Free team balancer — no sign-up needed.',
    locale: 'ja_JP',
    alternateLocale: 'en_US',
  },
  alternates: pageAlternates('/team-division'),
};

const jsonLd = webAppJsonLd({ name: 'チーム分け - CastKit', description: DESC, path: '/team-division' });
const breadcrumb = breadcrumbJsonLd('チーム分け', '/team-division');

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  );
}
