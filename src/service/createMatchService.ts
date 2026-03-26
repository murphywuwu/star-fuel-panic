import { createMatchStore, type CreateMatchState } from "@/model/createMatchStore";
import type { ControllerResult } from "@/types/common";
import type { NetworkNode } from "@/types/node";
import type { SearchHit, SolarSystemDetail } from "@/types/solarSystem";

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

  setField<K extends "mode" | "solarSystemId" | "targetNodeIds" | "sponsorshipFee" | "maxTeams" | "entryFee" | "durationHours">(
    key: K,
    value: CreateMatchState[K]
  ) {
    this.store.getState().setField(key, value);
  }

  async searchSystems(query: string): Promise<ControllerResult<SearchHit[]>> {
    const snapshot = this.store.getState();
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      snapshot.setSearchHits([]);
      return ok("SEARCH_RESET", []);
    }

    snapshot.setSearching(true);
    snapshot.setError(null);

    try {
      const payload = await searchSolarSystems(trimmed);
      const hits = payload.hits.filter((hit) => hit.type === "system");
      snapshot.setSearchHits(hits);
      return ok("SYSTEM_SEARCH_LOADED", hits);
    } catch (error) {
      const message = error instanceof Error ? error.message : "system search failed";
      snapshot.setError(message);
      snapshot.setSearchHits([]);
      return fail(message, "NETWORK_ERROR");
    } finally {
      snapshot.setSearching(false);
    }
  }

  async selectSystem(systemId: number): Promise<ControllerResult<SolarSystemDetail>> {
    const snapshot = this.store.getState();
    snapshot.setLoadingSystem(true);
    snapshot.setError(null);

    try {
      const [systemPayload, nodePayload] = await Promise.all([
        fetchSolarSystemDetail(systemId),
        fetchSystemNodes(systemId)
      ]);

      snapshot.setField("solarSystemId", systemPayload.system.systemId);
      snapshot.setField("targetNodeIds", []);
      snapshot.setSelectedSystem(systemPayload.system);
      snapshot.setSystemNodes(nodePayload.nodes);
      snapshot.setSearchHits([]);
      return ok("SYSTEM_SELECTED", systemPayload.system);
    } catch (error) {
      const message = error instanceof Error ? error.message : "system selection failed";
      snapshot.setError(message);
      snapshot.setSelectedSystem(null);
      snapshot.setSystemNodes([]);
      return fail(message, "NETWORK_ERROR");
    } finally {
      snapshot.setLoadingSystem(false);
    }
  }

  toggleTargetNode(objectId: string): ControllerResult<string[]> {
    const snapshot = this.store.getState();
    if (snapshot.mode !== "precision") {
      snapshot.setField("targetNodeIds", []);
      return ok("TARGETS_CLEARED", []);
    }

    const exists = snapshot.targetNodeIds.includes(objectId);
    if (exists) {
      const next = snapshot.targetNodeIds.filter((candidate) => candidate !== objectId);
      snapshot.setField("targetNodeIds", next);
      return ok("TARGET_REMOVED", next);
    }

    if (snapshot.targetNodeIds.length >= 5) {
      const message = "Precision mode supports up to 5 target nodes.";
      snapshot.setError(message);
      return fail(message, "INVALID_INPUT");
    }

    const next = [...snapshot.targetNodeIds, objectId];
    snapshot.setField("targetNodeIds", next);
    return ok("TARGET_ADDED", next);
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

async function searchSolarSystems(query: string): Promise<{ hits: SearchHit[] }> {
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
    cache: "no-store"
  });
  const payload = await response.json();
  if (!response.ok || !Array.isArray(payload?.hits)) {
    throw new Error(payload?.error?.message ?? "system search failed");
  }
  return payload as { hits: SearchHit[] };
}

async function fetchSolarSystemDetail(systemId: number): Promise<{ system: SolarSystemDetail }> {
  const response = await fetch(`/api/solar-systems/${systemId}`, {
    cache: "no-store"
  });
  const payload = await response.json();
  if (!response.ok || !payload?.system) {
    throw new Error(payload?.error?.message ?? "solar system detail failed");
  }
  return payload as { system: SolarSystemDetail };
}

async function fetchSystemNodes(systemId: number): Promise<{ nodes: NetworkNode[] }> {
  const response = await fetch(`/api/network-nodes?solarSystem=${systemId}&isOnline=true&limit=50`, {
    cache: "no-store"
  });
  const payload = await response.json();
  if (!response.ok || !Array.isArray(payload?.nodes)) {
    throw new Error(payload?.error?.message ?? "system node query failed");
  }
  return payload as { nodes: NetworkNode[] };
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
