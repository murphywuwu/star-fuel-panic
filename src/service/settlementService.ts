import { settlementStore, type SettlementStore } from "@/model/settlementStore";
import { matchRuntimeStore } from "@/model/matchRuntimeStore";
import type { TeamRole } from "@/types/fuelMission";
import {
  getTeamPayoutRatios,
  type MemberPayout,
  type MvpInfo,
  type PlayerRole,
  type SettlementBill,
  type SettlementState,
  type SettlementStatus,
  type TeamPayout
} from "@/types/settlement";

const EDGE_BILL_ENDPOINTS = [
  "/functions/v1/get-settlement-bill",
  "/functions/v1/settlement-bill"
];

const PLATFORM_FEE_RATE = 0.05 as const;

class SettlementServiceImpl {
  subscribe(listener: () => void): () => void {
    return settlementStore.subscribe(listener);
  }

  getSnapshot(): SettlementStore {
    return settlementStore.getState();
  }

  async getSettlementBill(matchId: string): Promise<SettlementBill> {
    const normalized = matchId.trim();
    if (!normalized) {
      throw new Error("INVALID_MATCH_ID");
    }

    const apiBill = await this.tryFetchFromApi(normalized);
    if (apiBill) {
      return apiBill;
    }

    const edgeBill = await this.tryFetchFromEdge(normalized);
    if (edgeBill) {
      return edgeBill;
    }

    return this.buildLocalSettlementBill(normalized);
  }

  async fetchSettlementBill(matchId: string): Promise<SettlementBill> {
    return this.getSettlementBill(matchId);
  }

  async getSettlementStatus(matchId: string): Promise<SettlementStatus> {
    const normalized = matchId.trim();
    if (!normalized) {
      throw new Error("INVALID_MATCH_ID");
    }

    const apiStatus = await this.tryFetchStatusFromApi(normalized);
    if (apiStatus) {
      return apiStatus;
    }

    return this.buildLocalSettlementStatus(normalized);
  }

  private async tryFetchFromApi(matchId: string): Promise<SettlementBill | null> {
    try {
      const response = await fetch(this.getApiBillEndpoint(matchId), {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store"
      });
      if (!response.ok) {
        return null;
      }

      const data = (await response.json()) as unknown;
      return this.parseBillFromPayload(data);
    } catch {
      return null;
    }
  }

  private async tryFetchFromEdge(matchId: string): Promise<SettlementBill | null> {
    for (const endpoint of EDGE_BILL_ENDPOINTS) {
      const url = `${endpoint}?matchId=${encodeURIComponent(matchId)}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store"
        });
        if (!response.ok) {
          continue;
        }

        const data = (await response.json()) as unknown;
        const parsed = this.parseBillFromPayload(data);
        if (parsed) {
          return parsed;
        }
      } catch {
        continue;
      }
    }

    return null;
  }

  private async tryFetchStatusFromApi(matchId: string): Promise<SettlementStatus | null> {
    try {
      const response = await fetch(this.getApiStatusEndpoint(matchId), {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store"
      });
      if (!response.ok) {
        return null;
      }

      const data = (await response.json()) as unknown;
      return this.parseStatusFromPayload(data);
    } catch {
      return null;
    }
  }

  private getApiBillEndpoint(matchId: string): string {
    return `/api/matches/${encodeURIComponent(matchId)}/result`;
  }

  private getApiStatusEndpoint(matchId: string): string {
    return `/api/matches/${encodeURIComponent(matchId)}/settlement`;
  }

  private parseBillFromPayload(payload: unknown): SettlementBill | null {
    if (!payload || typeof payload !== "object") {
      return null;
    }

    const asObject = payload as Record<string, unknown>;
    const candidate = (asObject.bill ?? asObject) as Record<string, unknown>;
    return this.normalizeBillCandidate(candidate);
  }

  private parseStatusFromPayload(payload: unknown): SettlementStatus | null {
    if (!payload || typeof payload !== "object") {
      return null;
    }

    const asObject = payload as Record<string, unknown>;
    const candidate = (asObject.status ?? asObject) as Record<string, unknown>;
    if (!candidate || typeof candidate !== "object" || typeof candidate.matchId !== "string") {
      return null;
    }

    const status = this.toSettlementState(candidate.status);
    if (!status) {
      return null;
    }

    return {
      matchId: candidate.matchId,
      status,
      progress: this.toNumber(candidate.progress, status === "succeeded" ? 100 : status === "running" ? 75 : 0),
      payoutTxDigest: this.toNullableString(candidate.payoutTxDigest ?? candidate.settlementTx),
      updatedAt: this.toString(candidate.updatedAt) ?? new Date().toISOString()
    };
  }

  private normalizeBillCandidate(candidate: Record<string, unknown> | null | undefined): SettlementBill | null {
    if (!candidate || typeof candidate.matchId !== "string" || !Array.isArray(candidate.teamBreakdown)) {
      return null;
    }

    const teamBreakdown = candidate.teamBreakdown
      .map((item) => this.normalizeTeamPayout(item))
      .filter((item): item is TeamPayout => item !== null);

    const grossPoolNumber = this.toNumber(candidate.grossPool);
    const grossPool = this.toMoneyString(grossPoolNumber);
    const platformFee = this.toMoneyString(
      candidate.platformFee ?? this.calculatePlatformFee(grossPoolNumber)
    );
    const payoutPool = this.toMoneyString(candidate.payoutPool ?? grossPoolNumber - this.toNumber(platformFee));

    let sponsorshipFee = this.toMoneyString(candidate.sponsorshipFee);
    const entryFeeTotal = this.toMoneyString(candidate.entryFeeTotal);
    const platformSubsidy = this.toMoneyString(candidate.platformSubsidy);
    if (
      candidate.sponsorshipFee == null &&
      candidate.entryFeeTotal == null &&
      candidate.platformSubsidy == null
    ) {
      sponsorshipFee = grossPool;
    }

    return {
      matchId: candidate.matchId,
      sponsorshipFee,
      entryFeeTotal,
      platformSubsidy,
      grossPool,
      platformFeeRate: PLATFORM_FEE_RATE,
      platformFee,
      payoutPool,
      payoutTxDigest: this.toNullableString(candidate.payoutTxDigest ?? candidate.settlementTx),
      teamBreakdown,
      mvp: this.normalizeMvp(candidate.mvp, teamBreakdown)
    };
  }

  private normalizeTeamPayout(payload: unknown): TeamPayout | null {
    if (!payload || typeof payload !== "object") {
      return null;
    }

    const candidate = payload as Record<string, unknown>;
    if (typeof candidate.teamId !== "string" || typeof candidate.teamName !== "string") {
      return null;
    }

    const members = Array.isArray(candidate.members)
      ? candidate.members
          .map((item) => this.normalizeMemberPayout(item))
          .filter((item): item is MemberPayout => item !== null)
      : [];

    return {
      teamId: candidate.teamId,
      teamName: candidate.teamName,
      rank: Math.max(1, Math.floor(this.toNumber(candidate.rank, 1))),
      totalScore: this.toNumber(candidate.totalScore),
      prizeRatio: this.toNumber(candidate.prizeRatio),
      prizeAmount: this.toMoneyString(candidate.prizeAmount),
      members
    };
  }

  private normalizeMemberPayout(payload: unknown): MemberPayout | null {
    if (!payload || typeof payload !== "object") {
      return null;
    }

    const candidate = payload as Record<string, unknown>;
    if (typeof candidate.walletAddress !== "string") {
      return null;
    }

    return {
      walletAddress: candidate.walletAddress,
      role: this.normalizeRole(candidate.role),
      personalScore: this.toNumber(candidate.personalScore),
      contributionRatio: this.toNumber(candidate.contributionRatio),
      prizeAmount: this.toMoneyString(candidate.prizeAmount)
    };
  }

  private normalizeMvp(payload: unknown, teamBreakdown: TeamPayout[]): MvpInfo | null {
    if (payload && typeof payload === "object") {
      const candidate = payload as Record<string, unknown>;
      const walletAddress = this.toString(candidate.walletAddress);
      if (walletAddress) {
        const teamId =
          this.toString(candidate.teamId) ??
          teamBreakdown.find((team) => team.members.some((member) => member.walletAddress === walletAddress))?.teamId;
        if (teamId) {
          return {
            walletAddress,
            teamId,
            role: this.normalizeRole(candidate.role),
            score: this.toNumber(candidate.score ?? candidate.totalScore)
          };
        }
      }
    }

    const fallback = [...teamBreakdown]
      .flatMap((team) => team.members.map((member) => ({ teamId: team.teamId, member })))
      .sort((left, right) => {
        if (right.member.personalScore !== left.member.personalScore) {
          return right.member.personalScore - left.member.personalScore;
        }
        return left.member.walletAddress.localeCompare(right.member.walletAddress);
      })[0];

    if (!fallback) {
      return null;
    }

    return {
      walletAddress: fallback.member.walletAddress,
      teamId: fallback.teamId,
      role: fallback.member.role,
      score: fallback.member.personalScore
    };
  }

  private buildLocalSettlementBill(matchId: string): SettlementBill {
    const state = matchRuntimeStore.getState();
    const contributionMap = new Map(state.contributions.map((item) => [item.playerId, item.score]));
    const roleMapByTeam = state.teams.map((team) => {
      const roleMap = new Map<string, PlayerRole>();
      for (const [role, playerId] of Object.entries(team.roles)) {
        if (playerId) {
          roleMap.set(playerId, this.toPlayerRole(role as TeamRole));
        }
      }
      return { teamId: team.teamId, roleMap };
    });

    const entryFeeTotal = this.round2(state.funding.playerCount * state.funding.entryFeeLux);
    const sponsorshipFee = this.round2(state.funding.hostSeedPool + state.funding.sponsorPool);
    const platformSubsidy = this.round2(state.funding.platformSubsidyPool);
    const grossPool = this.round2(entryFeeTotal + sponsorshipFee + platformSubsidy);
    const platformFee = this.calculatePlatformFee(grossPool);
    const payoutPool = this.round2(grossPool - platformFee);

    const teamMetrics = state.teams.map((team) => {
      const teamMemberScore = team.players.reduce(
        (sum, player) => sum + (contributionMap.get(player.playerId) ?? 0),
        0
      );
      const teamTotalScore = state.teamScore[team.teamId] ?? teamMemberScore;
      return {
        team,
        teamTotalScore: Math.max(teamTotalScore, teamMemberScore)
      };
    });

    const rankedTeams = [...teamMetrics].sort((left, right) => {
      if (right.teamTotalScore !== left.teamTotalScore) {
        return right.teamTotalScore - left.teamTotalScore;
      }
      return left.team.teamId.localeCompare(right.team.teamId);
    });

    const ratios = getTeamPayoutRatios(rankedTeams.length);
    const teamPrizeAmounts = this.allocateByRatio(payoutPool, ratios, rankedTeams.length);

    const teamBreakdown: TeamPayout[] = rankedTeams.map((entry, index) => {
      const roleMap = roleMapByTeam.find((item) => item.teamId === entry.team.teamId)?.roleMap;
      const memberPayload = entry.team.players.map((player) => ({
        walletAddress: player.playerId,
        role: roleMap?.get(player.playerId) ?? "dispatcher",
        personalScore: contributionMap.get(player.playerId) ?? 0
      }));

      return {
        teamId: entry.team.teamId,
        teamName: entry.team.name,
        rank: index + 1,
        totalScore: entry.teamTotalScore,
        prizeRatio: ratios[index] ?? 0,
        prizeAmount: this.toMoneyString(teamPrizeAmounts[index] ?? 0),
        members: this.buildMemberPayouts(teamPrizeAmounts[index] ?? 0, memberPayload)
      };
    });

    const mvp = this.normalizeMvp(null, teamBreakdown);

    return {
      matchId,
      sponsorshipFee: this.toMoneyString(sponsorshipFee),
      entryFeeTotal: this.toMoneyString(entryFeeTotal),
      platformSubsidy: this.toMoneyString(platformSubsidy),
      grossPool: this.toMoneyString(grossPool),
      platformFeeRate: PLATFORM_FEE_RATE,
      platformFee: this.toMoneyString(platformFee),
      payoutPool: this.toMoneyString(payoutPool),
      payoutTxDigest: state.settlement.settlementId ?? null,
      teamBreakdown,
      mvp
    };
  }

  private buildLocalSettlementStatus(matchId: string): SettlementStatus {
    const state = matchRuntimeStore.getState();
    const updatedAt = new Date().toISOString();

    if (state.status === "settled" || state.phase === "settled" || state.phase === "Settled") {
      return {
        matchId,
        status: "succeeded",
        progress: 100,
        payoutTxDigest: state.settlement.settlementId ?? null,
        updatedAt
      };
    }

    if (state.status === "settling" || state.phase === "settling") {
      return {
        matchId,
        status: "running",
        progress: 75,
        payoutTxDigest: null,
        updatedAt
      };
    }

    return {
      matchId,
      status: "pending",
      progress: 0,
      payoutTxDigest: null,
      updatedAt
    };
  }

  private buildMemberPayouts(
    teamPrize: number,
    members: Array<{ walletAddress: string; role: PlayerRole; personalScore: number }>
  ): MemberPayout[] {
    const totalScore = members.reduce((sum, member) => sum + member.personalScore, 0);
    if (totalScore <= 0) {
      return members.map((member) => ({
        walletAddress: member.walletAddress,
        role: member.role,
        personalScore: member.personalScore,
        contributionRatio: 0,
        prizeAmount: this.toMoneyString(0)
      }));
    }

    const payouts: MemberPayout[] = [];
    let allocated = 0;

    for (let index = 0; index < members.length; index += 1) {
      const member = members[index];
      const contributionRatio = member.personalScore <= 0 ? 0 : member.personalScore / totalScore;
      const isLast = index === members.length - 1;
      const prizeAmount =
        member.personalScore <= 0
          ? 0
          : isLast
            ? this.round2(teamPrize - allocated)
            : this.round2(teamPrize * contributionRatio);

      const safePrizeAmount = Math.max(0, prizeAmount);

      payouts.push({
        walletAddress: member.walletAddress,
        role: member.role,
        personalScore: member.personalScore,
        contributionRatio: this.round2(contributionRatio),
        prizeAmount: this.toMoneyString(safePrizeAmount)
      });

      allocated = this.round2(allocated + safePrizeAmount);
    }

    return payouts;
  }

  private allocateByRatio(total: number, ratios: number[], length: number): number[] {
    const payouts = new Array<number>(length).fill(0);
    const payoutIndexes: number[] = [];

    for (let index = 0; index < length; index += 1) {
      if ((ratios[index] ?? 0) > 0) {
        payoutIndexes.push(index);
      }
    }

    let allocated = 0;
    for (let index = 0; index < payoutIndexes.length; index += 1) {
      const payoutIndex = payoutIndexes[index];
      const ratio = ratios[payoutIndex] ?? 0;
      const isLast = index === payoutIndexes.length - 1;
      const amount = isLast ? this.round2(total - allocated) : this.round2(total * ratio);
      payouts[payoutIndex] = Math.max(0, amount);
      allocated = this.round2(allocated + payouts[payoutIndex]);
    }

    return payouts;
  }

  private normalizeRole(role: unknown): PlayerRole {
    if (role === "collector" || role === "hauler" || role === "escort" || role === "dispatcher") {
      return role;
    }
    return "dispatcher";
  }

  private toSettlementState(value: unknown): SettlementState | null {
    if (value === "pending" || value === "running" || value === "succeeded" || value === "failed") {
      return value;
    }
    if (value === "settling") {
      return "running";
    }
    if (value === "settled") {
      return "succeeded";
    }
    return null;
  }

  private toPlayerRole(role: TeamRole | undefined): PlayerRole {
    if (role === "Collector") return "collector";
    if (role === "Hauler") return "hauler";
    if (role === "Escort") return "escort";
    return "dispatcher";
  }

  private calculatePlatformFee(grossPool: number): number {
    return Math.floor(grossPool * PLATFORM_FEE_RATE);
  }

  private toMoneyString(value: unknown): string {
    return this.round2(this.toNumber(value)).toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
  }

  private toNumber(value: unknown, fallback = 0): number {
    const parsed = typeof value === "string" ? Number(value) : Number(value ?? fallback);
    if (!Number.isFinite(parsed)) {
      return fallback;
    }
    return parsed;
  }

  private toString(value: unknown): string | null {
    return typeof value === "string" && value.trim() ? value : null;
  }

  private toNullableString(value: unknown): string | null {
    const resolved = this.toString(value);
    return resolved ?? null;
  }

  private round2(value: number): number {
    return Number(value.toFixed(2));
  }
}

export const settlementService = new SettlementServiceImpl();

export type SettlementService = SettlementServiceImpl;
