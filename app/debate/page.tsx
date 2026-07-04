'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useDebate } from './_hooks/useDebate';
import type { TopicMode } from './_hooks/useDebate';
import { useTranslation } from '../_i18n/useTranslation';
import { DEBATE_TOPICS } from './_data/debates';
import { ck } from '../_theme/colors';
import { IconGear } from '../_components/icons';
import { Modal } from '../_components/Modal';
import { ToolHeader } from '../_components/ToolHeader';
import { ToolFooter } from '../_components/ToolFooter';
import { SettingsButton } from '../_components/SettingsButton';

// ─── シャッフル演出テキスト ────────────────────────────────
function useShuffleText(
  active: boolean,
  locale: 'ja' | 'en',
  field: 'theme' | 'faction',
  customPool: string[],
  customOnly: boolean,
) {
  const [text, setText] = useState('');
  useEffect(() => {
    if (!active) return;
    const base =
      field === 'theme'
        ? DEBATE_TOPICS.map((d) => d.theme[locale])
        : DEBATE_TOPICS.flatMap((d) => [d.factionA[locale], d.factionB[locale]]);
    // フックの topicPool と同じ挙動に合わせる:
    // 「カスタムのみ」かつカスタムが存在する場合はカスタムだけをシャッフルし、
    // それ以外（デフォルト＋カスタム、またはカスタム未入力）はデフォルトを含める。
    const customFiltered = customPool.filter(Boolean);
    let pool =
      customOnly && customFiltered.length > 0
        ? customFiltered
        : [...base, ...customFiltered];
    if (pool.length === 0) pool = base;
    const id = setInterval(() => {
      setText(pool[Math.floor(Math.random() * pool.length)]);
    }, 80);
    return () => clearInterval(id);
  }, [active, locale, field, customPool, customOnly]);
  return text;
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// ─── 設定モーダル ─────────────────────────────────────────
function SettingsModal({
  onClose,
  customTopicsText,
  setCustomTopicsText,
  topicMode,
  setTopicMode,
  customTimerMin,
  setCustomTimerMin,
  customTopicCount,
}: {
  onClose: () => void;
  customTopicsText: string;
  setCustomTopicsText: (v: string) => void;
  topicMode: TopicMode;
  setTopicMode: (v: TopicMode) => void;
  customTimerMin: number | null;
  setCustomTimerMin: (v: number | null) => void;
  customTopicCount: number;
}) {
  const { t } = useTranslation();

  return (
    <Modal onClose={onClose} ariaLabel={t('debate.settingsTitle')}>
      {/* タイトル */}
      <p className="text-base font-black flex items-center gap-2">
        <IconGear size={16} aria-hidden="true" />
        <span className="ck-gradient-text">{t('debate.settingsTitle')}</span>
      </p>

      {/* カスタムお題 */}
      <div className="flex flex-col gap-2">
        <label htmlFor="debate-custom-topics" className="text-xs font-black tracking-widest uppercase" style={{ color: ck.text.secondary }}>
          {t('debate.customTopicLabel')}
        </label>
        <p className="text-xs" style={{ color: ck.text.muted }}>{t('debate.customTopicHint')}</p>
        <textarea
          id="debate-custom-topics"
          value={customTopicsText}
          onChange={(e) => setCustomTopicsText(e.target.value)}
          placeholder={t('debate.customTopicPlaceholder')}
          rows={5}
          className="w-full text-sm font-medium resize-y outline-none px-3 py-2"
          style={{
            border: `1.5px solid ${ck.border.default}`,
            background: ck.bg.muted,
            color: ck.text.primary,
            fontFamily: 'inherit',
          }}
        />
        {customTopicCount > 0 && (
          <p className="text-xs font-bold" style={{ color: ck.text.secondary }}>
            {t('debate.customTopicCount').replace('{count}', String(customTopicCount))}
          </p>
        )}
      </div>

      {/* お題の範囲 */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-black tracking-widest uppercase" style={{ color: ck.text.secondary }}>
          {t('debate.topicModeLabel')}
        </p>
        <div className="flex gap-2" role="group" aria-label={t('debate.topicModeLabel')}>
          {(['all', 'custom-only'] as TopicMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setTopicMode(mode)}
              aria-pressed={topicMode === mode}
              className="ck-btn flex-1 text-sm font-black py-2"
              style={{
                background: topicMode === mode ? ck.text.primary : ck.bg.muted,
                color:      topicMode === mode ? ck.text.onDark  : ck.text.primary,
                border: `1.5px solid ${topicMode === mode ? ck.text.primary : ck.border.default}`,
              }}
            >
              {mode === 'all' ? t('debate.modeAll') : t('debate.modeCustomOnly')}
            </button>
          ))}
        </div>
      </div>

      {/* カスタム時間 */}
      <div className="flex flex-col gap-2">
        <label htmlFor="debate-timer-min" className="text-xs font-black tracking-widest uppercase" style={{ color: ck.text.secondary }}>
          {t('debate.customTimerLabel')}
        </label>
        <div className="flex items-center gap-2">
          <input
            id="debate-timer-min"
            type="number"
            min={1}
            max={60}
            value={customTimerMin ?? ''}
            onChange={(e) => {
              const v = e.target.value === '' ? null : Number(e.target.value);
              setCustomTimerMin(v);
            }}
            placeholder={t('debate.customTimerPlaceholder')}
            className="w-24 text-sm font-black text-center outline-none px-3 py-2"
            style={{
              border: `1.5px solid ${ck.border.default}`,
              background: ck.bg.muted,
              color: ck.text.primary,
            }}
          />
          <span className="text-sm font-bold" aria-hidden="true" style={{ color: ck.text.muted }}>{t('debate.min')}</span>
          {customTimerMin !== null && (
            <button
              onClick={() => setCustomTimerMin(null)}
              className="text-xs font-bold px-2 py-1"
              style={{ color: ck.text.muted, border: `1px solid ${ck.border.default}` }}
            >
              クリア
            </button>
          )}
        </div>
      </div>

      {/* 閉じる */}
      <button
        onClick={onClose}
        className="ck-btn ck-btn-primary w-full text-sm h-10 tracking-widest"
      >
        {t('debate.settingsClose')}
      </button>
    </Modal>
  );
}

// ─── メインページ ─────────────────────────────────────────
export default function DebatePage() {
  const debate = useDebate();
  const { t } = useTranslation();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const factionGridRef = useRef<HTMLDivElement>(null);
  const timerRef       = useRef<HTMLParagraphElement>(null);
  const timeUpRef      = useRef<HTMLParagraphElement>(null);

  const customThemePool   = debate.customTopics.map((d) => d.theme[debate.locale]);
  const customFactionPool = debate.customTopics.flatMap((d) => [d.factionA[debate.locale], d.factionB[debate.locale]]);

  const customOnly = debate.topicMode === 'custom-only';
  const themeShuffle   = useShuffleText(debate.phase === 'topic-drawing',   debate.locale, 'theme',   customThemePool,   customOnly);
  const factionShuffle = useShuffleText(debate.phase === 'faction-drawing', debate.locale, 'faction', customFactionPool, customOnly);

  const isIdle    = debate.phase === 'idle';
  const isRunning = debate.phase === 'running';
  const isDone    = debate.phase === 'done';
  const isReady   = debate.phase === 'ready';
  const isDrawing = debate.phase === 'topic-drawing' || debate.phase === 'faction-drawing';

  const urgent = debate.remaining > 0 && debate.remaining <= 10;

  // お題テキスト
  const topicText = (() => {
    if (debate.phase === 'topic-drawing') return { text: themeShuffle, shuffling: true };
    if (debate.topic) return { text: debate.topic.theme[debate.locale], shuffling: false };
    return null;
  })();

  // 陣営テキスト
  const faction1Text = (() => {
    if (debate.phase === 'faction-drawing') return { text: factionShuffle, shuffling: true };
    if (debate.factions) return { text: debate.factions.player1[debate.locale], shuffling: false };
    return null;
  })();
  const faction2Text = (() => {
    if (debate.phase === 'faction-drawing') return { text: factionShuffle, shuffling: true };
    if (debate.factions) return { text: debate.factions.player2[debate.locale], shuffling: false };
    return null;
  })();

  // タイマー表示値
  const timerDisplay = (() => {
    if (isRunning || isDone) return isDone ? '00:00' : fmt(debate.remaining);
    return fmt(debate.timerSec);
  })();

  // ── 陣営の激突リビール: 1Pは左から・2Pは右から・VSがポップ ──
  const factionsReady = !!debate.factions && !isDrawing;
  useEffect(() => {
    if (!factionsReady || !factionGridRef.current) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const boxes = factionGridRef.current.querySelectorAll<HTMLElement>('.dbt-faction');
    const vs    = factionGridRef.current.querySelector<HTMLElement>('.dbt-vs');
    if (boxes.length < 2) return;
    if (reduce) { gsap.set([boxes[0], boxes[1], vs], { clearProps: 'all' }); return; }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(boxes[0], { x: -55, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' }, 0);
      tl.fromTo(boxes[1], { x:  55, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' }, 0);
      if (vs) tl.fromTo(vs, { scale: 0, rotate: -35, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 0.5, ease: 'back.out(2.6)' }, 0.16);
    }, factionGridRef);
    return () => ctx.revert();
  }, [debate.factions, factionsReady]);

  // ── タイマーの毎秒ティック（残り10秒は強めのハートビート） ──
  useEffect(() => {
    if (!isRunning || !timerRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const strong = debate.remaining <= 10;
    gsap.fromTo(
      timerRef.current,
      { scale: strong ? 1.13 : 1.05 },
      { scale: 1, duration: strong ? 0.5 : 0.28, ease: strong ? 'elastic.out(1, 0.5)' : 'power2.out' },
    );
  }, [debate.remaining, isRunning]);

  // ── TIME UP のポップ ──
  useEffect(() => {
    if (!isDone || !timeUpRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(timeUpRef.current, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(2.4)' });
    });
    return () => ctx.revert();
  }, [isDone]);


  return (
    <div className="max-w-3xl mx-auto">

      <ToolHeader
        titleKey="debate.title"
        subtitleKey="debate.subtitle"
        action={
          <SettingsButton
            label={t('debate.settings')}
            count={debate.customTopics.length}
            onClick={() => setSettingsOpen(true)}
          />
        }
      />

      {/* メインカード */}
      <div className="ck-section ck-slide-up flex flex-col gap-6" style={{ animationDelay: '0.05s' }}>

        {/* お題エリア（常に表示） */}
        <div
          className="w-full text-center px-6 py-5"
          style={{
            height: 120,
            border: `1.5px solid ${ck.border.default}`,
            background: ck.bg.muted,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <p className="text-xs font-black tracking-widest uppercase mb-2" style={{ color: ck.text.muted }}>
            {t('debate.topicLabel')}
          </p>
          {topicText ? (
            topicText.shuffling ? (
              <p
                className="text-2xl font-black leading-snug"
                style={{ color: ck.text.muted, animation: 'debate-shuffle 0.08s linear infinite' }}
              >
                {topicText.text}
              </p>
            ) : (
              <RevealText
                text={topicText.text}
                className="text-2xl font-black leading-snug"
                style={{ color: ck.text.primary }}
              />
            )
          ) : (
            <p className="text-base font-bold" style={{ color: ck.text.muted }}>
              {t('debate.idleMessage')}
            </p>
          )}
        </div>

        {/* 陣営エリア（常に表示） */}
        <div ref={factionGridRef} className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <FactionBox label="1P" faction={faction1Text} />
          <VSBadge />
          <FactionBox label="2P" faction={faction2Text} />
        </div>

        {/* タイマー表示 */}
        <div className="text-center">
          <p
            ref={timerRef}
            className="text-5xl sm:text-6xl font-black tracking-widest tabular-nums transition-colors duration-300"
            style={{
              fontFamily: 'monospace',
              color: isDone ? ck.text.muted : urgent ? ck.series[1] : ck.text.primary,
            }}
          >
            {timerDisplay}
          </p>
          {isDone && (
            <p ref={timeUpRef} className="text-xl font-black tracking-widest mt-2" style={{ color: ck.series[1] }}>
              {t('debate.timeUp')}
            </p>
          )}
        </div>

        {/* アクションボタン */}
        <div className="flex flex-col items-center gap-3">
          {(isIdle || isDrawing) && (
            <button
              onClick={debate.start}
              disabled={isDrawing}
              className="ck-btn ck-btn-primary w-full max-w-xs text-xl h-14 tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('debate.startButton')}
            </button>
          )}

          {isReady && (
            <div className="flex flex-col items-center gap-2 w-full max-w-xs">
              <button
                onClick={debate.startTimer}
                className="ck-btn ck-btn-primary w-full text-xl h-14 tracking-widest"
              >
                {t('debate.timerStart')}
              </button>
              <button
                onClick={debate.start}
                className="ck-btn ck-btn-ghost w-full text-sm h-10 tracking-widest"
              >
                {t('debate.redraw')}
              </button>
            </div>
          )}

          {(isRunning || isDone) && (
            <div className="flex gap-3 w-full max-w-xs">
              <button
                onClick={debate.resetTimer}
                className="ck-btn ck-btn-ghost flex-1 text-sm h-11 tracking-widest"
              >
                {t('debate.resetTimer')}
              </button>
              <button
                onClick={debate.reset}
                className="ck-btn ck-btn-primary flex-1 text-sm h-11 tracking-widest"
              >
                {t('debate.restart')}
              </button>
            </div>
          )}
        </div>

      </div>

      <ToolFooter />

      {/* 設定モーダル */}
      {settingsOpen && (
        <SettingsModal
          onClose={() => setSettingsOpen(false)}
          customTopicsText={debate.customTopicsText}
          setCustomTopicsText={debate.setCustomTopicsText}
          topicMode={debate.topicMode}
          setTopicMode={debate.setTopicMode}
          customTimerMin={debate.customTimerMin}
          setCustomTimerMin={debate.setCustomTimerMin}
          customTopicCount={debate.customTopics.length}
        />
      )}

      <style>{`
        @keyframes debate-shuffle {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.55; }
        }
        @keyframes debate-pop {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// ─── 陣営ボックス ──────────────────────────────────────────
function FactionBox({
  label,
  faction,
}: {
  label: string;
  faction: { text: string; shuffling: boolean } | null;
}) {
  return (
    <div
      className="dbt-faction flex flex-col items-center gap-2 py-5 px-4 text-center"
      style={{
        border: `1.5px solid ${ck.border.default}`,
        background: ck.bg.muted,
        height: 110,
        overflow: 'hidden',
      }}
    >
      <span className="text-xs font-black tracking-widest" style={{ color: ck.text.muted }}>
        {label}
      </span>
      {faction ? (
        <span
          className="text-xl font-black leading-tight"
          style={{
            color: faction.shuffling ? ck.text.muted : ck.text.primary,
            animation: faction.shuffling
              ? 'debate-shuffle 0.08s linear infinite'
              : 'debate-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
          }}
        >
          {faction.text || '　'}
        </span>
      ) : (
        <span className="text-xl font-black leading-tight" style={{ color: ck.border.strong }}>
          ───
        </span>
      )}
    </div>
  );
}

function VSBadge() {
  return (
    <div
      className="dbt-vs flex items-center justify-center w-10 h-10 text-sm font-black tracking-widest flex-shrink-0"
      style={{
        border: `1.5px solid ${ck.border.strong}`,
        background: ck.text.primary,
        color: ck.text.onDark,
      }}
    >
      VS
    </div>
  );
}

// ─── お題テーマのリビール（1文字ずつフリップ） ─────────────
function RevealText({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = el.querySelectorAll<HTMLElement>('.dbt-char');
    if (chars.length === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(chars, { opacity: 1, y: 0, rotateX: 0, scale: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        { opacity: 0, y: 16, rotateX: -80, scale: 0.6 },
        { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 0.45, stagger: 0.03, ease: 'back.out(2.2)' },
      );
    }, ref);
    return () => ctx.revert();
  }, [text]);

  return (
    <p ref={ref} aria-label={text} className={className} style={{ ...style, perspective: 400 }}>
      <span aria-hidden="true">
        {Array.from(text).map((ch, i) => (
          <span key={i} className="dbt-char" style={{ display: 'inline-block', whiteSpace: 'pre' }}>
            {ch === ' ' ? ' ' : ch}
          </span>
        ))}
      </span>
    </p>
  );
}
