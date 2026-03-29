import { NextResponse } from "next/server";
import { buildErrorRecord } from "@/server/apiContract";
import {
  buildPublishTransferExpectation,
  readMatchPublishedCommitment,
  verifySubmittedTxDigest
} from "@/server/devnetChainRuntime";
import { finalizeMutation, parseJsonBody, prepareSignedMutation } from "@/server/mutationRoute";
import { hydrateRuntimeProjectionFromBackendIfNeeded } from "@/server/matchBackendStore";
import { getMatchDetail } from "@/server/matchRuntime";
import { publishMatch } from "@/server/matchRuntime";

export const dynamic = "force-dynamic";

function toMockObjectId(seed: string) {
  const hex = seed.trim().toLowerCase().replace(/[^a-f0-9]/g, "");
  return `0x${hex.padStart(64, "0").slice(-64)}`;
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await hydrateRuntimeProjectionFromBackendIfNeeded({ matchId: id });

  const parsed = await parseJsonBody(request);
  if (!parsed.ok) {
    return NextResponse.json(
      buildErrorRecord(crypto.randomUUID(), 400, "INVALID_INPUT", "Request body must be valid JSON").body,
      { status: 400 }
    );
  }
  const body = parsed.body;

  const candidate = (body ?? {}) as {
    publishTxDigest?: unknown;
    walletAddress?: unknown;
    signature?: unknown;
    message?: unknown;
  };
  const mutation = await prepareSignedMutation(request, `POST:/api/matches/${id}/publish`, body, {
    walletAddress: String(candidate.walletAddress ?? ""),
    signature: String(candidate.signature ?? ""),
    message: String(candidate.message ?? ""),
    scope: "FuelFrogPanic:publish-match",
    targetId: id
  });
  if (!mutation.ok) {
    return mutation.response;
  }

  const detail = getMatchDetail(id);
  if (!detail) {
    return finalizeMutation(`POST:/api/matches/${id}/publish`, mutation.mutation, {
      status: 404,
      body: buildErrorRecord(mutation.mutation.requestId, 404, "NOT_FOUND", "match not found").body
    });
  }

  const expectedTransfer = buildPublishTransferExpectation(
    detail.match.sponsorshipFee ?? 0,
    String(candidate.walletAddress ?? "")
  );
  if (!expectedTransfer) {
    return finalizeMutation(`POST:/api/matches/${id}/publish`, mutation.mutation, {
      status: 503,
      body: buildErrorRecord(
        mutation.mutation.requestId,
        503,
        "CHAIN_SYNC_ERROR",
        "Publish wallet address is required for escrow verification"
      ).body
    });
  }

  const txCheck = await verifySubmittedTxDigest(String(candidate.publishTxDigest ?? ""), {
    operation: "publish",
    expectedTransfer
  });
  if (!txCheck.ok) {
    return finalizeMutation(`POST:/api/matches/${id}/publish`, mutation.mutation, {
      status: txCheck.code === "TX_REJECTED" ? 400 : 502,
      body: buildErrorRecord(
        mutation.mutation.requestId,
        txCheck.code === "TX_REJECTED" ? 400 : 502,
        txCheck.code,
        txCheck.message
      ).body
    });
  }

  const publishCommitment =
    txCheck.ok && txCheck.verified
      ? await readMatchPublishedCommitment(String(candidate.publishTxDigest ?? ""))
      : {
          txDigest: String(candidate.publishTxDigest ?? ""),
          roomId: toMockObjectId(`room:${id}`),
          escrowId: toMockObjectId(`escrow:${String(candidate.publishTxDigest ?? "")}`),
          mode: detail.match.creationMode,
          solarSystemId: detail.match.solarSystemId ?? null,
          targetNodeCount: detail.match.targetNodeIds.length
        };
  if (!publishCommitment) {
    return finalizeMutation(`POST:/api/matches/${id}/publish`, mutation.mutation, {
      status: 400,
      body: buildErrorRecord(
        mutation.mutation.requestId,
        400,
        "TX_REJECTED",
        "Publish transaction does not contain a MatchPublished event"
      ).body
    });
  }
  if (txCheck.verified && !publishCommitment.escrowId) {
    return finalizeMutation(`POST:/api/matches/${id}/publish`, mutation.mutation, {
      status: 400,
      body: buildErrorRecord(
        mutation.mutation.requestId,
        400,
        "TX_REJECTED",
        "Publish transaction does not create a match escrow"
      ).body
    });
  }

  const result = await publishMatch({
    matchId: id,
    publishTxDigest: String(candidate.publishTxDigest ?? ""),
    publishCommitment,
    idempotencyKey: request.headers.get("X-Idempotency-Key") ?? undefined,
    walletAddress: String(candidate.walletAddress ?? ""),
    signature: String(candidate.signature ?? ""),
    message: String(candidate.message ?? "")
  });

  if (!result.ok) {
    return finalizeMutation(`POST:/api/matches/${id}/publish`, mutation.mutation, {
      status: result.error.status,
      body: buildErrorRecord(
        mutation.mutation.requestId,
        result.error.status,
        result.error.code,
        result.error.message
      ).body
    });
  }

  return finalizeMutation(`POST:/api/matches/${id}/publish`, mutation.mutation, {
    status: 200,
    body: {
      ...result.data,
      requestId: mutation.mutation.requestId
    }
  });
}
