'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { gsap } from 'gsap';
import type { DesignMode } from '../_constants';
import { dseg7 } from '../_fonts/dseg';

/**
 * 得点変更時に、前の値から新しい値へ数字を転がすカウントアップ。
 * 数字は textContent を直接書き換えて描く（毎フレームの再レンダーを避ける）。
 * 桁数(＝パネル幅)は最終値基準で固定するのでレイアウトはガタつかない。
 * デザインモード切替でノードが差し替わっても、コールバックrefが現在値を復元する。
 * reduced-motion では即座に最終値。
 */
function useCountUp(score: number): (el: HTMLSpanElement | null) => void {
  const nodeRef  = useRef<HTMLSpanElement | null>(null);
  const shownRef = useRef<number>(score);   // 現在DOMに表示している値
  const prevRef  = useRef<number>(score);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // モード切替などでノードが差し替わったら、現在値を書き戻す
  const setNode = useCallback((el: HTMLSpanElement | null) => {
    nodeRef.current = el;
    if (el) el.textContent = String(shownRef.current);
  }, []);

  useEffect(() => {
    const from = prevRef.current;
    const to   = score;
    prevRef.current = score;
    if (from === to) return;

    const write = (v: number) => {
      shownRef.current = v;
      if (nodeRef.current) nodeRef.current.textContent = String(v);
    };

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { write(to); return; }

    const obj = { v: from };
    tweenRef.current?.kill();
    tweenRef.current = gsap.to(obj, {
      v: to,
      duration: Math.min(0.18 + Math.abs(to - from) * 0.02, 0.7),
      ease: 'power2.out',
      onUpdate: () => write(Math.round(obj.v)),
      onComplete: () => write(to),
    });
    return () => { tweenRef.current?.kill(); };
  }, [score]);

  return setNode;
}

/** 16進カラーを白方向に混ぜて明るくする（暗いチームカラーでも7セグが視認できるように）。 */
function lighten(hex: string, amount: number): string {
  const m = hex.replace('#', '');
  if (m.length !== 6) return hex;
  const ch = (i: number) => parseInt(m.slice(i, i + 2), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  const to2 = (n: number) => n.toString(16).padStart(2, '0');
  return `#${to2(mix(ch(0)))}${to2(mix(ch(2)))}${to2(mix(ch(4)))}`;
}

/**
 * 桁数に応じて数字をパネル幅に収めるフォントサイズ。
 * パネルを container（inline-size）にし、cqw（パネル幅の1%）で割り当てる。
 * 桁が増えるほど cqw 項が小さくなり、min/max で上限・下限を挟むので、はみ出さない。
 */
function fitFontSize(text: string, maxRem: number, cqwBudget: number): string {
  const len = Math.max(text.length, 1);
  return `max(0.8rem, min(${maxRem}rem, ${(cqwBudget / len).toFixed(1)}cqw))`;
}

// 桁数やデザインに関わらずパネルの高さを揃える（h-28 = 7rem）。数字は中央寄せ。
const PANEL_BASE = 'relative flex items-center justify-center w-full h-28 px-3 overflow-hidden';
const FIT_SPAN: CSSProperties = { whiteSpace: 'nowrap', lineHeight: 1 };

interface ScoreDisplayProps {
  score: number;
  color: string;
  mode: DesignMode;
  /** true の間だけ得点変動アニメーション（跳ねる＋発光）を付ける */
  bump: boolean;
  /** ミニマル/カードで使う font-family スタック（空ならアプリ標準）。7セグでは無視。 */
  fontStack?: string;
}

/**
 * 得点の数字を 3 つのデザインモードで描画する純粋な表示コンポーネント。
 * - segment: レトロな電光掲示板（7セグ風）。暗いパネル＋チームカラーで発光。
 * - minimal: フラットで見やすい大きな数字。
 * - card:    チームカラーを背景に敷いたカード型。
 *
 * 電光掲示板の暗いパネル色はデザイントークン（--ck-gray-950）を使用し、
 * 発光やアクセントはチームカラー（ck.series＝トークン）を使う。
 */
export function ScoreDisplay({ score, color, mode, bump, fontStack }: ScoreDisplayProps) {
  const popClass = bump ? 'ck-score-pop' : '';

  // 数字はカウントアップ用refがtextContentを直接管理する（childrenは置かない）
  const numRef = useCountUp(score);
  // 桁数(パネル幅)の計算は最終値で固定してガタつきを防ぐ
  const sizeText = String(score);
  const fontFamily = fontStack || undefined;

  if (mode === 'segment') {
    // デジタル時計（7セグ）風。点灯していない素子をうっすら残す「ゴースト」を背面に重ねる。
    // 暗いチームカラーでも読めるよう、点灯色は白方向に明るくし、パネルも真っ黒を避ける。
    const lit = lighten(color, 0.55);
    const ghost = sizeText.replace(/\d/g, '8');
    const fontSize = fitFontSize(sizeText, 4.25, 130);
    return (
      <div
        className={PANEL_BASE}
        style={{
          containerType: 'inline-size',
          background: 'linear-gradient(180deg, #23242b 0%, #15161b 100%)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 24px rgba(0,0,0,0.55)',
        }}
      >
        {/* 消灯セグメントのゴースト */}
        <span
          aria-hidden="true"
          className={`${dseg7.className} absolute select-none`}
          style={{ ...FIT_SPAN, fontSize, color: lit, opacity: 0.14 }}
        >
          {ghost}
        </span>
        {/* 点灯セグメント（数字はrefがtextContentで管理） */}
        <span
          ref={numRef}
          className={`${dseg7.className} relative ${popClass}`}
          style={{ ...FIT_SPAN, fontSize, color: lit, textShadow: `0 0 7px ${lit}, 0 0 18px ${color}` }}
        />
      </div>
    );
  }

  if (mode === 'card') {
    return (
      <div
        className={PANEL_BASE}
        style={{ containerType: 'inline-size', background: `linear-gradient(135deg, ${color}, ${color}cc)`, color: '#ffffff' }}
      >
        <span
          ref={numRef}
          className={`font-black tabular-nums ${popClass}`}
          style={{ ...FIT_SPAN, fontFamily, fontSize: fitFontSize(sizeText, 4.5, 150), textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}
        />
      </div>
    );
  }

  // minimal
  return (
    <div className={PANEL_BASE} style={{ containerType: 'inline-size' }}>
      <span
        ref={numRef}
        className={`font-black tabular-nums text-ck-ink ${popClass}`}
        style={{ ...FIT_SPAN, fontFamily, fontSize: fitFontSize(sizeText, 4.5, 150), borderBottom: `4px solid ${color}` }}
      />
    </div>
  );
}
