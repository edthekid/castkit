/**
 * ツール導線カードの単一ソース。
 * ホーム（featured）と RelatedTools（compact）が同じ一覧・同じ翻訳キーを参照し、
 * カードの二重定義を無くす。ナビ（AppShell）は home/guide 等を含む別構成なので分離している。
 */
import type { ComponentType, SVGProps } from 'react';
import { IconBolt, IconTarget, IconLadder, IconChat, IconScales, IconTrophy, IconDice, IconTimer } from './icons';
import type { TranslationKey } from '../_i18n/translations';

export interface ToolCardData {
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  /** カード上部の英字ラベル（eyebrow）。ブランド識別用に固定。 */
  tag: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
}

export const TOOL_CARDS: ToolCardData[] = [
  { href: '/team-division', icon: IconBolt,   tag: 'Team Division', titleKey: 'home.teamDivision.title', descKey: 'home.teamDivision.description' },
  { href: '/roulette',      icon: IconTarget, tag: 'Roulette',      titleKey: 'home.roulette.title',      descKey: 'home.roulette.description' },
  { href: '/amida',         icon: IconLadder, tag: 'Amida',         titleKey: 'home.amida.title',         descKey: 'home.amida.description' },
  { href: '/topic',         icon: IconChat,   tag: 'Topic',         titleKey: 'home.topic.title',         descKey: 'home.topic.description' },
  { href: '/debate',        icon: IconScales, tag: 'Debate',        titleKey: 'home.debate.title',        descKey: 'home.debate.description' },
  { href: '/scoreboard',    icon: IconTrophy, tag: 'Scoreboard',    titleKey: 'home.scoreboard.title',    descKey: 'home.scoreboard.description' },
  { href: '/dice',          icon: IconDice,   tag: 'Dice',          titleKey: 'home.dice.title',          descKey: 'home.dice.description' },
  { href: '/timer',         icon: IconTimer,  tag: 'Timer',         titleKey: 'home.timer.title',         descKey: 'home.timer.description' },
];
