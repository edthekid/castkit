import type { Metadata } from 'next';
import { ContactContent } from './ContactContent';
import { pageAlternates } from '../_lib/seo';

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description: 'CastKit へのお問い合わせ。ご意見・ご要望・不具合のご報告はフォームよりお寄せください。 / Contact CastKit via our form.',
  alternates: pageAlternates('/contact'),
};

export default function ContactPage() {
  return <ContactContent />;
}
