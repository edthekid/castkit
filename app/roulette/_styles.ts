/** ルーレット・スロット共通のアニメーションCSS */
export const ROULETTE_STYLES = `
  /* ─── ホイール当選オーバーレイ ─── */
  @keyframes w-pop {
    0%   { transform: scale(0.2); opacity: 0; }
    65%  { transform: scale(1.1);  opacity: 1; }
    82%  { transform: scale(0.96); }
    100% { transform: scale(1);    opacity: 1; }
  }
  @keyframes w-ring {
    0%, 100% { box-shadow: 0 0 0 3px #a1a1aa, 0 0 20px 4px rgba(17,17,20,0.35); }
    50%       { box-shadow: 0 0 0 6px #d4d4d8, 0 0 36px 10px rgba(17,17,20,0.55); }
  }
  @keyframes w-char {
    0%   { opacity: 0; transform: translateY(8px) scale(0.75); }
    100% { opacity: 1; transform: translateY(0)   scale(1);    }
  }
  .w-circle {
    opacity: 0;
    position: relative;
    background:
      radial-gradient(circle at 35% 30%, rgba(17,17,20,0.08), transparent 60%),
      #ffffff;
    animation:
      w-pop  0.5s  cubic-bezier(0.34,1.56,0.64,1) forwards,
      w-ring 2.0s  ease-in-out 0.5s infinite;
  }
  .w-char {
    display: inline-block;
    animation: w-char 0.38s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  .w-text { color: #27272a; }

  /* ─── ホイール針 ─── */
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

  /* ─── スロット当選ポップアップ ─── */
  @keyframes slot-float-in {
    0%   { opacity:0; transform: translate(-50%,-50%) scale(0.4); }
    60%  { opacity:1; transform: translate(-50%,-50%) scale(1.06); }
    80%  { transform: translate(-50%,-50%) scale(0.97); }
    100% { transform: translate(-50%,-50%) scale(1); }
  }
  @keyframes slot-border-pulse {
    0%,100% { border-color: #d4d4d8; }
    50%      { border-color: #18181b; }
  }
  .slot-winner-popup {
    position: absolute;
    top: 50%; left: 50%;
    transform-origin: center center;
    border: 2px solid #d4d4d8;
    background: linear-gradient(135deg, #fafafa 0%, #f0f0f2 50%, #fafafa 100%);
    animation:
      slot-float-in     0.6s cubic-bezier(0.34,1.56,0.64,1) forwards,
      slot-border-pulse  1.4s ease-in-out 0.6s infinite;
    z-index: 50;
    overflow: hidden;
  }

  /* ─── 当選ポップアップ周りの紙吹雪 ─── */
  @keyframes confetti-pop {
    0%   { opacity: 0; transform: translate(0,0) scale(0.4) rotate(0deg); }
    15%  { opacity: 1; }
    100% { opacity: 0; transform: translate(var(--cx), var(--cy)) scale(1) rotate(var(--cr)); }
  }
  .confetti-dot {
    position: absolute;
    top: 50%; left: 50%;
    width: 8px; height: 8px;
    border-radius: 2px;
    pointer-events: none;
    z-index: 60;
    animation: confetti-pop 0.9s cubic-bezier(0.2,0.8,0.3,1) 0.55s both;
  }

  /* ─── スロット中央ハイライト ─── */
  @keyframes slot-center-highlight {
    0%,100% { box-shadow: inset 0 0 0 2px #a1a1aa, 0 0 8px rgba(129,140,248,0.3); }
    50%      { box-shadow: inset 0 0 0 3px #d4d4d8, 0 0 16px rgba(165,180,252,0.6); }
  }
  .slot-center-highlight { animation: slot-center-highlight 1.6s ease-in-out infinite; }
`;
