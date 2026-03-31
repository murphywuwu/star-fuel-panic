import { createMatchStore, type CreateMatchState } from "@/model/createMatchStore";
import { walletService } from "@/service/walletService";
import type { ControllerResult } from "@/types/common";
import type { NetworkNode } from "@/types/node";
import type { SearchHit, SolarSystemDetail } from "@/types/solarSystem";
import { describePackageAvailabilityMismatch } from "@/utils/suiPackageProbe";
import { toBaseUnits } from "@/utils/tokenAmount";
import { Transaction, coinWithBalance } from "@mysten/sui/transactions";

const FUEL_FROG_PACKAGE_ID =
  process.env.NEXT_PUBLIC_FUEL_FROG_PACKAGE_ID?.trim() ??
  process.env.NEXT_PUBLIC_FUEL_FROG_CONTRACT_PACKAGE_ID?.trim() ??
  "";
const SUI_NETWORK_LABEL = process.env.NEXT_PUBLIC_SUI_NETWORK?.trim() || "configured";
const LUX_COIN_TYPE = process.env.NEXT_PUBLIC_LUX_COIN_TYPE?.trim() || "0x2::sui::SUI";
const LUX_DECIMALS = Number(process.env.NEXT_PUBLIC_LUX_DECIMALS ?? Number.NaN);

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
  private systemSearchRequestId = 0;

  private activeSystemSearchController: AbortController | null = null;

  private get store() {
    return createMatchStore;
  }

  private clearSystemSearchResults() {
    const snapshot = this.store.getState();
    snapshot.setSearchHits([]);
    snapshot.setSearching(false);
  }

  private cancelActiveSystemSearch() {
    this.systemSearchRequestId += 1;
    this.activeSystemSearchController?.abort();
    this.activeSystemSearchController = null;
  }

  subscribe = (listener: () => void): (() => void) => this.store.subscribe(listener);

  getSnapshot = () => this.store.getState();

  setField<K extends "mode" | "solarSystemId" | "targetNodeIds" | "sponsorshipFee" | "maxTeams" | "teamSize" | "entryFee" | "durationHours">(
    key: K,
    value: CreateMatchState[K]
  ) {
    this.store.getState().setField(key, value);
  }

  async searchSystems(query: string): Promise<ControllerResult<SearchHit[]>> {
    const snapshot = this.store.getState();
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      this.cancelActiveSystemSearch();
      this.clearSystemSearchResults();
      return ok("SEARCH_RESET", []);
    }

    const requestId = this.systemSearchRequestId + 1;
    this.cancelActiveSystemSearch();
    const controller = new AbortController();
    this.activeSystemSearchController = controller;
    this.systemSearchRequestId = requestId;

    snapshot.setSearching(true);
    snapshot.setError(null);

    try {
      const payload = await searchSolarSystems(trimmed, controller.signal);
      if (requestId !== this.systemSearchRequestId) {
        return ok("SEARCH_STALE", []);
      }

      const hits = payload.hits.filter((hit) => hit.type === "system");
      snapshot.setSearchHits(hits);
      return ok("SYSTEM_SEARCH_LOADED", hits);
    } catch (error) {
      const aborted = controller.signal.aborted || (error instanceof Error && error.name === "AbortError");
      if (aborted || requestId !== this.systemSearchRequestId) {
        return ok("SEARCH_ABORTED", []);
      }

      const message = error instanceof Error ? error.message : "system search failed";
      snapshot.setError(message);
      snapshot.setSearchHits([]);
      return fail(message, "NETWORK_ERROR");
    } finally {
      if (requestId === this.systemSearchRequestId) {
        snapshot.setSearching(false);
        if (this.activeSystemSearchController === controller) {
          this.activeSystemSearchController = null;
        }
      }
    }
  }

  async selectSystem(systemId: number): Promise<ControllerResult<SolarSystemDetail>> {
    const snapshot = this.store.getState();
    this.cancelActiveSystemSearch();
    this.clearSystemSearchResults();
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
        teamSize: snapshot.teamSize,
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

  async publish(walletAddress: string, publishTxDigest: string): Promise<ControllerResult<void>> {
    const snapshot = this.store.getState();
    if (!snapshot.draftId) {
      this.store.getState().setError("no draft");
      return fail("no draft", "INVALID_INPUT");
    }

    if (!publishTxDigest.trim()) {
      this.store.getState().setError("publish transaction digest is required");
      return fail("publish transaction digest is required", "INVALID_INPUT");
    }

    this.store.getState().setLoading(true);
    this.store.getState().setError(null);

    try {
      const payload = await publishMatchRequest({
        matchId: snapshot.draftId,
        publishTxDigest,
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

  async executePublishEscrowTransaction(walletAddress: string): Promise<ControllerResult<{ txDigest: string }>> {
    const snapshot = this.store.getState();
    if (!snapshot.solarSystemId || !snapshot.draftId) {
      return fail("match draft is not ready", "INVALID_INPUT");
    }

    if (!FUEL_FROG_PACKAGE_ID) {
      return fail("fuel frog package id is not configured", "E_WALLET_UNAVAILABLE");
    }

    try {
      const packageExists = await walletService.objectExists(FUEL_FROG_PACKAGE_ID);
      if (!packageExists) {
        const hint = await describePackageAvailabilityMismatch(FUEL_FROG_PACKAGE_ID, SUI_NETWORK_LABEL);
        return fail(
          hint,
          "E_WALLET_UNAVAILABLE"
        );
      }

      const tx = new Transaction();
      tx.setSender(walletAddress);

      const sponsorshipCoin = coinWithBalance({
        balance: toBaseUnits(snapshot.sponsorshipFee, LUX_DECIMALS),
        type: LUX_COIN_TYPE,
        useGasCoin: LUX_COIN_TYPE === "0x2::sui::SUI"
      });

      tx.moveCall({
        target: `${FUEL_FROG_PACKAGE_ID}::fuel_frog_panic::publish_match_with_sponsorship`,
        typeArguments: [LUX_COIN_TYPE],
        arguments: [
          tx.pure.u8(snapshot.mode === "precision" ? 1 : 0),
          tx.pure.u64(snapshot.solarSystemId),
          tx.pure.vector("address", snapshot.targetNodeIds),
          tx.pure.u64(snapshot.sponsorshipFee),
          tx.pure.u64(snapshot.maxTeams),
          tx.pure.u64(snapshot.entryFee),
          tx.pure.u64(snapshot.durationHours),
          tx.pure.u64(0),
          tx.pure.vector("u8", Array.from(new TextEncoder().encode(`draft:${snapshot.draftId}:teamSize=${snapshot.teamSize}`))),
          sponsorshipCoin
        ]
      });

      const result = await walletService.executeTransaction(tx);
      return ok("MATCH_ESCROW_PUBLISH_TX_EXECUTED", result);
    } catch (error) {
      const message = this.resolveEscrowTxError(error);
      return fail(message, "E_WALLET_NETWORK");
    }
  }

  private resolveEscrowTxError(error: unknown) {
    const message = error instanceof Error ? error.message : "match sponsorship escrow transaction failed";
    if (message.includes(FUEL_FROG_PACKAGE_ID) && /object .*not found/i.test(message)) {
      return `escrow package ${FUEL_FROG_PACKAGE_ID} is not available on ${SUI_NETWORK_LABEL}; check wallet network and NEXT_PUBLIC_FUEL_FROG_PACKAGE_ID`;
    }
    return message;
  }

  reset() {
    this.cancelActiveSystemSearch();
    this.store.getState().reset();
  }
}

async function createMatchDraftRequest(payload: {
  mode: "free" | "precision";
  solarSystemId: number;
  targetNodeIds: string[];
  sponsorshipFee: number;
  maxTeams: number;
  teamSize: number;
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

async function searchSolarSystems(query: string, signal?: AbortSignal): Promise<{ hits: SearchHit[] }> {
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
    cache: "no-store",
    signal
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

async function publishMatchRequest(payload: {
  matchId: string;
  publishTxDigest: string;
  walletAddress: string;
  idempotencyKey: string;
}) {
  const signed = buildSignedPayload("FuelFrogPanic:publish-match", payload.matchId, payload.walletAddress);
  const response = await fetch(`/api/matches/${payload.matchId}/publish`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Idempotency-Key": payload.idempotencyKey || crypto.randomUUID()
    },
    body: JSON.stringify({
      ...payload,
      ...signed
    })
  });
  return response.json();
}

const createMatchService = new CreateMatchService();

export { createMatchDraftRequest as createMatchDraft, createMatchService, publishMatchRequest as publishMatch };
