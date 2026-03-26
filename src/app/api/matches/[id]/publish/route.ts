import { NextResponse } from "next/server";
import { buildErrorRecord } from "@/server/apiContract";
import { verifySubmittedTxDigest } from "@/server/devnetChainRuntime";
import { finalizeMutation, parseJsonBody, prepareSignedMutation } from "@/server/mutationRoute";
import { publishMatch } from "@/server/matchRuntime";

export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

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

  const txCheck = await verifySubmittedTxDigest(String(candidate.publishTxDigest ?? ""), {
    operation: "publish"
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

  const result = await publishMatch({
    matchId: id,
    publishTxDigest: String(candidate.publishTxDigest ?? ""),
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
