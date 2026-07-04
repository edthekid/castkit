/** ルーレット・スロット共通のスタイル（動きはGSAPが担当。ここはベース見た目のみ） */
export const ROULETTE_STYLES = `
  /* ─── ホイール当選オーバーレイ（アニメはGSAP） ─── */
  .w-circle {
    position: relative;
    background:
      radial-gradient(circle at 35% 30%, rgba(17,17,20,0.08), transparent 60%),
      #ffffff;
    box-shadow: 0 0 0 3px #a1a1aa, 0 0 20px 4px rgba(17,17,20,0.35);
  }
  .w-text { color: #27272a; }

  /* ─── ホイール針（バウンスはbounceKeyの再マウントでCSS発火） ─── */
  @keyframes needle-bounce {
    0%   { transform: translateY(-50%) rotate(0deg);  }
    25%  { transform: translateY(-50%) rotate(-8deg); }
    55%  { transform: translateY(-50%) rotate(5deg);  }
    75%  { transform: translateY(-50%) rotate(-3deg); }
    100% { transform: translateY(-50%) rotate(0deg);  }
  }
  .needle-hit {
    animation: needle-bounce 0.13s ease-out forwards;
  }

  /* ─── スロット当選ポップアップ（アニメはGSAP） ─── */
  .slot-winner-popup {
    position: absolute;
    top: 50%; left: 50%;
    transform-origin: center center;
    border: 2px solid #d4d4d8;
    background: linear-gradient(135deg, #fafafa 0%, #f0f0f2 50%, #fafafa 100%);
    z-index: 50;
    overflow: hidden;
  }

  /* ─── 当選ポップアップ周りの紙吹雪（アニメはGSAP） ─── */
  .confetti-dot {
    position: absolute;
    top: 50%; left: 50%;
    width: 8px; height: 8px;
    border-radius: 2px;
    pointer-events: none;
    z-index: 60;
  }

  /* ─── スロット中央ハイライト ─── */
  @keyframes slot-center-highlight {
    0%,100% { box-shadow: inset 0 0 0 2px #a1a1aa, 0 0 8px rgba(129,140,248,0.3); }
    50%      { box-shadow: inset 0 0 0 3px #d4d4d8, 0 0 16px rgba(165,180,252,0.6); }
  }
  .slot-center-highlight { animation: slot-center-highlight 1.6s ease-in-out infinite; }
`;
