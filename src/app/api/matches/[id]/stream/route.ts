import {
  buildMatchStreamFrame,
  getMatchStreamEventSignature,
  listMaterializedMatchStreamEvents
} from "@/server/matchRuntime";
import { hydrateRuntimeProjectionFromBackendIfNeeded } from "@/server/matchBackendStore";
import type { MatchStreamEvent } from "@/types/match";

export const dynamic = "force-dynamic";

const encoder = new TextEncoder();

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await hydrateRuntimeProjectionFromBackendIfNeeded({ matchId: id });
  const initialFrame = await buildMatchStreamFrame(id);
  if (!initialFrame) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: {
          code: "INVALID_INPUT",
          message: "Match not found"
        }
      }),
      {
        status: 404,
        headers: { "content-type": "application/json" }
      }
    );
  }

  let timer: ReturnType<typeof setInterval> | null = null;
  let deliveredPersistedCount = 0;
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const clearTimer = () => {
        if (timer) {
          clearInterval(timer);
        }
        timer = null;
      };

      const emitEvent = (event: MatchStreamEvent) => {
        controller.enqueue(encoder.encode(`event: ${event.type}\n`));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      const consumePersistedEvents = () => {
        const persistedEvents = listMaterializedMatchStreamEvents(id);
        const nextEvents = persistedEvents.slice(deliveredPersistedCount);
        deliveredPersistedCount = persistedEvents.length;
        return {
          persistedEvents,
          nextEvents
        };
      };

      const pushFrame = async () => {
        const frame = await buildMatchStreamFrame(id);
        if (!frame) {
          clearTimer();
          controller.close();
          return;
        }

        const { persistedEvents, nextEvents } = consumePersistedEvents();
        for (const event of nextEvents) {
          emitEvent(event);
        }

        const persistedSignatures = new Set(persistedEvents.map((event) => getMatchStreamEventSignature(event)));

        for (const event of frame) {
          if (persistedSignatures.has(getMatchStreamEventSignature(event))) {
            continue;
          }
          emitEvent(event);
        }
      };

      void pushFrame();
      timer = setInterval(() => {
        void pushFrame();
      }, 3000);
    },
    cancel() {
      if (timer) clearInterval(timer);
      timer = null;
    }
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive"
    }
  });
}
