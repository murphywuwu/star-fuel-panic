import { NextResponse } from "next/server.js";

export type BountyRoutePayload = {
  walletAddress: string;
  signature: string;
  message: string;
  txDigest: string;
  bountyAmount: number;
};

type BountyMutationSuccess = {
  ok: true;
  match: {
    id: string;
    prizePool: number;
    status: string;
  };
  updatedPrizePool: number;
  contribution: {
    walletAddress: string;
    bountyAmount: number;
    txDigest: string;
    createdAt: string;
  };
};

type BountyMutationFailure = {
  ok: false;
  code: string;
  status: number;
  message: string;
};

export type BountyMutationResult = BountyMutationSuccess | BountyMutationFailure;

export type BountyRouteDeps = {
  applyBounty: (input: {
    matchId: string;
    walletAddress: string;
    bountyAmount: number;
    txDigest: string;
  }) => BountyMutationResult;
  ensureHydrated?: (matchId: string) => Promise<void>;
  afterSuccess?: (matchId: string) => Promise<void>;
};

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code,
        message
      }
    },
    { status }
  );
}

function normalizeAddress(address: string) {
  return address.trim().toLowerCase();
}

function buildTestSignature(address: string, message: string) {
  return `test_sig:${normalizeAddress(address)}:${Buffer.from(message, "utf8").toString("base64url")}`;
}

export function createTestBountySignature(address: string, message: string) {
  return buildTestSignature(address, message);
}

export function isValidBountyTxDigest(txDigest: string) {
  const trimmed = txDigest.trim();
  return /^(0x[a-f0-9]{16,}|tx_[A-Za-z0-9_-]{4,}|local_[A-Za-z0-9]{10,})$/.test(trimmed);
}

export function isValidBountySignature(input: {
  walletAddress: string;
  signature: string;
  message: string;
  matchId: string;
}) {
  const walletAddress = normalizeAddress(input.walletAddress);
  const message = input.message.trim();
  const signature = input.signature.trim();

  if (!message.includes(`FuelFrogPanic:bounty:${input.matchId}`)) {
    return false;
  }

  if (!message.toLowerCase().includes(walletAddress)) {
    return false;
  }

  return signature === buildTestSignature(walletAddress, message);
}

export function parseBountyRoutePayload(body: unknown): BountyRoutePayload | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const candidate = body as Partial<Record<keyof BountyRoutePayload, unknown>>;
  if (
    typeof candidate.walletAddress !== "string" ||
    typeof candidate.signature !== "string" ||
    typeof candidate.message !== "string" ||
    typeof candidate.txDigest !== "string" ||
    typeof candidate.bountyAmount !== "number"
  ) {
    return null;
  }

  return {
    walletAddress: candidate.walletAddress,
    signature: candidate.signature,
    message: candidate.message,
    txDigest: candidate.txDigest,
    bountyAmount: candidate.bountyAmount
  };
}

export function createBountyPostHandler(deps: BountyRouteDeps) {
  return async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    if (deps.ensureHydrated) {
      await deps.ensureHydrated(id);
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse(400, "INVALID_INPUT", "Request body must be valid JSON");
    }

    const payload = parseBountyRoutePayload(body);
    if (!payload) {
      return errorResponse(400, "INVALID_INPUT", "Invalid bounty request payload");
    }

    if (!isValidBountySignature({ ...payload, matchId: id })) {
      return errorResponse(401, "UNAUTHORIZED", "Invalid wallet signature");
    }

    if (!isValidBountyTxDigest(payload.txDigest)) {
      return errorResponse(400, "TX_REJECTED", "Invalid bounty tx digest");
    }

    const result = deps.applyBounty({
      matchId: id,
      walletAddress: normalizeAddress(payload.walletAddress),
      bountyAmount: payload.bountyAmount,
      txDigest: payload.txDigest.trim()
    });

    if (!result.ok) {
      return errorResponse(result.status, result.code, result.message);
    }

    if (deps.afterSuccess) {
      await deps.afterSuccess(id);
    }

    return NextResponse.json({
      ok: true,
      updatedPrizePool: result.updatedPrizePool,
      match: result.match,
      contribution: result.contribution
    });
  };
}
