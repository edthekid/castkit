'use client';

import type { ReactNode } from 'react';
import { useTranslation } from '../_i18n/useTranslation';
import type { TranslationKey } from '../_i18n/translations';
import { EditableTitle } from './EditableTitle';

interface ToolHeaderProps {
  titleKey: TranslationKey;
  subtitleKey: TranslationKey;
  /** タイトル上部の右寄せアクション（設定ボタンなど）。無ければ表示しない。 */
  action?: ReactNode;
}

/**
 * 全ツールページ共通のヘッダー（編集可能タイトル + サブタイトル）。
 * 設定ボタンなどが必要なページは action に渡す。
 */
export function ToolHeader({ titleKey, subtitleKey, action }: ToolHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-10 pt-4 ck-slide-up">
      {action && <div className="flex items-center justify-end mb-3">{action}</div>}
      <div className="text-center">
        <EditableTitle defaultValue={t(titleKey)} className="mb-2" />
        <p className="text-sm text-ck-muted font-medium">{t(subtitleKey)}</p>
      </div>
    </div>
  );
}
