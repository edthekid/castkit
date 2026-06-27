'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import type { Rung, TracePath } from '../_constants';
import { DEFAULT_PLAYERS, TRACE_DURATION_MS } from '../_constants';
import { generateRungs, calcAllTracePaths } from '../_utils';
import { useTranslation } from '../../_i18n/useTranslation';

export type Phase = 'input' | 'ready' | 'tracing' | 'done';

// 何人でも同じ長さ・同じ時間になるよう固定行数
const FIXED_ROWS = 20;

function autoResultsText(n: number, wins: number, locale: 'ja' | 'en'): string {
  if (n <= 0) return '';
  const w = Math.min(Math.max(wins, 1), n);
  const win  = locale === 'en' ? 'Win'  : '当たり';
  const lose = locale === 'en' ? 'Lose' : 'はずれ';
  return [...Array(w).fill(win), ...Array(n - w).fill(lose)].join('\n');
}

export function useAmida() {
  const { locale } = useTranslation();

  const [players, setPlayers]            = useState<string[]>(DEFAULT_PLAYERS);
  const [playersText, setPlayersTextRaw] = useState(DEFAULT_PLAYERS.join('\n'));
  const [resultsText, setResultsText]    = useState(() => autoResultsText(DEFAULT_PLAYERS.length, 1, locale));
  const [winCount, setWinCount]          = useState<number>(1);
  const [phase, setPhase]                = useState<Phase>('input');
  const [rungs, setRungs]                = useState<Rung[]>([]);
  const [tracePaths, setTracePaths]      = useState<TracePath[]>([]);
  const [activeSet, setActiveSet]        = useState<Set<number>>(new Set());
  const [doneSet, setDoneSet]            = useState<Set<number>>(new Set());
  const [editingIdx, setEditingIdx]      = useState<number>(-1);
  // scrollTrigger: generateのたびに+1。この値の変化だけが演出スクロールを発火させる
  const [scrollTrigger, setScrollTrigger] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rows = FIXED_ROWS;

  const results = useMemo(
    () => resultsText.split('\n').map((s) => s.trim()).filter(Boolean),
    [resultsText],
  );

  // ─── 参加者テキスト変更 ──────────────────────────────
  const setPlayersText = useCallback((text: string) => {
    setPlayersTextRaw(text);
    const list = text.split('\n').map((s) => s.trim()).filter(Boolean);
    setPlayers((prev) => {
      if (prev.length !== list.length) {
        setResultsText(autoResultsText(list.length, winCount, locale));
      }
      return list;
    });
  }, [winCount, locale]);

  // ─── 当たり数変更 ────────────────────────────────────
  const changeWinCount = useCallback((count: number) => {
    const clamped = Math.min(Math.max(count, 1), players.length);
    setWinCount(clamped);
    setResultsText(autoResultsText(players.length, clamped, locale));
  }, [players.length, locale]);

  // ─── 参加者の入れ替え ────────────────────────────────
  const startEdit = useCallback((idx: number) => {
    setEditingIdx((prev) => (prev === idx ? -1 : idx));
  }, []);

  const updatePlayer = useCallback((idx: number, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setPlayers((prev) => {
      if (prev.some((p, i) => i !== idx && p === trimmed)) return prev;
      const next = [...prev];
      next[idx] = trimmed;
      setPlayersTextRaw(next.join('\n'));
      return next;
    });
    setEditingIdx(-1);
  }, []);

  /** 名前を入れ替え: 色だけリセット・スクロールなし */
  const swapPlayers = useCallback((idxA: number, idxB: number) => {
    setPlayers((prev) => {
      const next = [...prev];
      [next[idxA], next[idxB]] = [next[idxB], next[idxA]];
      setPlayersTextRaw(next.join('\n'));
      return next;
    });
    setEditingIdx(-1);
    setDoneSet(new Set());
    setActiveSet(new Set());
    // phaseはreadyのまま維持（スクロールは発火させない）
  }, []);

  // ─── あみだ生成（演出スクロールあり） ─────────────────
  const generate = useCallback(() => {
    if (players.length < 2) return;
    const n        = players.length;
    const newRungs = generateRungs(n, rows);
    const paths    = calcAllTracePaths(n, newRungs, rows);
    setRungs(newRungs);
    setTracePaths(paths);
    setActiveSet(new Set());
    setDoneSet(new Set());
    setPhase('ready');
    setScrollTrigger((k) => k + 1); // 演出スクロールを発火
  }, [players, rows]);

  // ─── 横棒の引き直し（スクロールなし・色リセット） ───────
  const regenerate = useCallback(() => {
    if (players.length < 2) return;
    const n        = players.length;
    const newRungs = generateRungs(n, rows);
    const paths    = calcAllTracePaths(n, newRungs, rows);
    setRungs(newRungs);
    setTracePaths(paths);
    setActiveSet(new Set());
    setDoneSet(new Set());
    setPhase('ready');
    // scrollTriggerは更新しない → スクロール発火なし
  }, [players, rows]);

  // ─── スタート ────────────────────────────────────────
  const startTrace = useCallback(() => {
    if (tracePaths.length === 0) return;
    setPhase('tracing');
    setDoneSet(new Set());
    setActiveSet(new Set(tracePaths.map((_, i) => i)));
    timerRef.current = setTimeout(() => {
      setActiveSet(new Set());
      setDoneSet(new Set(tracePaths.map((_, i) => i)));
      setPhase('done');
    }, TRACE_DURATION_MS + 200);
  }, [tracePaths]);

  // ─── リセット ────────────────────────────────────────
  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase('input');
    setRungs([]);
    setTracePaths([]);
    setActiveSet(new Set());
    setDoneSet(new Set());
    setEditingIdx(-1);
  }, []);

  const resultMap = useMemo(() => {
    const map: Record<number, string> = {};
    tracePaths.forEach((tp) => {
      map[tp.playerIndex] = results[tp.resultIndex] ?? `結果${tp.resultIndex + 1}`;
    });
    return map;
  }, [tracePaths, results]);

  return {
    playersText, setPlayersText,
    resultsText, setResultsText,
    winCount, changeWinCount,
    players, results, rows,
    editingIdx, startEdit, updatePlayer, swapPlayers,
    phase, rungs, tracePaths,
    activeSet, doneSet, resultMap,
    scrollTrigger,
    generate, regenerate, startTrace, reset,
  };
}
