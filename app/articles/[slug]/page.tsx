import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { marked } from 'marked';
import { ARTICLES, getArticleBySlug } from '../../_lib/articles';
import { ArticleLayout } from '../../_components/ArticleLayout';
import { ArticleSchema } from '../../_components/ArticleSchema';

/** 全記事を静的生成する */
export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title.ja,
    description: `${article.description.ja} / ${article.description.en}`,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  // Markdown はビルド時にサーバー側でHTMLへ変換（クライアントにmarkedを送らない）
  const bodyHtml = {
    ja: await marked.parse(article.body.ja),
    en: await marked.parse(article.body.en),
  };

  const metaDescription = `${article.description.ja} / ${article.description.en}`;

  return (
    <>
      <ArticleSchema title={article.title.ja} description={metaDescription} path={article.href} />
      <ArticleLayout article={article} bodyHtml={bodyHtml} />
    </>
  );
}
