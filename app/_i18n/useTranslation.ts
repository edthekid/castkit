'use client';

import { useLocale } from './LanguageContext';
import { translations, type TranslationKey } from './translations';

/**
 * 現在の言語設定に応じて翻訳文字列を返すフック。
 *
 * 使い方:
 *   const { t } = useTranslation();
 *   t('common.obsCopyButton')                  // → "OBS用URLをコピー" / "Copy OBS URL"
 *   t('memberInput.count', { count: 5 })       // → "現在 5 人" / "5 members"
 *
 * キーは "section.key" 形式のフラットなドット区切り（translations.ts参照）。
 * `{name}` 形式のプレースホルダーをvarsで置換する。
 */
export function useTranslation() {
  const { locale, setLocale } = useLocale();

  const t = (key: TranslationKey, vars?: Record<string, string | number>): string => {
    let text: string = translations[locale][key] ?? translations.ja[key] ?? key;

    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      }
    }
    return text;
  };

  return { t, locale, setLocale };
}
