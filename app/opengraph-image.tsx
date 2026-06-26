import { ImageResponse } from 'next/og';

export const alt = 'CastKit — 配信・ゲームイベント支援ツール / Streaming and Gaming Event Tools';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const TOOLS = [
  { ja: 'チーム分け',   en: 'Team Division' },
  { ja: 'ルーレット',   en: 'Roulette' },
  { ja: 'あみだくじ',   en: 'Amida' },
  { ja: 'お題ガチャ',   en: 'Topic Picker' },
  { ja: 'ディベート',   en: 'Debate' },
];

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        fontFamily: 'sans-serif',
      }}
    >
      {/* グリッド背景 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(17,17,20,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,20,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* バッジ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 24,
          padding: '6px 16px',
          border: '1.5px solid rgba(17,17,20,0.2)',
          fontSize: 18,
          fontWeight: 700,
          color: '#52525b',
          letterSpacing: '0.15em',
        }}
      >
        FREE · NO SIGN-UP · BROWSER ONLY
      </div>

      {/* ロゴ */}
      <div
        style={{
          fontSize: 96,
          fontWeight: 900,
          letterSpacing: '0.08em',
          color: '#18181b',
          marginBottom: 16,
        }}
      >
        CastKit
      </div>

      {/* 日英サブタイトル */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: 48 }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#52525b', letterSpacing: '0.04em' }}>
          配信・ゲームイベント支援ツール
        </div>
        <div style={{ fontSize: 22, fontWeight: 600, color: '#a1a1aa', letterSpacing: '0.04em' }}>
          Streaming and Gaming Event Tools
        </div>
      </div>

      {/* ツール一覧（日英） */}
      <div style={{ display: 'flex', gap: 12 }}>
        {TOOLS.map((t) => (
          <div
            key={t.en}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '10px 18px',
              border: '1.5px solid #e4e4e7',
              background: '#fafafa',
            }}
          >
            <span style={{ fontSize: 18, fontWeight: 700, color: '#18181b' }}>{t.ja}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#a1a1aa' }}>{t.en}</span>
          </div>
        ))}
      </div>
    </div>,
    { ...size },
  );
}
