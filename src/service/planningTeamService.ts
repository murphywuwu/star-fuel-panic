import { planningTeamStore, type PlanningTeamStore } from "@/model/planningTeamStore";
import type { ControllerResult } from "@/types/common";
import type { PlanningTeam } from "@/types/planningTeam";
import type { PlayerRole, RoleSlots } from "@/types/team";

type ApiEnvelope<T> =
  | {
      ok: true;
      data: T;
      requestId: string;
    }
  | {
      ok: false;
      requestId: string;
      error: {
        code: string;
        message: string;
      };
    };

type PlanningTeamsSnapshot = {
  items: PlanningTeam[];
  totalTeams: number;
};

class PlanningTeamServiceError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "PlanningTeamServiceError";
    this.code = code;
  }
}

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

function createIdempotencyKey() {
  return globalThis.crypto?.randomUUID?.() ?? `planning-team-${Date.now()}`;
}

async function parseJson<T>(response: Response): Promise<T> {
  const body = (await response.json()) as ApiEnvelope<T>;
  if (!response.ok || body.ok === false) {
    throw new PlanningTeamServiceError(
      body.ok === false ? body.error.code : "UNKNOWN",
      body.ok === false ? body.error.message : "Request failed"
    );
  }

  return body.data;
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

class PlanningTeamService {
  private activeLoadRequest: Promise<ControllerResult<PlanningTeamsSnapshot>> | null = null;

  private get store(): typeof planningTeamStore {
    return planningTeamStore;
  }

  subscribe = (listener: () => void): (() => void) => this.store.subscribe(listener);

  getSnapshot = (): PlanningTeamStore => this.store.getState();

  async load(): Promise<ControllerResult<PlanningTeamsSnapshot>> {
    if (this.activeLoadRequest) {
      return this.activeLoadRequest;
    }

    this.store.getState().setLoading(true);
    this.store.getState().setError(null);

    const request = (async () =>
      parseJson<PlanningTeamsSnapshot>(
        await fetch("/api/planning-teams", {
          method: "GET",
          headers: {
            Accept: "application/json"
          },
          cache: "no-store"
        })
      ))()
      .then((snapshot) => {
        this.store.getState().setSnapshot({
          teams: snapshot.items,
          totalTeams: snapshot.totalTeams
        });
        return ok("PLANNING_TEAMS_LOADED", snapshot);
      })
      .catch((error) => {
        const result = this.toControllerError(error);
        this.store.getState().setError(result.message);
        return result;
      })
      .finally(() => {
        this.store.getState().setLoading(false);
        if (this.activeLoadRequest === request) {
          this.activeLoadRequest = null;
        }
      });

    this.activeLoadRequest = request;
    return request;
  }

  async createTeam(input: {
    name: string;
    maxMembers: number;
    roleSlots: RoleSlots;
    walletAddress: string;
  }): Promise<ControllerResult<{ team: PlanningTeam; totalTeams: number }>> {
    this.store.getState().setMutating(true);
    this.store.getState().setError(null);

    try {
      const signed = buildSignedPayload(
        "FuelFrogPanic:create-planning-team",
        "planning-registry",
        input.walletAddress
      );
      const payload = await parseJson<{ team: PlanningTeam; totalTeams: number }>(
        await fetch("/api/planning-teams", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Idempotency-Key": createIdempotencyKey()
          },
          body: JSON.stringify({
            name: input.name,
            maxMembers: input.maxMembers,
            roleSlots: input.roleSlots,
            ...signed
          })
        })
      );

      this.store.getState().upsertTeam(payload.team);
      this.store.getState().setSnapshot({
        teams: this.store.getState().teams,
        totalTeams: payload.totalTeams
      });

      return ok("PLANNING_TEAM_CREATED", payload);
    } catch (error) {
      const result = this.toControllerError(error);
      this.store.getState().setError(result.message);
      return result;
    } finally {
      this.store.getState().setMutating(false);
    }
  }

  async joinTeam(input: {
    teamId: string;
    role: PlayerRole;
    walletAddress: string;
  }): Promise<ControllerResult<{ team: PlanningTeam; totalTeams: number }>> {
    this.store.getState().setMutating(true);
    this.store.getState().setError(null);

    try {
      const signed = buildSignedPayload(
        "FuelFrogPanic:join-planning-team",
        input.teamId,
        input.walletAddress
      );
      const payload = await parseJson<{ team: PlanningTeam; totalTeams: number }>(
        await fetch(`/api/planning-teams/${encodeURIComponent(input.teamId)}/join`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Idempotency-Key": createIdempotencyKey()
          },
          body: JSON.stringify({
            role: input.role,
            ...signed
          })
        })
      );

      this.store.getState().upsertTeam(payload.team);
      this.store.getState().setSnapshot({
        teams: this.store.getState().teams,
        totalTeams: payload.totalTeams
      });

      return ok("PLANNING_TEAM_JOINED", payload);
    } catch (error) {
      const result = this.toControllerError(error);
      this.store.getState().setError(result.message);
      return result;
    } finally {
      this.store.getState().setMutating(false);
    }
  }

  private toControllerError(error: unknown) {
    if (error instanceof PlanningTeamServiceError) {
      return fail(error.message, error.code);
    }

    if (error instanceof Error) {
      return fail(error.message);
    }

    return fail("Unknown planning team error");
  }
}

export const planningTeamService = new PlanningTeamService();
