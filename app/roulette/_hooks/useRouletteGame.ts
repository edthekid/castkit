'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { DEFAULT_ITEMS } from '../_constants';
import { calcWinnerIdx, easeOutElastic } from '../_utils';
import type { DesignType } from '../_constants';

export function useRouletteGame() {
  // ─── State ──────────────────────────────────────────────
  const [inputText, setInputText]             = useState(DEFAULT_ITEMS.join('\n'));
  const [selectedHistory, setSelectedHistory] = useState<string[]>([]);
  const [autoMove, setAutoMove]               = useState(true);
  const [isSpinning, setIsSpinning]           = useState(false);
  const [rotation, setRotation]               = useState(0);
  const [winner, setWinner]                   = useState<string | null>(null);
  const [animKey, setAnimKey]                 = useState(0);
  const [emptyError, setEmptyError]           = useState(false);
  const [bounceKey, setBounceKey]             = useState(0);
  const [design, setDesign]                   = useState<DesignType>(1);
  const [slotTriggerKey, setSlotTriggerKey]   = useState(0);
  const [slotWinnerIdx, setSlotWinnerIdx]     = useState(-1);

  // ─── Refs ───────────────────────────────────────────────
  const svgRef         = useRef<SVGSVGElement>(null);
  const rafRef         = useRef<number | null>(null);
  const startTimeRef   = useRef<number>(0);
  const durationRef    = useRef<number>(5000);
  const lastSliceRef   = useRef<number>(-1);

  // ─── 候補者リスト（メモ化） ──────────────────────────────
  const currentItems = useMemo(
    () => inputText.split('\n').map((s) => s.trim()).filter(Boolean),
    [inputText],
  );

  // ─── クリーンアップ ──────────────────────────────────────
  useEffect(() => {
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  // ─── スタート ────────────────────────────────────────────
  const startDraw = useCallback(() => {
    if (isSpinning) return;

    // 前回の当選者を履歴へ移動
    let spinItems = currentItems;
    if (autoMove && winner !== null) {
      const winnerIdx = currentItems.findIndex((item) => item === winner);
      if (winnerIdx !== -1) {
        const nextItems = currentItems.filter((_, i) => i !== winnerIdx);
        setSelectedHistory((prev) => [winner, ...prev]);
        setInputText(nextItems.join('\n'));
        spinItems = nextItems;
      }
    }

    if (spinItems.length === 0) {
      setEmptyError(true);
      setTimeout(() => setEmptyError(false), 2500);
      return;
    }

    setEmptyError(false);
    setIsSpinning(true);
    setWinner(null);
    setSlotWinnerIdx(-1);
    lastSliceRef.current = -1;

    if (design === 1) {
      // ── ホイールアニメーション ──
      const totalSpin = (5 + Math.floor(Math.random() * 3)) * 360 + Math.floor(Math.random() * 360);
      const start  = rotation;
      const target = rotation + totalSpin;
      startTimeRef.current = performance.now();
      durationRef.current  = 5000 + Math.random() * 1500;

      const tick = (now: number) => {
        const elapsed = now - startTimeRef.current;
        const t = Math.min(elapsed / durationRef.current, 1);
        const eased = easeOutElastic(t);
        const currentAngle = start + (target - start) * eased;

        if (svgRef.current) svgRef.current.style.transform = `rotate(${currentAngle}deg)`;

        // スライス境界通過で針をバウンス
        if (spinItems.length > 1) {
          const slice = 360 / spinItems.length;
          const norm = ((currentAngle % 360) + 360) % 360;
          const cs = Math.floor(((90 - norm + 360) % 360) / slice);
          if (cs !== lastSliceRef.current && lastSliceRef.current !== -1) setBounceKey((k) => k + 1);
          lastSliceRef.current = cs;
        }

        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setRotation(target);
          setWinner(spinItems[calcWinnerIdx(target, spinItems.length)]);
          setAnimKey((k) => k + 1);
          setIsSpinning(false);
        }
      };
      rafRef.current = requestAnimationFrame(tick);

    } else {
      // ── スロットアニメーション ──
      const idx = Math.floor(Math.random() * spinItems.length);
      setSlotWinnerIdx(idx);
      setSlotTriggerKey((k) => k + 1);
      const duration = 5200 + Math.random() * 1000;
      setTimeout(() => {
        setWinner(spinItems[idx]);
        setAnimKey((k) => k + 1);
        setIsSpinning(false);
      }, duration);
    }
  }, [currentItems, isSpinning, rotation, autoMove, winner, design]);

  // ─── デザイン切り替え ────────────────────────────────────
  const handleDesignChange = useCallback((d: DesignType) => {
    if (isSpinning) return;
    setDesign(d);
    setWinner(null);
  }, [isSpinning]);

  // ─── 履歴操作 ────────────────────────────────────────────
  const returnOne = useCallback((i: number) => {
    const item = selectedHistory[i];
    setSelectedHistory((prev) => prev.filter((_, idx) => idx !== i));
    setInputText((prev) => (prev.trim() ? `${prev.trim()}\n${item}` : item));
  }, [selectedHistory]);

  const returnAll = useCallback(() => {
    const allItems = [...currentItems, ...(winner ? [winner] : []), ...selectedHistory];
    setInputText(allItems.join('\n'));
    setSelectedHistory([]);
    setWinner(null);
    setSlotWinnerIdx(-1);
  }, [currentItems, winner, selectedHistory]);

  return {
    // state
    inputText, setInputText,
    selectedHistory,
    autoMove, setAutoMove,
    isSpinning,
    winner,
    animKey,
    emptyError,
    bounceKey,
    design,
    slotTriggerKey,
    slotWinnerIdx,
    currentItems,
    // refs
    svgRef,
    // actions
    startDraw,
    handleDesignChange,
    returnOne,
    returnAll,
    setWinner,
  };
}
