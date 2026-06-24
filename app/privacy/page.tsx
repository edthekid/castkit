import type { Metadata } from 'next';
import { marked } from 'marked';
import { StaticPageLayout } from '../_components/StaticPageLayout';
import { pageAlternates } from '../_lib/seo';
import { privacyTitle, privacyMeta, privacyBody } from './_content';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: 'CastKit のプライバシーポリシー。広告（Google AdSense）・アクセス解析のCookie利用、情報の取り扱いについて。 / CastKit Privacy Policy — cookies, advertising, and analytics.',
  alternates: pageAlternates('/privacy'),
};

export default async function PrivacyPage() {
  const bodyHtml = {
    ja: await marked.parse(privacyBody.ja),
    en: await marked.parse(privacyBody.en),
  };

  return <StaticPageLayout title={privacyTitle} meta={privacyMeta} bodyHtml={bodyHtml} />;
}
