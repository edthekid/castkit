'use client';

import { useEffect, useState } from 'react';
import type { TopicPhase } from '../_constants';
import type { TopicHistoryItem } from '../_hooks/useTopicPicker';
import { useTranslation } from '../../_i18n/useTranslation';
import { ck } from '../../_theme/colors';
import { TOPIC_CATEGORIES } from '../_data/topics';
import type { TranslationKey } from '../../_i18n/translations';
import { ICON_MAP } from '../../_components/icons';

interface TopicCardProps {
  phase: TopicPhase;
  current: TopicHistoryItem | null;
  drawKey: number;
  disabled: boolean;
  shufflePool: string[];
  onDraw: () => void;
  isCustomOnly?: boolean;
  customTopicCount?: number;
}

function useShuffleText(active: boolean, pool: string[]) {
  const [text, setText] = useState('');
  useEffect(() => {
    if (!active || pool.length === 0) return;
    const id = setInterval(() => {
      setText(pool[Math.floor(Math.random() * pool.length)]);
    }, 90);
    return () => clearInterval(id);
  }, [active, pool]);
  return text;
}

export function TopicCard({ phase, current, drawKey, disabled, shufflePool, onDraw, isCustomOnly, customTopicCount }: TopicCardProps) {
  const { t } = useTranslation();
  const shuffleText = useShuffleText(phase === 'drawing', shufflePool);

  const isCustom = current?.categoryId === 'custom';

  return (
    <div className="ck-section ck-slide-up flex flex-col items-center gap-6" style={{ animationDelay: '0.1s' }}>
      <div
        key={drawKey}
        className="w-full flex flex-col items-center justify-center text-center px-6"
        style={{
          minHeight: 180,
          border: `1.5px solid ${ck.border.default}`,
          background: ck.bg.muted,
        }}
      >
        {phase === 'idle' && (
          <p className="text-base font-bold" style={{ color: ck.text.muted }}>
            {t('topic.idleMessage')}
          </p>
        )}

        {phase === 'drawing' && (
          <p className="text-xl font-black" style={{ color: ck.text.muted, animation: 'topic-shuffle 0.09s linear infinite' }}>
            {shuffleText}
          </p>
        )}

        {phase === 'result' && current && (
          <div className="flex flex-col items-center gap-3" style={{ animation: 'topic-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both' }}>
            <span className="flex items-center gap-1.5 text-xs font-black tracking-widest uppercase" style={{ color: ck.text.secondary }}>
              {isCustom ? (
                <>{current.categoryIcon} カスタム</>
              ) : (
                <>
                  {(() => { const Icon = ICON_MAP[current.categoryIcon]; return Icon ? <Icon size={14} /> : null; })()}
                  {t((TOPIC_CATEGORIES.find((c) => c.id === current.categoryId)?.labelKey ?? 'topic.categoryTitle') as TranslationKey)}
                </>
              )}
            </span>
            <p className="text-xl sm:text-2xl font-black leading-snug" style={{ color: ck.text.primary }}>
              {current.text}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={onDraw}
        disabled={disabled || phase === 'drawing'}
        className="ck-btn ck-btn-primary w-full max-w-xs text-xl h-14 tracking-widest disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {phase === 'drawing' ? t('topic.drawing') : t('topic.drawButton')}
      </button>

      {disabled && (
        <p className="text-sm font-semibold" style={{ color: ck.text.secondary }}>
          {t('topic.noTopics')}
          {isCustomOnly && (customTopicCount ?? 0) === 0 && (
            <span className="block text-xs mt-1 font-medium" style={{ color: ck.text.muted }}>
              {t('topic.noTopicsCustomOnlyHint')}
            </span>
          )}
        </p>
      )}

      <style>{`
        @keyframes topic-shuffle {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.6; }
        }
        @keyframes topic-pop {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
