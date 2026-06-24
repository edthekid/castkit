'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { DEBATE_TOPICS } from '../_data/debates';
import type { DebateTopic } from '../_data/debates';
import {
  TOPIC_DRAW_MS,
  FACTION_DRAW_MS,
  type DebatePhase,
} from '../_constants';
import { useTranslation } from '../../_i18n/useTranslation';

export interface AssignedFactions {
  player1: { ja: string; en: string };
  player2: { ja: string; en: string };
}

export type TopicMode = 'all' | 'custom-only';

/** "テーマ | 陣営A | 陣営B" 形式の1行をパースする */
function parseCustomLine(line: string, idx: number): DebateTopic | null {
  const trimmed = line.trim();
  if (!trimmed) return null;
  const parts = trimmed.split(',').map((s) => s.trim());
  const theme    = parts[0] ?? '';
  const factionA = parts[1] ?? '';
  const factionB = parts[2] ?? '';
  if (!theme) return null;
  return {
    id: `custom-${idx}`,
    theme:    { ja: theme,    en: theme },
    factionA: { ja: factionA, en: factionA },
    factionB: { ja: factionB, en: factionB },
  };
}

export function useDebate() {
  const { locale } = useTranslation();

  // ─── ゲーム状態 ─────────────────────────────────────
  const [phase, setPhase]       = useState<DebatePhase>('idle');
  const [topic, setTopic]       = useState<DebateTopic | null>(null);
  const [factions, setFactions] = useState<AssignedFactions | null>(null);
  const [timerSec, setTimerSec] = useState<number>(180);
  const [remaining, setRemaining] = useState(0);

  // ─── 設定状態 ────────────────────────────────────────
  const [customTopicsText, setCustomTopicsText] = useState('');
  const [topicMode, setTopicMode]               = useState<TopicMode>('all');
  const [customTimerMin, setCustomTimerMin]      = useState<number | null>(null);

  const topicTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const factionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef     = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAll = useCallback(() => {
    if (topicTimerRef.current)   clearTimeout(topicTimerRef.current);
    if (factionTimerRef.current) clearTimeout(factionTimerRef.current);
    if (intervalRef.current)     clearInterval(intervalRef.current);
  }, []);

  /** パース済みカスタムお題 */
  const customTopics = useMemo<DebateTopic[]>(() => {
    return customTopicsText
      .split('\n')
      .map((line, i) => parseCustomLine(line, i))
      .filter((t): t is DebateTopic => t !== null);
  }, [customTopicsText]);

  /** 実際に抽選するお題プール */
  const topicPool = useMemo<DebateTopic[]>(() => {
    if (topicMode === 'custom-only') return customTopics.length > 0 ? customTopics : DEBATE_TOPICS;
    return [...DEBATE_TOPICS, ...customTopics];
  }, [topicMode, customTopics]);

  const start = useCallback(() => {
    clearAll();
    setPhase('topic-drawing');
    setTopic(null);
    setFactions(null);

    const pool   = topicPool.length > 0 ? topicPool : DEBATE_TOPICS;
    const picked = pool[Math.floor(Math.random() * pool.length)];

    topicTimerRef.current = setTimeout(() => {
      setTopic(picked);
      setPhase('faction-drawing');

      factionTimerRef.current = setTimeout(() => {
        const swap = Math.random() < 0.5;
        setFactions({
          player1: swap ? picked.factionB : picked.factionA,
          player2: swap ? picked.factionA : picked.factionB,
        });
        setPhase('ready');
      }, FACTION_DRAW_MS);
    }, TOPIC_DRAW_MS);
  }, [clearAll, topicPool]);

  const startTimer = useCallback(() => {
    if (phase !== 'ready') return;
    setRemaining(timerSec);
    setPhase('running');
  }, [phase, timerSec]);

  const resetTimer = useCallback(() => {
    clearAll();
    setPhase('ready');
    setRemaining(timerSec);
  }, [clearAll, timerSec]);

  const reset = useCallback(() => {
    clearAll();
    setPhase('idle');
    setTopic(null);
    setFactions(null);
  }, [clearAll]);

  // カウントダウン
  useEffect(() => {
    if (phase !== 'running') return;
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setPhase('done');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [phase]);

  // カスタムタイマーが変わったら timerSec も更新
  useEffect(() => {
    if (customTimerMin !== null) {
      setTimerSec(Math.max(1, customTimerMin) * 60);
    }
  }, [customTimerMin]);

  return {
    locale,
    phase,
    topic,
    factions,
    timerSec,
    setTimerSec,
    remaining,
    // 設定
    customTopicsText,
    setCustomTopicsText,
    topicMode,
    setTopicMode,
    customTimerMin,
    setCustomTimerMin,
    customTopics,
    // アクション
    start,
    startTimer,
    resetTimer,
    reset,
  };
}
