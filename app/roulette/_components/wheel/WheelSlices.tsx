import { generateColors, polarToXY } from '../../_utils';

const FONT = "'Noto Sans JP','Hiragino Sans','Yu Gothic',sans-serif";

export function WheelSlices({ items }: { items: string[] }) {
  const cx = 100, cy = 100, r = 88;
  const n = items.length;

  // 候補者0人
  if (n === 0) {
    return (
      <>
        <circle cx={cx} cy={cy} r={97} fill="none" stroke="#18181b" strokeWidth="6" />
        <circle cx={cx} cy={cy} r={88} fill="#f4f4f5" />
        <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="middle"
          fill="#18181b" fontSize="7" fontWeight="bold" fontFamily={FONT}>
          候補者がいません
        </text>
        <text x={cx} y={cy + 7} textAnchor="middle" dominantBaseline="middle"
          fill="#71717a" fontSize="5.5" fontFamily={FONT}>
          リストに追加してください
        </text>
      </>
    );
  }

  const colors = generateColors(n);

  // 候補者1人
  if (n === 1) {
    const name = items[0];
    const len = Array.from(name).length;
    const fs = len <= 2 ? 16 : len <= 4 ? 12 : len <= 6 ? 9 : 7;
    return (
      <>
        <circle cx={cx} cy={cy} r={r} fill={colors[0]} />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
          fill="#ffffff" fontSize={fs} fontWeight="bold" fontFamily={FONT}>
          {name}
        </text>
      </>
    );
  }

  // 候補者2人以上
  const slice = 360 / n;
  const fs = n <= 5 ? 7.5 : n <= 8 ? 6 : n <= 12 ? 5 : 4;

  /** 背景が黒なら白文字、白なら黒文字にして可読性を保つ */
  const textColorFor = (bg: string) => (bg === '#ffffff' ? '#18181b' : '#ffffff');

  return (
    <>
      <circle cx={cx} cy={cy} r={97} fill="none" stroke="#18181b" strokeWidth="6" />
      {items.map((name, i) => {
        const startAngle = slice * i;
        const [x1r, y1r] = polarToXY(cx, cy, r, startAngle).map(v => Math.round(v * 1000) / 1000) as [number, number];
        const [x2r, y2r] = polarToXY(cx, cy, r, slice * (i + 1)).map(v => Math.round(v * 1000) / 1000) as [number, number];
        const largeArc   = slice > 180 ? 1 : 0;
        const d          = `M${cx},${cy} L${x1r},${y1r} A${r},${r} 0 ${largeArc},1 ${x2r},${y2r} Z`;
        const midAngle   = startAngle + slice / 2;
        const [tx, ty]   = polarToXY(cx, cy, r * 0.60, midAngle);
        // SSR/CSRのhydrationエラー防止: 浮動小数点を固定桁に丸める
        const txR = Math.round(tx * 1000) / 1000;
        const tyR = Math.round(ty * 1000) / 1000;
        const rotDeg = Math.round((midAngle - 90) * 1000) / 1000;

        return (
          <g key={i}>
            <path d={d} fill={colors[i]} stroke="#18181b" strokeWidth="1.5" />
            <text
              x={txR} y={tyR}
              textAnchor="middle" dominantBaseline="middle"
              transform={`rotate(${rotDeg},${txR},${tyR})`}
              fill={textColorFor(colors[i])} fontSize={fs} fontWeight="bold" fontFamily={FONT}
            >
              {name}
            </text>
          </g>
        );
      })}
    </>
  );
}
