import { NextResponse } from "next/server";
import { appendPersistedFuelEvents, type PersistedFuelEvent } from "@/server/runtimeProjectionStore";
import type { ScoreEvent } from "@/types/fuelMission";

export const dynamic = "force-dynamic";

function nowIso() {
  return new Date().toISOString();
}

function toPersistedFuelEvent(matchId: string, scoreEvent: ScoreEvent): PersistedFuelEvent {
  return {
    matchId,
    eventId: scoreEvent.id,
    txDigest: scoreEvent.txDigest,
    senderWallet: scoreEvent.memberWallet,
    teamId: scoreEvent.teamId,
    assemblyId: scoreEvent.assemblyId,
    fuelAdded: scoreEvent.fuelDelta,
    fuelTypeId: scoreEvent.fuelTypeId,
    fuelGrade: scoreEvent.fuelGrade.grade,
    fuelGradeBonus: scoreEvent.fuelGradeBonus,
    urgencyWeight: scoreEvent.urgencyWeight,
    panicMultiplier: scoreEvent.panicMultiplier,
    scoreDelta: scoreEvent.score,
    chainTs: scoreEvent.chainTs,
    createdAt: typeof scoreEvent.createdAt === "number" ? new Date(scoreEvent.createdAt).toISOString() : nowIso()
  };
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "INVALID_INPUT",
          message: "Invalid JSON body"
        }
      },
      { status: 400 }
    );
  }

  if (!payload || typeof payload !== "object" || !("scoreEvent" in payload)) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "INVALID_INPUT",
          message: "scoreEvent payload is required"
        }
      },
      { status: 400 }
    );
  }

  const scoreEvent = (payload as { scoreEvent: ScoreEvent }).scoreEvent;
  if (!scoreEvent || typeof scoreEvent !== "object" || scoreEvent.matchId !== id) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "INVALID_INPUT",
          message: "scoreEvent.matchId must match route id"
        }
      },
      { status: 400 }
    );
  }

  appendPersistedFuelEvents([toPersistedFuelEvent(id, scoreEvent)]);

  return NextResponse.json(
    {
      ok: true,
      data: {
        stored: 1
      }
    },
    { status: 202 }
  );
}
