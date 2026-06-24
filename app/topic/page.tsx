'use client';

import { useState } from 'react';
import { useTopicPicker } from './_hooks/useTopicPicker';
import type { TopicMode } from './_hooks/useTopicPicker';
import { CategorySelector } from './_components/CategorySelector';
import { TopicCard } from './_components/TopicCard';
import { TopicHistoryPanel } from './_components/TopicHistory';
import { useTranslation } from '../_i18n/useTranslation';
import { Modal } from '../_components/Modal';
import { ToolHeader } from '../_components/ToolHeader';
import { ToolFooter } from '../_components/ToolFooter';
import { SettingsButton } from '../_components/SettingsButton';
import { ck } from '../_theme/colors';
import { IconGear } from '../_components/icons';

// ─── 設定モーダル ─────────────────────────────────────────
function SettingsModal({
  onClose,
  customTopicsText,
  setCustomTopicsText,
  topicMode,
  setTopicMode,
  customTopicCount,
}: {
  onClose: () => void;
  customTopicsText: string;
  setCustomTopicsText: (v: string) => void;
  topicMode: TopicMode;
  setTopicMode: (v: TopicMode) => void;
  customTopicCount: number;
}) {
  const { t } = useTranslation();

  return (
    <Modal onClose={onClose} ariaLabel={t('topic.settingsTitle')}>
      <p className="text-base font-black flex items-center gap-2">
        <IconGear size={16} aria-hidden="true" />
        <span className="ck-gradient-text">{t('topic.settingsTitle')}</span>
      </p>

      {/* カスタムお題 */}
      <div className="flex flex-col gap-2">
        <label htmlFor="topic-custom-topics" className="text-xs font-black tracking-widest uppercase" style={{ color: ck.text.secondary }}>
          {t('topic.customTopicLabel')}
        </label>
        <p className="text-xs" style={{ color: ck.text.muted }}>{t('topic.customTopicHint')}</p>
        <textarea
          id="topic-custom-topics"
          value={customTopicsText}
          onChange={(e) => setCustomTopicsText(e.target.value)}
          placeholder={t('topic.customTopicPlaceholder')}
          rows={6}
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
            {t('topic.customTopicCount').replace('{count}', String(customTopicCount))}
          </p>
        )}
      </div>

      {/* お題の範囲 */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-black tracking-widest uppercase" style={{ color: ck.text.secondary }}>
          {t('topic.topicModeLabel')}
        </p>
        <div className="flex gap-2" role="group" aria-label={t('topic.topicModeLabel')}>
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
              {mode === 'all' ? t('topic.modeAll') : t('topic.modeCustomOnly')}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onClose}
        className="ck-btn ck-btn-primary w-full text-sm h-10 tracking-widest"
      >
        {t('topic.settingsClose')}
      </button>
    </Modal>
  );
}

// ─── メインページ ─────────────────────────────────────────
export default function TopicPage() {
  const topic = useTopicPicker();
  const { t } = useTranslation();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">

      <ToolHeader
        titleKey="topic.title"
        subtitleKey="topic.subtitle"
        action={
          <SettingsButton
            label={t('topic.settings')}
            count={topic.customTopics.length}
            onClick={() => setSettingsOpen(true)}
          />
        }
      />

      <div className="flex flex-col gap-4">
        {/* お題表示エリア + ボタン */}
        <TopicCard
          phase={topic.phase}
          current={topic.current}
          drawKey={topic.drawKey}
          disabled={topic.totalTopicCount === 0}
          shufflePool={topic.shufflePool}
          onDraw={topic.draw}
          isCustomOnly={topic.topicMode === 'custom-only'}
          customTopicCount={topic.customTopics.length}
        />

        {/* カテゴリ選択 / 履歴 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {topic.topicMode !== 'custom-only' && (
            <CategorySelector
              categories={topic.categories}
              activeIds={topic.activeCategoryIds}
              onToggle={topic.toggleCategory}
              onClear={topic.clearCategoryFilter}
            />
          )}

          <TopicHistoryPanel history={topic.history} onClear={topic.clearHistory} />
        </div>
      </div>

      <ToolFooter />

      {/* 設定モーダル */}
      {settingsOpen && (
        <SettingsModal
          onClose={() => setSettingsOpen(false)}
          customTopicsText={topic.customTopicsText}
          setCustomTopicsText={topic.setCustomTopicsText}
          topicMode={topic.topicMode}
          setTopicMode={topic.setTopicMode}
          customTopicCount={topic.customTopics.length}
        />
      )}
    </div>
  );
}
