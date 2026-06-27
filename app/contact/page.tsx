import type { Metadata } from 'next';
import { ContactContent } from './ContactContent';
import { pageAlternates, breadcrumbJsonLd } from '../_lib/seo';

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description: 'CastKit へのお問い合わせ。ご意見・ご要望・不具合のご報告はフォームよりお寄せください。 / Contact CastKit via our form.',
  alternates: pageAlternates('/contact'),
};

const breadcrumb = breadcrumbJsonLd('お問い合わせ', '/contact');

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <ContactContent />
    </>
  );
}
