import { createHash, randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import {
  getPersistedIdempotencyRecord,
  putPersistedIdempotencyRecord,
  type PersistedIdempotencyRecord
} from "@/server/runtimeProjectionStore";

type ErrorDetails = Record<string, string | number | boolean>;

export type ApiResponseRecord = {
  status: number;
  body: unknown;
  headers?: Record<string, string>;
};

function isRetryableError(code: string, status: number) {
  if (code === "CHAIN_SYNC_ERROR" || code === "STREAM_UNAVAILABLE") {
    return true;
  }

  return status >= 500 || status === 429;
}

export function getRequestId(request?: Request) {
  const header = request?.headers.get("x-request-id")?.trim();
  return header || randomUUID();
}

export function buildSuccessRecord<T>(
  requestId: string,
  data: T,
  options: { status?: number; stale?: boolean; headers?: Record<string, string> } = {}
): ApiResponseRecord {
  return {
    status: options.status ?? 200,
    headers: options.headers,
    body: {
      ok: true,
      data,
      requestId,
      ...(options.stale ? { stale: true } : {})
    }
  };
}

export function buildErrorRecord(
  requestId: string,
  status: number,
  code: string,
  message: string,
  options: { stale?: boolean; details?: ErrorDetails; headers?: Record<string, string> } = {}
): ApiResponseRecord {
  return {
    status,
    headers: options.headers,
    body: {
      ok: false,
      requestId,
      ...(options.stale ? { stale: true } : {}),
      error: {
        code,
        message,
        retryable: isRetryableError(code, status),
        ...(options.details ? { details: options.details } : {})
      }
    }
  };
}

export function toNextJsonResponse(record: ApiResponseRecord) {
  return NextResponse.json(record.body, {
    status: record.status,
    headers: record.headers
  });
}

function stableHash(value: unknown) {
  return createHash("sha256").update(JSON.stringify(value ?? null)).digest("hex");
}

export type MutationRequestContext =
  | {
      requestId: string;
      idempotencyKey: string;
      requestHash: string;
      replay: PersistedIdempotencyRecord | null;
      failure: null;
    }
  | {
      requestId: string;
      idempotencyKey: null;
      requestHash: null;
      replay: null;
      failure: ApiResponseRecord;
    };

export function prepareMutationRequest(
  request: Request,
  scope: string,
  payload: unknown
): MutationRequestContext {
  const requestId = getRequestId(request);
  const idempotencyKey = request.headers.get("x-idempotency-key")?.trim() || null;

  if (!idempotencyKey) {
    return {
      requestId,
      idempotencyKey: null,
      requestHash: null,
      replay: null,
      failure: buildErrorRecord(
        requestId,
        400,
        "INVALID_INPUT",
        "X-Idempotency-Key header is required for write requests"
      )
    };
  }

  const requestHash = stableHash(payload);
  const replay = getPersistedIdempotencyRecord(scope, idempotencyKey);

  if (replay && replay.requestHash !== requestHash) {
    return {
      requestId,
      idempotencyKey: null,
      requestHash: null,
      replay: null,
      failure: buildErrorRecord(requestId, 409, "CONFLICT", "Idempotency key payload mismatch", {
        details: {
          scope
        }
      })
    };
  }

  return {
    requestId,
    idempotencyKey,
    requestHash,
    replay,
    failure: null
  };
}

export function commitMutationRecord(
  scope: string,
  context: Extract<MutationRequestContext, { failure: null }>,
  record: ApiResponseRecord
) {
  if (record.status >= 500) {
    return;
  }

  putPersistedIdempotencyRecord({
    scope,
    key: context.idempotencyKey,
    requestHash: context.requestHash,
    status: record.status,
    body: record.body,
    headers: record.headers ?? {},
    createdAt: new Date().toISOString()
  });
}

export function replayMutationRecord(record: PersistedIdempotencyRecord): ApiResponseRecord {
  return {
    status: record.status,
    body: record.body,
    headers: record.headers
  };
}
