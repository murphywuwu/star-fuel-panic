import { getServerSuiClient } from "@/server/suiClient";
import { normalizeStructTag } from "@mysten/sui/utils";
import { toBaseUnits } from "@/utils/tokenAmount";

export type ChainMode = "mock" | "verify" | "strict";

type ExpectedTransfer = {
  coinType?: string;
  recipient?: string;
  sender?: string;
  exactAmountBaseUnits?: bigint;
};

type VerificationResult =
  | {
      ok: true;
      mode: ChainMode;
      txDigest: string;
      verified: boolean;
    }
  | {
      ok: false;
      mode: ChainMode;
      code: "TX_REJECTED" | "CHAIN_SYNC_ERROR";
      message: string;
    };

export type MatchPublishedCommitment = {
  txDigest: string;
  roomId: string;
  escrowId: string | null;
  mode: "free" | "precision" | null;
  solarSystemId: number | null;
  targetNodeCount: number | null;
};

export type TeamEntryLockedCommitment = {
  txDigest: string;
  roomId: string;
  escrowId: string;
  teamRef: string;
  captain: string;
  memberCount: number;
  quotedAmountLux: number;
  lockedAmountBaseUnits: number;
};

const TX_DIGEST_PATTERN = /^(0x[a-f0-9]{16,}|[1-9A-HJ-NP-Za-km-z]{20,}|tx_[A-Za-z0-9_-]{4,}|local_[A-Za-z0-9]{10,})$/;

function getLuxCoinType() {
  return process.env.NEXT_PUBLIC_LUX_COIN_TYPE?.trim() || "0x2::sui::SUI";
}

function getLuxDecimals() {
  return Number(process.env.NEXT_PUBLIC_LUX_DECIMALS ?? Number.NaN);
}

function parseMatchMode(value: unknown): "free" | "precision" | null {
  if (value === 0 || value === "0") return "free";
  if (value === 1 || value === "1") return "precision";
  return null;
}

function parseInteger(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.floor(value);
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.floor(parsed) : null;
  }

  return null;
}

function parseString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

async function getTransactionBlockWithEvents(digest: string) {
  const client = getServerSuiClient() as {
    getTransactionBlock: (input: {
      digest: string;
      options?: {
        showEffects?: boolean;
        showEvents?: boolean;
        showBalanceChanges?: boolean;
      };
    }) => Promise<unknown>;
  };

  return client.getTransactionBlock({
    digest,
    options: {
      showEffects: true,
      showEvents: true,
      showBalanceChanges: true
    }
  });
}

function normalizeAddress(address: string) {
  return address.trim().toLowerCase();
}

function readBalanceOwnerAddress(owner: unknown): string | null {
  if (!owner || typeof owner !== "object") {
    return null;
  }

  const record = owner as Record<string, unknown>;
  const addressOwner = record.AddressOwner;
  if (typeof addressOwner === "string" && addressOwner.trim()) {
    return normalizeAddress(addressOwner);
  }

  const objectOwner = record.ObjectOwner;
  if (typeof objectOwner === "string" && objectOwner.trim()) {
    return normalizeAddress(objectOwner);
  }

  const consensusOwner = record.ConsensusAddressOwner;
  if (consensusOwner && typeof consensusOwner === "object") {
    const ownerAddress = (consensusOwner as Record<string, unknown>).owner;
    if (typeof ownerAddress === "string" && ownerAddress.trim()) {
      return normalizeAddress(ownerAddress);
    }
  }

  return null;
}

function verifyExpectedTransfer(
  txDigest: string,
  balanceChanges: unknown,
  expectation?: ExpectedTransfer
): VerificationResult {
  if (!expectation) {
    return {
      ok: true,
      mode: resolveChainMode(),
      txDigest,
      verified: true
    };
  }

  const changes = Array.isArray(balanceChanges) ? balanceChanges : [];
  const expectedCoinType = expectation.coinType ? normalizeStructTag(expectation.coinType) : null;
  const expectedRecipient = expectation.recipient ? normalizeAddress(expectation.recipient) : null;
  const expectedSender = expectation.sender ? normalizeAddress(expectation.sender) : null;
  const expectedAmount = expectation.exactAmountBaseUnits ?? null;

  let recipientCredit = 0n;
  let senderDebit = 0n;

  for (const change of changes) {
    if (!change || typeof change !== "object") {
      continue;
    }

    const candidate = change as {
      coinType?: string;
      amount?: string;
      owner?: unknown;
    };

    if (!candidate.coinType || !candidate.amount) {
      continue;
    }

    if (expectedCoinType && normalizeStructTag(candidate.coinType) !== expectedCoinType) {
      continue;
    }

    const ownerAddress = readBalanceOwnerAddress(candidate.owner);
    const amount = BigInt(candidate.amount);
    if (expectedRecipient && ownerAddress === expectedRecipient && amount > 0n) {
      recipientCredit += amount;
    }
    if (expectedSender && ownerAddress === expectedSender && amount < 0n) {
      senderDebit += amount * -1n;
    }
  }

  if (expectedRecipient && recipientCredit === 0n) {
    return {
      ok: false,
      mode: resolveChainMode(),
      code: "TX_REJECTED",
      message: "Transaction did not credit the expected recipient"
    };
  }

  if (expectedRecipient && expectedAmount !== null && recipientCredit !== expectedAmount) {
    return {
      ok: false,
      mode: resolveChainMode(),
      code: "TX_REJECTED",
      message: "Transaction credit amount does not match expected amount"
    };
  }

  if (expectedSender && senderDebit === 0n) {
    return {
      ok: false,
      mode: resolveChainMode(),
      code: "TX_REJECTED",
      message: "Transaction did not debit the expected wallet"
    };
  }

  if (expectedAmount !== null && expectedSender && senderDebit !== expectedAmount) {
    return {
      ok: false,
      mode: resolveChainMode(),
      code: "TX_REJECTED",
      message: "Transaction debit does not match expected amount"
    };
  }

  return {
    ok: true,
    mode: resolveChainMode(),
    txDigest,
    verified: true
  };
}

export function verifyExpectedTransferForTests(
  txDigest: string,
  balanceChanges: unknown,
  expectation?: ExpectedTransfer
) {
  return verifyExpectedTransfer(txDigest, balanceChanges, expectation);
}

export function resolveChainMode(): ChainMode {
  const configured = (process.env.FUEL_FROG_CHAIN_MODE ?? "").trim().toLowerCase();
  if (configured === "mock" || configured === "verify" || configured === "strict") {
    return configured;
  }

  return "verify";
}

export async function verifySubmittedTxDigest(
  txDigest: string,
  options: {
    operation: string;
    expectedTransfer?: ExpectedTransfer;
  }
): Promise<VerificationResult> {
  const mode = resolveChainMode();
  const normalized = txDigest.trim();

  if (!TX_DIGEST_PATTERN.test(normalized)) {
    return {
      ok: false,
      mode,
      code: "TX_REJECTED",
      message: `${options.operation} transaction digest is invalid`
    };
  }

  if (mode === "mock") {
    return {
      ok: true,
      mode,
      txDigest: normalized,
      verified: false
    };
  }

  try {
    const transactionBlock = (await getTransactionBlockWithEvents(normalized)) as {
      balanceChanges?: unknown;
    };

    const transferCheck = verifyExpectedTransfer(normalized, transactionBlock.balanceChanges, options.expectedTransfer);
    if (!transferCheck.ok) {
      return transferCheck;
    }

    return {
      ok: true,
      mode,
      txDigest: normalized,
      verified: true
    };
  } catch (error) {
    return {
      ok: false,
      mode,
      code: "CHAIN_SYNC_ERROR",
      message:
        error instanceof Error
          ? error.message
          : `Unable to verify ${options.operation} transaction on configured chain`
    };
  }
}

export function buildPublishTransferExpectation(sponsorshipFee: number, walletAddress: string): ExpectedTransfer | null {
  if (!walletAddress.trim()) {
    return null;
  }

  return {
    coinType: getLuxCoinType(),
    sender: walletAddress,
    exactAmountBaseUnits: toBaseUnits(sponsorshipFee, getLuxDecimals())
  };
}

export function buildTeamPaymentTransferExpectation(
  entryFeeAmount: number,
  walletAddress: string
): ExpectedTransfer | null {
  if (!walletAddress.trim()) {
    return null;
  }

  return {
    coinType: getLuxCoinType(),
    sender: walletAddress,
    exactAmountBaseUnits: toBaseUnits(entryFeeAmount, getLuxDecimals())
  };
}

export async function readMatchPublishedCommitment(txDigest: string): Promise<MatchPublishedCommitment | null> {
  const normalized = txDigest.trim();
  if (!TX_DIGEST_PATTERN.test(normalized)) {
    return null;
  }

  try {
    const transactionBlock = (await getTransactionBlockWithEvents(normalized)) as {
      events?: Array<{
        type?: string;
        parsedJson?: Record<string, unknown>;
      }>;
    };

    const publishedEvent = transactionBlock.events?.find((candidate) =>
      candidate.type?.endsWith("::fuel_frog_panic::MatchPublished")
    );
    if (!publishedEvent?.parsedJson) {
      return null;
    }

    const roomId = parseString(publishedEvent.parsedJson.room_id);
    if (!roomId) {
      return null;
    }

    const escrowEvent = transactionBlock.events?.find((candidate) => {
      if (!candidate.type?.endsWith("::fuel_frog_panic::SponsorshipLocked") || !candidate.parsedJson) {
        return false;
      }
      return parseString(candidate.parsedJson.room_id) === roomId;
    });

    return {
      txDigest: normalized,
      roomId,
      escrowId: escrowEvent?.parsedJson ? parseString(escrowEvent.parsedJson.escrow_id) : null,
      mode: parseMatchMode(publishedEvent.parsedJson.mode),
      solarSystemId: parseInteger(publishedEvent.parsedJson.solar_system_id),
      targetNodeCount: parseInteger(publishedEvent.parsedJson.target_node_count)
    };
  } catch {
    return null;
  }
}

export async function readTeamEntryLockedCommitment(txDigest: string): Promise<TeamEntryLockedCommitment | null> {
  const normalized = txDigest.trim();
  if (!TX_DIGEST_PATTERN.test(normalized)) {
    return null;
  }

  try {
    const transactionBlock = (await getTransactionBlockWithEvents(normalized)) as {
      events?: Array<{
        type?: string;
        parsedJson?: Record<string, unknown>;
      }>;
    };

    const event = transactionBlock.events?.find((candidate) =>
      candidate.type?.endsWith("::fuel_frog_panic::TeamEntryLocked")
    );
    if (!event?.parsedJson) {
      return null;
    }

    const roomId = parseString(event.parsedJson.room_id);
    const escrowId = parseString(event.parsedJson.escrow_id);
    const teamRef = parseString(event.parsedJson.team_ref);
    const captain = parseString(event.parsedJson.captain);
    const memberCount = parseInteger(event.parsedJson.member_count);
    const quotedAmountLux = parseInteger(event.parsedJson.quoted_amount_lux);
    const lockedAmountBaseUnits = parseInteger(event.parsedJson.locked_amount);

    if (
      !roomId ||
      !escrowId ||
      !teamRef ||
      !captain ||
      memberCount === null ||
      quotedAmountLux === null ||
      lockedAmountBaseUnits === null
    ) {
      return null;
    }

    return {
      txDigest: normalized,
      roomId,
      escrowId,
      teamRef,
      captain,
      memberCount,
      quotedAmountLux,
      lockedAmountBaseUnits
    };
  } catch {
    return null;
  }
}
