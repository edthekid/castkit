'use client';

import { useTranslation } from '../_i18n/useTranslation';
import { CONTACT_FORM_URL } from '../_lib/site';

const TEXT = {
  ja: {
    title: 'お問い合わせ',
    lead: 'ご意見・ご要望・不具合のご報告は、下記のフォームよりお寄せください。いただいた内容はサイトの改善に活用させていただきます。',
    button: 'お問い合わせフォームを開く',
    note: '※ Googleフォームが開きます。返信をご希望の場合のみ、メールアドレスをご記入ください（任意）。',
  },
  en: {
    title: 'Contact',
    lead: 'For feedback, requests, or bug reports, please use the form below. Your input helps us improve the site.',
    button: 'Open the contact form',
    note: '* Opens a Google Form. Enter your email address only if you want a reply (optional).',
  },
};

export function ContactContent() {
  const { locale } = useTranslation();
  const t = TEXT[locale];

  return (
    <div className="max-w-2xl mx-auto py-4">
      <h1 className="text-2xl sm:text-3xl font-black mb-3 text-ck-ink">{t.title}</h1>
      <p className="text-sm leading-relaxed mb-6 text-ck-body">{t.lead}</p>

      <a
        href={CONTACT_FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-3 font-black text-sm bg-ck-ink text-white transition-opacity hover:opacity-80"
      >
        {t.button} →
      </a>

      <p className="text-xs text-ck-muted mt-4 leading-relaxed">{t.note}</p>
    </div>
  );
}
