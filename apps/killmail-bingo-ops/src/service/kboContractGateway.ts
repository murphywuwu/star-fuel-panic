import type { ContractMatchSnapshot, DomainError, MatchPhase } from "@/types/killmail";

type ChainPhase = Exclude<MatchPhase, "CardDrafted">;

interface CreateMatchInput {
  host: string;
  entryFeeLux: number;
  players: number;
  platformFeeBps: number;
  hostRevshareBps: number;
}

interface SubmitKillmailInput {
  matchId: string;
  slotId: number;
  killmailId: string;
}

interface SettleMatchInput {
  matchId: string;
  lineBonus: number;
  blackoutBonus: number;
}

interface ClaimSettlementInput {
  matchId: string;
  pilotId: string;
}

interface GatewayMatchState {
  phase: ChainPhase;
  confirmedSlots: number;
  rejectedSlots: number;
  grossPool: number;
  platformFee: number;
  hostFee: number;
  payoutPool: number;
  settlementSequence: number | null;
  settled: boolean;
  claimed: boolean;
  claimedBy: string | null;
  riskPenalized: boolean;
}

export interface KboContractGateway {
  readonly network: "devnet";
  readonly packageId: string;
  readonly moduleName: string;
  createMatch(input: CreateMatchInput): ContractMatchSnapshot;
  startMatch(matchId: string): ContractMatchSnapshot;
  submitKillmail(input: SubmitKillmailInput): ContractMatchSnapshot;
  rejectKillmail(matchId: string): ContractMatchSnapshot;
  openGraceWindow(matchId: string): ContractMatchSnapshot;
  applyRiskPenalty(matchId: string): ContractMatchSnapshot;
  settleMatch(input: SettleMatchInput): ContractMatchSnapshot;
  claimSettlement(input: ClaimSettlementInput): { settlementId: string; payout: number; snapshot: ContractMatchSnapshot };
  getMatchSnapshot(matchId: string): ContractMatchSnapshot;
}

const DEVNET_PACKAGE_ID = "0xf7c77f255d48c31d6fe1d027fd293e7bfce1402c3631755ae9378c38c03fb364";
const MODULE_NAME = "killmail_bingo_ops::kbo_registry";
const MATCH_ID_PREFIX = "kbo-match-";

function asError(code: DomainError["code"], message: string): never {
  throw { code, message } satisfies DomainError;
}

function toMatchId(index: number) {
  return `${MATCH_ID_PREFIX}${index}`;
}

function fromMatchId(matchId: string): number {
  if (!matchId.startsWith(MATCH_ID_PREFIX)) {
    asError("E_INVALID_INPUT", `invalid match id: ${matchId}`);
  }

  const id = Number(matchId.slice(MATCH_ID_PREFIX.length));
  if (!Number.isInteger(id) || id < 0) {
    asError("E_INVALID_INPUT", `invalid match id: ${matchId}`);
  }
  return id;
}

function toSettlementId(sequence: number | null, matchIndex: number) {
  if (sequence === null) {
    return `UNSETTLED-${matchIndex}`;
  }
  return `SET-${sequence}`;
}

function toSnapshot(matchIndex: number, state: GatewayMatchState): ContractMatchSnapshot {
  return {
    matchId: toMatchId(matchIndex),
    phase: state.phase,
    confirmedSlots: state.confirmedSlots,
    rejectedSlots: state.rejectedSlots,
    settlement: {
      settlementId: toSettlementId(state.settlementSequence, matchIndex),
      grossPool: state.grossPool,
      platformFee: state.platformFee,
      hostFee: state.hostFee,
      payoutPool: state.payoutPool
    },
    settled: state.settled,
    claimed: state.claimed,
    claimedBy: state.claimedBy,
    riskPenalized: state.riskPenalized
  };
}

function parseMatch(matches: Map<number, GatewayMatchState>, matchId: string) {
  const matchIndex = fromMatchId(matchId);
  const match = matches.get(matchIndex);
  if (!match) {
    asError("E_MATCH_NOT_FOUND", `match not found: ${matchId}`);
  }
  return { matchIndex, match };
}

function expectPhase(match: GatewayMatchState, phase: ChainPhase) {
  if (match.phase !== phase) {
    asError("E_INVALID_STATE_TRANSITION", `expected ${phase}, got ${match.phase}`);
  }
}

export function createKboContractGateway(): KboContractGateway {
  const matches = new Map<number, GatewayMatchState>();
  const seenKillmails = new Set<string>();

  let nextMatchId = 0;
  let nextSettlementId = 0;

  return {
    network: "devnet",
    packageId: DEVNET_PACKAGE_ID,
    moduleName: MODULE_NAME,
    createMatch(input) {
      if (input.entryFeeLux <= 0) {
        asError("E_INVALID_INPUT", "entryFeeLux must be greater than 0");
      }
      if (input.players <= 0) {
        asError("E_INVALID_INPUT", "players must be greater than 0");
      }
      if (input.platformFeeBps > 1500) {
        asError("E_INVALID_INPUT", "platformFeeBps must be <= 1500");
      }
      if (input.hostRevshareBps > 6000) {
        asError("E_INVALID_INPUT", "hostRevshareBps must be <= 6000");
      }

      const grossPool = input.entryFeeLux * input.players;
      const platformFee = (grossPool * input.platformFeeBps) / 10000;
      const hostFee = (platformFee * input.hostRevshareBps) / 10000;
      const payoutPool = grossPool - platformFee;

      const matchIndex = nextMatchId;
      nextMatchId += 1;

      matches.set(matchIndex, {
        phase: "LobbyReady",
        confirmedSlots: 0,
        rejectedSlots: 0,
        grossPool,
        platformFee,
        hostFee,
        payoutPool,
        settlementSequence: null,
        settled: false,
        claimed: false,
        claimedBy: null,
        riskPenalized: false
      });

      return toSnapshot(matchIndex, matches.get(matchIndex)!);
    },
    startMatch(matchId) {
      const { matchIndex, match } = parseMatch(matches, matchId);
      expectPhase(match, "LobbyReady");
      match.phase = "MatchRunning";
      return toSnapshot(matchIndex, match);
    },
    submitKillmail(input) {
      if (!input.killmailId.trim()) {
        asError("E_INVALID_INPUT", "killmailId is required");
      }

      if (input.slotId < 1 || input.slotId > 9) {
        asError("E_INVALID_INPUT", "slotId must be in [1, 9]");
      }

      if (seenKillmails.has(input.killmailId)) {
        asError("E_DUPLICATE_KILLMAIL", `killmail already submitted: ${input.killmailId}`);
      }

      const { matchIndex, match } = parseMatch(matches, input.matchId);
      expectPhase(match, "MatchRunning");

      seenKillmails.add(input.killmailId);
      match.confirmedSlots += 1;

      return toSnapshot(matchIndex, match);
    },
    rejectKillmail(matchId) {
      const { matchIndex, match } = parseMatch(matches, matchId);
      expectPhase(match, "MatchRunning");
      match.rejectedSlots += 1;
      return toSnapshot(matchIndex, match);
    },
    openGraceWindow(matchId) {
      const { matchIndex, match } = parseMatch(matches, matchId);
      expectPhase(match, "MatchRunning");
      match.phase = "GraceWindow";
      return toSnapshot(matchIndex, match);
    },
    applyRiskPenalty(matchId) {
      const { matchIndex, match } = parseMatch(matches, matchId);
      expectPhase(match, "GraceWindow");
      match.riskPenalized = true;
      return toSnapshot(matchIndex, match);
    },
    settleMatch(input) {
      const { matchIndex, match } = parseMatch(matches, input.matchId);
      expectPhase(match, "GraceWindow");

      if (match.settled) {
        asError("E_SETTLEMENT_REPLAY", `match already settled: ${input.matchId}`);
      }

      const bonus = match.riskPenalized ? 0 : input.lineBonus + input.blackoutBonus;

      match.payoutPool += bonus;
      match.phase = "Settled";
      match.settled = true;
      match.settlementSequence = nextSettlementId;
      nextSettlementId += 1;

      return toSnapshot(matchIndex, match);
    },
    claimSettlement(input) {
      if (!input.pilotId.trim()) {
        asError("E_PERMISSION_DENIED", "pilotId is required");
      }

      const { matchIndex, match } = parseMatch(matches, input.matchId);
      expectPhase(match, "Settled");

      if (match.claimed) {
        asError("E_SETTLEMENT_REPLAY", `settlement already claimed by ${match.claimedBy}`);
      }

      match.claimed = true;
      match.claimedBy = input.pilotId;

      const snapshot = toSnapshot(matchIndex, match);
      return {
        settlementId: snapshot.settlement.settlementId,
        payout: snapshot.settlement.payoutPool,
        snapshot
      };
    },
    getMatchSnapshot(matchId) {
      const { matchIndex, match } = parseMatch(matches, matchId);
      return toSnapshot(matchIndex, match);
    }
  };
}
