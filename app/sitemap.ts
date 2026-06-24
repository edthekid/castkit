import type { MetadataRoute } from 'next';
import { SITE_URL } from './_lib/seo';
import { ARTICLES } from './_lib/articles';

const LAUNCH_DATE = new Date('2026-06-22');

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: LAUNCH_DATE, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/team-division`, lastModified: LAUNCH_DATE, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/roulette`, lastModified: LAUNCH_DATE, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/amida`, lastModified: LAUNCH_DATE, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/topic`, lastModified: LAUNCH_DATE, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/debate`, lastModified: LAUNCH_DATE, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/guide`, lastModified: LAUNCH_DATE, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/articles`, lastModified: LAUNCH_DATE, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/privacy`, lastModified: LAUNCH_DATE, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/contact`, lastModified: LAUNCH_DATE, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // 記事は ARTICLES から自動生成（記事追加時にここを触る必要はない）
  const articlePages: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: `${SITE_URL}${a.href}`,
    lastModified: new Date(a.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...articlePages];
}
