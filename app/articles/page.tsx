import type { Metadata } from 'next';
import { ArticleList } from './_components/ArticleList';

export const metadata: Metadata = {
  title: '記事一覧',
  description: '配信・ゲームイベントに役立つツール活用ガイドや配信テクニックの記事一覧。チーム分け・ルーレット・あみだくじ・お題ガチャ・ディベートの活用法を解説します。 / Articles on tools and techniques for streaming and gaming events.',
};

export default function ArticlesPage() {
  return <ArticleList />;
}
