'use client';

import { useState } from 'react';
import { PLAYER_COLORS } from '../_constants';
import { useTranslation } from '../../_i18n/useTranslation';
import { ck } from '../../_theme/colors';
import { IconCopy, IconCheck } from '../../_components/icons';

interface ResultPanelProps {
  players: string[];
  resultMap: Record<number, string>;
  doneSet: Set<number>;
  show: boolean;
}

export function ResultPanel({ players, resultMap, doneSet, show }: ResultPanelProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  if (!show) return null;

  const handleCopy = () => {
    const lines = players.map((name, i) => {
      const result = resultMap[i] ?? '---';
      return `${name} → ${result}`;
    });
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div id="amida-result" className="ck-section mt-6 ck-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-black text-sm tracking-wide flex items-center gap-2">
          <span className="ck-gradient-text">{t('amidaResult.title')}</span>
        </h3>
        <button
          onClick={handleCopy}
          className="ck-btn ck-btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5"
        >
          {copied ? <IconCheck size={13} /> : <IconCopy size={13} />}
          {copied ? t('amidaResult.copied') : t('amidaResult.copy')}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {players.map((name, i) => {
          const color  = PLAYER_COLORS[i % PLAYER_COLORS.length];
          const result = resultMap[i] ?? '---';
          return (
            <div key={i}
              className="flex items-center gap-3 px-4 py-3"
              style={{
                background: `${color}10`,
                border: `1px solid ${color}30`,
                animation: 'fadeSlideIn 0.4s ease both',
                animationDelay: `${i * 0.08}s`,
              }}
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black shrink-0 text-white"
                style={{ background: color, boxShadow: `0 0 10px ${color}60` }}>
                {name.slice(0, 1)}
              </div>
              <span className="font-bold flex-1 truncate" style={{ color: ck.text.primary }}>{name}</span>
              <span className="opacity-30 shrink-0">→</span>
              <span className="font-black text-right shrink-0 max-w-[110px] truncate"
                style={{ color }}>
                {result}
              </span>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
