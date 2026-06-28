import type { Metadata } from 'next';
import { marked } from 'marked';
import { StaticPageLayout } from '../_components/StaticPageLayout';
import { pageAlternates, breadcrumbJsonLd } from '../_lib/seo';
import { aboutTitle, aboutMeta, aboutBody } from './_content';

export const metadata: Metadata = {
  title: '運営者情報',
  description: 'CastKit の運営者情報。サイトの目的・運営方針（無料・プライバシー重視・日英対応）と運営者について。 / About CastKit — our purpose, how we operate, and who runs the site.',
  alternates: pageAlternates('/about'),
};

const breadcrumb = breadcrumbJsonLd('運営者情報', '/about');

export default async function AboutPage() {
  const bodyHtml = {
    ja: await marked.parse(aboutBody.ja),
    en: await marked.parse(aboutBody.en),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <StaticPageLayout title={aboutTitle} meta={aboutMeta} bodyHtml={bodyHtml} />
    </>
  );
}
