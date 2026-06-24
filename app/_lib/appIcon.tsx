import { ImageResponse } from 'next/og';

/**
 * CastKit のアプリアイコン（"CK" + 右上アクセント角）を任意サイズで描画する共通関数。
 * favicon（app/icon.tsx）と PWA manifest 用アイコン（192/512）で共用する。
 */
export function appIconResponse(size: number) {
  const accent = Math.round(size * 0.22);
  const font = Math.round(size * 0.42);

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#18181b',
          position: 'relative',
        }}
      >
        {/* 右上アクセント角 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: accent,
            height: accent,
            background: '#a1a1aa',
          }}
        />

        {/* CK テキスト */}
        <div
          style={{
            fontSize: font,
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: `${-size * 0.015}px`,
            display: 'flex',
            lineHeight: 1,
          }}
        >
          CK
        </div>
      </div>
    ),
    { width: size, height: size },
  );
}
