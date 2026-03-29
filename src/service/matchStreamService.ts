"use client";

import type { MatchScoreboardSnapshot, MatchStreamEvent } from "@/types/match";

export type MatchStreamHealth = "connecting" | "healthy" | "stale" | "disconnected";

type ApiEnvelope<T> =
  | {
      ok: true;
      data: T;
      requestId?: string;
    }
  | {
      ok: false;
      error?: {
        code?: string;
        message?: string;
      };
      requestId?: string;
    };

type HealthListener = (health: MatchStreamHealth) => void;

const STREAM_EVENT_TYPES: MatchStreamEvent["type"][] = [
  "score_update",
  "phase_change",
  "panic_mode",
  "node_status",
  "settlement_start",
  "settlement_complete",
  "heartbeat"
];
const STREAM_RETRY_MS = 3_000;

function buildScoreboardUrl(matchId: string) {
  return `/api/matches/${encodeURIComponent(matchId)}/scoreboard`;
}

function buildStreamUrl(matchId: string) {
  return `/api/matches/${encodeURIComponent(matchId)}/stream`;
}

function setHealth(listener: HealthListener | undefined, health: MatchStreamHealth) {
  listener?.(health);
}

function parseStreamPayload(data: string): MatchStreamEvent | null {
  try {
    return JSON.parse(data) as MatchStreamEvent;
  } catch {
    return null;
  }
}

class MatchStreamServiceImpl {
  async getScoreboard(matchId: string): Promise<MatchScoreboardSnapshot> {
    const response = await fetch(buildScoreboardUrl(matchId), {
      method: "GET",
      headers: {
        Accept: "application/json"
      },
      cache: "no-store"
    });

    const payload = (await response.json()) as ApiEnvelope<MatchScoreboardSnapshot>;
    if (!response.ok || !payload.ok) {
      const message = payload.ok ? "Failed to load match scoreboard" : payload.error?.message ?? "Failed to load match scoreboard";
      throw new Error(message);
    }

    return payload.data;
  }

  async subscribe(
    matchId: string,
    onEvent: (event: MatchStreamEvent) => void,
    onHealthChange?: HealthListener
  ): Promise<() => void> {
    if (typeof window === "undefined") {
      setHealth(onHealthChange, "disconnected");
      return () => undefined;
    }

    if (typeof EventSource === "undefined") {
      return this.subscribeWithPolling(matchId, onEvent, onHealthChange);
    }

    setHealth(onHealthChange, "connecting");

    const stream = new EventSource(buildStreamUrl(matchId));
    let closed = false;

    const handleMessage = (message: MessageEvent<string>) => {
      const event = parseStreamPayload(message.data);
      if (!event) {
        setHealth(onHealthChange, "stale");
        return;
      }

      onEvent(event);
      setHealth(onHealthChange, "healthy");
    };

    stream.onopen = () => {
      setHealth(onHealthChange, "healthy");
    };

    stream.onerror = () => {
      if (!closed) {
        setHealth(onHealthChange, "stale");
      }
    };

    for (const eventType of STREAM_EVENT_TYPES) {
      stream.addEventListener(eventType, handleMessage as EventListener);
    }

    return () => {
      closed = true;
      stream.close();
      setHealth(onHealthChange, "disconnected");
    };
  }

  private async subscribeWithPolling(
    matchId: string,
    onEvent: (event: MatchStreamEvent) => void,
    onHealthChange?: HealthListener
  ): Promise<() => void> {
    let disposed = false;

    const poll = async () => {
      try {
        const scoreboard = await this.getScoreboard(matchId);
        if (disposed) {
          return;
        }

        onEvent({
          type: "score_update",
          matchId,
          scoreboard
        });
        onEvent({
          type: "heartbeat",
          matchId,
          serverTime: new Date().toISOString()
        });
        setHealth(onHealthChange, "healthy");
      } catch {
        if (!disposed) {
          setHealth(onHealthChange, "stale");
        }
      }
    };

    setHealth(onHealthChange, "connecting");
    await poll();

    const timer = window.setInterval(() => {
      void poll();
    }, STREAM_RETRY_MS);

    return () => {
      disposed = true;
      window.clearInterval(timer);
      setHealth(onHealthChange, "disconnected");
    };
  }
}

export const matchStreamService = new MatchStreamServiceImpl();
