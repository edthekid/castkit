import type { MetadataRoute } from 'next';
import { SITE_URL } from './_lib/seo';
import { ARTICLES } from './_lib/articles';

type ChangeFrequency = MetadataRoute.Sitemap[number]['changeFrequency'];

/**
 * 静的ページの一覧と個別の更新日（YYYY-MM-DD）。
 * ページの内容を更新したら、その行の `updated` を実日付に変えること。
 * 記事は ARTICLES から自動生成するのでここには含めない。
 * `/articles`（一覧）は最新記事の日付を自動反映する（下の sitemap() を参照）。
 */
const STATIC_PAGES: { path: string; updated: string; changeFrequency: ChangeFrequency; priority: number }[] = [
  { path: '',               updated: '2026-06-22', changeFrequency: 'monthly', priority: 1 },
  { path: '/team-division', updated: '2026-06-22', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/roulette',      updated: '2026-06-22', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/amida',         updated: '2026-06-22', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/topic',         updated: '2026-06-22', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/debate',        updated: '2026-06-22', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/scoreboard',    updated: '2026-06-28', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/guide',         updated: '2026-06-22', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/articles',      updated: '2026-06-22', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/privacy',       updated: '2026-06-22', changeFrequency: 'yearly',  priority: 0.3 },
  { path: '/contact',       updated: '2026-06-22', changeFrequency: 'yearly',  priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // /articles 一覧は最新記事の日付で自動更新（記事追加時の更新漏れを防ぐ）
  const latestArticleDate = ARTICLES.reduce((max, a) => (a.date > max ? a.date : max), '2026-06-22');

  const staticPages: MetadataRoute.Sitemap = STATIC_PAGES.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: new Date(p.path === '/articles' ? latestArticleDate : p.updated),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  // 記事は ARTICLES から自動生成（記事追加時にここを触る必要はない）
  const articlePages: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: `${SITE_URL}${a.href}`,
    lastModified: new Date(a.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...articlePages];
}
