import type { Metadata } from 'next';
import { pageAlternates, webAppJsonLd, breadcrumbJsonLd } from '../_lib/seo';

const DESC = '無料のタイマーツール。カウントダウンタイマー・ストップウォッチ・指定時刻までのカウントダウン・ポモドーロタイマーを1つに。全画面表示（配信の待機画面用）・通知音・ラップ計測に対応、登録不要でブラウザ内完結。 / Free online timer with countdown, stopwatch, a countdown to a target time, and a Pomodoro timer. Fullscreen display for streams, alarm sound, and lap timing. No sign-up.';

export const metadata: Metadata = {
  title: '無料タイマー（カウントダウン・ストップウォッチ・ポモドーロ）',
  description: DESC,
  openGraph: {
    title: 'タイマー | CastKit',
    description: '無料のタイマーツール。カウントダウン・ストップウォッチ・指定時刻まで・ポモドーロの4モード。全画面表示・通知音対応で登録不要。 / Free online timer — countdown, stopwatch, countdown to a time, and Pomodoro.',
    locale: 'ja_JP',
    alternateLocale: 'en_US',
  },
  alternates: pageAlternates('/timer'),
};

const jsonLd = webAppJsonLd({ name: 'タイマー - CastKit', description: DESC, path: '/timer' });
const breadcrumb = breadcrumbJsonLd('タイマー', '/timer');

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  );
}
