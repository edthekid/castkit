'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { useTranslation } from '../../_i18n/useTranslation';
import {
  type DiceMode,
  type RollPhase,
  type DieResult,
  type RollRecord,
  MIN_DICE,
  MAX_DICE,
  D100,
  MAX_HISTORY,
  ROLL_DURATION_MS,
  STORAGE_KEY,
  DEFAULT_COLOR,
} from '../_constants';
import { notation, rollOne, formatRoll } from '../_utils';

interface PersistedState {
  mode: DiceMode;
  count: number;
  sides: number;
  color: string;
  history: RollRecord[];
}

const clampCount = (n: number) => Math.max(MIN_DICE, Math.min(MAX_DICE, n));

export function useDice() {
  const { t } = useTranslation();

  // ─── 設定（SSR と一致させるため初期値は固定） ───────────
  const [mode, setModeState] = useState<DiceMode>('basic');
  const [count, setCount]    = useState(2);
  const [sides, setSides]    = useState(6);
  const [color, setColor]    = useState<string>(DEFAULT_COLOR);

  // ─── ロール状態 ─────────────────────────────────────────
  const [phase, setPhase]     = useState<RollPhase>('idle');
  const [current, setCurrent] = useState<RollRecord | null>(null);
  const [history, setHistory] = useState<RollRecord[]>([]);
  // 物理演算の再生をやり直すためのキー（roll ごとに +1）。
  const [rollKey, setRollKey] = useState(0);
  // 3D描画に渡す、確定前の出目（roll 時に決まる目標値）。
  const [activeRoll, setActiveRoll] = useState<{ values: number[]; sides: number } | null>(null);

  const [hydrated, setHydrated] = useState(false);

  // 静止待ちの出目（reveal で確定させる）。描画（DiceCanvas）はこれを目標値に使う。
  const pendingRef = useRef<DieResult[] | null>(null);
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idRef      = useRef(0);

  const isD100 = mode === 'trpg' && sides === D100;

  // ─── 読み込み（マウント後） ─────────────────────────────
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<PersistedState>;
        if (saved.mode === 'basic' || saved.mode === 'trpg') setModeState(saved.mode);
        if (typeof saved.count === 'number') setCount(clampCount(saved.count));
        if (typeof saved.sides === 'number' && saved.sides >= 2) setSides(saved.sides);
        if (typeof saved.color === 'string') setColor(saved.color);
        if (Array.isArray(saved.history)) setHistory(saved.history.slice(0, MAX_HISTORY));
      }
    } catch {
      // 破損データは無視
    }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // ─── 保存 ───────────────────────────────────────────────
  useEffect(() => {
    if (!hydrated) return;
    try {
      const payload: PersistedState = { mode, count, sides, color, history };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // 容量超過などは無視
    }
  }, [hydrated, mode, count, sides, color, history]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  // ─── 設定変更 ───────────────────────────────────────────
  // モード切替時、面数がそのモードで無効ならフォールバックさせる。
  const setMode = useCallback((next: DiceMode) => {
    setModeState(next);
    if (next === 'basic') {
      setSides((s) => (s === D100 ? 20 : s));
    }
  }, []);

  const incDie = useCallback(() => setCount((c) => clampCount(c + 1)), []);
  const decDie = useCallback(() => setCount((c) => clampCount(c - 1)), []);

  // ─── 出目の確定（静止後に呼ぶ） ─────────────────────────
  const reveal = useCallback(() => {
    const pending = pendingRef.current;
    if (!pending) return;
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    pendingRef.current = null;

    const values = pending.map((d) => d.value);
    const total  = values.reduce((a, b) => a + b, 0);
    const record: RollRecord = {
      id: `roll-${Date.now()}-${idRef.current++}`,
      notation: notation(pending.length, pending[0]?.sides ?? sides),
      values,
      total,
      sides: pending[0]?.sides ?? sides,
      count: pending.length,
      isD100: (pending[0]?.sides ?? sides) === D100,
    };
    setCurrent(record);
    setHistory((prev) => [record, ...prev].slice(0, MAX_HISTORY));
    setPhase('result');
  }, [sides]);

  // ─── ロール開始 ─────────────────────────────────────────
  const roll = useCallback(() => {
    if (phase === 'rolling') return;
    if (timerRef.current) clearTimeout(timerRef.current);

    const values: DieResult[] = Array.from({ length: count }, () => ({
      sides,
      value: rollOne(sides),
    }));
    pendingRef.current = values;
    setActiveRoll({ values: values.map((d) => d.value), sides });
    setPhase('rolling');
    setRollKey((k) => k + 1);

    // セーフティ：物理側の settle 通知が来なくてもこの時間で必ず確定する。
    timerRef.current = setTimeout(() => reveal(), ROLL_DURATION_MS);
  }, [phase, count, sides, reveal]);

  // ─── 履歴 ───────────────────────────────────────────────
  const clearHistory = useCallback(() => {
    if (history.length === 0) return;
    setHistory([]);
    toast.success(t('dice.toast.cleared'));
  }, [history.length, t]);

  const copyText = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(t('dice.toast.copied')))
      .catch(() => toast.error(t('dice.toast.copyFailed')));
  }, [t]);

  const copyRecord = useCallback((record: RollRecord) => {
    copyText(formatRoll(record));
  }, [copyText]);

  return {
    // 設定
    mode, setMode,
    count, setCount, incDie, decDie,
    sides, setSides,
    color, setColor,
    isD100,
    // ロール
    phase,
    current,
    rollKey,
    activeRoll,
    roll,
    reveal,
    getPending: () => pendingRef.current,
    // 履歴
    history,
    clearHistory,
    copyRecord,
  };
}
