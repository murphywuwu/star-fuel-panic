// @ts-nocheck

export type MatchStatus = "lobby" | "pre_start" | "running" | "panic" | "settling" | "settled";

const VALID_TRANSITIONS: Record<MatchStatus, MatchStatus[]> = {
  lobby: ["pre_start"],
  pre_start: ["running"],
  running: ["panic", "settling"],
  panic: ["settling"],
  settling: ["settled"],
  settled: []
};

export function canTransition(fromStatus: MatchStatus, toStatus: MatchStatus) {
  return VALID_TRANSITIONS[fromStatus]?.includes(toStatus) ?? false;
}

export function toEpochMs(input?: string | null) {
  if (!input) {
    return null;
  }
  const value = Date.parse(input);
  if (Number.isNaN(value)) {
    return null;
  }
  return value;
}

export function computeRemainingSec(startAt: string | null | undefined, durationSec: number, nowMs: number) {
  const startMs = toEpochMs(startAt);
  if (startMs == null) {
    return durationSec;
  }

  const elapsedSec = Math.max(0, Math.floor((nowMs - startMs) / 1000));
  return Math.max(0, durationSec - elapsedSec);
}
