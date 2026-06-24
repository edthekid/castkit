export type DebatePhase =
  | 'idle'
  | 'topic-drawing'
  | 'faction-drawing'
  | 'ready'
  | 'running'
  | 'done';

export const TOPIC_DRAW_MS   = 1400;
export const FACTION_DRAW_MS = 1200;

export const TIMER_OPTIONS = [60, 180, 300] as const;
export type TimerOption = typeof TIMER_OPTIONS[number];
