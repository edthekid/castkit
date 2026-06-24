import { articleJsonLd, breadcrumbTrailJsonLd } from '../_lib/seo';
import { getArticleByHref } from '../_lib/articles';

/**
 * 記事ページ用の構造化データ（JSON-LD）を出力するサーバーコンポーネント。
 * - BlogPosting … 記事であることをGoogleに伝える
 * - BreadcrumbList … CastKit > 記事 > 記事名 の階層
 *
 * パンくずの記事名と公開日は app/_lib/articles.ts の共通データから補完するため、
 * 各記事ページは title / description / path を渡すだけでよい。
 */
export function ArticleSchema({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  const meta = getArticleByHref(path);
  const datePublished = meta?.date ?? '2026-06-22';
  const leafName = meta?.tag.ja ?? title;

  const article = articleJsonLd({ title, description, path, datePublished });
  const breadcrumb = breadcrumbTrailJsonLd([
    { name: 'CastKit', path: '' },
    { name: '記事', path: '/articles' },
    { name: leafName, path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  );
}
