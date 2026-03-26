import {
  buildErrorRecord,
  commitMutationRecord,
  prepareMutationRequest,
  replayMutationRecord,
  toNextJsonResponse,
  type ApiResponseRecord,
  type MutationRequestContext
} from "@/server/apiContract";
import {
  verifyScopedWalletSignature,
  type SignedCommand
} from "@/server/walletSignature";

export async function parseJsonBody(request: Request) {
  try {
    return {
      ok: true as const,
      body: await request.json()
    };
  } catch {
    return {
      ok: false as const
    };
  }
}

export async function prepareSignedMutation(
  request: Request,
  scope: string,
  payload: unknown,
  signature: SignedCommand & { scope: string; targetId: string }
) {
  const mutation = prepareMutationRequest(request, scope, payload);

  if (mutation.failure) {
    return {
      ok: false as const,
      response: toNextJsonResponse(mutation.failure)
    };
  }

  if (mutation.replay) {
    return {
      ok: false as const,
      response: toNextJsonResponse(replayMutationRecord(mutation.replay))
    };
  }

  const signed = await verifyScopedWalletSignature(signature);
  if (!signed) {
    return {
      ok: false as const,
      response: toNextJsonResponse(
        buildErrorRecord(mutation.requestId, 401, "UNAUTHORIZED", "Wallet signature is invalid")
      )
    };
  }

  return {
    ok: true as const,
    mutation
  };
}

export function finalizeMutation(
  scope: string,
  mutation: Extract<MutationRequestContext, { failure: null }>,
  record: ApiResponseRecord
) {
  commitMutationRecord(scope, mutation, record);
  return toNextJsonResponse(record);
}
