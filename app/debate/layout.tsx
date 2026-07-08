import type { Metadata } from 'next';
import { pageAlternates, webAppJsonLd, breadcrumbJsonLd, toolFaqJsonLd } from '../_lib/seo';

const DESC = '無料のディベートツール。お題と賛成・反対の陣営をランダム決定、カウントダウンタイマー付き。登録不要、ブラウザだけで使える。配信・グループゲームに。 / Free debate tool with random topic and faction assignment and countdown timer. No sign-up required.';

export const metadata: Metadata = {
  title: '無料ディベートツール｜お題・賛成反対をランダム決定',
  description: DESC,
  openGraph: {
    title: 'ディベート | CastKit',
    description: '無料のディベートツール。お題と陣営をランダム決定、タイマー付き。登録不要で無料。 / Free debate tool with timer — no sign-up needed.',
    locale: 'ja_JP',
    alternateLocale: 'en_US',
  },
  alternates: pageAlternates('/debate'),
};

const jsonLd = webAppJsonLd({ name: 'ディベート - CastKit', description: DESC, path: '/debate' });
const breadcrumb = breadcrumbJsonLd('ディベート', '/debate');
const faq = toolFaqJsonLd('/debate');

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {faq && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />}
      {children}
    </>
  );
}
