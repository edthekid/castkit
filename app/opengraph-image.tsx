import { ImageResponse } from 'next/og';

export const alt = 'CastKit — 配信・ゲームイベント支援ツール / Streaming and Gaming Event Tools';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const TOOLS = ['チーム分け', 'ルーレット', 'あみだくじ', 'お題ガチャ', 'ディベート'];

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
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

      {/* 左端の黒帯アクセント */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 20, background: '#18181b' }} />

      {/* コンテンツ（左寄せ・縦中央） */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 100 }}>
        {/* バッジ */}
        <div
          style={{
            display: 'flex',
            padding: '8px 20px',
            marginBottom: 28,
            background: '#18181b',
            fontSize: 18,
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '0.15em',
          }}
        >
          FREE · NO SIGN-UP · BROWSER ONLY
        </div>

        {/* ロゴ */}
        <div
          style={{
            fontSize: 116,
            fontWeight: 900,
            letterSpacing: '0.06em',
            lineHeight: 1,
            color: '#18181b',
            marginBottom: 18,
          }}
        >
          CastKit
        </div>

        {/* 日英サブタイトル */}
        <div style={{ fontSize: 30, fontWeight: 700, color: '#52525b', letterSpacing: '0.04em', marginBottom: 6 }}>
          配信・ゲームイベント支援ツール
        </div>
        <div style={{ fontSize: 22, fontWeight: 600, color: '#a1a1aa', letterSpacing: '0.04em', marginBottom: 42 }}>
          Streaming and Gaming Event Tools
        </div>

        {/* ツール一覧 */}
        <div style={{ display: 'flex', gap: 12 }}>
          {TOOLS.map((name) => (
            <div
              key={name}
              style={{
                display: 'flex',
                padding: '10px 20px',
                border: '1.5px solid #d4d4d8',
                background: '#ffffff',
                fontSize: 20,
                fontWeight: 700,
                color: '#18181b',
              }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>,
    { ...size },
  );
}
