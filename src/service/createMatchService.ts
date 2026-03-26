import { createMatchStore, type CreateMatchState } from "@/model/createMatchStore";
import type { ControllerResult } from "@/types/common";

function normalizeWallet(walletAddress: string) {
  return walletAddress.trim().toLowerCase();
}

function buildSignedPayload(scope: string, targetId: string, walletAddress: string) {
  const normalized = normalizeWallet(walletAddress);
  const message = `${scope}:${targetId}\nwallet=${normalized}\nts=${new Date().toISOString()}`;
  return {
    walletAddress: normalized,
    signature: `dev:${normalized}:${message}`,
    message
  };
}

function ok<T>(message: string, payload?: T): ControllerResult<T> {
  return {
    ok: true,
    message,
    payload
  };
}

function fail(message: string, errorCode = "UNKNOWN"): ControllerResult<never> {
  return {
    ok: false,
    message,
    errorCode
  };
}

class CreateMatchService {
  private get store() {
    return createMatchStore;
  }

  subscribe = (listener: () => void): (() => void) => this.store.subscribe(listener);

  getSnapshot = () => this.store.getState();

  setField<K extends keyof Omit<CreateMatchState, "loading" | "error" | "draftId">>(
    key: K,
    value: CreateMatchState[K]
  ) {
    this.store.getState().setField(key, value);
  }

  async createDraft(walletAddress: string): Promise<ControllerResult<string>> {
    const snapshot = this.store.getState();
    if (!snapshot.solarSystemId) {
      this.store.getState().setError("solarSystemId is required");
      return fail("solarSystemId is required", "INVALID_INPUT");
    }

    this.store.getState().setLoading(true);
    this.store.getState().setError(null);

    try {
      const payload = await createMatchDraftRequest({
        mode: snapshot.mode,
        solarSystemId: snapshot.solarSystemId,
        targetNodeIds: snapshot.targetNodeIds,
        sponsorshipFee: snapshot.sponsorshipFee,
        maxTeams: snapshot.maxTeams,
        entryFee: snapshot.entryFee,
        durationHours: snapshot.durationHours,
        walletAddress
      });

      if (!payload?.match?.id) {
        const message = payload?.error?.message ?? "create draft failed";
        this.store.getState().setError(message);
        return fail(message, payload?.error?.code ?? "UNKNOWN");
      }

      this.store.getState().setDraftId(payload.match.id);
      return ok("MATCH_DRAFT_CREATED", payload.match.id as string);
    } finally {
      this.store.getState().setLoading(false);
    }
  }

  async publish(walletAddress: string): Promise<ControllerResult<void>> {
    const snapshot = this.store.getState();
    if (!snapshot.draftId) {
      this.store.getState().setError("no draft");
      return fail("no draft", "INVALID_INPUT");
    }

    this.store.getState().setLoading(true);
    this.store.getState().setError(null);

    try {
      const payload = await publishMatchRequest({
        matchId: snapshot.draftId,
        walletAddress,
        idempotencyKey: `${snapshot.draftId}:${walletAddress}`
      });

      if (!payload?.match?.id) {
        const message = payload?.error?.message ?? "publish failed";
        this.store.getState().setError(message);
        return fail(message, payload?.error?.code ?? "UNKNOWN");
      }

      return ok("MATCH_PUBLISHED");
    } finally {
      this.store.getState().setLoading(false);
    }
  }

  reset() {
    this.store.getState().reset();
  }
}

async function createMatchDraftRequest(payload: {
  mode: "free" | "precision";
  solarSystemId: number;
  targetNodeIds: string[];
  sponsorshipFee: number;
  maxTeams: number;
  entryFee: number;
  durationHours: number;
  walletAddress: string;
}) {
  const idempotencyKey = crypto.randomUUID();
  const signed = buildSignedPayload("FuelFrogPanic:create-match-draft", "hosted", payload.walletAddress);
  const response = await fetch("/api/matches", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Idempotency-Key": idempotencyKey
    },
    body: JSON.stringify({
      ...payload,
      ...signed
    })
  });
  return response.json();
}

async function publishMatchRequest(payload: { matchId: string; walletAddress: string; idempotencyKey: string }) {
  const signed = buildSignedPayload("FuelFrogPanic:publish-match", payload.matchId, payload.walletAddress);
  const publishTxDigest = `local_${crypto.randomUUID().replace(/-/g, "")}`;
  const response = await fetch(`/api/matches/${payload.matchId}/publish`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Idempotency-Key": payload.idempotencyKey || crypto.randomUUID()
    },
    body: JSON.stringify({
      ...payload,
      publishTxDigest,
      ...signed
    })
  });
  return response.json();
}

const createMatchService = new CreateMatchService();

export { createMatchDraftRequest as createMatchDraft, createMatchService, publishMatchRequest as publishMatch };
