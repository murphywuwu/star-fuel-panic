import { teamDossierStore, type TeamDossierStore } from "@/model/teamDossierStore";
import type { ControllerResult } from "@/types/common";
import type { PlayerTeamDossier } from "@/types/player";

type ApiErrorPayload = {
  ok?: false;
  error?: {
    code?: string;
    message?: string;
  };
};

class TeamDossierServiceError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "TeamDossierServiceError";
    this.code = code;
  }
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

function normalizeAddress(address: string | null | undefined) {
  return address?.trim().toLowerCase() ?? "";
}

async function parseJson<T>(response: Response): Promise<T> {
  const body = (await response.json()) as T | ApiErrorPayload;
  const failed =
    !response.ok ||
    (typeof body === "object" && body !== null && "ok" in body && body.ok === false);

  if (failed) {
    const code =
      typeof body === "object" && body !== null && "error" in body
        ? body.error?.code ?? "UNKNOWN"
        : "UNKNOWN";
    const message =
      typeof body === "object" && body !== null && "error" in body
        ? body.error?.message ?? "Request failed"
        : "Request failed";
    throw new TeamDossierServiceError(code, message);
  }

  return body as T;
}

class TeamDossierService {
  private activeLoadRequest: Promise<ControllerResult<{ address: string }>> | null = null;
  private activeLoadAddress: string | null = null;

  private get store(): typeof teamDossierStore {
    return teamDossierStore;
  }

  subscribe = (listener: () => void): (() => void) => this.store.subscribe(listener);

  getSnapshot = (): TeamDossierStore => this.store.getState();

  clear() {
    this.store.getState().reset();
  }

  async load(walletAddress: string): Promise<ControllerResult<{ address: string }>> {
    const normalizedAddress = normalizeAddress(walletAddress);
    if (!normalizedAddress) {
      this.clear();
      return fail("Wallet address is required", "INVALID_INPUT");
    }

    if (this.activeLoadRequest && this.activeLoadAddress === normalizedAddress) {
      return this.activeLoadRequest;
    }

    this.store.getState().setLoading(true);
    this.store.getState().setError(null);
    this.store.getState().setLoadedAddress(normalizedAddress);

    let request: Promise<ControllerResult<{ address: string }>>;
    request = this.fetchDossier(normalizedAddress)
      .then((dossier) => {
        this.store.getState().setDossier(dossier);
        return ok("TEAM_DOSSIER_LOADED", { address: normalizedAddress });
      })
      .catch((error) => {
        const result = this.toControllerError(error);
        this.store.getState().setError(result.message);
        this.store.getState().setDossier(null);
        return result;
      })
      .finally(() => {
        this.store.getState().setLoading(false);
        if (this.activeLoadRequest === request) {
          this.activeLoadRequest = null;
          this.activeLoadAddress = null;
        }
      });

    this.activeLoadRequest = request;
    this.activeLoadAddress = normalizedAddress;
    return request;
  }

  private async fetchDossier(walletAddress: string): Promise<PlayerTeamDossier> {
    return parseJson<PlayerTeamDossier>(
      await fetch(`/api/players/${encodeURIComponent(walletAddress)}/team-dossier`, {
        method: "GET",
        headers: {
          Accept: "application/json"
        },
        cache: "no-store"
      })
    );
  }

  private toControllerError(error: unknown): ControllerResult<never> {
    if (error instanceof TeamDossierServiceError) {
      return fail(error.message, error.code);
    }

    return fail(error instanceof Error ? error.message : "Failed to load team dossier");
  }
}

export const teamDossierService = new TeamDossierService();
