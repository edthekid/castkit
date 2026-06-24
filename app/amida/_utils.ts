import type { Rung, TracePath } from './_constants';
import {
  SVG_PADDING_X, SVG_PADDING_TOP, SVG_PADDING_BTM,
  COL_WIDTH, ROW_HEIGHT, MIN_RUNGS_PER_COL,
} from './_constants';

// ─── SVGサイズ計算 ───────────────────────────────────────

export function calcColWidth(n: number, containerWidth: number): number {
  const maxWidth = containerWidth - SVG_PADDING_X * 2;
  const dynamic  = n > 1 ? Math.floor(maxWidth / (n - 1)) : COL_WIDTH;
  return Math.min(COL_WIDTH, Math.max(40, dynamic));
}

export function calcSvgWidth(n: number, colWidth: number = COL_WIDTH): number {
  return SVG_PADDING_X * 2 + colWidth * (n - 1);
}

export function calcSvgHeight(rows: number): number {
  return SVG_PADDING_TOP + SVG_PADDING_BTM + ROW_HEIGHT * rows;
}

export function colX(colIndex: number, colWidth: number = COL_WIDTH): number {
  return SVG_PADDING_X + colIndex * colWidth;
}

export function rowY(rowIndex: number): number {
  return SVG_PADDING_TOP + rowIndex * ROW_HEIGHT;
}

export function bottomY(rows: number): number {
  return SVG_PADDING_TOP + rows * ROW_HEIGHT;
}

// ─── あみだ生成 ──────────────────────────────────────────

export function generateRungs(n: number, rows: number): Rung[] {
  const rungs: Rung[] = [];
  const targetMin = Math.max(MIN_RUNGS_PER_COL, Math.floor(rows * 0.35));
  const targetMax = Math.floor(rows * 0.6);
  // 上下のバッファ行数（横棒を置かない）
  const BUFFER = Math.max(2, Math.floor(rows * 0.08));

  for (let row = 0; row < rows; row++) {
    // 上端・下端バッファ行は横棒なし
    if (row < BUFFER || row >= rows - BUFFER) continue;
    const used = new Set<number>();
    for (let col = 0; col < n - 1; col++) {
      if (used.has(col)) continue;
      const colCount = rungs.filter((r) => r.col === col).length;
      const prob = colCount >= targetMax ? 0.1 : 0.48;
      if (Math.random() < prob) {
        rungs.push({ row, col });
        used.add(col);
        used.add(col + 1);
      }
    }
  }

  // 少なすぎる列を補完（バッファ外のみ）
  for (let col = 0; col < n - 1; col++) {
    const existing = new Set(rungs.filter((r) => r.col === col).map((r) => r.row));
    let added = existing.size;
    for (let row = BUFFER; row < rows - BUFFER && added < targetMin; row++) {
      if (existing.has(row)) continue;
      const leftConflict  = rungs.some((r) => r.row === row && r.col === col - 1);
      const rightConflict = rungs.some((r) => r.row === row && r.col === col + 1);
      if (!leftConflict && !rightConflict) {
        rungs.push({ row, col });
        existing.add(row);
        added++;
      }
    }
  }

  return rungs;
}

// ─── トレース計算（colWidthを受け取って正確な座標を計算） ──

export function calcTracePath(
  startCol: number,
  rungs: Rung[],
  rows: number,
  colWidth: number = COL_WIDTH,
): { points: { x: number; y: number }[]; endCol: number } {
  const points: { x: number; y: number }[] = [];
  let col = startCol;

  points.push({ x: colX(col, colWidth), y: SVG_PADDING_TOP - 20 });
  points.push({ x: colX(col, colWidth), y: rowY(0) });

  for (let row = 0; row < rows; row++) {
    const goRight = rungs.some((r) => r.row === row && r.col === col);
    const goLeft  = rungs.some((r) => r.row === row && r.col === col - 1);

    if (goRight) {
      points.push({ x: colX(col,     colWidth), y: rowY(row) });
      points.push({ x: colX(col + 1, colWidth), y: rowY(row) });
      col = col + 1;
    } else if (goLeft) {
      points.push({ x: colX(col,     colWidth), y: rowY(row) });
      points.push({ x: colX(col - 1, colWidth), y: rowY(row) });
      col = col - 1;
    }

    if (row < rows - 1) {
      points.push({ x: colX(col, colWidth), y: rowY(row + 1) });
    }
  }

  points.push({ x: colX(col, colWidth), y: bottomY(rows) });
  return { points, endCol: col };
}

export function calcAllTracePaths(
  n: number,
  rungs: Rung[],
  rows: number,
  colWidth: number = COL_WIDTH,
): TracePath[] {
  return Array.from({ length: n }, (_, i) => {
    const { points, endCol } = calcTracePath(i, rungs, rows, colWidth);
    return { playerIndex: i, points, resultIndex: endCol };
  });
}

export function pointsToPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
}

export function calcPathLength(points: { x: number; y: number }[]): number {
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    len += Math.sqrt(dx * dx + dy * dy);
  }
  return len;
}
