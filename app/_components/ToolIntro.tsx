'use client';

import { usePathname } from 'next/navigation';
import { useTranslation } from '../_i18n/useTranslation';
import { getToolIntro } from '../_lib/toolIntro';

/**
 * 各ツールページ下部に「概要＋使い方＋活用シーン」を表示する共通セクション。
 * - ねらい：ツールURL単体に読み物としての本文を持たせ、検索・広告審査での独自価値を明確にする
 * - 内容は app/_lib/toolIntro.ts からパスに応じて取得する
 *
 * 現在のパスに対応する内容が無ければ何も描画しない。
 */
export function ToolIntro() {
  const pathname = usePathname();
  const { locale } = useTranslation();
  const intro = getToolIntro(pathname);
  if (!intro) return null;

  const labels = {
    overview: locale === 'ja' ? '概要' : 'Overview',
    steps: locale === 'ja' ? '使い方' : 'How to use',
    useCases: locale === 'ja' ? '活用シーン' : 'Use cases',
    faq: locale === 'ja' ? 'よくある質問' : 'FAQ',
  };

  const sectionLabelClass = 'ck-eyebrow mb-2';

  return (
    <section className="mt-16 pt-10 border-t border-ck-line">
      {/* 概要 */}
      <div className="mb-8">
        <h2 className={sectionLabelClass}>{labels.overview}</h2>
        <p className="text-sm leading-relaxed text-ck-ink">
          {intro.overview[locale]}
        </p>
      </div>

      {/* 使い方 */}
      <div className="mb-8">
        <h2 className={sectionLabelClass}>{labels.steps}</h2>
        <ol className="flex flex-col gap-2">
          {intro.steps[locale].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-black text-ck-subtle border border-ck-line"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <span className="text-sm leading-relaxed text-ck-ink">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* 活用シーン */}
      <div className="mb-8">
        <h2 className={sectionLabelClass}>{labels.useCases}</h2>
        <ul className="flex flex-col gap-1.5">
          {intro.useCases[locale].map((useCase, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-ck-ink">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ck-subtle" aria-hidden="true" />
              <span>{useCase}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* よくある質問 */}
      <div>
        <h2 className={sectionLabelClass}>{labels.faq}</h2>
        <dl className="flex flex-col gap-5">
          {intro.faq.map((item, i) => (
            <div key={i}>
              <dt className="text-sm font-bold text-ck-ink mb-1">{item.q[locale]}</dt>
              <dd className="text-sm leading-relaxed text-ck-ink">{item.a[locale]}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
