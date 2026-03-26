import { NextResponse } from "next/server";
import { buildErrorRecord } from "@/server/apiContract";
import { verifySubmittedTxDigest } from "@/server/devnetChainRuntime";
import { finalizeMutation, parseJsonBody, prepareSignedMutation } from "@/server/mutationRoute";
import { payTeamEntry } from "@/server/teamRuntime";

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
    txDigest?: string;
    walletAddress?: string;
    signature?: string;
    message?: string;
  };
  const mutation = await prepareSignedMutation(request, `POST:/api/teams/${id}/pay`, body, {
    walletAddress: candidate.walletAddress ?? "",
    signature: candidate.signature ?? "",
    message: candidate.message ?? "",
    scope: "FuelFrogPanic:pay-team",
    targetId: id
  });
  if (!mutation.ok) {
    return mutation.response;
  }

  const txCheck = await verifySubmittedTxDigest(candidate.txDigest ?? "", {
    operation: "team payment"
  });
  if (!txCheck.ok) {
    return finalizeMutation(`POST:/api/teams/${id}/pay`, mutation.mutation, {
      status: txCheck.code === "TX_REJECTED" ? 400 : 502,
      body: buildErrorRecord(
        mutation.mutation.requestId,
        txCheck.code === "TX_REJECTED" ? 400 : 502,
        txCheck.code,
        txCheck.message
      ).body
    });
  }

  const result = await payTeamEntry({
    teamId: id,
    txDigest: candidate.txDigest ?? "",
    walletAddress: candidate.walletAddress ?? "",
    signature: candidate.signature ?? "",
    message: candidate.message ?? ""
  });

  const response = result as {
    status: number;
    body: Record<string, unknown> & { ok?: false; error?: { code?: string; message?: string } };
  };

  if (response.body.ok === false) {
    const error = response.body as { error?: { code?: string; message?: string } } | undefined;
    return finalizeMutation(`POST:/api/teams/${id}/pay`, mutation.mutation, {
      status: response.status,
      body: buildErrorRecord(
        mutation.mutation.requestId,
        response.status,
        error?.error?.code ?? "UNKNOWN",
        error?.error?.message ?? "Unknown error"
      ).body
    });
  }

  return finalizeMutation(`POST:/api/teams/${id}/pay`, mutation.mutation, {
    status: response.status,
    body: {
      ...response.body,
      requestId: mutation.mutation.requestId
    }
  });
}
