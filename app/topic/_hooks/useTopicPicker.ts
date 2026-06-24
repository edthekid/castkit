'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import { TOPIC_CATEGORIES } from '../_data/topics';
import { DRAW_DURATION_MS, MAX_HISTORY } from '../_constants';
import type { TopicPhase } from '../_constants';
import { useTranslation } from '../../_i18n/useTranslation';

export type TopicMode = 'all' | 'custom-only';

export interface TopicHistoryItem {
  id: number;
  text: string;
  categoryId: string;
  categoryIcon: string;
}

export function useTopicPicker() {
  const { locale } = useTranslation();

  // カテゴリフィルタ
  const [activeCategoryIds, setActiveCategoryIds] = useState<Set<string>>(new Set());
  const [phase, setPhase]   = useState<TopicPhase>('idle');
  const [current, setCurrent] = useState<TopicHistoryItem | null>(null);
  const [history, setHistory] = useState<TopicHistoryItem[]>([]);
  const [drawKey, setDrawKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idRef = useRef(0);

  // カスタムお題
  const [customTopicsText, setCustomTopicsText] = useState('');
  const [topicMode, setTopicMode] = useState<TopicMode>('all');

  const customTopics = useMemo(() => {
    return customTopicsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  }, [customTopicsText]);

  /** 対象となるカテゴリ（未選択時は全カテゴリ） */
  const targetCategories = useMemo(() => {
    if (activeCategoryIds.size === 0) return TOPIC_CATEGORIES;
    return TOPIC_CATEGORIES.filter((c) => activeCategoryIds.has(c.id));
  }, [activeCategoryIds]);

  /** 抽選プール（フラットなテキスト配列） */
  const topicPool = useMemo(() => {
    const custom = customTopics.map((text) => ({
      text,
      categoryId: 'custom',
      categoryIcon: '',
    }));
    if (topicMode === 'custom-only') {
      return custom;
    }
    const defaults = targetCategories.flatMap((cat) =>
      cat.topics.map((t) => ({
        text: t[locale],
        categoryId: cat.id,
        categoryIcon: cat.icon,
      })),
    );
    return [...defaults, ...custom];
  }, [topicMode, customTopics, targetCategories, locale]);

  const totalTopicCount = topicPool.length;

  const toggleCategory = useCallback((id: string) => {
    setActiveCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearCategoryFilter = useCallback(() => {
    setActiveCategoryIds(new Set());
  }, []);

  const draw = useCallback(() => {
    if (totalTopicCount === 0 || phase === 'drawing') return;
    if (timerRef.current) clearTimeout(timerRef.current);

    setPhase('drawing');
    setDrawKey((k) => k + 1);

    const picked = topicPool[Math.floor(Math.random() * topicPool.length)];

    timerRef.current = setTimeout(() => {
      const item: TopicHistoryItem = {
        id: idRef.current++,
        text: picked.text,
        categoryId: picked.categoryId,
        categoryIcon: picked.categoryIcon,
      };
      setCurrent(item);
      setHistory((prev) => [item, ...prev].slice(0, MAX_HISTORY));
      setPhase('result');
    }, DRAW_DURATION_MS);
  }, [topicPool, totalTopicCount, phase]);

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase('idle');
    setCurrent(null);
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  return {
    categories: TOPIC_CATEGORIES,
    activeCategoryIds,
    toggleCategory,
    clearCategoryFilter,
    totalTopicCount,
    phase,
    current,
    history,
    drawKey,
    draw,
    reset,
    clearHistory,
    // カスタム設定
    customTopicsText,
    setCustomTopicsText,
    customTopics,
    topicMode,
    setTopicMode,
    // シャッフル演出用プール
    shufflePool: topicPool.map((t) => t.text),
  };
}
