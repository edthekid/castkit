'use client';

import { useEffect, useRef, useState } from 'react';
import type { Rung, TracePath } from '../_constants';
import { PLAYER_COLORS, TRACE_DURATION_MS } from '../_constants';
import {
  calcSvgWidth, calcSvgHeight, calcColWidth, calcAllTracePaths,
  colX, rowY, bottomY, pointsToPath,
} from '../_utils';
import type { Phase } from '../_hooks/useAmida';
import { ck } from '../../_theme/colors';
import { useTranslation } from '../../_i18n/useTranslation';
import { IconArrowLeft, IconRefresh, IconPlay } from '../../_components/icons';

interface AmidaCanvasProps {
  players: string[];
  results: string[];
  rows: number;
  rungs: Rung[];
  tracePaths: TracePath[];
  phase: Phase;
  activeSet: Set<number>;
  doneSet: Set<number>;
  editingIdx: number;
  scrollTrigger: number;
  onStartEdit: (idx: number) => void;
  onSwapPlayers: (idxA: number, idxB: number) => void;
  onStart: () => void;
  onRegenerate: () => void;
  onReset: () => void;
}

export function AmidaCanvas({
  players, results, rows, rungs, tracePaths,
  phase, activeSet, doneSet,
  editingIdx, scrollTrigger,
  onStartEdit, onSwapPlayers,
  onStart, onRegenerate, onReset,
}: AmidaCanvasProps) {
  const { t } = useTranslation();
  const n = players.length;

  const [colWidth, setColWidth]         = useState(90);
  const [showButtons, setShowButtons]   = useState(false);
  // colWidthが確定したtracePathsをローカルで再計算（ずれ防止）
  const [localPaths, setLocalPaths]     = useState<TracePath[]>(tracePaths);
  const prevScrollTrigger               = useRef(scrollTrigger);
  const traceRefs   = useRef<(SVGPathElement | null)[]>([]);
  const svgWrapRef  = useRef<HTMLDivElement>(null);
  const nameLabelRef= useRef<HTMLDivElement>(null);
  const containerRef= useRef<HTMLDivElement>(null);
  const scrollRafRef= useRef<number | null>(null);
  const startTimeRef= useRef<number>(0);

  const svgW = calcSvgWidth(n, colWidth);
  const svgH = calcSvgHeight(rows);
  const btmY = bottomY(rows);
  const LABEL_BOTTOM_SVG_Y = 44;

  // ─── colWidthを動的計算 → localPathsを再計算 ────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const cw = calcColWidth(n, el.clientWidth);
      setColWidth(cw);
      // colWidthが変わったらトレース経路も再計算（線と色のずれ防止）
      setLocalPaths(calcAllTracePaths(n, rungs, rows, cw));
    };
    update();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [n, rungs, rows]);

  // ─── phaseリセット ──────────────────────────────────────
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- phase切替時にボタンを隠す演出制御（意図的）
    setShowButtons(false);
  }, [phase]);

  // ─── 演出スクロール（generate時のみ） ────────────────────
  useEffect(() => {
    if (scrollTrigger === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- スクロール演出の開始時にボタンを隠す（演出シーケンス）
    setShowButtons(false);
    const wrapper = svgWrapRef.current;
    if (!wrapper) return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const run = async () => {
      const rect    = wrapper.getBoundingClientRect();
      const wrapTop = rect.top + window.scrollY;
      const scaleY  = rect.height / svgH;

      // STEP1: 結果下端へ即ジャンプ
      const resultY = wrapTop + (btmY + 44) * scaleY - window.innerHeight * 0.75;
      window.scrollTo({ top: Math.max(0, resultY), behavior: 'instant' });
      await new Promise<void>((r) => { timers.push(setTimeout(r, 1600)); });

      // STEP2: 下から上へ一定速度スクロール
      const topY       = Math.max(0, wrapTop - 80);
      const startY     = window.scrollY;
      const scrollDist = startY - topY;
      const step2Dur   = Math.max(2000, scrollDist * 5.5);
      await new Promise<void>((resolve) => {
        const st = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - st) / step2Dur, 1);
          window.scrollTo({ top: startY - scrollDist * t, behavior: 'instant' });
          if (t < 1) requestAnimationFrame(tick); else resolve();
        };
        requestAnimationFrame(tick);
      });

      setShowButtons(true);
    };

    run();
    return () => { timers.forEach(clearTimeout); };
  }, [scrollTrigger]);

  // ─── regenerate/swapはすぐボタン表示 ─────────────────────
  useEffect(() => {
    if (phase !== 'ready') return;
    if (prevScrollTrigger.current === scrollTrigger) {
      setShowButtons(true);
    }
    prevScrollTrigger.current = scrollTrigger;
  }, [phase]);

  // ─── トレースアニメーション ──────────────────────────────
  useEffect(() => {
    if (activeSet.size === 0) return;
    activeSet.forEach((i) => {
      const el = traceRefs.current[i];
      if (!el) return;
      // getTotalLengthで正確な長さを取得
      const len = el.getTotalLength ? el.getTotalLength() : 9999;
      el.style.strokeDasharray  = `${len}`;
      el.style.strokeDashoffset = `${len}`;
      el.style.transition = 'none';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = `stroke-dashoffset ${TRACE_DURATION_MS}ms linear`;
          el.style.strokeDashoffset = '0';
        });
      });
    });
  }, [activeSet.size]);

  // ─── tracing: スクロール追従（SVGスケールを正確に計算） ───
  useEffect(() => {
    if (phase !== 'tracing') {
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
      return;
    }
    startTimeRef.current = performance.now();
    const tick = (now: number) => {
      const t       = Math.min((now - startTimeRef.current) / TRACE_DURATION_MS, 1);
      const wrapper = svgWrapRef.current;
      if (wrapper) {
        // SVGのviewBox高さとDOM高さの比率でスケール計算
        const domH        = wrapper.getBoundingClientRect().height;
        const scaleY      = domH / svgH;
        const svgCurrentY = rowY(0) + (btmY - rowY(0)) * t;
        const domY        = svgCurrentY * scaleY;
        const wrapTop     = wrapper.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: wrapTop + domY - window.innerHeight * 0.45, behavior: 'instant' });
      }
      if (t < 1) scrollRafRef.current = requestAnimationFrame(tick);
    };
    scrollRafRef.current = requestAnimationFrame(tick);
    return () => { if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current); };
  }, [phase]);

  // ─── done: 結果パネルへスクロール（下端ではなく結果の位置で止める） ──
  useEffect(() => {
    if (phase !== 'done') return;
    setTimeout(() => {
      const el = document.getElementById('amida-result');
      if (el) {
        // 結果パネルの上端を、（モバイルのsticky headerを避けて）少し余白を持たせて表示
        const targetY = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
      } else {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    }, 300);
    setTimeout(() => setShowButtons(true), 900);
  }, [phase]);

  // ─── ボタンスタイル ──────────────────────────────────────
  const PANEL: React.CSSProperties = {
    display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center',
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(8px)',
    borderRadius: 0,
    border: '1px solid #e4e4e7',
    boxShadow: '0 2px 16px rgba(17,17,20, 0.12)',
    opacity: showButtons ? 1 : 0,
    transform: showButtons ? 'translateY(0)' : 'translateY(6px)',
    transition: 'opacity 0.7s ease, transform 0.7s ease',
    pointerEvents: showButtons ? 'auto' : 'none',
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div ref={containerRef} className="w-full overflow-hidden">
        <div ref={svgWrapRef} style={{ width: '100%', position: 'relative' }}>
          <svg width="100%" height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ display: 'block' }}>

            {/* 縦線 */}
            {Array.from({ length: n }, (_, i) => (
              <line key={`col-${i}`}
                x1={colX(i, colWidth)} y1={rowY(0)}
                x2={colX(i, colWidth)} y2={btmY}
                stroke="#e4e4e7" strokeWidth="2.5" strokeLinecap="round" />
            ))}

            {/* 横線 */}
            {rungs.map((rung, i) => (
              <line key={`rung-${i}`}
                x1={colX(rung.col,     colWidth)} y1={rowY(rung.row)}
                x2={colX(rung.col + 1, colWidth)} y2={rowY(rung.row)}
                stroke="#d4d4d8" strokeWidth="2.5" strokeLinecap="round" />
            ))}

            {/* 完了トレース */}
            {localPaths.map((tp, i) => {
              if (!doneSet.has(i)) return null;
              const color = PLAYER_COLORS[tp.playerIndex % PLAYER_COLORS.length];
              return <path key={`done-${i}`} d={pointsToPath(tp.points)} fill="none"
                stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity={0.5} />;
            })}

            {/* アクティブトレース */}
            {localPaths.map((tp, i) => {
              if (!activeSet.has(i)) return null;
              const color = PLAYER_COLORS[tp.playerIndex % PLAYER_COLORS.length];
              return <path key={`trace-${i}`}
                ref={(el) => { traceRefs.current[i] = el; }}
                d={pointsToPath(tp.points)} fill="none"
                stroke={color} strokeWidth="5"
                strokeLinecap="round" strokeLinejoin="round"
                style={{ strokeDasharray: 99999, strokeDashoffset: 99999 }} />;
            })}

            {/* 参加者ラベル */}
            {players.map((name, i) => {
              const color      = PLAYER_COLORS[i % PLAYER_COLORS.length];
              const isActive   = activeSet.has(i) || doneSet.has(i);
              const canEdit    = phase === 'ready' || phase === 'done';
              const isSelected = canEdit && editingIdx === i;
              const isTarget   = canEdit && editingIdx !== -1 && editingIdx !== i;
              const cx         = colX(i, colWidth);
              return (
                <g key={`player-${i}`}
                  style={{ cursor: canEdit ? 'pointer' : 'default' }}
                  onClick={canEdit ? () => {
                    if (editingIdx === -1) onStartEdit(i);
                    else if (editingIdx === i) onStartEdit(-1);
                    else onSwapPlayers(editingIdx, i);
                  } : undefined}>
                  {isSelected && <rect x={cx - colWidth * 0.46} y={4} width={colWidth * 0.92} height={38} rx={0}
                    fill="none" stroke={color} strokeWidth="2.5" strokeDasharray="4 2" opacity={0.7} />}
                  {isTarget && <rect x={cx - colWidth * 0.45} y={5} width={colWidth * 0.90} height={36} rx={0}
                    fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" opacity={0.5} />}
                  <rect x={cx - colWidth * 0.42} y={8} width={colWidth * 0.84} height={32} rx={0}
                    fill={isActive || isSelected ? color : ck.bg.muted}
                    stroke={color} strokeWidth="1.5" opacity={isTarget ? 0.75 : 1} />
                  {(() => {
                    const dispName = name.length > 7 ? name.slice(0, 6) + '…' : name;
                    const fs = 12;
                    const boxW = colWidth * 0.76;
                    const estimated = dispName.length * fs;
                    const tl = estimated > boxW ? boxW : undefined;
                    return (
                      <text x={cx} y={26} textAnchor="middle" dominantBaseline="middle"
                        fontSize={fs} fontWeight="bold"
                        fontFamily="'Noto Sans JP','Hiragino Sans',sans-serif"
                        fill={isActive || isSelected ? ck.text.onDark : color}
                        textLength={tl} lengthAdjust={tl ? 'spacingAndGlyphs' : undefined}>
                        {dispName}
                      </text>
                    );
                  })()}
                </g>
              );
            })}

            {/* 結果ラベル */}
            {Array.from({ length: n }, (_, i) => {
              const arrivedPlayer = localPaths.find((tp) => tp.resultIndex === i);
              const finished      = arrivedPlayer ? doneSet.has(arrivedPlayer.playerIndex) : false;
              const color         = arrivedPlayer
                ? PLAYER_COLORS[arrivedPlayer.playerIndex % PLAYER_COLORS.length]
                : ck.border.strong;
              const label = results[i] ?? `結果${i + 1}`;
              const cx    = colX(i, colWidth);
              return (
                <g key={`result-${i}`}>
                  <rect x={cx - colWidth * 0.44} y={btmY+6} width={colWidth * 0.88} height={36} rx={0}
                    fill={finished ? color : ck.bg.muted}
                    stroke={finished ? color : ck.border.default} strokeWidth="1.5"
                    style={{ transition: 'fill 0.5s, stroke 0.5s' }} />
                  {(() => {
                    const dispLabel = label.length > 7 ? label.slice(0, 6) + '…' : label;
                    const fs = 12;
                    const boxW = colWidth * 0.80;
                    const estimated = dispLabel.length * fs;
                    const tl = estimated > boxW ? boxW : undefined;
                    return (
                      <text x={cx} y={btmY+26} textAnchor="middle" dominantBaseline="middle"
                        fontSize={fs} fontWeight="bold"
                        fontFamily="'Noto Sans JP','Hiragino Sans',sans-serif"
                        fill={finished ? ck.text.onDark : ck.text.muted}
                        style={{ transition: 'fill 0.5s' }}
                        textLength={tl} lengthAdjust={tl ? 'spacingAndGlyphs' : undefined}>
                        {dispLabel}
                      </text>
                    );
                  })()}
                </g>
              );
            })}
          </svg>

          {/* ボタンオーバーレイ（名前ラベル直下） */}
          <div ref={nameLabelRef} style={{
            position: 'absolute',
            top: `${(LABEL_BOTTOM_SVG_Y / svgH) * 100}%`,
            left: 0, right: 0,
            display: 'flex', justifyContent: 'center', zIndex: 10,
          }}>
            {(phase === 'ready' || phase === 'done') && (
              <div style={PANEL}>
                <button onClick={onReset}
                  className="ck-btn ck-btn-primary text-sm px-5 py-2 flex items-center gap-2">
                  <IconArrowLeft size={14} />{t('amidaCanvas.back')}
                </button>
                <button onClick={onRegenerate}
                  className="ck-btn ck-btn-primary text-sm px-5 py-2 flex items-center gap-2">
                  <IconRefresh size={14} />{t('amidaCanvas.regenerate')}
                </button>
                <button onClick={onStart}
                  className="ck-btn ck-btn-primary text-sm px-6 py-2 flex items-center gap-2">
                  <IconPlay size={14} />{t('amidaCanvas.start')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
