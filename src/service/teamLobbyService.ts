import { teamLobbyStore, type TeamLobbyStore } from "@/model/teamLobbyStore";
import type { ControllerResult } from "@/types/common";
import type { Match } from "@/types/match";
import type { JoinTeamResponse, PlayerRole, RoleSlots, TeamDetail } from "@/types/team";

type SignedPayload = {
  walletAddress: string;
  signature: string;
  message: string;
};

type TeamLobbySnapshot = {
  match: Match | null;
  teams: TeamDetail[];
};

type ApiErrorPayload = {
  ok?: false;
  error?: {
    code?: string;
    message?: string;
  };
};

class TeamLobbyServiceError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "TeamLobbyServiceError";
    this.code = code;
  }
}

function normalizeWallet(walletAddress: string) {
  return walletAddress.trim().toLowerCase();
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

// Temporary client-side signing fallback until wallet personal-message signing is wired.
function buildSignedPayload(scope: string, targetId: string, walletAddress: string): SignedPayload {
  const normalized = normalizeWallet(walletAddress);
  const message = `${scope}:${targetId}\nwallet=${normalized}\nts=${new Date().toISOString()}`;
  return {
    walletAddress: normalized,
    signature: `dev:${normalized}:${message}`,
    message
  };
}

async function parseJson<T>(response: Response): Promise<T> {
  const body = (await response.json()) as T | ApiErrorPayload;
  const failure =
    !response.ok ||
    (typeof body === "object" && body !== null && "ok" in body && body.ok === false);

  if (failure) {
    const code =
      typeof body === "object" && body !== null && "error" in body
        ? body.error?.code ?? "UNKNOWN"
        : "UNKNOWN";
    const message =
      typeof body === "object" && body !== null && "error" in body
        ? body.error?.message ?? "Request failed"
        : "Request failed";
    throw new TeamLobbyServiceError(code, message);
  }

  return body as T;
}

function parseMatchSummary(payload: unknown): Match | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as { match?: Match };
  return candidate.match ?? null;
}

function parseTeamItems(payload: unknown): TeamDetail[] {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  const candidate = payload as { items?: TeamDetail[] };
  return Array.isArray(candidate.items) ? candidate.items : [];
}

class TeamLobbyService {
  private activeLoadRequest: Promise<ControllerResult<{ matchId: string }>> | null = null;
  private activeLoadKey: string | null = null;

  private get store(): typeof teamLobbyStore {
    return teamLobbyStore;
  }

  subscribe = (listener: () => void): (() => void) => this.store.subscribe(listener);

  getSnapshot = (): TeamLobbyStore => this.store.getState();

  async resolveMatchId(preferredMatchId?: string | null) {
    const normalized = preferredMatchId?.trim();
    if (normalized) {
      return normalized;
    }

    const response = await parseJson<{ matches?: Match[] }>(
      await fetch("/api/matches?status=lobby&limit=1", {
        method: "GET",
        headers: {
          Accept: "application/json"
        },
        cache: "no-store"
      })
    );

    return response.matches?.[0]?.id ?? null;
  }

  async load(preferredMatchId?: string | null): Promise<ControllerResult<{ matchId: string }>> {
    const requestKey = preferredMatchId?.trim() || "__AUTO__";
    if (this.activeLoadRequest && this.activeLoadKey === requestKey) {
      return this.activeLoadRequest;
    }

    this.store.getState().setLoading(true);
    this.store.getState().setError(null);

    let request: Promise<ControllerResult<{ matchId: string }>>;
    request = this.resolveMatchId(preferredMatchId)
      .then(async (matchId) => {
        if (!matchId) {
          this.store.getState().reset();
          return fail("No lobby match available", "NOT_FOUND");
        }

        const snapshot = await this.fetchSnapshot(matchId);
        this.store.getState().setMatchId(matchId);
        this.store.getState().setMatch(snapshot.match);
        this.store.getState().setTeams(snapshot.teams);
        return ok("TEAM_LOBBY_LOADED", { matchId });
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
          this.activeLoadKey = null;
        }
      });

    this.activeLoadRequest = request;
    this.activeLoadKey = requestKey;
    return request;
  }

  async createTeam(input: {
    matchId: string;
    name: string;
    roleSlots: RoleSlots;
    walletAddress: string;
  }): Promise<ControllerResult<void>> {
    return this.runMutation(async () => {
      const signed = buildSignedPayload("FuelFrogPanic:create-team", input.matchId, input.walletAddress);
      await parseJson<unknown>(
        await fetch("/api/teams", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            matchId: input.matchId,
            name: input.name,
            roleSlots: input.roleSlots,
            ...signed
          })
        })
      );
    }, "TEAM_CREATED", input.matchId);
  }

  async joinTeam(teamId: string, input: { role: PlayerRole; walletAddress: string }): Promise<ControllerResult<JoinTeamResponse>> {
    return this.runMutation(
      async () => {
        const signed = buildSignedPayload("FuelFrogPanic:join-team", teamId, input.walletAddress);
        return parseJson<JoinTeamResponse>(
          await fetch(`/api/teams/${encodeURIComponent(teamId)}/join`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              role: input.role,
              ...signed
            })
          })
        );
      },
      "TEAM_APPLICATION_CREATED"
    );
  }

  async approveJoin(teamId: string, applicationId: string, walletAddress: string): Promise<ControllerResult<void>> {
    return this.runMutation(async () => {
      const signed = buildSignedPayload(
        "FuelFrogPanic:approve-team-application",
        `${teamId}:${applicationId}`,
        walletAddress
      );
      await parseJson<unknown>(
        await fetch(`/api/teams/${encodeURIComponent(teamId)}/applications/${encodeURIComponent(applicationId)}/approve`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(signed)
        })
      );
    }, "TEAM_APPLICATION_APPROVED");
  }

  async rejectJoin(
    teamId: string,
    applicationId: string,
    input: { walletAddress: string; reason?: string }
  ): Promise<ControllerResult<void>> {
    return this.runMutation(async () => {
      const signed = buildSignedPayload(
        "FuelFrogPanic:reject-team-application",
        `${teamId}:${applicationId}`,
        input.walletAddress
      );
      await parseJson<unknown>(
        await fetch(`/api/teams/${encodeURIComponent(teamId)}/applications/${encodeURIComponent(applicationId)}/reject`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...signed,
            reason: input.reason
          })
        })
      );
    }, "TEAM_APPLICATION_REJECTED");
  }

  async leaveTeam(teamId: string, walletAddress: string): Promise<ControllerResult<void>> {
    return this.runMutation(async () => {
      const signed = buildSignedPayload("FuelFrogPanic:leave-team", teamId, walletAddress);
      await parseJson<unknown>(
        await fetch(`/api/teams/${encodeURIComponent(teamId)}/leave`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(signed)
        })
      );
    }, "TEAM_LEFT");
  }

  async lockTeam(teamId: string, walletAddress: string): Promise<ControllerResult<void>> {
    return this.runMutation(async () => {
      const signed = buildSignedPayload("FuelFrogPanic:lock-team", teamId, walletAddress);
      await parseJson<unknown>(
        await fetch(`/api/teams/${encodeURIComponent(teamId)}/lock`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(signed)
        })
      );
    }, "TEAM_LOCKED");
  }

  async payTeam(teamId: string, input: { walletAddress: string; txDigest: string }): Promise<ControllerResult<void>> {
    return this.runMutation(async () => {
      const signed = buildSignedPayload("FuelFrogPanic:pay-team", teamId, input.walletAddress);
      await parseJson<unknown>(
        await fetch(`/api/teams/${encodeURIComponent(teamId)}/pay`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            txDigest: input.txDigest,
            ...signed
          })
        })
      );
    }, "TEAM_PAID");
  }

  async fillSoloTeam(teamId: string, walletAddress: string): Promise<ControllerResult<void>> {
    return this.runMutation(async () => {
      await parseJson<unknown>(
        await fetch(`/api/teams/${encodeURIComponent(teamId)}/solo-fill`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            walletAddress
          })
        })
      );
    }, "SOLO_TEAM_FILLED");
  }

  async seedSoloRival(matchId: string, walletAddress: string): Promise<ControllerResult<void>> {
    return this.runMutation(
      async () => {
        await parseJson<unknown>(
          await fetch(`/api/matches/${encodeURIComponent(matchId)}/solo-seed-rival`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              walletAddress
            })
          })
        );
      },
      "SOLO_RIVAL_SEEDED",
      matchId
    );
  }

  async startSoloMatch(matchId: string, walletAddress: string): Promise<ControllerResult<void>> {
    return this.runMutation(
      async () => {
        await parseJson<unknown>(
          await fetch(`/api/matches/${encodeURIComponent(matchId)}/solo-start`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              walletAddress
            })
          })
        );
      },
      "SOLO_MATCH_STARTED",
      matchId
    );
  }

  async settleSoloMatch(matchId: string, walletAddress: string): Promise<ControllerResult<void>> {
    return this.runMutation(
      async () => {
        await parseJson<unknown>(
          await fetch(`/api/matches/${encodeURIComponent(matchId)}/solo-settle`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              walletAddress
            })
          })
        );
      },
      "SOLO_MATCH_SETTLED",
      matchId
    );
  }

  private async fetchSnapshot(matchId: string): Promise<TeamLobbySnapshot> {
    const [matchPayload, teamsPayload] = await Promise.all([
      parseJson<unknown>(
        await fetch(`/api/matches/${encodeURIComponent(matchId)}`, {
          method: "GET",
          headers: {
            Accept: "application/json"
          },
          cache: "no-store"
        })
      ),
      parseJson<unknown>(
        await fetch(`/api/matches/${encodeURIComponent(matchId)}/teams`, {
          method: "GET",
          headers: {
            Accept: "application/json"
          },
          cache: "no-store"
        })
      )
    ]);

    return {
      match: parseMatchSummary(matchPayload),
      teams: parseTeamItems(teamsPayload)
    };
  }

  private async runMutation<T>(
    callback: () => Promise<T>,
    successMessage: string,
    reloadMatchId?: string | null
  ): Promise<ControllerResult<T>> {
    this.store.getState().setMutating(true);
    this.store.getState().setError(null);

    try {
      const payload = await callback();
      const matchId = reloadMatchId ?? this.store.getState().matchId;
      if (matchId) {
        const snapshot = await this.fetchSnapshot(matchId);
        this.store.getState().setMatch(snapshot.match);
        this.store.getState().setTeams(snapshot.teams);
      }
      return ok(successMessage, payload);
    } catch (error) {
      const result = this.toControllerError(error);
      this.store.getState().setError(result.message);
      return result;
    } finally {
      this.store.getState().setMutating(false);
    }
  }

  private toControllerError(error: unknown) {
    if (error instanceof TeamLobbyServiceError) {
      return fail(error.message, error.code);
    }

    if (error instanceof Error) {
      return fail(error.message);
    }

    return fail("Unknown team lobby error");
  }
}

const teamLobbyService = new TeamLobbyService();

export { TeamLobbyServiceError, teamLobbyService };
