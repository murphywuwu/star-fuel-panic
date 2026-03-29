import { NextResponse } from "next/server";
import { buildErrorRecord } from "@/server/apiContract";
import {
  buildTeamPaymentTransferExpectation,
  readTeamEntryLockedCommitment,
  verifySubmittedTxDigest
} from "@/server/devnetChainRuntime";
import { finalizeMutation, parseJsonBody, prepareSignedMutation } from "@/server/mutationRoute";
import { getExpectedTeamPayment, payTeamEntry } from "@/server/teamRuntime";

export const dynamic = "force-dynamic";

function normalizeId(value: string) {
  return value.trim().toLowerCase();
}

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

  const expectedPayment = getExpectedTeamPayment(id);
  if (!expectedPayment) {
    return finalizeMutation(`POST:/api/teams/${id}/pay`, mutation.mutation, {
      status: 404,
      body: buildErrorRecord(mutation.mutation.requestId, 404, "NOT_FOUND", "Team not found").body
    });
  }

  if (!expectedPayment.roomId || !expectedPayment.escrowId) {
    return finalizeMutation(`POST:/api/teams/${id}/pay`, mutation.mutation, {
      status: 409,
      body: buildErrorRecord(
        mutation.mutation.requestId,
        409,
        "CONFLICT",
        "Match escrow is not configured for this team payment"
      ).body
    });
  }

  const expectedTransfer = buildTeamPaymentTransferExpectation(
    expectedPayment.amount,
    String(candidate.walletAddress ?? "")
  );
  if (!expectedTransfer) {
    return finalizeMutation(`POST:/api/teams/${id}/pay`, mutation.mutation, {
      status: 503,
      body: buildErrorRecord(
        mutation.mutation.requestId,
        503,
        "CHAIN_SYNC_ERROR",
        "Team payment wallet address is required for escrow verification"
      ).body
    });
  }

  const txCheck = await verifySubmittedTxDigest(candidate.txDigest ?? "", {
    operation: "team payment",
    expectedTransfer
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

  const paymentCommitment =
    txCheck.ok && txCheck.verified
      ? await readTeamEntryLockedCommitment(String(candidate.txDigest ?? ""))
      : {
          txDigest: String(candidate.txDigest ?? ""),
          roomId: expectedPayment.roomId,
          escrowId: expectedPayment.escrowId,
          teamRef: expectedPayment.teamRef,
          captain: String(candidate.walletAddress ?? ""),
          memberCount: expectedPayment.memberCount,
          quotedAmountLux: expectedPayment.amount,
          lockedAmountBaseUnits: Number(expectedTransfer.exactAmountBaseUnits ?? 0n)
        };

  if (!paymentCommitment) {
    return finalizeMutation(`POST:/api/teams/${id}/pay`, mutation.mutation, {
      status: 400,
      body: buildErrorRecord(
        mutation.mutation.requestId,
        400,
        "TX_REJECTED",
        "Team payment transaction does not contain a TeamEntryLocked event"
      ).body
    });
  }

  if (
    normalizeId(paymentCommitment.roomId) !== normalizeId(expectedPayment.roomId) ||
    normalizeId(paymentCommitment.escrowId) !== normalizeId(expectedPayment.escrowId) ||
    normalizeId(paymentCommitment.teamRef) !== normalizeId(expectedPayment.teamRef) ||
    paymentCommitment.memberCount !== expectedPayment.memberCount ||
    paymentCommitment.quotedAmountLux !== expectedPayment.amount
  ) {
    return finalizeMutation(`POST:/api/teams/${id}/pay`, mutation.mutation, {
      status: 400,
      body: buildErrorRecord(
        mutation.mutation.requestId,
        400,
        "TX_REJECTED",
        "Team payment commitment does not match the expected escrow quote"
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
