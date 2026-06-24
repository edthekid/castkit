'use client';

import { useState } from 'react';
import { useTranslation } from '../_i18n/useTranslation';
import { IconPencil } from './icons';
import { ck } from '../_theme/colors';

interface EditableTitleProps {
  /** 翻訳済みのデフォルトタイトル。未編集の間はこれを表示し、言語切替にも追従する。 */
  defaultValue: string;
  /** ルートに付与する追加クラス（余白調整用） */
  className?: string;
}

/**
 * クリックで編集できるページタイトル（あみだくじ式）。
 * - 未編集なら defaultValue（翻訳）を表示し、言語切替に追従する
 * - 一度編集するとユーザーの入力値を優先する
 * - 右の編集ボタンと同じ幅の透明スペーサーを左に置き、文字を真の中央に保つ
 */
export function EditableTitle({ defaultValue, className = '' }: EditableTitleProps) {
  const { t } = useTranslation();
  const [custom, setCustom] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const value = custom ?? defaultValue;
  const editLabel = t('common.editTitle');

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {editing ? (
        <input
          autoFocus
          className="text-3xl sm:text-5xl font-black tracking-widest text-center border-b-2 outline-none bg-transparent w-48 sm:w-72 ck-gradient-text"
          style={{ borderColor: ck.text.primary }}
          value={value}
          onChange={(e) => setCustom(e.target.value)}
          onBlur={() => setEditing(false)}
          onKeyDown={(e) => { if (e.key === 'Enter') setEditing(false); }}
        />
      ) : (
        <>
          {/* 右の編集ボタンと同じ幅の透明スペーサー。タイトル文字を真の中央に保つ */}
          <span className="w-5 shrink-0" aria-hidden="true" />
          <h1 className="text-3xl sm:text-5xl font-black tracking-widest ck-gradient-text">
            {value}
          </h1>
          <button
            onClick={() => setEditing(true)}
            className="w-5 shrink-0 flex items-center justify-center opacity-30 hover:opacity-70 transition-opacity"
            title={editLabel}
            aria-label={editLabel}
          >
            <IconPencil size={20} />
          </button>
        </>
      )}
    </div>
  );
}
