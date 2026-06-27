import type { Metadata } from 'next';
import { ArticleList } from './_components/ArticleList';
import { pageAlternates, breadcrumbJsonLd } from '../_lib/seo';

export const metadata: Metadata = {
  title: '記事一覧',
  description: '配信・ゲームイベントに役立つツール活用ガイドや配信テクニックの記事一覧。チーム分け・ルーレット・あみだくじ・お題ガチャ・ディベートの活用法を解説します。 / Articles on tools and techniques for streaming and gaming events.',
  alternates: pageAlternates('/articles'),
};

const breadcrumb = breadcrumbJsonLd('記事', '/articles');

export default function ArticlesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <ArticleList />
    </>
  );
}
