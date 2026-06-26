export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cast-kit.com';

/** canonical + hreflang を生成するヘルパー */
export function pageAlternates(path: string) {
  const url = `${SITE_URL}${path}`;
  return {
    canonical: url,
    languages: {
      'ja': url,
      'en': url,
      'x-default': url,
    },
  };
}

/** WebSite JSON-LD スキーマ（サイト全体用） */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CastKit',
    url: SITE_URL,
    description: '配信・ゲームイベント支援ツール集',
    inLanguage: ['ja', 'en'],
  };
}

/** WebApplication JSON-LD スキーマを生成するヘルパー */
export function webAppJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url: `${SITE_URL}${path}`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
    },
    inLanguage: ['ja', 'en'],
    isPartOf: {
      '@type': 'WebSite',
      name: 'CastKit',
      url: SITE_URL,
    },
  };
}

/** BreadcrumbList JSON-LD スキーマを生成するヘルパー（2階層: CastKit > ページ） */
export function breadcrumbJsonLd(pageName: string, pagePath: string) {
  return breadcrumbTrailJsonLd([
    { name: 'CastKit', path: '' },
    { name: pageName, path: pagePath },
  ]);
}

/** 任意階層の BreadcrumbList JSON-LD（例: CastKit > 記事 > 記事タイトル） */
export function breadcrumbTrailJsonLd(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/** BlogPosting JSON-LD スキーマを生成するヘルパー（記事用） */
export function articleJsonLd({
  title,
  description,
  path,
  datePublished,
}: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
}) {
  const url = `${SITE_URL}${path}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished,
    dateModified: datePublished,
    inLanguage: ['ja', 'en'],
    author: { '@type': 'Organization', name: 'CastKit', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'CastKit', url: SITE_URL },
  };
}
