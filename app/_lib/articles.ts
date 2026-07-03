/**
 * 記事の単一ソース（索引）。
 * 記事を追加するには app/_lib/articles/<slug>.ts を作成し、ここで import して
 * ARTICLES 配列に並べるだけ。ページ・一覧・サイトマップ・JSON-LD が自動生成される。
 */
import type { Article } from './articles/_types';
import { teamDivision } from './articles/team-division';
import { roulette } from './articles/roulette';
import { amida } from './articles/amida';
import { topicPicker } from './articles/topic-picker';
import { conversationStarters } from './articles/conversation-starters';
import { debate } from './articles/debate';
import { scoreboard } from './articles/scoreboard';
import { dice } from './articles/dice';

export type { Article, ArticleInput } from './articles/_types';

/** 一覧などでの表示順（先頭が新着扱い） */
export const ARTICLES: Article[] = [dice, conversationStarters, scoreboard, teamDivision, roulette, amida, topicPicker, debate].map((a) => ({
  ...a,
  href: `/articles/${a.slug}`,
}));

/** スラッグから記事を取得（動的ルート用） */
export const getArticleBySlug = (slug: string): Article | undefined =>
  ARTICLES.find((a) => a.slug === slug);

/** 記事URLから記事を取得（JSON-LD等） */
export const getArticleByHref = (href: string): Article | undefined =>
  ARTICLES.find((a) => a.href === href);

/** ツールURLから対応する記事を取得（ツール→記事リンク用） */
export const getArticleByToolHref = (toolHref: string): Article | undefined =>
  ARTICLES.find((a) => a.toolHref === toolHref);
