'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type Locale, DEFAULT_LOCALE, LOCALES } from './translations';

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
});

const STORAGE_KEY = 'castkit-locale';

/**
 * 言語設定をlocalStorage・URLクエリ(?lang=en)・ブラウザ言語から決定し、
 * アプリ全体に提供するProvider。
 *
 * 優先順位: URLクエリ > localStorage > ブラウザの言語 > 既定(ja)
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const params  = new URLSearchParams(window.location.search);
    const queryLang = params.get('lang');

    let initial: Locale = DEFAULT_LOCALE;

    if (queryLang && LOCALES.includes(queryLang as Locale)) {
      initial = queryLang as Locale;
    } else {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved && LOCALES.includes(saved as Locale)) {
          initial = saved as Locale;
        } else {
          const browserLang = window.navigator.language.slice(0, 2);
          if (LOCALES.includes(browserLang as Locale)) {
            initial = browserLang as Locale;
          }
        }
      } catch {
        // プライベートブラウジング等で localStorage が使えない場合はデフォルトを維持
      }
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSRは常にDEFAULT_LOCALE固定。URL/localStorage/言語はマウント後に反映（ハイドレーション不一致回避）
    setLocaleState(initial);
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage が使えない環境では設定を保存しない
    }
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLocale() {
  return useContext(LanguageContext);
}
