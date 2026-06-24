import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CastKit — 配信・ゲームイベント支援ツール',
    short_name: 'CastKit',
    description:
      '無料の配信・ゲームイベント支援ツール集。チーム分け・ルーレット・あみだくじ・お題ガチャ・ディベートが登録不要・ブラウザだけで使えます。',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    lang: 'ja',
    categories: ['utilities', 'entertainment', 'games'],
    icons: [
      {
        src: '/manifest-icon-192',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/manifest-icon-512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
